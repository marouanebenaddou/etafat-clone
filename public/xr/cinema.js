// ETAFAT VR — cinema. A curved screen floating over the valley to the visitor's left (the setting sun sits
// right behind it), HUD bracket frame, an ambient glow that takes the film's colours (21st.dev "Video
// Ambient" idea, here in 3D), sound from the screen (positional), and a remote lectern next to the visitor:
// film cards, play/pause, seek bar, volume, "lumières tamisées". Playing dims the landscape and the music.
import * as THREE from "three";

const DEG = Math.PI / 180;
export const FILMS = [
  { id: "manifeste", title: "Manifeste", sub: "Pionniers de la souveraineté foncière", src: "./videos/manifeste.mp4", poster: "./videos/manifeste.jpg", dur: 58 },
  { id: "institutionnel", title: "Film institutionnel", sub: "De la donnée au territoire", src: "./videos/institutionnel.mp4", poster: "./videos/institutionnel.jpg", dur: 130 },
];
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
function rr(x, X, Y, W, H, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); }
function cover(x, img, X, Y, W, H) { const r = Math.max(W / img.width, H / img.height), w = img.width * r, h = img.height * r; x.drawImage(img, X + (W - w) / 2, Y + (H - h) / 2, w, h); }
// curved strip on the cylinder centred on the visitor: azimuths a0→a1 (rad), heights y0→y1, radius r
function curved(a0, a1, y0, y1, r, segs = 48) {
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= segs; i++) {
    const u = i / segs, a = a0 + (a1 - a0) * u, x = r * Math.sin(a), z = -r * Math.cos(a);
    pos.push(x, y0, z, x, y1, z); uv.push(u, 0, u, 1);
    if (i) { const b = (i - 1) * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); return g;
}

