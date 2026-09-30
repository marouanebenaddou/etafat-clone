// Builds one banner per ETAFAT country for the VR globe pop-ups: the country's flag, waving, dissolving
// diagonally into a photo of one of its landmarks. Sources (fetched at build time, kept offline after):
//   flags     — flagcdn.com (public-domain flags from Wikimedia)
//   landmarks — Wikimedia Commons, freely licensed files only (CC0 / PD / CC BY / CC BY-SA); author and
//               licence are printed on each banner and listed in public/xr/banners/credits.json.
// Usage: node scripts/build-xr-country-banners.mjs [iso …]   (no args = all)
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { existsSync } from "node:fs";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/xr/banners");
const UA = { "User-Agent": "ETAFAT-VR-banner-builder/1.0 (https://etafat-new.vercel.app)" };
const W = 1200, H = 400;
// the canvas default font has no accented glyphs (é, ç, ï…): use Arial when available (macOS)
const FONT_DIR = "/System/Library/Fonts/Supplemental/";
let BOLD = "sans-serif", REG = "sans-serif";
if (existsSync(FONT_DIR + "Arial Bold.ttf")) { GlobalFonts.registerFromPath(FONT_DIR + "Arial Bold.ttf", "BannerBold"); BOLD = "BannerBold"; }
if (existsSync(FONT_DIR + "Arial.ttf")) { GlobalFonts.registerFromPath(FONT_DIR + "Arial.ttf", "Banner"); REG = "Banner"; }

// iso → flag code, Commons file, French caption, crop focus (fx, fy in the photo; zoom)
const C = {
  504: { cc: "ma", file: "Sunshine on mosque Hassan II in Casablanca, Morocco - Flickr - Milamber's portfolio.jpg", cap: "Mosquée Hassan II · Casablanca" },
  384: { cc: "ci", file: "Basilique notre Dame de la Paix de Yamoussoukro 9.jpg", cap: "Basilique Notre-Dame de la Paix · Yamoussoukro" },
  686: { cc: "sn", file: "Côtes de l'île de Gorée au Sénégal 11.jpg", cap: "Île de Gorée · Dakar" },
  478: { cc: "mr", file: "مسجد شنقيط.jpg", cap: "Mosquée de Chinguetti" },
  324: { cc: "gn", file: "Grande Mosquée Fayçal de Conakry 3.jpg", cap: "Grande Mosquée Fayçal · Conakry" },
  624: { cc: "gw", file: "Bubaque Rubane view.jpg", cap: "Archipel des Bijagós · Bubaque" },
  854: { cc: "bf", file: "Moschee von Bobo-Dioulasso.jpg", cap: "Grande Mosquée de Bobo-Dioulasso" },
  178: { cc: "cg", file: "Habitats de Brazzaville (4).jpg", cap: "Basilique Sainte-Anne · Brazzaville" },
  148: { cc: "td", file: "Ourini Arch at sunset, Ennedi, Chad (40598172781).jpg", cap: "Arche d’Ourini · Ennedi" },
  788: { cc: "tn", file: "Amphitheater at El Djem.jpg", cap: "Amphithéâtre d’El Jem" },
  466: { cc: "ml", file: "Djenne great mud mosque.jpg", cap: "Grande Mosquée de Djenné" },
  430: { cc: "lr", file: "Robertsport Liberia.jpg", cap: "Plage de Robertsport" },
  288: { cc: "gh", file: "Cape Coast Castle, Cape Coast, Ghana.JPG", cap: "Château de Cape Coast" },
  768: { cc: "tg", file: "Tata Somba de Nadoba.jpg", cap: "Koutammakou · Pays batammariba" },
  566: { cc: "ng", file: "Zuma Rock Road.jpg", cap: "Zuma Rock · Niger State" },
  266: { cc: "ga", file: "Elephants in Lopé National Park.JPG", cap: "Parc national de la Lopé" },
  24: { cc: "ao", file: "Kalandula waterfalls of the Lucala-River in Malange, Angola.JPG", cap: "Chutes de Kalandula · Malanje" },
  180: { cc: "cd", file: "Nyiragongo volcano (30773604383).jpg", cap: "Volcan Nyiragongo · Nord-Kivu" },
  508: { cc: "mz", file: "Caminhos de Ferro de Mocambique, Railway Station in Maputo, Mozambique.jpg", cap: "Gare centrale de Maputo" },
  108: { cc: "bi", file: "Bujumbura Burundi Lac Tanganyika 23.jpg", cap: "Lac Tanganyika · Bujumbura" },
  250: { cc: "fr", file: "Eiffel Tower in 2022 02.jpg", cap: "Tour Eiffel · Paris" },
  300: { cc: "gr", file: "Acropolis Parthenon Athens Greece.jpg", cap: "Parthénon · Athènes" },
  634: { cc: "qa", file: "Doha Corniche Skyline View 2.jpg", cap: "Corniche de Doha" },
  784: { cc: "ae", file: "Burj Khalifa from a ferry, Dubai.jpg", cap: "Burj Khalifa · Dubaï" },
  682: { cc: "sa", file: "27, Hegra (Mada'in Salih), Saudi Arabia.jpg", cap: "Hégra (Mada’in Salih) · AlUla" },
  170: { cc: "co", file: "Sunset-cartagena-tower-dewired.jpg", cap: "Remparts de Carthagène des Indes" },
};
const FOCUS = { // where the landmark sits in its photo (0..1) and extra zoom, so it lands clear of the flag
  250: { fy: 0.3 }, 784: { fx: 0.5, fy: 0.55, z: 1.35 }, 504: { fy: 0.45 }, 170: { fx: 0.62 }, 686: { fy: 0.55 },
};

