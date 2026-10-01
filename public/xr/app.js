// ETAFAT — Immersive presence experience (WebXR, Quest 3). Offline, self-contained.
import * as THREE from "three";
import { createWorld, ZONES, NIGHT } from "./world.js";
import { mergeGeometries } from "./vendor/jsm/utils/BufferGeometryUtils.js";
import { createFX } from "./fx.js";
import { createDock } from "./nav.js";
import { createCinema } from "./cinema.js";
import { createCite } from "./cite.js";
import { I18N, L as tr, loc, num, pct, plural } from "./i18n.js";

const DEG = Math.PI / 180;
const TEAL = 0x2ab5b4, TEAL_L = 0x8ee6e4, NAVY = 0x0a1e30, BLUE = 0x00669d; // ETAFAT palette
const GLOBE_R = 0.8;
const GLOBE_POS = new THREE.Vector3(0, 1.5, -2.3); // just under eye level, over the valley
const GK = GLOBE_R / 0.55;                          // scale for the globe's details (pins, tiles, arcs, leader)
const USER = new THREE.Vector3(0, 1.6, 0);

const scene = new THREE.Scene(); // sky, fog and lights come from world.js

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.05, 30000);
camera.position.copy(USER);
// the visitor's rig: camera, controllers and hands ride on it, so turning to a zone (dock, snap-turn)
// rotates the rig around the head instead of moving the world
const rig = new THREE.Group(); scene.add(rig); rig.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: AR passthrough
renderer.setClearAlpha(1);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType("local-floor");
document.body.appendChild(renderer.domElement);
// ── XR sessions: "Entrer en VR" / "Entrer en AR" (passthrough). Both ask for hand tracking, so the hands appear
// when the controllers are put down. In the headset the dock (and the Cité menu) switch VR ⇄ AR: the session
// ends and the other one is requested straight away, still inside the trigger press that asked for it
// (WebXR select events count as a user gesture).
const xrBar = document.createElement("div"); xrBar.id = "xr-buttons"; document.body.appendChild(xrBar);
const vrBtn = document.createElement("button"); vrBtn.disabled = true;
const arBtn = document.createElement("button"); arBtn.hidden = true;
xrBar.append(vrBtn, arBtn);
const xrSupport = { vr: false, ar: false, checked: false, api: !!navigator.xr };
function syncXrButtons() {
  if (renderer.xr.isPresenting) { vrBtn.textContent = arBtn.textContent = tr("Quitter l’expérience", "Exit the experience"); return; }
  vrBtn.textContent = !xrSupport.api ? tr("Mode bureau · WebXR indisponible", "Desktop mode · WebXR unavailable")
    : xrSupport.checked && !xrSupport.vr ? tr("Mode bureau · casque VR non détecté", "Desktop mode · no VR headset detected")
    : tr("Entrer dans l’expérience VR", "Enter the VR experience");
  arBtn.textContent = tr("Entrer en AR", "Enter AR");
}
syncXrButtons();
let arMode = false, switchTo = null, switching = false;
if (navigator.xr) {
  navigator.xr.isSessionSupported("immersive-vr").then((ok) => { xrSupport.vr = ok; xrSupport.checked = true; vrBtn.disabled = !ok; syncXrButtons(); }).catch(() => {});
  navigator.xr.isSessionSupported("immersive-ar").then((ok) => { xrSupport.ar = ok; arBtn.hidden = !ok; }).catch(() => {});
}
async function startXR(mode) {
  try {
    fx.unlock();
    const sess = await navigator.xr.requestSession(mode, { optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking", "layers"] });
    setAR(mode === "immersive-ar");
    await renderer.xr.setSession(sess);
  } catch (e) { console.warn(e); setAR(false); switching = false; }
}
function setAR(on) { // passthrough: no landscape, sky or Cité dome; the clear colour lets the room through
  arMode = on; renderer.setClearAlpha(on ? 0 : 1);
  world.setAR(on); cite.setAR(on); cite.redraw();
  dock.targets.forEach((t) => t.userData.redraw());
}
function switchXR(k) { // "vr" | "ar"
  const mode = k === "ar" ? "immersive-ar" : "immersive-vr", s = renderer.xr.getSession();
  if (!s) { startXR(mode); return; }
  if ((k === "ar") === arMode) return;
  switchTo = mode; switching = true; s.end();
}
const xrState = () => ({ mode: renderer.xr.isPresenting ? (arMode ? "ar" : "vr") : null, vr: xrSupport.vr, ar: xrSupport.ar });
vrBtn.addEventListener("click", () => { if (renderer.xr.isPresenting) renderer.xr.getSession().end(); else startXR("immersive-vr"); });
arBtn.addEventListener("click", () => { if (renderer.xr.isPresenting) renderer.xr.getSession().end(); else startXR("immersive-ar"); });
renderer.xr.addEventListener("sessionstart", () => { syncXrButtons(); arBtn.hidden = vrBtn.hidden = false; });
renderer.xr.addEventListener("sessionend", () => {
  syncXrButtons(); arBtn.hidden = !xrSupport.ar;
  if (switchTo) { const m = switchTo; switchTo = null; startXR(m); return; }
  setAR(false);
});

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const world = createWorld({ scene, renderer, camera });
const fx = createFX({ renderer, camera, rig, scene });

// ── globe: map with clear country borders (earth.png, ETAFAT palette) ────────────
// ETAFAT countries in teal; pointing at one lights it up (fill glow + crisp outline from an id map)
// and pulls its pop-up out toward the viewer.
const globe = new THREE.Group(); globe.position.copy(GLOBE_POS); scene.add(globe);
const spin = new THREE.Group(); globe.add(spin); // markers + arcs ride along
{ const th = (17 + 180) * DEG; spin.rotation.y = -Math.atan2(-Math.cos(th), Math.sin(th)); } // open centred on Africa (17°E)
const texLoader = new THREE.TextureLoader();
const dummy = new THREE.Object3D(), _v = new THREE.Vector3();

const earthTex = texLoader.load("./earth.png"); earthTex.colorSpace = THREE.SRGBColorSpace; earthTex.anisotropy = 8;
// the earth is revealed by a scan line sweeping up from the south pole (intro), with a teal edge
const reveal = { value: 0 };
const earthMat = new THREE.MeshBasicMaterial({ map: earthTex, toneMapped: false, transparent: true });
earthMat.onBeforeCompile = (sh) => {
  sh.uniforms.uReveal = reveal;
  sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying float vLat;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvLat = position.y / " + GLOBE_R.toFixed(3) + " * 0.5 + 0.5;");
  sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vLat; uniform float uReveal;")
    .replace("#include <map_fragment>", `#include <map_fragment>
      float edge = uReveal * 1.12 - vLat;
      if (edge < 0.0) discard;
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.56, 0.95, 0.93), (1.0 - smoothstep(0.0, 0.05, edge)) * step(uReveal, 0.999));`);
};
const sphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R, 96, 64), earthMat);
spin.add(sphere);
const atmo = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.14, 64, 48), new THREE.ShaderMaterial({
  transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
  uniforms: { uColor: { value: new THREE.Color(TEAL) } },
  vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}`,
  fragmentShader: `varying vec3 vN; uniform vec3 uColor; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(uColor, clamp(i,0.0,1.0)*0.9);}`
}));
globe.add(atmo);

// holographic emitter on the deck: a dark metal pedestal with light rings projecting a cone up to the globe
const emitter = new THREE.Group(); emitter.position.set(GLOBE_POS.x, 0, GLOBE_POS.z); scene.add(emitter);
{
  const metal = new THREE.MeshStandardMaterial({ color: 0x1b242e, roughness: 0.32, metalness: 0.85 });
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.42, 48).translate(0, 0.21, 0), metal); ped.castShadow = true; emitter.add(ped);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.3, 0.05, 48).translate(0, 0.445, 0), metal); emitter.add(cap);
  for (const [y, r] of [[0.08, 0.402], [0.47, 0.334]]) emitter.add(new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 6, 64).rotateX(Math.PI / 2).translate(0, y, 0), new THREE.MeshBasicMaterial({ color: 0x5ff5f0, toneMapped: false })));
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.26, 48).rotateX(-Math.PI / 2).translate(0, 0.472, 0), new THREE.MeshBasicMaterial({ color: 0x8ee6e4, toneMapped: false, transparent: true, opacity: 0.85 }));
  emitter.add(lens);
  const coneMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uTime: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform float uTime; varying vec2 vUv; void main(){ float a = (1.0 - vUv.y) * 0.32 + step(0.86, fract(vUv.y * 6.0 - uTime * 0.7)) * 0.12; gl_FragColor = vec4(0.37, 0.96, 0.94, a * (0.6 + 0.4 * vUv.y)); }",
  });
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.26, GLOBE_POS.y - GLOBE_R - 0.47 + 0.18, 48, 1, true).translate(0, 0.47 + (GLOBE_POS.y - GLOBE_R - 0.47 + 0.18) / 2, 0), coneMat);
  cone.renderOrder = 3; emitter.add(cone); emitter.userData.cone = coneMat;
}

// hovered-country highlight: a shell reading the id map (index+1 in R, checksum G = 255−R, B = 128)
const idTex = texLoader.load("./countries-id.png");
idTex.colorSpace = THREE.NoColorSpace; idTex.magFilter = idTex.minFilter = THREE.NearestFilter; idTex.generateMipmaps = false;
const hiMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false,
  uniforms: { uId: { value: idTex }, uHover: { value: 0 }, uTime: { value: 0 }, uTexel: { value: new THREE.Vector2(1 / 2048, 1 / 1024) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D uId; uniform float uHover, uTime; uniform vec2 uTexel; varying vec2 vUv;
    float idAt(vec2 uv){ vec3 c = texture2D(uId, uv).rgb * 255.0; return (abs(c.b - 128.0) < 1.5 && abs(c.r + c.g - 255.0) < 1.5) ? floor(c.r + 0.5) : 0.0; }
    bool hov(vec2 uv){ return abs(idAt(uv) - uHover) < 0.5; }
    void main(){
      if (uHover < 0.5) discard;
      bool inside = hov(vUv);
      vec2 o = uTexel * 1.6;
      float edge = (hov(vUv + vec2(o.x, 0.0)) != inside || hov(vUv - vec2(o.x, 0.0)) != inside || hov(vUv + vec2(0.0, o.y)) != inside || hov(vUv - vec2(0.0, o.y)) != inside) ? 1.0 : 0.0;
      float pulse = 0.5 + 0.5 * sin(uTime * 4.0);
      float a = max(inside ? 0.3 + 0.18 * pulse : 0.0, edge);
      if (a < 0.01) discard;
      gl_FragColor = vec4(mix(vec3(0.72, 0.97, 0.95), vec3(1.0), edge), a);
    }`,
});
spin.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.002, 128, 80), hiMat));