export function createCinema({ scene, fx, world, az = -90 }) {
  const R = 6.6, ARC = 6.4, H = 3.6, YC = 2.38, A = az * DEG, HALF = ARC / R / 2, a0 = A - HALF, a1 = A + HALF, y0 = YC - H / 2, y1 = YC + H / 2;
  const group = new THREE.Group(); scene.add(group);
  const basic = (o) => new THREE.MeshBasicMaterial({ toneMapped: false, ...o });

  // ── idle face: poster + title + big play button (canvas); video texture while playing ─────────────
  const posters = FILMS.map((f) => { const i = new Image(); i.src = f.poster; return i; });
  const idleC = document.createElement("canvas"); idleC.width = 1600; idleC.height = 900;
  const idleTex = new THREE.CanvasTexture(idleC); idleTex.colorSpace = THREE.SRGBColorSpace; idleTex.anisotropy = 8;
  let cur = 0, playing = false, ended = false, vol = 0.9, autoDim = true, msg = "";
  function drawIdle() {
    const x = idleC.getContext("2d"), W = idleC.width, Hh = idleC.height, f = FILMS[cur], img = posters[cur];
    x.fillStyle = "#06121f"; x.fillRect(0, 0, W, Hh);
    if (img.complete && img.naturalWidth) cover(x, img, 0, 0, W, Hh);
    const g = x.createLinearGradient(0, Hh * 0.35, 0, Hh); g.addColorStop(0, "rgba(4,12,22,0)"); g.addColorStop(1, "rgba(4,12,22,0.92)");
    x.fillStyle = g; x.fillRect(0, 0, W, Hh);
    x.fillStyle = "rgba(4,12,22,0.25)"; x.fillRect(0, 0, W, Hh);
    x.beginPath(); x.arc(W / 2, Hh * 0.44, 92, 0, 7); x.fillStyle = "rgba(42,181,180,0.9)"; x.fill();
    x.lineWidth = 6; x.strokeStyle = "rgba(255,255,255,0.85)"; x.stroke();
    x.fillStyle = "#fff"; x.beginPath(); x.moveTo(W / 2 - 28, Hh * 0.44 - 44); x.lineTo(W / 2 + 50, Hh * 0.44); x.lineTo(W / 2 - 28, Hh * 0.44 + 44); x.closePath(); x.fill();
    x.textAlign = "center"; x.fillStyle = "#8ee6e4"; x.font = "700 30px system-ui, sans-serif";
    if ("letterSpacing" in x) x.letterSpacing = "8px";
    x.fillText(ended ? "REVOIR" : "ETAFAT · CINÉMA", W / 2, Hh * 0.7); if ("letterSpacing" in x) x.letterSpacing = "0px";
    x.fillStyle = "#fff"; x.font = "800 84px system-ui, sans-serif"; x.fillText(f.title, W / 2, Hh * 0.8);
    x.fillStyle = "rgba(234,244,248,0.8)"; x.font = "400 38px system-ui, sans-serif"; x.fillText(`${f.sub}  ·  ${fmt(f.dur)}`, W / 2, Hh * 0.87);
    if (msg) { x.fillStyle = "#ffd28a"; x.font = "600 32px system-ui, sans-serif"; x.fillText(msg, W / 2, Hh * 0.94); }
    idleTex.needsUpdate = true;
  }
  posters.forEach((p) => (p.onload = () => { drawIdle(); remote.userData.redraw(); }));
  drawIdle();

  const screen = new THREE.Mesh(curved(a0, a1, y0, y1, R, 64), basic({ map: idleTex, side: THREE.DoubleSide }));
  screen.renderOrder = 4; group.add(screen);
  const back = new THREE.Mesh(curved(a0 - 0.006, a1 + 0.006, y0 - 0.05, y1 + 0.05, R + 0.04, 32), basic({ color: 0x050b12, side: THREE.DoubleSide }));
  group.add(back);

  // frame: thin edges + bright bracket corners (HUD look)
  const edge = basic({ color: 0x8ee6e4, transparent: true, opacity: 0.55 }), brk = basic({ color: 0x8ee6e4 });
  const dA = (m) => m / R; // metres → radians along the arc
  group.add(new THREE.Mesh(curved(a0, a1, y1 + 0.03, y1 + 0.045, R - 0.02, 48), edge), new THREE.Mesh(curved(a0, a1, y0 - 0.045, y0 - 0.03, R - 0.02, 48), edge));
  group.add(new THREE.Mesh(curved(a0 - dA(0.045), a0 - dA(0.03), y0 - 0.03, y1 + 0.03, R - 0.02, 1), edge), new THREE.Mesh(curved(a1 + dA(0.03), a1 + dA(0.045), y0 - 0.03, y1 + 0.03, R - 0.02, 1), edge));
  const L = 0.5, T = 0.05, o = 0.07;
  for (const [ax, sx] of [[a0, 1], [a1, -1]]) for (const [yy, sy] of [[y1, -1], [y0, 1]]) {
    const ao = ax - sx * dA(o), aL = ao + sx * dA(L);
    group.add(new THREE.Mesh(curved(Math.min(ao, aL), Math.max(ao, aL), yy - sy * o - T / 2, yy - sy * o + T / 2, R - 0.03, 8), brk)); // horizontal arm
    const yA = yy - sy * o, yB = yA + sy * L;
    group.add(new THREE.Mesh(curved(ao - dA(T / 2), ao + dA(T / 2), Math.min(yA, yB), Math.max(yA, yB), R - 0.03, 1), brk)); // vertical arm
  }
  // label above the screen
  const lc = document.createElement("canvas"); lc.width = 1024; lc.height = 96; const lx = lc.getContext("2d");
  lx.textAlign = "center"; lx.fillStyle = "#8ee6e4"; lx.font = "700 44px system-ui, sans-serif"; if ("letterSpacing" in lx) lx.letterSpacing = "14px"; lx.fillText("ETAFAT  ·  CINÉMA", 512, 64);
  const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace;
  group.add(new THREE.Mesh(curved(A - dA(1.6), A + dA(1.6), y1 + 0.18, y1 + 0.48, R - 0.02, 16), basic({ map: lt, transparent: true, side: THREE.DoubleSide })));

  // ambient glow behind the screen, tinted with the film's average colour
  const gc = document.createElement("canvas"); gc.width = 256; gc.height = 128; const gx = gc.getContext("2d");
  const rg = gx.createRadialGradient(128, 64, 10, 128, 64, 128); rg.addColorStop(0, "rgba(255,255,255,0.9)"); rg.addColorStop(0.45, "rgba(255,255,255,0.35)"); rg.addColorStop(1, "rgba(255,255,255,0)");
  gx.fillStyle = rg; gx.fillRect(0, 0, 256, 128);
  const glowTex = new THREE.CanvasTexture(gc);
  const glow = new THREE.Mesh(curved(A - HALF * 1.55, A + HALF * 1.55, y0 - 1.6, y1 + 1.6, R + 0.6, 48), basic({ map: glowTex, color: 0x2ab5b4, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  glow.renderOrder = 3; group.add(glow);
  const glowCol = new THREE.Color(0x2ab5b4), glowWant = new THREE.Color(0x2ab5b4);
  const sampler = document.createElement("canvas"); sampler.width = 16; sampler.height = 9; const sx = sampler.getContext("2d", { willReadFrequently: true });

  // sound from the screen
  const anchor = new THREE.Object3D(); anchor.position.set(R * Math.sin(A), YC, -R * Math.cos(A)); group.add(anchor);

  // ── videos (created on first play: one element + one positional source per film) ──────────────────
  const videos = [], sounds = [], textures = [];
  function video(i) {
    if (videos[i]) return videos[i];
    const v = document.createElement("video");
    v.src = FILMS[i].src; v.playsInline = true; v.preload = "auto"; v.crossOrigin = "anonymous";
    v.addEventListener("ended", () => { playing = false; ended = true; screen.material.map = idleTex; drawIdle(); fx.duck(false); remote.userData.redraw(); });
    v.addEventListener("error", () => { playing = false; msg = "Vidéo indisponible dans cette version (disponible dans l’application)"; drawIdle(); remote.userData.redraw(); });
    const s = new THREE.PositionalAudio(fx.listener); s.setMediaElementSource(v); s.setRefDistance(7); s.setRolloffFactor(0.35); s.setVolume(vol); anchor.add(s);
    const t = new THREE.VideoTexture(v); t.colorSpace = THREE.SRGBColorSpace;
    videos[i] = v; sounds[i] = s; textures[i] = t; return v;
  }
  function play() {
    const v = video(cur); fx.unlock(); msg = "";
    if (ended) { v.currentTime = 0; ended = false; }
    v.play().then(() => { playing = true; screen.material.map = textures[cur]; screen.material.needsUpdate = true; fx.duck(true); remote.userData.redraw(); })
      .catch(() => { v.muted = true; v.play().then(() => { playing = true; msg = ""; screen.material.map = textures[cur]; fx.duck(true); remote.userData.redraw(); }).catch(() => { msg = "Lecture impossible"; drawIdle(); }); });
  }
  function pause() { if (videos[cur]) videos[cur].pause(); playing = false; fx.duck(false); remote.userData.redraw(); }
  function select(i, autoplay = true) {
    if (i !== cur) { pause(); if (videos[cur]) videos[cur].currentTime = 0; cur = i; ended = false; screen.material.map = idleTex; drawIdle(); }
    if (autoplay) play(); remote.userData.redraw();
  }
  screen.userData.onClick = () => (playing ? pause() : play());

  // ── remote lectern: film cards + transport, one canvas with hit regions ─────────────────────────
  const RW = 1000, RH = 560, RS = 1.6, PXR = 0.00078;
  const rc = document.createElement("canvas"); rc.width = RW * RS; rc.height = RH * RS; const rx = rc.getContext("2d");
  const rtex = new THREE.CanvasTexture(rc); rtex.colorSpace = THREE.SRGBColorSpace; rtex.anisotropy = 8;
  const remote = new THREE.Mesh(new THREE.PlaneGeometry(RW * PXR, RH * PXR), basic({ map: rtex, transparent: true }));
  remote.renderOrder = 12;
  let regions = [], hoverId = null;
  const btn = (X, Y, W, Hh, id, fn) => { regions.push({ X, Y, W, H: Hh, id, fn }); return hoverId === id; };
  remote.userData.redraw = () => {
    const x = rx; x.setTransform(RS, 0, 0, RS, 0, 0); x.clearRect(0, 0, RW, RH); regions = [];
    const g = x.createLinearGradient(0, 0, 0, RH); g.addColorStop(0, "rgba(19,49,80,0.95)"); g.addColorStop(1, "rgba(7,20,34,0.97)");
    rr(x, 2, 2, RW - 4, RH - 4, 30); x.fillStyle = g; x.fill(); x.lineWidth = 3; x.strokeStyle = "rgba(42,181,180,0.75)"; x.stroke();
    x.fillStyle = "#8ee6e4"; x.font = "700 22px system-ui, sans-serif"; if ("letterSpacing" in x) x.letterSpacing = "6px"; x.fillText("CINÉMA ETAFAT", 40, 52); if ("letterSpacing" in x) x.letterSpacing = "0px";
    x.fillStyle = "rgba(234,244,248,0.6)"; x.font = "400 20px system-ui, sans-serif"; x.textAlign = "right"; x.fillText("Choisissez un film · il s’affiche sur le grand écran", RW - 40, 52); x.textAlign = "left";
    FILMS.forEach((f, i) => { // film cards
      const X = 40 + i * 470, Y = 76, W = 450, Hh = 214, hov = btn(X, Y, W, Hh, "film" + i, () => select(i)), sel = i === cur;
      x.save(); rr(x, X, Y, W, Hh, 18); x.clip();
      const img = posters[i]; if (img.complete && img.naturalWidth) cover(x, img, X, Y, W, Hh); else { x.fillStyle = "#0d2740"; x.fillRect(X, Y, W, Hh); }
      const sh = x.createLinearGradient(0, Y + 80, 0, Y + Hh); sh.addColorStop(0, "rgba(4,12,22,0)"); sh.addColorStop(1, "rgba(4,12,22,0.92)"); x.fillStyle = sh; x.fillRect(X, Y, W, Hh);
      x.restore();
      rr(x, X, Y, W, Hh, 18); x.lineWidth = sel ? 5 : hov ? 4 : 2; x.strokeStyle = sel ? "#2ab5b4" : hov ? "#8ee6e4" : "rgba(255,255,255,0.18)"; x.stroke();
      x.fillStyle = "#fff"; x.font = "700 30px system-ui, sans-serif"; x.fillText(f.title, X + 22, Y + Hh - 46);
      x.fillStyle = "rgba(234,244,248,0.75)"; x.font = "400 20px system-ui, sans-serif"; x.fillText(`${f.sub} · ${fmt(f.dur)}`, X + 22, Y + Hh - 18);
      if (sel && playing) { x.fillStyle = "#2ab5b4"; rr(x, X + W - 130, Y + 14, 116, 34, 17); x.fill(); x.fillStyle = "#fff"; x.font = "700 18px system-ui, sans-serif"; x.fillText("▶ EN COURS", X + W - 117, Y + 37); }
    });
    // transport
    const ty = 330, v = videos[cur], t = v ? v.currentTime : 0, d = v && v.duration ? v.duration : FILMS[cur].dur;
    const round = (X, id, glyph, fn, big) => {
      const r = big ? 44 : 34, hov = btn(X - r, ty + 40 - r, 2 * r, 2 * r, id, fn);
      x.beginPath(); x.arc(X, ty + 40, r, 0, 7); x.fillStyle = big ? (hov ? "#3fd0cf" : "#2ab5b4") : hov ? "rgba(42,181,180,0.45)" : "rgba(255,255,255,0.1)"; x.fill();
      x.fillStyle = "#fff"; x.font = `700 ${big ? 36 : 28}px system-ui, sans-serif`; x.textAlign = "center"; x.fillText(glyph, X, ty + 40 + (big ? 13 : 10)); x.textAlign = "left";
    };
    round(84, "restart", "⟲", () => { const vv = video(cur); vv.currentTime = 0; ended = false; if (!playing) play(); });
    round(184, "play", playing ? "❚❚" : "▶", () => (playing ? pause() : play()), true);
    round(284, "next", "⏭", () => select((cur + 1) % FILMS.length));
    const BX = 350, BW = 470, BY = ty + 34; // seek bar
    btn(BX - 6, BY - 24, BW + 12, 52, "seek", (u) => { const vv = video(cur); const dd = vv.duration || FILMS[cur].dur; vv.currentTime = Math.max(0, Math.min(dd - 0.2, ((u * RW) - BX) / BW * dd)); ended = false; if (!playing) play(); });
    rr(x, BX, BY, BW, 12, 6); x.fillStyle = "rgba(255,255,255,0.14)"; x.fill();
    const k = Math.min(1, t / d); const pg = x.createLinearGradient(BX, 0, BX + BW, 0); pg.addColorStop(0, "#00669d"); pg.addColorStop(1, "#2ab5b4");
    if (k > 0) { rr(x, BX, BY, Math.max(12, BW * k), 12, 6); x.fillStyle = pg; x.fill(); x.beginPath(); x.arc(BX + BW * k, BY + 6, 12, 0, 7); x.fillStyle = "#fff"; x.fill(); }
    x.fillStyle = "rgba(234,244,248,0.8)"; x.font = "600 20px system-ui, sans-serif"; x.fillText(fmt(t), BX, BY + 44); x.textAlign = "right"; x.fillText(fmt(d), BX + BW, BY + 44); x.textAlign = "left";
    round(872, "vol-", "−", () => { vol = Math.max(0, vol - 0.15); sounds.forEach((s) => s && s.setVolume(vol)); });
    round(944, "vol+", "+", () => { vol = Math.min(1.4, vol + 0.15); sounds.forEach((s) => s && s.setVolume(vol)); });
    x.fillStyle = "rgba(234,244,248,0.55)"; x.font = "600 16px system-ui, sans-serif"; x.textAlign = "center"; x.fillText(`VOLUME ${Math.round(vol / 1.4 * 100)} %`, 908, ty + 104); x.textAlign = "left";
    // dim toggle
    const dh = btn(40, 466, 330, 60, "dim", () => { autoDim = !autoDim; });
    rr(x, 40, 466, 330, 60, 30); x.fillStyle = dh ? "rgba(42,181,180,0.28)" : "rgba(255,255,255,0.07)"; x.fill();
    rr(x, 60, 482, 56, 28, 14); x.fillStyle = autoDim ? "#2ab5b4" : "rgba(255,255,255,0.2)"; x.fill();
    x.beginPath(); x.arc(autoDim ? 102 : 74, 496, 11, 0, 7); x.fillStyle = "#fff"; x.fill();
    x.fillStyle = "#fff"; x.font = "600 22px system-ui, sans-serif"; x.fillText("Lumières tamisées", 132, 504);
    x.fillStyle = "rgba(234,244,248,0.5)"; x.font = "400 18px system-ui, sans-serif"; x.fillText("Le son vient de l’écran · la musique s’efface pendant le film", 400, 504);
    rtex.needsUpdate = true;
  };
  remote.userData.onClick = (hit) => { const r = regionAt(hit); if (r) { r.fn(hit.uv.x); fx.click(hit.ctrl); remote.userData.redraw(); } };
  remote.userData.onHover = (hit) => { const r = hit ? regionAt(hit) : null, id = r ? r.id : null; if (id !== hoverId) { hoverId = id; if (id) fx.hover(hit.ctrl); remote.userData.redraw(); } };
  const regionAt = (hit) => { if (!hit || !hit.uv) return null; const px = hit.uv.x * RW, py = (1 - hit.uv.y) * RH; return regions.find((r) => px >= r.X && px <= r.X + r.W && py >= r.Y && py <= r.Y + r.H) || null; };
  remote.position.set(1.48 * Math.sin(A), 1.02, -1.48 * Math.cos(A)); remote.lookAt(0, 1.62, 0);
  group.add(remote); remote.userData.redraw();

  let acc = 0, lastDraw = 0, dim = 0;
  return {
    group, targets: [remote, screen], FILMS,
    get playing() { return playing; },
    play, pause, select,
    update(dt, t) {
      acc += dt;
      if (playing && acc > 0.15) { // ambient colour from the current frame
        acc = 0; const v = videos[cur];
        if (v && v.readyState >= 2) {
          try { sx.drawImage(v, 0, 0, 16, 9); const d = sx.getImageData(0, 0, 16, 9).data; let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } const n = d.length / 4; glowWant.setRGB(r / n / 255, g / n / 255, b / n / 255, THREE.SRGBColorSpace); } catch { /* not ready */ }
        }
      }
      if (!playing) glowWant.set(0x2ab5b4);
      glowCol.lerp(glowWant, Math.min(1, dt * 3)); glow.material.color.copy(glowCol);
      glow.material.opacity = (playing ? 0.55 : 0.22) + 0.04 * Math.sin(t * 1.3);
      if (playing && t - lastDraw > 0.25) { lastDraw = t; remote.userData.redraw(); }
      const want = playing && autoDim ? 1 : 0; dim += (want - dim) * Math.min(1, dt * 1.5);
      if (world.setDim) world.setDim(dim);
    },
  };
}
