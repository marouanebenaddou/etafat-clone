// ETAFAT VR — living landscape around the lookout.
// Real relief of the Aït Bouguemez valley (High Atlas, Morocco) + a survey crew at work:
// plan-table team, total station & prism, GNSS rover, drone pilot, LiDAR drones painting a
// point cloud, a mobile-mapping 4×4, villages, trees, birds, clouds.
// World units are metres; +x = east, −z = north (the viewer looks north across the valley).
import * as THREE from "three";
import { GLTFLoader } from "./vendor/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "./vendor/jsm/utils/SkeletonUtils.js";
import { mergeGeometries } from "./vendor/jsm/utils/BufferGeometryUtils.js";

const SUN_DIR = new THREE.Vector3(-0.38, 0.78, 0.5).normalize(); // high sun behind-left of the viewer
const HORIZON = new THREE.Color(0xd6e7f2), ZENITH = new THREE.Color(0x3b82cb);
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

/* ------------------------------- world ------------------------------- */
export function createWorld({ scene, renderer, camera }) {
  const updaters = [];
  const api = { heightAt: () => 0, ready: null, update(dt, t) { for (const u of updaters) u(dt, t); } };
  setupSkyAndLight(scene, renderer, camera, updaters);
  api.ready = (async () => {
    const T = await buildTerrain(scene);
    api.heightAt = T.heightAt;
    buildVegetation(scene, T);
    buildVillages(scene, T);
    buildRoadAndCar(scene, T, updaters);
    buildDrones(scene, T, updaters);
    buildBirds(scene, updaters);
    buildClouds(scene, updaters);
    const camp = buildCamp(scene, T, updaters);
    await buildCrew(scene, T, camp, renderer, camera, updaters);
    return T;
  })().catch((e) => { console.error("[world]", e); });
  return api;
}

/* ----------------------------- sky & light ----------------------------- */
function setupSkyAndLight(scene, renderer, camera, updaters) {
  scene.background = HORIZON.clone();
  scene.fog = new THREE.FogExp2(HORIZON.clone(), 0.00012); // aerial perspective over ~10 km
  const sky = new THREE.Mesh(new THREE.SphereGeometry(24000, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uH: { value: HORIZON }, uZ: { value: ZENITH }, uS: { value: SUN_DIR } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uH; uniform vec3 uZ; uniform vec3 uS; varying vec3 vDir;
      void main(){ vec3 d = normalize(vDir); float h = max(d.y, 0.0);
        vec3 c = mix(uH, uZ, pow(h, 0.5));
        float s = max(dot(d, uS), 0.0);
        c += vec3(1.0, 0.93, 0.8) * (pow(s, 1400.0) * 8.0 + pow(s, 24.0) * 0.18);
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
  updaters.push(() => sky.position.copy(camera.position));

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
  sun.target.position.set(0, 0, -12);
  sun.position.copy(sun.target.position).addScaledVector(SUN_DIR, 150);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 10, far: 320 });
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun, sun.target, new THREE.HemisphereLight(0xcfe3f5, 0x8a6f4f, 1.15));
}

