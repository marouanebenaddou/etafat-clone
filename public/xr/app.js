// ETAFAT — Immersive presence experience (WebXR, Quest 3). Offline, self-contained.
import * as THREE from "three";
import { VRButton } from "./vendor/VRButton.js";
import { createWorld } from "./world.js";

const DEG = Math.PI / 180;
const TEAL = 0x2ab5b4, TEAL_L = 0x8ee6e4, NAVY = 0x0a1e30, BLUE = 0x00669d; // ETAFAT palette
const GLOBE_R = 0.55;
const GLOBE_POS = new THREE.Vector3(0, 1.8, -1.75); // floats over the valley, which stays visible below
const USER = new THREE.Vector3(0, 1.6, 0);

const scene = new THREE.Scene(); // sky, fog and lights come from world.js

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 30000);
camera.position.copy(USER);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType("local-floor");
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const world = createWorld({ scene, renderer, camera });

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
const tileTargets = [];          // theme panels the user can aim at to open their projects
fetch("./sections-xr.json").then(r => r.json()).then(buildSections);

function makeThemePanel(t) {
  const W = 820, H = 1240, HERO = 342, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0,"rgba(19,49,80,0.96)"); g.addColorStop(1,"rgba(10,30,48,0.98)");
  x.fillStyle = g; roundRect(x,0,0,W,H,30); x.fill();
  x.strokeStyle = t.accent + "cc"; x.lineWidth = 4; roundRect(x,6,6,W-12,H-12,26); x.stroke();
  const TOP = HERO + 34;
  x.fillStyle = t.accent; roundRect(x,44,TOP,120,10,5); x.fill(); // accent bar
  x.fillStyle = "#fff"; x.font = "700 44px system-ui, sans-serif";
  let y = wrap(x, t.label, 44, TOP + 66, W-88, 52, 2);
  x.fillStyle = t.accent; x.font = "500 27px system-ui, sans-serif";
  y = wrap(x, t.tagline, 44, y + 6, W-88, 34, 2) + 10;
  x.strokeStyle = "rgba(142,230,228,0.25)"; x.lineWidth = 2; x.beginPath(); x.moveTo(44,y); x.lineTo(W-44,y); x.stroke(); y += 44;
  x.font = "400 26px system-ui, sans-serif";
  for (const p of t.projects) {
    x.fillStyle = t.accent; x.fillText("▸", 44, y);
    x.fillStyle = "#e7f3f7"; y = wrap(x, p, 82, y, W-130, 33, 2) + 10;
    if (y > H - 36) break;
  }
  const mesh = panelMesh(c, 1.18, 1.18 * H / W);
  // hero thumbnail — the theme's first photo across the top (loads async)
  const src = t.photos && t.photos[0];
  if (src) {
    const img = new Image();
    img.onload = () => {
      x.save();
      roundRect(x, 8, 8, W - 16, HERO, 22); x.clip();
      const r = Math.max((W - 16) / img.width, HERO / img.height), dw = img.width * r, dh = img.height * r;
      x.drawImage(img, 8 + ((W - 16) - dw) / 2, 8 + (HERO - dh) / 2, dw, dh);
      const fade = x.createLinearGradient(0, HERO - 140, 0, HERO + 10);
      fade.addColorStop(0, "rgba(19,49,80,0)"); fade.addColorStop(1, "rgba(19,49,80,1)");
      x.fillStyle = fade; x.fillRect(0, HERO - 140, W, 152);
      x.restore();
      x.fillStyle = t.accent; x.fillRect(30, HERO + 12, W - 60, 3);
      mesh.material.map.needsUpdate = true;
    };
    img.src = src;
  }
  return mesh;
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
  const az = [-128, -98, -68, 68, 98, 128]; // 3 left, 3 right — the front stays open onto the valley
  data.themes.forEach((t, i) => {
    const m = makeThemePanel(t); placeAroundUser(m, az[i], 1.55, 2.75);
    m.userData.theme = t; tileTargets.push(m); sections.add(m);
  });
  // "Applications terrain" tile intentionally omitted in VR (not needed here)
}