function lonLatToVec3(lon, lat, r = GLOBE_R) {
  const phi = (90 - lat) * DEG, theta = (lon + 180) * DEG;
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
}
function glowTexture(hex) {
  const sz = 128, c = document.createElement("canvas"); c.width = c.height = sz;
  const x = c.getContext("2d"); const g = x.createRadialGradient(sz/2,sz/2,0,sz/2,sz/2,sz/2);
  const col = new THREE.Color(hex); const rgb = `${(col.r*255)|0},${(col.g*255)|0},${(col.b*255)|0}`;
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.25, `rgba(${rgb},1)`);
  g.addColorStop(0.6, `rgba(${rgb},0.35)`); g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0,0,sz,sz);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

let DATA = null, ID = null;
const countryByIso = new Map();
const arcMat = new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.42, depthWrite: false, toneMapped: false }); // subtle: the network, not the star
const arcTime = { value: 0 };
arcMat.onBeforeCompile = (sh) => { // all arcs in one mesh: grow in one after another, then carry travelling light pulses
  sh.uniforms.uTime = arcTime;
  sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float aI; varying float vI; varying float vT;")
    .replace("#include <begin_vertex>", "#include <begin_vertex>\nvI = aI; vT = uv.x;");
  sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uTime; varying float vI; varying float vT;")
    .replace("#include <color_fragment>", `#include <color_fragment>
      if (vT > clamp((uTime - 0.8 - vI * 0.08) / 1.1, 0.0, 1.0)) discard;
      float p = fract(uTime * 0.18 + vI * 0.137), glow = smoothstep(0.05, 0.0, abs(vT - p));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.85, 1.0, 1.0), glow * 0.55);
      diffuseColor.a *= smoothstep(0.0, 0.18, vT) * (1.0 - smoothstep(0.82, 1.0, vT)) * 0.85 + 0.15; // fade near both ends so Casablanca isn't a hot spot`);
};

fetch("./presence-xr.json").then((r) => r.json()).then((d) => { DATA = d; buildGlobe(d); if (typeof titleCard !== "undefined") titleCard.userData.redraw(); });
// id map pixels for the hover lookup (read raw: no colour conversion)
fetch("./countries-id.png").then((r) => r.blob()).then((b) => createImageBitmap(b, { colorSpaceConversion: "none", premultiplyAlpha: "none" })).then((bm) => {
  const c = document.createElement("canvas"); c.width = bm.width; c.height = bm.height;
  const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(bm, 0, 0);
  ID = { w: bm.width, h: bm.height, d: x.getImageData(0, 0, bm.width, bm.height).data };
}).catch(() => {});