/* ------------------------------- terrain ------------------------------- */
async function buildTerrain(scene) {
  const [meta, buf] = await Promise.all([
    fetch("./terrain/dem.json").then((r) => r.json()),
    fetch("./terrain/dem.bin").then((r) => r.arrayBuffer()),
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
    if (r < 3.4) h -= 0.25 * (1 - r / 3.4); // tuck the ground under the lookout deck
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
    const field = clamp01((1880 - e) / 25) * clamp01((0.17 - slope) / 0.05);
    if (field > 0) c = mix(c, FIELD, field);
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
  const detail = groundDetailTexture();
  const lin = (hex) => new THREE.Color(hex);
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, {
      uH0: { value: H0 }, uF0: { value: lin(0x4a7a2c) }, uF1: { value: lin(0x6b8c34) }, uF2: { value: lin(0x92a04a) }, uF3: { value: lin(0xb59b62) },
      uHedge: { value: lin(0x2f4a1e) }, uMajor: { value: lin(TEAL) }, uDetail: { value: detail },
    });
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", `#include <common>
      varying vec3 vWPos; uniform float uH0; uniform vec3 uF0, uF1, uF2, uF3, uHedge, uMajor; uniform sampler2D uDetail;
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
function instanced(scene, geo, spots, T, R, { sMin, sMax, tint, sink = 0, cast = false, stretch = 0, light = [0.42, 0.16] }) {
  const im = new THREE.InstancedMesh(geo, lambert({ vertexColors: true }), spots.length);
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
  instanced(scene, juniper, juniperSpots, T, R, { sMin: 0.7, sMax: 1.6, tint: [0.27, 0.05], cast: false, stretch: 0.3 });
  const isFloor = (x, z) => T.elevAt(x, z) < 1872 && T.slopeAt(x, z) < 0.14;
  const walnutSpots = scatter(900, 24000, 350, 5600, (x, z) => z < -150 && isFloor(x, z) && vnoise(x * 0.0035 + 3, z * 0.0035) > 0.44, R);
  instanced(scene, walnut, walnutSpots, T, R, { sMin: 0.8, sMax: 1.3, tint: [0.28, 0.06] });
  const poplarSpots = scatter(420, 24000, 350, 5600, (x, z) => z < -150 && isFloor(x, z) && vnoise(x * 0.0042 - 9, z * 0.0042 + 4) > 0.55, R);
  instanced(scene, poplar, poplarSpots, T, R, { sMin: 0.85, sMax: 1.25, tint: [0.23, 0.05] });
  // rocks around the camp
  const rock = solid(new THREE.DodecahedronGeometry(1, 0), 0xffffff);
  // keep the camp, the crew's route and the 4×4 track clear of clutter
  const CLEAR = [[...polar(-36, 7.5), 2.8], [...polar(32, 9), 2.4], [...polar(50, 5.5), 1.8], [...polar(14, 24), 2.2],
    [...polar(-30, 15), 1.8], [...polar(-12, 21), 1.8], [...polar(8, 18), 1.8], [...polar(24, 23), 1.8], [...polar(-47, 11), 1.2]];
  const clear = (x, z) => {
    const r = Math.hypot(x, z), az = Math.atan2(x, -z) / DEG;
    if (r < 3.8 || (r > 29 && r < 37.5 && az > -58 && az < 56)) return false;
    return CLEAR.every(([cx, cz, rr]) => Math.hypot(x - cx, z - cz) > rr);
  };
  const rockSpots = scatter(130, 8000, 4, 220, (x, z) => clear(x, z) && T.slopeAt(x, z) < 0.9, R, 1.6);
  const rocks = instanced(scene, rock, rockSpots, T, R, { sMin: 0.12, sMax: 0.62, tint: [0.08, 0.03], sink: 0.4, cast: true, stretch: -0.8, light: [0.3, 0.12] });
  const bush = solid(new THREE.IcosahedronGeometry(1, 0).scale(1, 0.55, 1), 0xffffff);
  const bushSpots = scatter(320, 12000, 5, 320, (x, z) => clear(x, z) && vnoise(x * 0.05 + 3, z * 0.05) > 0.4, R, 1.5);
  instanced(scene, bush, bushSpots, T, R, { sMin: 0.3, sMax: 0.72, tint: [0.19, 0.05], sink: 0.08, cast: true, light: [0.16, 0.08] }).receiveShadow = true;
  // dry-grass tufts close to the camp
  const tuft = mergeGeometries([0, 1, 2, 3].map((i) => solid(new THREE.ConeGeometry(0.05, 0.42, 3).translate(Math.cos(i * 1.6) * 0.08, 0.2, Math.sin(i * 1.6) * 0.08).rotateZ((i - 1.5) * 0.18), 0xffffff)));
  const tuftSpots = scatter(520, 12000, 3.8, 60, (x, z) => clear(x, z), R, 1.5);
  instanced(scene, tuft, tuftSpots, T, R, { sMin: 0.45, sMax: 0.95, tint: [0.12, 0.04], light: [0.36, 0.12] });
  rocks.receiveShadow = true;
}

/* ------------------------------- villages ------------------------------- */
function buildVillages(scene, T) {
  const R = rng(5), centres = [];
  for (let k = 0; k < 6000 && centres.length < 7; k++) {
    const [x, z] = polar(R() * 150 - 75, 700 + R() * 3800);
    const e = T.elevAt(x, z), s = T.slopeAt(x, z);
    if (e > 1845 && e < 1940 && s > 0.03 && s < 0.22 && centres.every((c) => Math.hypot(c[0] - x, c[1] - z) > 700)) centres.push([x, z]);
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

/* ---------------------------- road & 4×4 ---------------------------- */
function buildRoadAndCar(scene, T, updaters) {
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

  const car = makeCar(); car.group.name = "etafat-4x4"; scene.add(car.group);
  const tmp = new THREE.Vector3(), look = new THREE.Vector3();
  const V = 3.2, PAUSE = 9, cycle = 2 * (L / V + PAUSE); // drive, pause (scanner idle), drive back, pause
  updaters.push((dt, t) => {
    const c = t % cycle, leg = L / V + PAUSE, back = c >= leg, k = back ? c - leg : c, moving = k < L / V;
    const fwd = !back, u0 = moving ? k * V / L : 1, u = fwd ? u0 : 1 - u0;
    const p = curve.getPointAt(u), tg = curve.getTangentAt(u); if (!fwd) tg.negate();
    car.group.position.set(p.x, T.heightAt(p.x, p.z) + 0.45, p.z);
    tmp.copy(p).addScaledVector(tg, 3); look.set(tmp.x, T.heightAt(tmp.x, tmp.z) + 0.45, tmp.z);
    car.group.lookAt(look);
    car.scanner.rotation.y += dt * (moving ? 12 : 1.5);
    car.beacon.material.color.setHSL(0.08, 1, 0.45 + 0.25 * Math.sin(t * 9));
  });
}
function makeCar() {
  const group = new THREE.Group(), body = new THREE.Group(); group.add(body);
  const white = lambert({ color: 0xf2f2f0 }), dark = lambert({ color: 0x1d242c }), teal = lambert({ color: TEAL });
  const box = (w, h, d, m, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; body.add(b); return b; };
  box(1.9, 1.0, 4.5, white, 0, 0.75, 0);        // body (forward = +z)
  box(1.82, 0.8, 2.5, white, 0, 1.6, -0.35);    // cabin
  box(1.84, 0.42, 2.3, dark, 0, 1.68, -0.3);    // windows
  box(1.92, 0.12, 4.3, teal, 0, 0.72, 0);       // ETAFAT stripe
  box(1.5, 0.08, 1.6, dark, 0, 2.05, -0.6);     // roof rack
  const scanner = new THREE.Group(); scanner.position.set(0, 2.35, -1.1); body.add(scanner);
  scanner.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.45, 12), dark));
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.1), teal); eye.position.set(0, 0.1, 0.2); scanner.add(eye);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 6, 16), teal); ring.rotation.x = Math.PI / 2; ring.position.set(0, 2.45, -1.1); body.add(ring);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff8a1f })); beacon.position.set(0.5, 2.15, -0.1); body.add(beacon);
  for (const [x, z] of [[-0.95, 1.45], [0.95, 1.45], [-0.95, -1.45], [0.95, -1.45]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 12), dark); w.rotation.z = Math.PI / 2; w.position.set(x, 0, z); w.castShadow = true; body.add(w);
  }
  bake(body, { keep: [scanner, beacon] }); bake(scanner);
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