// ── theme pop-up: tile → animated project list → project details & photos ─────────
// One group springs out of the tile toward the viewer. Each element has its own entrance
// (delay / slide / scale); rows, thumbnails and buttons react to the pointer (hover lift).
const PX = 0.98 / 1000;                          // pop-up canvas px → metres (cards are 1000 px wide)
const uiTargets = [];                            // interactive pop-up meshes (onClick in userData)
let popup = null, uiHover = null;
const easeBack = (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
const texCache = new Map();
function photoTex(src) {
  if (!texCache.has(src)) texCache.set(src, new Promise((res) => texLoader.load(src, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }, undefined, () => res(null))));
  return texCache.get(src);
}
function coverUV(geo, planeAspect, imgAspect) { // crop-to-fill, like CSS object-fit: cover
  let u0 = 0, u1 = 1, v0 = 0, v1 = 1;
  if (imgAspect > planeAspect) { u0 = (1 - planeAspect / imgAspect) / 2; u1 = 1 - u0; } else { v0 = (1 - imgAspect / planeAspect) / 2; v1 = 1 - v0; }
  const uv = geo.attributes.uv; uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0); uv.needsUpdate = true;
}
function photoMesh(wPx, hPx, src) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(wPx * PX, hPx * PX), new THREE.MeshBasicMaterial({ color: 0x12304a, transparent: true }));
  m.userData.setSrc = (s2) => {
    m.userData.src = s2;
    photoTex(s2).then((t) => {
      if (!t || m.userData.src !== s2) return;
      coverUV(m.geometry, wPx / hPx, t.image.width / t.image.height);
      m.material.map = t; m.material.color.set(0xffffff); m.material.needsUpdate = true;
    });
  };
  if (src) m.userData.setSrc(src);
  return m;
}
function canvasMesh(wPx, hPx, draw, S = 1.5) {
  const c = document.createElement("canvas"); c.width = Math.round(wPx * S); c.height = Math.round(hPx * S);
  const x = c.getContext("2d"), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(wPx * PX, hPx * PX), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  m.userData.ownTex = tex;
  m.userData.redraw = () => { x.setTransform(S, 0, 0, S, 0, 0); x.clearRect(0, 0, wPx, hPx); draw(x, wPx, hPx, m); tex.needsUpdate = true; };
  m.userData.redraw();
  return m;
}
function lines(x, text, maxW, max) { // word-wrap into at most `max` lines (ellipsis on overflow)
  const out = []; let line = "";
  for (const w of String(text).split(" ")) {
    const t = line ? line + " " + w : w;
    if (x.measureText(t).width > maxW && line) { out.push(line); line = w; if (out.length === max) break; } else line = t;
  }
  if (out.length < max) out.push(line); else { let l = out[max - 1]; while (x.measureText(l + "…").width > maxW && l.includes(" ")) l = l.slice(0, l.lastIndexOf(" ")); out[max - 1] = l + "…"; }
  return out;
}
function cardBg(x, W, H, accent) {
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(19,49,80,0.97)"); g.addColorStop(1, "rgba(8,24,40,0.98)");
  x.fillStyle = g; roundRect(x, 0, 0, W, H, 30); x.fill();
  const glow = x.createRadialGradient(W - 120, 60, 10, W - 120, 60, 420); glow.addColorStop(0, "rgba(42,181,180,0.22)"); glow.addColorStop(1, "rgba(42,181,180,0)");
  x.save(); roundRect(x, 0, 0, W, H, 30); x.clip(); x.fillStyle = glow; x.fillRect(0, 0, W, H); x.restore();
  x.strokeStyle = accent + "cc"; x.lineWidth = 4; roundRect(x, 4, 4, W - 8, H - 8, 27); x.stroke();
}
function pill(label, wPx, hPx, onClick) {
  const m = canvasMesh(wPx, hPx, (x, W, H, me) => {
    const hov = me.userData.hover;
    x.fillStyle = hov ? "#2ab5b4" : "rgba(42,181,180,0.14)"; roundRect(x, 1, 1, W - 2, H - 2, H / 2 - 1); x.fill();
    x.strokeStyle = hov ? "#8ee6e4" : "rgba(142,230,228,0.65)"; x.lineWidth = 2; roundRect(x, 1, 1, W - 2, H - 2, H / 2 - 1); x.stroke();
    x.fillStyle = "#fff"; x.font = `600 ${Math.round(H * 0.4)}px system-ui, sans-serif`; x.textAlign = "center"; x.fillText(label, W / 2, H / 2 + H * 0.14); x.textAlign = "start";
  }, 2);
  m.userData.onClick = onClick; return m;
}
// position a mesh by its card-pixel box (origin = card centre; +z toward the viewer) + entrance animation
function place(m, xPx, yPx, wPx, hPx, z, cardH, a = {}) {
  m.position.set((xPx + wPx / 2 - 500) * PX, (cardH / 2 - yPx - hPx / 2) * PX, z);
  m.renderOrder = 10 + Math.round(z * 1000); // explicit layer order: depth-sorting by centre fails on a tall card seen from above
  m.userData.a = { d: 0, dur: 0.34, dx: 0, dy: 0, dz: 0, s0: 1, op: 1, ...a, base: m.position.clone() };
  return m;
}
function setHover(m) {
  if (uiHover === m) return;
  if (uiHover) { uiHover.userData.hover = false; if (uiHover.userData.redraw) uiHover.userData.redraw(); }
  uiHover = m;
  if (m) { m.userData.hover = true; if (m.userData.redraw) m.userData.redraw(); }
  renderer.domElement.style.cursor = m ? "pointer" : "";
}
function disposeView(v) { v.traverse((o) => { if (o.userData.ownTex) o.userData.ownTex.dispose(); if (o.material) o.material.dispose(); if (o.geometry) o.geometry.dispose(); }); } // photo textures stay cached
function setView(build) { // fade the current view out, build the next one in
  for (const v of popup.group.children) { v.userData.leaving = true; v.userData.t = 0; }
  uiTargets.length = 0; setHover(null);
  const v = new THREE.Group(); v.userData.t = 0; build(v); v.children[0].userData.isCard = true; popup.group.add(v);
}
function openThemePopup(tile) {
  const theme = tile.userData.theme; if (!theme) return;
  if (popup && popup.theme === theme && !popup.closing) { closePopup(); return; }
  if (popup) destroyPopup();
  const az = Math.atan2(tile.position.x - USER.x, -(tile.position.z - USER.z)), Y = 1.42, R = 1.9;
  const to = new THREE.Vector3(USER.x + R * Math.sin(az), Y, USER.z - R * Math.cos(az));
  const g = new THREE.Group(); g.position.copy(to); g.lookAt(USER.x, Y, USER.z); g.scale.setScalar(0.001);
  popup = { group: g, theme, from: tile.position.clone(), to, t: 0, closing: false };
  scene.add(g); showList();
}
function closePopup() { if (!popup) return; popup.closing = true; uiTargets.length = 0; setHover(null); }
function destroyPopup() { if (!popup) return; popup.group.children.forEach(disposeView); scene.remove(popup.group); popup = null; uiTargets.length = 0; setHover(null); }
function closeButton(v, cardH) {
  const b = canvasMesh(64, 64, (x, W, H, me) => {
    x.fillStyle = me.userData.hover ? "#2ab5b4" : "rgba(255,255,255,0.1)"; x.beginPath(); x.arc(W / 2, H / 2, W / 2 - 2, 0, Math.PI * 2); x.fill();
    x.strokeStyle = "#fff"; x.lineWidth = 4; x.lineCap = "round"; x.beginPath(); x.moveTo(22, 22); x.lineTo(42, 42); x.moveTo(42, 22); x.lineTo(22, 42); x.stroke();
  }, 2);
  b.userData.onClick = closePopup; uiTargets.push(b);
  v.add(place(b, 910, 24, 64, 64, 0.008, cardH, { d: 0.15, s0: 0.5 }));
}

