/* =====================================================
   common.js · núcleo compartido por index.html y juegos.html
   (estado, XP, medallas, niños ilustrados, confeti, HUD)
   ===================================================== */
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)]
const esc = t =>
  String(t).replace(
    /[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])
  )
const shuffle = a => a.sort(() => Math.random() - 0.5)
document.documentElement.classList.add('js')

/* ===== Estado (localStorage seguro) ===== */
let S = { xp: 0, done: {}, streak: 1, last: '', av: 0, dxp: 0, dday: '' }
try {
  S = Object.assign(S, JSON.parse(localStorage.getItem('conjuntosXP') || '{}'))
} catch (e) {}
const save = () => {
  try {
    localStorage.setItem('conjuntosXP', JSON.stringify(S))
  } catch (e) {}
}
const today = new Date().toDateString()
if (S.last !== today) {
  const y = new Date(Date.now() - 864e5).toDateString()
  S.streak = S.last === y ? S.streak + 1 : 1
  S.last = today
  save()
}
if (S.dday !== today) {
  S.dday = today
  S.dxp = 0
  save()
}
const IDX = /juegos\.html$/.test(location.pathname) ? 'index.html' : ''
const MISSION = 40

/* ===== Niños animados (SVG propio estilo caricatura, sin derechos de autor) ===== */
const BODY =
  '<path d="M14 120c0-24 14-34 36-34s36 10 36 34z" fill="currentColor"/><path d="M41 87l9 9 9-9z" fill="#fff"/>'
const HEAD =
  '<rect x="44" y="76" width="12" height="14" rx="5" fill="var(--skin)"/><circle cx="19" cy="52" r="5.5" fill="var(--skin)"/><circle cx="81" cy="52" r="5.5" fill="var(--skin)"/><ellipse cx="50" cy="48" rx="31" ry="29" fill="var(--skin)"/>'
const EYES =
  '<ellipse cx="38" cy="50" rx="7" ry="8.5" fill="#fff" stroke="#222" stroke-width="2"/><circle cx="39" cy="51.5" r="4.6" fill="#3b2314"/><circle cx="40.8" cy="49.2" r="1.7" fill="#fff"/><ellipse cx="62" cy="50" rx="7" ry="8.5" fill="#fff" stroke="#222" stroke-width="2"/><circle cx="61" cy="51.5" r="4.6" fill="#3b2314"/><circle cx="62.8" cy="49.2" r="1.7" fill="#fff"/><path d="M30 38q8-5 15-1M55 37q7-4 15 1" stroke="#222" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="27" cy="63" rx="5" ry="3.2" fill="#ff8aa0" opacity=".55"/><ellipse cx="73" cy="63" rx="5" ry="3.2" fill="#ff8aa0" opacity=".55"/><path d="M42 64q8 12 16 0z" fill="#b8323f" stroke="#222" stroke-width="2" stroke-linejoin="round"/><ellipse cx="50" cy="69.5" rx="3.4" ry="1.7" fill="#ff8aa0"/>'
const BANGS =
  '<path d="M20 50c1-18 12-28 30-28s29 10 30 28c-10-3-18-11-22-17-6 9-20 16-38 17z" fill="var(--hair)"/>'
const symb = (id, back, front) =>
  `<symbol id="${id}" viewBox="0 0 100 120">${back}${BODY}${HEAD}${EYES}${front}</symbol>`
document.body.insertAdjacentHTML(
  'afterbegin',
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${
    // niño: cabello corto con mechón
    symb(
      'kid',
      '',
      '<path d="M18 48C13 20 32 8 52 10c19 2 32 14 30 38-4-10-8-17-16-20-10 7-26 9-38 3-5 4-8 10-10 17z" fill="var(--hair)"/><path d="M46 12c0-9 11-11 16-5-7-1-10 1-11 5z" fill="var(--hair)"/>'
    ) +
    // niña: cabello corto con moño rojo
    symb(
      'kidg',
      '<path d="M15 50C12 24 28 8 50 8s38 16 35 42c-1 12 2 20 4 26-9 3-17-1-19-9H30c-2 8-10 12-19 9 2-6 5-14 4-26z" fill="var(--hair)"/>',
      BANGS +
        '<path d="M26 18l-14-7v15zM26 18l14-7v15z" fill="#e8467c"/><circle cx="26" cy="18" r="4" fill="#c2255c"/>'
    ) +
    // niña: cola de caballo y cinta naranja
    symb(
      'kidp',
      '<path d="M68 14c6-10 22-8 22 6 0 8-6 12-12 12 3-5 1-10-10-18z" fill="var(--hair)"/>',
      BANGS +
        '<path d="M19 40Q50 14 81 40" stroke="#f5a623" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="70" cy="16" r="3.5" fill="#e8467c"/>'
    ) +
    // niña: cabello largo y cinta azul
    symb(
      'kidl',
      '<path d="M14 54C10 24 28 8 50 8s40 16 36 46c-1 16 4 28 6 34-12 6-22 0-24-12H32c-2 12-12 18-24 12 2-6 7-18 6-34z" fill="var(--hair)"/>',
      BANGS +
        '<path d="M19 38Q50 12 81 38" stroke="#7cc8ff" stroke-width="6" fill="none" stroke-linecap="round"/>'
    )
  }</defs></svg>`
)
// [piel, cabello, camiseta, tipo]
const AV = [
  ['#f2c9a0', '#3b2314', '#7b4dff', 'kid'],
  ['#c68642', '#1a1a1a', '#e8467c', 'kidg'],
  ['#8d5524', '#111111', '#1fb58f', 'kidp'],
  ['#ffdbac', '#a0522d', '#f5a623', 'kidl'],
  ['#e0ac69', '#5a3825', '#3b82f6', 'kid'],
  ['#f1c27d', '#e5b92e', '#d35400', 'kidp']
]
const kidSvg = (i, cls = '') => {
  const a = AV[((i % AV.length) + AV.length) % AV.length]
  return `<svg class="kid ${cls}" viewBox="0 0 100 120" style="--skin:${a[0]};--hair:${a[1]};color:${a[2]}" aria-hidden="true"><use href="#${a[3]}"/></svg>`
}
const sceneKid = (i, tx, ty, s, extra, front) => {
  const a = AV[i % AV.length]
  return `<g transform="translate(${tx},${ty}) scale(${s})" style="--skin:${a[0]};--hair:${a[1]};color:${a[2]}">${extra}<use href="#${a[3]}" width="100" height="120"/>${front}</g>`
}
const wave = (x0, x1) =>
  `<path d="M${x0} 104C${
    x0 + (x1 - x0) / 3
  } 92 ${x1} 76 ${x1} 60" stroke="var(--skin)" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="${x1}" cy="58" r="8" fill="var(--skin)"/>`