function buildGlobe(d) {
  d.countries.forEach((c) => countryByIso.set(c.iso, c));
  // glowing markers (one draw call each): ETAFAT countries + the Casablanca HQ
  const pts = (list, hex, size) => {
    const g = new THREE.BufferGeometry().setFromPoints(list.map(([lon, lat]) => lonLatToVec3(lon, lat, GLOBE_R * 1.012)));
    return new THREE.Points(g, new THREE.PointsMaterial({ map: glowTexture(hex), size, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  };
  spin.add(pts(d.countries.map((c) => [c.lon, c.lat]), TEAL_L, 0.06 * GK));
  spin.add(pts([[d.hq.lon, d.hq.lat]], TEAL_L, 0.07 * GK));
  // arcs from HQ (one merged mesh)
  const a = lonLatToVec3(d.hq.lon, d.hq.lat, GLOBE_R), tubes = [];
  d.countries.forEach((c, i) => {
    if (c.iso === 504) return;
    const b = lonLatToVec3(c.lon, c.lat, GLOBE_R), mid = a.clone().add(b).multiplyScalar(0.5); mid.setLength(GLOBE_R * (1.12 + a.distanceTo(b) / GLOBE_R * 0.12));
    const g = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 40, 0.0013 * GK, 4, false);
    g.setAttribute("aI", new THREE.Float32BufferAttribute(new Array(g.attributes.position.count).fill(i), 1));
    tubes.push(g);
  });
  spin.add(new THREE.Mesh(mergeGeometries(tubes), arcMat));
}
function updateCountryHighlight(t, hoverIso) {
  const i = hoverIso != null && DATA ? DATA.countries.findIndex((c) => c.iso === hoverIso) : -1;
  hiMat.uniforms.uHover.value = i + 1; hiMat.uniforms.uTime.value = t;
}
// ray (already aimed) → ETAFAT country under it: exact from the id map, else the nearest marker within ~3°
const _p = new THREE.Vector3();
function countryAtRay() {
  if (!DATA) return null;
  const h = raycaster.intersectObject(sphere, false); if (!h.length) return null;
  _p.copy(h[0].point); spin.worldToLocal(_p); _p.normalize();
  const lat = 90 - Math.acos(THREE.MathUtils.clamp(_p.y, -1, 1)) / DEG;
  let lon = Math.atan2(_p.z, -_p.x) / DEG - 180; if (lon < -180) lon += 360;
  let country = null;
  if (ID) {
    const x = Math.min(ID.w - 1, Math.floor((lon + 180) / 360 * ID.w)), y = Math.min(ID.h - 1, Math.floor((90 - lat) / 180 * ID.h)), k = (y * ID.w + x) * 4, dd = ID.d;
    if (dd[k + 2] === 128 && dd[k] + dd[k + 1] === 255 && dd[k] > 0) country = DATA.countries[dd[k] - 1] || null;
  }
  if (!country) {
    let best = Math.cos(3 * DEG);
    for (const c of DATA.countries) { const dp = lonLatToVec3(c.lon, c.lat, 1).dot(_p); if (dp > best) { best = dp; country = c; } }
  }
  return country ? { country, local: _p.clone().multiplyScalar(GLOBE_R) } : null;
}

// ── canvas panel helpers ────────────────────────────────────────────────────────
function roundRect(x, X, Y, W, H, r){ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+W,Y,X+W,Y+H,r); x.arcTo(X+W,Y+H,X,Y+H,r); x.arcTo(X,Y+H,X,Y,r); x.arcTo(X,Y,X+W,Y,r); x.closePath(); }
function wrap(x, text, X, Y, maxW, lh, maxLines){ const words=String(text).split(" "); let line="", n=1; for(const w of words){ const t=line?line+" "+w:w; if(x.measureText(t).width>maxW && line){ x.fillText(line,X,Y); Y+=lh; line=w; if(++n>maxLines){ x.fillText("…",X,Y); return Y+lh; } } else line=t; } x.fillText(line,X,Y); return Y+lh; }
function panelMesh(canvas, w, h) {
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
}

// theme / apps section tiles arranged around the viewer
const sections = new THREE.Group(); scene.add(sections);
const tileTargets = [];          // theme panels the user can aim at to open their projects
fetch("./sections-xr.json").then(r => r.json()).then(buildSections);

function makeThemePanel(t) { // gallery card: hero photo, title, tagline, project count — reacts to the pointer
  const W = 900, H = 920, HERO = 468, n = (t.items || t.projects || []).length;
  const m = canvasMesh(W, H, (x, W2, H2, me) => {
    const hov = me.userData.hover, img = me.userData.img, T = loc(t);
    cardBg(x, W2, H2, hov ? "#8ee6e4" : t.accent);
    x.save(); roundRect(x, 8, 8, W2 - 16, HERO, 24); x.clip();
    if (img) { const r = Math.max((W2 - 16) / img.width, HERO / img.height), dw = img.width * r, dh = img.height * r; x.drawImage(img, 8 + (W2 - 16 - dw) / 2, 8 + (HERO - dh) / 2, dw, dh); }
    else { const g = x.createLinearGradient(0, 0, W2, HERO); g.addColorStop(0, "#0d3350"); g.addColorStop(1, "#16486b"); x.fillStyle = g; x.fillRect(0, 0, W2, HERO); }
    const fade = x.createLinearGradient(0, HERO - 170, 0, HERO + 8); fade.addColorStop(0, "rgba(19,49,80,0)"); fade.addColorStop(1, "rgba(19,49,80,1)");
    x.fillStyle = fade; x.fillRect(0, HERO - 170, W2, 180);
    x.restore();
    x.fillStyle = "rgba(8,23,38,0.78)"; roundRect(x, 30, 30, 196, 46, 23); x.fill();          // project count chip on the photo
    x.fillStyle = t.accent; x.beginPath(); x.arc(56, 53, 8, 0, 7); x.fill();
    x.fillStyle = "#fff"; x.font = "700 22px system-ui, sans-serif"; x.fillText(plural(n, "projet", "projets", "project", "projects"), 74, 61);
    x.fillStyle = t.accent; roundRect(x, 44, HERO + 22, 110, 8, 4); x.fill();
    x.fillStyle = "#fff"; x.font = "700 46px system-ui, sans-serif";
    let y = HERO + 86; for (const l of lines(x, T.label, W2 - 88, 2)) { x.fillText(l, 44, y); y += 54; }
    x.fillStyle = "rgba(220,238,244,0.78)"; x.font = "400 27px system-ui, sans-serif";
    for (const l of lines(x, T.tagline, W2 - 88, 2)) { x.fillText(l, 44, y + 4); y += 35; }
    const by = H2 - 92;                                                                          // call to action
    x.fillStyle = hov ? "#2ab5b4" : "rgba(42,181,180,0.14)"; roundRect(x, 44, by, W2 - 88, 58, 29); x.fill();
    x.strokeStyle = hov ? "#8ee6e4" : "rgba(142,230,228,0.55)"; x.lineWidth = 2; roundRect(x, 44, by, W2 - 88, 58, 29); x.stroke();
    x.fillStyle = "#fff"; x.font = "600 26px system-ui, sans-serif"; x.textAlign = "center"; x.fillText(tr("Explorer les projets  ›", "Explore the projects  ›"), W2 / 2, by + 38); x.textAlign = "start";
  }, 1.4);
  const src = t.photos && t.photos[0];
  if (src) { const img = new Image(); img.onload = () => { m.userData.img = img; m.userData.redraw(); }; img.src = src; }
  return m;
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
  mesh.userData.home = mesh.position.clone(); mesh.userData.out = new THREE.Vector3(Math.sin(a), 0, -Math.cos(a)); mesh.userData.lift = 0;
  return mesh;
}
const GALLERY_AZ = ZONES.find((z) => z.key === "expertises").az, CITE_AZ = ZONES.find((z) => z.key === "cite").az;
let citeTile = null;
function buildSections(data) {
  // "Nos expertises": a 3 × 2 gallery wall on the right (the cinema is on the left, key figures behind),
  // closed by a tall featured tile: the Cité portugaise maquette, a room of its own
  const cols = [GALLERY_AZ - 22, GALLERY_AZ, GALLERY_AZ + 22], rows = [2.12, 1.12];
  data.themes.forEach((t, i) => {
    const m = makeThemePanel(t); placeAroundUser(m, cols[i % 3], rows[Math.floor(i / 3)], 2.72);
    m.userData.theme = t; m.userData.delay = 1.3 + i * 0.12; tileTargets.push(m); sections.add(m);
  });
  const head = canvasMesh(1400, 150, (x, W, H) => {
    x.textAlign = "center"; kicker(x, tr("Nos expertises", "Our expertise"), W / 2 + 3, 50, 26); x.textAlign = "center";
    x.fillStyle = "#fff"; x.font = "800 50px system-ui, sans-serif"; x.save(); x.shadowColor = "rgba(0,0,0,0.6)"; x.shadowBlur = 18; x.fillText(tr("Six métiers, des projets sur quatre continents", "Six fields of expertise, projects on four continents"), W / 2, 116); x.restore(); x.textAlign = "start";
  }, 1.4);
  placeAroundUser(head, GALLERY_AZ, 2.86, 2.74); head.userData.delay = 1.1; sections.add(head);
  citeTile = makeCiteTile(); placeAroundUser(citeTile, CITE_AZ, (rows[0] + rows[1]) / 2, 2.72);
  citeTile.userData.cite = true; citeTile.userData.delay = 1.3 + data.themes.length * 0.12; tileTargets.push(citeTile); sections.add(citeTile);
  cite.available.then((ok) => { citeTile.userData.available = ok; citeTile.userData.redraw(); });
}
function makeCiteTile() { // portrait card spanning both gallery rows: drone render, title, figures, call to action
  const W = 900, H = 1938, HERO = 1060, GOLD = "#f5b942";
  const m = canvasMesh(W, H, (x, W2, H2, me) => {
    const hov = me.userData.hover, img = me.userData.img, ok = me.userData.available !== false;
    cardBg(x, W2, H2, hov ? "#8ee6e4" : GOLD);
    x.save(); roundRect(x, 8, 8, W2 - 16, HERO, 24); x.clip();
    if (img) { const r = Math.max((W2 - 16) / img.width, HERO / img.height), dw = img.width * r, dh = img.height * r; x.drawImage(img, 8 + (W2 - 16 - dw) / 2, 8 + (HERO - dh) / 2, dw, dh); }
    else { const g = x.createRadialGradient(W2 / 2, HERO * 0.45, 20, W2 / 2, HERO * 0.45, HERO * 0.7); g.addColorStop(0, "#1d5a74"); g.addColorStop(1, "#0a2033"); x.fillStyle = g; x.fillRect(0, 0, W2, HERO + 8); }
    const fade = x.createLinearGradient(0, HERO - 260, 0, HERO + 8); fade.addColorStop(0, "rgba(19,49,80,0)"); fade.addColorStop(1, "rgba(19,49,80,1)");
    x.fillStyle = fade; x.fillRect(0, HERO - 260, W2, 270);
    x.restore();
    const chip = (X, Y, text, col) => { x.font = "700 22px system-ui, sans-serif"; spaced(x, "3px"); const w = x.measureText(text).width + 64; x.fillStyle = "rgba(8,23,38,0.8)"; roundRect(x, X, Y, w, 50, 25); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(X + 26, Y + 25, 8, 0, 7); x.fill(); x.fillStyle = "#fff"; x.fillText(text, X + 44, Y + 33); spaced(x, "0px"); return w; };
    chip(30, 30, tr("EXPÉRIENCE IMMERSIVE", "IMMERSIVE EXPERIENCE"), "#8ee6e4");
    chip(30, 92, tr("PATRIMOINE MONDIAL UNESCO", "UNESCO WORLD HERITAGE"), GOLD);
    let y = HERO + 40;
    x.fillStyle = GOLD; roundRect(x, 48, y, 110, 8, 4); x.fill(); y += 58;
    kicker(x, tr("Jumeau numérique 3D par drone", "3D digital twin by drone"), 48, y, 24, "#8ee6e4"); y += 76;
    x.fillStyle = "#fff"; x.font = "800 64px system-ui, sans-serif"; x.fillText(tr("Cité portugaise", "Portuguese City"), 48, y); y += 70; x.fillText(tr("d’El Jadida", "of El Jadida"), 48, y); y += 56;
    x.fillStyle = "rgba(220,238,244,0.8)"; x.font = "400 29px system-ui, sans-serif";
    for (const l of lines(x, tr("Entrez dans la maquette de l’ancienne Mazagan : remparts, bastions, citerne et 90 photos 360°, à portée de main.", "Step into the model of old Mazagan: ramparts, bastions, cistern and 90 360° photos, within arm’s reach."), W2 - 96, 3)) { x.fillText(l, 48, y); y += 40; }
    y += 30;
    const stats = [["12", tr("lieux", "places")], ["90", tr("photos 360°", "360° photos")], ["6", tr("calques", "layers")]], sw = (W2 - 96 - 32) / 3;
    stats.forEach(([n, l], i) => {
      const sx = 48 + i * (sw + 16);
      x.fillStyle = "rgba(255,255,255,0.07)"; roundRect(x, sx, y, sw, 116, 18); x.fill();
      x.fillStyle = "#8ee6e4"; x.font = "800 48px system-ui, sans-serif"; x.fillText(n, sx + 22, y + 60);
      x.fillStyle = "rgba(234,244,248,0.8)"; x.font = "500 23px system-ui, sans-serif"; x.fillText(l, sx + 22, y + 96);
    });
    const by = H2 - 120;                                                                        // call to action
    x.fillStyle = !ok ? "rgba(255,255,255,0.08)" : hov ? "#2ab5b4" : "rgba(42,181,180,0.2)"; roundRect(x, 48, by, W2 - 96, 76, 38); x.fill();
    x.strokeStyle = !ok ? "rgba(234,244,248,0.25)" : hov ? "#8ee6e4" : "rgba(142,230,228,0.7)"; x.lineWidth = 2.5; roundRect(x, 48, by, W2 - 96, 76, 38); x.stroke();
    x.fillStyle = ok ? "#fff" : "rgba(234,244,248,0.65)"; x.font = `600 ${ok ? 31 : 25}px system-ui, sans-serif`; x.textAlign = "center";
    x.fillText(ok ? tr("Entrer dans la maquette  ›", "Enter the model  ›") : tr("Disponible dans l’application Quest", "Available in the Quest app"), W2 / 2, by + 49); x.textAlign = "start";
  }, 1.2);
  const img = new Image(); img.onload = () => { m.userData.img = img; m.userData.redraw(); }; img.src = "./cite/hero.jpg";
  // a soft gold halo behind the featured tile, breathing slowly
  const hc = document.createElement("canvas"); hc.width = 256; hc.height = 512; const hx = hc.getContext("2d");
  hx.shadowColor = "rgba(245,185,66,1)"; hx.shadowBlur = 40; hx.fillStyle = "rgba(245,185,66,1)"; roundRect(hx, 44, 44, 168, 424, 24); hx.fill();
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(W * PX * 1.2, H * PX * 1.08), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  halo.position.z = -0.03; halo.renderOrder = -1; m.add(halo); m.userData.halo = halo;
  return m;
}
function openCite(ctrl) {
  cite.available.then((ok) => {
    if (ok) { fx.click(ctrl, "select"); cite.enter(); return; }
    fx.click(ctrl); turnTo(CITE_AZ); // website build: show the tile, which says where to find it
  });
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
  const m = new THREE.Mesh(new THREE.PlaneGeometry(wPx * PX, hPx * PX), new THREE.MeshBasicMaterial({ color: 0x12304a, transparent: true, toneMapped: false }));
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
  const m = new THREE.Mesh(new THREE.PlaneGeometry(wPx * PX, hPx * PX), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
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
  popup.view = -1; // (re-shown on a language switch)
  const th = loc(popup.theme), items = th.items || [], n = items.length, ROW = 80, GAP = 8, TOP = 172, H = TOP + n * (ROW + GAP) + 58;
  setView((v) => {
    v.add(place(canvasMesh(1000, H, (x, W, H2) => {
      cardBg(x, W, H2, th.accent);
      kicker(x, plural(n, "projet", "projets", "project", "projects"), 44, 62, 21, th.accent);
      x.fillStyle = "#fff"; x.font = "700 40px system-ui, sans-serif"; x.fillText(lines(x, th.label, W - 190, 1)[0], 44, 112);
      x.fillStyle = "rgba(220,238,244,0.68)"; x.font = "400 23px system-ui, sans-serif"; x.fillText(lines(x, th.tagline, W - 190, 1)[0], 44, 146);
      x.fillStyle = "rgba(220,238,244,0.5)"; x.font = "400 21px system-ui, sans-serif"; x.textAlign = "center";
      x.fillText(tr("Pointez un projet pour voir ses détails et ses photos", "Point at a project to see its details and photos"), W / 2, H2 - 22); x.textAlign = "start";
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
        const P = loc(p), L = lines(x, P.short || P.title, W - 270, 2);
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
  th = loc(th); p = loc(p);
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
  popup.view = i;
  const th = popup.theme, items = th.items, n = items.length, p = items[i];
  const imgs = p.images && p.images.length ? p.images : (th.photos || []).slice(0, 1);
  const TXT = imgs.length > 1 ? 790 : 640, H = Math.round(detailText(measureCtx, th, p, 1000, TXT) + 120);
  setView((v) => {
    v.add(place(canvasMesh(1000, H, (x, W, H2) => {
      cardBg(x, W, H2, th.accent);
      detailText(x, th, p, W, TXT);
      x.fillStyle = "rgba(220,238,244,0.6)"; x.font = "600 22px system-ui, sans-serif"; x.textAlign = "center"; x.fillText(`${i + 1} / ${n}`, W / 2, H2 - 44); x.textAlign = "start";
    }, 1), 0, 0, 1000, H, 0, H, { dur: 0.22 }));
    const back = pill(tr("‹  Projets", "‹  Projects"), 220, 60, showList); uiTargets.push(back);
    v.add(place(back, 34, 26, 220, 60, 0.008, H, { d: 0.12, dx: 0.05 }));
    closeButton(v, H);
    const hero = photoMesh(920, 480, imgs[0]);
    v.add(place(hero, 40, 104, 920, 480, 0.006, H, { d: 0.05, dur: 0.42, s0: 0.9, dz: -0.05 }));
    if (imgs.length > 1) {
      const TW = 214, GAP = 16, tot = imgs.length * TW + (imgs.length - 1) * GAP, x0 = 40 + (920 - tot) / 2, frames = [];
      imgs.forEach((src, k) => {
        const fr = new THREE.Mesh(new THREE.PlaneGeometry((TW + 12) * PX, 142 * PX), new THREE.MeshBasicMaterial({ color: 0x8ee6e4, transparent: true, toneMapped: false }));
        v.add(place(fr, x0 + k * (TW + GAP) - 6, 598, TW + 12, 142, 0.004, H, { d: 0.22 + k * 0.06, op: k === 0 ? 1 : 0 })); frames.push(fr);
        const th2 = photoMesh(TW, 130, src);
        th2.userData.onClick = () => { hero.userData.setSrc(src); frames.forEach((f, j) => { f.userData.a.op = j === k ? 1 : 0; }); };
        uiTargets.push(th2);
        v.add(place(th2, x0 + k * (TW + GAP), 604, TW, 130, 0.007, H, { d: 0.2 + k * 0.06, dy: -0.04, s0: 0.9 }));
      });
    }
    const prev = pill(tr("‹  Précédent", "‹  Previous"), 250, 60, () => showDetail((i - 1 + n) % n)), next = pill(tr("Suivant  ›", "Next  ›"), 250, 60, () => showDetail((i + 1) % n));
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
const fmtFr = (n) => num(n); // 475 900 / 475,900
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
  [{ v: first, l: tr("parcelles inventoriées", "parcels inventoried"), teal: false }, { v: last, l: tr("titres d’occupation délivrés", "occupancy titles issued"), teal: true }].forEach((b, i) => {
    const bx = L + i * (bw + 24), by = 296;
    x.fillStyle = b.teal ? "rgba(42,181,180,0.22)" : "rgba(255,255,255,0.08)"; roundRect(x, bx, by, bw, 120, 22); x.fill();
    if (b.teal) { x.strokeStyle = "rgba(142,230,228,0.5)"; x.lineWidth = 2; roundRect(x, bx, by, bw, 120, 22); x.stroke(); }
    x.fillStyle = "#fff"; x.font = "800 58px system-ui, sans-serif"; x.fillText(fmtFr(Math.round(b.v * ease3(t, 0.1 + i * 0.25, 1.6))), bx + 28, by + 68);
    x.fillStyle = "rgba(255,255,255,0.78)"; x.font = "400 24px system-ui, sans-serif"; x.fillText(b.l, bx + 28, by + 102);
  });
  // funnel
  kicker(x, tr("La chaîne foncière intégrée", "The integrated land chain"), L, 476, 22, "#2ab5b4");
  x.fillStyle = "#fff"; x.font = "600 38px system-ui, sans-serif"; x.fillText(tr("De l’inventaire au titre d’occupation", "From inventory to occupancy title"), L, 522);
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
  x.fillText(pct(rate * 100 * rp), cx, cy + 10); x.textAlign = "start";
  x.fillStyle = "#fff"; x.font = "400 30px system-ui, sans-serif"; x.fillText(tr("des parcelles inventoriées ont abouti", "of the inventoried parcels have led"), cx + R + 40, cy - 6);
  x.fillStyle = "#8ee6e4"; x.font = "700 30px system-ui, sans-serif"; x.fillText(tr("à un titre d’occupation", "to an occupancy title"), cx + R + 40, cy + 32);
  // territorial footprint
  kicker(x, tr("Une empreinte territoriale majeure", "A major territorial footprint"), L, 1212, 22, "#2ab5b4");
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
  kicker(x, tr("Un déploiement territorial à grande échelle", "Large-scale territorial deployment"), L, ty, 22, "#2ab5b4");
  x.fillStyle = "#fff"; x.font = "600 38px system-ui, sans-serif"; x.fillText(tr("Une couverture structurée", "Structured coverage"), L, ty + 46);
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

function makeInfoPanel(draw, getD, W, H, widthM) { // getD(): the figures in the current language
  const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  draw(x, W, H, getD(), 99); // at rest the panel shows the real figures; facing it replays the count-up
  const mesh = panelMesh(c, widthM, widthM * H / W), tex = mesh.material.map;
  const mips = (on) => { if (tex.generateMipmaps === on) return; tex.generateMipmaps = on; tex.minFilter = on ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter; tex.dispose(); };
  // animation frames skip the mip chain (a full rebuild per frame is what made the count-ups crawl on the Quest)
  return { mesh, redraw: (t, last = false) => { draw(x, W, H, getD(), t); mips(last); tex.needsUpdate = true; } };
}

function buildChiffres(data) {
  const Y = 1.62, R = 2.6;
  const header = (() => {
    const W = 1024, H = 190, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    const mesh = panelMesh(c, 1.7, 1.7 * H / W);
    mesh.userData.redraw = () => {
      x.clearRect(0, 0, W, H);
      x.fillStyle = "rgba(8,23,38,0.85)"; roundRect(x, 0, 0, W, H, 26); x.fill();
      x.strokeStyle = "rgba(42,181,180,0.8)"; x.lineWidth = 3; roundRect(x, 4, 4, W - 8, H - 8, 23); x.stroke();
      x.textAlign = "center"; kicker(x, tr("Chiffres clés", "Key figures"), W / 2 + 2, 66, 28); x.textAlign = "center";
      x.fillStyle = "#fff"; x.font = "700 54px system-ui, sans-serif"; x.fillText(tr("Nos programmes fonciers en chiffres", "Our land programmes in figures"), W / 2, 140); x.textAlign = "start";
      mesh.material.map.needsUpdate = true;
    };
    mesh.userData.redraw();
    return mesh;
  })();
  placeAroundUser(header, 180, 2.96, R); sections.add(header);
  [
    { draw: drawProcasef, key: "procasef", H: 1510, az: 160 },
    { draw: drawPamofor, key: "pamofor", H: 1410, az: -160 },
  ].forEach((p) => {
    const ip = makeInfoPanel(p.draw, () => (I18N.lang === "en" && data.en ? data.en : data)[p.key], 1000, p.H, 1.44);
    placeAroundUser(ip.mesh, p.az, Y, R); sections.add(ip.mesh);
    const dir = ip.mesh.position.clone().sub(USER); dir.y = 0; dir.normalize();
    chiffresPanels.push({ ...ip, dir, armed: true, active: false, t0: 0, lastDraw: 0 });
  });
}

// ── country project panel (from globe selection) ────────────────────────────────
// country banners (flag × landmark, scripts/build-xr-country-banners.mjs — shared with the /evenement kiosk)
const bannerCache = new Map();
function countryBanner(iso) {
  if (!bannerCache.has(iso)) bannerCache.set(iso, new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = `/etafat/presence/banners/${iso}.jpg`; }));
  return bannerCache.get(iso);
}
function makeCountryPanel(country) {
  country = loc(country);
  const projs = country.projects || [], shown = projs.slice(0, 7), BH = 333; // banner 1000×333 (3:1)
  const measure = measureCtx; measure.font = "400 28px system-ui, sans-serif";
  let hTxt = 0; for (const p of shown) hTxt += lines(measure, p.place ? `${p.title} — ${p.place}` : p.title, 1000 - 140, 2).length * 36 + 14;
  const H = Math.round(BH + 70 + (shown.length ? hTxt : 90) + (projs.length > shown.length ? 40 : 10));
  const card = canvasMesh(1000, H, (x, W, H2, me) => {
    cardBg(x, W, H2, "#2ab5b4");
    x.save(); roundRect(x, 4, 4, W - 8, H2 - 8, 27); x.clip();              // banner, clipped to the card's rounded top
    const img = me.userData.banner;
    if (img) x.drawImage(img, 4, 4, W - 8, BH);
    else { const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, "#0d3350"); g.addColorStop(1, "#16486b"); x.fillStyle = g; x.fillRect(4, 4, W - 8, BH); }
    const sh = x.createLinearGradient(0, BH * 0.12, 0, BH); sh.addColorStop(0, "rgba(8,23,38,0)"); sh.addColorStop(0.55, "rgba(8,23,38,0.45)"); sh.addColorStop(1, "rgba(8,23,38,0.72)");
    x.fillStyle = sh; x.fillRect(4, 4, W * 0.72, BH);
    x.restore();
    x.fillStyle = "#2ab5b4"; x.fillRect(4, BH + 4, W - 8, 5);              // teal seam under the banner
    x.save(); x.shadowColor = "rgba(0,0,0,0.65)"; x.shadowBlur = 14;       // name set on the banner, above its caption
    kicker(x, (country.region || "") + (projs.length ? `  ·  ${plural(projs.length, "projet", "projets", "project", "projects")}` : ""), 44, BH - 138, 21, "#bff6f4");
    x.fillStyle = "#fff"; x.font = "800 62px system-ui, sans-serif"; x.fillText(lines(x, country.name, W * 0.66, 1)[0], 44, BH - 76);
    x.restore();
    let y = BH + 66; x.font = "400 28px system-ui, sans-serif";
    if (shown.length) for (const p of shown) {
      x.fillStyle = "#2ab5b4"; x.fillText("▸", 48, y);
      x.fillStyle = "#eaf4f8"; for (const l of lines(x, p.place ? `${p.title} — ${p.place}` : p.title, W - 140, 2)) { x.fillText(l, 86, y); y += 36; } y += 14;
    } else { x.fillStyle = "rgba(234,244,248,0.72)"; x.font = "400 30px system-ui, sans-serif"; for (const l of lines(x, tr("Présence ETAFAT — projets en cours de référencement.", "ETAFAT presence — projects being documented."), W - 96, 2)) { x.fillText(l, 48, y); y += 40; } }
    if (projs.length > shown.length) { x.fillStyle = "#8ee6e4"; x.font = "600 24px system-ui, sans-serif"; x.fillText(tr(`+ ${projs.length - shown.length} autres projets`, `+ ${projs.length - shown.length} more projects`), 48, H2 - 30); }
  }, 1);
  countryBanner(country.iso).then((img) => { if (img) { card.userData.banner = img; card.userData.redraw(); } });
  return card;
}
let cPull = null; const cClosing = [];   // current country pop-up + ones retracting
let cCand = null, cDwell = 0;            // hover candidate (debounced)
const beadGeo = new THREE.SphereGeometry(0.0048 * GK, 8, 6), LEAD_N = 22; // dotted leader (a 1 px line vanishes in the headset)
const leadCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()), _lp = new THREE.Vector3();
function pullCountry(hit) {
  if (cPull && cPull.country === hit.country) { cPull.idle = 0; return; }
  if (cPull) { cPull.closing = true; cClosing.push(cPull); }
  const card = makeCountryPanel(hit.country); card.scale.setScalar(0.74); card.renderOrder = 30; card.material.depthTest = true;
  const g = new THREE.Group(); g.add(card); g.scale.setScalar(0.001); scene.add(g);
  const line = new THREE.InstancedMesh(beadGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, toneMapped: false }), LEAD_N); line.frustumCulled = false; scene.add(line);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.018 * GK, 0.027 * GK, 28), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
  ring.position.copy(hit.local).setLength(GLOBE_R * 1.006); ring.lookAt(_v.copy(ring.position).multiplyScalar(9)); spin.add(ring);
  cPull = { country: hit.country, local: hit.local.clone(), g, card, line, ring, t: 0, idle: 0, closing: false, cardH: card.geometry.parameters.height * 0.8 };
}
const _a = new THREE.Vector3(), _to = new THREE.Vector3(), _e = new THREE.Vector3();
function updateCountryPull(dt, hit, onPanel, elapsed) {
  // hover: switch after a short dwell, keep while the pointer is on the country or its pop-up, retract after ~1.6 s away
  const cand = hit ? hit.country : null;
  if (cand && (!cPull || cPull.country !== cand)) { if (cCand === cand) cDwell += dt; else { cCand = cand; cDwell = 0; } if (cDwell > 0.16) { pullCountry(hit); cCand = null; } }
  else { cCand = null; cDwell = 0; }
  if (cPull) { if (cand === cPull.country || onPanel) cPull.idle = 0; else cPull.idle += dt; if (cPull.idle > 1.6) { cPull.closing = true; cClosing.push(cPull); cPull = null; } }
  for (const P of [cPull, ...cClosing]) {
    if (!P) continue;
    P.t = Math.min(1, Math.max(0, P.t + (P.closing ? -dt * 4 : dt * 2.4)));
    _a.copy(P.local).setLength(GLOBE_R * 1.006); spin.localToWorld(_a); // the country's point on the globe
    const side = _a.x >= GLOBE_POS.x ? 1 : -1;                    // pop out on the country's side…
    _to.set(side * 0.72, 1.47, -1.05);                            // …but close to the viewer (~1.27 m, ~34° off-centre)
    const k = P.closing ? easeOut(P.t) : easeBack(P.t);
    P.g.position.lerpVectors(_a, _to, P.closing ? easeOut(P.t) : easeOut(Math.min(1, P.t * 1.25)));
    P.g.lookAt(USER.x, P.g.position.y, USER.z);
    P.g.scale.setScalar(Math.max(0.001, 0.06 + 0.94 * k));
    P.card.material.opacity = Math.min(1, P.t * 2);
    _e.set(-side * 0.363, 0, 0).applyQuaternion(P.g.quaternion).multiplyScalar(P.g.scale.x).add(P.g.position); // inner edge of the card
    // leader: bows out from the surface so it never cuts through the globe
    leadCurve.v0.copy(_a); leadCurve.v1.copy(_a).sub(GLOBE_POS).setLength(GLOBE_R + 0.24 * GK).add(GLOBE_POS); leadCurve.v2.copy(_e);
    const shown = P.t * LEAD_N;                                   // beads run out with the card
    for (let i = 0; i < LEAD_N; i++) {
      leadCurve.getPoint(i / (LEAD_N - 1), _lp); dummy.position.copy(_lp); dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(i < shown ? 0.75 + 0.5 * Math.max(0, Math.sin(elapsed * 6 - i * 0.55)) : 0.001); dummy.updateMatrix(); P.line.setMatrixAt(i, dummy.matrix);
    }
    P.line.instanceMatrix.needsUpdate = true; P.line.material.opacity = Math.min(1, P.t * 1.5);
    P.ring.material.opacity = Math.min(1, P.t * 2) * (0.65 + 0.35 * Math.sin(elapsed * 5)); P.ring.scale.setScalar(1 + 0.25 * Math.sin(elapsed * 5));
    if (P.closing && P.t === 0) { scene.remove(P.g); scene.remove(P.line); spin.remove(P.ring); disposeView(P.g); P.line.material.dispose(); P.ring.geometry.dispose(); P.ring.material.dispose(); cClosing.splice(cClosing.indexOf(P), 1); }
  }
}

// title card just above the globe, facing the viewer (solid, so it reads against the bright sky)
const titleCard = (() => {
  const draw = (x, W, H, me) => {
    cardBg(x, W, H, "#2ab5b4");
    const cw = 250, ch = H - 44;                                           // logo on a light chip
    x.fillStyle = "rgba(255,255,255,0.96)"; roundRect(x, 22, 22, cw, ch, 20); x.fill();
    const img = me.userData.logo;
    if (img) { const r = Math.min((cw - 36) / img.width, (ch - 30) / img.height); x.drawImage(img, 22 + (cw - img.width * r) / 2, 22 + (ch - img.height * r) / 2, img.width * r, img.height * r); }
    const n = DATA ? DATA.countries.length : 29, tx = cw + 60;
    kicker(x, tr("Notre présence dans le monde", "Our presence worldwide"), tx, 62, 20, "#8ee6e4");
    x.fillStyle = "#fff"; x.font = "800 50px system-ui, sans-serif"; x.fillText(tr(`${n} pays · 4 continents`, `${n} countries · 4 continents`), tx, 122);
    x.fillStyle = "rgba(220,238,244,0.78)"; x.font = "400 23px system-ui, sans-serif";
    x.fillText(tr("Joystick : tourner le globe  ·  Pointez un pays pour ses projets", "Joystick: turn the globe  ·  Point at a country for its projects"), tx, 168);
  };
  const m = canvasMesh(1000, 200, draw, 1.5);
  m.scale.setScalar(1.12);
  m.position.set(GLOBE_POS.x, GLOBE_POS.y + GLOBE_R + 0.22, GLOBE_POS.z + 0.25);
  m.lookAt(USER);
  scene.add(m);
  const img = new Image(); img.onload = () => { m.userData.logo = img; m.userData.redraw(); }; img.src = "/etafat/logo-footer.png";
  return m;
})();

// ── controllers (on the rig) ─────────────────────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const tmpM = new THREE.Matrix4();
const controllers = [];
const reticle = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), new THREE.MeshBasicMaterial({ color: TEAL_L, toneMapped: false, depthTest: false }));
reticle.renderOrder = 70; reticle.visible = false; scene.add(reticle);
for (let i = 0; i < 2; i++) {
  const ctrl = renderer.xr.getController(i);
  const ray = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]),
    new THREE.LineBasicMaterial({ color: TEAL_L, transparent: true, opacity: 0.6, toneMapped: false }));
  ctrl.add(ray); ctrl.userData.ray = ray;
  ctrl.addEventListener("connected", (e) => { ctrl.userData.source = e.data; });
  ctrl.addEventListener("disconnected", () => { ctrl.userData.source = null; });
  ctrl.addEventListener("selectstart", () => { fx.unlock(); if (cite.active) return; aim(ctrl); activate(pick(ctrl), ctrl); }); // the Cité room has its own handlers
  rig.add(ctrl); controllers.push(ctrl);
}
function aim(originObj) {
  tmpM.identity().extractRotation(originObj.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(originObj.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tmpM);
}
// one pointer router: dock & cinema → pop-up UI → country pop-up → globe countries → gallery tiles
function pick(ctrl) {
  const hud = [...dock.targets, ...(cinema ? cinema.targets : [])].filter((m) => m.visible && (!m.parent || m.parent.visible));
  let h = hud.length ? raycaster.intersectObjects(hud, false)[0] : null;
  if (h) return { kind: "hud", obj: h.object, point: h.point, uv: h.uv, ctrl };
  h = uiTargets.length ? raycaster.intersectObjects(uiTargets, false)[0] : null;
  if (h) return { kind: "ui", obj: h.object, point: h.point, ctrl };
  if (cPull) { h = raycaster.intersectObject(cPull.card, false)[0]; if (h) return { kind: "card", point: h.point, ctrl }; }
  const ch = countryAtRay(); if (ch) return { kind: "country", hit: ch, point: raycaster.intersectObject(sphere, false)[0]?.point, ctrl };
  h = tileTargets.length ? raycaster.intersectObjects(tileTargets, false)[0] : null;
  if (h) return { kind: "tile", obj: h.object, point: h.point, ctrl };
  return null;
}
function activate(p, ctrl) {
  if (!p) return;
  if (p.kind === "hud") { const u = p.obj.userData; if (u.onClick) { if (!u.onHover) fx.click(ctrl); u.onClick({ uv: p.uv, ctrl }); } return; }
  if (p.kind === "ui") { fx.click(ctrl); p.obj.userData.onClick(); return; }
  if (p.kind === "tile") { if (p.obj.userData.cite) { openCite(ctrl); return; } fx.click(ctrl, "select"); openThemePopup(p.obj); return; }
  if (p.kind === "country") { fx.click(ctrl, "select"); pullCountry(p.hit); }
}

// ── turning: dock buttons and snap-turn rotate the rig around the head (VR); desktop eases the view ──
const _head = new THREE.Vector3(), _dir = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
let lookTween = null;
// head pose: always from the rig's camera — in XR three keeps it at rig × headset pose after each frame, whereas
// getWorldPosition/Direction on renderer.xr.getCamera() (no parent) silently drop the rig's turns and offset
function headAz() { camera.getWorldDirection(_dir); return Math.atan2(_dir.x, -_dir.z); }
function turnBy(rad, fade = true) {
  if (!renderer.xr.isPresenting) { lookTween = { from: lookYaw, to: lookYaw - rad, t: 0 }; return; } // desktop: lookYaw is the azimuth faced
  const go = () => { camera.getWorldPosition(_head); rig.position.sub(_head).applyAxisAngle(UP, rad).add(_head); rig.rotation.y += rad; dock.shift(-rad); };
  if (fade) fx.blackout(go, 9); else go();
}
function turnTo(azDeg) { const d = headAz() - azDeg * DEG; turnBy(Math.atan2(Math.sin(d), Math.cos(d))); fx.sfx("whoosh", 0.35); }

// ── dock + cinema ───────────────────────────────────────────────────────────────────────────────────
const dock = createDock({
  scene, camera, renderer, zones: ZONES,
  getAmbiance: () => world.ambiance, getMusic: () => fx.on.music,
  onZone: (key) => (key === "cite" ? openCite(null) : turnTo(ZONES.find((z) => z.key === key).az)),
  getXR: () => {
    const st = xrState();
    if (st.mode === "ar") return { icon: "vr", label: tr("Revenir en réalité virtuelle", "Back to virtual reality") };
    if (!st.ar) return { icon: "ar", label: tr("AR indisponible sur cet appareil", "AR not available on this device") };
    return { icon: "ar", label: st.mode ? tr("Passer en AR (passthrough)", "Switch to AR (passthrough)") : tr("Entrer en AR (passthrough)", "Enter AR (passthrough)") };
  },
  // FR ⇄ EN: the icon shows the language a click switches to
  getLang: () => (I18N.lang === "en" ? { icon: "fr", label: "Passer en français" } : { icon: "en", label: "Switch to English" }),
  onLang: () => I18N.toggle(),
  onXR: () => { const st = xrState(); if (st.ar) switchXR(st.mode === "ar" ? "vr" : "ar"); },
  onAmbiance: (k) => fx.blackout(() => world.setAmbiance(k), 5),
  onMusic: (v) => { fx.setMusic(v); syncAudioBtn(); },
});
let cinema = null;
// the Cité portugaise maquette: a room of its own (same session, rig, controllers, hands and sound)
const cite = createCite({
  renderer, camera, user: rig, home: scene, fx, controllers, hintEl: document.getElementById("hint"),
  xr: { state: xrState, go: switchXR },
  onEnter: () => { if (cinema) cinema.pause(); setHover(null); },
  onAudio: () => { syncAudioBtn(); dock.targets.forEach((t) => t.userData.redraw()); },
});
world.ready.then(() => setTimeout(() => cite.available.then((ok) => { if (ok) cite.prepare(); }), 2500)); // build it quietly once the valley is in
world.ready.then(() => {
  cinema = createCinema({ scene, fx, world, az: ZONES.find((z) => z.key === "cinema").az });
  const ld = document.getElementById("loading"); if (ld) ld.classList.add("hide"); // landscape, crew and models are in
});

// desktop fallback: drag to look around, click to select, arrows spin the globe
let mouseNDC = null;
const keys = new Set();
addEventListener("keydown", (e) => { fx.unlock(); if (cite.active) return; if (e.key.startsWith("Arrow")) { keys.add(e.key); e.preventDefault(); } });
addEventListener("keyup", (e) => keys.delete(e.key));
renderer.domElement.addEventListener("pointerleave", () => { mouseNDC = null; });
let dragging = false, px = 0, py = 0, moved = 0, manualSpin = 0, tiltY = 0, lookYaw = 0, lookPitch = 0;
camera.rotation.order = "YXZ";
renderer.domElement.addEventListener("pointerdown", (e) => { fx.unlock(); if (cite.active) return; dragging = true; px = e.clientX; py = e.clientY; moved = 0; lookTween = null; });
renderer.domElement.addEventListener("pointermove", (e) => {
  mouseNDC = new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  if (!dragging) return; const dx = e.clientX - px, dy = e.clientY - py; moved += Math.abs(dx) + Math.abs(dy);
  if (!renderer.xr.isPresenting) { lookYaw += dx * 0.004; lookPitch = THREE.MathUtils.clamp(lookPitch + dy * 0.003, -0.8, 0.8); }
  px = e.clientX; py = e.clientY;
});
addEventListener("pointerup", (e) => {
  if (dragging && moved < 6 && !renderer.xr.isPresenting && !cite.active) {
    raycaster.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera);
    activate(pick(null), null);
  }
  dragging = false;
});

