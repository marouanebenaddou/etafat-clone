// ETAFAT VR — the Cité portugaise de Mazagan (El Jadida) as a room of the presentation.
// The drone photogrammetry maquette (Cesium 3D Tiles 1.1: implicit octree, Draco meshes, KTX2 textures) is
// streamed by 3d-tiles-renderer onto a round table-top window, with the standalone viewer's layers: landmark
// pins (OpenStreetMap positions), glowing ramparts, LiDAR sweep, altimetry, survey drone, guided tour and the
// 90 placed 360° photos. Ported from the standalone Cité app (cite-vr/www/app.js); here it shares the
// presentation's renderer, controllers, hands and sound. Entering moves the visitor's rig into this scene (the
// valley stops rendering altogether), leaving puts it back exactly where it was.
// The model is bundled in the Quest app only: the website build reports `available` = false.
import * as THREE from "three";

const DEG = Math.PI / 180;
const TEAL = "#2ab5b4", TEAL_L = "#8ee6e4";
const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const CAT = {
  patrimoine: { label: "Patrimoine", color: "#f5b942" },
  religieux: { label: "Lieu de culte", color: "#b99bff" },
  bastion: { label: "Bastion", color: "#ff8a5c" },
  porte: { label: "Porte", color: "#5fd4ff" },
};
const DISC_R = 0.6;                                  // radius of the table-top window (m)
const TABLE_POS = new THREE.Vector3(0, 0.9, -0.95);  // in front of the visitor (local-floor: metres above the floor)
const FIT_R = 255;                                   // metres of city visible in the window at zoom 1
const ZOOM_MIN = 0.6, ZOOM_MAX = 8;
const BASE_Y = 48;                                   // ellipsoidal height laid on the plinth (≈ sea level here)
const YAW0 = 0;
const DESK_CAM = new THREE.Vector3(0, 1.72, 0.62);   // desktop: far enough back to see the side panels
const HINT_MODEL = "Glissez pour tourner autour · molette : zoom · flèches : tourner la maquette · cliquez un point d’intérêt · Échap : retour à la présentation";
const HINT_PANO = "Glissez pour regarder autour · molette : zoom · ← → : photo précédente / suivante · flèches au sol : avancer · Échap : retour à la maquette";
const UP = new THREE.Vector3(0, 1, 0);

