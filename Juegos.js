/* =====================================================
   juegos.js · lógica de juegos.html (requiere common.js antes)
   ===================================================== */

/* ===== Memoria de símbolos ===== */
const PAR = [
  ['∈', 'Pertenece'],
  ['⊆', 'Subconjunto'],
  ['∪', 'Unión'],
  ['∩', 'Intersección'],
  ['∖', 'Diferencia'],
  ['∅', 'Vacío'],
  ['Aᶜ', 'Complemento'],
  ['∀', 'Para todo']
]
let sel = [],
  lock = false,
  moves = 0,
  found = 0
function memInit () {
  const cards = shuffle(
    PAR.flatMap((p, i) => [
      { k: i, t: p[0] },
      { k: i, t: p[1] }
    ])
  )
  sel = []
  moves = 0
  found = 0
  lock = false
  $('#mmsg').textContent = 'Movimientos: 0'
  $('#mem').innerHTML = cards
    .map(
      (c, i) =>
        `<button class="mc" data-k="${c.k}" data-t="${c.t}" aria-label="Carta ${
          i + 1
        }">?</button>`
    )
    .join('')
  $$('.mc').forEach(
    b =>
      (b.onclick = () => {
        if (lock || b.classList.contains('open') || b.classList.contains('ok'))
          return
        b.classList.add('open')
        b.textContent = b.dataset.t
        sel.push(b)
        if (sel.length < 2) return
        moves++
        lock = true
        const [a, c] = sel
        if (a.dataset.k === c.dataset.k) {
          ;[a, c].forEach(x => {
            x.className = 'mc ok'
          })
          found++
          sel = []
          lock = false
          $('#mmsg').textContent = 'Movimientos: ' + moves
          if (found === PAR.length) {
            $('#mmsg').innerHTML =
              '🎉 ¡Completado en ' +
              moves +
              ' movimientos! <button class="btn" onclick="memInit()">Jugar de nuevo</button>'
            confetti(160)
            award('mem', 50, '🃏 ¡Memoria completa!')
          }
        } else
          setTimeout(() => {
            ;[a, c].forEach(x => {
              x.className = 'mc'
              x.textContent = '?'
            })
            sel = []
            lock = false
            $('#mmsg').textContent = 'Movimientos: ' + moves
          }, 800)
      })
  )
}
memInit()

/* ===== Verdadero o Falso ===== */
const QS = shuffle([
  ['3 ∈ {1, 3, 5}', 1, 'Pertenencia: 3 es un elemento del conjunto.'],
  [
    '{3} ∈ {1, 3, 5}',
    0,
    'Correcto sería {3} ⊆ {1, 3, 5}: es conjunto contra conjunto.'
  ],
  [
    '∅ ⊆ A para cualquier conjunto A',
    1,
    'El vacío es subconjunto de todos los conjuntos.'
  ],
  ['{1, 2, 3} = {3, 2, 1}', 1, 'El orden no importa.'],
  ['(A ∪ B)ᶜ = Aᶜ ∪ Bᶜ', 0, 'De Morgan: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ.'],
  ['ℕ es un conjunto finito', 0, 'ℕ es infinito.'],
  ['∅ y {∅} son el mismo conjunto', 0, '∅ no tiene elementos; {∅} tiene uno.'],
  ['Un conjunto de 3 elementos tiene 8 subconjuntos', 1, '2³ = 8.'],
  [
    'A ∩ ∅ = ∅ para cualquier conjunto A',
    1,
    'No hay elementos comunes con un conjunto sin elementos.'
  ],
  ['ℤ ⊆ ℕ', 0, 'Es al revés: ℕ ⊆ ℤ. Por ejemplo, −3 ∈ ℤ pero −3 ∉ ℕ.']
])
let qi = 0,
  qs = 0
