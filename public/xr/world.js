// ETAFAT VR — living landscape around the lookout.
// Real relief of the Aït Bouguemez valley (High Atlas, Morocco) + a survey crew at work:
// plan-table team, total station & prism, GNSS rover, drone pilot, LiDAR drones painting a
// point cloud, a mobile-mapping 4×4, villages, trees, birds, clouds.
// World units are metres; +x = east, −z = north (the viewer looks north across the valley).
import * as THREE from "three";
import { GLTFLoader } from "./vendor/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "./vendor/jsm/utils/SkeletonUtils.js";
import { mergeGeometries, mergeVertices } from "./vendor/jsm/utils/BufferGeometryUtils.js";
import { Sky } from "./vendor/jsm/objects/Sky.js";

const TEAL = 0x2ab5b4, TEAL_L = 0x8ee6e4;
const DEG = Math.PI / 180;

/* ------------------------------ helpers ------------------------------ */
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hash2(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy), b = hash2(ix + 1, iy), c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const sstep = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
function solid(g, hex) { // geometry → non-indexed, vertex-coloured (for merging / instancing)
  g = g.index ? g.toNonIndexed() : g; if (g.attributes.uv) g.deleteAttribute("uv");
  const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute("color", new THREE.BufferAttribute(a, 3)); return g;
}
const lambert = (o = {}) => new THREE.MeshLambertMaterial({ flatShading: true, ...o });
// Quest budget: every Mesh is a draw call per eye (+ one per shadow pass), so static props are
// baked into one vertex-coloured mesh each. `keep` = sub-trees that move on their own.
const BAKED = lambert({ vertexColors: true }), BAKED_SMOOTH = new THREE.MeshLambertMaterial({ vertexColors: true });
function bake(root, { keep = [], smooth = false } = {}) {
  const skip = new Set(); for (const k of keep) k.traverse((o) => skip.add(o));
  root.updateMatrixWorld(true);
  const inv = root.matrixWorld.clone().invert(), geos = [], done = [];
  let cast = false, recv = false;
  root.traverse((m) => {
    if (!m.isMesh || m.isInstancedMesh || m.isSkinnedMesh || skip.has(m) || m.children.length) return;
    const mat = m.material; if (!mat.isMeshLambertMaterial || mat.map || mat.transparent || mat.vertexColors) return;
    geos.push(solid(m.geometry.clone(), mat.color).applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld)));
    cast ||= m.castShadow; recv ||= m.receiveShadow; done.push(m);
  });
  if (geos.length < 2) return root;
  for (const m of done) m.removeFromParent();
  const mesh = new THREE.Mesh(mergeGeometries(geos), smooth ? BAKED_SMOOTH : BAKED);
  mesh.castShadow = cast; mesh.receiveShadow = recv; root.add(mesh);
  return root;
}
const polar = (azDeg, d) => [d * Math.sin(azDeg * DEG), -d * Math.cos(azDeg * DEG)];
// Futuristic city on the flat valley floor ~3.2 km north-east (line-of-sight checked on the DEM),
// framed in the gap between the globe (±18°) and the right-hand tiles (from 56°).
const CITY = { az: 39, d: 3200, r: 720 };
const [CITY_X, CITY_Z] = polar(CITY.az, CITY.d);
const cityDist = (x, z) => Math.hypot(x - CITY_X, z - CITY_Z);

/* ------------------------------- world ------------------------------- */
export function createWorld({ scene, renderer, camera }) {
  const updaters = [];
  const api = { heightAt: () => 0, ready: null, update(dt, t) { for (const u of updaters) u(dt, t); } };
  // everything the landscape builds lives under one group, so AR (passthrough) can drop it in one go
  const root = new THREE.Group(); root.name = "world"; scene.add(root);
  setupSkyAndLight(scene, root, renderer, camera, updaters, api);
  updaters.push((dt, t) => { TIME.value = t; });
  api.ready = (async () => {
    const scene = root; // the builders below only add objects
    const T = await buildTerrain(scene);
    api.heightAt = T.heightAt;
    buildVegetation(scene, T);
    buildVillages(scene, T);
    buildCity(scene, T, updaters);
    const L = new GLTFLoader(), names = ["worker", "woman", "casual", "suv", "tent", "solar", "antenna"];
    const M = Object.fromEntries(await Promise.all(names.map((n) => L.loadAsync(`./models/${n}.glb`).then((g) => [n, g]))));
    buildRoadAndCar(scene, T, updaters, M.suv);
    buildDrones(scene, T, updaters);
    buildBirds(scene, updaters);
    buildClouds(scene, updaters, api);
    const camp = buildCamp(scene, T, updaters, M);
    await buildCrew(scene, T, camp, renderer, camera, updaters, M, api);
    return T;
  })().catch((e) => { console.error("[world]", e); });
  return api;
}

/* --------------------------- sky, light & ambiances --------------------------- */
// The sky is a physical (Preetham) model baked once per ambiance into a cube map: it is the background
// and, through PMREM, the image-based light for the glossy materials (city glass, vehicle, instruments).
// Night is painted: deep-blue gradient, ~2 600 stars, a moon with its halo, the city lit up.
export const AMBIANCES = {
  golden: { label: "Coucher de soleil", el: 9, az: 268, turbidity: 7, rayleigh: 2.6, mie: 0.006, mieG: 0.86, bg: 0.55, env: 0.9,
    sun: [0xffc58a, 2.8], hemi: [0xc9d6f4, 0x7a5236, 0.95], fog: 0xd5bea2, fogD: 0.000105, night: 0.22, cloud: 0xffd9b8 },
  day: { label: "Plein jour", el: 52, az: 205, turbidity: 3.2, rayleigh: 1.1, mie: 0.004, mieG: 0.8, bg: 0.45, env: 1.0,
    sun: [0xfff3e2, 2.5], hemi: [0xcfe3f5, 0x8a6f4f, 1.15], fog: 0xcddcea, fogD: 0.0001, night: 0, cloud: 0xffffff },
  night: { label: "Nuit étoilée", el: 30, az: 140, moon: true, bg: 1, env: 0.4,
    sun: [0x9fb6ff, 0.55], hemi: [0x31466c, 0x0b0d12, 0.62], fog: 0x0f1a2c, fogD: 0.00011, night: 1, cloud: 0x2a3550 },
};
export const NIGHT = { value: 0 };   // 0 day … 1 night: city windows, deck LEDs, beacons
export const TIME = { value: 0 };    // shared clock for vertex/fragment animations (vegetation sway, water)
const sunDir = (A) => new THREE.Vector3(Math.sin(A.az * DEG) * Math.cos(A.el * DEG), Math.sin(A.el * DEG), -Math.cos(A.az * DEG) * Math.cos(A.el * DEG));
let SUN_DIR = sunDir(AMBIANCES.golden);

function bakeSky(renderer, A) {
  const s = new THREE.Scene();
  if (A.moon) { // night: gradient dome (stars and moon are real geometry so they stay crisp)
    s.add(new THREE.Mesh(new THREE.SphereGeometry(5, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `varying vec3 vD; void main(){ vec3 d = normalize(vD); float h = d.y;
        vec3 c = h > 0.0 ? mix(vec3(0.045, 0.085, 0.16), vec3(0.006, 0.012, 0.03), pow(h, 0.55)) : mix(vec3(0.045, 0.085, 0.16), vec3(0.02, 0.03, 0.05), pow(-h, 0.4));
        c += vec3(0.09, 0.07, 0.05) * exp(-abs(h) * 14.0) * 0.6;   // faint warm glow on the horizon (the city)
        gl_FragColor = vec4(c, 1.0); }`,
    })));
  } else {
    const sky = new Sky(); sky.scale.setScalar(10);
    const u = sky.material.uniforms;
    u.turbidity.value = A.turbidity; u.rayleigh.value = A.rayleigh; u.mieCoefficient.value = A.mie; u.mieDirectionalG.value = A.mieG;
    u.sunPosition.value.copy(sunDir(A));
    s.add(sky);
  }
  const rt = new THREE.WebGLCubeRenderTarget(512, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  new THREE.CubeCamera(0.1, 100, rt).update(renderer, s);
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromCubemap(rt.texture).texture; pm.dispose();
  return { bg: rt.texture, env };
}

function setupSkyAndLight(scene, root, renderer, camera, updaters, api) {
  const fog = scene.fog = new THREE.FogExp2(0xd5bea2, 0.000105); // aerial perspective over ~10 km
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const sun = new THREE.DirectionalLight(0xffc58a, 2.8);
  sun.target.position.set(0, 0, -12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 10, far: 320 });
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
  sun.shadow.camera.updateProjectionMatrix();
  const hemi = new THREE.HemisphereLight(0xc9d6f4, 0x7a5236, 0.95);
  scene.add(sun, sun.target, hemi);

  // night sky: stars + moon (fog-free, far away, screen-size points so they stay sharp in the headset)
  const R = rng(77), N = 2600, sp = new Float32Array(N * 3), sc = new Float32Array(N * 3), c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    let x, y, z; do { x = R() * 2 - 1; y = R() * 2 - 1; z = R() * 2 - 1; } while (x * x + y * y + z * z > 1);
    const band = Math.exp(-Math.pow((0.55 * x + 0.84 * y - 0.1 * z) * 3.2, 2)); // denser along a Milky-Way band
    if (y < -0.05 || (R() > 0.35 + 0.65 * band && R() < 0.5)) { i--; continue; }
    const v = new THREE.Vector3(x, Math.abs(y) + 0.02, z).normalize().multiplyScalar(18000);
    v.toArray(sp, i * 3); c.setHSL(0.58 + (R() - 0.5) * 0.12, 0.5, 0.55 + R() * 0.45).toArray(sc, i * 3);
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3)); sg.setAttribute("color", new THREE.BufferAttribute(sc, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, fog: false, transparent: true, depthWrite: false }));
  stars.frustumCulled = false; stars.visible = false; root.add(stars);
  const mc = document.createElement("canvas"); mc.width = mc.height = 256; const mx = mc.getContext("2d");
  let g = mx.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.16, "rgba(235,242,255,1)"); g.addColorStop(0.2, "rgba(190,210,255,0.5)"); g.addColorStop(0.5, "rgba(120,150,220,0.12)"); g.addColorStop(1, "rgba(80,110,200,0)");
  mx.fillStyle = g; mx.fillRect(0, 0, 256, 256);
  const moonTex = new THREE.CanvasTexture(mc); moonTex.colorSpace = THREE.SRGBColorSpace;
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex, fog: false, transparent: true, depthWrite: false }));
  moon.scale.setScalar(2600); moon.visible = false; root.add(moon);
  updaters.push(() => { stars.position.copy(camera.position); });

  const cache = {};
  let dimK = 0, curA = AMBIANCES.golden, ar = false;
  const applyLight = () => { // ambiance × cinema dimming (the landscape darkens while a film plays)
    const A = curA, f = 1 - 0.72 * dimK;
    sun.intensity = A.sun[1] * f; hemi.intensity = A.hemi[2] * f;
    scene.backgroundIntensity = A.bg * (1 - 0.65 * dimK); scene.environmentIntensity = A.env * f;
    fog.color.set(A.fog).multiplyScalar(1 - 0.6 * dimK);
  };
  api.setDim = (k) => { if (Math.abs(k - dimK) < 0.003) return; dimK = k; applyLight(); };
  api.ambiance = "golden";
  api.setAmbiance = (key) => {
    const A = AMBIANCES[key]; if (!A) return;
    api.ambiance = key; curA = A;
    const sky = cache[key] || (cache[key] = bakeSky(renderer, A));
    scene.background = ar ? null : sky.bg; scene.environment = sky.env;
    SUN_DIR = sunDir(A);
    sun.color.set(A.sun[0]);
    sun.position.copy(sun.target.position).addScaledVector(SUN_DIR, 150);
    hemi.color.set(A.hemi[0]); hemi.groundColor.set(A.hemi[1]);
    fog.density = A.fogD;
    applyLight();
    NIGHT.value = A.night;
    stars.visible = moon.visible = !!A.moon;
    if (A.moon) moon.position.copy(SUN_DIR).multiplyScalar(16000);
    for (const f of api.onAmbiance) f(key, A);
  };
  api.onAmbiance = [];
  api.setAmbiance("golden");
  // AR (passthrough): no sky, no fog, no landscape — the presentation floats in the visitor's own room.
  // The lights stay (the globe's pedestal is metal) and so does the reflection map.
  api.setAR = (on) => {
    ar = on; root.visible = !on;
    scene.background = on ? null : cache[api.ambiance].bg; scene.fog = on ? null : fog;
  };
}

