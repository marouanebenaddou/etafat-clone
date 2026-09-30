// ETAFAT — Immersive presence experience (WebXR, Quest 3). Offline, self-contained.
import * as THREE from "three";
import { VRButton } from "./vendor/VRButton.js";

const DEG = Math.PI / 180;
const TEAL = 0x2ab5b4, TEAL_L = 0x8ee6e4, NAVY = 0x081726, BLUE = 0x00669d;
const GLOBE_R = 0.72;
const GLOBE_POS = new THREE.Vector3(0, 1.45, -1.7); // close to the viewer
const USER = new THREE.Vector3(0, 1.6, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(NAVY);
scene.fog = new THREE.FogExp2(NAVY, 0.025);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.05, 200);
camera.position.copy(USER);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType("local-floor");
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

scene.add(new THREE.HemisphereLight(0x9fd8ff, 0x0a1e30, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 0.5); key.position.set(2, 4, 1); scene.add(key);

// ── starfield ────────────────────────────────────────────────────────────────
const stars = (() => {
  const N = 2600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const cols = [new THREE.Color(TEAL_L), new THREE.Color(0xffffff), new THREE.Color(BLUE)];
  for (let i = 0; i < N; i++) {
    const r = 14 + Math.random() * 45, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
    pos[i*3] = r*Math.sin(p)*Math.cos(t); pos[i*3+1] = r*Math.cos(p)*0.6+4; pos[i*3+2] = r*Math.sin(p)*Math.sin(t);
    const c = cols[Math.floor(Math.random()*3)]; col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.13, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(pts); return pts;
})();

const grid = new THREE.GridHelper(40, 60, TEAL, 0x123047);
grid.material.transparent = true; grid.material.opacity = 0.12; scene.add(grid);

// ── globe ──────────────────────────────────────────────────────────────────────
const globe = new THREE.Group(); globe.position.copy(GLOBE_POS); scene.add(globe);
const spin = new THREE.Group(); globe.add(spin); // markers + arcs ride along

const texLoader = new THREE.TextureLoader();
const earthTex = texLoader.load("./earth.png"); earthTex.colorSpace = THREE.SRGBColorSpace; earthTex.anisotropy = 8;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R, 96, 96), new THREE.MeshBasicMaterial({ map: earthTex }));
spin.add(sphere);