function qShow () {
  const q = $('#q')
  if (qi >= QS.length) {
    q.innerHTML = `<h3>🏁 Resultado: ${qs}/${QS.length}</h3><button class="btn" onclick="qi=0;qs=0;qShow()">Reintentar</button>`
    if (qs >= 7) {
      confetti(150)
      award('qp', 40, '🎓 ¡Mente lógica!')
    }
    return
  }
  q.innerHTML = `<p>Pregunta ${qi + 1}/${
    QS.length
  }</p><h3 style="font-family:Georgia,serif">${esc(
    QS[qi][0]
  )}</h3><button class="btn" style="background:var(--gr);color:#fff">Verdadero</button><button class="btn" style="background:var(--pk);color:#fff">Falso</button><p id="qf"></p>`
  $$('button', q).forEach(
    (b, i) =>
      (b.onclick = () => {
        const ok = (i === 0) === !!QS[qi][1]
        if (ok) {
          qs++
          award('q' + qi + QS[qi][0], 10, '✔')
        }
        $('#qf').innerHTML = `<b class="${ok ? 'good' : 'bad'}">${
          ok ? '✅ ¡Correcto!' : '❌ Incorrecto'
        }</b> ${esc(QS[qi][2])}`
        $$('button', q).forEach(x => (x.disabled = true))
        setTimeout(() => {
          qi++
          qShow()
        }, 1700)
      })
  )
}
qShow()

/* ===== Reto Venn (opción múltiple) ===== */
// [pregunta, [respuesta correcta, ...distractores]]
const VQ = [
  [
    '¿Cuánto es A ∩ B?',
    ['{4, 5}', '{1, 2, 3}', '{1, 2, 3, 4, 5, 6, 7}', '{6, 7}']
  ],
  [
    '¿Cuánto es A ∪ B?',
    ['{1, 2, 3, 4, 5, 6, 7}', '{4, 5}', '{1, 2, 3}', '{6, 7}']
  ],
  ['¿Cuánto es A ∖ B?', ['{1, 2, 3}', '{4, 5}', '{6, 7}', '{1, 2, 3, 4, 5}']],
  [
    '¿Cuánto es Bᶜ?',
    ['{1, 2, 3, 8, 9, 10}', '{6, 7, 8, 9, 10}', '{1, 2, 3, 4, 5}', '{8, 9, 10}']
  ],
  ['¿Cuánto vale |A ∪ B|?', ['7', '9', '5', '4']],
  ['¿Cuánto es (A ∪ B)ᶜ?', ['{8, 9, 10}', '{6, 7}', '{1, 2, 3}', '{4, 5}']]
]
let vi = 0,
  vs = 0
function vShow () {
  const box = $('#vq')
  if (vi >= VQ.length) {
    box.innerHTML = `<h3>🏁 Resultado: ${vs}/${VQ.length}</h3><button class="btn" onclick="vi=0;vs=0;vShow()">Reintentar</button>`
    if (vs >= 5) {
      confetti(150)
      award('vq', 40, '🔵 ¡Cazador de regiones!')
    }
    return
  }
  const [txt, opts] = VQ[vi]
  const order = shuffle(opts.map((o, i) => ({ o, ok: i === 0 })))
  box.innerHTML = `<p>Pregunta ${vi + 1}/${VQ.length}</p><h3>${esc(
    txt
  )}</h3>${order
    .map(
      (x, i) =>
        `<button class="opt" data-ok="${x.ok ? 1 : 0}">${esc(x.o)}</button>`
    )
    .join('')}<p id="vf2"></p>`
  $$('.opt', box).forEach(b =>
    b.addEventListener('click', () => {
      const ok = b.dataset.ok === '1'
      $$('.opt', box).forEach(x => {
        x.disabled = true
        if (x.dataset.ok === '1') x.classList.add('right')
      })
      if (!ok) b.classList.add('wrong')
      else {
        vs++
        award('v' + vi, 10, '✔')
      }
      $('#vf2').innerHTML = `<b class="${ok ? 'good' : 'bad'}">${
        ok ? '✅ ¡Correcto!' : '❌ Incorrecto'
      }</b>`
      setTimeout(() => {
        vi++
        vShow()
      }, 1500)
    })
  )
}
vShow()