const strip = (html) => String(html || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
async function fetchBuf(url) { const r = await fetch(url, { headers: UA }); if (!r.ok) throw new Error(`${url} → ${r.status}`); return Buffer.from(await r.arrayBuffer()); }
async function commonsInfo(file) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1600&titles=${encodeURIComponent("File:" + file)}`;
  const j = await (await fetch(u, { headers: UA })).json(), ii = Object.values(j.query.pages)[0].imageinfo[0], m = ii.extmetadata;
  return { url: ii.thumburl || ii.url, page: ii.descriptionurl, artist: strip(m.Artist?.value).replace(/ from .*$/, ""), license: strip(m.LicenseShortName?.value), licenseUrl: m.LicenseUrl?.value || "" };
}

function waveFlag(flag) { // whole flag on the left (every stripe readable), waving in sine-shifted strips with fold shading
  const fh = H + 48, fw = Math.round(Math.min(fh * flag.width / flag.height, W * 0.62)), src = createCanvas(fw, fh), sx = src.getContext("2d");
  const s = Math.max(fw / flag.width, fh / flag.height); // exact fit for usual flags; very wide ones (Qatar…) lose a little of each side
  sx.drawImage(flag, (fw - flag.width * s) / 2, (fh - flag.height * s) / 2, flag.width * s, flag.height * s);
  const out = createCanvas(W, H), o = out.getContext("2d"), S = 3;
  for (let x = 0; x < fw; x += S) {
    const ph = x / 135 + 0.4, dy = 13 * Math.sin(ph) - 24, fold = Math.cos(ph);
    o.drawImage(src, x, 0, S, fh, x, dy, S, fh);
    o.fillStyle = fold > 0 ? `rgba(255,255,255,${(0.13 * fold).toFixed(3)})` : `rgba(0,0,0,${(-0.26 * fold).toFixed(3)})`;
    o.fillRect(x, dy, S, fh);
  }
  const g = o.createLinearGradient(fw - 230, H * 0.55, fw - 14, H * 0.4); // slanted dissolve into the photo, done before the flag's edge
  g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.45, "rgba(0,0,0,0.8)"); g.addColorStop(1, "rgba(0,0,0,0)");
  o.globalCompositeOperation = "destination-in"; o.fillStyle = g; o.fillRect(0, 0, W, H);
  return out;
}

async function build(iso) {
  const c = C[iso], f = FOCUS[iso] || {};
  const info = await commonsInfo(c.file);
  const [flag, photo] = await Promise.all([loadImage(await fetchBuf(`https://flagcdn.com/w1280/${c.cc}.png`)), loadImage(await fetchBuf(info.url))]);
  const cv = createCanvas(W, H), x = cv.getContext("2d");
  x.fillStyle = "#0a1e30"; x.fillRect(0, 0, W, H);
  // photo fills the right three quarters (cover), landmark kept in frame
  const px0 = W * 0.24, pw = W - px0, s = Math.max(pw / photo.width, H / photo.height) * (f.z || 1);
  const dw = photo.width * s, dh = photo.height * s;
  const ox = Math.min(0, Math.max(pw - dw, pw * 0.58 - (f.fx ?? 0.5) * dw)), oy = Math.min(0, Math.max(H - dh, H * 0.5 - (f.fy ?? 0.5) * dh));
  x.save(); x.beginPath(); x.rect(px0, 0, pw, H); x.clip(); x.drawImage(photo, px0 + ox, oy, dw, dh); x.restore();
  // unify the photo with the brand navy, then lay the waving flag over the left
  const tint = x.createLinearGradient(0, 0, W, 0); tint.addColorStop(0, "rgba(10,30,48,0.35)"); tint.addColorStop(1, "rgba(10,30,48,0.05)");
  x.fillStyle = tint; x.fillRect(0, 0, W, H);
  x.drawImage(waveFlag(flag), 0, 0);
  // bottom shade for the country name the VR card writes over the banner + a soft top vignette
  const bot = x.createLinearGradient(0, H * 0.42, 0, H); bot.addColorStop(0, "rgba(8,23,38,0)"); bot.addColorStop(1, "rgba(8,23,38,0.88)");
  x.fillStyle = bot; x.fillRect(0, 0, W, H);
  const top = x.createLinearGradient(0, 0, 0, H * 0.25); top.addColorStop(0, "rgba(8,23,38,0.35)"); top.addColorStop(1, "rgba(8,23,38,0)");
  x.fillStyle = top; x.fillRect(0, 0, W, H);
  // caption + credit (bottom-right)
  x.textAlign = "right"; x.shadowColor = "rgba(0,0,0,0.6)"; x.shadowBlur = 8;
  x.fillStyle = "#ffffff"; x.font = `28px ${BOLD}`; x.fillText(c.cap, W - 30, H - 50);
  x.fillStyle = "rgba(255,255,255,0.72)"; x.font = `16px ${REG}`;
  x.fillText(`Photo : ${info.artist} · ${info.license} · Wikimedia Commons`, W - 30, H - 24);
  x.shadowBlur = 0;
  await writeFile(join(OUT, `${iso}.jpg`), await cv.encode("jpeg", 84));
  return { iso: Number(iso), caption: c.cap, flag: `https://flagcdn.com/${c.cc}.svg`, photo: info.page, artist: info.artist, license: info.license, licenseUrl: info.licenseUrl };
}

await mkdir(OUT, { recursive: true });
const only = process.argv.slice(2);
const credPath = join(OUT, "credits.json");
const credits = JSON.parse(await readFile(credPath, "utf8").catch(() => "{}"));
for (const iso of Object.keys(C).filter((k) => !only.length || only.includes(k))) {
  try { credits[iso] = await build(iso); console.log(`✓ ${iso} ${C[iso].cap} — ${credits[iso].license}`); }
  catch (e) { console.log(`✗ ${iso}: ${e.message}`); }
}
await writeFile(credPath, JSON.stringify(credits, null, 1) + "\n");