function showList() {
  const th = popup.theme, items = th.items || [], n = items.length, ROW = 80, GAP = 8, TOP = 172, H = TOP + n * (ROW + GAP) + 58;
  setView((v) => {
    v.add(place(canvasMesh(1000, H, (x, W, H2) => {
      cardBg(x, W, H2, th.accent);
      kicker(x, `${n} projet${n > 1 ? "s" : ""}`, 44, 62, 21, th.accent);
      x.fillStyle = "#fff"; x.font = "700 40px system-ui, sans-serif"; x.fillText(lines(x, th.label, W - 190, 1)[0], 44, 112);
      x.fillStyle = "rgba(220,238,244,0.68)"; x.font = "400 23px system-ui, sans-serif"; x.fillText(lines(x, th.tagline, W - 190, 1)[0], 44, 146);
      x.fillStyle = "rgba(220,238,244,0.5)"; x.font = "400 21px system-ui, sans-serif"; x.textAlign = "center";
      x.fillText("Pointez un projet pour voir ses détails et ses photos", W / 2, H2 - 22); x.textAlign = "start";
    }, 1), 0, 0, 1000, H, 0, H, { dur: 0.22 }));
    closeButton(v, H);
    items.forEach((p, i) => {
      const row = canvasMesh(920, ROW, (x, W, RH, me) => {
        const hov = me.userData.hover;
        x.fillStyle = hov ? "rgba(42,181,180,0.3)" : "rgba(255,255,255,0.06)"; roundRect(x, 0, 0, W, RH, 16); x.fill();
        if (hov) { x.strokeStyle = "rgba(142,230,228,0.95)"; x.lineWidth = 2; roundRect(x, 1, 1, W - 2, RH - 2, 15); x.stroke(); }
        x.fillStyle = th.accent; roundRect(x, 0, 14, 6, RH - 28, 3); x.fill();
        x.fillStyle = hov ? "#fff" : th.accent; x.font = "800 24px system-ui, sans-serif"; x.fillText(String(i + 1).padStart(2, "0"), 22, RH / 2 + 8);
        const tx = 70, ty = 8, tw = 112, tH = RH - 16;
        x.save(); roundRect(x, tx, ty, tw, tH, 10); x.clip();
        const img = me.userData.img;
        if (img) { const r = Math.max(tw / img.width, tH / img.height); x.drawImage(img, tx + (tw - img.width * r) / 2, ty + (tH - img.height * r) / 2, img.width * r, img.height * r); }
        else { x.fillStyle = "#12304a"; x.fillRect(tx, ty, tw, tH); }
        x.restore();
        x.fillStyle = "#fff"; x.font = "600 25px system-ui, sans-serif";
        const L = lines(x, p.short || p.title, W - 270, 2);
        L.forEach((l, k) => x.fillText(l, 200, RH / 2 + 9 + (k - (L.length - 1) / 2) * 31));
        x.fillStyle = hov ? "#fff" : th.accent; x.font = "700 42px system-ui, sans-serif"; x.fillText("›", W - 42, RH / 2 + 14);
      });
      if (p.images && p.images[0]) photoTex(p.images[0]).then((t) => { if (t && row.parent) { row.userData.img = t.image; row.userData.redraw(); } });
      row.userData.onClick = () => showDetail(i); uiTargets.push(row);
      v.add(place(row, 40, TOP + i * (ROW + GAP), 920, ROW, 0.006, H, { d: 0.1 + i * 0.045, dur: 0.36, dx: -0.07, s0: 0.97 }));
    });
  });
}