/* ------------------------------- terrain ------------------------------- */
async function buildTerrain(scene) {
  const [meta, buf, riv] = await Promise.all([
    fetch("./terrain/dem.json").then((r) => r.json()),
    fetch("./terrain/dem.bin").then((r) => r.arrayBuffer()),
    fetch("./terrain/river.bin").then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null), // scripts/build-xr-river.mjs
  ]);
  const S = meta.size, C = meta.center, M = meta.mpp, H0 = meta.viewElevation, dem = new Int16Array(buf);
  const px = (i, j) => dem[Math.min(S - 1, Math.max(0, j)) * S + Math.min(S - 1, Math.max(0, i))];
  const cr = (a, b, c, d, t) => b + 0.5 * t * (c - a + t * (2 * a - 5 * b + 4 * c - d + t * (3 * (b - c) + d - a)));
  function elevAt(x, z) { // bicubic, absolute metres
    const fx = x / M + C, fz = z / M + C, i = Math.floor(fx), j = Math.floor(fz), tx = fx - i, tz = fz - j;
    const row = (jj) => cr(px(i - 1, jj), px(i, jj), px(i + 1, jj), px(i + 2, jj), tx);
    return cr(row(j - 1), row(j), row(j + 1), row(j + 2), tz);
  }
  function slopeAt(x, z) { const d = M; return Math.hypot((elevAt(x + d, z) - elevAt(x - d, z)) / (2 * d), (elevAt(x, z + d) - elevAt(x, z - d)) / (2 * d)); }
  function heightAt(x, z) { // world y: natural slope (the valley must stay visible) + ground detail nearby
    const r = Math.hypot(x, z);
    let h = elevAt(x, z) - H0;
    if (r > 8 && r < 700) {
      const f = clamp01((r - 8) / 30) * (1 - clamp01((r - 350) / 350));
      h += f * ((vnoise(x * 0.08, z * 0.08) - 0.5) * 1.4 + (vnoise(x * 0.21 + 7, z * 0.21 - 3) - 0.5) * 0.4);
    }
    if (r < 4.4) h = Math.min(h, -0.12 - 0.5 * (1 - r / 4.4)); // keep the ground under the observatory deck
    return h;
  }

  // polar grid: dense near the viewer, coarse toward the 10 km horizon (natural LOD)
  const A = 300, RN = 220, RMAX = C * M * 0.985;
  const radii = [0]; for (let i = 1; i <= RN; i++) radii.push(0.6 + RMAX * Math.pow(i / RN, 2.2));
  const nV = 1 + RN * A + A; // + skirt ring
  const pos = new Float32Array(nV * 3), uv = new Float32Array(nV * 2);
  const setV = (k, x, y, z) => { pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z; uv[k * 2] = (x / M + C + 0.5) / S; uv[k * 2 + 1] = (z / M + C + 0.5) / S; };
  setV(0, 0, heightAt(0, 0), 0);
  for (let i = 1; i <= RN; i++) for (let j = 0; j < A; j++) {
    const a = (j / A) * Math.PI * 2, x = radii[i] * Math.cos(a), z = radii[i] * Math.sin(a);
    setV(1 + (i - 1) * A + j, x, heightAt(x, z), z);
  }
  for (let j = 0; j < A; j++) { const k = 1 + (RN - 1) * A + j; setV(1 + RN * A + j, pos[k * 3], pos[k * 3 + 1] - 1500, pos[k * 3 + 2]); } // skirt
  const idx = [];
  for (let j = 0; j < A; j++) idx.push(0, 1 + ((j + 1) % A), 1 + j);
  for (let i = 1; i <= RN; i++) for (let j = 0; j < A; j++) { // ring i → ring i+1 (last pair = skirt)
    const a0 = 1 + (i - 1) * A, a1 = 1 + i * A, j1 = (j + 1) % A;
    if (i < RN) idx.push(a0 + j, a0 + j1, a1 + j, a0 + j1, a1 + j1, a1 + j);
    else idx.push(a0 + j, a1 + j, a0 + j1, a0 + j1, a1 + j, a1 + j1); // skirt faces inward, toward the viewer
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();

  // colour (sRGB, alpha = field mask) + object-space normal textures at DEM resolution
  const col = new Uint8Array(S * S * 4), nor = new Uint8Array(S * S * 4);
  const EARTH = [176, 131, 90], OCHRE = [196, 158, 112], OLIVE = [122, 124, 76], ROCK = [140, 120, 103], HIGH = [164, 150, 136], PALE = [200, 192, 182], FIELD = [95, 125, 60];
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    const e = px(i, j), gx = (px(i + 1, j) - px(i - 1, j)) / (2 * M), gz = (px(i, j + 1) - px(i, j - 1)) / (2 * M);
    const slope = Math.hypot(gx, gz), n1 = vnoise(i * 0.09, j * 0.09), n2 = vnoise(i * 0.31 + 11, j * 0.31 - 5);
    let c = mix(EARTH, OCHRE, n1);
    if (e < 2550) c = mix(c, OLIVE, clamp01(1 - slope * 1.6) * (n2 > 0.55 ? 0.55 : 0.12));
    if (e > 2650) c = mix(c, HIGH, clamp01((e - 2650) / 350));
    if (e > 3300) c = mix(c, PALE, clamp01((e - 3300) / 300));
    if (slope > 0.55) c = mix(c, ROCK, clamp01((slope - 0.55) / 0.35));
    if (e > 3180) c = mix(c, [236, 240, 246], clamp01((e - 3180 + (n1 - 0.5) * 160) / 240) * (1 - clamp01((slope - 0.7) / 0.45))); // snow caps
    const dc = cityDist((i - C) * M, (j - C) * M), city = clamp01((CITY.r + 110 - dc) / 120);
    const field = clamp01((1880 - e) / 25) * clamp01((0.17 - slope) / 0.05) * (1 - city);
    if (field > 0) c = mix(c, FIELD, field);
    if (city > 0) c = mix(c, Math.floor(dc / 105) % 2 ? [192, 194, 188] : [98, 138, 82], city); // ring boulevards & parks
    const shade = 0.9 + 0.2 * n2, k = (j * S + i) * 4;
    col[k] = Math.min(255, c[0] * shade); col[k + 1] = Math.min(255, c[1] * shade); col[k + 2] = Math.min(255, c[2] * shade); col[k + 3] = Math.round(field * 255);
    const nl = Math.hypot(gx, 1, gz);
    nor[k] = (-gx / nl * 0.5 + 0.5) * 255; nor[k + 1] = (1 / nl * 0.5 + 0.5) * 255; nor[k + 2] = (-gz / nl * 0.5 + 0.5) * 255; nor[k + 3] = 255;
  }
  const mkTex = (data, srgb) => {
    const t = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 4;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.needsUpdate = true; return t;
  };
  const mat = new THREE.MeshLambertMaterial({ map: mkTex(col, true), normalMap: mkTex(nor, false), normalMapType: THREE.ObjectSpaceNormalMap });
  const riverTex = new THREE.DataTexture(riv ? new Uint8Array(riv) : new Uint8Array(S * S), S, S, THREE.RedFormat, THREE.UnsignedByteType);
  riverTex.magFilter = riverTex.minFilter = THREE.LinearFilter; riverTex.wrapS = riverTex.wrapT = THREE.ClampToEdgeWrapping; riverTex.needsUpdate = true;
  const detail = groundDetailTexture();
  const lin = (hex) => new THREE.Color(hex);
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, {
      uH0: { value: H0 }, uF0: { value: lin(0x4a7a2c) }, uF1: { value: lin(0x6b8c34) }, uF2: { value: lin(0x92a04a) }, uF3: { value: lin(0xb59b62) },
      uHedge: { value: lin(0x2f4a1e) }, uMajor: { value: lin(TEAL) }, uDetail: { value: detail },
      uRiver: { value: riverTex }, uTime: TIME, uNight: NIGHT,
    });
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", `#include <common>
      varying vec3 vWPos; uniform float uH0; uniform vec3 uF0, uF1, uF2, uF3, uHedge, uMajor; uniform sampler2D uDetail, uRiver; uniform float uTime, uNight;
      float h21(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(h21(i), h21(i+vec2(1,0)), u.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), u.x), u.y); }`)
      .replace("#include <map_fragment>", `#include <map_fragment>
      {
        float fieldMask = texture2D(map, vMapUv).a;
        float dist = length(vWPos - cameraPosition);
        float n = vn(vWPos.xz * 0.55) * 0.55 + vn(vWPos.xz * 2.1) * 0.3;          // near-field mottling
        diffuseColor.rgb *= mix(1.0, 0.72 + 0.55 * n, 1.0 - smoothstep(30.0, 600.0, dist));
        vec3 det = texture2D(uDetail, vWPos.xz * 0.25).rgb * texture2D(uDetail, vWPos.xz * 0.043 + 0.37).rgb * 4.0;
        diffuseColor.rgb *= mix(vec3(1.0), det, 1.0 - smoothstep(6.0, 120.0, dist));
        float scrub = smoothstep(0.52, 0.78, vn(vWPos.xz * 0.06 + 13.0)) * (1.0 - smoothstep(80.0, 1500.0, dist));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.18, 0.08), scrub * 0.42 * (1.0 - fieldMask));
        if (fieldMask > 0.02) {                                                    // valley parcels (cadastre feel)
          vec2 q = mat2(0.928, 0.371, -0.371, 0.928) * vWPos.xz / vec2(70.0, 42.0);
          vec2 cell = floor(q); float hs = h21(cell);
          vec3 fc = hs < 0.3 ? uF0 : hs < 0.56 ? uF1 : hs < 0.8 ? uF2 : uF3;
          vec2 f = fract(q), fw = fwidth(q) * 1.4 + 0.015;
          float edge = 1.0 - min(smoothstep(0.0, fw.x, min(f.x, 1.0 - f.x)), smoothstep(0.0, fw.y, min(f.y, 1.0 - f.y)));
          fc = mix(fc, uHedge, edge * 0.75);
          diffuseColor.rgb = mix(diffuseColor.rgb, fc, fieldMask);
        }
        {                                                                          // rivers (from the relief): gravel beds, water in the main one
          float r = texture2D(uRiver, vMapUv).r;
          float bed = smoothstep(0.03, 0.22, r), wet = smoothstep(0.42, 0.62, r);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.72, 0.68, 0.6), bed * 0.75);
          vec3 water = mix(vec3(0.16, 0.34, 0.42), vec3(0.62, 0.72, 0.78), 0.35 + 0.3 * vn(vWPos.xz * 0.02 + uTime * 0.05));
          water = mix(water, vec3(0.05, 0.08, 0.14), uNight * 0.85);
          float glint = pow(vn(vWPos.xz * 0.45 + vec2(uTime * 0.6, -uTime * 0.35)), 9.0) * (1.0 - smoothstep(200.0, 2500.0, dist)) * (1.0 - uNight);
          diffuseColor.rgb = mix(diffuseColor.rgb, water + glint * 1.6, wet);
        }
        float elev = vWPos.y + uH0, fwE = max(fwidth(elev), 1e-3);                 // topographic contours
        float d20 = abs(fract(elev / 20.0 + 0.5) - 0.5) * 20.0, d100 = abs(fract(elev / 100.0 + 0.5) - 0.5) * 100.0;
        float minor = (1.0 - smoothstep(0.0, fwE * 1.1, d20)) * (1.0 - smoothstep(2.0, 5.0, fwE)) * (1.0 - smoothstep(300.0, 1400.0, dist));
        float major = (1.0 - smoothstep(0.0, fwE * 1.3, d100)) * (1.0 - smoothstep(8.0, 22.0, fwE)) * (1.0 - smoothstep(2500.0, 7000.0, dist));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), minor * 0.14);
        diffuseColor.rgb = mix(diffuseColor.rgb, uMajor, major * 0.45);
        diffuseColor.a = 1.0;
      }`);
  };
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true; mesh.frustumCulled = false;
  scene.add(mesh);
  return { heightAt, elevAt, slopeAt, H0, meta, mesh };
}

function groundDetailTexture() { // mid-grey (= ×1) with soil speckle, pebbles and grass strokes
  const N = 256, c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d"), R = rng(21);
  x.fillStyle = "rgb(128,128,128)"; x.fillRect(0, 0, N, N);
  for (let i = 0; i < 5200; i++) { const v = 95 + R() * 70; x.fillStyle = `rgb(${v},${v * 0.97},${v * 0.92})`; x.fillRect(R() * N, R() * N, 1 + R() * 2, 1 + R() * 2); }
  for (let i = 0; i < 260; i++) { const v = 70 + R() * 110, r = 1.5 + R() * 3.5; x.fillStyle = `rgb(${v},${v * 0.96},${v * 0.9})`; x.beginPath(); x.ellipse(R() * N, R() * N, r, r * 0.7, R() * 3, 0, 7); x.fill(); }
  x.lineWidth = 1;
  for (let i = 0; i < 700; i++) { const px = R() * N, py = R() * N, a = -Math.PI / 2 + (R() - 0.5) * 1.2, l = 3 + R() * 7; x.strokeStyle = `rgba(${90 + R() * 40},${105 + R() * 35},${55 + R() * 20},0.8)`; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; return t;
}

/* ------------------------------ vegetation ------------------------------ */
function scatter(n, tries, rMin, rMax, pred, R, bias = 0) {
  const out = [];
  for (let k = 0; k < tries && out.length < n; k++) {
    const r = bias ? rMin + (rMax - rMin) * Math.pow(R(), bias) : Math.sqrt(R() * (rMax * rMax - rMin * rMin) + rMin * rMin), a = R() * Math.PI * 2;
    const x = r * Math.sin(a), z = -r * Math.cos(a);
    if (pred(x, z, R)) out.push([x, z]);
  }
  return out;
}
function swayMaterial(amp) { // wind: tops bend with a slow gust + a faster flutter, phase from the instance position
  const m = lambert({ vertexColors: true });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = TIME;
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uTime;")
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        #ifdef USE_INSTANCING
          float ph = instanceMatrix[3].x * 0.071 + instanceMatrix[3].z * 0.053;
          float k = max(position.y, 0.0) * ${amp.toFixed(4)};
          transformed.x += k * (sin(uTime * 0.9 + ph) * 0.8 + sin(uTime * 3.1 + ph * 2.3) * 0.25);
          transformed.z += k * cos(uTime * 1.1 + ph * 1.7) * 0.45;
        #endif`);
  };
  m.customProgramCacheKey = () => "sway" + amp;
  return m;
}
function instanced(scene, geo, spots, T, R, { sMin, sMax, tint, sink = 0, cast = false, stretch = 0, light = [0.42, 0.16], sway = 0 }) {
  const im = new THREE.InstancedMesh(geo, sway ? swayMaterial(sway) : lambert({ vertexColors: true }), spots.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), e = new THREE.Euler(), c = new THREE.Color();
  spots.forEach(([x, z], i) => {
    const k = sMin + R() * (sMax - sMin);
    s.set(k, k * (1 + (R() - 0.5) * stretch), k);
    p.set(x, T.heightAt(x, z) - sink * k, z);
    q.setFromEuler(e.set((R() - 0.5) * 0.08, R() * Math.PI * 2, (R() - 0.5) * 0.08));
    im.setMatrixAt(i, m4.compose(p, q, s));
    im.setColorAt(i, c.setHSL(tint[0] + (R() - 0.5) * tint[1], 0.25 + R() * 0.25, light[0] + R() * light[1]));
  });
  im.castShadow = cast; im.receiveShadow = false;
  scene.add(im); return im;
}
function buildVegetation(scene, T) {
  const R = rng(11);
  const juniper = mergeGeometries([
    solid(new THREE.CylinderGeometry(0.12, 0.18, 1.4, 5).translate(0, 0.7, 0), 0x6a4e36),
    solid(new THREE.IcosahedronGeometry(1, 0).scale(1.25, 1.75, 1.25).translate(0, 2.3, 0), 0xffffff),
  ]);
  const walnut = mergeGeometries([
    solid(new THREE.CylinderGeometry(0.25, 0.4, 3, 4, 1, true).translate(0, 1.5, 0), 0x5d4633),
    solid(new THREE.IcosahedronGeometry(1, 0).scale(4.2, 3.4, 4.2).translate(0, 5.6, 0), 0xffffff),
  ]);
  const poplar = mergeGeometries([
    solid(new THREE.CylinderGeometry(0.18, 0.3, 2.5, 4, 1, true).translate(0, 1.25, 0), 0x5d4633),
    solid(new THREE.IcosahedronGeometry(1, 0).scale(1.6, 7, 1.6).translate(0, 8, 0), 0xffffff),
  ]);
  const juniperSpots = scatter(520, 9000, 22, 2300, (x, z) => {
    const e = T.elevAt(x, z); return e > 1950 && e < 2750 && T.slopeAt(x, z) < 0.6 && vnoise(x * 0.006, z * 0.006) > 0.33;
  }, R);
  instanced(scene, juniper, juniperSpots, T, R, { sMin: 0.7, sMax: 1.6, tint: [0.27, 0.05], cast: false, stretch: 0.3, sway: 0.02 });
  const isFloor = (x, z) => T.elevAt(x, z) < 1872 && T.slopeAt(x, z) < 0.14;
  const walnutSpots = scatter(900, 24000, 350, 5600, (x, z) => z < -150 && isFloor(x, z) && cityDist(x, z) > CITY.r + 70 && vnoise(x * 0.0035 + 3, z * 0.0035) > 0.44, R);
  instanced(scene, walnut, walnutSpots, T, R, { sMin: 0.8, sMax: 1.3, tint: [0.28, 0.06], sway: 0.012 });
  const poplarSpots = scatter(420, 24000, 350, 5600, (x, z) => z < -150 && isFloor(x, z) && cityDist(x, z) > CITY.r + 70 && vnoise(x * 0.0042 - 9, z * 0.0042 + 4) > 0.55, R);
  instanced(scene, poplar, poplarSpots, T, R, { sMin: 0.85, sMax: 1.25, tint: [0.23, 0.05], sway: 0.016 });
  // rocks around the camp
  const rock = solid(new THREE.DodecahedronGeometry(1, 0), 0xffffff);
  // keep the camp, the crew's route and the 4×4 track clear of clutter
  const CLEAR = [[...polar(-36, 7.5), 2.8], [...polar(32, 9), 2.4], [...polar(50, 5.5), 1.8], [...polar(14, 24), 2.2],
    [...polar(-30, 15), 1.8], [...polar(-12, 21), 1.8], [...polar(8, 18), 1.8], [...polar(24, 23), 1.8], [...polar(-47, 11), 1.2],
    [...polar(22, 6.8), 1.3], [...polar(-22, 12), 1.6], [...polar(-26, 11), 1.1]];
  const clear = (x, z) => {
    const r = Math.hypot(x, z), az = Math.atan2(x, -z) / DEG;
    if (r < 3.8 || (r > 29 && r < 37.5 && az > -58 && az < 56)) return false;
    return CLEAR.every(([cx, cz, rr]) => Math.hypot(x - cx, z - cz) > rr);
  };
  const rockSpots = scatter(130, 8000, 4, 220, (x, z) => clear(x, z) && T.slopeAt(x, z) < 0.9, R, 1.6);
  const rocks = instanced(scene, rock, rockSpots, T, R, { sMin: 0.12, sMax: 0.62, tint: [0.08, 0.03], sink: 0.4, cast: true, stretch: -0.8, light: [0.3, 0.12] });
  const bush = solid(new THREE.IcosahedronGeometry(1, 0).scale(1, 0.55, 1), 0xffffff);
  const bushSpots = scatter(320, 12000, 5, 320, (x, z) => clear(x, z) && vnoise(x * 0.05 + 3, z * 0.05) > 0.4, R, 1.5);
  instanced(scene, bush, bushSpots, T, R, { sMin: 0.3, sMax: 0.72, tint: [0.19, 0.05], sink: 0.08, cast: true, light: [0.16, 0.08], sway: 0.05 }).receiveShadow = true;
  // dry-grass tufts close to the camp
  const tuft = mergeGeometries([0, 1, 2, 3].map((i) => solid(new THREE.ConeGeometry(0.05, 0.42, 3).translate(Math.cos(i * 1.6) * 0.08, 0.2, Math.sin(i * 1.6) * 0.08).rotateZ((i - 1.5) * 0.18), 0xffffff)));
  const tuftSpots = scatter(520, 12000, 3.8, 60, (x, z) => clear(x, z), R, 1.5);
  instanced(scene, tuft, tuftSpots, T, R, { sMin: 0.45, sMax: 0.95, tint: [0.12, 0.04], light: [0.36, 0.12], sway: 0.16 });
  rocks.receiveShadow = true;
}

