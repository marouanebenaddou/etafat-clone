// ETAFAT VR — navigation dock (visionOS-style, inspired by 21st.dev floating docks): a glass pill floating
// below the visitor's gaze. Zone buttons turn you to the globe, the expertise gallery, the cinema or the key
// figures; then ambiance (sunset → day → night) and music. Icons swell on hover with a label above; a dot
// marks the zone you are facing. It follows your heading lazily, so it is always one glance down.
import * as THREE from "three";

const PX = 0.00058; // canvas px → metres
function rr(x, X, Y, W, H, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); }
function canvasPlane(w, h, draw, S = 2) {
  const c = document.createElement("canvas"); c.width = w * S; c.height = h * S;
  const x = c.getContext("2d"), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w * PX, h * PX), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
  m.userData.redraw = () => { x.setTransform(S, 0, 0, S, 0, 0); x.clearRect(0, 0, w, h); draw(x, w, h, m); tex.needsUpdate = true; };
  m.userData.redraw();
  return m;
}
// line icons (stroke on a 100×100 box)
const ICONS = {
  presence(x) { x.beginPath(); x.arc(50, 50, 32, 0, 7); x.stroke(); x.beginPath(); x.ellipse(50, 50, 14, 32, 0, 0, 7); x.stroke(); x.beginPath(); x.moveTo(18, 50); x.lineTo(82, 50); x.moveTo(24, 34); x.lineTo(76, 34); x.moveTo(24, 66); x.lineTo(76, 66); x.stroke(); },
  expertises(x) { for (const [a, b] of [[20, 20], [55, 20], [20, 55], [55, 55]]) { rr(x, a, b, 25, 25, 6); x.stroke(); } },
  cinema(x) { rr(x, 14, 24, 72, 52, 8); x.stroke(); x.beginPath(); x.moveTo(43, 38); x.lineTo(62, 50); x.lineTo(43, 62); x.closePath(); x.fill(); },
  chiffres(x) { x.beginPath(); x.moveTo(18, 82); x.lineTo(82, 82); x.stroke(); for (const [X, H] of [[26, 22], [44, 38], [62, 54]]) { rr(x, X, 80 - H, 12, H, 3); x.fill(); } x.beginPath(); x.moveTo(24, 44); x.lineTo(44, 30); x.lineTo(58, 36); x.lineTo(80, 18); x.stroke(); },
  golden(x) { x.beginPath(); x.arc(50, 62, 18, Math.PI, 0); x.stroke(); x.beginPath(); x.moveTo(16, 64); x.lineTo(84, 64); x.stroke(); for (let a = -150; a <= -30; a += 30) { const r = a * Math.PI / 180; x.beginPath(); x.moveTo(50 + 26 * Math.cos(r), 62 + 26 * Math.sin(r)); x.lineTo(50 + 34 * Math.cos(r), 62 + 34 * Math.sin(r)); x.stroke(); } x.beginPath(); x.moveTo(30, 76); x.lineTo(70, 76); x.stroke(); },
  day(x) { x.beginPath(); x.arc(50, 50, 16, 0, 7); x.stroke(); for (let a = 0; a < 360; a += 45) { const r = a * Math.PI / 180; x.beginPath(); x.moveTo(50 + 24 * Math.cos(r), 50 + 24 * Math.sin(r)); x.lineTo(50 + 33 * Math.cos(r), 50 + 33 * Math.sin(r)); x.stroke(); } },
  night(x) { x.beginPath(); x.arc(52, 50, 28, Math.PI * 0.32, Math.PI * 1.68); x.arc(66, 42, 22, Math.PI * 1.45, Math.PI * 0.55, true); x.closePath(); x.stroke(); for (const [a, b] of [[76, 24], [82, 62]]) { x.beginPath(); x.arc(a, b, 3, 0, 7); x.fill(); } },
  music(x) { x.beginPath(); x.moveTo(40, 72); x.lineTo(40, 26); x.lineTo(74, 18); x.lineTo(74, 64); x.stroke(); x.beginPath(); x.ellipse(32, 72, 9, 7, -0.4, 0, 7); x.fill(); x.beginPath(); x.ellipse(66, 64, 9, 7, -0.4, 0, 7); x.fill(); },
  mute(x) { ICONS.music(x); x.strokeStyle = "#ff8a7a"; x.lineWidth = 7; x.beginPath(); x.moveTo(20, 20); x.lineTo(82, 82); x.stroke(); },
};
const AMB_NEXT = { golden: "day", day: "night", night: "golden" };
const AMB_LABEL = { golden: "Coucher de soleil", day: "Plein jour", night: "Nuit étoilée" };

