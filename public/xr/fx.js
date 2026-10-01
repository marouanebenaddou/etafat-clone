// ETAFAT VR — feel: music + UI sounds (one Web Audio graph shared with the cinema's positional audio),
// controller haptics, tracked hands drawn Quest-style (translucent + glowing outline), fades to black.
import * as THREE from "three";
import { XRHandModelFactory } from "./vendor/jsm/webxr/XRHandModelFactory.js";

export function createFX({ renderer, camera, rig, scene }) {
  // ── audio ────────────────────────────────────────────────────────────────────────────────────────
  // Two looped beds (Magnific / Google Lyria), crossfaded when the visitor changes room; they duck under films.
  //   ambient — the presentation: a quiet pad (Lyria 3, 27 s, −21 LUFS), each pass entering at a different
  //             point so the loop doesn't repeat audibly
  //   music   — the Cité portugaise: the standalone Cité viewer's track (Lyria 3 Pro, 172 s, −18.5 LUFS)
  const listener = new THREE.AudioListener(); camera.add(listener);
  const ctx = listener.context, out = listener.getInput();
  const sfxOut = ctx.createGain(); sfxOut.gain.value = 0.85; sfxOut.connect(out);
  const buf = {}, on = { music: true, sfx: true };
  let started = false, duck = false, alt = 0, lastHover = 0, track = "ambient";
  const TRACKS = {
    ambient: { vol: 0.3, from: [0, 6, 11, 3, 9], xfade: 6 },
    music: { vol: 0.42, from: [8], xfade: 6 },
  };
  const load = (n) => fetch(`./audio/${n}.mp3`).then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)).then((d) => (buf[n] = d));
  ["click", "select", "whoosh"].forEach((n) => load(n).catch(() => {}));
  for (const [k, T] of Object.entries(TRACKS)) { T.bus = ctx.createGain(); T.bus.gain.value = 0; T.bus.connect(out); T.n = 0; T.ready = null; }
  function pass(k, offset) {
    const T = TRACKS[k], b = buf[k]; if (!b) return;
    const src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = b; src.connect(g); g.connect(T.bus);
    const t = ctx.currentTime, dur = b.duration - offset, X = Math.min(T.xfade, dur / 3);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + (T.n ? X : 4));
    g.gain.setValueAtTime(1, t + dur - X); g.gain.linearRampToValueAtTime(0, t + dur);
    src.start(t, offset); T.n++;
    setTimeout(() => pass(k, T.from[T.n % T.from.length]), (dur - X) * 1000);
  }
  function startTrack(k) { // decoded and looped on first use only (the Cité track is 60 MB of PCM)
    const T = TRACKS[k];
    if (!T.ready) T.ready = load(k).then(() => pass(k, 0)).catch(() => null);
    return T.ready;
  }
  const gainFor = (k) => (on.music && k === track ? (duck ? 0.06 : TRACKS[k].vol) : 0);
  function mix(tc) { for (const k in TRACKS) TRACKS[k].bus.gain.setTargetAtTime(gainFor(k), ctx.currentTime, tc); }
  const fx = {
    listener, ctx, on,
    unlock() { // first gesture / entering VR: browsers keep audio locked until then
      if (ctx.state === "suspended") ctx.resume();
      if (started) return; started = true;
      startTrack(track).then(() => mix(0.8));
    },
    setTrack(k) { // "ambient" (presentation) or "music" (Cité): crossfade between the two beds
      if (k === track) return; track = k;
      if (started) startTrack(k).then(() => mix(1.2));
      mix(1.2);
    },
    setMusic(v) { on.music = v; mix(0.5); },
    duck(v) { duck = v; mix(0.6); },
    sfx(name, vol = 1) {
      if (!on.sfx || !buf[name] || ctx.state !== "running") return;
      const s = ctx.createBufferSource(), g = ctx.createGain();
      s.buffer = buf[name]; s.playbackRate.value = 0.96 + Math.random() * 0.08; g.gain.value = vol;
      s.connect(g); g.connect(sfxOut); s.start();
    },
    hover(ctrl) { // a barely-there glassy tick + the lightest vibration when the pointer lands on something new
      const now = performance.now(); if (now - lastHover < 90) return; lastHover = now;
      if (on.sfx && ctx.state === "running") {
        const t = ctx.currentTime, f = alt++ % 2 ? 1180 : 1320, o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
        o.type = "sine"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.72, t + 0.05);
        lp.type = "lowpass"; lp.frequency.value = 2400;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
        o.connect(lp); lp.connect(g); g.connect(sfxOut); o.start(t); o.stop(t + 0.09);
      }
      fx.haptic(ctrl, 0.06, 8);
    },
    click(ctrl, kind = "click") { fx.sfx(kind, kind === "select" ? 0.5 : 0.75); fx.haptic(ctrl, 0.45, 30); },
    haptic(ctrl, strength, ms) {
      const src = ctrl && ctrl.userData.source, act = src && src.gamepad && src.gamepad.hapticActuators && src.gamepad.hapticActuators[0];
      if (act && act.pulse) act.pulse(strength, ms).catch(() => {});
    },
  };

  // ── fades: a black sphere around the head (comfortable for turns and ambiance changes) ───────────
  const fader = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1, side: THREE.BackSide, depthTest: false, depthWrite: false, toneMapped: false }));
  fader.renderOrder = 1000; fader.frustumCulled = false; scene.add(fader);
  let fadeT = 1, fadeDir = -0.6, fadeFn = null; // start black, reveal (intro)
  const _cp = new THREE.Vector3();
  fx.blackout = (fn, speed = 6) => { fadeFn = fn; fadeDir = speed; };
  fx.reveal = (speed = 0.8) => { fadeT = 1; fadeDir = -speed; };
  fx.hold = () => { fadeT = 1; fadeDir = 0; }; // stay black (e.g. while the next room loads), until reveal()
  fx.fader = fader;                            // moved along with the visitor between scenes
  fx.update = (dt) => {
    if (fadeDir) {
      fadeT = Math.min(1, Math.max(0, fadeT + fadeDir * dt));
      if (fadeT === 1 && fadeDir > 0) { const f = fadeFn; fadeFn = null; fadeDir = -6; if (f) f(); }
      else if (fadeT === 0 && fadeDir < 0) fadeDir = 0;
    }
    fader.visible = fadeT > 0.001; fader.material.opacity = fadeT;
    camera.getWorldPosition(_cp); fader.position.copy(_cp);
  };

  // ── tracked hands: translucent fill with a rim glow + crisp teal silhouette (depth pre-pass + hull) ─
  function handMaterials() {
    const depth = new THREE.MeshBasicMaterial({ colorWrite: false });
    const hull = new THREE.MeshBasicMaterial({ color: 0x8ee6e4, side: THREE.BackSide, toneMapped: false });
    hull.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace("#include <skinning_vertex>", "#include <skinning_vertex>\n  transformed += normalize(objectNormal) * 0.0017;"); };
    hull.customProgramCacheKey = () => "hand-hull";
    const fill = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, depthFunc: THREE.LessEqualDepth, toneMapped: false });
    fill.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vRimN; varying vec3 vRimV;")
        .replace("#include <project_vertex>", "#include <project_vertex>\n  vRimN = normalize(transformedNormal); vRimV = -mvPosition.xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vRimN; varying vec3 vRimV;")
        .replace("#include <opaque_fragment>", "float rim = 1.0 - abs(dot(normalize(vRimN), normalize(vRimV)));\n  gl_FragColor = vec4(mix(vec3(0.04, 0.16, 0.24), vec3(0.56, 0.9, 0.89), pow(rim, 2.0)), 0.16 + pow(rim, 3.0) * 0.6);");
    };
    fill.customProgramCacheKey = () => "hand-fill";
    return { depth, hull, fill };
  }
  function outlineHand(object) {
    const mesh = object.getObjectByProperty("type", "SkinnedMesh"); if (!mesh) return;
    const m = handMaterials();
    mesh.material = m.fill; mesh.renderOrder = 52; mesh.castShadow = mesh.receiveShadow = false;
    for (const [mat, order] of [[m.depth, 50], [m.hull, 51]]) {
      const copy = new THREE.SkinnedMesh(mesh.geometry, mat);
      copy.position.copy(mesh.position); copy.quaternion.copy(mesh.quaternion); copy.scale.copy(mesh.scale);
      copy.bind(mesh.skeleton, mesh.bindMatrix); copy.renderOrder = order; copy.frustumCulled = false;
      mesh.parent.add(copy);
    }
  }
  const factory = new XRHandModelFactory(null, outlineHand).setPath("./vendor/hands/");
  const glow = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.3, "rgba(142,230,228,0.6)"); g.addColorStop(1, "rgba(42,181,180,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const hands = [], TIPS = ["thumb-tip", "index-finger-tip", "middle-finger-tip", "ring-finger-tip", "pinky-finger-tip"];
  for (let i = 0; i < 2; i++) { const hand = renderer.xr.getHand(i); hand.add(factory.createHandModel(hand, "mesh")); rig.add(hand); hands.push(hand); }
  fx.updateHands = (controllers) => { // fingertip glows (index brightens on pinch); lighter pointer rays for hands
    for (const hand of hands) {
      const j = hand.joints; if (!j || !j["index-finger-tip"]) continue;
      if (!hand.userData.tips) hand.userData.tips = TIPS.map((n) => {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        sp.renderOrder = 53; sp.scale.setScalar(n === "index-finger-tip" ? 0.016 : 0.011); j[n].add(sp); return sp;
      });
      const k = THREE.MathUtils.clamp((0.05 - j["thumb-tip"].position.distanceTo(j["index-finger-tip"].position)) / 0.035, 0, 1);
      hand.userData.tips[1].scale.setScalar(0.016 + k * 0.014); hand.userData.tips[0].scale.setScalar(0.011 + k * 0.008);
    }
    for (const c of controllers) { const src = c.userData.source; if (c.userData.ray) c.userData.ray.material.opacity = src && src.hand ? 0.28 : 0.6; }
  };
  return fx;
}