/* ------------------------------- villages ------------------------------- */
function buildVillages(scene, T) {
  const R = rng(5), centres = [];
  for (let k = 0; k < 6000 && centres.length < 7; k++) {
    const [x, z] = polar(R() * 150 - 75, 700 + R() * 3800);
    const e = T.elevAt(x, z), s = T.slopeAt(x, z);
    if (e > 1845 && e < 1940 && s > 0.03 && s < 0.22 && cityDist(x, z) > CITY.r + 300 && centres.every((c) => Math.hypot(c[0] - x, c[1] - z) > 700)) centres.push([x, z]);
  }
  const house = solid(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), 0xffffff);
  const spots = [];
  for (const [cx, cz] of centres) {
    const n = 16 + Math.floor(R() * 14), rot = R() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 70, x = cx + r * Math.cos(a), z = cz + r * Math.sin(a);
      const tower = i === 0;
      spots.push({ x, z, w: tower ? 7 : 7 + R() * 5, h: tower ? 14 : 4 + R() * 4, d: tower ? 7 : 6 + R() * 4, rot: rot + (R() - 0.5) * 0.3 });
    }
  }
  const im = new THREE.InstancedMesh(house, lambert({ vertexColors: true }), spots.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color(), up = new THREE.Vector3(0, 1, 0);
  const palette = [0xb9855a, 0xc79a6c, 0xa8744c, 0xc28a5c];
  spots.forEach((s, i) => {
    im.setMatrixAt(i, m4.compose(new THREE.Vector3(s.x, T.heightAt(s.x, s.z) - 1.5, s.z), q.setFromAxisAngle(up, s.rot), new THREE.Vector3(s.w, s.h + 1.5, s.d)));
    im.setColorAt(i, c.set(palette[i % palette.length]));
  });
  scene.add(im);
}