/* Escenas: «school» (niña y niño saludando) y «read» (dos niñas leyendo) */
const scene = type => {
  if (type === 'read')
    return (
      '<svg class="scene" viewBox="0 0 300 200" role="img" aria-label="Dos niñas leyendo un libro abierto">' +
      sceneKid(1, 30, 4, 1.25, '', '') +
      sceneKid(2, 145, 4, 1.25, '', '') +
      '<path d="M30 160Q90 138 150 162V198Q90 176 30 198Z" fill="#fff" stroke="#333" stroke-width="3" stroke-linejoin="round"/><path d="M270 160Q210 138 150 162V198Q210 176 270 198Z" fill="#fff" stroke="#333" stroke-width="3" stroke-linejoin="round"/><path d="M50 172q40-10 90 6M50 184q40-10 90 6M250 172q-40-10-90 6M250 184q-40-10-90 6" stroke="#9aa" stroke-width="2" fill="none"/></svg>'
    )
  return (
    '<svg class="scene" viewBox="0 0 300 200" role="img" aria-label="Una niña y un niño saludando camino a la escuela"><ellipse cx="150" cy="192" rx="120" ry="7" fill="#0002"/>' +
    sceneKid(
      3,
      25,
      44,
      1.2,
      '<rect x="-6" y="88" width="26" height="30" rx="9" fill="#e8467c"/>',
      wave(18, 6)
    ) +
    sceneKid(
      0,
      155,
      44,
      1.2,
      '<rect x="80" y="88" width="26" height="30" rx="9" fill="#1fb58f"/>',
      wave(82, 94)
    ) +
    '</svg>'
  )
}
/* Si una imagen por enlace web no carga, se cambia por niños animados */
window.fb = img => {
  if (!img || !img.parentNode) return
  if (img.dataset.scene) {
    const t = document.createElement('template')
    t.innerHTML = scene(img.dataset.scene)
    img.replaceWith(t.content.firstChild)
    return
  }
  const k = +img.dataset.k || 0
  const d = document.createElement('div')
  d.className = 'fbk'
  d.setAttribute('role', 'img')
  d.setAttribute('aria-label', img.alt || '')
  d.innerHTML =
    kidSvg(k) +
    kidSvg(k + 1) +
    kidSvg(k + 2) +
    '<span>' +
    esc(img.dataset.fb || img.alt || '') +
    '</span>'
  img.replaceWith(d)
}
$$('img[data-fb],img[data-scene]').forEach(i => {
  if (i.complete && i.naturalWidth === 0) fb(i)
})
$$('[data-kid]').forEach(e => (e.innerHTML = kidSvg(+e.dataset.kid)))
$$('[data-kids]').forEach(
  e =>
    (e.innerHTML = e.dataset.kids
      .split(',')
      .map(n => kidSvg(+n))
      .join(''))
)

