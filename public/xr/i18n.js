// ETAFAT VR — FR / EN. One switch for the whole experience (presentation + Cité room). Canvas panels draw
// their text through L(fr, en) / loc(obj) and redraw when the language changes (I18N.on). The choice is kept
// on the device; ?lang=en|fr in the URL overrides it.
const KEY = "etafat-vr-lang";
const read = () => {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "fr") return q;
  try { return localStorage.getItem(KEY) === "en" ? "en" : "fr"; } catch { return "fr"; }
};
let lang = read();
document.documentElement.lang = lang;
const listeners = new Set();

export const I18N = {
  get lang() { return lang; },
  set(l) {
    if (l === lang || (l !== "fr" && l !== "en")) return;
    lang = l; document.documentElement.lang = l;
    try { localStorage.setItem(KEY, l); } catch { /* private mode */ }
    for (const f of listeners) { try { f(l); } catch (e) { console.warn("i18n listener", e); } }
  },
  toggle() { I18N.set(lang === "en" ? "fr" : "en"); },
  on(f) { listeners.add(f); return () => listeners.delete(f); },
};

/** pick the string for the current language */
export const L = (fr, en) => (lang === "en" ? en : fr);
/** data object with an optional `en` overlay ({ label, tagline, … }) → localized copy */
export const loc = (o) => (lang === "en" && o && o.en ? { ...o, ...o.en } : o);
/** 475 900 (FR, regular no-break space every font has) / 475,900 (EN) */
export const num = (n) => (lang === "en" ? new Intl.NumberFormat("en-US").format(n) : new Intl.NumberFormat("fr-FR").format(n).replace(/[  ]/g, " "));
/** 59,5 % / 59.5% */
export const pct = (v) => (lang === "en" ? `${v.toFixed(1)}%` : `${v.toFixed(1).replace(".", ",")} %`);
/** plural helper: n + singular/plural word in the current language */
export const plural = (n, fr, frs, en, ens) => `${n} ${n > 1 ? L(frs, ens) : L(fr, en)}`;