export function createDock({ scene, camera, renderer, zones, getAmbiance, onZone, onAmbiance, onMusic, getMusic }) {
  const group = new THREE.Group(); group.visible = false; scene.add(group);
  const items = [
    ...zones.map((z) => ({ key: z.key, label: z.dock, kind: "zone", icon: z.key, az: z.az })),
    { kind: "sep" },
    { key: "ambiance", kind: "tool", label: () => `Ambiance : ${AMB_LABEL[getAmbiance()]}`, icon: () => getAmbiance() },
    { key: "music", kind: "tool", label: () => (getMusic() ? "Couper la musique" : "Activer la musique"), icon: () => (getMusic() ? "music" : "mute") },
  ];
  const B = 112, GAP = 14, SEP = 30, W = items.reduce((s, it) => s + (it.kind === "sep" ? SEP : B + GAP), 0) + 36, H = 150;
  const bg = canvasPlane(W, H, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "rgba(22,52,80,0.86)"); g.addColorStop(1, "rgba(8,22,38,0.92)");
    rr(x, 2, 2, w - 4, h - 4, (h - 4) / 2); x.fillStyle = g; x.fill();
    x.lineWidth = 2.5; x.strokeStyle = "rgba(142,230,228,0.55)"; x.stroke();
    const shine = x.createLinearGradient(0, 0, 0, h * 0.5); shine.addColorStop(0, "rgba(255,255,255,0.12)"); shine.addColorStop(1, "rgba(255,255,255,0)");
    rr(x, 6, 6, w - 12, h * 0.45, h * 0.22); x.fillStyle = shine; x.fill();
  });
  bg.renderOrder = 60; group.add(bg);
  const targets = [];
  let cx = -W / 2 + 18 + B / 2, active = null;
  for (const it of items) {
    if (it.kind === "sep") { // thin divider
      const d = new THREE.Mesh(new THREE.PlaneGeometry(2 * PX, 70 * PX), new THREE.MeshBasicMaterial({ color: 0x8ee6e4, transparent: true, opacity: 0.35, depthWrite: false, toneMapped: false }));
      d.position.set((cx - B / 2 - GAP / 2 + SEP / 2) * PX, 0, 0.002); d.renderOrder = 61; group.add(d); cx += SEP; continue;
    }
    const btn = canvasPlane(B, B, (x, w, h, me) => {
      const hov = me.userData.hover, act = it.kind === "zone" && active === it.key;
      x.beginPath(); x.arc(w / 2, h / 2, w / 2 - 4, 0, 7);
      x.fillStyle = hov ? "rgba(42,181,180,0.95)" : act ? "rgba(42,181,180,0.32)" : "rgba(255,255,255,0.07)"; x.fill();
      if (act && !hov) { x.lineWidth = 3; x.strokeStyle = "rgba(142,230,228,0.9)"; x.stroke(); }
      x.save(); x.translate(w / 2 - 34, h / 2 - 34); x.scale(0.68, 0.68);
      x.strokeStyle = x.fillStyle = hov ? "#ffffff" : "#c9f4f2"; x.lineWidth = 7; x.lineCap = x.lineJoin = "round";
      ICONS[typeof it.icon === "function" ? it.icon() : it.icon](x); x.restore();
    });
    btn.position.set(cx * PX, 0, 0.004); btn.renderOrder = 62; group.add(btn);
    btn.userData.item = it; btn.userData.base = btn.position.clone();
    btn.userData.onClick = () => {
      if (it.kind === "zone") onZone(it.key);
      else if (it.key === "ambiance") onAmbiance(AMB_NEXT[getAmbiance()]);
      else if (it.key === "music") onMusic(!getMusic());
      for (const t of targets) t.userData.redraw();
      tip.userData.redraw();
    };
    targets.push(btn); cx += B + GAP;
  }
  // tooltip above the hovered button
  let tipText = "";
  const tip = canvasPlane(460, 70, (x, w, h) => {
    if (!tipText) return;
    x.font = "600 30px system-ui, sans-serif"; const tw = Math.min(w - 8, x.measureText(tipText).width + 44);
    rr(x, (w - tw) / 2, 6, tw, h - 12, (h - 12) / 2); x.fillStyle = "rgba(8,22,38,0.94)"; x.fill(); x.lineWidth = 2; x.strokeStyle = "rgba(142,230,228,0.7)"; x.stroke();
    x.fillStyle = "#fff"; x.textAlign = "center"; x.fillText(tipText, w / 2, h / 2 + 10);
  });
  tip.renderOrder = 63; tip.visible = false; group.add(tip);
  // active-zone dot under the button of the zone you face
  const dot = new THREE.Mesh(new THREE.CircleGeometry(5 * PX, 16), new THREE.MeshBasicMaterial({ color: 0x8ee6e4, toneMapped: false, depthWrite: false, transparent: true }));
  dot.renderOrder = 63; group.add(dot);

  const head = new THREE.Vector3(), dir = new THREE.Vector3();
  let yaw = null, show = 0;
  const api = {
    group, targets,
    visible: false,
    update(dt, t) {
      show = Math.min(1, Math.max(0, show + (api.visible ? dt * 2.5 : -dt * 4)));
      group.visible = show > 0.001;
      const xr = renderer.xr.isPresenting, cam = xr ? renderer.xr.getCamera() : camera;
      cam.getWorldPosition(head); cam.getWorldDirection(dir);
      const want = Math.atan2(dir.x, -dir.z); // azimuth the visitor faces
      if (yaw === null) yaw = want;
      let d = Math.atan2(Math.sin(want - yaw), Math.cos(want - yaw));
      if (Math.abs(d) > 0.6 || show < 0.05) yaw += d * Math.min(1, dt * (show < 0.05 ? 30 : 3)); // lazy follow
      const dist = xr ? 0.6 : 0.95, drop = xr ? 0.44 : 0.4;
      const e = 1 - Math.pow(1 - show, 3);
      group.position.set(head.x + Math.sin(yaw) * dist, head.y - drop - (1 - e) * 0.12, head.z - Math.cos(yaw) * dist);
      group.lookAt(head.x, head.y - 0.05, head.z);
      group.scale.setScalar(0.85 + 0.15 * e);
      for (const o of group.children) if (o.material) o.material.opacity = e * (o === dot ? 0.95 : 1);
      // which zone are you facing?
      const az = want * 180 / Math.PI; let best = null, bd = 50;
      for (const it of items) if (it.kind === "zone") { const dd = Math.abs(((az - it.az + 540) % 360) - 180); if (dd < bd) { bd = dd; best = it.key; } }
      if (best !== active) { active = best; for (const b of targets) b.userData.redraw(); }
      // hover: swell + label
      let hov = null;
      for (const b of targets) {
        const k = b.userData.hover ? 1.28 : 1, s = b.scale.x + (k - b.scale.x) * Math.min(1, dt * 14);
        b.scale.setScalar(s); b.position.z = b.userData.base.z + (s - 1) * 0.02;
        if (b.userData.hover) hov = b;
      }
      const label = hov ? (typeof hov.userData.item.label === "function" ? hov.userData.item.label() : hov.userData.item.label) : "";
      if (label !== tipText) { tipText = label; tip.userData.redraw(); }
      tip.visible = !!hov; if (hov) tip.position.set(hov.position.x, 112 * PX, 0.01);
      const ab = targets.find((b) => b.userData.item.key === active);
      dot.visible = !!ab; if (ab) dot.position.set(ab.position.x, -72 * PX, 0.006);
    },
  };
  return api;
}