const measureCtx = document.createElement("canvas").getContext("2d");
function detailText(x, th, p, W, y) { // draws (or, on measureCtx, just measures) the text block; returns its end
  kicker(x, th.label.length > 44 ? th.label.slice(0, 43) + "…" : th.label, 44, y, 19, th.accent); y += 50;
  x.fillStyle = "#fff"; x.font = "700 37px system-ui, sans-serif";
  for (const l of lines(x, p.title, W - 88, 3)) { x.fillText(l, 44, y); y += 45; }
  y += 4; x.font = "600 21px system-ui, sans-serif"; let cx = 44;
  for (const st of p.subThemes || []) {
    const w = x.measureText(st).width + 34; if (cx + w > W - 44) { cx = 44; y += 50; }
    x.fillStyle = "rgba(42,181,180,0.16)"; roundRect(x, cx, y - 26, w, 38, 19); x.fill();
    x.strokeStyle = "rgba(142,230,228,0.55)"; x.lineWidth = 1.5; roundRect(x, cx, y - 26, w, 38, 19); x.stroke();
    x.fillStyle = "#c4f4f2"; x.fillText(st, cx + 17, y); cx += w + 10;
  }
  y += 64; x.fillStyle = "rgba(231,243,247,0.94)"; x.font = "400 29px system-ui, sans-serif";
  for (const l of lines(x, p.description, W - 88, 6)) { x.fillText(l, 44, y); y += 40; }
  return y;
}
function showDetail(i) {
  const th = popup.theme, items = th.items, n = items.length, p = items[i];
  const imgs = p.images && p.images.length ? p.images : (th.photos || []).slice(0, 1);
  const TXT = imgs.length > 1 ? 790 : 640, H = Math.round(detailText(measureCtx, th, p, 1000, TXT) + 120);
  setView((v) => {
    v.add(place(canvasMesh(1000, H, (x, W, H2) => {
      cardBg(x, W, H2, th.accent);
      detailText(x, th, p, W, TXT);
      x.fillStyle = "rgba(220,238,244,0.6)"; x.font = "600 22px system-ui, sans-serif"; x.textAlign = "center"; x.fillText(`${i + 1} / ${n}`, W / 2, H2 - 44); x.textAlign = "start";
    }, 1), 0, 0, 1000, H, 0, H, { dur: 0.22 }));
    const back = pill("‹  Projets", 220, 60, showList); uiTargets.push(back);
    v.add(place(back, 34, 26, 220, 60, 0.008, H, { d: 0.12, dx: 0.05 }));
    closeButton(v, H);
    const hero = photoMesh(920, 480, imgs[0]);
    v.add(place(hero, 40, 104, 920, 480, 0.006, H, { d: 0.05, dur: 0.42, s0: 0.9, dz: -0.05 }));
    if (imgs.length > 1) {
      const TW = 214, GAP = 16, tot = imgs.length * TW + (imgs.length - 1) * GAP, x0 = 40 + (920 - tot) / 2, frames = [];
      imgs.forEach((src, k) => {
        const fr = new THREE.Mesh(new THREE.PlaneGeometry((TW + 12) * PX, 142 * PX), new THREE.MeshBasicMaterial({ color: 0x8ee6e4, transparent: true }));
        v.add(place(fr, x0 + k * (TW + GAP) - 6, 598, TW + 12, 142, 0.004, H, { d: 0.22 + k * 0.06, op: k === 0 ? 1 : 0 })); frames.push(fr);
        const th2 = photoMesh(TW, 130, src);
        th2.userData.onClick = () => { hero.userData.setSrc(src); frames.forEach((f, j) => { f.userData.a.op = j === k ? 1 : 0; }); };
        uiTargets.push(th2);
        v.add(place(th2, x0 + k * (TW + GAP), 604, TW, 130, 0.007, H, { d: 0.2 + k * 0.06, dy: -0.04, s0: 0.9 }));
      });
    }
    const prev = pill("‹  Précédent", 250, 60, () => showDetail((i - 1 + n) % n)), next = pill("Suivant  ›", 250, 60, () => showDetail((i + 1) % n));
    uiTargets.push(prev, next);
    v.add(place(prev, 40, H - 96, 250, 60, 0.008, H, { d: 0.3, dy: -0.03 }));
    v.add(place(next, 710, H - 96, 250, 60, 0.008, H, { d: 0.34, dy: -0.03 }));
  });
}
function animatePopup(dt) {
  if (!popup) return;
  const P = popup, g = P.group;
  P.t = Math.min(1, Math.max(0, P.t + (P.closing ? -dt * 4.5 : dt * 2.4)));
  if (P.closing && P.t === 0) { destroyPopup(); return; }
  const k = P.closing ? easeOut(P.t) : easeBack(P.t), gOp = Math.min(1, P.t * 1.8);
  g.scale.setScalar(Math.max(0.001, 0.2 + 0.8 * k));
  g.position.lerpVectors(P.from, P.to, easeOut(P.t));
  // view switch: the outgoing content fades at once, but its card stays opaque underneath until the
  // incoming card is fully in — so nothing behind the pop-up ever shows through mid-transition
  const cur = g.children[g.children.length - 1], ca = cur && cur.children[0].userData.a;
  const curCardIn = ca ? (cur.userData.t - ca.d) / ca.dur >= 1 : true;
  for (const v of [...g.children]) {
    v.userData.t += dt;
    const leaving = v.userData.leaving;
    if (leaving && curCardIn) v.userData.fade = (v.userData.fade || 0) + dt;
    const contentOp = leaving ? Math.max(0, 1 - v.userData.t / 0.16) : 1, cardOp = leaving ? Math.max(0, 1 - (v.userData.fade || 0) / 0.15) : 1;
    if (leaving && contentOp === 0 && cardOp === 0) { disposeView(v); g.remove(v); continue; }
    for (const m of v.children) {
      const a = m.userData.a; if (!a) continue;
      const e = leaving ? 1 : easeOut(Math.min(1, Math.max(0, (v.userData.t - a.d) / a.dur))), hov = m.userData.hover;
      m.position.set(a.base.x + a.dx * (1 - e), a.base.y + a.dy * (1 - e), a.base.z + a.dz * (1 - e) + (hov ? 0.014 : 0));
      m.scale.setScalar((a.s0 + (1 - a.s0) * e) * (hov ? 1.035 : 1));
      if (leaving && m.userData.isCard) m.renderOrder = 9;
      m.material.opacity = a.op * e * (leaving ? (m.userData.isCard ? cardOp : contentOp) : 1) * gOp;
    }
  }
}

// ── "Chiffres clés" wall behind the viewer — animated infographics ───────────────
// Same figures as the kiosk (chiffres-xr.json). Each panel re-animates (count-ups,
// growing bars/ring/circles) every time the viewer turns to face it.
const fmtFr = (n) => new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ");
const ease3 = (t, d0, dur) => { const q = Math.min(1, Math.max(0, (t - d0) / dur)); return 1 - Math.pow(1 - q, 3); };
const chiffresPanels = [];
fetch("./chiffres-xr.json").then((r) => r.json()).then(buildChiffres).catch(() => {});