/* ===== Insignias ===== */
const BADGES = [
  ['first', '🌱', 'Primer paso', 'Gana 10 XP', () => S.xp >= 10],
  [
    'explorer',
    '🧭',
    'Explorador',
    'Abre los 6 temas del marco teórico',
    () => [0, 1, 2, 3, 4, 5].every(i => S.done['d' + i])
  ],
  ['hist', '📜', 'Historiador', 'Visita Personajes', () => S.done.s_historia],
  [
    'proof',
    '🔬',
    'Demostrador',
    'Abre ambos niveles de la Brújula',
    () => S.done.p0 && S.done.p1
  ],
  ['memory', '🃏', 'Memoria de acero', 'Gana la memoria', () => S.done.mem],
  ['quiz', '🎓', 'Mente lógica', '7 o más en Verdadero/Falso', () => S.done.qp],
  ['calc', '🧮', 'Calculista', 'Usa la calculadora', () => S.done.calc],
  [
    'venn',
    '🔵',
    'Cazador de regiones',
    '5 o más en el Reto Venn',
    () => S.done.vq
  ],
  [
    'retos',
    '🏆',
    'Retador',
    'Resuelve los 2 retos',
    () => S.done.r1 && S.done.r2
  ],
  [
    'regiones',
    '🗺️',
    'Cartógrafo de Venn',
    '5 o más en Selecciona las regiones',
    () => S.done.vr
  ],
  [
    'mision',
    '🎯',
    'Misionero',
    'Cumple la misión del día',
    () => Object.keys(S.done).some(k => k.startsWith('m_'))
  ],
  ['master', '👑', 'Maestro de Cantor', 'Llega a 300 XP', () => S.xp >= 300]
]
const TITLES = [
  'Aprendiz',
  'Explorador',
  'Conjuntista',
  'Lógico',
  'Matemático',
  'Maestro de Cantor'
]
const lvl = () => Math.floor(S.xp / 100)

/* ===== Confeti ===== */
const cv = document.body.appendChild(
  Object.assign(document.createElement('canvas'), { id: 'cv' })
)
const cx = cv.getContext('2d')
let P = [],
  run = false
function confetti (n = 90, x = innerWidth / 2, y = innerHeight / 2) {
  for (let i = 0; i < n; i++)
    P.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 2,
      c: `hsl(${Math.random() * 360},90%,60%)`,
      s: 4 + Math.random() * 6,
      l: 90
    })
  if (!run) {
    run = true
    cv.width = innerWidth
    cv.height = innerHeight
    loop()
  }
}
function loop () {
  cx.clearRect(0, 0, cv.width, cv.height)
  P = P.filter(p => p.l-- > 0)
  P.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.35
    cx.fillStyle = p.c
    cx.fillRect(p.x, p.y, p.s, p.s)
  })
  P.length
    ? requestAnimationFrame(loop)
    : ((run = false), cx.clearRect(0, 0, cv.width, cv.height))
}

/* ===== HUD y toasts ===== */
document.body.insertAdjacentHTML(
  'beforeend',
  `<div id="toasts"></div><div id="hud">${
    IDX ? '<a href="index.html" title="Volver al inicio">🏠</a>' : ''
  }<a id="hav" href="${IDX}#logros" title="Mi avatar y medallas"></a><span>⭐ <b id="lv"></b></span><span class="bar"><i id="xpb"></i></span><span id="xpt"></span><span title="Días seguidos">🔥 <b id="stk"></b></span><a href="${IDX}#logros" title="Mis medallas">🏅</a></div>`
)
function toast (t, big) {
  const d = Object.assign(document.createElement('div'), {
    className: 'toast' + (big ? ' big' : ''),
    innerHTML: t
  })
  $('#toasts').append(d)
  setTimeout(() => d.remove(), 3600)
}
function hud () {
  $('#lv').textContent =
    'Nv ' + (lvl() + 1) + ' · ' + TITLES[Math.min(lvl(), 5)]
  $('#xpb').style.width = (S.xp % 100) + '%'
  $('#xpt').textContent = S.xp + ' XP'
  $('#stk').textContent = S.streak
  $('#hav').innerHTML = kidSvg(S.av, 'sm')
  $$('.bd').forEach(b =>
    b.classList.toggle('on', !!S.done['b_' + b.dataset.id])
  )
  $$('.avb').forEach(b => b.classList.toggle('on', +b.dataset.i === S.av))
  const m = $('#mis')
  if (m)
    m.innerHTML = S.done['m_' + today]
      ? '🎯 ¡Misión del día cumplida! Vuelve mañana para otra.'
      : `🎯 Misión del día: gana ${MISSION} XP hoy (${Math.min(
          S.dxp,
          MISSION
        )}/${MISSION}) y recibe +20 XP extra`
}
function award (id, xp, msg) {
  if (S.done[id]) return false
  const before = lvl()
  S.done[id] = 1
  S.xp += xp
  S.dxp = (S.dxp || 0) + xp
  toast('+' + xp + ' XP ' + (msg || '✨'))
  if (S.dxp >= MISSION && !S.done['m_' + today]) {
    S.done['m_' + today] = 1
    S.xp += 20
    toast('🎯 ¡Misión del día cumplida! +20 XP', 1)
    confetti(100)
  }
  if (lvl() > before) {
    toast('🎉 ¡Subiste al nivel ' + (lvl() + 1) + '!', 1)
    confetti(140)
  }
  BADGES.forEach(b => {
    if (!S.done['b_' + b[0]] && b[4]()) {
      S.done['b_' + b[0]] = 1
      toast(b[1] + ' Medalla: ' + b[2], 1)
      confetti(120)
    }
  })
  save()
  hud()
  return true
}