/* ---------------------------- futuristic city ---------------------------- */
// "Ville intelligente" skyline: twisted glass towers around a 700 m spire, a maglev ring, air taxis
// and a periodic LiDAR sweep (ETAFAT's digital-twin theme). Static parts bake into two meshes.
function banded(g, cA, cB, band, H) { // per-triangle colours: glass floors in bands, lighter toward the sky
  g = g.index ? g.toNonIndexed() : g; if (g.attributes.uv) g.deleteAttribute("uv");
  const p = g.attributes.position, n = p.count, a = new Float32Array(n * 3), A = new THREE.Color(cA), B = new THREE.Color(cB), c = new THREE.Color();
  for (let t = 0; t < n; t += 3) {
    const yc = (p.getY(t) + p.getY(t + 1) + p.getY(t + 2)) / 3;
    c.copy(Math.floor(yc / band) % 2 ? A : B).multiplyScalar(0.8 + 0.32 * clamp01(yc / H));
    for (let k = 0; k < 3; k++) c.toArray(a, (t + k) * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(a, 3)); return g;
}
function twist(g, turns, H) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = turns * y / H; p.setXYZ(i, x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)); }
  g.computeVertexNormals(); return g;
}
function cityMaterial() { // reflective glass (sky environment) + procedural windows that light up toward the night
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.55, roughness: 0.2, flatShading: true, envMapIntensity: 1.25 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uNight = NIGHT;
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vCity; varying vec3 vCityN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvCity = position; vCityN = normal;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", `#include <common>
      varying vec3 vCity; varying vec3 vCityN; uniform float uNight;
      float hC(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }`)
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
      {
        vec3 cn = normalize(vCityN);
        if (abs(cn.y) < 0.5) {                                   // facades only
          float u = abs(cn.x) > abs(cn.z) ? vCity.z : vCity.x;
          vec2 cell = vec2(u / 3.4, vCity.y / 4.2), fw = fwidth(cell), f = fract(cell);
          float win = step(0.18, f.x) * step(f.x, 0.82) * step(0.22, f.y) * step(f.y, 0.78);
          float on = step(0.58, hC(floor(cell) + floor(vCity.xz / 60.0)));
          float lit = mix(win * on, 0.17, smoothstep(0.25, 0.6, max(fw.x, fw.y)));   // far away: average glow, no shimmer
          vec3 wc = mix(vec3(1.0, 0.78, 0.5), vec3(0.65, 0.9, 1.0), step(0.72, hC(floor(cell) * 1.7)));
          totalEmissiveRadiance += wc * lit * (0.05 + uNight * 1.1);
        }
      }`);
  };
  m.customProgramCacheKey = () => "city-v2";
  return m;
}
function buildCity(scene, T, updaters) {
  const R = rng(2050), body = [], glow = [], tops = [], spots = [];
  const GLOW = 0x5ff5f0;
  const ground = (x, z, rad) => { let m = T.heightAt(x, z); for (let a = 0; a < 6; a++) m = Math.min(m, T.heightAt(x + rad * Math.cos(a * 1.047), z + rad * Math.sin(a * 1.047))); return m - 4; };
  const place = (g, x, y, z, ry = 0) => g.rotateY(ry).translate(x, y, z);
  const free = (x, z, rad) => spots.every(([sx, sz, sr]) => Math.hypot(x - sx, z - sz) > rad + sr + 14);
  const GLASS = [[0x1d4360, 0x31597a], [0x4683aa, 0x66a1c6], [0x8cbfd8, 0xafd5e8], [0xdfe8ec, 0xf4f7f8], [0xcdb996, 0xe2d2b2], [0x2a8a90, 0x46abb0]];

  // central spire (≈700 m) with a sky ring and a glowing crown
  const cy = ground(CITY_X, CITY_Z, 60); spots.push([CITY_X, CITY_Z, 70]);
  body.push(place(twist(banded(new THREE.CylinderGeometry(24, 66, 560, 8, 28).translate(0, 280, 0), 0xe6eef1, 0xb9cdd8, 20, 560), 0.9, 560), CITY_X, cy, CITY_Z));
  body.push(place(solid(new THREE.ConeGeometry(13, 230, 6).translate(0, 665, 0), 0xf2f5f6), CITY_X, cy, CITY_Z));
  body.push(place(solid(new THREE.TorusGeometry(105, 7, 5, 40).rotateX(Math.PI / 2).translate(0, 360, 0), 0xf0f3f4), CITY_X, cy, CITY_Z));
  glow.push(place(solid(new THREE.CylinderGeometry(27, 29, 10, 16, 1, true).translate(0, 545, 0), GLOW), CITY_X, cy, CITY_Z));
  glow.push(place(solid(new THREE.TorusGeometry(105, 2.6, 4, 40).rotateX(Math.PI / 2).translate(0, 369, 0), GLOW), CITY_X, cy, CITY_Z));
  tops.push([CITY_X, cy + 782, CITY_Z]);

  // district towers, taller toward the centre
  for (let k = 0; k < 5000 && spots.length < 100; k++) {
    const a = R() * Math.PI * 2, r = 105 + Math.pow(R(), 0.85) * (CITY.r - 140);
    const x = CITY_X + r * Math.cos(a), z = CITY_Z + r * Math.sin(a), t = r / CITY.r;
    const H = (40 + 520 * Math.pow(1 - t, 1.75)) * (0.55 + 0.45 * R()), w = 24 + R() * 30, rad = w * 0.72;
    if (!free(x, z, rad)) continue;
    spots.push([x, z, rad]);
    const y0 = ground(x, z, rad), ry = R() * Math.PI, pal = H > 240 ? GLASS[[1, 3, 5, 0][Math.floor(R() * 4)]] : GLASS[Math.floor(R() * GLASS.length)];
    const segs = Math.max(2, Math.round(H / 18)), roll = R();
    if (H > 60 && roll < 0.14 && r > 380) { // glass dome (eco-biome / arena)
      const dr = 30 + R() * 34;
      body.push(place(banded(new THREE.SphereGeometry(dr, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0x86cfcb, 0xa6e0dc, 9, dr), x, y0 + 3, z));
      continue;
    }
    let g;
    if (H > 140 && roll < 0.45) g = twist(banded(new THREE.BoxGeometry(w, H, w, 1, segs, 1).translate(0, H / 2, 0), pal[0], pal[1], 18, H), (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.8), H);
    else if (roll < 0.72) g = banded(new THREE.CylinderGeometry(rad * (0.45 + R() * 0.3), rad, H, R() < 0.5 ? 6 : 10, segs).translate(0, H / 2, 0), pal[0], pal[1], 18, H);
    else {
      g = banded(new THREE.BoxGeometry(w, H * 0.68, w * (0.7 + R() * 0.5), 1, Math.max(1, Math.round(segs * 0.68)), 1).translate(0, H * 0.34, 0), pal[0], pal[1], 18, H);
      body.push(place(banded(new THREE.BoxGeometry(w * 0.66, H * 0.32, w * 0.5, 1, Math.max(1, Math.round(segs * 0.32)), 1).translate(0, H * 0.84, 0), pal[0], pal[1], 18, H), x, y0, z, ry));
    }
    body.push(place(g, x, y0, z, ry));
    if (H > 150) { // podium in warm stone + glowing crown (+ needle on the tallest)
      body.push(place(solid(new THREE.BoxGeometry(w * 1.9, 20, w * 1.9).translate(0, 10, 0), 0xd8c6a2), x, y0, z, ry));
      glow.push(place(solid(new THREE.CylinderGeometry(rad * 0.62, rad * 0.62, 6, 10, 1, true).translate(0, H - 14, 0), GLOW), x, y0, z, ry));
      if (H > 260) { body.push(place(solid(new THREE.ConeGeometry(3.5, 70, 5).translate(0, H + 35, 0), 0xf2f5f6), x, y0, z)); tops.push([x, y0 + H + 70, z]); }
    } else if (R() < 0.35) glow.push(place(solid(new THREE.BoxGeometry(w * 1.04, 3, w * 1.04).translate(0, H * (0.4 + R() * 0.4), 0), GLOW), x, y0, z, ry));
  }

  // gateway arch on the edge facing the viewer
  const toV = Math.atan2(-CITY_X, -CITY_Z), [ax, az] = [CITY_X + Math.sin(toV) * (CITY.r - 10), CITY_Z + Math.cos(toV) * (CITY.r - 10)], ay = ground(ax, az, 40);
  body.push(place(solid(new THREE.TorusGeometry(170, 7, 6, 48, Math.PI), 0xf0f3f4), ax, ay, az, toV));
  glow.push(place(solid(new THREE.TorusGeometry(162, 1.8, 4, 48, Math.PI), GLOW), ax, ay, az, toV));

  // maglev ring on pylons
  const ring = [], RR = CITY.r + 40;
  for (let i = 0; i < 64; i++) { const a = i / 64 * Math.PI * 2, x = CITY_X + RR * Math.cos(a), z = CITY_Z + RR * Math.sin(a); ring.push(new THREE.Vector3(x, T.heightAt(x, z) + 30, z)); }
  const track = new THREE.CatmullRomCurve3(ring, true);
  body.push(solid(new THREE.TubeGeometry(track, 160, 3.2, 5, true), 0xe8edef));
  ring.forEach((p, i) => { if (i % 4 === 0) body.push(solid(new THREE.BoxGeometry(5, 34, 5).translate(p.x, p.y - 17, p.z), 0xd6dde0)); });

  const cityMesh = new THREE.Mesh(mergeGeometries(body), cityMaterial()); cityMesh.name = "city"; scene.add(cityMesh);
  const glowMesh = new THREE.Mesh(mergeGeometries(glow), new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })); scene.add(glowMesh);

  // maglev pods
  const podGeo = mergeGeometries([solid(new THREE.BoxGeometry(5.5, 5, 56), 0xf7f9fa), solid(new THREE.BoxGeometry(5.7, 1.2, 50).translate(0, 0.6, 0), 0x2ab5b4)]);
  const pods = new THREE.InstancedMesh(podGeo, BAKED, 3); pods.frustumCulled = false; scene.add(pods);
  // air taxis + aviation beacons (screen-size points, one draw call each)
  const NT = 34, taxis = [], tp = new Float32Array(NT * 3), tc = new Float32Array(NT * 3), cc = new THREE.Color();
  for (let i = 0; i < NT; i++) { taxis.push({ r: 120 + R() * 560, h: cy + 110 + R() * 380, w: (R() < 0.5 ? -1 : 1) * (0.05 + R() * 0.07), ph: R() * 7, e: 0.55 + R() * 0.45, bob: R() * 40 }); cc.set(R() < 0.6 ? 0xffffff : GLOW).toArray(tc, i * 3); }
  const tg = new THREE.BufferGeometry(); tg.setAttribute("position", new THREE.BufferAttribute(tp, 3).setUsage(THREE.DynamicDrawUsage)); tg.setAttribute("color", new THREE.BufferAttribute(tc, 3));
  const taxiPts = new THREE.Points(tg, new THREE.PointsMaterial({ size: 4, sizeAttenuation: false, vertexColors: true })); taxiPts.frustumCulled = false; scene.add(taxiPts);
  const bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.Float32BufferAttribute(tops.flat(), 3));
  const beacons = new THREE.Points(bg, new THREE.PointsMaterial({ color: 0xff3b30, size: 5, sizeAttenuation: false, fog: false })); scene.add(beacons);
  // LiDAR sweep: a glowing ring + faint grid disc rising through the skyline (the city being scanned)
  const add = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide };
  const sweep = new THREE.Mesh(new THREE.CylinderGeometry(CITY.r + 20, CITY.r + 20, 14, 72, 1, true), new THREE.MeshBasicMaterial({ color: GLOW, opacity: 0, ...add }));
  const gc = document.createElement("canvas"); gc.width = gc.height = 256; const gx = gc.getContext("2d");
  gx.strokeStyle = "rgba(95,245,240,0.9)"; gx.lineWidth = 2; for (let i = 0; i <= 256; i += 32) { gx.beginPath(); gx.moveTo(i, 0); gx.lineTo(i, 256); gx.moveTo(0, i); gx.lineTo(256, i); gx.stroke(); }
  const gtex = new THREE.CanvasTexture(gc); gtex.wrapS = gtex.wrapT = THREE.RepeatWrapping; gtex.repeat.set(10, 10); gtex.colorSpace = THREE.SRGBColorSpace;
  const grid = new THREE.Mesh(new THREE.CircleGeometry(CITY.r + 20, 72).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: gtex, opacity: 0, ...add }));
  sweep.add(grid); sweep.position.set(CITY_X, cy, CITY_Z); scene.add(sweep);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(135, 2.4, 4, 56), new THREE.MeshBasicMaterial({ color: GLOW, transparent: true, opacity: 0.75, fog: false }));
  halo.position.set(CITY_X, cy + 470, CITY_Z); scene.add(halo);

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), fwd = new THREE.Vector3(0, 0, 1), tan = new THREE.Vector3(), pp = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  updaters.push((dt, t) => {
    for (let i = 0; i < 3; i++) { // pods at ~90 m/s around the ring
      const u = ((t * 90 / track.getLength() + i / 3) % 1 + 1) % 1;
      track.getPointAt(u, pp); track.getTangentAt(u, tan); pp.y += 5;
      pods.setMatrixAt(i, m4.compose(pp, q.setFromUnitVectors(fwd, tan), one));
    }
    pods.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < NT; i++) {
      const o = taxis[i], a = t * o.w + o.ph;
      tp[i * 3] = CITY_X + o.r * Math.cos(a); tp[i * 3 + 1] = o.h + Math.sin(t * 0.4 + o.ph) * o.bob; tp[i * 3 + 2] = CITY_Z + o.r * o.e * Math.sin(a);
    }
    tg.attributes.position.needsUpdate = true;
    beacons.visible = (t % 1.6) < 0.55;
    const cyc = t % 11, u = clamp01(cyc / 7), vis = cyc < 7 ? Math.sin(Math.PI * u) : 0;
    sweep.position.y = cy + 8 + u * 760; sweep.material.opacity = 0.85 * vis; grid.material.opacity = 0.32 * vis;
    halo.rotation.set(Math.PI / 2 + 0.2 * Math.sin(t * 0.3), 0, t * 0.1); halo.rotateY(0.15 * Math.cos(t * 0.3));
  });
}

/* ---------------------------- road & 4×4 ---------------------------- */
function buildRoadAndCar(scene, T, updaters, suv) {
  // a dirt track across the visible shoulder, where the mobile-mapping 4×4 makes slow passes
  const sm = [];
  for (let ad = -52; ad <= 50; ad += 6) sm.push(new THREE.Vector3(...(() => { const [x, z] = polar(ad, 33 + 3 * Math.sin(ad * 0.07)); return [x, 0, z]; })()));
  const curve = new THREE.CatmullRomCurve3(sm), L = curve.getLength(), N = Math.ceil(L / 4);
  const pos = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = curve.getPointAt(t), tg = curve.getTangentAt(t);
    for (const s of [-1, 1]) { const x = p.x - tg.z * 2.3 * s, z = p.z + tg.x * 2.3 * s; pos.push(x, T.heightAt(x, z) + 0.08, z); }
    if (i < N) { const b = i * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const road = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: 0xc2a883, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }));
  scene.add(road);

  const car = makeCar(suv); car.group.name = "etafat-suv"; scene.add(car.group);
  const tmp = new THREE.Vector3(), look = new THREE.Vector3();
  const V = 3.2, PAUSE = 9, cycle = 2 * (L / V + PAUSE); // drive, pause (scanner idle), drive back, pause
  updaters.push((dt, t) => {
    const c = t % cycle, leg = L / V + PAUSE, back = c >= leg, k = back ? c - leg : c, moving = k < L / V;
    const fwd = !back, u0 = moving ? k * V / L : 1, u = fwd ? u0 : 1 - u0;
    const p = curve.getPointAt(u), tg = curve.getTangentAt(u); if (!fwd) tg.negate();
    car.group.position.set(p.x, T.heightAt(p.x, p.z) + 0.03, p.z);
    tmp.copy(p).addScaledVector(tg, 3); look.set(tmp.x, T.heightAt(tmp.x, tmp.z) + 0.03, tmp.z);
    car.group.lookAt(look);
    car.scanner.rotation.y += dt * (moving ? 12 : 1.5);
    car.beacon.material.color.setHSL(0.08, 1, 0.45 + 0.25 * Math.sin(t * 9));
  });
}
function makeCar(src) { // Quaternius "SUV" (CC0), front = +z, in ETAFAT livery with a roof-mounted LiDAR head
  const group = new THREE.Group(), body = src.scene.clone(true);
  body.traverse((m) => {
    if (!m.isMesh) return; m.castShadow = true; m.material = m.material.clone();
    const n = m.material.name;
    if (n === "White") { m.material.color.set(0xf4f6f7); m.material.roughness = 0.32; m.material.metalness = 0.35; }
    if (n === "Windows") { m.material.color.set(0x13202c); m.material.roughness = 0.06; m.material.metalness = 0.7; }
    if (n === "Headlights") { m.material.emissive = new THREE.Color(0xffd9a0); m.material.emissiveIntensity = 0.6; }
  });
  group.add(body);
  const teal = new THREE.MeshStandardMaterial({ color: TEAL, roughness: 0.4, metalness: 0.2 }), navy = new THREE.MeshStandardMaterial({ color: 0x0a1e30, roughness: 0.5 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x20262d, roughness: 0.45, metalness: 0.6 });
  for (const sd of [-1, 1]) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.1, 3.2), teal); st.position.set(sd * 1.07, 0.86, 0.1); group.add(st);
    const st2 = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.035, 3.2), navy); st2.position.set(sd * 1.07, 0.77, 0.1); group.add(st2);
  }
  const rack = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 1.6), dark); rack.position.set(0, 1.56, -0.35); group.add(rack);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.32, 8), dark); mast.position.set(0, 1.74, 0.05); group.add(mast);
  const scanner = new THREE.Group(); scanner.position.set(0, 1.95, 0.05); group.add(scanner);
  scanner.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.2, 20), dark));
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.06), new THREE.MeshBasicMaterial({ color: 0x5ff5f0, toneMapped: false })); eye.position.set(0, 0.02, 0.13); scanner.add(eye);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.015, 6, 24).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x5ff5f0, toneMapped: false })); ring.position.set(0, 2.08, 0.05); group.add(ring);
  for (const sd of [-1, 1]) { const gn = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.5 })); gn.position.set(sd * 0.5, 1.62, -0.85); group.add(gn); } // GNSS antennas
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff8a1f, toneMapped: false })); beacon.position.set(0.45, 1.64, 0.35); group.add(beacon);
  group.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  return { group, beacon, scanner };
}