const atmo = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.14, 64, 64), new THREE.ShaderMaterial({
  transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
  uniforms: { uColor: { value: new THREE.Color(TEAL) } },
  vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}`,
  fragmentShader: `varying vec3 vN; uniform vec3 uColor; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(uColor, clamp(i,0.0,1.0)*0.9);}`
}));
globe.add(atmo);

function lonLatToVec3(lon, lat, r = GLOBE_R) {
  const phi = (90 - lat) * DEG, theta = (lon + 180) * DEG;
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
}
function glowTexture(hex) {
  const s = 128, c = document.createElement("canvas"); c.width = c.height = s;
  const x = c.getContext("2d"); const g = x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  const col = new THREE.Color(hex); const rgb = `${(col.r*255)|0},${(col.g*255)|0},${(col.b*255)|0}`;
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.25, `rgba(${rgb},1)`);
  g.addColorStop(0.6, `rgba(${rgb},0.35)`); g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0,0,s,s);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const markerTex = glowTexture(TEAL_L);

const markers = new THREE.Group(); spin.add(markers);
const arcs = new THREE.Group(); spin.add(arcs);
const hitTargets = []; const arcAnims = [];
let DATA = null, hqVec = null;

fetch("./presence-xr.json").then(r => r.json()).then(d => { DATA = d; buildGlobe(d); });

function buildGlobe(d) {
  hqVec = lonLatToVec3(d.hq.lon, d.hq.lat, GLOBE_R);
  addMarker(d.hq.lon, d.hq.lat, null, 0.13, 0xffffff);
  d.countries.forEach((c, i) => {
    addMarker(c.lon, c.lat, c, 0.085, TEAL_L);
    if (c.iso !== 504) buildArc(hqVec, lonLatToVec3(c.lon, c.lat, GLOBE_R), i);
  });
}
function addMarker(lon, lat, country, size, hex) {
  const v = lonLatToVec3(lon, lat, GLOBE_R);
  const grp = new THREE.Group(); grp.position.copy(v);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, color: hex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  spr.scale.setScalar(size); grp.add(spr); markers.add(grp);
  if (country) {
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.copy(v); hit.userData = { country, sprite: spr, baseScale: size }; markers.add(hit); hitTargets.push(hit);
  }
}
function buildArc(a, b, i) {
  const mid = a.clone().add(b).multiplyScalar(0.5); mid.setLength(GLOBE_R * (1.28 + a.distanceTo(b) * 0.28));
  const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
  const N = 64, g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(N));
  const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  line.geometry.setDrawRange(0, 0); arcs.add(line);
  const pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, color: TEAL_L, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  pulse.scale.setScalar(0.06); pulse.visible = false; arcs.add(pulse);
  arcAnims.push({ line, total: N, count: 0, delay: 700 + i * 80, curve, pulse, t: 0 });
}

// ── canvas panel helpers ────────────────────────────────────────────────────────
function roundRect(x, X, Y, W, H, r){ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+W,Y,X+W,Y+H,r); x.arcTo(X+W,Y+H,X,Y+H,r); x.arcTo(X,Y+H,X,Y,r); x.arcTo(X,Y,X+W,Y,r); x.closePath(); }
function wrap(x, text, X, Y, maxW, lh, maxLines){ const words=String(text).split(" "); let line="", n=1; for(const w of words){ const t=line?line+" "+w:w; if(x.measureText(t).width>maxW && line){ x.fillText(line,X,Y); Y+=lh; line=w; if(++n>maxLines){ x.fillText("…",X,Y); return Y+lh; } } else line=t; } x.fillText(line,X,Y); return Y+lh; }
function panelMesh(canvas, w, h) {
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
}

// theme / apps section tiles arranged around the viewer
const sections = new THREE.Group(); scene.add(sections);
const tileTargets = [];          // section panels the user can aim at to open photos
let gallery = null, galleryKey = null;
fetch("./sections-xr.json").then(r => r.json()).then(buildSections);

function makeThemePanel(t) {
  const W = 820, H = 1040, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0,"rgba(13,39,64,0.96)"); g.addColorStop(1,"rgba(8,23,38,0.98)");
  x.fillStyle = g; roundRect(x,0,0,W,H,30); x.fill();
  x.strokeStyle = t.accent + "cc"; x.lineWidth = 4; roundRect(x,6,6,W-12,H-12,26); x.stroke();
  // accent bar
  x.fillStyle = t.accent; roundRect(x,44,44,120,10,5); x.fill();
  x.fillStyle = "#fff"; x.font = "700 44px system-ui, sans-serif";
  let y = wrap(x, t.label, 44, 120, W-88, 52, 2);
  x.fillStyle = t.accent; x.font = "500 27px system-ui, sans-serif";
  y = wrap(x, t.tagline, 44, y + 6, W-88, 34, 2) + 10;
  x.strokeStyle = "rgba(142,230,228,0.25)"; x.lineWidth = 2; x.beginPath(); x.moveTo(44,y); x.lineTo(W-44,y); x.stroke(); y += 44;
  x.font = "400 26px system-ui, sans-serif";
  for (const p of t.projects) {
    x.fillStyle = t.accent; x.fillText("▸", 44, y);
    x.fillStyle = "#e7f3f7"; y = wrap(x, p, 82, y, W-130, 33, 2) + 10;
    if (y > H - 40) break;
  }
  return panelMesh(c, 1.18, 1.5);
}
function makeAppsPanel(a) {
  const W = 820, H = 620, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0,"rgba(0,102,157,0.28)"); g.addColorStop(1,"rgba(8,23,38,0.98)");
  x.fillStyle = g; roundRect(x,0,0,W,H,30); x.fill();
  x.strokeStyle = "#2ab5b4cc"; x.lineWidth = 4; roundRect(x,6,6,W-12,H-12,26); x.stroke();
  x.fillStyle = "#8ee6e4"; x.font = "600 26px system-ui, sans-serif"; x.fillText("APPLICATIONS TERRAIN", 44, 74);
  x.fillStyle = "#fff"; x.font = "700 46px system-ui, sans-serif"; x.fillText("PROCASEF · PRESFOR · SRM", 44, 132);
  let y = 190;
  for (const it of a.items) {
    x.fillStyle = "#2ab5b4"; x.font = "700 32px system-ui, sans-serif"; x.fillText(it.name, 44, y);
    x.fillStyle = "#dceef4"; x.font = "400 25px system-ui, sans-serif"; y = wrap(x, it.tagline, 44, y + 38, W-88, 32, 2) + 26;
  }
  return panelMesh(c, 1.18, 0.9);
}
function placeAroundUser(mesh, azimuthDeg, y, radius) {
  const a = azimuthDeg * DEG;
  mesh.position.set(USER.x + radius * Math.sin(a), y, USER.z - radius * Math.cos(a));
  mesh.lookAt(USER.x, y, USER.z);
  mesh.userData.floatBase = y; mesh.userData.phase = Math.random() * Math.PI * 2;
  return mesh;
}
function buildSections(data) {
  const az = [-108, -73, -40, 40, 73, 108]; // 3 left, 3 right of the globe
  data.themes.forEach((t, i) => {
    const m = makeThemePanel(t); placeAroundUser(m, az[i], 1.55, 2.75);
    m.userData.section = { label: t.label, photos: t.photos || [] }; tileTargets.push(m); sections.add(m);
  });
  const apps = makeAppsPanel(data.apps); placeAroundUser(apps, 0, 2.42, 2.1);
  apps.userData.section = { label: data.apps.label, photos: data.apps.photos || [] }; tileTargets.push(apps); sections.add(apps);
}

// ── photo gallery: opening a tile floats its project photos in front of it ───────
function makeGalleryHeader(label) {
  const W = 768, H = 108, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  x.fillStyle = "rgba(8,23,38,0.9)"; roundRect(x, 0, 0, W, H, 20); x.fill();
  x.strokeStyle = "#2ab5b4"; x.lineWidth = 4; roundRect(x, 4, 4, W-8, H-8, 17); x.stroke();
  x.fillStyle = "#fff"; x.textAlign = "center"; x.font = "600 40px system-ui, sans-serif";
  x.fillText(label.length > 34 ? label.slice(0, 33) + "…" : label, W/2, 70);
  return panelMesh(c, 0.94, 0.94 * H / W);
}
function disposeGroup(g) { g.traverse((o) => { if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } if (o.geometry) o.geometry.dispose(); }); }
function openGallery(section, panel) {
  if (gallery) { scene.remove(gallery); disposeGroup(gallery); gallery = null; }
  if (galleryKey === section.label) { galleryKey = null; return; } // toggle off
  galleryKey = section.label;
  const photos = (section.photos || []).slice(0, 6);
  if (!photos.length) return;
  const grp = new THREE.Group(); gallery = grp; grp.userData.t = 0; scene.add(grp);
  const p = panel.position.clone();
  const dir = USER.clone().sub(p); dir.y = 0; dir.normalize();               // toward the viewer
  const center = p.clone().addScaledVector(dir, 0.62);
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(up, dir).normalize();
  const pw = 0.44, ph = 0.30, gap = 0.045, rows = Math.ceil(photos.length / 3);
  const header = makeGalleryHeader(section.label);
  header.position.copy(center).addScaledVector(up, (rows * (ph + gap)) / 2 + 0.14);
  header.lookAt(USER); header.userData.baseOp = 1; grp.add(header);
  photos.forEach((src, i) => {
    const row = Math.floor(i / 3), col = i % 3, inRow = Math.min(3, photos.length - row * 3);
    const cx = (col - (inRow - 1) / 2) * (pw + gap), cy = ((rows - 1) / 2 - row) * (ph + gap);
    const pos = center.clone().addScaledVector(right, cx).addScaledVector(up, cy);
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(pw + 0.03, ph + 0.03), new THREE.MeshBasicMaterial({ color: 0x2ab5b4 }));
    frame.position.copy(pos); frame.lookAt(USER); frame.userData.baseOp = 0.9; grp.add(frame);
    const tex = texLoader.load(src); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshBasicMaterial({ map: tex }));
    photo.position.copy(pos).addScaledVector(dir, 0.005); photo.lookAt(USER); photo.userData.baseOp = 1; grp.add(photo);
  });
}

// ── country project panel (from globe selection) ────────────────────────────────
function makeCountryPanel(country) {
  const W = 1024, H = 720, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0,"rgba(10,30,48,0.97)"); g.addColorStop(1,"rgba(8,23,38,0.99)");
  x.fillStyle = g; roundRect(x,0,0,W,H,28); x.fill();
  x.strokeStyle = "rgba(42,181,180,0.75)"; x.lineWidth = 4; roundRect(x,6,6,W-12,H-12,24); x.stroke();
  x.fillStyle = "#8ee6e4"; x.font = "600 32px system-ui, sans-serif"; x.fillText((country.region||"").toUpperCase(), 50, 78);
  x.fillStyle = "#fff"; x.font = "700 62px system-ui, sans-serif"; x.fillText(country.name, 50, 152);
  x.strokeStyle = "rgba(142,230,228,0.35)"; x.lineWidth = 2; x.beginPath(); x.moveTo(50,184); x.lineTo(W-50,184); x.stroke();
  let y = 246; const projs = country.projects || [];
  if (projs.length) { x.font = "400 30px system-ui, sans-serif"; for (const p of projs.slice(0,9)) { x.fillStyle="#2ab5b4"; x.fillText("▸",50,y); x.fillStyle="#eaf4f8"; const line=p.place?`${p.title} — ${p.place}`:p.title; y = wrap(x, line, 88, y, W-140, 38, 2) + 12; } }
  else { x.fillStyle="rgba(234,244,248,0.7)"; x.font="400 32px system-ui, sans-serif"; wrap(x, "Présence ETAFAT — projets en cours de référencement.", 50, 270, W-100, 44, 3); }
  return panelMesh(c, 1.0, 0.7);
}
let cPanel = null;
function showPanel(country) {
  if (cPanel) globe.remove(cPanel);
  cPanel = makeCountryPanel(country);
  cPanel.position.set(GLOBE_R + 0.72, 0.1, 0.15); cPanel.userData.t = 0; cPanel.scale.setScalar(0.001);
  globe.add(cPanel);
}

// title / logo / instructions
(function titlePlane(){
  const W=1024,H=320,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  x.textAlign="center";
  x.fillStyle="#8ee6e4"; x.font="500 40px system-ui, sans-serif"; x.fillText("Notre présence dans le monde", W/2, 228);
  x.fillStyle="rgba(255,255,255,0.62)"; x.font="400 27px system-ui, sans-serif"; x.fillText("Saisissez le globe pour le tourner · visez un pays pour ses projets", W/2, 278);
  const m = panelMesh(c, 1.42, 1.42*H/W); m.position.set(GLOBE_POS.x, GLOBE_POS.y + GLOBE_R + 1.02, GLOBE_POS.z - 0.2); scene.add(m);
  // ETAFAT logo on a soft light chip (the logo's text needs a light backing)
  const img = new Image();
  img.onload = () => {
    const cw=460, ch=168, cx=(W-cw)/2, cy=8;
    x.fillStyle="rgba(255,255,255,0.95)"; roundRect(x, cx, cy, cw, ch, 24); x.fill();
    const pad=24, aw=cw-2*pad, ah=ch-2*pad, r=Math.min(aw/img.width, ah/img.height), dw=img.width*r, dh=img.height*r;
    x.drawImage(img, cx+(cw-dw)/2, cy+(ch-dh)/2, dw, dh);
    m.material.map.needsUpdate = true;
  };
  img.src = "/etafat/logo-footer.png";
})();

// ── controllers ────────────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const tmpM = new THREE.Matrix4();
const controllers = [];
let grabbing = null, lastGrabA = null;
const reticle = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 12), new THREE.MeshBasicMaterial({ color: TEAL_L }));
reticle.visible = false; scene.add(reticle);

for (let i = 0; i < 2; i++) {
  const ctrl = renderer.xr.getController(i);
  const ray = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-5)]),
    new THREE.LineBasicMaterial({ color: TEAL_L, transparent: true, opacity: 0.6 }));
  ctrl.add(ray);
  ctrl.addEventListener("selectstart", () => onSelectStart(ctrl));
  ctrl.addEventListener("selectend", () => { if (grabbing === ctrl) { grabbing = null; lastGrabA = null; } });
  scene.add(ctrl); controllers.push(ctrl);
}
function intersectMarkers(originObj) {
  tmpM.identity().extractRotation(originObj.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(originObj.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tmpM);
  return raycaster.intersectObjects(hitTargets, false);
}
function onSelectStart(ctrl) {
  const hits = intersectMarkers(ctrl);           // sets raycaster.ray for this controller
  if (hits.length) { showPanel(hits[0].object.userData.country); return; }
  const tiles = raycaster.intersectObjects(tileTargets, false);
  if (tiles.length) { openGallery(tiles[0].object.userData.section, tiles[0].object); return; }
  // else: grab-to-spin if pointing at the globe
  const gh = raycaster.intersectObject(sphere, false);
  if (gh.length) { grabbing = ctrl; lastGrabA = null; }
}
function controllerAzimuth(ctrl) {
  const p = new THREE.Vector3().setFromMatrixPosition(ctrl.matrixWorld);
  return Math.atan2(p.x - GLOBE_POS.x, -(p.z - GLOBE_POS.z));
}

// desktop fallback: drag to spin, click to select
let dragging = false, px = 0, py = 0, moved = 0, manualSpin = 0, tiltY = 0;
renderer.domElement.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; moved = 0; });
renderer.domElement.addEventListener("pointermove", (e) => {
  if (!dragging) return; const dx = e.clientX - px, dy = e.clientY - py; moved += Math.abs(dx)+Math.abs(dy);
  manualSpin += dx * 0.005; tiltY = THREE.MathUtils.clamp(tiltY + dy * 0.004, -0.5, 0.5); px = e.clientX; py = e.clientY;
});
addEventListener("pointerup", (e) => {
  if (dragging && moved < 6 && !renderer.xr.isPresenting) {
    const ndc = new THREE.Vector2((e.clientX/innerWidth)*2-1, -(e.clientY/innerHeight)*2+1);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(hitTargets, false);
    if (hits.length) showPanel(hits[0].object.userData.country);
    else { const tiles = raycaster.intersectObjects(tileTargets, false); if (tiles.length) openGallery(tiles[0].object.userData.section, tiles[0].object); }
  }
  dragging = false;
});

// ── loop ────────────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let elapsed = 0, hoveredHit = null;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
if (location.search.includes("debug")) window.XR = { showPanel, openGallery, tileTargets, get data() { return DATA; }, camera, renderer, scene, sections };

renderer.setAnimationLoop(() => {
  const dt = clock.getDelta(); elapsed += dt; const ms = elapsed * 1000;

  const intro = Math.min(1, elapsed / 2.0), ei = easeOut(intro);
  globe.scale.setScalar(ei);
  stars.material.opacity = 0.9 * intro; stars.rotation.y += dt * 0.005;
  sections.children.forEach((m) => { m.position.y = m.userData.floatBase + Math.sin(elapsed*0.6 + m.userData.phase) * 0.015; m.material.opacity = intro; m.material.transparent = true; });

  // spin: NO auto-rotation — only user commands
  let thumb = 0;
  if (renderer.xr.isPresenting) {
    const s = renderer.xr.getSession();
    if (s) for (const src of s.inputSources) { const gp = src.gamepad; if (gp && gp.axes) { const ax = gp.axes[2] ?? gp.axes[0] ?? 0; if (Math.abs(ax) > 0.15) thumb += ax; } }
  }
  if (grabbing) { const a = controllerAzimuth(grabbing); if (lastGrabA !== null) manualSpin += (a - lastGrabA); lastGrabA = a; }
  spin.rotation.y += manualSpin + thumb * dt * 1.5; manualSpin *= 0.86;
  spin.rotation.x = THREE.MathUtils.clamp(spin.rotation.x + (tiltY - spin.rotation.x) * 0.1, -0.6, 0.6);

  for (const a of arcAnims) {
    if (ms > a.delay && a.count < a.total) { a.count = Math.min(a.total, a.count + dt * 60); a.line.geometry.setDrawRange(0, Math.floor(a.count)); }
    if (a.count >= a.total) { a.pulse.visible = true; a.t = (a.t + dt * 0.35) % 1; a.curve.getPoint(a.t, a.pulse.position); a.pulse.material.opacity = 0.6 * (1 - Math.abs(a.t - 0.5) * 1.2); }
  }

  let hit = null;
  if (renderer.xr.isPresenting) {
    for (const ctrl of controllers) { if (grabbing === ctrl) continue; const h = intersectMarkers(ctrl); if (h.length) { hit = h[0]; break; } }
    reticle.visible = !!hit; if (hit) reticle.position.copy(hit.point);
  }
  if (hoveredHit && hoveredHit !== (hit && hit.object)) hoveredHit.userData.sprite.scale.setScalar(hoveredHit.userData.baseScale);
  if (hit) { hit.object.userData.sprite.scale.setScalar(hit.object.userData.baseScale * (1.5 + Math.sin(elapsed*6)*0.15)); hoveredHit = hit.object; } else hoveredHit = null;

  markers.children.forEach((m, i) => { if (m.isGroup && m.children[0]) { const b = m.children[0]; if (!hoveredHit || hoveredHit.userData.sprite !== b) b.material.opacity = 0.75 + Math.sin(elapsed*2 + i)*0.2; } });

  if (cPanel) { cPanel.userData.t = Math.min(1, cPanel.userData.t + dt * 2.6); cPanel.scale.setScalar(0.001 + easeOut(cPanel.userData.t) * 0.999); }

  if (gallery) { gallery.userData.t = Math.min(1, gallery.userData.t + dt * 3); const o = easeOut(gallery.userData.t); gallery.traverse((m) => { if (m.material) { m.material.transparent = true; m.material.opacity = (m.userData.baseOp ?? 1) * o; } }); }

  renderer.render(scene, camera);
});
