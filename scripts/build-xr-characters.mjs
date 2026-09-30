// Builds the VR cast from CC0 (public domain) Quaternius characters hosted on Poly Pizza.
// Keeps only the animations the scene uses, prunes/dedups, writes public/xr/models/*.glb.
//   worker.glb — "Worker" by Quaternius, CC0  (https://poly.pizza/m/Yg2bQZO6Hj)
//   woman.glb  — "Animated Woman" by Quaternius, CC0 (https://poly.pizza/m/qJ2gsTUBHL)
// Both share the same 62-bone "CharacterArmature" rig and animation set.
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
];

await mkdir(OUT, { recursive: true });
const io = new NodeIO();
for (const c of CAST) {
  const res = await fetch(c.url); if (!res.ok) throw new Error(`${c.url} → ${res.status}`);
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