/* -------------------------------- drones -------------------------------- */
function makeDrone(scale = 1.8) {
  const g = new THREE.Group(), parts = [], DARK = 0x2b3038;
  const add = (geo, hex, x, y, z, ry = 0, rz = 0) => parts.push(solid(geo.rotateZ(rz).rotateY(ry).translate(x, y, z), hex));
  add(new THREE.BoxGeometry(0.42, 0.13, 0.42), DARK, 0, 0, 0);
  add(new THREE.BoxGeometry(0.34, 0.06, 0.3), 0x5b6470, 0, 0.09, 0);
  for (const a of [45, 135]) add(new THREE.BoxGeometry(1.15, 0.04, 0.06), DARK, 0, 0.02, 0, a * DEG);
  const ROT = [[0.4, 0.4], [-0.4, 0.4], [0.4, -0.4], [-0.4, -0.4]];
  for (const [x, z] of ROT) add(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8), DARK, x, 0.05, z);
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.03, 0.2, 0.3), DARK, 0.16 * s, -0.14, 0, 0, 0.2 * s);
  add(new THREE.BoxGeometry(0.14, 0.12, 0.14), 0xe0b02a, 0, -0.14, 0.08);
  const body = new THREE.Mesh(mergeGeometries(parts), BAKED); body.castShadow = true; g.add(body);
  // spinning props read as translucent blur discs (as they do on a real drone)
  const discs = mergeGeometries(ROT.map(([x, z]) => new THREE.CylinderGeometry(0.24, 0.24, 0.005, 20).translate(x, 0.1, z)));
  g.add(new THREE.Mesh(discs, new THREE.MeshBasicMaterial({ color: 0x9aa4ae, transparent: true, opacity: 0.28, depthWrite: false })));
  const leds = new THREE.Mesh(mergeGeometries([
    solid(new THREE.SphereGeometry(0.035, 6, 4).translate(-0.42, 0.02, 0.42), 0xff3030),
    solid(new THREE.SphereGeometry(0.035, 6, 4).translate(0.42, 0.02, 0.42), 0x30ff70),
  ]), new THREE.MeshBasicMaterial({ vertexColors: true }));
  g.add(leds);
  g.scale.setScalar(scale);
  return { group: g, leds };
}
function lawnmower(cx, cz, w, d, lanes, ang) {
  const pts = [];
  for (let i = 0; i < lanes; i++) {
    const u = (i / (lanes - 1) - 0.5) * d, ends = i % 2 ? [[w / 2, u], [-w / 2, u]] : [[-w / 2, u], [w / 2, u]];
    for (const [lx, lz] of ends) pts.push(new THREE.Vector3(cx + lx * Math.cos(ang) - lz * Math.sin(ang), 0, cz + lx * Math.sin(ang) + lz * Math.cos(ang)));
  }
  const lens = [0]; for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + pts[i].distanceTo(pts[i - 1]));
  return { pts, lens, L: lens[lens.length - 1] };
}
function alongPath(P, dist, outPos, outDir) {
  const s = dist % (2 * P.L), back = s > P.L, u = back ? 2 * P.L - s : s;
  let i = 1; while (i < P.lens.length - 1 && P.lens[i] < u) i++;
  const a = P.pts[i - 1], b = P.pts[i], t = (u - P.lens[i - 1]) / Math.max(1e-6, P.lens[i] - P.lens[i - 1]);
  outPos.lerpVectors(a, b, t); outDir.subVectors(b, a).normalize(); if (back) outDir.negate();
}
function makePointCloud(scene, N, attenuated) {
  const g = new THREE.BufferGeometry();
  const pos = new THREE.BufferAttribute(new Float32Array(N * 3), 3), col = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
  pos.setUsage(THREE.DynamicDrawUsage); col.setUsage(THREE.DynamicDrawUsage);
  g.setAttribute("position", pos); g.setAttribute("color", col); g.setDrawRange(0, 0);
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: attenuated ? 0.45 : 2.6, sizeAttenuation: attenuated, vertexColors: true, fog: true }));
  pts.frustumCulled = false; scene.add(pts);
  let head = 0, count = 0;
  const ramp = [new THREE.Color(TEAL), new THREE.Color(TEAL_L), new THREE.Color(0xf3d36b), new THREE.Color(0xf08a4b)], c = new THREE.Color();
  return {
    add(x, y, z, t01) {
      pos.setXYZ(head, x, y, z);
      const f = clamp01(t01) * 3, k = Math.min(2, Math.floor(f)); c.lerpColors(ramp[k], ramp[k + 1], f - k); col.setXYZ(head, c.r, c.g, c.b);
      head = (head + 1) % N; count = Math.min(N, count + 1);
    },
    flush() { pos.needsUpdate = true; col.needsUpdate = true; g.setDrawRange(0, count); },
  };
}
function buildDrones(scene, T, updaters) {
  const cfg = [
    { path: lawnmower(...polar(-38, 34), 30, 18, 5, 0.6), agl: 9, speed: 3.5, scan: { half: 5, N: 9000, att: true, lift: 0.08 } },
    { path: lawnmower(350, -1900, 800, 450, 7, -0.38), agl: 90, speed: 16, scan: { half: 55, N: 16000, att: false, lift: 2 } },
    { orbit: { cx: polar(34, 20)[0], cz: polar(34, 20)[1], r: 6, agl: 6.5, w: 0.33 } },
  ];
  const beamMat = new THREE.MeshBasicMaterial({ color: TEAL_L, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
  cfg.forEach((c, idx) => {
    const d = makeDrone(); scene.add(d.group);
    c.drone = d; c.pos = new THREE.Vector3(); c.dir = new THREE.Vector3(0, 0, -1); c.alt = null;
    if (c.scan) {
      c.cloud = makePointCloud(scene, c.scan.N, c.scan.att);
      const bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(9), 3));
      c.beam = new THREE.Mesh(bg, beamMat); c.beam.frustumCulled = false; scene.add(c.beam);
      c.acc = 0;
    }
    c.phase = idx * 37;
  });
  const side = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), look = new THREE.Vector3();
  updaters.push((dt, t) => {
    for (const c of cfg) {
      const g = c.drone.group;
      if (c.orbit) {
        const o = c.orbit, a = t * o.w;
        c.pos.set(o.cx + o.r * Math.cos(a), 0, o.cz + o.r * Math.sin(a));
        c.dir.set(-Math.sin(a), 0, Math.cos(a));
        const y = T.heightAt(c.pos.x, c.pos.z) + o.agl + Math.sin(t * 1.3) * 0.3;
        g.position.set(c.pos.x, y, c.pos.z);
        look.set(o.cx, y, o.cz); g.lookAt(look); // camera faces the crew
      } else {
        alongPath(c.path, c.phase + t * c.speed, c.pos, c.dir);
        const target = T.heightAt(c.pos.x, c.pos.z) + c.agl;
        c.alt = c.alt == null ? target : c.alt + (target - c.alt) * Math.min(1, dt * 1.5);
        g.position.set(c.pos.x, c.alt + Math.sin(t * 1.7 + c.phase) * 0.25, c.pos.z);
        look.copy(g.position).add(c.dir); g.lookAt(look); g.rotateX(0.12); // pitched forward in flight
      }
      c.drone.leds.visible = Math.sin(t * 6 + c.phase) > 0;
      if (c.scan) { // LiDAR swath: beam + point cloud painted on the ground
        side.crossVectors(c.dir, up).normalize();
        const s = c.scan, bp = c.beam.geometry.attributes.position, sway = Math.sin(t * 7) * s.half;
        const lx = c.pos.x + side.x * -s.half, lz = c.pos.z + side.z * -s.half, rx = c.pos.x + side.x * s.half, rz = c.pos.z + side.z * s.half;
        bp.setXYZ(0, g.position.x, g.position.y - 0.3, g.position.z);
        bp.setXYZ(1, lx, T.heightAt(lx, lz) + s.lift, lz); bp.setXYZ(2, rx, T.heightAt(rx, rz) + s.lift, rz); bp.needsUpdate = true;
        c.acc += dt;
        if (c.acc > 1 / 30) {
          c.acc = 0;
          for (let k = 0; k < 18; k++) {
            const off = (Math.random() * 2 - 1) * s.half, jitter = (Math.random() - 0.5) * 2.5;
            const x = c.pos.x + side.x * off + c.dir.x * jitter, z = c.pos.z + side.z * off + c.dir.z * jitter;
            c.cloud.add(x, T.heightAt(x, z) + s.lift, z, (T.elevAt(x, z) - 1790) / 420);
          }
          c.cloud.flush();
        }
        c.beam.material.opacity = 0.16 + 0.08 * Math.sin(t * 7 + sway);
      }
    }
  });
}

/* ------------------------------ birds & clouds ------------------------------ */
function buildBirds(scene, updaters) {
  const cone = new THREE.ConeGeometry(0.12, 0.7, 5).rotateX(Math.PI / 2).toNonIndexed().attributes.position.array;
  const WING = [0, 0, -0.25, 0, 0, 0.3, 1.1, 0, 0], PER = cone.length / 3 + 6, N = 6;
  const pos = new Float32Array(N * PER * 3), geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  const mesh = new THREE.Mesh(geo, lambert({ color: 0x2b2622, side: THREE.DoubleSide })); mesh.frustumCulled = false; scene.add(mesh);
  const birds = [];
  for (let i = 0; i < N; i++) birds.push({ cx: -60 + (i % 3) * 70, cz: -150 - (i % 2) * 90, r: 45 + i * 9, h: 28 + i * 7, w: 0.12 + i * 0.015, ph: i * 1.7 });
  const o = new THREE.Object3D(), look = new THREE.Vector3(), v = new THREE.Vector3(), mw = new THREE.Matrix4(), mr = new THREE.Matrix4(), flip = new THREE.Matrix4().makeScale(-1, 1, 1);
  const put = (src, n, m, k) => { for (let j = 0; j < n; j++) { v.fromArray(src, j * 3).applyMatrix4(m); v.toArray(pos, k); k += 3; } return k; };
  updaters.push((dt, t) => {
    let k = 0;
    for (const b of birds) {
      const a = t * b.w + b.ph, x = b.cx + b.r * Math.cos(a), z = b.cz + b.r * Math.sin(a), y = b.h + Math.sin(t * 0.3 + b.ph) * 5;
      o.position.set(x, y, z); o.scale.setScalar(1.3); look.set(x - Math.sin(a), y, z + Math.cos(a)); o.lookAt(look); o.rotateZ(-0.35); o.updateMatrix();
      const flap = Math.sin(t * 0.25 + b.ph) > 0.4 ? Math.sin(t * 9 + b.ph) * 0.55 : 0.08;
      k = put(cone, cone.length / 3, o.matrix, k);
      k = put(WING, 3, mw.multiplyMatrices(o.matrix, mr.makeRotationZ(flap)), k);
      k = put(WING, 3, mw.multiplyMatrices(o.matrix, mr.makeRotationZ(-flap)).multiply(flip), k);
    }
    geo.attributes.position.needsUpdate = true;
  });
}

function cloudTexture(seed) { // soft cloud bank: fractal noise shaped by a flattened falloff, shaded darker underneath
  const W = 512, H = 200, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const img = x.createImageData(W, H), R = rng(seed), ox = R() * 100, oy = R() * 100;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const u = i / W, v = j / H;
    let n = 0, a = 0.5, f = 3.2;
    for (let o = 0; o < 5; o++) { n += a * vnoise(u * f * 2.4 + ox, v * f + oy); a *= 0.5; f *= 2.1; }
    const dx = (u - 0.5) / 0.5, dy = (v - 0.62) / 0.42, fall = Math.max(0, 1 - Math.pow(dx * dx + dy * dy * 1.6, 0.75));
    const d = Math.max(0, Math.min(1, (n * 1.15 - 0.42) * 2.6)) * fall, k = (j * W + i) * 4;
    const shade = 0.82 + 0.18 * (1 - v);                     // brighter tops, greyer bases
    img.data[k] = img.data[k + 1] = 255 * shade; img.data[k + 2] = 255 * Math.min(1, shade + 0.03); img.data[k + 3] = 255 * Math.pow(d, 0.9);
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function buildClouds(scene, updaters, api) {
  const R = rng(3), texes = [cloudTexture(11), cloudTexture(29), cloudTexture(47)];
  const clouds = [];
  for (let i = 0; i < 11; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texes[i % 3], transparent: true, depthWrite: false, opacity: 0.85 }));
    const w = 1800 + R() * 2600; s.scale.set(w, w * 0.36, 1);
    s.position.set(-8000 + R() * 16000, 1500 + R() * 1400, -2000 - R() * 8000);
    scene.add(s); clouds.push(s);
  }
  updaters.push((dt) => { for (const s of clouds) { s.position.x += dt * 4; if (s.position.x > 8000) s.position.x = -8000; } });
  const tintClouds = (k, A) => { for (const s of clouds) { s.material.color.set(A.cloud); s.material.opacity = A.moon ? 0.35 : 0.8; } };
  api.onAmbiance.push(tintClouds); tintClouds(api.ambiance, AMBIANCES[api.ambiance]);
}