function buildClouds(scene, updaters) {
  const c = document.createElement("canvas"); c.width = 256; c.height = 128; const x = c.getContext("2d");
  const R = rng(3);
  for (let i = 0; i < 22; i++) {
    const cx = 40 + R() * 176, cy = 50 + R() * 40, r = 18 + R() * 30;
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, "rgba(255,255,255,0.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
  }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const clouds = [];
  for (let i = 0; i < 9; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.9 }));
    const w = 1400 + R() * 1600; s.scale.set(w, w * 0.42, 1);
    s.position.set(-7000 + R() * 14000, 1300 + R() * 1100, -2500 - R() * 7500);
    scene.add(s); clouds.push(s);
  }
  updaters.push((dt) => { for (const s of clouds) { s.position.x += dt * 4; if (s.position.x > 8000) s.position.x = -8000; } });
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
function buildCamp(scene, T, updaters) {
  const camp = {};
  const wood = lambert({ color: 0x8a6a4a }), metal = lambert({ color: 0x9aa2aa }), dark = lambert({ color: 0x23282e }), yellow = lambert({ color: 0xf2c230 }), orange = lambert({ color: 0xe8752a });
  const put = (o, x, z, y = 0) => { o.position.set(x, T.heightAt(x, z) + y, z); o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(o); return o; };

  // wooden lookout deck under the viewer (flat VR floor at y = 0; the slope falls away around it)
  const deck = new THREE.Group(), boards = lambert({ color: 0x9b7650 }), HALF = 2.2;
  for (let i = 0; i < 11; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(HALF * 2, 0.06, 0.38), boards); b.position.set(0, -0.03, -HALF + 0.2 + i * 0.4); deck.add(b); }
  for (const [x, z] of [[-HALF, -HALF], [HALF, -HALF], [-HALF, HALF], [HALF, HALF]]) {
    const depth = Math.max(0.3, -T.heightAt(x, z) + 0.2); // posts reach the ground below
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, depth, 0.14), wood); p.position.set(x, -depth / 2, z); deck.add(p);
  }
  // slim steel-cable railing (frames the view without hiding the camp or the valley); open to the uphill south
  const steel = lambert({ color: 0x4a5058 });
  for (const side of ["n", "e", "w"]) {
    for (const k of [-1, 1]) {
      const s = k * HALF, [x, z] = side === "n" ? [s, -HALF] : [side === "e" ? HALF : -HALF, s];
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6), steel); post.position.set(x, 0.5, z); deck.add(post);
    }
    for (const y of [0.55, 1.0]) {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, HALF * 2, 4), steel);
      if (side === "n") { cable.rotation.z = Math.PI / 2; cable.position.set(0, y, -HALF); }
      else { cable.rotation.x = Math.PI / 2; cable.position.set(side === "e" ? HALF : -HALF, y, 0); }
      deck.add(cable);
    }
  }
  deck.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  scene.add(bake(deck));

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