function spaced(x, s) { if ("letterSpacing" in x) x.letterSpacing = s; }
function kicker(x, text, X, Y, size = 24, color = "#8ee6e4") {
  x.fillStyle = color; x.font = `600 ${size}px system-ui, sans-serif`; spaced(x, "5px"); x.fillText(text.toUpperCase(), X, Y); spaced(x, "0px");
}
function infoBg(x, W, H) {
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(19,49,80,0.97)"); g.addColorStop(1, "rgba(10,30,48,0.98)");
  x.fillStyle = g; roundRect(x, 0, 0, W, H, 34); x.fill();
  const glow = x.createRadialGradient(W - 130, 100, 10, W - 130, 100, 380); glow.addColorStop(0, "rgba(42,181,180,0.28)"); glow.addColorStop(1, "rgba(42,181,180,0)");
  x.save(); roundRect(x, 0, 0, W, H, 34); x.clip(); x.fillStyle = glow; x.fillRect(0, 0, W, H); x.restore();
  x.strokeStyle = "rgba(42,181,180,0.8)"; x.lineWidth = 4; roundRect(x, 6, 6, W - 12, H - 12, 30); x.stroke();
}
const FUNNEL = [["#0a2a44", "#0a3d62"], ["#0a3d62", "#00669d"], ["#00669d", "#0a7fae"], ["#0a7fae", "#1a9bb3"], ["#2ab5b4", "#1f9e9d"]];

function drawProcasef(x, W, H, d, t) {
  x.clearRect(0, 0, W, H); infoBg(x, W, H);
  const L = 56, CW = W - 2 * L, first = d.steps[0].value, last = d.steps[d.steps.length - 1].value;
  kicker(x, d.country, L, 92);
  x.fillStyle = "#fff"; x.font = "800 74px system-ui, sans-serif"; x.fillText(d.name, L, 172);
  x.fillStyle = "rgba(255,255,255,0.75)"; x.font = "400 28px system-ui, sans-serif"; wrap(x, d.tagline, L, 220, CW, 36, 2);
  // hero figures
  const bw = (CW - 24) / 2;
  [{ v: first, l: "parcelles inventoriées", teal: false }, { v: last, l: "titres d’occupation délivrés", teal: true }].forEach((b, i) => {
    const bx = L + i * (bw + 24), by = 296;
    x.fillStyle = b.teal ? "rgba(42,181,180,0.22)" : "rgba(255,255,255,0.08)"; roundRect(x, bx, by, bw, 120, 22); x.fill();
    if (b.teal) { x.strokeStyle = "rgba(142,230,228,0.5)"; x.lineWidth = 2; roundRect(x, bx, by, bw, 120, 22); x.stroke(); }
    x.fillStyle = "#fff"; x.font = "800 58px system-ui, sans-serif"; x.fillText(fmtFr(Math.round(b.v * ease3(t, 0.1 + i * 0.25, 1.6))), bx + 28, by + 68);
    x.fillStyle = "rgba(255,255,255,0.78)"; x.font = "400 24px system-ui, sans-serif"; x.fillText(b.l, bx + 28, by + 102);
  });
  // funnel
  kicker(x, "La chaîne foncière intégrée", L, 476, 22, "#2ab5b4");
  x.fillStyle = "#fff"; x.font = "600 38px system-ui, sans-serif"; x.fillText("De l’inventaire au titre d’occupation", L, 522);
  d.steps.forEach((s, i) => {
    const y = 574 + i * 92, fin = i === d.steps.length - 1;
    x.textAlign = "center"; x.fillStyle = fin ? "#8ee6e4" : "rgba(255,255,255,0.9)"; x.font = "600 24px system-ui, sans-serif";
    x.fillText(`${fin ? "✓" : i + 1}  ·  ${s.label}`, W / 2, y);
    const w = CW * (s.value / first) * ease3(t, 0.25 + i * 0.18, 1.3), bx = (W - w) / 2, by = y + 12, bh = 56;
    if (w > 2) {
      const g = x.createLinearGradient(bx, 0, bx + w, 0); g.addColorStop(0, FUNNEL[i][0]); g.addColorStop(1, FUNNEL[i][1]);
      x.fillStyle = g; roundRect(x, bx, by, w, bh, 14); x.fill();
      x.save(); roundRect(x, bx, by, w, bh, 14); x.clip();
      x.fillStyle = "#fff"; x.font = "800 36px system-ui, sans-serif"; x.fillText(fmtFr(Math.round(s.value * ease3(t, 0.2 + i * 0.18, 1.3))), W / 2, by + 41);
      x.restore();
    }
    x.textAlign = "start";
  });
  // conversion ring (derived: titles / inventoried)
  const rate = last / first, rp = ease3(t, 1.2, 1.6), cx = L + 66, cy = 1098, R = 56;
  x.lineWidth = 16; x.lineCap = "round";
  x.strokeStyle = "rgba(255,255,255,0.12)"; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.stroke();
  if (rp > 0) {
    const g = x.createLinearGradient(cx - R, cy - R, cx + R, cy + R); g.addColorStop(0, "#00669d"); g.addColorStop(1, "#2ab5b4");
    x.strokeStyle = g; x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rate * rp); x.stroke();
  }
  x.lineCap = "butt";
  x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "800 28px system-ui, sans-serif";
  x.fillText((rate * 100 * rp).toFixed(1).replace(".", ",") + " %", cx, cy + 10); x.textAlign = "start";
  x.fillStyle = "#fff"; x.font = "400 30px system-ui, sans-serif"; x.fillText("des parcelles inventoriées ont abouti", cx + R + 40, cy - 6);
  x.fillStyle = "#8ee6e4"; x.font = "700 30px system-ui, sans-serif"; x.fillText("à un titre d’occupation", cx + R + 40, cy + 32);
  // territorial footprint
  kicker(x, "Une empreinte territoriale majeure", L, 1212, 22, "#2ab5b4");
  const cw = (CW - 20) / 2;
  d.footprint.forEach((s, i) => {
    const fx = L + (i % 2) * (cw + 20), fy = 1234 + Math.floor(i / 2) * 94;
    x.fillStyle = "rgba(255,255,255,0.07)"; roundRect(x, fx, fy, cw, 84, 16); x.fill();
    x.fillStyle = "#8ee6e4"; x.font = "800 36px system-ui, sans-serif";
    x.fillText(`${s.prefix || ""}${fmtFr(Math.round(s.value * ease3(t, 0.5 + i * 0.15, 1.4)))}${s.suffix || ""}`, fx + 20, fy + 44);
    x.fillStyle = "rgba(255,255,255,0.8)"; x.font = "400 20px system-ui, sans-serif"; x.fillText(s.label, fx + 20, fy + 72);
  });
  const details = d.footprint.filter((s) => s.detail).map((s) => s.detail).join("   ·   ");
  x.fillStyle = "rgba(255,255,255,0.6)"; x.font = "400 21px system-ui, sans-serif"; wrap(x, details, L, 1452, CW, 28, 2);
}