/* ---------------------------------- camp ---------------------------------- */
function planTexture() {
  const W = 1024, H = 700, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  x.fillStyle = "#f3efe4"; x.fillRect(0, 0, W, H);
  x.strokeStyle = "rgba(0,102,157,0.12)"; x.lineWidth = 1;
  for (let i = 0; i < W; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); }
  for (let j = 0; j < H; j += 32) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); }
  const R = rng(9);
  for (let k = 0; k < 16; k++) { // contour lines around two hills
    for (const [hx, hy, s] of [[330, 300, 1], [720, 420, 0.8]]) {
      const r0 = (24 + k * 26) * s; x.beginPath();
      for (let a = 0; a <= 64; a++) { const t = a / 64 * Math.PI * 2, rr = r0 * (1 + 0.12 * Math.sin(t * 3 + k * 0.4) + 0.06 * Math.sin(t * 5 + hx)); const px = hx + rr * Math.cos(t), py = hy + rr * 0.72 * Math.sin(t); a ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.strokeStyle = k % 5 === 0 ? "rgba(140,90,40,0.85)" : "rgba(160,110,60,0.45)"; x.lineWidth = k % 5 === 0 ? 2.4 : 1.2; x.stroke();
    }
  }
  x.strokeStyle = "#2ab5b4"; x.lineWidth = 2.5;
  for (let i = 0; i < 9; i++) { const px = 80 + R() * 820, py = 520 + R() * 120; x.strokeRect(px, py, 50 + R() * 70, 30 + R() * 40); }
  x.strokeStyle = "#c0392b"; x.lineWidth = 4; x.beginPath(); x.moveTo(0, 480); x.bezierCurveTo(300, 420, 600, 560, 1024, 470); x.stroke();
  x.fillStyle = "#0a1e30"; x.fillRect(W - 330, H - 110, 310, 92);
  x.fillStyle = "#fff"; x.font = "700 30px system-ui, sans-serif"; x.fillText("ETAFAT", W - 310, H - 70);
  x.fillStyle = "#8ee6e4"; x.font = "500 17px system-ui, sans-serif"; x.fillText("Levé topographique · Aït Bouguemez", W - 310, H - 44); x.fillText("Échelle 1/2 000", W - 310, H - 24);
  x.fillStyle = "#0a1e30"; x.beginPath(); x.moveTo(60, 40); x.lineTo(76, 96); x.lineTo(60, 84); x.lineTo(44, 96); x.closePath(); x.fill();
  x.font = "700 22px system-ui, sans-serif"; x.fillText("N", 52, 30);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function flagTexture() {
  const W = 256, H = 640, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0a1e30"); g.addColorStop(1, "#00669d");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.fillStyle = "#2ab5b4"; x.fillRect(0, H - 40, W, 40);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const img = new Image();
  img.onload = () => { x.fillStyle = "#fff"; x.fillRect(28, 60, W - 56, 170); const r = Math.min((W - 80) / img.width, 140 / img.height); x.drawImage(img, (W - img.width * r) / 2, 60 + (170 - img.height * r) / 2, img.width * r, img.height * r); t.needsUpdate = true; };
  img.src = "/etafat/logo-footer.png";
  return t;
}
function buildCamp(scene, T, updaters, M) {
  const camp = {};
  const wood = lambert({ color: 0x8a6a4a }), metal = lambert({ color: 0x9aa2aa }), dark = lambert({ color: 0x23282e }), yellow = lambert({ color: 0xf2c230 }), orange = lambert({ color: 0xe8752a });
  const put = (o, x, z, y = 0) => { o.position.set(x, T.heightAt(x, z) + y, z); o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(o); return o; };

  // observatory deck under the viewer (flat VR floor at y = 0): Ø 6 m platform with an inlaid compass and
  // zone signposts, glowing edge strip, glass balustrade around the sides and back (the front stays open)
  buildDeck(scene, T, updaters);

  // plan table
  const [tx, tz] = polar(-36, 7.5);
  const table = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.05, 0.95), wood); top.position.y = 0.92; table.add(top);
  for (const [lx, lz] of [[-0.78, -0.4], [0.78, -0.4], [-0.78, 0.4], [0.78, 0.4]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.05), wood); l.position.set(lx, 0.45, lz); table.add(l); }
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.06), new THREE.MeshLambertMaterial({ map: planTexture() }));
  sheet.rotation.x = -Math.PI / 2; sheet.position.y = 0.948; table.add(sheet);
  const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.015, 0.2), dark); tablet.position.set(0.62, 0.955, 0.3); tablet.rotation.y = 0.4; table.add(tablet);
  table.rotation.y = 0.35; bake(put(table, tx, tz));
  camp.table = { x: tx, z: tz, rot: 0.35 };

  // total station on tripod, aimed at the prism pole down the slope
  const [sx, sz] = polar(32, 9), [prx, prz] = polar(14, 24); // prism on the visible shoulder
  const ts = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2, leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.52, 5), wood);
    leg.position.set(Math.cos(a) * 0.22, 0.72, Math.sin(a) * 0.22); leg.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3); ts.add(leg);
  }
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 12), metal); plate.position.y = 1.46; ts.add(plate);
  const head = new THREE.Group(); head.position.y = 1.62; ts.add(head);
  const bodyTS = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.16), yellow); head.add(bodyTS);
  const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.26, 12), dark); scope.rotation.x = Math.PI / 2; scope.position.y = 0.04; head.add(scope);
  put(ts, sx, sz);
  const ty0 = T.heightAt(sx, sz) + 1.66, py0 = T.heightAt(prx, prz) + 2.05;
  head.lookAt(new THREE.Vector3(prx, py0, prz)); bake(ts);
  camp.station = { x: sx, z: sz, prism: { x: prx, z: prz } };

  // prism pole
  const pole = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.0, 6), lambert({ color: 0xf4f4f4 })); shaft.position.y = 1.0; pole.add(shaft);
  const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 10), orange); prism.rotation.x = Math.PI / 2; prism.position.y = 2.06; pole.add(prism);
  camp.prismPole = bake(pole); // placed beside the prism holder in buildCrew

  // laser/measurement line between instrument and prism
  const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(sx, ty0, sz), new THREE.Vector3(prx, py0, prz)]);
  const laser = new THREE.Line(lg, new THREE.LineDashedMaterial({ color: 0xff4d4d, dashSize: 0.8, gapSize: 0.5, transparent: true, opacity: 0.7 }));
  laser.computeLineDistances(); scene.add(laser);
  updaters.push((dt, t) => { laser.material.opacity = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(t * 3)); });

  // equipment case + stakes along the GNSS route
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.4), orange); put(box, sx - 1.1, sz + 0.6, 0.175);
  camp.route = [polar(-30, 15), polar(-12, 21), polar(8, 18), polar(24, 23)];
  for (const [x, z] of camp.route) {
    const stake = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), wood); post.position.y = 0.3; stake.add(post);
    const tape = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.006), lambert({ color: 0xff3fa4, emissive: 0x5a0f38 })); tape.position.set(0.14, 0.55, 0); stake.add(tape);
    bake(put(stake, x + 0.6, z));
  }

  // GNSS base station on a tripod (reference receiver for the rover), with radio whip and receiver box
  const [gbx, gbz] = polar(-22, 12), gnss = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2, leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.52, 5), wood);
    leg.position.set(Math.cos(a) * 0.24, 0.72, Math.sin(a) * 0.24); leg.rotation.set(Math.sin(a) * 0.32, 0, -Math.cos(a) * 0.32); gnss.add(leg);
  }
  const tribrach = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.1, 10), dark); tribrach.position.y = 1.5; gnss.add(tribrach);
  const antB = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.08, 16), lambert({ color: 0xf2f2f2 })); antB.position.y = 1.6; gnss.add(antB);
  const rx = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.16), yellow); rx.position.set(0.18, 0.95, 0.08); gnss.add(rx);
  const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.01, 0.7, 4), dark); whip.position.set(0.24, 1.36, 0.08); gnss.add(whip);
  const ecase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.35), orange); ecase.position.set(-0.55, 0.15, 0.35); ecase.rotation.y = 0.4; gnss.add(ecase);
  bake(put(gnss, gbx, gbz));
  camp.base = { x: gbx, z: gbz };

  // field camp (Quaternius CC0 tent in ETAFAT colours), engineer's folding table with a laptop showing a point cloud
  const placeModel = (src, x, z, scale, rotY, minY = 0, recolor = {}) => {
    const o = src.scene.clone(true); o.scale.setScalar(scale); o.rotation.y = rotY;
    o.position.set(x, T.heightAt(x, z) - minY * scale, z);
    o.traverse((m) => { if (!m.isMesh) return; m.castShadow = m.receiveShadow = true; if (recolor[m.material.name] != null) { m.material = m.material.clone(); m.material.color.set(recolor[m.material.name]); } });
    scene.add(o); return o;
  };
  const [tx2, tz2] = polar(-61, 10.5);
  placeModel(M.tent, tx2, tz2, 0.13, Math.atan2(-tx2, -tz2) + Math.PI / 2, -0.18, { Green: 0x17344f, LightGreen: 0xcdbfa6 });
  const [fx2, fz2] = polar(-52, 7.6), desk = new THREE.Group();
  const top2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.6), lambert({ color: 0xd9d4c7, flatShading: false })); top2.position.y = 0.76; desk.add(top2);
  for (const [lx, lz] of [[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]]) { const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.76, 6), lambert({ color: 0x8a9096 })); lg.position.set(lx, 0.38, lz); desk.add(lg); }
  const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.25), lambert({ color: 0x2b3038 })); lapBase.position.set(0, 0.79, 0.05); desk.add(lapBase);
  const lapScreen = new THREE.Group(); lapScreen.position.set(0, 0.8, -0.075); lapScreen.rotation.x = -0.32; desk.add(lapScreen);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.012), lambert({ color: 0x2b3038 })); lid.position.y = 0.12; lapScreen.add(lid);
  const pc = document.createElement("canvas"); pc.width = 256; pc.height = 160; const pcx = pc.getContext("2d"), PR = rng(4);
  pcx.fillStyle = "#06121f"; pcx.fillRect(0, 0, 256, 160);
  for (let i = 0; i < 2600; i++) { const xx = PR() * 256, yy = 70 + 60 * Math.sin(xx * 0.03) * 0.5 + PR() * 70; const h = (yy - 40) / 120; pcx.fillStyle = `hsl(${180 - h * 140},90%,${50 + PR() * 20}%)`; pcx.fillRect(xx, yy, 1.4, 1.4); }
  pcx.fillStyle = "#2ab5b4"; pcx.fillRect(0, 0, 256, 14); pcx.fillStyle = "#fff"; pcx.font = "700 10px sans-serif"; pcx.fillText("ETAFAT · nuage de points LiDAR", 6, 10);
  const pct = new THREE.CanvasTexture(pc); pct.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.21), new THREE.MeshBasicMaterial({ map: pct, toneMapped: false })); scr.position.set(0, 0.12, 0.007); lapScreen.add(scr);
  desk.rotation.y = Math.atan2(-fx2, -fz2); bake(desk, { keep: [lapScreen] }); put(desk, fx2, fz2);
  camp.desk = { x: fx2, z: fz2, rot: desk.rotation.y };
  placeModel(M.solar, ...polar(-27, 13.4), 0.55, 0.8, 3.58);
  placeModel(M.antenna, ...polar(-16, 13), 0.7, 0, 4.07);

  // ETAFAT feather flag
  const [fx, fz] = polar(-47, 11);
  const flag = new THREE.Group();
  const fp = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 3.4, 6), metal); fp.position.y = 1.7; flag.add(fp);
  const fgeo = new THREE.PlaneGeometry(0.8, 2.3, 10, 12);
  const cloth = new THREE.Mesh(fgeo, new THREE.MeshLambertMaterial({ map: flagTexture(), side: THREE.DoubleSide })); cloth.position.set(0.42, 2.15, 0); flag.add(cloth);
  flag.rotation.y = 0.9; put(flag, fx, fz);
  const base = fgeo.attributes.position.array.slice();
  updaters.push((dt, t) => {
    const p = fgeo.attributes.position;
    for (let i = 0; i < p.count; i++) { const bx = base[i * 3], by = base[i * 3 + 1], u = (bx + 0.4) / 0.8; p.setZ(i, Math.sin(t * 3.2 + bx * 5 + by * 1.5) * 0.09 * u); }
    p.needsUpdate = true; fgeo.computeVertexNormals();
  });
  return camp;
}

