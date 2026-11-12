// Generates the Ghuri brand SVGs + PNG previews.
import { writeFileSync, mkdirSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const out = process.argv[2]
mkdirSync(out, { recursive: true })

const C = {
  light: '#FF8A3D',
  mid: '#E8590C',
  deep: '#C2410C',
  dark: '#9A3412',
  pale: '#FFD8A8',
  ink: '#1C1917',
  paper: '#FAFAF9',
  night: '#14110F',
}

// ---- Kite mark, drawn in a 128x128 box -------------------------------------
// Upright kite, then rotated for motion. Four facets give a folded-paper look.
function kite({ tail = C.mid, bows = C.light, withTail = true } = {}) {
  // Local frame: body T(60,8) R(90,38) B(60,88) L(30,38); tail streams below B.
  const T = [60, 8], R = [90, 38], B = [60, 88], L = [30, 38], X = [60, 38]
  const p = (...pts) => pts.map((q) => q.join(',')).join(' ')
  const segs = [
    [B, [52, 98], [70, 104], [62, 114]],
    [[62, 114], [54, 124], [70, 130], [64, 140]],
  ]
  const at = ([a, b, c, d], t) => {
    const u = 1 - t
    return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k])
  }
  const bow = ([x, y]) =>
    `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l-6 -4 v8z M${x.toFixed(1)} ${y.toFixed(1)} l6 -4 v8z" fill="${bows}"/>`
  const d = `M${B} C${segs[0][1]} ${segs[0][2]} ${segs[0][3]} C${segs[1][1]} ${segs[1][2]} ${segs[1][3]}`
  return `
  <g transform="rotate(-14 60 60)">
    ${withTail ? `<path d="${d}" fill="none" stroke="${tail}" stroke-width="3.2" stroke-linecap="round"/>
    ${bow(at(segs[0], 0.55))}
    ${bow(at(segs[1], 0.5))}` : ''}
    <polygon points="${p(T, X, L)}" fill="${C.light}"/>
    <polygon points="${p(T, R, X)}" fill="${C.mid}"/>
    <polygon points="${p(L, X, B)}" fill="${C.deep}"/>
    <polygon points="${p(X, R, B)}" fill="${C.dark}"/>
  </g>`
}

const markSvg = (opts) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 148" fill="none"><g transform="translate(8 2)">${kite(opts)}</g>\n</svg>\n`

// ---- Wordmark: monoline lowercase "ghuri" ----------------------------------
// baseline 100, x-height 50, ascender 18, descender 128, stroke 14, round caps.
function wordPaths(color) {
  const x0 = 7, step = 82
  const g = x0, h = g + step, u = h + step, r = u + step, i = r + 59
  return `
  <g stroke="${color}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="${g + 25}" cy="75" r="25"/>
    <path d="M${g + 50} 50 V103 A25 25 0 0 1 ${g + 25} 128 A25 25 0 0 1 ${g + 3} 115"/>
    <path d="M${h} 18 V100 M${h} 100 V75 A25 25 0 0 1 ${h + 50} 75 V100"/>
    <path d="M${u} 50 V75 A25 25 0 0 0 ${u + 50} 75 M${u + 50} 50 V100"/>
    <path d="M${r} 100 V50 M${r} 76 A26 26 0 0 1 ${r + 27} 50"/>
    <path d="M${i} 50 V100"/>
  </g>
  <circle cx="${i}" cy="24" r="9" fill="${C.mid}"/>`
}
const WORD_W = 7 + 82 * 3 + 59 + 9 + 2 // 323, incl. the i dot

const wordmarkSvg = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 8 ${WORD_W + 2} 128" fill="none">${wordPaths(color)}\n</svg>\n`

// ---- Lockup: mark + wordmark -----------------------------------------------
function lockupSvg(color) {
  // mark 128 box scaled to ~150 tall, wordmark at native size
  const markScale = 1.4
  const gap = -16
  const mw = 128 * markScale
  const w = mw + gap + WORD_W
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(0)} 200" fill="none">
  <g transform="translate(0 2) scale(${markScale})">${kite()}</g>
  <g transform="translate(${(mw + gap).toFixed(1)} 22)">${wordPaths(color)}</g>
</svg>\n`
}

// ---- Avatar: square, for the GitHub org / npm --------------------------------
const avatarSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${C.night}"/>
  <g transform="translate(96 40) scale(2.9)">${kite({ tail: C.pale, bows: C.light })}</g>
</svg>\n`

// ---- Social preview / README banner (1280x640) -------------------------------
function bannerSvg(theme) {
  const bg = theme === 'dark' ? C.night : C.paper
  const fg = theme === 'dark' ? C.paper : C.ink
  const sub = theme === 'dark' ? '#A8A29E' : '#57534E'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640">
  <rect width="1280" height="640" fill="${bg}"/>
  <g transform="translate(250 92) scale(1.45)">
    <g transform="scale(1.4)">${kite()}</g>
    <g transform="translate(156 22)">${wordPaths(fg)}</g>
  </g>
  <text x="640" y="490" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="44" font-weight="600" fill="${fg}">Django for TypeScript.</text>
  <text x="640" y="548" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="30" fill="${sub}">Cloudflare first, portable everywhere.</text>
</svg>\n`
}

// Favicon: kite body only, square box.
const faviconSvg = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 4 84 84">${kite({ withTail: false })}\n</svg>\n`

const files = {
  'favicon.svg': faviconSvg(),
  'mark.svg': markSvg(),
  'wordmark-light.svg': wordmarkSvg(C.ink),
  'wordmark-dark.svg': wordmarkSvg(C.paper),
  'logo-light.svg': lockupSvg(C.ink),
  'logo-dark.svg': lockupSvg(C.paper),
  'avatar.svg': avatarSvg(),
  'banner-light.svg': bannerSvg('light'),
  'banner-dark.svg': bannerSvg('dark'),
}
for (const [name, svg] of Object.entries(files)) writeFileSync(`${out}/${name}`, svg)

const png = (svgName, pngName, width, bg) => {
  const r = new Resvg(files[svgName], {
    fitTo: { mode: 'width', value: width },
    background: bg,
    font: { loadSystemFonts: true, defaultFontFamily: 'Inter' },
  })
  writeFileSync(`${out}/${pngName}`, r.render().asPng())
}
png('avatar.svg', 'avatar.png', 512)
png('banner-light.svg', 'social-preview.png', 1280)
png('banner-dark.svg', 'banner-dark.png', 1280)
png('logo-light.svg', 'logo-light.png', 800, '#ffffff')
png('logo-dark.svg', 'logo-dark.png', 800, '#0d1117')
png('mark.svg', 'mark.png', 256, '#ffffff')
png('favicon.svg', 'favicon-64.png', 64, '#ffffff')
console.log('ok')