function drawPamofor(x, W, H, d, t) {
  x.clearRect(0, 0, W, H); infoBg(x, W, H);
  const L = 56, CW = W - 2 * L;
  kicker(x, d.country, L, 92);
  x.fillStyle = "#fff"; x.font = "800 58px system-ui, sans-serif"; let y = wrap(x, d.name, L, 166, CW, 66, 2);
  x.fillStyle = "rgba(255,255,255,0.75)"; x.font = "400 28px system-ui, sans-serif"; y = wrap(x, d.tagline, L, y + 8, CW, 36, 2);
  // giant hero figure
  x.font = "800 148px system-ui, sans-serif";
  const htxt = fmtFr(Math.round(d.hero.value * ease3(t, 0.1, 2.0))) + (d.hero.suffix || "");
  const hg = x.createLinearGradient(L, 0, L + x.measureText(htxt).width, 0); hg.addColorStop(0, "#ffffff"); hg.addColorStop(1, "#8ee6e4");
  x.fillStyle = hg; x.fillText(htxt, L - 4, y + 128);
  x.fillStyle = "#fff"; x.font = "700 38px system-ui, sans-serif"; x.fillText(d.hero.label, L, y + 184);
  x.fillStyle = "rgba(255,255,255,0.7)"; x.font = "400 26px system-ui, sans-serif"; x.fillText(d.hero.detail || "", L, y + 222);
  // stat cards
  const sy = y + 262, cw = (CW - 40) / 3, ch = 222;
  d.stats.forEach((s, i) => {
    const cx0 = L + i * (cw + 20);
    x.fillStyle = "rgba(255,255,255,0.07)"; roundRect(x, cx0, sy, cw, ch, 20); x.fill();
    const bar = x.createLinearGradient(cx0, 0, cx0 + cw, 0); bar.addColorStop(0, "#00669d"); bar.addColorStop(1, "#2ab5b4");
    x.save(); roundRect(x, cx0, sy, cw, ch, 20); x.clip(); x.fillStyle = bar; x.fillRect(cx0, sy, cw, 6); x.restore();
    x.fillStyle = "#8ee6e4"; x.font = "800 52px system-ui, sans-serif"; x.fillText(fmtFr(Math.round(s.value * ease3(t, 0.4 + i * 0.15, 1.4))), cx0 + 22, sy + 74);
    x.fillStyle = "#fff"; x.font = "700 26px system-ui, sans-serif"; x.fillText(s.label, cx0 + 22, sy + 112);
    x.fillStyle = "rgba(255,255,255,0.65)"; x.font = "400 19px system-ui, sans-serif"; wrap(x, s.detail || "", cx0 + 22, sy + 146, cw - 40, 24, 3);
  });
  // territorial hierarchy: régions → départements → sous-préfectures
  const ty = sy + ch + 62;
  kicker(x, "Un déploiement territorial à grande échelle", L, ty, 22, "#2ab5b4");
  x.fillStyle = "#fff"; x.font = "600 38px system-ui, sans-serif"; x.fillText("Une couverture structurée", L, ty + 46);
  const radii = [58, 72, 88], centers = [W * 0.2, W * 0.5, W * 0.8], ccy = ty + 190;
  const fills = [["#0a3d62", "#00669d"], ["#00669d", "#1a9bb3"], ["#1a9bb3", "#2ab5b4"]];
  d.territory.forEach((s, i) => {
    const cxx = centers[i], r = radii[i] * ease3(t, 0.3 + i * 0.2, 0.9);
    if (r > 1) {
      const g = x.createLinearGradient(cxx - r, ccy - r, cxx + r, ccy + r); g.addColorStop(0, fills[i][0]); g.addColorStop(1, fills[i][1]);
      x.fillStyle = g; x.beginPath(); x.arc(cxx, ccy, r, 0, Math.PI * 2); x.fill();
      x.textAlign = "center"; x.fillStyle = "#fff"; x.font = `800 ${Math.round(radii[i] * 0.62)}px system-ui, sans-serif`;
      x.fillText(String(Math.round(s.value * ease3(t, 0.4 + i * 0.2, 1.0))), cxx, ccy + radii[i] * 0.22);
    }
    x.textAlign = "center"; x.fillStyle = "rgba(255,255,255,0.9)"; x.font = "600 26px system-ui, sans-serif"; x.fillText(s.label, cxx, ccy + radii[2] + 44);
    x.textAlign = "start";
    if (i < d.territory.length - 1) { // chevron between circles
      const mx = (cxx + radii[i] + centers[i + 1] - radii[i + 1]) / 2;
      x.strokeStyle = "#2ab5b4"; x.lineWidth = 5; x.lineCap = "round"; x.lineJoin = "round";
      x.beginPath(); x.moveTo(mx - 8, ccy - 16); x.lineTo(mx + 8, ccy); x.lineTo(mx - 8, ccy + 16); x.stroke(); x.lineCap = "butt";
    }
  });
  // closing statement
  const qy = ccy + radii[2] + 100;
  x.fillStyle = "#2ab5b4"; x.fillRect(L, qy - 30, 6, 108);
  x.fillStyle = "rgba(255,255,255,0.85)"; x.font = "italic 400 25px system-ui, sans-serif"; wrap(x, d.closing, L + 28, qy, CW - 30, 34, 3);
}