/* ------------------------------ observatory deck ------------------------------ */
export const DECK_R = 3.0;
export const ZONES = [ // world azimuths (° clockwise from north = straight ahead at start)
  { key: "presence", label: "PRÉSENCE", dock: "Présence dans le monde", az: 0 },
  { key: "expertises", label: "EXPERTISES", dock: "Nos expertises", az: 88 },
  { key: "cite", label: "CITÉ PORTUGAISE", dock: "Cité portugaise · maquette 3D", az: 132 },
  { key: "cinema", label: "CINÉMA", dock: "Cinéma ETAFAT", az: -90 },
  { key: "chiffres", label: "CHIFFRES CLÉS", dock: "Chiffres clés", az: 180 },
];
function deckTexture() {
  const N = 2048, c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d"), R = rng(31), C = N / 2, px = N / (2 * DECK_R);
  // warm composite decking: parallel boards with grooves and grain
  for (let i = 0; i < 40; i++) {
    const y0 = i * N / 40, tone = 0.86 + R() * 0.2;
    x.fillStyle = `rgb(${158 * tone},${116 * tone},${78 * tone})`; x.fillRect(0, y0, N, N / 40);
    for (let k = 0; k < 26; k++) { x.strokeStyle = `rgba(${90 + R() * 40},${60 + R() * 25},${35},${0.08 + R() * 0.1})`; x.lineWidth = 1 + R() * 2; const yy = y0 + R() * N / 40; x.beginPath(); x.moveTo(0, yy); x.bezierCurveTo(N * 0.3, yy + (R() - 0.5) * 6, N * 0.7, yy + (R() - 0.5) * 6, N, yy); x.stroke(); }
    x.fillStyle = "rgba(40,24,12,0.55)"; x.fillRect(0, y0, N, 3);
    for (let j = 0; j < 3; j++) { const xx = R() * N; x.fillRect(xx, y0, 3, N / 40); } // board ends
  }
  // inlay: dark ring with a compass rose (north = the globe), zone signposts, ETAFAT medallion
  x.translate(C, C);
  const ring = (r0, r1, col) => { x.beginPath(); x.arc(0, 0, r1, 0, Math.PI * 2); x.arc(0, 0, r0, 0, Math.PI * 2, true); x.fillStyle = col; x.fill(); };
  ring(0.55 * px, 0.95 * px, "rgba(10,30,48,0.92)");
  ring(0.93 * px, 0.95 * px, "#2ab5b4"); ring(0.55 * px, 0.565 * px, "#2ab5b4");
  for (let a = 0; a < 360; a += 5) { const L = a % 45 === 0 ? 0.13 : 0.06, s = Math.sin(a * DEG), k = -Math.cos(a * DEG); x.strokeStyle = a % 45 === 0 ? "#8ee6e4" : "rgba(142,230,228,0.55)"; x.lineWidth = a % 45 === 0 ? 5 : 2.5; x.beginPath(); x.moveTo(s * 0.93 * px, k * 0.93 * px); x.lineTo(s * (0.93 - L) * px, k * (0.93 - L) * px); x.stroke(); }
  x.fillStyle = "#2ab5b4"; x.beginPath(); x.moveTo(0, -0.93 * px); x.lineTo(0.05 * px, -0.8 * px); x.lineTo(-0.05 * px, -0.8 * px); x.closePath(); x.fill();
  x.textAlign = "center"; x.textBaseline = "middle";
  for (const z of ZONES) { // signposts: label + arrow pointing to each zone, readable from the centre
    x.save(); x.rotate(z.az * DEG); x.translate(0, -1.32 * px);
    x.fillStyle = "rgba(10,30,48,0.85)";
    x.font = `700 ${Math.round(0.085 * px)}px system-ui, sans-serif`; const tw = x.measureText(z.label).width;
    x.beginPath(); x.roundRect(-tw / 2 - 0.08 * px, -0.075 * px, tw + 0.16 * px, 0.15 * px, 0.075 * px); x.fill();
    x.fillStyle = "#e6f7f7"; x.fillText(z.label, 0, 0);
    x.fillStyle = "#2ab5b4"; x.beginPath(); x.moveTo(0, -0.2 * px); x.lineTo(0.06 * px, -0.11 * px); x.lineTo(-0.06 * px, -0.11 * px); x.closePath(); x.fill();
    x.restore();
  }
  x.fillStyle = "rgba(10,30,48,0.9)"; x.beginPath(); x.arc(0, 0, 0.42 * px, 0, Math.PI * 2); x.fill();
  x.strokeStyle = "#2ab5b4"; x.lineWidth = 6; x.stroke();
  x.setTransform(1, 0, 0, 1, 0, 0);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const img = new Image(); img.onload = () => { // logo in the centre medallion
    const w = 0.62 * px, h = w * img.height / img.width; x.drawImage(img, C - w / 2, C - h / 2 - 0.02 * px, w, h); tex.needsUpdate = true;
  };
  img.src = "./img/etafat-logo-dark.png";
  return tex;
}
function buildDeck(scene, T, updaters) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CircleGeometry(DECK_R, 96).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: deckTexture(), roughness: 0.82, metalness: 0 }));
  top.receiveShadow = true; g.add(top);
  const fascia = new THREE.Mesh(new THREE.CylinderGeometry(DECK_R, DECK_R - 0.06, 0.2, 96, 1, true).translate(0, -0.1, 0), new THREE.MeshStandardMaterial({ color: 0x1d2630, roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide }));
  fascia.castShadow = true; g.add(fascia);
  const under = new THREE.Mesh(new THREE.CircleGeometry(DECK_R - 0.05, 48).rotateX(Math.PI / 2).translate(0, -0.2, 0), new THREE.MeshStandardMaterial({ color: 0x232b33, roughness: 0.9 }));
  g.add(under);
  // edge light strip: always a thin teal line, brighter at night
  const led = new THREE.Mesh(new THREE.TorusGeometry(DECK_R + 0.004, 0.012, 6, 192).rotateX(Math.PI / 2).translate(0, -0.035, 0), new THREE.MeshBasicMaterial({ color: 0x5ff5f0, toneMapped: false }));
  g.add(led);
  updaters.push(() => { led.material.color.setRGB(0.25 + 0.35 * NIGHT.value, 0.8 + 0.2 * NIGHT.value, 0.8 + 0.2 * NIGHT.value); });
  // posts down to the ground
  const steel = new THREE.MeshStandardMaterial({ color: 0x3a434d, roughness: 0.4, metalness: 0.8 });
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2 + 0.2, x = (DECK_R - 0.35) * Math.sin(a), z = -(DECK_R - 0.35) * Math.cos(a);
    const depth = Math.max(0.4, -T.heightAt(x, z) + 0.4);
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, depth, 10), steel); p.position.set(x, -0.2 - depth / 2, z); p.castShadow = true; g.add(p);
  }
  // glass balustrade from 62° round the back to −62° (the front stays open onto the globe and the valley)
  const A0 = 62 * DEG, A1 = (360 - 62) * DEG, HR = 1.02, RR = DECK_R - 0.08;
  const arc = (a0, a1, n, r, y) => { const pts = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push(new THREE.Vector3(r * Math.sin(a), y, -r * Math.cos(a))); } return new THREE.CatmullRomCurve3(pts); };
  const rail = new THREE.Mesh(new THREE.TubeGeometry(arc(A0, A1, 64, RR, HR), 160, 0.024, 8, false), steel); rail.castShadow = true; g.add(rail);
  // CylinderGeometry puts θ at (sin θ, cos θ); our azimuth a sits at (sin a, −cos a) → θ = π − a
  const glassGeo = new THREE.CylinderGeometry(RR - 0.01, RR - 0.01, HR - 0.1, 96, 1, true, Math.PI - A1, A1 - A0).translate(0, (HR - 0.1) / 2 + 0.04, 0);
  const glass = new THREE.Mesh(glassGeo, new THREE.MeshStandardMaterial({ color: 0xbfe6ee, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false }));
  glass.renderOrder = 2; g.add(glass);
  for (let i = 0; i <= 10; i++) {
    const a = A0 + (A1 - A0) * i / 10, post = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, HR, 8), steel);
    post.position.set(RR * Math.sin(a), HR / 2, -RR * Math.cos(a)); post.castShadow = true; g.add(post);
  }
  scene.add(g);
}