function rr(x, X, Y, W, H, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); }
function wrapLines(x, text, maxW) { const out = []; let line = ""; for (const w of String(text).split(" ")) { const t = line ? line + " " + w : w; if (x.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
function spaced(x, s) { if ("letterSpacing" in x) x.letterSpacing = s; }
function rgba(hex, a) { const c = new THREE.Color(hex); return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`; }
function panelBg(x, W, H, accent = TEAL) {
  rr(x, 3, 3, W - 6, H - 6, 34);
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(10,32,52,0.94)"); g.addColorStop(1, "rgba(6,18,30,0.94)");
  x.fillStyle = g; x.fill(); x.lineWidth = 3; x.strokeStyle = rgba(accent, 0.6); x.stroke();
}

export function createCite({ renderer, camera, user, home, fx, controllers, xr, base = "./cite/", hintEl = null, onEnter, onExit, onAudio }) {
  const scene = new THREE.Scene(), BG = new THREE.Color(0x081726); scene.background = BG;
  const api = {
    scene, active: false,
    available: fetch(base + "model/tileset.json", { method: "HEAD", cache: "no-store" }).then((r) => r.ok).catch(() => false),
    prepare, enter, exit,
    update(dt) { if (impl && api.active) impl.update(dt); },
    setAR(on) { arMode = on; if (impl) impl.applyAR(); }, // passthrough: the maquette stands in the visitor's room
    redraw() { if (impl) impl.redrawMenu(); },
  };
  let arMode = false;
  let built = null, impl = null, entering = false, leaving = false;
  function prepare() { if (!built) built = build().then((i) => (impl = i)); return built; }

  // fade to black, build (first time) + move in, music crossfades to the Cité track, fade back in
  async function enter() {
    if (api.active || entering) return false;
    if (!(await api.available)) return false;
    entering = true;
    if (onEnter) onEnter();
    fx.sfx("whoosh", 0.55);
    const ready = prepare();
    fx.blackout(() => {
      fx.hold();
      ready.then(() => { impl.switchIn(); fx.setTrack("music"); fx.reveal(0.9); })
        .catch((e) => { console.warn("Cité portugaise", e); fx.reveal(2); })
        .finally(() => { entering = false; });
    }, 4);
    return true;
  }
  function exit() {
    if (!api.active || leaving) return;
    leaving = true; fx.sfx("whoosh", 0.45);
    fx.blackout(() => { impl.switchOut(); fx.setTrack("ambient"); leaving = false; fx.reveal(1.2); if (onExit) onExit(); }, 5);
  }

  async function build() {
    const [{ TilesRenderer, ImplicitTilingPlugin, GLTFExtensionsPlugin, TilesFadePlugin, Scheduler }, { DRACOLoader }, { KTX2Loader }, { OrbitControls }, DATA, PANO] = await Promise.all([
      import("./vendor/3d-tiles-renderer.js"),
      import("./vendor/jsm/loaders/DRACOLoader.js"),
      import("./vendor/jsm/loaders/KTX2Loader.js"),
      import("./vendor/jsm/controls/OrbitControls.js"),
      fetch(base + "pois.json").then((r) => r.json()),
      fetch(base + "panos.json").then((r) => r.json()).catch(() => ({ panos: [] })),
    ]);

    // ── room: dark gradient dome + a faint grid floor glowing under the table ──────────────────────────
    const env = new THREE.Group(); scene.add(env);
    env.add(new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vP;
        void main(){ float h = normalize(vP).y;
          vec3 top = vec3(0.012, 0.035, 0.07), hor = vec3(0.05, 0.14, 0.21), bot = vec3(0.01, 0.025, 0.045);
          vec3 c = h > 0.0 ? mix(hor, top, pow(h, 0.55)) : mix(hor, bot, pow(-h, 0.35));
          gl_FragColor = vec4(c, 1.0); }`,
    })));
    const floorU = { uC: { value: new THREE.Vector2(TABLE_POS.x, TABLE_POS.z) } };
    env.add(new THREE.Mesh(new THREE.PlaneGeometry(16, 16).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: floorU,
      vertexShader: `varying vec2 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `varying vec2 vW; uniform vec2 uC;
        void main(){ vec2 g = abs(fract(vW / 0.5 + 0.5) - 0.5) / fwidth(vW / 0.5);
          float line = 1.0 - min(min(g.x, g.y), 1.0);
          float d = length(vW - uC);
          gl_FragColor = vec4(0.16, 0.71, 0.71, line * 0.2 * exp(-d * 0.35) + exp(-d * d * 2.5) * 0.14); }`,
    })));

    // table (moved with the grip) → stand (turns with the view) → map (metres → table scale)
    const table = new THREE.Group(); table.position.copy(TABLE_POS); scene.add(table);
    const stand = new THREE.Group(); table.add(stand);
    const map = new THREE.Group(); stand.add(map);

    // ── the model ─────────────────────────────────────────────────────────────────────────────────────
    const tiles = new TilesRenderer(base + "model/tileset.json");
    // map frame: metres around the survey origin, y up, x east, −z north (y = ellipsoidal height)
    const ENU = tiles.ellipsoid.getEastNorthUpFrame(DATA.origin.lat * DEG, DATA.origin.lon * DEG, 0, new THREE.Matrix4());
    const M = new THREE.Matrix4().makeRotationX(-Math.PI / 2).multiply(ENU.clone().invert());
    M.decompose(tiles.group.position, tiles.group.quaternion, tiles.group.scale);
    map.add(tiles.group);
    const toMap = (lat, lon, h) => tiles.ellipsoid.getCartographicToPosition(lat * DEG, lon * DEG, h, new THREE.Vector3()).applyMatrix4(M);

    const view = { cx: 0, cz: 0, zoom: 1, yaw: YAW0 }, goal = { ...view };
    let K = DISC_R / FIT_R, WIN = FIT_R; // world metres per map metre · map metres visible in the window

    // only stream what the window shows (the rest would be discarded by the shader anyway)
    const _sph = new THREE.Sphere();
    tiles.registerPlugin(new ImplicitTilingPlugin());
    tiles.registerPlugin(new GLTFExtensionsPlugin({
      dracoLoader: new DRACOLoader().setDecoderPath("./vendor/jsm/libs/draco/gltf/"),
      ktxLoader: new KTX2Loader().setTranscoderPath("./vendor/jsm/libs/basis/").detectSupport(renderer),
    }));
    tiles.registerPlugin(new TilesFadePlugin());
    tiles.registerPlugin({
      name: "CITE_WINDOW",
      calculateTileViewError(tile, target) {
        const bv = tile.engineData && tile.engineData.boundingVolume; if (!bv) return false;
        bv.getSphere(_sph); _sph.center.applyMatrix4(M);
        if (Math.hypot(_sph.center.x - view.cx, _sph.center.z - view.cz) - _sph.radius <= WIN * 1.02) return false; // no opinion
        target.inView = false; return true;
      },
    });
    tiles.registerPlugin({ // a dropped connection must not leave a hole in the city: retry a few times
      name: "CITE_RETRY_FETCH",
      async fetchData(url, options) {
        for (let k = 0; ; k++) {
          try { const r = await fetch(url, options); if (r.ok || r.status === 404 || k >= 3) return r; }
          catch (e) { if (k >= 3 || (options && options.signal && options.signal.aborted)) throw e; }
          await new Promise((res) => setTimeout(res, 250 * (k + 1)));
        }
      },
    });
    tiles.downloadQueue.maxJobsPerOrigin = 10; // gentle on the on-device server
    tiles.errorTarget = 10;
    tiles.setCamera(camera);
    tiles.setResolutionFromRenderer(camera, renderer);

    // shader overlays drawn on the photogrammetry itself: window cut, scan sweep, contours, selection, drone footprint
    const U = {
      uMapInv: { value: new THREE.Matrix4() },
      uWin: { value: new THREE.Vector3(0, 0, FIT_R) },
      uTime: { value: 0 },
      uScan: { value: 1 }, uContour: { value: 0 }, uBase: { value: BASE_Y },
      uSel: { value: new THREE.Vector4() }, uSelCol: { value: new THREE.Color(TEAL) },
      uDrone: { value: new THREE.Vector4() },
    };
    const TILE_FRAG_HEAD = /* glsl */`
uniform vec3 uWin; uniform float uTime, uScan, uContour, uBase; uniform vec4 uSel, uDrone; uniform vec3 uSelCol;
varying vec3 vMapP;`;
    const TILE_FRAG_BODY = /* glsl */`
{
  float dWin = length(vMapP.xz - uWin.xy);
  if (dWin > uWin.z) discard;
  vec3 teal = vec3(0.165, 0.71, 0.706);
  float px = fwidth(dWin);
  outgoingLight = mix(outgoingLight, teal * 1.25, smoothstep(uWin.z - px * 5.0, uWin.z, dWin) * 0.9); // glowing cut edge
  if (uContour > 0.0) {                       // altimétrie: hypsometric ramp (0–30 m above the sea) + 2 m / 10 m contours
    float h = vMapP.y, fw = max(fwidth(h), 0.03);
    float t = clamp((h - uBase) / 30.0, 0.0, 1.0);
    vec3 ramp = t < 0.25 ? mix(vec3(0.11, 0.31, 0.85), vec3(0.12, 0.71, 0.79), t / 0.25)
              : t < 0.5 ? mix(vec3(0.12, 0.71, 0.79), vec3(0.25, 0.81, 0.42), (t - 0.25) / 0.25)
              : t < 0.75 ? mix(vec3(0.25, 0.81, 0.42), vec3(0.95, 0.82, 0.29), (t - 0.5) / 0.25)
              : mix(vec3(0.95, 0.82, 0.29), vec3(0.94, 0.39, 0.24), (t - 0.75) / 0.25);
    float l1 = 1.0 - smoothstep(fw * 0.5, fw * 1.5, abs(fract(h / 2.0 + 0.5) - 0.5) * 2.0);
    float l5 = 1.0 - smoothstep(fw * 0.8, fw * 2.2, abs(fract(h / 10.0 + 0.5) - 0.5) * 10.0);
    outgoingLight = mix(outgoingLight, outgoingLight * 0.45 + ramp * 0.6, uContour * 0.85);
    outgoingLight = mix(outgoingLight, vec3(1.0), uContour * l1 * 0.35);
    outgoingLight = mix(outgoingLight, vec3(0.03, 0.09, 0.15), uContour * l5 * 0.85);
  }
  if (uScan > 0.0) {                          // LiDAR sweep: a ring expanding from the centre, leaving a grid
    float ph = fract(uTime / 7.0);
    float band = dWin - ph * uWin.z * 1.25;
    float ring = exp(-pow(band / (uWin.z * 0.014), 2.0));
    float trail = band < 0.0 ? exp(band / (uWin.z * 0.16)) : 0.0;
    float g = uWin.z / 14.0;
    vec2 gg = abs(fract(vMapP.xz / g + 0.5) - 0.5) * g;
    float gw = fwidth(vMapP.x) * 1.2;
    float grid = 1.0 - smoothstep(gw * 0.5, gw * 1.5, min(gg.x, gg.y));
    outgoingLight += teal * uScan * (1.0 - smoothstep(0.8, 1.0, ph)) * (ring * 0.55 + grid * trail * 0.35 + trail * 0.03);
  }
  if (uSel.w > 0.0) {                         // selected landmark: pulsing ring, the rest slightly dimmed
    float ds = length(vMapP.xz - uSel.xy);
    float edge = exp(-pow((ds - uSel.z) / max(uSel.z * 0.07, px * 1.5), 2.0));
    float inside = 1.0 - smoothstep(uSel.z * 0.95, uSel.z * 1.05, ds);
    outgoingLight *= mix(1.0, 0.7 + 0.3 * inside, uSel.w);
    outgoingLight += uSelCol * uSel.w * (edge * (0.65 + 0.35 * sin(uTime * 4.0)) + inside * 0.05);
  }
  if (uDrone.w > 0.0) {                       // what the survey drone is capturing
    float dd = length(vMapP.xz - uDrone.xy);
    float foot = 1.0 - smoothstep(uDrone.z * 0.96, uDrone.z, dd);
    float lines = step(0.82, fract(dot(vMapP.xz, vec2(0.7071)) / (uDrone.z * 0.25) - uTime * 1.5));
    outgoingLight += teal * uDrone.w * (foot * (0.07 + lines * 0.16) + exp(-pow((dd - uDrone.z) / (uDrone.z * 0.04), 2.0)) * 0.7);
  }
}
`;
    function patchTileMaterial(m) {
      if (m.userData.cite) return; m.userData.cite = true;
      const prev = m.onBeforeCompile; // the fade plugin's wrapper
      m.onBeforeCompile = (s, r) => {
        if (prev) prev.call(m, s, r);
        Object.assign(s.uniforms, U);
        s.vertexShader = s.vertexShader
          .replace("#include <common>", "#include <common>\nuniform mat4 uMapInv; varying vec3 vMapP;")
          .replace("#include <project_vertex>", "#include <project_vertex>\nvMapP = (uMapInv * modelMatrix * vec4(transformed, 1.0)).xyz;");
        s.fragmentShader = s.fragmentShader
          .replace("#include <common>", "#include <common>\n" + TILE_FRAG_HEAD)
          .replace("#include <opaque_fragment>", TILE_FRAG_BODY + "\n#include <opaque_fragment>");
      };
      m.customProgramCacheKey = () => "cite-tile-1";
      m.needsUpdate = true;
    }
    const ANISO = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    let modelsLoaded = 0;
    tiles.addEventListener("load-model", ({ scene: s }) => {
      modelsLoaded++;
      s.traverse((o) => {
        if (!o.material) return;
        if (o.material.map) o.material.map.anisotropy = ANISO;
        patchTileMaterial(o.material);
      });
    });
    tiles.addEventListener("load-error", (e) => console.warn("tile load error", e.url || "", e.error || e));

    // ── landmarks and ramparts in map coordinates ───────────────────────────────────────────────────
    const wallsLL = DATA.walls.slice(0, DATA.walls.length - (String(DATA.walls[0]) === String(DATA.walls.at(-1)) ? 1 : 0));
    const wallPts = wallsLL.map(([la, lo], j) => toMap(la, lo, DATA.wallH?.[j] ?? BASE_Y + 14));
    const CX = wallPts.reduce((a, p) => a + p.x, 0) / wallPts.length, CZ = wallPts.reduce((a, p) => a + p.z, 0) / wallPts.length;
    view.cx = goal.cx = CX; view.cz = goal.cz = CZ;
    const pois = DATA.pois.map((p, i) => ({ ...p, i, m: toMap(p.lat, p.lon, p.h ?? BASE_Y + 12), hasH: p.h != null }));

    function applyView(dt) {
      const a = dt == null ? 1 : 1 - Math.exp(-dt * 4.5);
      view.cx += (goal.cx - view.cx) * a; view.cz += (goal.cz - view.cz) * a;
      view.zoom += (goal.zoom - view.zoom) * a; view.yaw += (goal.yaw - view.yaw) * a;
      K = (DISC_R / FIT_R) * view.zoom; WIN = FIT_R / view.zoom;
      map.scale.setScalar(K);
      map.position.set(-view.cx * K, -BASE_Y * K, -view.cz * K);
      stand.rotation.y = view.yaw;
    }
    function clampCentre() {
      const dx = goal.cx - CX, dz = goal.cz - CZ, d = Math.hypot(dx, dz), max = 420;
      if (d > max) { goal.cx = CX + dx / d * max; goal.cz = CZ + dz / d * max; }
    }
    applyView();

    // ── canvas panels (menu, info card, title, scale) ───────────────────────────────────────────────
    const panels = [];
    class Panel {
      constructor(w, h, widthM, draw, { interactive = true } = {}) {
        this.w = w; this.h = h; this.draw = draw; this.regions = []; this.hover = null; this.interactive = interactive;
        this.canvas = document.createElement("canvas"); this.canvas.width = w; this.canvas.height = h;
        this.ctx = this.canvas.getContext("2d");
        this.tex = new THREE.CanvasTexture(this.canvas); this.tex.colorSpace = THREE.SRGBColorSpace; this.tex.anisotropy = 4;
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(widthM, widthM * h / w),
          new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false }));
        this.mesh.renderOrder = 5; this.mesh.userData.panel = this;
        panels.push(this); this.redraw();
      }
      btn(X, Y, W, H, id, fn) { this.regions.push({ X, Y, W, H, id, fn }); return this.hover === id; }
      regionAt(uv) { const px = uv.x * this.w, py = (1 - uv.y) * this.h; return this.regions.find((r) => px >= r.X && px <= r.X + r.W && py >= r.Y && py <= r.Y + r.H) || null; }
      setHover(id) { if (this.hover !== id) { this.hover = id; this.redraw(); } }
      redraw() { const x = this.ctx; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.w, this.h); this.regions = []; this.draw(x, this); this.tex.needsUpdate = true; }
    }

    const layers = { pins: true, panos: true, walls: true, scan: true, contour: false, drone: true };
    const tour = { on: false, t: 0 };
    let hoverPoi = null, hoverPanel = null, hoverKey = null;
    function setSound(k, on) { if (k === "music") fx.setMusic(on); else fx.on.sfx = on; menu.redraw(); if (onAudio) onAudio(); }

    const LAYER_ROWS = [
      ["pins", "Points d’intérêt", "12 lieux de la cité"],
      ["panos", "Photos 360°", `${PANO.panos.length} vues immersives · janvier 2022`],
      ["walls", "Remparts", "Enceinte bastionnée, 1541–1548"],
      ["scan", "Balayage LiDAR", "Onde de relevé sur la maquette"],
      ["contour", "Altimétrie", "Teinte hypsométrique · courbes 2 m"],
      ["drone", "Drone de relevé", "Acquisition photogrammétrique"],
    ];
    const logoImg = new Image(); logoImg.onload = () => menu.redraw(); logoImg.src = "./img/etafat-logo-dark.png";
    const menu = new Panel(560, 1560, 0.25, (x, P) => {
      const W = P.w, H = P.h;
      panelBg(x, W, H);
      if (logoImg.complete && logoImg.naturalWidth) { const h = 120, w = h * logoImg.naturalWidth / logoImg.naturalHeight; x.drawImage(logoImg, (W - w) / 2, 26, w, h); }
      x.fillStyle = "rgba(142,230,228,0.25)"; x.fillRect(40, 168, W - 80, 2);
      x.font = `700 26px ${FONT}`; spaced(x, "5px"); x.fillStyle = TEAL_L; x.fillText("CALQUES", 40, 210); spaced(x, "0px");
      let y = 232;
      for (const [key, label, sub] of LAYER_ROWS) {
        const on = layers[key], hov = P.btn(22, y, W - 44, 88, key, () => { layers[key] = !layers[key]; P.redraw(); });
        if (hov) { rr(x, 22, y, W - 44, 88, 20); x.fillStyle = "rgba(42,181,180,0.16)"; x.fill(); }
        x.fillStyle = "#fff"; x.font = `600 31px ${FONT}`; x.fillText(label, 44, y + 40);
        x.fillStyle = "rgba(234,244,248,0.55)"; x.font = `400 21px ${FONT}`;
        if (key === "contour" && on) { // height ramp legend
          const g = x.createLinearGradient(80, 0, 330, 0);
          [["#1c4fd9", 0], ["#1fb5c9", 0.25], ["#40cf6b", 0.5], ["#f2d14a", 0.75], ["#f0643d", 1]].forEach(([c, t]) => g.addColorStop(t, c));
          rr(x, 80, y + 58, 250, 14, 7); x.fillStyle = g; x.fill();
          x.fillStyle = "rgba(234,244,248,0.7)"; x.fillText("0", 50, y + 73); x.fillText("30 m", 342, y + 73);
        } else x.fillText(sub, 44, y + 70);
        rr(x, W - 122, y + 27, 76, 36, 18); x.fillStyle = on ? TEAL : "rgba(255,255,255,0.16)"; x.fill();
        x.beginPath(); x.arc(on ? W - 64 : W - 104, y + 45, 13, 0, Math.PI * 2); x.fillStyle = "#fff"; x.fill();
        y += 96;
      }
      x.fillStyle = "rgba(142,230,228,0.25)"; x.fillRect(40, y + 8, W - 80, 2); y += 30;
      const bigBtn = (id, label, filled, fn) => {
        const hov = P.btn(40, y, W - 80, 76, id, fn);
        rr(x, 40, y, W - 80, 76, 38);
        if (filled || hov) { x.fillStyle = filled ? TEAL : "rgba(42,181,180,0.22)"; x.fill(); }
        x.lineWidth = 3; x.strokeStyle = TEAL; x.stroke();
        x.fillStyle = "#fff"; x.font = `600 29px ${FONT}`; x.textAlign = "center"; x.fillText(label, W / 2, y + 48); x.textAlign = "left";
        y += 92;
      };
      bigBtn("tour", tour.on ? "■  Arrêter la visite" : "▶  Visite guidée", tour.on, () => (tour.on ? stopTour() : startTour()));
      bigBtn("reset", "⟲  Vue d’ensemble", false, () => resetView());
      // back to the presentation (the valley), then music / sound effects
      x.font = `700 22px ${FONT}`; spaced(x, "4px"); x.fillStyle = TEAL_L; x.fillText("PRÉSENTATION ETAFAT", 40, y + 22); spaced(x, "0px"); y += 40;
      {
        const hov = P.btn(40, y, W - 80, 72, "back", () => exit());
        rr(x, 40, y, W - 80, 72, 36); x.fillStyle = hov ? TEAL : "rgba(42,181,180,0.3)"; x.fill(); x.lineWidth = 3; x.strokeStyle = TEAL; x.stroke();
        x.fillStyle = "#fff"; x.font = `600 27px ${FONT}`; x.textAlign = "center"; x.fillText("‹  Retour à la présentation", W / 2, y + 46); x.textAlign = "left";
      }
      y += 88;
      { // VR ⇄ AR (passthrough), as in the presentation's dock
        const st = xr.state(), cur = st.mode;
        rr(x, 40, y, W - 80, 72, 36); x.lineWidth = 3; x.strokeStyle = TEAL; x.stroke();
        for (const [k, X] of [["vr", 40], ["ar", W / 2]]) {
          const ok = st[k], on = cur === k, hov = ok && !on && P.btn(X, y, W / 2 - 40, 72, "mode-" + k, () => xr.go(k));
          if (on || hov) { x.save(); rr(x, 40, y, W - 80, 72, 36); x.clip(); x.fillStyle = on ? TEAL : "rgba(42,181,180,0.25)"; x.fillRect(X, y, W / 2 - 40, 72); x.restore(); }
          const label = on ? (k === "vr" ? "Réalité virtuelle" : "Passthrough (AR)") : `${cur ? "Passer" : "Entrer"} en ${k.toUpperCase()}`;
          x.fillStyle = ok ? "#fff" : "rgba(234,244,248,0.3)"; x.font = `600 25px ${FONT}`; x.textAlign = "center"; x.fillText(label, X + (W / 2 - 40) / 2, y + 45); x.textAlign = "left";
        }
      }
      y += 88;
      for (const [k, label, X] of [["music", "Musique", 40], ["sfx", "Effets sonores", W / 2 + 8]]) {
        const on = fx.on[k], w = W / 2 - 48, hov = P.btn(X, y, w, 62, "snd-" + k, () => setSound(k, !fx.on[k]));
        rr(x, X, y, w, 62, 31); x.fillStyle = hov ? "rgba(42,181,180,0.25)" : "rgba(255,255,255,0.07)"; x.fill();
        x.beginPath(); x.arc(X + 32, y + 31, 10, 0, Math.PI * 2); x.fillStyle = on ? TEAL_L : "rgba(234,244,248,0.25)"; x.fill();
        x.fillStyle = on ? "#fff" : "rgba(234,244,248,0.5)"; x.font = `600 24px ${FONT}`; x.fillText(label, X + 54, y + 40);
      }
      y += 92;
      x.font = `700 22px ${FONT}`; spaced(x, "4px"); x.fillStyle = TEAL_L; x.fillText("LÉGENDE", 40, y); spaced(x, "0px"); y += 22;
      Object.values(CAT).forEach((c, i) => {
        const X = 40 + (i % 2) * 245, Y = y + Math.floor(i / 2) * 50 + 22;
        x.beginPath(); x.arc(X + 12, Y, 11, 0, Math.PI * 2); x.fillStyle = c.color; x.fill();
        x.fillStyle = "rgba(234,244,248,0.85)"; x.font = `500 24px ${FONT}`; x.fillText(c.label, X + 34, Y + 8);
      });
      x.fillStyle = "rgba(234,244,248,0.45)"; x.font = `400 19px ${FONT}`;
      x.fillText("Gâchette / pincer : choisir · maintenir + glisser : déplacer", 40, H - 90);
      x.fillText("Deux mains sur la maquette : zoomer et tourner", 40, H - 62);
      x.fillText("Joystick : tourner / zoomer · Grip : déplacer la maquette", 40, H - 34);
    });
    menu.mesh.position.set(-(DISC_R + 0.3), 0.38, 0.08); table.add(menu.mesh);

    let sel = -1;
    const card = new Panel(1000, 600, 0.44, (x, P) => {
      const p = pois[sel]; if (!p) return;
      const c = CAT[p.cat], W = P.w, H = P.h;
      panelBg(x, W, H, c.color);
      rr(x, 3, 40, 10, H - 80, 5); x.fillStyle = c.color; x.fill();
      x.font = `700 23px ${FONT}`; spaced(x, "3px");
      const chip = c.label.toUpperCase(), cw = x.measureText(chip).width + 36;
      rr(x, 44, 34, cw, 46, 23); x.fillStyle = rgba(c.color, 0.2); x.fill();
      x.fillStyle = c.color; x.fillText(chip, 62, 66); spaced(x, "0px");
      x.fillStyle = "rgba(234,244,248,0.5)"; x.font = `500 24px ${FONT}`; x.fillText(`${p.i + 1} / ${pois.length}`, 44 + cw + 18, 66);
      const hc = P.btn(W - 96, 24, 70, 70, "close", () => deselect());
      x.beginPath(); x.arc(W - 61, 59, 30, 0, Math.PI * 2); x.fillStyle = hc ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"; x.fill();
      x.strokeStyle = "#fff"; x.lineWidth = 4; x.beginPath(); x.moveTo(W - 72, 48); x.lineTo(W - 50, 70); x.moveTo(W - 50, 48); x.lineTo(W - 72, 70); x.stroke();
      x.fillStyle = "#fff"; x.font = `700 54px ${FONT}`; x.fillText(p.name, 44, 150);
      x.fillStyle = "rgba(234,244,248,0.86)"; x.font = `400 29px ${FONT}`;
      wrapLines(x, p.text, W - 96).slice(0, 7).forEach((l, k) => x.fillText(l, 44, 210 + k * 41));
      const nav = (X, id, label, fn) => {
        const hov = P.btn(X, H - 96, 230, 64, id, fn);
        rr(x, X, H - 96, 230, 64, 32); x.fillStyle = hov ? "rgba(42,181,180,0.3)" : "rgba(255,255,255,0.08)"; x.fill();
        x.fillStyle = "#fff"; x.font = `600 26px ${FONT}`; x.textAlign = "center"; x.fillText(label, X + 115, H - 55); x.textAlign = "left";
      };
      nav(44, "prev", "‹  Précédent", () => { stopTour(); selectPOI((sel + pois.length - 1) % pois.length); });
      nav(W - 274, "next", "Suivant  ›", () => { stopTour(); selectPOI((sel + 1) % pois.length); });
      if (p.pano) nav(W / 2 - 115, "pano", p.panoNear ? "◉  Vue 360°" : "◉  360° proche", () => { stopTour(); openPano(p.pano.i); });
      x.fillStyle = "rgba(234,244,248,0.35)"; x.font = `400 18px ${FONT}`; x.textAlign = "right"; x.fillText("Position © OpenStreetMap", W - 44, 118); x.textAlign = "left";
    });
    card.mesh.position.set(DISC_R + 0.32, 0.36, 0.08); card.mesh.visible = false; table.add(card.mesh);

    let loadPct = 0;
    const title = new Panel(1600, 320, 0.8, (x, P) => {
      const W = P.w;
      x.textAlign = "center"; x.shadowColor = "rgba(0,0,0,0.6)"; x.shadowBlur = 18;
      x.font = `700 30px ${FONT}`; spaced(x, "7px"); x.fillStyle = TEAL_L; x.fillText("ETAFAT · MAQUETTE NUMÉRIQUE 3D PAR DRONE", W / 2, 58); spaced(x, "0px");
      x.font = `700 96px ${FONT}`; x.fillStyle = "#fff"; x.fillText(DATA.title, W / 2, 168);
      x.font = `500 40px ${FONT}`; x.fillStyle = "rgba(234,244,248,0.8)"; x.fillText(DATA.subtitle, W / 2, 232);
      if (loadPct < 100) { x.font = `500 28px ${FONT}`; x.fillStyle = TEAL_L; x.fillText(`Chargement de la maquette… ${loadPct} %`, W / 2, 290); }
      x.textAlign = "left"; x.shadowBlur = 0;
    }, { interactive: false });
    title.mesh.position.set(0, 0.62, -(DISC_R + 0.12)); table.add(title.mesh);

    let scaleKey = "";
    const scaleP = new Panel(1024, 160, 0.3, (x, P) => {
      const pxPerM = P.w / 0.3, denom = Math.round(1 / K / 10) * 10;
      let d = 10; for (const c of [10, 20, 25, 50, 100, 200, 250, 500]) if (c * K * pxPerM <= 420) d = c;
      const L = d * K * pxPerM;
      x.textAlign = "left"; x.font = `700 30px ${FONT}`; spaced(x, "4px"); x.fillStyle = TEAL_L; x.fillText(`ÉCHELLE 1:${denom.toLocaleString("fr-FR")}`, 40, 96); spaced(x, "0px");
      const X0 = P.w - 60 - L;
      x.fillStyle = "#fff"; x.fillRect(X0, 88, L / 2, 14); x.fillStyle = "rgba(255,255,255,0.35)"; x.fillRect(X0 + L / 2, 88, L / 2, 14);
      x.strokeStyle = "#fff"; x.lineWidth = 3; x.strokeRect(X0, 88, L, 14);
      x.font = `600 28px ${FONT}`; x.fillStyle = "#fff"; x.textAlign = "center"; x.fillText("0", X0, 72); x.fillText(`${d} m`, X0 + L, 72); x.textAlign = "left";
    }, { interactive: false });
    scaleP.mesh.rotation.x = -62 * DEG; scaleP.mesh.position.set(0, 0.012, DISC_R + 0.12); table.add(scaleP.mesh);

    // ── plinth + compass ring ───────────────────────────────────────────────────────────────────────
    {
      const top = new THREE.Mesh(new THREE.CircleGeometry(DISC_R, 128).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x0a2233 }));
      top.position.y = -0.0015; stand.add(top);
      const side = new THREE.Mesh(new THREE.CylinderGeometry(DISC_R + 0.006, DISC_R + 0.03, 0.05, 128, 1, true).translate(0, -0.027, 0), new THREE.ShaderMaterial({
        uniforms: { uTime: U.uTime },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec2 vUv; uniform float uTime;
          void main(){ vec3 c = mix(vec3(0.015, 0.05, 0.08), vec3(0.05, 0.18, 0.25), vUv.y);
            c += vec3(0.165, 0.71, 0.706) * (smoothstep(0.88, 1.0, vUv.y) * 0.9 + step(0.965, fract(vUv.y * 5.0 - uTime * 0.35)) * 0.12);
            gl_FragColor = vec4(c, 1.0); }`,
      }));
      stand.add(side);
      stand.add(new THREE.Mesh(new THREE.TorusGeometry(DISC_R + 0.005, 0.0022, 8, 200).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x8ee6e4 })));
      // compass: canvas "up" is north (−z) once the plane lies flat
      const S = 2048, R = DISC_R + 0.085, c = document.createElement("canvas"); c.width = c.height = S;
      const x = c.getContext("2d"), px = S / 2 / R, r0 = (DISC_R + 0.014) * px, r1 = (DISC_R + 0.078) * px;
      x.translate(S / 2, S / 2);
      x.beginPath(); x.arc(0, 0, r1, 0, Math.PI * 2); x.arc(0, 0, r0, 0, Math.PI * 2, true); x.fillStyle = "rgba(8,23,38,0.78)"; x.fill();
      x.strokeStyle = "rgba(142,230,228,0.9)"; x.lineWidth = 3; x.beginPath(); x.arc(0, 0, r1, 0, Math.PI * 2); x.stroke();
      x.strokeStyle = "rgba(142,230,228,0.35)"; x.beginPath(); x.arc(0, 0, r0, 0, Math.PI * 2); x.stroke();
      for (let a = 0; a < 360; a += 2) {
        if (a % 30 === 0) continue; // labels there
        const len = a % 10 === 0 ? 0.26 : 0.13, s = Math.sin(a * DEG), k = -Math.cos(a * DEG);
        x.strokeStyle = a % 10 === 0 ? "rgba(234,244,248,0.85)" : "rgba(234,244,248,0.45)"; x.lineWidth = 2;
        x.beginPath(); x.moveTo(s * r1, k * r1); x.lineTo(s * (r1 - (r1 - r0) * len), k * (r1 - (r1 - r0) * len)); x.stroke();
      }
      x.textAlign = "center"; x.textBaseline = "middle";
      for (const [a, t] of [[0, "N"], [90, "E"], [180, "S"], [270, "O"], [30, "30"], [60, "60"], [120, "120"], [150, "150"], [210, "210"], [240, "240"], [300, "300"], [330, "330"]]) {
        x.save(); x.rotate(a * DEG); x.translate(0, -(r0 + (r1 - r0) * 0.68));
        const card4 = t.length === 1;
        x.font = card4 ? `800 ${Math.round((r1 - r0) * 0.5)}px ${FONT}` : `600 ${Math.round((r1 - r0) * 0.3)}px ${FONT}`;
        x.fillStyle = t === "N" ? TEAL_L : card4 ? "#fff" : "rgba(234,244,248,0.7)"; x.fillText(t, 0, 0); x.restore();
      }
      x.save(); x.translate(0, -r1 - 4); x.beginPath(); x.moveTo(0, -30); x.lineTo(18, 4); x.lineTo(-18, 4); x.closePath(); x.fillStyle = TEAL_L; x.fill(); x.restore();
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const ring = new THREE.Mesh(new THREE.PlaneGeometry(2 * R, 2 * R).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      ring.position.y = -0.0008; stand.add(ring);
    }

    // ── ramparts: flowing light along the wall line + a faint holographic curtain ──────────────────
    const wallsG = new THREE.Group(); map.add(wallsG);
    const wallU = { uWin: U.uWin, uTime: U.uTime, uOn: { value: 1 }, uL: { value: 1 }, uR: { value: 1 }, uH0: { value: BASE_Y } };
    function buildWalls() {
      wallsG.clear();
      const path = new THREE.CurvePath();
      const pts = wallPts.map((p) => new THREE.Vector3(p.x, p.y + 1.5, p.z));
      for (let j = 0; j < pts.length; j++) path.add(new THREE.LineCurve3(pts[j], pts[(j + 1) % pts.length]));
      wallU.uL.value = path.getLength();
      const tube = new THREE.Mesh(new THREE.TubeGeometry(path, Math.min(2000, Math.ceil(wallU.uL.value)), 1, 6, true), new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: wallU,
        vertexShader: `uniform float uR; varying vec3 vP; varying vec2 vUv;
          void main(){ vec3 p = position + normal * (uR - 1.0); vP = p; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
        fragmentShader: `uniform vec3 uWin; uniform float uTime, uOn, uL; varying vec3 vP; varying vec2 vUv;
          void main(){ if (length(vP.xz - uWin.xy) > uWin.z) discard;
            float s = fract(vUv.x * uL / 36.0 - uTime * 0.45);
            float dash = smoothstep(0.0, 0.08, s) * (1.0 - smoothstep(0.3, 0.45, s));
            gl_FragColor = vec4(mix(vec3(0.16, 0.71, 0.71), vec3(0.8, 1.0, 0.98), dash), (0.5 + 0.5 * dash) * uOn); }`,
      }));
      tube.frustumCulled = false; wallsG.add(tube);
      // curtain: a vertical ribbon from the plinth to just above the wall walk
      const pos = [], uv = [], idx = []; let acc = 0;
      for (let j = 0; j <= pts.length; j++) {
        const p = pts[j % pts.length]; if (j) acc += p.distanceTo(pts[j - 1]);
        pos.push(p.x, p.y + 2, p.z, p.x, BASE_Y, p.z); uv.push(acc, 1, acc, 0);
        if (j) { const a = (j - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
      const curtain = new THREE.Mesh(g, new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, uniforms: wallU,
        vertexShader: `varying vec3 vP; varying vec2 vUv; void main(){ vP = position; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 uWin; uniform float uTime, uOn; varying vec3 vP; varying vec2 vUv;
          void main(){ if (length(vP.xz - uWin.xy) > uWin.z) discard;
            float lines = step(0.8, fract(vUv.y * 7.0 - uTime * 0.6));
            gl_FragColor = vec4(0.16, 0.71, 0.71, (pow(vUv.y, 2.2) * 0.2 + lines * vUv.y * 0.08) * uOn); }`,
      }));
      curtain.frustumCulled = false; wallsG.add(curtain);
    }
    buildWalls();

    // ── landmark pins (stand space: constant size whatever the zoom) ────────────────────────────────
    const pinsG = new THREE.Group(); stand.add(pinsG);
    const glowTex = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.25, "rgba(255,255,255,0.5)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
    })();
    function labelMesh(p) {
      const H = 96, pad = 16, c = document.createElement("canvas"), x = c.getContext("2d");
      x.font = `600 44px ${FONT}`; const tw = x.measureText(p.name).width, W = Math.ceil(pad + 64 + 16 + tw + pad + 12);
      c.width = W; c.height = H;
      const col = CAT[p.cat].color;
      rr(x, 2, 2, W - 4, H - 4, 46); x.fillStyle = "rgba(8,23,38,0.84)"; x.fill(); x.lineWidth = 3; x.strokeStyle = rgba(col, 0.9); x.stroke();
      x.beginPath(); x.arc(pad + 32, H / 2, 32, 0, Math.PI * 2); x.fillStyle = col; x.fill();
      x.fillStyle = "#081726"; x.font = `800 34px ${FONT}`; x.textAlign = "center"; x.fillText(String(p.i + 1), pad + 32, H / 2 + 12);
      x.textAlign = "left"; x.fillStyle = "#fff"; x.font = `600 44px ${FONT}`; x.fillText(p.name, pad + 64 + 16, H / 2 + 15);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const h = 0.019, w = h * W / H;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h).translate(0, h / 2, 0), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false }));
      m.renderOrder = 30; return m;
    }
    const TIER = [0.05, 0.08, 0.11];
    for (const p of pois) {
      const col = new THREE.Color(CAT[p.cat].color), H = TIER[p.i % 3];
      const g = new THREE.Group(); pinsG.add(g); p.g = g; p.H = H;
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.0011, 0.0011, H, 6, 1, true).translate(0, H / 2, 0), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.75, depthWrite: false }));
      const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.0062), new THREE.MeshBasicMaterial({ color: col })); head.position.y = H;
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.setScalar(0.03); glow.position.y = H;
      const ringM = new THREE.Mesh(new THREE.RingGeometry(0.0045, 0.006, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      ringM.position.y = 0.0006;
      const label = labelMesh(p); label.position.y = H + 0.011;
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), new THREE.MeshBasicMaterial()); hit.visible = false; hit.position.y = H;
      g.add(beam, head, glow, ringM, label, hit);
      Object.assign(p, { beam, head, glow, ringM, label, hit });
      hit.userData.poi = p; label.userData.poi = p;
    }
    // light column on the selected landmark
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.45, 20, 1, true).translate(0, 0.225, 0), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uTime: U.uTime, uCol: U.uSelCol, uA: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform float uTime, uA; uniform vec3 uCol; varying vec2 vUv;
        void main(){ float a = pow(1.0 - vUv.y, 1.6) * 0.55 + step(0.9, fract(vUv.y * 5.0 - uTime * 0.8)) * (1.0 - vUv.y) * 0.3;
          gl_FragColor = vec4(uCol, a * uA); }`,
    }));
    column.visible = false; pinsG.add(column);

    // leader: dotted line from the info card to the selected pin
    const LEAD_N = 26;
    const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0021, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), LEAD_N);
    beads.frustumCulled = false; beads.visible = false; scene.add(beads);
    const leadCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());

    // ── survey drone circling the window ────────────────────────────────────────────────────────────
    const drone = new THREE.Group(); stand.add(drone);
    const props = [], leds = [];
    {
      const shell = new THREE.MeshBasicMaterial({ color: 0xe8eef3 }), dark = new THREE.MeshBasicMaterial({ color: 0x1b2733 });
      drone.add(new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.006, 0.024), shell));
      const cam = new THREE.Mesh(new THREE.SphereGeometry(0.0034, 12, 8), dark); cam.position.set(0, -0.005, -0.009); drone.add(cam);
      for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.0022, 0.0028), dark);
        arm.position.set(sx * 0.0085, 0, sz * 0.0085); arm.rotation.y = sx * sz > 0 ? -Math.PI / 4 : Math.PI / 4; drone.add(arm);
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.0024, 0.0024, 0.004, 10), dark); motor.position.set(sx * 0.0175, 0.001, sz * 0.0175); drone.add(motor);
        const disc = new THREE.Mesh(new THREE.CircleGeometry(0.0105, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xcfe9f0, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
        disc.position.set(sx * 0.0175, 0.0035, sz * 0.0175); drone.add(disc);
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.021, 0.0004, 0.0022), dark); blade.position.copy(disc.position); drone.add(blade); props.push(blade);
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.0014, 6, 4), new THREE.MeshBasicMaterial({ color: sz < 0 ? 0x5dff8a : 0xff4d4d }));
        led.position.set(sx * 0.0175, -0.002, sz * 0.0175); drone.add(led); leds.push(led);
      }
    }
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 48, 1, true).translate(0, -0.5, 0), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uTime: U.uTime, uA: { value: 1 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform float uTime, uA; varying vec2 vUv;
        void main(){ float a = (1.0 - vUv.y) * 0.14 + step(0.88, fract(vUv.y * 9.0 + uTime * 1.4)) * (1.0 - vUv.y) * 0.14;
          gl_FragColor = vec4(0.3, 0.85, 0.85, a * uA); }`,
    }));
    stand.add(cone);

    // ── selection, tour, view actions ───────────────────────────────────────────────────────────────
    let selA = 0, cardA = 0;
    function selectPOI(i, zoom) {
      sel = i; const p = pois[i];
      card.redraw(); card.mesh.visible = true; cardA = 0;
      U.uSelCol.value.set(CAT[p.cat].color); beads.material.color.set(CAT[p.cat].color);
      U.uSel.value.set(p.m.x, p.m.z, p.cat === "bastion" || p.cat === "porte" ? 20 : 26, U.uSel.value.w);
      goal.cx = p.m.x; goal.cz = p.m.z; goal.zoom = zoom ?? Math.max(goal.zoom, 2.4);
    }
    function deselect() { sel = -1; card.mesh.visible = false; stopTour(); }
    function resetView() { stopTour(); sel = -1; card.mesh.visible = false; Object.assign(goal, { cx: CX, cz: CZ, zoom: 1, yaw: YAW0 + Math.round((goal.yaw - YAW0) / (2 * Math.PI)) * 2 * Math.PI }); }
    function startTour() { tour.on = true; tour.t = 0; selectPOI(sel >= 0 ? (sel + 1) % pois.length : 0, 3); menu.redraw(); }
    function stopTour() { if (!tour.on) return; tour.on = false; menu.redraw(); }

    // ── 360° photos: markers on the model, immersive view with walk-through arrows ──────────────────
    // Insta360 shots of 19 Jan 2022 placed along the route (no GPS on the camera), north from the sun.
    const panos = PANO.panos.map((p, i) => ({ ...p, i, m: toMap(p.lat, p.lon, p.h ?? BASE_Y + 10) }));
    const panoRuns = []; // consecutive shots at one place → one cluster marker when zoomed out
    for (const p of panos) {
      let r = panoRuns.at(-1);
      if (!r || r.place !== p.place) panoRuns.push(r = { place: p.place, items: [], m: new THREE.Vector3() });
      r.items.push(p); p.run = r;
    }
    for (const r of panoRuns) { for (const p of r.items) r.m.add(p.m); r.m.divideScalar(r.items.length); r.m.y = Math.max(...r.items.map((p) => p.m.y)); }
    for (const p of pois) { let best = null, bd = 32; for (const q of panos) { const d = Math.hypot(q.m.x - p.m.x, q.m.z - p.m.z); if (d < bd) { bd = d; best = q; } } p.pano = best; p.panoNear = bd < 15; }

    function badgeTex(count) {
      const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
      x.beginPath(); x.arc(64, 64, 48, 0, Math.PI * 2); x.fillStyle = "rgba(8,23,38,0.9)"; x.fill(); x.lineWidth = 8; x.strokeStyle = TEAL_L; x.stroke();
      x.fillStyle = "#fff"; x.font = `800 32px ${FONT}`; x.textAlign = "center"; x.fillText("360°", 64, 75);
      if (count) { x.beginPath(); x.arc(101, 27, 24, 0, Math.PI * 2); x.fillStyle = TEAL; x.fill(); x.fillStyle = "#fff"; x.font = `800 25px ${FONT}`; x.fillText(String(count), 101, 36); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }
    const panoG = new THREE.Group(); stand.add(panoG);
    const panoHitGeo = new THREE.SphereGeometry(0.009, 8, 6), panoHitMat = new THREE.MeshBasicMaterial();
    function marker(tex, size, data) {
      const g = new THREE.Group(), sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      sp.scale.setScalar(size); sp.renderOrder = 12;
      const hit = new THREE.Mesh(panoHitGeo, panoHitMat); hit.visible = false; hit.scale.setScalar(size / 0.012); Object.assign(hit.userData, data);
      g.add(sp, hit); panoG.add(g); return { g, hit };
    }
    { const one = badgeTex(0); for (const p of panos) Object.assign(p, marker(one, 0.015, { pano: p })); }
    for (const r of panoRuns) Object.assign(r, marker(badgeTex(r.items.length), 0.022, { run: r }));

    // hover preview
    const thumbs = new Map();
    function thumbImg(p) {
      if (!thumbs.has(p.id)) { const im = new Image(); im.onload = () => { if (tipFor) tip.redraw(); if (pm.on) panoBar.redraw(); }; im.src = `${base}panos/thumbs/${p.id}.jpg`; thumbs.set(p.id, im); }
      return thumbs.get(p.id);
    }
    let tipFor = null, hoverPanoItem = null;
    const tip = new Panel(520, 372, 0.17, (x) => {
      if (!tipFor) return;
      const p = tipFor.items ? tipFor.items[0] : tipFor, im = thumbImg(p);
      rr(x, 2, 2, 516, 368, 22); x.fillStyle = "rgba(8,23,38,0.95)"; x.fill(); x.lineWidth = 3; x.strokeStyle = TEAL_L; x.stroke();
      x.save(); rr(x, 12, 12, 496, 248, 14); x.clip();
      if (im.complete && im.naturalWidth) x.drawImage(im, 12, 12, 496, 248); else { x.fillStyle = "#0d2740"; x.fillRect(12, 12, 496, 248); }
      x.restore();
      x.fillStyle = "#fff"; x.font = `700 30px ${FONT}`; x.fillText(p.place, 22, 302);
      x.fillStyle = TEAL_L; x.font = `500 22px ${FONT}`;
      x.fillText(tipFor.items ? `${tipFor.items.length} photos 360° · cliquer pour entrer` : `Photo 360° · ${p.time} · cliquer pour entrer`, 22, 342);
    }, { interactive: false });
    tip.mesh.visible = false; tip.mesh.renderOrder = 35; tip.mesh.material.depthTest = false; scene.add(tip.mesh);

    // immersive view (fades through black with the presentation's fader)
    const pm = { on: false, i: -1, token: 0, play: false, playT: 0, hudYaw: 0, follow: false, saved: null, look: { yaw: 0, pitch: 0 }, barT: 0, barGaze: 0 };
    const panoSphere = new THREE.Mesh(new THREE.SphereGeometry(9, 96, 48).scale(-1, 1, 1), new THREE.MeshBasicMaterial({ depthTest: false, depthWrite: false }));
    panoSphere.renderOrder = -10; panoSphere.frustumCulled = false; panoSphere.visible = false; scene.add(panoSphere);
    const texLoader = new THREE.TextureLoader(), bmpLoader = new THREE.ImageBitmapLoader().setOptions({ imageOrientation: "flipY" });
    const thumbTexes = new Map(), fullTexes = new Map();
    function thumbTex(p) {
      if (!thumbTexes.has(p.id)) { const t = texLoader.load(`${base}panos/thumbs/${p.id}.jpg`); t.colorSpace = THREE.SRGBColorSpace; thumbTexes.set(p.id, t); }
      return thumbTexes.get(p.id);
    }
    function fullTex(p) {
      if (!fullTexes.has(p.id)) fullTexes.set(p.id, new Promise((res, rej) => bmpLoader.load(`${base}panos/${p.id}.jpg`, (bmp) => {
        const t = new THREE.Texture(bmp); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; t.needsUpdate = true; res(t);
      }, undefined, rej)));
      return fullTexes.get(p.id);
    }
    function keepFull(ids) { // at most the current photo and its two neighbours stay on the GPU (4096×2048 each)
      for (const [id, pr] of fullTexes) if (!ids.includes(id)) { fullTexes.delete(id); pr.then((t) => { t.dispose(); if (t.image && t.image.close) t.image.close(); }).catch(() => {}); }
    }
    async function showPanoTex(p) {
      const token = ++pm.token;
      panoSphere.material.map = thumbTex(p); panoSphere.material.needsUpdate = true;
      try {
        const t = await fullTex(p); if (token !== pm.token) return;
        panoSphere.material.map = t; panoSphere.material.needsUpdate = true;
      } catch (e) { console.warn("panorama", p.id, e); }
      const near = [panos[p.i + 1], panos[p.i - 1]].filter(Boolean);
      near.forEach(fullTex); keepFull([p.id, ...near.map((q) => q.id)]);
    }
    const gazeAz = () => { camera.getWorldDirection(_v); return Math.atan2(_v.x, -_v.z); }; // world azimuth, clockwise from −z
    function orientPano(p) {
      // the photo's north goes where the table's north is (world azimuth −yaw); without a sun fix, face the photo's centre
      panoSphere.rotation.y = p.north != null ? (p.north - 0.75) * 2 * Math.PI + view.yaw : -Math.PI / 2 - gazeAz();
    }
    function openPano(i) {
      stopTour(); pm.play = pm.play && pm.on; fx.sfx("whoosh", pm.on ? 0.35 : 0.55);
      fx.blackout(() => {
        const p = panos[i], first = !pm.on;
        pm.on = true; pm.i = i; pm.playT = 0;
        if (first) {
          table.visible = false; env.visible = false; panoSphere.visible = true; panoHud.visible = true; arrowG.visible = true;
          if (hintEl) hintEl.textContent = HINT_PANO;
          camera.getWorldDirection(_v); pm.hudYaw = Math.atan2(-_v.x, -_v.z);
          if (!renderer.xr.isPresenting) {
            pm.saved = { pos: camera.position.clone(), quat: camera.quaternion.clone(), fov: camera.fov };
            controls.enabled = false; pm.look.yaw = pm.hudYaw; pm.look.pitch = 0; camera.fov = 75; camera.updateProjectionMatrix();
          }
        }
        orientPano(p); showPanoTex(p); buildArrows(p); panoBar.redraw();
      }, 5);
    }
    function closePano(instant = false) {
      const done = () => {
        pm.on = false; pm.play = false; pm.token++;
        panoSphere.visible = false; panoHud.visible = false; arrowG.visible = false;
        table.visible = true; env.visible = !arMode; if (hintEl) hintEl.textContent = HINT_MODEL;
        if (pm.saved) { camera.position.copy(pm.saved.pos); camera.quaternion.copy(pm.saved.quat); camera.fov = pm.saved.fov; camera.updateProjectionMatrix(); pm.saved = null; controls.enabled = true; }
        keepFull([]);
      };
      if (instant) done(); else { fx.sfx("whoosh", 0.45); fx.blackout(done, 5); }
    }
    const stepPano = (d) => { if (pm.on) openPano((pm.i + d + panos.length) % panos.length); };

    // control bar (follows the gaze lazily) with a mini-map of the ramparts and the shots
    const panoHud = new THREE.Group(); panoHud.visible = false; scene.add(panoHud);
    const MM = (() => { // mini-map frame: fit the rampart outline in a 228 px square, north up
      const xs = wallPts.map((w) => w.x), zs = wallPts.map((w) => w.z), x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
      const k = 196 / Math.max(x1 - x0, z1 - z0);
      return (x, z) => [16 + 16 + (x - (x0 + x1) / 2) * k + 98, 16 + 16 + (z - (z0 + z1) / 2) * k + 98];
    })();
    const panoBar = new Panel(1280, 260, 0.64, (x, P) => {
      const p = panos[pm.i]; if (!p) return;
      const W = P.w, H = P.h;
      panelBg(x, W, H);
      rr(x, 16, 16, 228, 228, 18); x.fillStyle = "rgba(255,255,255,0.05)"; x.fill();
      x.beginPath(); wallPts.forEach((w, k) => { const [a, b] = MM(w.x, w.z); k ? x.lineTo(a, b) : x.moveTo(a, b); }); x.closePath();
      x.fillStyle = "rgba(42,181,180,0.14)"; x.fill(); x.lineWidth = 2.5; x.strokeStyle = TEAL_L; x.stroke();
      for (const q of panos) { const [a, b] = MM(q.m.x, q.m.z); x.beginPath(); x.arc(a, b, 3, 0, Math.PI * 2); x.fillStyle = q.run === p.run ? TEAL_L : "rgba(234,244,248,0.35)"; x.fill(); }
      const [cx, cy] = MM(p.m.x, p.m.z);
      if (p.north != null) { // what the visitor is facing, on the map
        const b = pm.barGaze + view.yaw;
        x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, 34, b - Math.PI / 2 - 0.45, b - Math.PI / 2 + 0.45); x.closePath();
        const g = x.createRadialGradient(cx, cy, 0, cx, cy, 34); g.addColorStop(0, "rgba(245,185,66,0.8)"); g.addColorStop(1, "rgba(245,185,66,0)"); x.fillStyle = g; x.fill();
      }
      x.beginPath(); x.arc(cx, cy, 8, 0, Math.PI * 2); x.fillStyle = "#f5b942"; x.fill(); x.lineWidth = 3; x.strokeStyle = "#fff"; x.stroke();
      x.fillStyle = TEAL_L; x.font = `700 22px ${FONT}`; spaced(x, "4px"); x.fillText(`PHOTO 360° · 19 JANV. 2022 · ${p.time}`, 272, 62); spaced(x, "0px");
      x.fillStyle = "#fff"; x.font = `700 46px ${FONT}`; x.fillText(p.place, 272, 124);
      x.fillStyle = "rgba(234,244,248,0.55)"; x.font = `500 24px ${FONT}`; x.fillText(`${p.i + 1} / ${panos.length}${p.north == null ? "" : " · orientée au nord"}`, 272, 166);
      x.fillStyle = "rgba(234,244,248,0.4)"; x.font = `400 19px ${FONT}`; x.fillText("Joystick : photo précédente / suivante · B : retour", 272, 214);
      const round = (X, id, glyph, fn) => {
        const hov = P.btn(X - 42, 88, 84, 84, id, fn);
        x.beginPath(); x.arc(X, 130, 40, 0, Math.PI * 2); x.fillStyle = hov ? "rgba(42,181,180,0.45)" : "rgba(255,255,255,0.1)"; x.fill();
        x.fillStyle = "#fff"; x.font = `700 40px ${FONT}`; x.textAlign = "center"; x.fillText(glyph, X, 144); x.textAlign = "left";
      };
      round(W - 470, "prev", "‹", () => stepPano(-1));
      round(W - 376, "play", pm.play ? "❚❚" : "▶", () => { pm.play = !pm.play; pm.playT = 0; panoBar.redraw(); });
      round(W - 282, "next", "›", () => stepPano(1));
      const hov = P.btn(W - 222, 92, 198, 76, "exit", () => closePano());
      rr(x, W - 222, 92, 198, 76, 38); x.fillStyle = hov ? TEAL : "rgba(42,181,180,0.25)"; x.fill(); x.lineWidth = 3; x.strokeStyle = TEAL; x.stroke();
      x.fillStyle = "#fff"; x.font = `600 27px ${FONT}`; x.textAlign = "center"; x.fillText("Maquette", W - 123, 139); x.textAlign = "left";
    });
    panoBar.mesh.position.set(0, -0.42, -0.9); panoBar.mesh.rotation.x = -0.44; panoHud.add(panoBar.mesh);

    // walk-through arrows on the floor, towards the neighbouring shots
    const arrowG = new THREE.Group(); arrowG.visible = false; scene.add(arrowG);
    const chevGeo = (() => { const s = new THREE.Shape(); s.moveTo(0, 0.12); s.lineTo(0.1, -0.02); s.lineTo(0.05, -0.02); s.lineTo(0, 0.05); s.lineTo(-0.05, -0.02); s.lineTo(-0.1, -0.02); s.closePath(); return new THREE.ShapeGeometry(s).rotateX(-Math.PI / 2); })();
    const arrows = [];
    for (let k = 0; k < 4; k++) {
      const g = new THREE.Group();
      const chev = new THREE.Mesh(chevGeo, new THREE.MeshBasicMaterial({ color: 0x8ee6e4, transparent: true, opacity: 0.85, depthTest: false, depthWrite: false }));
      chev.renderOrder = 20;
      const c = document.createElement("canvas"); c.width = 512; c.height = 104;
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const label = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.077), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false }));
      label.renderOrder = 21; label.position.set(0, 0.07, 0.12); label.rotation.x = -0.8; chev.scale.setScalar(1.4); // +z faces the visitor; tilted up to be read from above
      const hit = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
      hit.visible = false; hit.position.z = -0.05; // easy target around the chevron
      g.add(chev, label, hit); arrowG.add(g);
      arrows.push({ g, chev, label, hit, c, tex, target: null, az: 0 });
      hit.userData.arrow = label.userData.arrow = arrows[k];
    }
    function buildArrows(p) {
      const cand = [];
      if (p.north != null) {
        const add = (q, name) => {
          if (!q || cand.some((c) => c.q === q)) return;
          const dx = q.m.x - p.m.x, dz = q.m.z - p.m.z, dist = Math.hypot(dx, dz); if (dist < 1.5 || dist > 60) return;
          const az = Math.atan2(dx, -dz);
          if (cand.some((c) => Math.abs(((c.az - az + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) < 0.35)) return; // same direction as a closer one
          cand.push({ q, az, dist, name });
        };
        add(panos[p.i + 1], "Suivante"); add(panos[p.i - 1], "Précédente");
        panos.filter((q) => q !== p).sort((a, b) => a.m.distanceTo(p.m) - b.m.distanceTo(p.m)).slice(0, 6).forEach((q) => add(q, q.place));
      }
      arrows.forEach((a, k) => {
        const c = cand[k]; a.target = c ? c.q : null; a.g.visible = !!c; if (!c) return;
        a.az = c.az;
        const x = a.c.getContext("2d"); x.clearRect(0, 0, 512, 104);
        rr(x, 2, 2, 508, 100, 50); x.fillStyle = "rgba(8,23,38,0.85)"; x.fill(); x.lineWidth = 3; x.strokeStyle = TEAL_L; x.stroke();
        x.fillStyle = "#fff"; x.font = `600 34px ${FONT}`; x.textAlign = "center";
        const name = c.name.length > 20 ? c.name.slice(0, 19) + "…" : c.name;
        x.fillText(`${name} · ${Math.round(c.dist)} m`, 256, 64); a.tex.needsUpdate = true;
      });
    }
    let hoverArrow = null, T = 0;
    function updatePano(dt) {
      panoSphere.position.copy(camPos);
      const gy = gazeAz(), hy = Math.atan2(-_v.x, -_v.z);
      const d = ((hy - pm.hudYaw + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
      if (Math.abs(d) > 0.9) pm.follow = true;
      if (pm.follow) { pm.hudYaw += d * (1 - Math.exp(-dt * 4)); if (Math.abs(d) < 0.05) pm.follow = false; }
      panoHud.position.copy(camPos); panoHud.rotation.y = pm.hudYaw;
      arrowG.position.set(camPos.x, camPos.y - 1.45, camPos.z);
      for (const a of arrows) if (a.g.visible) {
        const azW = a.az - view.yaw; // model bearing → world bearing (the table may be turned)
        a.g.position.set(Math.sin(azW) * 1.3, 0, -Math.cos(azW) * 1.3); a.g.rotation.y = -azW;
        a.chev.material.opacity = a === hoverArrow ? 1 : 0.7 + 0.15 * Math.sin(T * 3);
      }
      pm.barT += dt;
      if (panos[pm.i] && panos[pm.i].north != null && pm.barT > 0.15 && Math.abs(((gy - pm.barGaze + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) > 0.07) { pm.barGaze = gy; pm.barT = 0; panoBar.redraw(); }
      if (pm.play) { pm.playT += dt; if (pm.playT > 9) { pm.playT = 0; stepPano(1); } }
    }

    // ── input: the presentation's controllers (they ride on the visitor's rig, which is now in this room) ─
    const raycaster = new THREE.Raycaster();
    const _m4 = new THREE.Matrix4(), _v = new THREE.Vector3(), _w = new THREE.Vector3(), _plane = new THREE.Plane();
    let pan = null, grab = null, duo = null;
    const reticle = new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 8), new THREE.MeshBasicMaterial({ color: 0x8ee6e4, depthTest: false }));
    reticle.renderOrder = 40; reticle.visible = false; scene.add(reticle);
    function aim(obj) {
      _m4.identity().extractRotation(obj.matrixWorld);
      raycaster.ray.origin.setFromMatrixPosition(obj.matrixWorld);
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(_m4);
    }
    function pick() {
      const objs = [];
      if (pm.on) { // inside a 360° photo: only its bar and floor arrows
        objs.push(panoBar.mesh); for (const a of arrows) if (a.g.visible) objs.push(a.hit, a.label);
      } else {
        for (const P of panels) if (P.interactive && P.mesh.visible && P !== panoBar) objs.push(P.mesh);
        if (layers.pins) for (const p of pois) if (p.g.visible) objs.push(p.hit, p.label);
        if (layers.panos) { for (const p of panos) if (p.g.visible) objs.push(p.hit); for (const r of panoRuns) if (r.g.visible) objs.push(r.hit); }
      }
      const h = raycaster.intersectObjects(objs, false)[0]; if (!h) return null;
      const u = h.object.userData;
      if (u.panel) return { point: h.point, panel: u.panel, region: u.panel.regionAt(h.uv) };
      if (u.arrow) return { point: h.point, arrow: u.arrow };
      if (u.pano) return { point: h.point, pano: u.pano };
      if (u.run) return { point: h.point, run: u.run };
      return { point: h.point, poi: u.poi };
    }
    function activate(h, ctrl) {
      if (h.panel) { if (h.region) { fx.click(ctrl); h.region.fn(); } return; }
      fx.haptic(ctrl, 0.5, 35);
      if (h.arrow) { if (h.arrow.target) openPano(h.arrow.target.i); return; }
      if (h.pano) { openPano(h.pano.i); return; }
      if (h.run) { openPano(h.run.items[0].i); return; }
      if (h.poi) { fx.sfx("select", 0.55); stopTour(); selectPOI(h.poi.i); }
    }
    function discPoint(limit = true) { // current ray ∩ the plinth plane, in stand space
      stand.getWorldPosition(_w); _plane.set(_v.set(0, 1, 0), -_w.y);
      if (!raycaster.ray.intersectPlane(_plane, _w)) return null;
      const q = stand.worldToLocal(_w.clone());
      return limit && Math.hypot(q.x, q.z) > DISC_R ? null : q;
    }
    const mapAt = (q) => ({ x: q.x / K + view.cx, z: q.z / K + view.cz });
    function panTo(m0, q) { goal.cx = view.cx = m0.x - q.x / K; goal.cz = view.cz = m0.z - q.z / K; clampCentre(); }
    const live = () => api.active && !leaving;

    for (const ctrl of controllers) {
      ctrl.addEventListener("selectstart", () => {
        if (!live()) return;
        aim(ctrl); const h = pick();
        if (h) { activate(h, ctrl); return; }
        if (pm.on) return;
        const q = discPoint(); if (!q) return;
        stopTour();
        if (pan && pan.ctrl !== ctrl) { duo = startDuo(pan.ctrl, ctrl); pan = null; } // both hands on the table
        else pan = { ctrl, m0: mapAt(q) };
      });
      ctrl.addEventListener("selectend", () => {
        if (!live()) return;
        if (duo && (duo.a === ctrl || duo.b === ctrl)) { // keep panning with the hand still pinching
          const other = duo.a === ctrl ? duo.b : duo.a; duo = null;
          aim(other); const q = discPoint(false); if (q) pan = { ctrl: other, m0: mapAt(q) };
        } else if (pan && pan.ctrl === ctrl) pan = null;
      });
      ctrl.addEventListener("squeezestart", () => { if (live() && !pm.on) grab = { ctrl, off: table.position.clone().sub(_v.setFromMatrixPosition(ctrl.matrixWorld)) }; });
      ctrl.addEventListener("squeezeend", () => { if (grab && grab.ctrl === ctrl) grab = null; });
    }
    // two pointers on the table (both hands pinching, or both triggers): spread = zoom, twist = turn, the
    // map point between them stays put
    function planeHit(ctrl, out) { aim(ctrl); stand.getWorldPosition(_w); _plane.set(_v.set(0, 1, 0), -_w.y); return raycaster.ray.intersectPlane(_plane, out); }
    function startDuo(a, b) {
      const pa = planeHit(a, new THREE.Vector3()), pb = planeHit(b, new THREE.Vector3()); if (!pa || !pb) return null;
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      return { a, b, d0: Math.max(0.02, Math.hypot(pb.x - pa.x, pb.z - pa.z)), ang0: Math.atan2(pb.z - pa.z, pb.x - pa.x),
        zoom0: view.zoom, yaw0: view.yaw, m0: mapAt(stand.worldToLocal(mid)) };
    }
    const _pa = new THREE.Vector3(), _pb = new THREE.Vector3();
    function updateDuo() {
      if (!planeHit(duo.a, _pa) || !planeHit(duo.b, _pb)) return;
      const d = Math.max(0.02, Math.hypot(_pb.x - _pa.x, _pb.z - _pa.z)), ang = Math.atan2(_pb.z - _pa.z, _pb.x - _pa.x);
      goal.zoom = THREE.MathUtils.clamp(duo.zoom0 * d / duo.d0, ZOOM_MIN, ZOOM_MAX);
      goal.yaw = duo.yaw0 - (ang - duo.ang0);
      applyView(); stand.updateMatrixWorld();
      panTo(duo.m0, stand.worldToLocal(_pa.add(_pb).multiplyScalar(0.5)));
    }

    const btnPrev = new Map();
    function xrInput(dt) {
      let turn = 0, zoom = 0;
      const s = renderer.xr.getSession(); if (!s) return;
      for (const src of s.inputSources) {
        const gp = src.gamepad; if (!gp) continue;
        const ax = gp.axes[2] ?? 0, ay = gp.axes[3] ?? 0;
        const a = !!gp.buttons[4]?.pressed, b = !!gp.buttons[5]?.pressed, prev = btnPrev.get(src) || {};
        const flick = ax > 0.7 ? 1 : ax < -0.7 ? -1 : 0;
        if (pm.on) { // in a 360° photo: flick the stick to walk on, A = next, B = back to the model
          if (flick && flick !== prev.flick) stepPano(flick);
          if (a && !prev.a) stepPano(1);
          if (b && !prev.b) closePano();
        } else {
          if (Math.abs(ax) > 0.2) turn += ax; if (Math.abs(ay) > 0.2) zoom += ay;
          if (a && !prev.a) { stopTour(); selectPOI(sel >= 0 ? (sel + 1) % pois.length : 0); }
          if (b && !prev.b) resetView();
        }
        btnPrev.set(src, { a, b, flick });
      }
      if (!pm.on) steer(turn, zoom, dt);
    }
    function steer(turn, zoom, dt) {
      if (!turn && !zoom) return;
      stopTour();
      goal.yaw -= turn * dt * 1.3;
      goal.zoom = THREE.MathUtils.clamp(goal.zoom * Math.exp(-zoom * dt * 1.5), ZOOM_MIN, ZOOM_MAX);
    }

    // ── input: desktop (orbit around the table, wheel = zoom, drag on the map = pan, arrows = turn) ────
    const ndc = new THREE.Vector2(); let mouse = false, drag = null;
    const setNDC = (e) => ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    const keys = new Set();
    addEventListener("keydown", (e) => {
      if (!live()) return;
      if (pm.on) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") { if (!e.repeat) stepPano(e.key === "ArrowRight" ? 1 : -1); e.preventDefault(); }
        if (e.key === "Escape") closePano();
        if (e.key === " ") { pm.play = !pm.play; pm.playT = 0; panoBar.redraw(); e.preventDefault(); }
        return;
      }
      if (e.key.startsWith("Arrow")) { keys.add(e.key); e.preventDefault(); }
      if (e.key === "Escape") exit();
      if (e.key === "n") { stopTour(); selectPOI(sel >= 0 ? (sel + 1) % pois.length : 0); }
      if (e.key === "r") resetView();
      if (e.key === "t") (tour.on ? stopTour() : startTour());
    });
    addEventListener("keyup", (e) => keys.delete(e.key));
    renderer.domElement.addEventListener("pointerdown", (e) => { // registered before OrbitControls so it can veto the orbit
      if (!live() || renderer.xr.isPresenting) return;
      setNDC(e); raycaster.setFromCamera(ndc, camera);
      const h = pick();
      if (h) { drag = { type: "click", hit: h, x: e.clientX, y: e.clientY }; controls.enabled = false; return; }
      if (pm.on) { drag = { type: "look", x: e.clientX, y: e.clientY }; return; }
      const q = discPoint();
      if (q) { drag = { type: "pan", m0: mapAt(q) }; controls.enabled = false; stopTour(); }
      else drag = { type: "orbit" };
    });
    renderer.domElement.addEventListener("pointermove", (e) => {
      if (!live()) return;
      setNDC(e); mouse = true;
      if (drag && drag.type === "pan") { raycaster.setFromCamera(ndc, camera); const q = discPoint(false); if (q) panTo(drag.m0, q); }
      if (drag && drag.type === "look") { // drag the photo around
        pm.look.yaw += (e.clientX - drag.x) * 0.0035; pm.look.pitch = THREE.MathUtils.clamp(pm.look.pitch + (e.clientY - drag.y) * 0.0035, -1.3, 1.3);
        drag.x = e.clientX; drag.y = e.clientY;
      }
    });
    renderer.domElement.addEventListener("pointerleave", () => { mouse = false; });
    addEventListener("pointerup", (e) => {
      if (!live()) { drag = null; return; }
      if (drag && drag.type === "click" && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) activate(drag.hit);
      drag = null; controls.enabled = !pm.on && !renderer.xr.isPresenting;
    });
    renderer.domElement.addEventListener("wheel", (e) => {
      if (!live()) return;
      e.preventDefault();
      if (pm.on) { camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.04, 35, 95); camera.updateProjectionMatrix(); return; }
      stopTour();
      goal.zoom = THREE.MathUtils.clamp(goal.zoom * Math.exp(-e.deltaY * 0.0015), ZOOM_MIN, ZOOM_MAX);
    }, { passive: false });
    const keep = { p: camera.position.clone(), q: camera.quaternion.clone() }; // OrbitControls aims the camera on creation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(TABLE_POS.x, TABLE_POS.y + 0.02, TABLE_POS.z);
    controls.enableZoom = false; controls.enablePan = false; controls.enableDamping = true;
    controls.maxPolarAngle = 84 * DEG; controls.minPolarAngle = 8 * DEG;
    controls.enabled = false;
    camera.position.copy(keep.p); camera.quaternion.copy(keep.q);

    // ── XR sessions: tile queues tick on the session (window rAF is paused in immersive mode) ─────────
    let xrCam = null;
    function onSessionStart() {
      Scheduler.setXRSession(renderer.xr.getSession());
      xrCam = renderer.xr.getCamera(); tiles.deleteCamera(camera); tiles.setCamera(xrCam);
      if (api.active) { controls.enabled = false; menu.redraw(); }
    }
    renderer.xr.addEventListener("sessionstart", onSessionStart);
    renderer.xr.addEventListener("sessionend", () => {
      Scheduler.setXRSession(null);
      if (xrCam) tiles.deleteCamera(xrCam); xrCam = null; tiles.setCamera(camera);
      if (!api.active) return;
      if (pm.on) closePano(true);
      user.position.set(0, 0, 0); user.rotation.set(0, 0, 0); // back on the desktop: orbit the table
      camera.position.copy(DESK_CAM); camera.fov = 55; camera.updateProjectionMatrix();
      controls.enabled = true; controls.update(); menu.redraw();
    });
    if (renderer.xr.isPresenting) onSessionStart();

    // ── heights of the pins and wall line: baked in pois.json, sampled from the tiles when missing ──────
    const rc = new THREE.Raycaster(), _down = new THREE.Vector3(0, -1, 0), _o = new THREE.Vector3();
    function sampleHeight(x, z, spread = 0) {
      let best = null;
      for (const [ox, oz] of spread ? [[0, 0], [spread, 0], [-spread, 0], [0, spread], [0, -spread]] : [[0, 0]]) {
        map.localToWorld(_o.set(x + ox, BASE_Y + 400, z + oz)); rc.set(_o, _down);
        const h = rc.intersectObject(tiles.group, true)[0];
        if (h) { const y = map.worldToLocal(h.point.clone()).y; if (best === null || y > best) best = y; }
      }
      return best;
    }
    let heightsTried = false;
    tiles.addEventListener("tiles-load-end", () => {
      if (heightsTried || !modelsLoaded) return; heightsTried = true; // once, after the first view has loaded
      for (const p of pois) if (!p.hasH) { const y = sampleHeight(p.m.x, p.m.z); if (y != null) { p.m.y = y; p.hasH = true; } }
      if (!DATA.wallH) { wallPts.forEach((w) => { const y = sampleHeight(w.x, w.z, 3); if (y != null) w.y = y; }); buildWalls(); }
    });

    function applyAR() { scene.background = arMode ? null : BG; env.visible = !arMode && !pm.on; menu.redraw(); }
    applyAR();

    // ── moving in and out ───────────────────────────────────────────────────────────────────────────
    let saved = null;
    const _h = new THREE.Vector3(), _d = new THREE.Vector3();
    function switchIn() {
      saved = { pos: user.position.clone(), rotY: user.rotation.y, near: camera.near, far: camera.far, fov: camera.fov,
        camPos: camera.position.clone(), camQuat: camera.quaternion.clone(), tone: renderer.toneMapping, hint: hintEl ? hintEl.textContent : "" };
      scene.add(user); scene.add(fx.fader);
      renderer.toneMapping = THREE.NoToneMapping; // the photogrammetry is unlit: show its colours as captured
      camera.near = 0.01; camera.far = 200;
      if (renderer.xr.isPresenting) { // turn and slide the rig so the visitor stands at the origin, facing the table
        const xc = renderer.xr.getCamera(); xc.getWorldPosition(_h); xc.getWorldDirection(_d);
        const az = Math.atan2(_d.x, -_d.z);
        user.position.sub(_h).applyAxisAngle(UP, az).add(_h); user.rotation.y += az;
        user.position.x -= _h.x; user.position.z -= _h.z;
      } else {
        user.position.set(0, 0, 0); user.rotation.set(0, 0, 0);
        camera.position.copy(DESK_CAM); camera.fov = 55; controls.enabled = true; controls.update();
      }
      camera.updateProjectionMatrix();
      if (hintEl) hintEl.textContent = HINT_MODEL;
      api.active = true; menu.redraw();
    }
    function switchOut() {
      if (pm.on) closePano(true);
      stopTour(); setHover(null, null); pan = grab = duo = drag = null; keys.clear();
      home.add(user); home.add(fx.fader);
      user.position.copy(saved.pos); user.rotation.set(0, saved.rotY, 0);
      camera.near = saved.near; camera.far = saved.far; camera.fov = saved.fov;
      camera.position.copy(saved.camPos); camera.quaternion.copy(saved.camQuat); camera.updateProjectionMatrix();
      renderer.toneMapping = saved.tone; controls.enabled = false; renderer.domElement.style.cursor = "";
      reticle.visible = false; tip.mesh.visible = false;
      if (hintEl) hintEl.textContent = saved.hint;
      api.active = false;
    }

    // ── per frame (called by the presentation's loop while the visitor is here) ───────────────────────
    const camPos = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(1, 1, 1);
    const fade = (cur, on, dt, k = 5) => cur + ((on ? 1 : 0) - cur) * (1 - Math.exp(-dt * k));
    let lastPct = -1;
    function update(dt) {
      T += dt;
      const xr = renderer.xr.isPresenting;

      // input
      if (xr) xrInput(dt);
      if (!pm.on) steer((keys.has("ArrowRight") ? 1 : 0) - (keys.has("ArrowLeft") ? 1 : 0), (keys.has("ArrowDown") ? 1 : 0) - (keys.has("ArrowUp") ? 1 : 0), dt);
      else if (!xr) camera.rotation.set(pm.look.pitch, pm.look.yaw, 0, "YXZ");
      if (grab) { table.position.copy(_v.setFromMatrixPosition(grab.ctrl.matrixWorld)).add(grab.off); floorU.uC.value.set(table.position.x, table.position.z); }
      if (duo) updateDuo();
      else if (pan) { aim(pan.ctrl); const q = discPoint(false); if (q) panTo(pan.m0, q); }
      if (tour.on) { tour.t += dt; goal.yaw -= dt * 0.07; if (tour.t > 11) { tour.t = 0; selectPOI((sel + 1) % pois.length, 3); } }

      applyView(dt);
      U.uTime.value = T; U.uWin.value.set(view.cx, view.cz, WIN);
      U.uScan.value = fade(U.uScan.value, layers.scan, dt);
      U.uContour.value = fade(U.uContour.value, layers.contour, dt);
      selA = fade(selA, sel >= 0, dt, 6); U.uSel.value.w = selA;
      wallU.uOn.value = fade(wallU.uOn.value, layers.walls, dt); wallsG.visible = wallU.uOn.value > 0.01;
      wallU.uR.value = 0.0017 / K;
      const sk = `${Math.round(1 / K / 10)}`; if (sk !== scaleKey) { scaleKey = sk; scaleP.redraw(); }

      // pins
      camera.getWorldPosition(camPos);
      for (const p of pois) {
        const dx = p.m.x - view.cx, dz = p.m.z - view.cz;
        p.g.visible = layers.pins && Math.hypot(dx, dz) < WIN * 0.97;
        if (!p.g.visible) continue;
        p.g.position.set(dx * K, Math.max(0, (p.m.y - BASE_Y) * K), dz * K);
        const on = p.i === sel, hov = p === hoverPoi;
        p.head.rotation.y += dt * 1.5;
        p.head.scale.setScalar(on ? 1.6 : hov ? 1.35 : 1);
        p.glow.scale.setScalar((on ? 0.05 : 0.03) * (1 + 0.12 * Math.sin(T * 3 + p.i)));
        const ph = (T * (on ? 0.9 : 0.45) + p.i * 0.37) % 1;
        p.ringM.scale.setScalar(1 + ph * (on ? 5 : 3)); p.ringM.material.opacity = (1 - ph) * 0.9;
        p.label.scale.setScalar(on || hov ? 1.18 : 1);
        p.label.lookAt(camPos);
      }
      if (sel >= 0 && pois[sel].g.visible) {
        column.visible = true; column.position.copy(pois[sel].g.position); column.material.uniforms.uA.value = selA;
      } else column.visible = false;

      // drone
      drone.visible = cone.visible = layers.drone;
      if (layers.drone) {
        const a = T * (2 * Math.PI / 46), rx = DISC_R * 0.52, rz = DISC_R * 0.42;
        drone.position.set(Math.cos(a) * rx, 0.19 + Math.sin(T * 1.7) * 0.006, Math.sin(a) * rz);
        drone.rotation.set(0.12, Math.atan2(Math.sin(a) * rx, -Math.cos(a) * rz), 0);
        props.forEach((b, k) => { b.rotation.y += dt * (k % 2 ? 60 : -60); });
        leds.forEach((l) => { l.visible = (T * 1.4) % 1 < 0.18; });
        const r = 0.055; cone.position.copy(drone.position); cone.position.y -= 0.004; cone.scale.set(r, drone.position.y - 0.004, r);
        const m = mapAt(drone.position); U.uDrone.value.set(m.x, m.z, r / K, 1);
      } else U.uDrone.value.w = 0;

      // 360° markers: one per photo when zoomed in, one per place when zoomed out
      const showPanos = layers.panos && !pm.on, fine = view.zoom >= 2.2;
      const placeMarker = (g, m, show, hov) => {
        const dx = m.x - view.cx, dz = m.z - view.cz;
        g.visible = show && Math.hypot(dx, dz) < WIN * 0.96; if (!g.visible) return;
        g.position.set(dx * K, Math.max(0, (m.y - BASE_Y) * K) + 0.009, dz * K); g.scale.setScalar(hov ? 1.4 : 1);
      };
      for (const p of panos) placeMarker(p.g, p.m, showPanos && fine, p === hoverPanoItem);
      for (const r of panoRuns) placeMarker(r.g, r.m, showPanos && !fine, r === hoverPanoItem);
      if (hoverPanoItem && hoverPanoItem.g.visible) {
        if (tipFor !== hoverPanoItem) { tipFor = hoverPanoItem; tip.redraw(); }
        hoverPanoItem.g.getWorldPosition(_a); tip.mesh.position.set(_a.x, _a.y + 0.075, _a.z);
        tip.mesh.rotation.set(0, Math.atan2(camPos.x - _a.x, camPos.z - _a.z), 0); tip.mesh.visible = true;
      } else { tip.mesh.visible = false; tipFor = null; }
      if (pm.on) updatePano(dt);

      // panels face the visitor (yaw only)
      for (const P of [menu, card, title]) {
        P.mesh.getWorldPosition(_a);
        P.mesh.rotation.set(0, Math.atan2(camPos.x - _a.x, camPos.z - _a.z) - table.rotation.y, 0);
      }
      if (card.mesh.visible) { cardA = Math.min(1, cardA + dt * 4); card.mesh.material.opacity = cardA; card.mesh.scale.setScalar(0.92 + 0.08 * cardA); }

      scene.updateMatrixWorld();
      U.uMapInv.value.copy(map.matrixWorld).invert();

      // leader from the card to the selected pin
      beads.visible = !pm.on && card.mesh.visible && sel >= 0 && pois[sel].g.visible;
      if (beads.visible) {
        card.mesh.localToWorld(_a.set(-card.mesh.geometry.parameters.width / 2, 0, 0));
        pois[sel].head.getWorldPosition(_b);
        _c.addVectors(_a, _b).multiplyScalar(0.5); _c.y += 0.1;
        leadCurve.v0.copy(_a); leadCurve.v1.copy(_c); leadCurve.v2.copy(_b);
        for (let k = 0; k < LEAD_N; k++) {
          leadCurve.getPoint((k + ((T * 0.8) % 1)) / LEAD_N, _v);
          beads.setMatrixAt(k, _m4.compose(_v, _q, _s.setScalar(cardA)));
        }
        beads.instanceMatrix.needsUpdate = true;
      }

      // pointer hover (controller rays in XR, mouse on desktop)
      let hit = null, hitCtrl = null;
      const rays = xr ? controllers.filter((c) => c !== (pan && pan.ctrl) && !(duo && (c === duo.a || c === duo.b))) : mouse && !drag ? [null] : [];
      for (const c of rays) {
        if (c) aim(c); else raycaster.setFromCamera(ndc, camera);
        hit = pick(); if (hit) { hitCtrl = c; break; }
      }
      setHover(hit, hitCtrl);
      if (xr) { reticle.visible = !!hit; if (hit) reticle.position.copy(hit.point); }
      else renderer.domElement.style.cursor = hit && (hit.poi || hit.region || hit.pano || hit.run || hit.arrow) ? "pointer" : drag && (drag.type === "pan" || drag.type === "look") ? "grabbing" : pm.on ? "grab" : "";

      // tiles
      if (xr && xrCam) { const vp = xrCam.cameras[0] && xrCam.cameras[0].viewport; if (vp && vp.z) tiles.setResolution(xrCam, vp.z, vp.w); }
      else { tiles.setResolutionFromRenderer(camera, renderer); if (!pm.on) controls.update(); }
      if (!pm.on) tiles.update(); // the model is hidden while inside a photo

      const pct = Math.round(tiles.loadProgress * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        const shown = modelsLoaded ? pct : 0;
        if (Math.abs(shown - loadPct) >= 5 || shown === 100) { loadPct = shown; title.redraw(); }
      }
    }

    function setHover(h, ctrl) {
      const key = !h ? null : h.panel ? (h.region ? h.region.id + "@" + panels.indexOf(h.panel) : null)
        : h.poi ? "poi" + h.poi.i : h.pano ? "pano" + h.pano.i : h.run ? "run" + panoRuns.indexOf(h.run) : h.arrow ? "arrow" + arrows.indexOf(h.arrow) : null;
      if (key && key !== hoverKey) fx.hover(ctrl);
      hoverKey = key;
      hoverPoi = h && h.poi ? h.poi : null;
      hoverPanoItem = h ? h.pano || h.run || null : null;
      hoverArrow = h && h.arrow ? h.arrow : null;
      const P = h && h.panel ? h.panel : null, id = P && h.region ? h.region.id : null;
      if (hoverPanel && hoverPanel !== P) hoverPanel.setHover(null);
      if (P) P.setHover(id);
      hoverPanel = P;
    }

    if (location.search.includes("debug")) window.CITE = {
      Scheduler, tiles, view, goal, layers, pois, panos, pm, menu, card, title, U, map, stand, table, scene, controls,
      selectPOI, resetView, startTour, openPano, closePano, applyView,
      // gallery-tile hero: the maquette alone (no UI), rendered at w×h from a fixed camera, PUT to the dev server
      async heroShot({ w = 1000, h = 1100, cam = [0, 1.62, -0.28], look = [0, 0.9, -0.98], fov = 46, put = base + "hero.jpg" } = {}) {
        const c = new THREE.PerspectiveCamera(fov, w / h, 0.01, 50); c.position.set(...cam); c.lookAt(...look); scene.add(c);
        const ui = [menu.mesh, card.mesh, title.mesh, scaleP.mesh, tip.mesh, reticle, beads, drone, cone], vis = ui.map((o) => o.visible);
        tiles.setCamera(c); tiles.setResolution(c, w, h);
        for (let n = 0, quiet = 0; n < 400 && quiet < 10; n++) {
          scene.updateMatrixWorld(); U.uMapInv.value.copy(map.matrixWorld).invert(); tiles.update();
          quiet = tiles.loadProgress >= 1 ? quiet + 1 : 0; await new Promise((r) => setTimeout(r, 60));
        }
        ui.forEach((o) => (o.visible = false)); user.visible = false;
        const size = renderer.getSize(new THREE.Vector2()), pr = renderer.getPixelRatio();
        renderer.setPixelRatio(1); renderer.setSize(w, h, false);
        scene.updateMatrixWorld(); U.uMapInv.value.copy(map.matrixWorld).invert();
        renderer.render(scene, c);
        const url = renderer.domElement.toDataURL("image/jpeg", 0.9);
        renderer.setPixelRatio(pr); renderer.setSize(size.x, size.y, false);
        ui.forEach((o, k) => (o.visible = vis[k])); user.visible = true;
        tiles.deleteCamera(c); scene.remove(c);
        const blob = await (await fetch(url)).blob();
        const r = await fetch(put, { method: "PUT", body: blob });
        return { status: r.status, bytes: blob.size, loaded: tiles.loadProgress };
      },
    };

    return { switchIn, switchOut, update, applyAR, redrawMenu: () => menu.redraw() };
  }

  return api;
}
