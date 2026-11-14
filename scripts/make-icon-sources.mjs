// Renders the Benchmark Guides app mark (theme assets/app-icon.svg) into the source images
// @capacitor/assets needs, then `capacitor-assets generate` makes every Android and iOS size.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
const INK = "#16212B";
const mark = (tx, s) => `<g transform="translate(${tx} ${tx}) scale(${s})"><defs><clipPath id="ac"><rect x="-300" y="0" width="4000" height="100"/></clipPath></defs>` +
  `<g clip-path="url(#ac)" fill="none" stroke-width="12" stroke-miterlimit="10">` +
  `<path d="M0 6 H100" stroke="#C98B3E"/><path d="M1.15 112 L50 37.36 L98.85 112 M50 37.36 V112" stroke="#EDEFEA"/></g></g>`;
const svg = (size, inner, bg) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">` +
  (bg ? `<rect width="512" height="512" fill="${bg}"/>` : "") + inner + `</svg>`);

await mkdir(OUT, { recursive: true });
const png = (buf, name) => sharp(buf).png().toFile(join(OUT, name));
// Same proportions as the brand app icon: mark is 280 of 512 units, centred.
await png(svg(1024, mark(116, 2.8), INK), "icon-only.png");
// Android adaptive icon: foreground kept inside the 66% safe zone.
await png(svg(1024, mark(141, 2.3), null), "icon-foreground.png");
await png(svg(1024, "", INK), "icon-background.png");
// Splash: small mark centred on Datum Ink.
const splash = (size) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 2732 2732">` +
  `<rect width="2732" height="2732" fill="${INK}"/><g transform="translate(1186 1170)">${mark(0, 3.6)}</g></svg>`);
await png(splash(2732), "splash.png");
await png(splash(2732), "splash-dark.png");
console.log("icon sources written to assets/");