// music button (2D page)
const audioBtn = document.getElementById("audio-toggle");
function syncAudioBtn() { if (audioBtn) audioBtn.textContent = fx.on.music ? tr("♪ Musique", "♪ Music") : tr("♪ Muet", "♪ Muted"); }
if (audioBtn) audioBtn.addEventListener("click", (e) => { e.stopPropagation(); fx.unlock(); fx.setMusic(!fx.on.music); syncAudioBtn(); dock.targets.forEach((t) => t.userData.redraw()); });
syncAudioBtn();

// ── language (FR ⇄ EN): the 2D page switch, the dock button and ?lang=; every panel redraws in place ──
const langBtns = [...document.querySelectorAll("#lang-toggle button")];
langBtns.forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); fx.unlock(); I18N.set(b.dataset.lang); }));
function syncPage() {
  const en = I18N.lang === "en";
  document.title = en ? "ETAFAT · VR experience" : "ETAFAT · Expérience VR";
  for (const el of document.querySelectorAll("[data-en]")) if (!(el.id === "hint" && cite.active)) el.textContent = el.dataset[I18N.lang];
  langBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === I18N.lang)));
  syncXrButtons(); syncAudioBtn();
}
I18N.on(() => {
  syncPage();
  sections.traverse((o) => { if (o.userData.redraw) o.userData.redraw(); }); // gallery tiles, headers, Cité tile
  for (const p of chiffresPanels) if (!p.active) p.redraw(99, true); // (a running count-up redraws itself)
  titleCard.userData.redraw();
  if (popup && !popup.closing) { if (popup.view >= 0) showDetail(popup.view); else showList(); }
  if (cPull) { cPull.closing = true; cClosing.push(cPull); cPull = null; } // the next country pointed at opens in the new language
  dock.refresh();
});
syncPage();
renderer.xr.addEventListener("sessionstart", () => { // replay the entrance in the headset (not on a VR ⇄ AR switch)
  fx.unlock(); if (!switching) elapsed = 0; switching = false; fx.reveal(0.7); rig.position.set(0, 0, 0); rig.rotation.set(0, 0, 0);
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
let elapsed = location.search.includes("nointro") ? 6 : 0; // debug: skip the entrance animation
if (location.search.includes("nointro")) fx.reveal(50);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const camDir = new THREE.Vector3();
const stickPrev = new Map();
let hoverKey = null;
if (location.search.includes("debug")) window.XR = { pullCountry, countryAtRay, get cPull() { return cPull; }, get mouseNDC() { return mouseNDC; }, globe, spin, raycaster, openThemePopup, showDetail, uiTargets, get popup() { return popup; }, tileTargets, chiffresPanels, world, get data() { return DATA; }, camera, renderer, scene, sections, rig, fx, dock, get cinema() { return cinema; }, turnTo, get elapsed() { return elapsed; }, set elapsed(v) { elapsed = v; }, cite, citeTile: () => citeTile, openCite, switchXR, setAR, I18N,
  async pump(ms = 1000) { const end = performance.now() + ms; while (performance.now() < end) { loop(); await new Promise((r) => setTimeout(r, 16)); } } };

renderer.setAnimationLoop(loop);
function loop() {
  const dt = Math.min(0.05, clock.getDelta()); elapsed += dt;
  const xr = renderer.xr.isPresenting;
  if (cite.active) { // in the Cité room: the valley is not rendered at all
    fx.update(dt); if (xr) fx.updateHands(controllers);
    cite.update(dt); renderer.render(cite.scene, camera); return;
  }

  // entrance: the globe scans in, the gallery flies in (per tile), the dock and the title follow
  reveal.value = easeOut(Math.min(1, Math.max(0, (elapsed - 0.5) / 2.2)));
  const gi = easeOut(Math.min(1, Math.max(0, (elapsed - 0.3) / 1.6)));
  globe.scale.setScalar(0.82 + 0.18 * gi); atmo.material.opacity = gi;
  titleCard.material.opacity = easeOut(Math.min(1, Math.max(0, (elapsed - 2.4) / 0.8))); titleCard.visible = titleCard.material.opacity > 0.01;
  emitter.userData.cone.uniforms.uTime.value = elapsed;
  dock.visible = elapsed > 2.8;
  if (!arMode) world.update(dt, elapsed);
  fx.update(dt);
  if (xr) fx.updateHands(controllers);
  if (cinema) cinema.update(dt, elapsed);

  // desktop view: drag-look, or ease toward a zone chosen on the dock
  if (!xr) {
    if (lookTween) { lookTween.t = Math.min(1, lookTween.t + dt * 1.8); lookYaw = lookTween.from + (lookTween.to - lookTween.from) * easeOut(lookTween.t); lookPitch *= 0.9; if (lookTween.t === 1) lookTween = null; }
    camera.rotation.set(-lookPitch, -lookYaw, 0);
  }

  // pointer: dock & cinema, pop-ups, country pop-up, globe, gallery (VR: both controllers; desktop: mouse)
  let hit = null;
  const rays = xr ? controllers : (mouseNDC && !(dragging && moved > 6) ? [null] : []);
  for (const ctrl of rays) { if (ctrl) aim(ctrl); else raycaster.setFromCamera(mouseNDC, camera); hit = pick(ctrl); if (hit) break; }
  const hoverMesh = hit && (hit.kind === "hud" || hit.kind === "ui" || hit.kind === "tile") ? hit.obj : null;
  setHover(hoverMesh);
  for (const m of [...dock.targets, ...(cinema ? cinema.targets : [])]) if (m.userData.onHover) m.userData.onHover(hit && hit.obj === m ? { uv: hit.uv, ctrl: hit.ctrl } : null);
  const key = hit ? (hit.kind === "country" ? "c" + hit.hit.country.iso : hit.obj ? hit.obj.uuid : hit.kind) : null;
  if (key && key !== hoverKey && hit.kind !== "card" && !(hit.obj && hit.obj.userData.onHover)) fx.hover(hit.ctrl);
  hoverKey = key;
  const cHit = hit && hit.kind === "country" ? hit.hit : null, onPanel = hit && hit.kind === "card";
  if (xr) { reticle.visible = !!(hit && hit.point); if (reticle.visible) reticle.position.copy(hit.point); }
  else renderer.domElement.style.cursor = hit && hit.kind !== "card" ? "pointer" : "";
  updateCountryPull(dt, cHit, onPanel, elapsed);
  updateCountryHighlight(elapsed, cPull ? cPull.country.iso : (cHit ? cHit.country.iso : null));

  // sticks: on the globe they spin / tilt it; elsewhere a flick turns you by 30°
  let thumb = 0;
  if (xr) {
    const s = renderer.xr.getSession();
    if (s) for (const src of s.inputSources) {
      const gp = src.gamepad; if (!gp || !gp.axes) continue;
      const ax = gp.axes[2] ?? gp.axes[0] ?? 0, ay = gp.axes[3] ?? gp.axes[1] ?? 0;
      const ctrl = controllers.find((c) => c.userData.source === src), onGlobe = hit && hit.kind === "country" && (!hit.ctrl || hit.ctrl === ctrl) || (ctrl && (aim(ctrl), raycaster.intersectObject(sphere, false).length > 0));
      const prev = stickPrev.get(src) || 0, flick = ax > 0.75 ? 1 : ax < -0.75 ? -1 : 0;
      if (onGlobe) { if (Math.abs(ax) > 0.15) thumb += ax; if (Math.abs(ay) > 0.25) tiltY = THREE.MathUtils.clamp(tiltY - ay * dt * 0.9, -0.55, 0.55); }
      else if (flick && flick !== prev) { turnBy(-flick * 30 * DEG); fx.sfx("whoosh", 0.18); }
      stickPrev.set(src, onGlobe ? 0 : flick);
    }
  }
  if (keys.has("ArrowLeft")) thumb -= 1; if (keys.has("ArrowRight")) thumb += 1;
  if (keys.has("ArrowUp")) tiltY = Math.min(0.55, tiltY + dt * 0.9); if (keys.has("ArrowDown")) tiltY = Math.max(-0.55, tiltY - dt * 0.9);
  spin.rotation.y += manualSpin + thumb * dt * 1.5; manualSpin *= 0.86;
  spin.rotation.x = THREE.MathUtils.clamp(spin.rotation.x + (tiltY - spin.rotation.x) * 0.1, -0.6, 0.6);
  arcTime.value = elapsed;
  dock.update(dt, elapsed);

  animatePopup(dt);

  // gallery: tiles fly in one after another, then breathe gently and lift toward the pointer
  for (const m of sections.children) {
    const u = m.userData; if (!u.home) continue;
    const e = easeOut(Math.min(1, Math.max(0, (elapsed - (u.delay ?? 1)) / 0.9)));
    u.lift += ((m === uiHover ? 1 : 0) - u.lift) * Math.min(1, dt * 10);
    m.position.copy(u.home).addScaledVector(u.out, (1 - e) * 0.9 - u.lift * 0.1);
    m.position.y = u.floatBase - (1 - e) * 0.25 + Math.sin(elapsed * 0.7 + u.phase) * 0.008;
    m.scale.setScalar(0.92 + 0.08 * e + u.lift * 0.025);
    m.material.opacity = e; m.visible = e > 0.001;
    if (u.halo) u.halo.material.opacity = e * (0.22 + 0.1 * Math.sin(elapsed * 1.6) + u.lift * 0.25);
  }

  // chiffres wall: replay a panel's count-up whenever the viewer turns to face it (real figures the rest of the
  // time). Wall-clock timed, so dropped frames can't stretch it; one panel redrawn per frame, ~20 fps each.
  if (chiffresPanels.length) {
    camera.getWorldDirection(camDir); camDir.y = 0; camDir.normalize();
    const now = performance.now(); let drew = false;
    for (const cp of chiffresPanels) {
      const dot = camDir.dot(cp.dir);
      if (cp.armed && dot > 0.8) { cp.armed = false; cp.active = true; cp.t0 = now; cp.lastDraw = 0; }
      else if (!cp.armed && !cp.active && dot < 0.1) cp.armed = true; // looked away: replay next time
      if (cp.active && !drew && now - cp.lastDraw > 50) {
        const t = (now - cp.t0) / 1000 * 1.45, last = t > 3.4; // whole sequence ≈ 2.3 s
        cp.redraw(last ? 99 : t, last); cp.lastDraw = now; drew = true;
        if (last) cp.active = false;
      }
    }
  }

  renderer.render(scene, camera);
}