/* ---------------------------------- crew ---------------------------------- */
async function buildCrew(scene, T, camp, renderer, camera, updaters, M, api) {
  const W = M.worker, F = M.woman;
  const tmpV = new THREE.Vector3();

  // Each Quaternius rig has 9–13 skinned parts (one per material) sharing one skeleton and bind pose:
  // merge them into a single SkinnedMesh (1 draw call) with the colours per vertex, smooth normals, and two
  // tags for the shader: hi-vis vests get retro-reflective tape (glowing at night); every figure gets a rim
  // light in the ambiance's colour, which lifts them off the landscape.
  const RIM = { value: new THREE.Color(0xffc58a) };
  const RIMS = { golden: [0xffb877, 0.32], day: [0xe8f2ff, 0.16], night: [0x7f9dff, 0.45] };
  const rimSet = (k) => { const [c, i] = RIMS[k] || RIMS.golden; RIM.value.set(c).multiplyScalar(i); };
  api.onAmbiance.push(rimSet); rimSet(api.ambiance);
  const crewMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.74, metalness: 0.05 });
  crewMat.onBeforeCompile = (sh) => {
    sh.uniforms.uRim = RIM; sh.uniforms.uNight = NIGHT;
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float aTag; attribute float aBand; varying float vTag; varying float vBand;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvTag = aTag; vBand = aBand;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform vec3 uRim; uniform float uNight; varying float vTag; varying float vBand;")
      .replace("#include <color_fragment>", `#include <color_fragment>
        float tape = 0.0;
        if (vTag > 0.5 && vTag < 1.5) tape = (step(0.30, vBand) - step(0.38, vBand)) + (step(0.6, vBand) - step(0.68, vBand));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.72, 0.74, 0.76), tape);`)
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        totalEmissiveRadiance += uRim * pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 3.0);
        totalEmissiveRadiance += vec3(0.9, 0.92, 0.95) * tape * (0.06 + uNight * 0.55);`);
  };
  crewMat.customProgramCacheKey = () => "crew-v2";
  const KEEP = ["position", "skinIndex", "skinWeight"], VEST = ["Worker_Vest", "Orange"];
  function mergeRig(obj, recolor) {
    const parts = []; obj.traverse((o) => { if (o.isSkinnedMesh) parts.push(o); });
    const ref = parts[0], col = new THREE.Color();
    let merged = mergeGeometries(parts.map((m) => {
      const g = m.geometry.clone(); for (const k of Object.keys(g.attributes)) if (!KEEP.includes(k)) g.deleteAttribute(k);
      const name = m.material.name; col.copy(recolor?.[name] != null ? new THREE.Color(recolor[name]) : m.material.color).multiplyScalar(0.8);
      const n = g.attributes.position.count, a = new Float32Array(n * 3), tag = new Float32Array(n), band = new Float32Array(n);
      for (let i = 0; i < n; i++) col.toArray(a, i * 3);
      if (VEST.includes(name)) { // tape heights relative to the vest itself (bind pose)
        let lo = Infinity, hi = -Infinity; const p = g.attributes.position;
        for (let i = 0; i < n; i++) { lo = Math.min(lo, p.getY(i)); hi = Math.max(hi, p.getY(i)); }
        for (let i = 0; i < n; i++) { tag[i] = 1; band[i] = (p.getY(i) - lo) / Math.max(1e-6, hi - lo); }
      }
      g.setAttribute("color", new THREE.BufferAttribute(a, 3)); g.setAttribute("aTag", new THREE.BufferAttribute(tag, 1)); g.setAttribute("aBand", new THREE.BufferAttribute(band, 1));
      return g;
    }));
    if (!merged) { parts.forEach((m) => { m.castShadow = true; m.frustumCulled = false; }); return; } // fallback: unmerged
    merged = mergeVertices(merged, 1e-4); merged.computeVertexNormals(); // smooth shading across each part
    const mesh = new THREE.SkinnedMesh(merged, crewMat); mesh.bind(ref.skeleton, ref.bindMatrix);
    mesh.castShadow = true; mesh.frustumCulled = false; ref.parent.add(mesh);
    for (const m of parts) m.removeFromParent();
  }
  function spawn(src, { x, z, face, height = 1.75, recolor }) {
    const obj = SkeletonUtils.clone(src.scene);
    mergeRig(obj, recolor);
    obj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(obj, true), k = height / Math.max(1e-6, box.max.y - box.min.y);
    obj.scale.setScalar(k);
    const foot = -box.min.y * k;
    obj.position.set(x, T.heightAt(x, z) + foot, z);
    obj.rotation.y = face;
    scene.add(obj);
    const mixer = new THREE.AnimationMixer(obj), actions = {};
    for (const clip of src.animations) actions[clip.name] = mixer.clipAction(clip);
    const c = { obj, mixer, actions, current: null, foot, t: 0, state: 0, head: obj.getObjectByName("Head"), look: 0 };
    c.headRest = c.head ? c.head.quaternion.clone() : null; // the look-at is re-applied on this every frame (clips that don't key the head would otherwise accumulate it)
    c.play = (name, fade = 0.35, once = false) => {
      const next = actions[name]; if (!next || c.current === next) return;
      next.reset(); next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity); next.clampWhenFinished = once;
      next.fadeIn(fade).play(); if (c.current) c.current.fadeOut(fade); c.current = next;
    };
    return c;
  }
  function attach(c, boneName, prop, offset = [0, 0, 0], rot = [0, 0, 0]) {
    const bone = c.obj.getObjectByName(boneName); if (!bone) return;
    c.obj.updateMatrixWorld(true); bone.getWorldScale(tmpV);
    const s = 1 / tmpV.x;
    prop.scale.multiplyScalar(s); prop.position.set(offset[0] * s, offset[1] * s, offset[2] * s); prop.rotation.set(rot[0], rot[1], rot[2]);
    prop.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    bone.add(prop);
  }
  const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
  const hardHat = (hex) => {
    const g = new THREE.Group(), m = lambert({ color: hex, flatShading: false });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), m);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.012, 16), m); brim.position.y = 0.005;
    g.add(dome, brim); return bake(g, { smooth: true });
  };
  const crew = [];
  const T0 = camp.table;
  // a mixed crew, as on ETAFAT's projects across Africa: skin/hair palettes for Black colleagues
  const blackM = (skin) => ({ Skin: skin, Eyebrows: 0x17120e, Moustache: 0x1b1511 });
  const blackF = (skin) => ({ Skin: skin, Hair_Blond: 0x1e1713, Hair_Brown: 0x15100d });

  // plan-table team
  const [ax, az] = [T0.x + Math.sin(T0.rot) * -0.95, T0.z + Math.cos(T0.rot) * -0.95];
  const a = spawn(W, { x: ax, z: az, face: faceTo(ax, az, T0.x, T0.z) });
  a.play("Interact"); crew.push({ c: a, tick(dt) { a.t += dt; if (a.t > 6) a.t = 0; a.play(a.t < 3.5 ? "Interact" : "Idle"); } });

  const [bx, bz] = [T0.x + Math.cos(T0.rot) * 1.15, T0.z - Math.sin(T0.rot) * 1.15];
  const b = spawn(F, { x: bx, z: bz, face: faceTo(bx, bz, T0.x, T0.z), height: 1.68 });
  attach(b, "Head", hardHat(0xf4f4f4), [0, 0.2, 0.01]);
  b.play("Idle_Neutral"); b.cool = 0;
  crew.push({ c: b, tick(dt) { // waves when the visitor looks at her
    b.cool -= dt;
    if (b.cool <= 0 && looking(b.obj.position, 14)) { b.play("Wave", 0.25, true); b.cool = 14; b.back = 2.6; }
    if (b.back != null) { b.back -= dt; if (b.back <= 0) { b.back = null; b.play("Idle_Neutral"); } }
  } });

  // total-station surveyor (white hat = engineer) + prism holder
  const st = camp.station;
  const [ux, uz] = [st.x - 0.1, st.z + 0.55];
  const u = spawn(W, { x: ux, z: uz, face: faceTo(ux, uz, st.prism.x, st.prism.z), recolor: { Worker_Yellow: 0xf4f4f4, ...blackM(0x5e3b27) } });
  crew.push({ c: u, tick(dt) { u.t += dt; if (u.t > 8) u.t = 0; u.play(u.t < 2.6 ? "Interact" : "Idle_Neutral"); } });
  const [hx, hz] = [st.prism.x + 0.45, st.prism.z + 0.2];
  const h = spawn(W, { x: hx, z: hz, face: faceTo(hx, hz, st.x, st.z), recolor: { Worker_Vest: 0xd6ff3a } });
  h.play("Idle_Neutral");
  const pole = camp.prismPole; pole.position.set(st.prism.x, T.heightAt(st.prism.x, st.prism.z), st.prism.z); pole.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(pole);
  crew.push({ c: h, tick() {} });

  // GNSS rover: walks the stakes, measures at each
  const route = camp.route;
  const g = spawn(W, { x: route[0][0], z: route[0][1], face: 0, recolor: { Worker_Vest: 0xff9f1c, ...blackM(0x7a4c32) } });
  // rover pole: held in the right hand but kept plumb with its foot on the ground (as surveyors do),
  // so it follows the hand in world space instead of inheriting the wrist's swing.
  const rover = new THREE.Group();
  const rshaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.9, 6), lambert({ color: 0xf0f0f0 })); rover.add(rshaft);
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 14), lambert({ color: 0xf2f2f2 })); ant.position.y = 0.98; rover.add(ant);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6), lambert({ color: 0xe8752a })); band.position.y = 0.2; rover.add(band);
  rover.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(bake(rover));
  const wristR = g.obj.getObjectByName("WristR"), hand = new THREE.Vector3();
  g.leg = 0; g.wait = 2.5; g.play("Interact");
  crew.push({ c: g, tick(dt) {
    walkRoute(dt);
    if (wristR) { wristR.getWorldPosition(hand); rover.position.set(hand.x, T.heightAt(hand.x, hand.z) + 0.95, hand.z); }
  } });
  function walkRoute(dt) {
    if (g.wait > 0) { g.wait -= dt; if (g.wait < 1.0) g.play("Idle"); if (g.wait <= 0) { g.leg = (g.leg + 1) % route.length; g.play("Walk"); } return; }
    const [tx2, tz2] = route[g.leg], o = g.obj.position, dx = tx2 - o.x, dz = tz2 - o.z, dist = Math.hypot(dx, dz);
    if (dist < 0.15) { g.wait = 4.5; g.play("Interact"); return; }
    const step = Math.min(dist, 1.25 * dt); o.x += dx / dist * step; o.z += dz / dist * step; o.y = T.heightAt(o.x, o.z) + g.foot;
    const want = Math.atan2(dx, dz); let d = want - g.obj.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); g.obj.rotation.y += d * Math.min(1, dt * 5);
  }

  // drone pilot (arms forward with a controller), turns to follow the filming drone
  const [px, pz] = polar(50, 5.5);
  const p = spawn(F, { x: px, z: pz, face: faceTo(px, pz, ...polar(34, 20)), height: 1.66 });
  attach(p, "Head", hardHat(0xf2c230), [0, 0.2, 0.01]);
  // she points at the drone with her right arm; the remote controller is in her left hand
  const ctrl = new THREE.Group();
  ctrl.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.12), lambert({ color: 0x2b3038 })));
  for (const s of [-1, 1]) { const st2 = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.14, 4), lambert({ color: 0x9aa2aa })); st2.position.set(0.085 * s, 0.07, -0.05); ctrl.add(st2); }
  scene.add(bake(ctrl));
  const wl = p.obj.getObjectByName("WristL"), va = new THREE.Vector3();
  p.play("Idle_Gun_Pointing");
  crew.push({ c: p, tick(dt, t) {
    const [ocx, ocz] = polar(34, 20), dx = ocx + 6 * Math.cos(t * 0.33) - p.obj.position.x, dz = ocz + 6 * Math.sin(t * 0.33) - p.obj.position.z;
    let d = Math.atan2(dx, dz) - p.obj.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); p.obj.rotation.y += d * Math.min(1, dt * 2);
    if (wl) { wl.getWorldPosition(va); ctrl.position.set(va.x + Math.sin(p.obj.rotation.y) * 0.06, va.y - 0.04, va.z + Math.cos(p.obj.rotation.y) * 0.06); ctrl.rotation.set(0, p.obj.rotation.y, 0); ctrl.rotateX(1.0); }
  } });


  // drone data operator: checks the live point cloud on a rugged tablet beside the pilot
  const [ox, oz] = polar(22, 6.8);
  const o = spawn(F, { x: ox, z: oz, face: faceTo(ox, oz, ...polar(34, 20)), height: 1.7, recolor: { ...blackF(0x6a412b), White: 0x2ab5b4 } });
  attach(o, "Head", hardHat(0xf4f4f4), [0, 0.2, 0.01]);
  const tablet = new THREE.Group();
  tablet.add(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.018, 0.18), lambert({ color: 0x2b3038 })));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.14).rotateX(-Math.PI / 2).translate(0, 0.011, 0), new THREE.MeshBasicMaterial({ color: 0x3fd8d4 }));
  scene.add(bake(tablet)); tablet.add(screen);
  const owl = o.obj.getObjectByName("WristL"), ov = new THREE.Vector3();
  o.play("Idle_Neutral");
  crew.push({ c: o, tick(dt, t) {
    o.t += dt; if (o.t > 9) o.t = 0; o.play(o.t < 2.4 ? "Interact" : "Idle_Neutral");
    if (owl) { owl.getWorldPosition(ov); const f = o.obj.rotation.y; tablet.position.set(ov.x + Math.sin(f) * 0.12, ov.y + 0.02, ov.z + Math.cos(f) * 0.12); tablet.rotation.set(0, f, 0); tablet.rotateX(-0.55); }
    screen.material.color.setHSL(0.49, 0.65, 0.5 + 0.08 * Math.sin(t * 2.3));
  } });

  // GNSS base-station technician
  const bs = camp.base, [nx, nz] = polar(-26, 11);
  const n = spawn(W, { x: nx, z: nz, face: faceTo(nx, nz, bs.x, bs.z), recolor: blackM(0x4f3222) });
  n.play("Idle"); n.t = 3;
  crew.push({ c: n, tick(dt) { n.t += dt; if (n.t > 10) n.t = 0; n.play(n.t < 3.2 ? "Interact" : "Idle"); } });

  // welcome card while the scene assembles (left of the globe, inside the first view)
  const welcome = (() => {
    const c = document.createElement("canvas"); c.width = 900; c.height = 300; const x = c.getContext("2d");
    x.beginPath(); x.roundRect(6, 6, 888, 288, 40); x.fillStyle = "rgba(10,30,48,0.92)"; x.fill(); x.lineWidth = 4; x.strokeStyle = "#2ab5b4"; x.stroke();
    x.fillStyle = "#8ee6e4"; x.font = "700 30px system-ui, sans-serif"; x.fillText("BIENVENUE CHEZ ETAFAT", 46, 70);
    x.fillStyle = "#fff"; x.font = "600 36px system-ui, sans-serif"; x.fillText("Baissez les yeux : le menu vous guide", 46, 128);
    x.fillStyle = "rgba(234,244,248,0.85)"; x.font = "400 29px system-ui, sans-serif";
    x.fillText("vers le globe, nos expertises, la Cité portugaise", 46, 186); x.fillText("en 3D, le cinéma et les chiffres clés.", 46, 228);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.4), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }));
    const [wx, wz] = polar(-34, 2.9); m.position.set(wx, 1.95, wz); m.lookAt(0, 1.6, 0);
    m.renderOrder = 40; m.visible = false; scene.add(m); return m;
  })();
  updaters.push((dt, t) => {
    const show = Math.min(1, Math.max(0, (t - 3.4) / 0.5)) * Math.min(1, Math.max(0, (15 - t) / 0.8));
    welcome.visible = show > 0.01; welcome.material.opacity = show; welcome.position.y = 1.95 + 0.02 * Math.sin(t * 1.5);
  });

  // data engineer at the field desk (Quaternius "Casual Character", CC0), checking the LiDAR point cloud
  const dk = camp.desk, [ex, ez] = [dk.x + Math.sin(dk.rot) * -0.62, dk.z + Math.cos(dk.rot) * -0.62];
  const en = spawn(M.casual, { x: ex, z: ez, face: faceTo(ex, ez, dk.x, dk.z), recolor: { Red_Dark: 0x0f5e6e, LightBlue: 0x1b2836, Skin: 0x8a5a3c, Skin_Darker: 0x6a412b } });
  en.play("Interact"); en.t = 1;
  crew.push({ c: en, tick(dt) { en.t += dt; if (en.t > 7) en.t = 0; en.play(en.t < 4.5 ? "Interact" : "Idle_Neutral"); } });

  const fwd = new THREE.Vector3(), to = new THREE.Vector3(), eye = new THREE.Vector3();
  function looking(pos, deg) {
    const cam = renderer.xr.isPresenting ? renderer.xr.getCamera() : camera;
    cam.getWorldDirection(fwd); cam.getWorldPosition(eye);
    to.set(pos.x, pos.y + 1.4, pos.z).sub(eye).normalize();
    return fwd.dot(to) > Math.cos(deg * DEG);
  }
  // heads turn toward the visitor when they look at someone nearby (yaw ±60°, pitch ±25°, blended over the animation)
  const hp = new THREE.Vector3(), pq = new THREE.Quaternion(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0), right = new THREE.Vector3();
  function headLook(c, dt) {
    if (!c.head) return;
    const cam = renderer.xr.isPresenting ? renderer.xr.getCamera() : camera; cam.getWorldPosition(eye);
    c.head.getWorldPosition(hp);
    const dist = hp.distanceTo(eye), want = dist < 16 && looking(c.obj.position, 14) ? 0.85 : 0;
    c.look += (want - c.look) * Math.min(1, dt * 2.5); if (c.look < 0.01) return;
    const ry = c.obj.rotation.y, dx = eye.x - hp.x, dz = eye.z - hp.z;
    let yaw = Math.atan2(dx, dz) - ry; yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
    yaw = THREE.MathUtils.clamp(yaw, -1.05, 1.05); const pitch = THREE.MathUtils.clamp(Math.atan2(eye.y - hp.y, Math.hypot(dx, dz)), -0.45, 0.45);
    right.set(Math.cos(ry + yaw), 0, -Math.sin(ry + yaw));
    qa.setFromAxisAngle(UP, yaw * c.look).premultiply(qb.setFromAxisAngle(right, -pitch * c.look)); // world-space extra rotation
    c.head.parent.getWorldQuaternion(pq);
    c.head.quaternion.premultiply(pq.clone().invert().multiply(qa).multiply(pq));
  }
  updaters.push((dt, t) => { for (const m of crew) { if (m.c.headRest) m.c.head.quaternion.copy(m.c.headRest); m.c.mixer.update(dt); m.tick(dt, t); headLook(m.c, dt); } });
}
