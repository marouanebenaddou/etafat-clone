// ETAFAT — Immersive presence experience (WebXR, Quest 3). Offline, self-contained.
import * as THREE from "three";
import { VRButton } from "./vendor/VRButton.js";

const DEG = Math.PI / 180;
const TEAL = 0x2ab5b4, TEAL_L = 0x8ee6e4, NAVY = 0x081726, BLUE = 0x00669d;
const GLOBE_R = 0.9;
const GLOBE_POS = new THREE.Vector3(0, 1.5, -2.9);

const scene = new THREE.Scene();
scene.background = new THREE.Color(NAVY);
scene.fog = new THREE.FogExp2(NAVY, 0.03);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.05, 200);
camera.position.set(0, 1.6, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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

// ── lights (mostly unlit materials, but a soft key for depth) ────────────────
scene.add(new THREE.HemisphereLight(0x9fd8ff, 0x0a1e30, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 0.6); key.position.set(2, 4, 1); scene.add(key);

// ── starfield ────────────────────────────────────────────────────────────────
const stars = (() => {
  const N = 2600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const c1 = new THREE.Color(TEAL_L), c2 = new THREE.Color(0xffffff), c3 = new THREE.Color(BLUE);
  for (let i = 0; i < N; i++) {
    const r = 12 + Math.random() * 45, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
    pos[i*3] = r*Math.sin(p)*Math.cos(t); pos[i*3+1] = r*Math.cos(p)*0.6+4; pos[i*3+2] = r*Math.sin(p)*Math.sin(t);
    const c = [c1, c2, c3][Math.floor(Math.random()*3)];
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const m = new THREE.PointsMaterial({ size: 0.13, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(g, m); scene.add(pts); return pts;
})();

// ── floor grid (subtle grounding) ────────────────────────────────────────────
const grid = new THREE.GridHelper(40, 60, TEAL, 0x123047);
grid.material.transparent = true; grid.material.opacity = 0.12; grid.position.y = 0; scene.add(grid);

// ── globe group ───────────────────────────────────────────────────────────────
const globe = new THREE.Group(); globe.position.copy(GLOBE_POS); scene.add(globe);
const spin = new THREE.Group(); globe.add(spin); // spins; markers/arcs ride along

const texLoader = new THREE.TextureLoader();
const earthTex = texLoader.load("./earth.png");
earthTex.colorSpace = THREE.SRGBColorSpace; earthTex.anisotropy = 8;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(GLOBE_R, 96, 96),
  new THREE.MeshBasicMaterial({ map: earthTex })
);
spin.add(sphere);

// atmosphere rim glow (fresnel, additive backside)
const atmo = new THREE.Mesh(
  new THREE.SphereGeometry(GLOBE_R * 1.14, 64, 64),
  new THREE.ShaderMaterial({
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(TEAL) } },
    vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}`,
    fragmentShader: `varying vec3 vN; uniform vec3 uColor; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(uColor, clamp(i,0.0,1.0)*0.9);}`
  })
);
globe.add(atmo);

// lon/lat -> position on sphere (matches equirectangular map on Three SphereGeometry)
function lonLatToVec3(lon, lat, r = GLOBE_R) {
  const phi = (90 - lat) * DEG, theta = (lon + 180) * DEG;
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
}

// glow sprite texture for markers + arc pulses
function glowTexture(hex) {
  const s = 128, c = document.createElement("canvas"); c.width = c.height = s;
  const x = c.getContext("2d"); const g = x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  const col = new THREE.Color(hex);
  const rgb = `${(col.r*255)|0},${(col.g*255)|0},${(col.b*255)|0}`;
  g.addColorStop(0, `rgba(255,255,255,1)`); g.addColorStop(0.25, `rgba(${rgb},1)`);
  g.addColorStop(0.6, `rgba(${rgb},0.35)`); g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0,0,s,s);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const markerTex = glowTexture(TEAL_L);

// ── data-driven markers, arcs, HQ ─────────────────────────────────────────────
const markers = new THREE.Group(); spin.add(markers);
const arcs = new THREE.Group(); spin.add(arcs);
const hitTargets = [];        // invisible meshes for raycasting
let DATA = null, hqVec = null;
const arcAnims = [];          // {line, count, total, delay, pulse, curve}

fetch("./presence-xr.json").then(r => r.json()).then(d => { DATA = d; buildGlobe(d); });

function buildGlobe(d) {
  hqVec = lonLatToVec3(d.hq.lon, d.hq.lat, GLOBE_R);
  // HQ marker (brighter)
  addMarker(d.hq.lon, d.hq.lat, null, 0.16, 0xffffff);
  d.countries.forEach((c, i) => {
    const v = lonLatToVec3(c.lon, c.lat, GLOBE_R);
    addMarker(c.lon, c.lat, c, 0.1, TEAL_L);
    // arc HQ -> country
    if (c.iso !== 504) buildArc(hqVec, v, i);
  });
}

function addMarker(lon, lat, country, size, hex) {
  const v = lonLatToVec3(lon, lat, GLOBE_R);
  const grp = new THREE.Group(); grp.position.copy(v);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, color: hex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  spr.scale.setScalar(size); grp.add(spr);
  markers.add(grp);
  if (country) {
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.copy(v); hit.userData = { country, sprite: spr, baseScale: size };
    markers.add(hit); hitTargets.push(hit);
  }
}

function buildArc(a, b, i) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const lift = 1 + 0.28 + a.distanceTo(b) * 0.28;
  mid.setLength(GLOBE_R * lift);
  const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
  const N = 64, pts = curve.getPoints(N);
  const g = new THREE.BufferGeometry().setFromPoints(pts);
  const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  line.geometry.setDrawRange(0, 0);
  arcs.add(line);
  const pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, color: TEAL_L, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  pulse.scale.setScalar(0.07); pulse.visible = false; arcs.add(pulse);
  arcAnims.push({ line, total: N, count: 0, delay: 800 + i * 90, curve, pulse, t: 0 });
}

// ── project panel (canvas texture) ────────────────────────────────────────────
function makePanel(country) {
  const w = 1024, h = 768, c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "rgba(10,30,48,0.96)"); g.addColorStop(1, "rgba(8,23,38,0.98)");
  x.fillStyle = g; roundRect(x, 0, 0, w, h, 28); x.fill();
  x.strokeStyle = "rgba(42,181,180,0.7)"; x.lineWidth = 4; roundRect(x, 6, 6, w-12, h-12, 24); x.stroke();
  x.fillStyle = "#8ee6e4"; x.font = "600 34px system-ui, sans-serif";
  x.fillText((country.region || "").toUpperCase(), 54, 84);
  x.fillStyle = "#fff"; x.font = "700 68px system-ui, sans-serif";
  x.fillText(country.name, 54, 168);
  x.strokeStyle = "rgba(142,230,228,0.4)"; x.lineWidth = 2; x.beginPath(); x.moveTo(54, 200); x.lineTo(w-54, 200); x.stroke();
  const projs = country.projects || [];
  if (projs.length) {
    x.font = "400 33px system-ui, sans-serif";
    let y = 268;
    projs.slice(0, 8).forEach((p) => {
      x.fillStyle = "#2ab5b4"; x.fillText("●", 54, y);
      x.fillStyle = "#eaf4f8";
      const line = p.place ? `${p.title} — ${p.place}` : p.title;
      wrapText(x, line, 92, y, w - 150, 42, 2); y += 78;
    });
  } else {
    x.fillStyle = "rgba(234,244,248,0.7)"; x.font = "400 34px system-ui, sans-serif";
    wrapText(x, "Présence ETAFAT — projets en cours de référencement.", 54, 280, w - 108, 46, 3);
  }
  x.fillStyle = "rgba(255,255,255,0.5)"; x.font = "400 26px system-ui, sans-serif";
  x.fillText("ETAFAT · présence internationale", 54, h - 44);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.75), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  return mesh;
}
function roundRect(x, X, Y, W, H, r){ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+W,Y,X+W,Y+H,r); x.arcTo(X+W,Y+H,X,Y+H,r); x.arcTo(X,Y+H,X,Y,r); x.arcTo(X,Y,X+W,Y,r); x.closePath(); }
function wrapText(x, text, X, Y, maxW, lh, maxLines){ const words=text.split(" "); let line="", n=0; for(const w of words){ const t=line?line+" "+w:w; if(x.measureText(t).width>maxW && line){ x.fillText(line,X,Y); Y+=lh; line=w; if(++n>=maxLines-1){ /* last line */ } } else line=t; } x.fillText(line,X,Y); }

let panel = null;
function showPanel(country) {
  if (panel) globe.remove(panel);
  panel = makePanel(country);
  panel.position.set(GLOBE_R + 0.95, 0.15, 0.2);
  panel.userData.t = 0; panel.scale.setScalar(0.001);
  globe.add(panel);
}

// ── title / instructions plane ────────────────────────────────────────────────
(function titlePlane(){
  const w=1024,h=256,c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");
  x.fillStyle="#fff";x.font="700 76px system-ui, sans-serif";x.textAlign="center";
  x.fillText("ETAFAT", w/2, 92);
  x.fillStyle="#8ee6e4";x.font="500 40px system-ui, sans-serif";
  x.fillText("Notre présence dans le monde", w/2, 156);
  x.fillStyle="rgba(255,255,255,0.6)";x.font="400 30px system-ui, sans-serif";
  x.fillText("Visez un pays et appuyez sur la gâchette", w/2, 214);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.35),new THREE.MeshBasicMaterial({map:t,transparent:true}));
  m.position.set(GLOBE_POS.x, GLOBE_POS.y + GLOBE_R + 0.62, GLOBE_POS.z);
  scene.add(m);
})();

// ── controllers + raycasting ──────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const tmpM = new THREE.Matrix4();
const controllers = [];
const reticle = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), new THREE.MeshBasicMaterial({ color: TEAL_L }));
reticle.visible = false; scene.add(reticle);

for (let i = 0; i < 2; i++) {
  const ctrl = renderer.xr.getController(i);
  const ray = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-5)]),
    new THREE.LineBasicMaterial({ color: TEAL_L, transparent: true, opacity: 0.6 }));
  ctrl.add(ray);
  ctrl.addEventListener("selectstart", () => onSelect(ctrl));
  scene.add(ctrl); controllers.push(ctrl);
}

function intersectFrom(originObj) {
  tmpM.identity().extractRotation(originObj.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(originObj.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tmpM);
  return raycaster.intersectObjects(hitTargets, false);
}
function onSelect(ctrl) {
  const hits = intersectFrom(ctrl);
  if (hits.length) showPanel(hits[0].object.userData.country);
}

// desktop fallback: drag to spin, click to select
let dragging = false, px = 0, py = 0, moved = 0, manualSpin = 0, tiltY = 0;
renderer.domElement.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; moved = 0; });
renderer.domElement.addEventListener("pointermove", (e) => {
  if (!dragging) return; const dx = e.clientX - px, dy = e.clientY - py; moved += Math.abs(dx)+Math.abs(dy);
  manualSpin += dx * 0.005; tiltY = THREE.MathUtils.clamp(tiltY + dy * 0.005, -0.6, 0.6); px = e.clientX; py = e.clientY;
});
addEventListener("pointerup", (e) => {
  if (dragging && moved < 6 && !renderer.xr.isPresenting) {
    const ndc = new THREE.Vector2((e.clientX/innerWidth)*2-1, -(e.clientY/innerHeight)*2+1);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(hitTargets, false);
    if (hits.length) showPanel(hits[0].object.userData.country);
  }
  dragging = false;
});

// ── animation loop ────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let elapsed = 0, hoveredHit = null, paused = location.search.includes("static");
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
if (location.search.includes("debug")) window.XR = { showPanel, pause: (v) => { paused = v; }, get data() { return DATA; } };

renderer.setAnimationLoop(() => {
  const dt = clock.getDelta(); elapsed += dt; const ms = elapsed * 1000;

  // entrance: globe scales in + atmosphere/particles fade
  const intro = Math.min(1, elapsed / 2.0), ei = easeOut(intro);
  globe.scale.setScalar(ei);
  stars.material.opacity = 0.9 * intro; stars.rotation.y += dt * 0.006;

  // spin (auto + manual)
  spin.rotation.y += (paused ? 0 : dt * 0.05) + manualSpin; manualSpin *= 0.85;
  spin.rotation.x = tiltY;

  // arcs draw-in + travelling pulse
  for (const a of arcAnims) {
    if (ms > a.delay && a.count < a.total) { a.count = Math.min(a.total, a.count + dt * 60); a.line.geometry.setDrawRange(0, Math.floor(a.count)); }
    if (a.count >= a.total) {
      a.pulse.visible = true; a.t = (a.t + dt * 0.35) % 1;
      a.curve.getPoint(a.t, a.pulse.position);
      a.pulse.material.opacity = 0.6 * (1 - Math.abs(a.t - 0.5) * 1.2);
    }
  }

  // marker hover from controllers (VR) — pulse the sprite
  let hit = null;
  if (renderer.xr.isPresenting) {
    for (const ctrl of controllers) { const h = intersectFrom(ctrl); if (h.length) { hit = h[0]; break; } }
    reticle.visible = !!hit; if (hit) reticle.position.copy(hit.point);
  }
  if (hoveredHit && hoveredHit !== (hit && hit.object)) { hoveredHit.userData.sprite.scale.setScalar(hoveredHit.userData.baseScale); }
  if (hit) { const s = hit.object.userData.baseScale * (1.5 + Math.sin(elapsed*6)*0.15); hit.object.userData.sprite.scale.setScalar(s); hoveredHit = hit.object; }
  else hoveredHit = null;

  // marker idle twinkle
  markers.children.forEach((m, i) => { if (m.isGroup && m.children[0]) { const b = m.children[0]; if (!hoveredHit || hoveredHit.userData.sprite !== b) b.material.opacity = 0.75 + Math.sin(elapsed*2 + i)*0.2; } });

  // panel entrance + billboard toward camera
  if (panel) { panel.userData.t = Math.min(1, panel.userData.t + dt * 2.6); panel.scale.setScalar(0.001 + easeOut(panel.userData.t) * 0.999); }

  atmo.material.uniforms.uColor.value.offsetHSL(0, 0, 0); // no-op keep ref
  renderer.render(scene, camera);
});