/* ===== Calculadora de conjuntos ===== */
function calc () {
  const g = id => [
    ...new Set(
      $('#' + id)
        .value.split(',')
        .map(x => x.trim())
        .filter(Boolean)
    )
  ]
  const A = g('ca'),
    B = g('cb'),
    U = [...new Set([...g('cu'), ...A, ...B])]
  const f = a => '{' + a.map(esc).join(', ') + '}',
    has = (a, x) => a.includes(x)
  const un = [...new Set([...A, ...B])],
    it = A.filter(x => has(B, x)),
    dAB = A.filter(x => !has(B, x)),
    dBA = B.filter(x => !has(A, x))
  $('#cr').innerHTML = `<p>A ∪ B = ${f(un)} → |A ∪ B| = ${
    un.length
  }</p><p>A ∩ B = ${f(it)} ${
    it.length ? '' : '(¡disjuntos!)'
  }</p><p>A ∖ B = ${f(dAB)} · B ∖ A = ${f(dBA)}</p><p>A Δ B = ${f([
    ...dAB,
    ...dBA
  ])}</p><p>Aᶜ = ${f(U.filter(x => !has(A, x)))} · Bᶜ = ${f(
    U.filter(x => !has(B, x))
  )}</p><p>A ⊆ B: <b>${A.every(x => has(B, x)) ? 'Sí' : 'No'}</b> · B ⊆ A: <b>${
    B.every(x => has(A, x)) ? 'Sí' : 'No'
  }</b></p><p>Comprobación |A∪B| = |A|+|B|−|A∩B|: ${A.length}+${B.length}−${
    it.length
  } = ${A.length + B.length - it.length} ✔</p>`
  award('calc', 20, '🧮 Calculadora usada')
}

/* ===== Selecciona las regiones (tocar regiones del diagrama) ===== */
// [expresión, nº de conjuntos, función(a, b, c) → ¿la región pertenece?]
const RG = [
  ['A ∩ B', 2, (a, b) => a && b],
  ['A ∪ B', 2, (a, b) => a || b],
  ['A ∖ B', 2, (a, b) => a && !b],
  ['Aᶜ', 2, a => !a],
  ['(A ∪ B)ᶜ', 2, (a, b) => !(a || b)],
  ['A Δ B (diferencia simétrica)', 2, (a, b) => a !== b],
  ['(A ∩ B)ᶜ', 2, (a, b) => !(a && b)],
  ['A ∩ B ∩ C', 3, (a, b, c) => a && b && c],
  ['A ∩ B ∖ C', 3, (a, b, c) => a && b && !c],
  ['A ∪ C', 3, (a, b, c) => a || c],
  ['(A ∪ B ∪ C)ᶜ', 3, (a, b, c) => !(a || b || c)],
  ['Aᶜ ∩ B', 3, (a, b) => !a && b],
  ['(A ∩ B) ∪ C', 3, (a, b, c) => (a && b) || c],
  ['A ∖ (B ∪ C)', 3, (a, b, c) => a && !b && !c]
]
const RGW = 300,
  RGH = 200
const RGL = ['A', 'B', 'C']
const rgCircles = n =>
  n === 2
    ? [
        [115, 100, 62],
        [185, 100, 62]
      ]
    : [
        [112, 82, 54],
        [188, 82, 54],
        [150, 134, 54]
      ]
const rgBits = (code, n) =>
  Array.from({ length: n }, (_, i) => !!(code & (1 << i)))
const rgName = (code, n) => {
  const ins = rgBits(code, n)
    .map((v, i) => (v ? RGL[i] : ''))
    .filter(Boolean)
  if (!ins.length) return 'Fuera de los círculos'
  if (ins.length === n) return n === 2 ? 'A y B' : 'A, B y C (las tres)'
  return 'Solo ' + ins.join(' y ')
}
function rgSvg (n) {
  const C = rgCircles(n)
  const arc = (x, y, r) =>
    `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`
  let defs = ''
  C.forEach((c, i) => {
    defs += `<clipPath id="ci${i}"><path d="${arc(...c)}"/></clipPath>`
    defs += `<clipPath id="co${i}"><path clip-rule="evenodd" d="M0 0H${RGW}V${RGH}H0Z${arc(
      ...c
    )}"/></clipPath>`
  })
  let regs = ''
  for (let code = 0; code < 1 << n; code++) {
    const bits = rgBits(code, n)
    let open = '',
      close = ''
    bits.forEach((v, i) => {
      open += `<g clip-path="url(#c${v ? 'i' : 'o'}${i})">`
      close += '</g>'
    })
    regs += `${open}<rect class="rg" data-code="${code}" x="5" y="5" width="${
      RGW - 10
    }" height="${
      RGH - 10
    }" tabindex="0" role="button" aria-pressed="false" aria-label="${rgName(
      code,
      n
    )}"/>${close}`
  }
  const outlines = C.map(
    c =>
      `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="none" stroke="#333" stroke-width="2.5" pointer-events="none"/>`
  ).join('')
  const lab = (
    n === 2
      ? [
          [62, 34],
          [238, 34]
        ]
      : [
          [58, 30],
          [242, 30],
          [240, 182]
        ]
  )
    .map(
      (p, i) =>
        `<text x="${p[0]}" y="${p[1]}" font-size="22" font-weight="800" font-family="Georgia,serif" pointer-events="none">${RGL[i]}</text>`
    )
    .join('')
  return `<svg class="rgsvg" viewBox="0 0 ${RGW} ${RGH}" role="group" aria-label="Diagrama de Venn de ${n} conjuntos"><defs>${defs}</defs>${regs}<rect x="5" y="5" width="${
    RGW - 10
  }" height="${
    RGH - 10
  }" rx="8" fill="none" stroke="#333" stroke-width="3" pointer-events="none"/>${outlines}${lab}<text x="${
    RGW - 22
  }" y="24" font-size="16" font-weight="800" pointer-events="none">U</text></svg>`
}
let rgSet = [],
  rgi = 0,
  rgs = 0,
  rgLocked = false
