/* footer-bento — Karo (bento) ızgaralı footer (15 Kas 2026, G3 · mcp:webmaker/20261115-202336-i5p2).
   Yer tutucular (koşulsuz): bntsinif bnthakkinda bntcta bntsayfa bntiletisim bntsosyal bntyil. {{langbar}} motor; @anahtar@ lang.json.
   Karo yoksa basılmaz ve ızgara sınıfla yeniden dağılır (boş hücre kalmaz): iletişim/sosyal biri yoksa diğeri iki satır kaplar,
   ikisi de yoksa sayfa karosu genişler. Hakkında → setting.description; iletişim → setting; sosyal → wmSocialBar. */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};

const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const sayfa = page || {};

let maks = parseInt(des.maxpages, 10);
if (!Number.isFinite(maks)) maks = 8;
const ps = Array.isArray(webmakerdata?.pagesetting?.data)
  ? webmakerdata.pagesetting.data.find((it) => it?.modulestatus?.page)
  : null;
const satirlar = ps && Array.isArray(webmakerdata?.[ps.path]?.data) ? webmakerdata[ps.path].data : [];
const sayfalar = [{ ad: "@home@", href: wxLangInternalHref(""), aktif: !sayfa.path }];
for (const r of satirlar) {
  if (maks > 0 && sayfalar.length > maks) break;
  if (!r || r.status !== "play" || (r.category || "") !== "") continue;
  const ad = pick(r.name).trim();
  if (ad) sayfalar.push({ ad: esc(ad), href: wxLangInternalHref(r.pathnext || r.path || ""), aktif: !!sayfa.path && sayfa.path === r.path });
}
const bntSayfa = sayfalar.map((o) =>
  `<li><a class="modulex-bnt-link" href="${esc(o.href)}"${o.aktif ? ' aria-current="page"' : ""}>${o.ad}</a></li>`
).join("");

const hakkinda = pick(des.hakkinda).trim() || pick(setting.description).trim();
const bntHakkinda = hakkinda ? `<p class="modulex-bnt-hakkinda">${esc(hakkinda)}</p>` : "";

const ctaAd = pick(des.cta_ad).trim();
const ctaUrl = href(des.cta_url);
const bntCta = ctaAd && ctaUrl
  ? `<a class="modulex-bnt-cta" href="${esc(ctaUrl)}">${esc(ctaAd)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>`
  : "";

const tel = pick(des.tel).trim() || (typeof setting.phone === "string" ? setting.phone.trim() : "");
const posta = pick(des.eposta).trim() || (typeof setting.email === "string" ? setting.email.trim() : "");
const adres = pick(des.adres).trim() || pick(setting.address).trim();
const satir = (ikon, ic) => `<li><span class="material-symbols-outlined" aria-hidden="true">${ikon}</span>${ic}</li>`;
const iletisim = [
  tel ? satir("call", `<a class="modulex-bnt-link" href="tel:${tel.replace(/[^+\d]/g, "")}"><bdi dir="ltr">${esc(tel)}</bdi></a>`) : "",
  posta ? satir("mail", `<a class="modulex-bnt-link" href="mailto:${esc(posta)}"><bdi dir="ltr">${esc(posta)}</bdi></a>`) : "",
  adres ? satir("location_on", `<span class="modulex-bnt-adres">${esc(adres)}</span>`) : "",
].join("");
const bntIletisim = iletisim
  ? `<section class="modulex-bnt-karo modulex-bnt-iletisim"><h2 class="modulex-bnt-baslik">@contact-us@</h2><ul class="modulex-bnt-liste">${iletisim}</ul></section>`
  : "";

const sosyalIc = typeof wmSocialBar === "function"
  ? wmSocialBar({ liste: "modulex-bnt-sosyal", oge: "modulex-bnt-sosyal-li", baglanti: "modulex-bnt-sosyal-a", aria: "@follow-us@" })
  : "";
const bntSosyal = sosyalIc
  ? `<section class="modulex-bnt-karo modulex-bnt-sosyal-karo"><h2 class="modulex-bnt-baslik">@follow-us@</h2>${sosyalIc}</section>`
  : "";

const bntSinif = [
  bntIletisim ? "" : " modulex-bnt--iletisimsiz",
  bntSosyal ? "" : " modulex-bnt--sosyalsiz",
].join("");

html = html
  .replaceAll("{{bntsinif}}", () => bntSinif)
  .replaceAll("{{bnthakkinda}}", () => bntHakkinda)
  .replaceAll("{{bntcta}}", () => bntCta)
  .replaceAll("{{bntsayfa}}", () => bntSayfa)
  .replaceAll("{{bntiletisim}}", () => bntIletisim)
  .replaceAll("{{bntsosyal}}", () => bntSosyal)
  .replaceAll("{{bntyil}}", () => String(new Date().getFullYear()));
