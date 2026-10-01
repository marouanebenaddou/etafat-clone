// Builds the VR cast and props from CC0 (public domain) Quaternius models hosted on Poly Pizza.
// Keeps only the animations the scene uses, prunes/dedups, writes public/xr/models/*.glb.
//   worker.glb   — "Worker" by Quaternius, CC0            (https://poly.pizza/m/Yg2bQZO6Hj)
//   woman.glb    — "Animated Woman" by Quaternius, CC0    (https://poly.pizza/m/qJ2gsTUBHL)
//   guide.glb    — "Business Man" by Quaternius, CC0      (https://poly.pizza/m/JFrLIKqvCH)  → the ETAFAT host
//   casual.glb   — "Casual Character" by Quaternius, CC0  (https://poly.pizza/m/kZ3DmIoGip)  → data engineer
//   woman3.glb   — "Animated Woman" by Quaternius, CC0    (https://poly.pizza/m/nIItLV9nxS)
//   suv.glb      — "SUV" by Quaternius, CC0               (https://poly.pizza/m/xsMtZhBkxL)  → mobile-mapping vehicle
//   tent.glb     — "Tent" by Quaternius, CC0              (https://poly.pizza/m/5Q7qIrfDxA)
//   solar.glb    — "Solar Panel" by Quaternius, CC0       (https://poly.pizza/m/ah89Y79JdT)
//   antenna.glb  — "Roof Antenna" by Quaternius, CC0      (https://poly.pizza/m/Fbdg52kqJ6)
// The characters share the same 62-bone "CharacterArmature" rig and animation names.
import { NodeIO } from "@gltf-transform/core";
import { prune, dedup } from "@gltf-transform/functions";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/xr/models");
const KEEP = new Set(["Idle", "Idle_Neutral", "Walk", "Interact", "Wave", "Idle_Gun_Pointing"]);
const CAST = [
  { file: "worker.glb", url: "https://static.poly.pizza/3a5f3056-ffe6-42eb-bd52-122afcbd22b2.glb" },
  { file: "woman.glb", url: "https://static.poly.pizza/ba7a1955-ea51-4cb9-a561-188bdef0a6c7.glb" },
  { file: "guide.glb", url: "https://static.poly.pizza/e599abbe-7d73-488c-9d7e-3ead281e705c.glb" },
  { file: "casual.glb", url: "https://static.poly.pizza/90a9e2d4-053f-42f1-99a2-8f5e1180ea7f.glb" },
  { file: "woman3.glb", url: "https://static.poly.pizza/46d6db5a-3c9f-4238-8cdf-8eb7194498dc.glb" },
  { file: "suv.glb", url: "https://static.poly.pizza/e5fbf2ee-5c9e-47d5-8ab6-80cacd463baa.glb" },
  { file: "tent.glb", url: "https://static.poly.pizza/fc8d560d-91b5-439c-88bf-4cbddb7eadbb.glb" },
  { file: "solar.glb", url: "https://static.poly.pizza/7a7d151e-b40a-4f5f-9372-7d5c9fb18072.glb" },
  { file: "antenna.glb", url: "https://static.poly.pizza/f11fe705-f599-4b9f-8a1b-3b1fb81b40a6.glb" },
];

await mkdir(OUT, { recursive: true });
const io = new NodeIO();
for (const c of CAST) {
  const res = await fetch(c.url, { headers: { "User-Agent": "ETAFAT-xr-build/1.0 (https://etafat-new.vercel.app)" } }); if (!res.ok) throw new Error(`${c.url} → ${res.status}`);
  const doc = await io.readBinary(new Uint8Array(await res.arrayBuffer()));
  for (const a of doc.getRoot().listAnimations()) {
    const short = a.getName().split("|").pop();
    if (KEEP.has(short)) a.setName(short); else a.dispose();
  }
  await doc.transform(prune(), dedup());
  const bin = await io.writeBinary(doc);
  await writeFile(join(OUT, c.file), bin);
  console.log(`✓ ${c.file}: ${(bin.byteLength / 1024).toFixed(0)} KB, anims: ${doc.getRoot().listAnimations().map((a) => a.getName()).join(", ")}`);
}