function rgStart () {
  const two = shuffle(RG.filter(q => q[1] === 2)).slice(0, 3)
  const three = shuffle(RG.filter(q => q[1] === 3)).slice(0, 3)
  rgSet = shuffle([...two, ...three])
  rgi = 0
  rgs = 0
  rgShow()
}
function rgShow () {
  const box = $('#rg')
  if (rgi >= rgSet.length) {
    box.innerHTML = `<h3>🏁 Resultado: ${rgs}/${rgSet.length}</h3><button class="btn" onclick="rgStart()">Jugar de nuevo</button>`
    if (rgs >= 5) {
      confetti(150)
      award('vr', 40, '🗺️ ¡Cartógrafo de Venn!')
    }
    return
  }
  const [txt, n] = rgSet[rgi]
  rgLocked = false
  box.innerHTML = `<p>Pregunta ${rgi + 1}/${
    rgSet.length
  } · ${n} conjuntos</p><p style="margin:0">Toca todas las regiones que representan:</p><p class="rgexp"><b>${esc(
    txt
  )}</b></p>${rgSvg(
    n
  )}<p class="rgleg">Toca una región para marcarla o desmarcarla. El exterior (fuera de los círculos) también cuenta.</p><button class="btn" id="rgOk">Comprobar</button><button class="btn" id="rgClr" style="background:#ddd">Limpiar</button><p id="rgf"></p>`
  const rects = $$('.rg', box)
  const toggle = r => {
    if (rgLocked) return
    const on = r.classList.toggle('on')
    r.setAttribute('aria-pressed', on)
  }
  rects.forEach(r => {
    r.addEventListener('click', () => toggle(r))
    r.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle(r)
      }
    })
  })
  $('#rgClr').onclick = () => {
    if (rgLocked) return
    rects.forEach(r => {
      r.classList.remove('on')
      r.setAttribute('aria-pressed', 'false')
    })
  }
  $('#rgOk').onclick = () => {
    if (rgLocked) return
    rgLocked = true
    const fn = rgSet[rgi][2]
    let perfect = true
    rects.forEach(r => {
      const need = !!fn(...rgBits(+r.dataset.code, n))
      const sel = r.classList.contains('on')
      r.classList.remove('on')
      if (need && sel) r.classList.add('ok')
      else if (!need && sel) {
        r.classList.add('wrong')
        perfect = false
      } else if (need && !sel) {
        r.classList.add('miss')
        perfect = false
      }
    })
    if (perfect) {
      rgs++
      award('g' + txt, 15, '🗺️ Regiones correctas')
    }
    $('#rgf').innerHTML = `<b class="${perfect ? 'good' : 'bad'}">${
      perfect ? '✅ ¡Perfecto!' : '❌ Revisa el diagrama'
    }</b>${
      perfect ? '' : '<br>Verde: acertaste · Rojo: sobraba · Naranja: faltaba.'
    }<br><button class="btn" id="rgNext">${
      rgi + 1 < rgSet.length ? 'Siguiente ➜' : 'Ver resultado'
    }</button>`
    $('#rgNext').onclick = () => {
      rgi++
      rgShow()
    }
    $('#rgOk').disabled = true
    $('#rgClr').disabled = true
  }
}
rgStart()

hud()