function makeInfoPanel(draw, d, W, H, widthM) {
  const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  draw(x, W, H, d, 0);
  const mesh = panelMesh(c, widthM, widthM * H / W);
  return { mesh, redraw: (t) => { draw(x, W, H, d, t); mesh.material.map.needsUpdate = true; } };
}

function buildChiffres(data) {
  const Y = 1.62, R = 2.6;
  const header = (() => {
    const W = 1024, H = 190, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    x.fillStyle = "rgba(8,23,38,0.85)"; roundRect(x, 0, 0, W, H, 26); x.fill();
    x.strokeStyle = "rgba(42,181,180,0.8)"; x.lineWidth = 3; roundRect(x, 4, 4, W - 8, H - 8, 23); x.stroke();
    x.textAlign = "center"; kicker(x, "Chiffres clés", W / 2 + 2, 66, 28); x.textAlign = "center";
    x.fillStyle = "#fff"; x.font = "700 54px system-ui, sans-serif"; x.fillText("Nos programmes fonciers en chiffres", W / 2, 140);
    return panelMesh(c, 1.7, 1.7 * H / W);
  })();
  placeAroundUser(header, 180, 2.96, R); sections.add(header);
  [
    { draw: drawProcasef, d: data.procasef, H: 1510, az: 160 },
    { draw: drawPamofor, d: data.pamofor, H: 1410, az: -160 },
  ].forEach((p) => {
    const ip = makeInfoPanel(p.draw, p.d, 1000, p.H, 1.44);
    placeAroundUser(ip.mesh, p.az, Y, R); sections.add(ip.mesh);
    const dir = ip.mesh.position.clone().sub(USER); dir.y = 0; dir.normalize();
    chiffresPanels.push({ ...ip, dir, armed: true, active: false, t0: 0, lastDraw: 0 });
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
  x.fillStyle="rgba(255,255,255,0.62)"; x.font="400 27px system-ui, sans-serif"; x.fillText("Saisissez le globe · visez un pays · retournez-vous : chiffres clés", W/2, 278);
  const m = panelMesh(c, 1.42, 1.42*H/W); m.position.set(GLOBE_POS.x, GLOBE_POS.y + GLOBE_R + 0.85, GLOBE_POS.z - 0.2); scene.add(m);
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
function aim(originObj) {
  tmpM.identity().extractRotation(originObj.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(originObj.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tmpM);
}
function intersectMarkers(originObj) { aim(originObj); return raycaster.intersectObjects(hitTargets, false); }
function onSelectStart(ctrl) {
  aim(ctrl);
  const ui = raycaster.intersectObjects(uiTargets, false);
  if (ui.length) { ui[0].object.userData.onClick(); return; }
  const hits = raycaster.intersectObjects(hitTargets, false);
  if (hits.length) { showPanel(hits[0].object.userData.country); return; }
  const tiles = raycaster.intersectObjects(tileTargets, false);
  if (tiles.length) { openThemePopup(tiles[0].object); return; }
  // else: grab-to-spin if pointing at the globe
  const gh = raycaster.intersectObject(sphere, false);
  if (gh.length) { grabbing = ctrl; lastGrabA = null; }
}
function controllerAzimuth(ctrl) {
  const p = new THREE.Vector3().setFromMatrixPosition(ctrl.matrixWorld);
  return Math.atan2(p.x - GLOBE_POS.x, -(p.z - GLOBE_POS.z));
}

// desktop fallback: drag to spin, click to select
// drag on the globe spins it; drag anywhere else looks around (so the wall behind is reachable)
let dragging = false, dragMode = "globe", px = 0, py = 0, moved = 0, manualSpin = 0, tiltY = 0, lookYaw = 0, lookPitch = 0;
camera.rotation.order = "YXZ";
renderer.domElement.addEventListener("pointerdown", (e) => {
  dragging = true; px = e.clientX; py = e.clientY; moved = 0;
  raycaster.setFromCamera(new THREE.Vector2((e.clientX/innerWidth)*2-1, -(e.clientY/innerHeight)*2+1), camera);
  dragMode = raycaster.intersectObject(sphere, false).length ? "globe" : "look";
});
renderer.domElement.addEventListener("pointermove", (e) => {
  if (!dragging) {
    if (!renderer.xr.isPresenting) {
      raycaster.setFromCamera(new THREE.Vector2((e.clientX/innerWidth)*2-1, -(e.clientY/innerHeight)*2+1), camera);
      const h = uiTargets.length ? raycaster.intersectObjects(uiTargets, false) : []; setHover(h.length ? h[0].object : null);
    }
    return;
  } const dx = e.clientX - px, dy = e.clientY - py; moved += Math.abs(dx)+Math.abs(dy);
  if (dragMode === "globe") { manualSpin += dx * 0.005; tiltY = THREE.MathUtils.clamp(tiltY + dy * 0.004, -0.5, 0.5); }
  else if (!renderer.xr.isPresenting) { lookYaw += dx * 0.004; lookPitch = THREE.MathUtils.clamp(lookPitch + dy * 0.003, -0.7, 0.7); camera.rotation.set(lookPitch, lookYaw, 0); }
  px = e.clientX; py = e.clientY;
});
addEventListener("pointerup", (e) => {
  if (dragging && moved < 6 && !renderer.xr.isPresenting) {
    const ndc = new THREE.Vector2((e.clientX/innerWidth)*2-1, -(e.clientY/innerHeight)*2+1);
    raycaster.setFromCamera(ndc, camera);
    const ui = raycaster.intersectObjects(uiTargets, false);
    if (ui.length) ui[0].object.userData.onClick();
    else {
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length) showPanel(hits[0].object.userData.country);
      else { const tiles = raycaster.intersectObjects(tileTargets, false); if (tiles.length) openThemePopup(tiles[0].object); }
    }
  }
  dragging = false;
});

// ── soft ambient background music (procedural pad — fully offline) ──────────────
let ambient = null;
function startAmbient() {
  if (ambient) { if (ambient.ctx.state === "suspended") ambient.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  const ctx = new AC();
  const master = ctx.createGain(); master.gain.value = 0.0001; master.connect(ctx.destination);
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 620; lp.Q.value = 0.7; lp.connect(master);
  const delay = ctx.createDelay(1.0); delay.delayTime.value = 0.5; const fb = ctx.createGain(); fb.gain.value = 0.32;
  delay.connect(fb); fb.connect(delay); delay.connect(master); lp.connect(delay);
  [110, 164.81, 220, 277.18, 329.63].forEach((f, i) => { // A2 E3 A3 C#4 E4 — soft airy chord
    const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = "triangle"; o2.frequency.value = f * 1.004;
    const g = ctx.createGain(); g.gain.value = 0.11 / (1 + i * 0.35);
    o1.connect(g); o2.connect(g); g.connect(lp); o1.start(); o2.start();
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.04 + i * 0.017; const lg = ctx.createGain(); lg.gain.value = g.gain.value * 0.5;
    lfo.connect(lg); lg.connect(g.gain); lfo.start();
  });
  const flfo = ctx.createOscillator(); flfo.frequency.value = 0.025; const fg = ctx.createGain(); fg.gain.value = 260;
  flfo.connect(fg); fg.connect(lp.frequency); flfo.start();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 5);
  ambient = { ctx, master, muted: false };
}
function toggleAmbient() {
  if (!ambient) { startAmbient(); return true; }
  ambient.muted = !ambient.muted;
  ambient.master.gain.cancelScheduledValues(ambient.ctx.currentTime);
  ambient.master.gain.linearRampToValueAtTime(ambient.muted ? 0.0001 : 0.07, ambient.ctx.currentTime + 0.6);
  return !ambient.muted;
}
renderer.domElement.addEventListener("pointerdown", startAmbient, { once: true });
renderer.xr.addEventListener("sessionstart", startAmbient);
const audioBtn = document.getElementById("audio-toggle");
if (audioBtn) audioBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!ambient) { startAmbient(); audioBtn.textContent = "♪ Son"; return; }
  audioBtn.textContent = toggleAmbient() ? "♪ Son" : "♪ Muet";
});