/* ---------------------------------- crew ---------------------------------- */
async function buildCrew(scene, T, camp, renderer, camera, updaters) {
  const loader = new GLTFLoader();
  const [W, F] = await Promise.all([loader.loadAsync("./models/worker.glb"), loader.loadAsync("./models/woman.glb")]);
  const tmpV = new THREE.Vector3();

  // Each Quaternius rig has 9–13 skinned parts (one per material) sharing one skeleton and bind pose:
  // merge them into a single SkinnedMesh with the material colours baked per vertex (1 draw call).
  const crewMat = new THREE.MeshLambertMaterial({ vertexColors: true }), KEEP = ["position", "normal", "skinIndex", "skinWeight"];
  function mergeRig(obj, recolor) {
    const parts = []; obj.traverse((o) => { if (o.isSkinnedMesh) parts.push(o); });
    const ref = parts[0], col = new THREE.Color();
    const merged = mergeGeometries(parts.map((m) => {
      const g = m.geometry.clone(); for (const k of Object.keys(g.attributes)) if (!KEEP.includes(k)) g.deleteAttribute(k);
      const name = m.material.name; col.copy(recolor?.[name] != null ? new THREE.Color(recolor[name]) : m.material.color).multiplyScalar(0.72); // ≈ the source's 0.4 metalness
      const n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) col.toArray(a, i * 3);
      g.setAttribute("color", new THREE.BufferAttribute(a, 3)); return g;
    }));
    if (!merged) { parts.forEach((m) => { m.castShadow = true; m.frustumCulled = false; }); return; } // fallback: unmerged
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
    const c = { obj, mixer, actions, current: null, foot, t: 0, state: 0 };
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
  const u = spawn(W, { x: ux, z: uz, face: faceTo(ux, uz, st.prism.x, st.prism.z), recolor: { Worker_Yellow: 0xf4f4f4 } });
  crew.push({ c: u, tick(dt) { u.t += dt; if (u.t > 8) u.t = 0; u.play(u.t < 2.6 ? "Interact" : "Idle_Neutral"); } });
  const [hx, hz] = [st.prism.x + 0.45, st.prism.z + 0.2];
  const h = spawn(W, { x: hx, z: hz, face: faceTo(hx, hz, st.x, st.z), recolor: { Worker_Vest: 0xd6ff3a } });
  h.play("Idle_Neutral");
  const pole = camp.prismPole; pole.position.set(st.prism.x, T.heightAt(st.prism.x, st.prism.z), st.prism.z); pole.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(pole);
  crew.push({ c: h, tick() {} });

  // GNSS rover: walks the stakes, measures at each
  const route = camp.route;
  const g = spawn(W, { x: route[0][0], z: route[0][1], face: 0, recolor: { Worker_Vest: 0xff9f1c } });
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

  const fwd = new THREE.Vector3(), to = new THREE.Vector3(), eye = new THREE.Vector3();
  function looking(pos, deg) {
    const cam = renderer.xr.isPresenting ? renderer.xr.getCamera() : camera;
    cam.getWorldDirection(fwd); cam.getWorldPosition(eye);
    to.set(pos.x, pos.y + 1.4, pos.z).sub(eye).normalize();
    return fwd.dot(to) > Math.cos(deg * DEG);
  }
  updaters.push((dt, t) => { for (const m of crew) { m.c.mixer.update(dt); m.tick(dt, t); } });
}