// ── fresh deploys: the SW is cache-first, so a page opened just after a deploy runs the old
// files while the new worker installs. When that worker takes over, reload once (after VR exit).
if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    const go = () => location.reload();
    if (renderer.xr.isPresenting) renderer.xr.addEventListener("sessionend", go, { once: true }); else go();
  }, { once: true });
}

// ── loop ────────────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let elapsed = 0, hoveredHit = null;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const camDir = new THREE.Vector3();
if (location.search.includes("debug")) window.XR = { showPanel, openThemePopup, showDetail, uiTargets, get popup() { return popup; }, tileTargets, chiffresPanels, world, get data() { return DATA; }, camera, renderer, scene, sections };

renderer.setAnimationLoop(() => {
  const dt = clock.getDelta(); elapsed += dt; const ms = elapsed * 1000;

  const intro = Math.min(1, elapsed / 2.0), ei = easeOut(intro);
  globe.scale.setScalar(ei);
  world.update(dt, elapsed);
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
    let uiHit = null;
    if (uiTargets.length) for (const ctrl of controllers) { aim(ctrl); const h = raycaster.intersectObjects(uiTargets, false); if (h.length) { uiHit = h[0]; break; } }
    setHover(uiHit ? uiHit.object : null);
    if (!uiHit) for (const ctrl of controllers) { if (grabbing === ctrl) continue; const h = intersectMarkers(ctrl); if (h.length) { hit = h[0]; break; } }
    const r = uiHit || hit; reticle.visible = !!r; if (r) reticle.position.copy(r.point);
  }
  if (hoveredHit && hoveredHit !== (hit && hit.object)) hoveredHit.userData.sprite.scale.setScalar(hoveredHit.userData.baseScale);
  if (hit) { hit.object.userData.sprite.scale.setScalar(hit.object.userData.baseScale * (1.5 + Math.sin(elapsed*6)*0.15)); hoveredHit = hit.object; } else hoveredHit = null;

  markers.children.forEach((m, i) => { if (m.isGroup && m.children[0]) { const b = m.children[0]; if (!hoveredHit || hoveredHit.userData.sprite !== b) b.material.opacity = 0.75 + Math.sin(elapsed*2 + i)*0.2; } });

  if (cPanel) { cPanel.userData.t = Math.min(1, cPanel.userData.t + dt * 2.6); cPanel.scale.setScalar(0.001 + easeOut(cPanel.userData.t) * 0.999); }

  animatePopup(dt);

  // chiffres wall: (re)play a panel's animation whenever the viewer turns to face it
  if (chiffresPanels.length) {
    const cam = renderer.xr.isPresenting ? renderer.xr.getCamera() : camera;
    cam.getWorldDirection(camDir); camDir.y = 0; camDir.normalize();
    const now = performance.now();
    for (const cp of chiffresPanels) {
      const dot = camDir.dot(cp.dir);
      if (cp.armed && dot > 0.8) { cp.armed = false; cp.active = true; cp.t0 = elapsed; }
      else if (!cp.armed && !cp.active && dot < -0.2) { cp.armed = true; cp.redraw(0); } // reset while out of view
      if (cp.active && now - cp.lastDraw > 45) {
        const t = elapsed - cp.t0; cp.redraw(t); cp.lastDraw = now;
        if (t > 3.4) cp.active = false; // final frame drawn
      }
    }
  }

  renderer.render(scene, camera);
});
