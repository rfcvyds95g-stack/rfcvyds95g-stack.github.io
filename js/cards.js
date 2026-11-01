(function () {
  const C = (window.Casino = window.Casino || {});

  const TYPES = {
    feuer: { name: 'Feuer', a: '#7f1d1d', b: '#fb923c', emoji: ['🦎', '🦊', '🐐', '🦅', '🦁', '🦇', '🐂', '🐅', '🐴', '🔥'] },
    wasser: { name: 'Wasser', a: '#0c4a6e', b: '#38bdf8', emoji: ['💧', '🦦', '🐚', '🦭', '🐬', '🦢', '🐋', '🦈', '🐟', '🌊'] },
    pflanze: { name: 'Pflanze', a: '#14532d', b: '#4ade80', emoji: ['🌱', '🍄', '🪲', '🐱', '🌵', '🌳', '🌻', '🍀', '🌺', '🌿'] },
    blitz: { name: 'Blitz', a: '#713f12', b: '#facc15', emoji: ['⚡', '🐿️', '🐰', '🐝', '🦊', '🦅', '🐃', '🐆', '⚙️', '🌟'] },
    psycho: { name: 'Psycho', a: '#4c1d95', b: '#e879f9', emoji: ['🌀', '🐱', '🦋', '🐈', '🦉', '🦢', '🦌', '🦄', '✨', '🔮'] },
    kampf: { name: 'Kampf', a: '#7f1d1d', b: '#fca5a5', emoji: ['🐭', '🐾', '🐦', '🐐', '🐻', '🦡', '🐂', '🦍', '🏆', '🥊'] },
    drache: { name: 'Drache', a: '#1e3a8a', b: '#f59e0b', emoji: ['🦎', '🐾', '🐲', '💎', '🌪️', '👑', '🪱', '🐉', '☄️', '🧡'] },
    geist: { name: 'Geist', a: '#1e1b4b', b: '#a78bfa', emoji: ['🌑', '💨', '🕯️', '🦉', '🌫️', '🎭', '🪦', '👻', '🌙', '👁️'] }
  };
  const TYPE_ORDER = Object.keys(TYPES);

  const RARITIES = {
    common: { name: 'Häufig', rank: 0, sell: 3 },
    uncommon: { name: 'Ungewöhnlich', rank: 1, sell: 8 },
    rare: { name: 'Selten', rank: 2, sell: 15 },
    holo: { name: 'Holo-Selten', rank: 3, sell: 35 },
    ultra: { name: 'Ultra-Selten', rank: 4, sell: 70 },
    fullart: { name: 'Full-Art', rank: 5, sell: 110 },
    secret: { name: 'Geheim-Selten', rank: 6, sell: 180 },
    mythic: { name: 'Legendär-Mythisch', rank: 7, sell: 350 }
  };

  const PACKS = {
    basis: { id: 'basis', name: 'Basis-Pack', price: 100 },
    element: { id: 'element', name: 'Elementar-Pack', price: 220 },
    premium: { id: 'premium', name: 'Premium-Pack', price: 480 }
  };

  const FILL = {
    basis: [{ id: 'common', w: 7500 }, { id: 'uncommon', w: 2500 }],
    element: [{ id: 'common', w: 6500 }, { id: 'uncommon', w: 3500 }],
    premium: [{ id: 'common', w: 4000 }, { id: 'uncommon', w: 6000 }]
  };
  const HIT = {
    basis: [
      { id: 'rare', w: 8242 }, { id: 'holo', w: 1250 }, { id: 'ultra', w: 333 },
      { id: 'fullart', w: 125 }, { id: 'secret', w: 40 }, { id: 'mythic', w: 10 }
    ],
    element: [
      { id: 'rare', w: 6975 }, { id: 'holo', w: 2000 }, { id: 'ultra', w: 667 },
      { id: 'fullart', w: 250 }, { id: 'secret', w: 83 }, { id: 'mythic', w: 25 }
    ],
    premium: [
      { id: 'rare', w: 4800 }, { id: 'holo', w: 3333 }, { id: 'ultra', w: 1250 },
      { id: 'fullart', w: 400 }, { id: 'secret', w: 167 }, { id: 'mythic', w: 50 }
    ]
  };
  const MID_PREMIUM = [{ id: 'rare', w: 8000 }, { id: 'holo', w: 2000 }];

  const STARTS = ['Glu', 'Asch', 'Fun', 'Lor', 'Vel', 'Nir', 'Tal', 'Kor', 'Mir', 'Zel', 'Bra', 'Lun', 'Sar', 'Dex', 'Rin', 'Hol', 'Pax', 'Vor', 'Kel', 'Syl', 'Oro', 'Lum', 'Tha', 'Gri', 'Wol', 'Fen', 'Bor', 'Kal', 'Rio', 'Sax', 'Yun', 'Pel', 'Tor', 'Mar', 'Hin', 'Dor', 'Bel', 'Ran', 'Sol', 'Ira', 'Oka', 'Nes', 'Var', 'Hel', 'Quin', 'Jas', 'Ero', 'Ulv', 'Kes', 'Fae'];
  const MIDS = ['ta', 'li', 'no', 'ka', 'mi', 'ra', 've', 'na', 'lo', 'ri', 'sa', 'ne', 'xo', 'um', 'el', 'or', 'an', 'ix', 'ae', 'io'];
  const ENDS = [
    ['ling', 'pfote', 'keim', 'funke', 'kind'],
    ['klaue', 'schweif', 'fang', 'sturm', 'blick'],
    ['krone', 'fürst', 'rex', 'wacht', 'herz']
  ];
  const FORMS = ['Nachtform', 'Glanzform', 'Sonnenform', 'Schattenform'];
  const ATK = {
    feuer: ['Glutstoß', 'Brandbiss', 'Funkenhieb', 'Aschensturm', 'Kernhauch'],
    wasser: ['Spritzer', 'Wellenbiss', 'Gischtflug', 'Strudel', 'Gezeiten'],
    pflanze: ['Rankenhieb', 'Sporen', 'Dornenwall', 'Blattsturm', 'Urwuchs'],
    blitz: ['Knister', 'Sprungblitz', 'Entladung', 'Donnertritt', 'Lichtbogen'],
    psycho: ['Gedankenhauch', 'Wirbel', 'Hypnose', 'Seelenblick', 'Sternenriss'],
    kampf: ['Prankenhieb', 'Haken', 'Schwinger', 'Rammbock', 'Titanfaust'],
    drache: ['Funkenzahn', 'Flügelschlag', 'Sturmfauch', 'Drachenodem', 'Urfunke'],
    geist: ['Schattenhauch', 'Nebelgriff', 'Seelenraub', 'Gruftschlag', 'Ewiger Hauch']
  };

  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i++) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  const SET = [];
  const BY_ID = {};
  const usedNames = new Set();
  function takeName(base) {
    let name = base;
    let n = 2;
    while (usedNames.has(name)) {
      name = base + ' ' + n;
      n += 1;
    }
    usedNames.add(name);
    return name;
  }
  function rootAt(index) {
    return STARTS[index % STARTS.length] + MIDS[Math.floor(index / STARTS.length) % MIDS.length];
  }
  function pushCard(card) {
    SET.push(card);
    BY_ID[card.id] = card;
  }

  let serial = 0;
  TYPE_ORDER.forEach((type) => {
    for (let family = 0; family < 10; family++) {
      const root = rootAt(serial);
      serial += 1;
      const emoji = TYPES[type].emoji[family];
      let previous = null;
      let apex = null;
      for (let stage = 0; stage < 3; stage++) {
        const rarity = family <= 5
          ? ['common', 'uncommon', 'rare'][stage]
          : family <= 7
            ? ['uncommon', 'rare', 'holo'][stage]
            : family === 8
              ? ['rare', 'holo', 'ultra'][stage]
              : ['common', 'common', 'uncommon'][stage];
        const id = type + '-f' + family + '-s' + (stage + 1);
        const ending = ENDS[stage][hash(root + stage) % ENDS[stage].length];
        const card = {
          id: id,
          type: type,
          rarity: rarity,
          name: takeName(root + ending),
          emoji: emoji,
          stage: stage + 1,
          alt: false,
          family: type + '-f' + family,
          evolvesFrom: previous,
          hp: [60, 100, 140][stage] + (hash(id) % 16),
          attack: ATK[type][(stage + family) % ATK[type].length],
          damage: [30, 55, 85][stage] + (hash(id + 'd') % 12)
        };
        pushCard(card);
        previous = id;
        apex = card;
      }
      if (family <= 3 || family === 8) {
        const id = type + '-f' + family + '-alt';
        const form = FORMS[hash(root + 'alt') % FORMS.length];
        pushCard({
          id: id,
          type: type,
          rarity: family === 8 ? 'secret' : 'fullart',
          name: takeName(apex.name + ' ' + form),
          emoji: emoji,
          stage: 3,
          alt: true,
          family: apex.family,
          evolvesFrom: apex.id,
          hp: apex.hp + 10,
          attack: ATK[type][(family + 3) % ATK[type].length],
          damage: apex.damage + 15
        });
      }
    }
    const mythId = type + '-myth';
    const mythBase = SET.find((card) => card.id === type + '-f8-s3');
    pushCard({
      id: mythId,
      type: type,
      rarity: 'mythic',
      name: takeName('Mythos ' + mythBase.name),
      emoji: '🌟',
      stage: 4,
      alt: false,
      family: type + '-myth',
      evolvesFrom: mythBase.id,
      hp: 230 + (hash(mythId) % 20),
      attack: ATK[type][4],
      damage: 150
    });
  });

  let opening = false;
  let currentPull = [];
  let revealed = [];
  let bulkMode = false;
  let elementType = 'feuer';
  let sellArmed = false;
  let binderPage = 0;
  const PAGE = 24;

  function $(id) { return document.getElementById(id); }
  function fast() { return !!(C.timing && C.timing.fast); }
  function isRarePlus(rarity) { return RARITIES[rarity].rank >= 2; }
  function isHoloPlus(rarity) { return RARITIES[rarity].rank >= 3; }

  function pickWeighted(table, rng) {
    let total = 0;
    table.forEach((row) => { total += row.w; });
    let roll = rng() * total;
    for (let i = 0; i < table.length; i++) {
      roll -= table[i].w;
      if (roll < 0) return table[i].id;
    }
    return table[table.length - 1].id;
  }

  function poolFor(rarity, type, used) {
    let pool = SET.filter((card) => card.rarity === rarity && (!type || card.type === type) && !used.has(card.id));
    if (!pool.length) pool = SET.filter((card) => card.rarity === rarity && !used.has(card.id));
    if (!pool.length) pool = SET.filter((card) => card.rarity === rarity);
    return pool;
  }

  function pickCard(rarity, type, used, rng) {
    const pool = poolFor(rarity, type, used);
    const card = pool[Math.floor(rng() * pool.length)] || SET[0];
    used.add(card.id);
    return card;
  }

  function rollPack(packId, type, rng) {
    const random = rng || Math.random;
    const used = new Set();
    const slots = [];
    if (packId === 'premium') {
      for (let i = 0; i < 3; i++) slots.push(pickWeighted(FILL.premium, random));
      slots.push(pickWeighted(MID_PREMIUM, random));
      slots.push(pickWeighted(HIT.premium, random));
    } else if (packId === 'element') {
      for (let i = 0; i < 4; i++) slots.push(pickWeighted(FILL.element, random));
      slots.push(pickWeighted(HIT.element, random));
    } else {
      for (let i = 0; i < 4; i++) slots.push(pickWeighted(FILL.basis, random));
      slots.push(pickWeighted(HIT.basis, random));
    }
    return slots.map((rarity, index) => {
      const prefer = packId === 'element' && (index === 4 || random() < 0.75) ? type : null;
      return pickCard(rarity, prefer, used, random);
    });
  }

  function chanceText(weight, total) {
    const p = weight / total;
    const pct = (p * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 });
    const oneIn = Math.max(1, Math.round(1 / p));
    if (p >= 0.5) return pct + ' %';
    return pct + ' % · etwa 1 zu ' + oneIn.toLocaleString('de-DE');
  }

  function oddsFor(packId) {
    const lines = [];
    const fill = FILL[packId];
    const fillTotal = fill.reduce((sum, row) => sum + row.w, 0);
    const fillLabel = packId === 'premium' ? 'Plätze 1–3' : 'Plätze 1–4';
    lines.push({
      label: fillLabel,
      text: fill.map((row) => RARITIES[row.id].name + ' ' + chanceText(row.w, fillTotal)).join(', ')
    });
    if (packId === 'element') {
      lines.push({ label: 'Element', text: 'Etwa 3 von 4 Karten gehören zum gewählten Element.' });
    }
    if (packId === 'premium') {
      const midTotal = MID_PREMIUM.reduce((sum, row) => sum + row.w, 0);
      lines.push({
        label: 'Platz 4',
        text: MID_PREMIUM.map((row) => RARITIES[row.id].name + ' ' + chanceText(row.w, midTotal)).join(', ')
      });
    }
    const hit = HIT[packId];
    const hitTotal = hit.reduce((sum, row) => sum + row.w, 0);
    hit.forEach((row) => {
      lines.push({ label: 'Selten-Slot · ' + RARITIES[row.id].name, text: chanceText(row.w, hitTotal) });
    });
    return lines;
  }

  function dupeValue(bag) {
    let total = 0;
    SET.forEach((card) => {
      const extra = Math.max(0, (bag[card.id] || 0) - 1);
      total += extra * RARITIES[card.rarity].sell;
    });
    return total;
  }

  function syncCounters() {
    const bag = C.state.cardBag();
    let unique = 0;
    let holos = 0;
    let secrets = 0;
    let mythics = 0;
    SET.forEach((card) => {
      if ((bag[card.id] || 0) <= 0) return;
      unique += 1;
      if (isHoloPlus(card.rarity)) holos += 1;
      if (card.rarity === 'secret') secrets += 1;
      if (card.rarity === 'mythic') mythics += 1;
    });
    C.state.setCollectionCounters({ unique: unique, holos: holos, secrets: secrets, mythics: mythics });
  }

  function selfCheck() {
    const failures = [];
    const names = {};
    const counts = {};
    SET.forEach((card) => {
      if (names[card.name]) failures.push('Doppelname ' + card.name);
      names[card.name] = true;
      counts[card.rarity] = (counts[card.rarity] || 0) + 1;
      if (card.stage === 2 && (!card.evolvesFrom || !BY_ID[card.evolvesFrom] || BY_ID[card.evolvesFrom].stage !== 1)) {
        failures.push('Entwicklung ' + card.id);
      }
    });
    if (SET.length < 250) failures.push('Setgröße ' + SET.length);
    if (counts.mythic < 4 || counts.mythic > 12) failures.push('Mythics ' + counts.mythic);
    ['common', 'uncommon', 'rare', 'holo', 'ultra', 'fullart', 'secret'].forEach((rarity) => {
      if (!counts[rarity]) failures.push('fehlt ' + rarity);
    });
    const runs = 20000;
    const hits = { rare: 0, holo: 0, ultra: 0, fullart: 0, secret: 0, mythic: 0 };
    let sell = 0;
    let bad = 0;
    for (let i = 0; i < runs; i++) {
      const pack = rollPack('basis', null, Math.random);
      const ids = {};
      pack.forEach((card) => { ids[card.id] = 1; sell += RARITIES[card.rarity].sell; });
      if (pack.length !== 5 || Object.keys(ids).length !== 5 || !isRarePlus(pack[4].rarity)) bad += 1;
      hits[pack[4].rarity] += 1;
    }
    if (bad) failures.push('Ungültige Basis-Packs ' + bad);
    if (hits.holo < 2300 || hits.holo > 2700) failures.push('Holo ' + hits.holo);
    if (hits.ultra < 540 || hits.ultra > 800) failures.push('Ultra ' + hits.ultra);
    if (hits.fullart < 180 || hits.fullart > 340) failures.push('Fullart ' + hits.fullart);
    if (hits.secret < 40 || hits.secret > 130) failures.push('Geheim ' + hits.secret);
    if (hits.mythic < 5 || hits.mythic > 45) failures.push('Mythisch ' + hits.mythic);
    if (sell / runs >= PACKS.basis.price) failures.push('Basis-Verkauf ' + (sell / runs).toFixed(1));
    let elementTyped = 0;
    let elementAll = 0;
    let premiumSell = 0;
    for (let i = 0; i < 2000; i++) {
      rollPack('element', 'wasser', Math.random).forEach((card) => {
        elementAll += 1;
        if (card.type === 'wasser') elementTyped += 1;
      });
      rollPack('premium', null, Math.random).forEach((card) => { premiumSell += RARITIES[card.rarity].sell; });
    }
    if (elementTyped / elementAll < 0.7) failures.push('Element ' + (elementTyped / elementAll).toFixed(2));
    if (premiumSell / 2000 >= PACKS.premium.price) failures.push('Premium-Verkauf ' + (premiumSell / 2000).toFixed(1));
    const holoLine = oddsFor('basis').find((line) => line.label.indexOf('Holo') !== -1);
    if (!holoLine || holoLine.text.indexOf('1 zu 8') === -1) failures.push('Odds Holo ' + (holoLine && holoLine.text));
    const mythicLine = oddsFor('basis').find((line) => line.label.indexOf('Mythisch') !== -1);
    if (!mythicLine || mythicLine.text.indexOf('1 zu 1.000') === -1 && mythicLine.text.indexOf('1 zu 1000') === -1) {
      failures.push('Odds Mythisch ' + (mythicLine && mythicLine.text));
    }
    return { failures: failures, size: SET.length, counts: counts };
  }

  function artNode(card) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 160 104');
    svg.setAttribute('class', 'tc-art');
    svg.setAttribute('aria-hidden', 'true');
    const type = TYPES[card.type];
    const seed = hash(card.id);
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    const gid = 'g' + seed.toString(16) + '-' + (SET.indexOf(card) + 1);
    gradient.setAttribute('id', gid);
    gradient.setAttribute('x1', '0');
    gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '1');
    gradient.setAttribute('y2', '1');
    const colors = card.rarity === 'mythic'
      ? ['#f43f5e', '#facc15', '#22d3ee']
      : [type.a, card.alt ? '#fde047' : type.b];
    colors.forEach((color, index) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', Math.round(index * 100 / (colors.length - 1)) + '%');
      stop.setAttribute('stop-color', color);
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);
    svg.appendChild(defs);
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '160');
    bg.setAttribute('height', '104');
    bg.setAttribute('fill', 'url(#' + gid + ')');
    svg.appendChild(bg);
    const blobs = card.alt ? 5 : 3;
    for (let i = 0; i < blobs; i++) {
      const blob = document.createElementNS('http://www.w3.org/2000/svg', card.alt && i === 0 ? 'polygon' : 'circle');
      if (blob.tagName === 'polygon') {
        blob.setAttribute('points', '80,12 98,48 140,52 108,78 118,118 80,96 42,118 52,78 20,52 62,48');
      } else {
        blob.setAttribute('cx', String(24 + ((seed >>> (i * 3)) % 110)));
        blob.setAttribute('cy', String(20 + ((seed >>> (i + 5)) % 64)));
        blob.setAttribute('r', String(8 + ((seed >>> (i + 1)) % 16)));
      }
      blob.setAttribute('fill', 'rgba(255,255,255,.2)');
      svg.appendChild(blob);
    }
    const motif = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    motif.setAttribute('x', '80');
    motif.setAttribute('y', '68');
    motif.setAttribute('text-anchor', 'middle');
    motif.setAttribute('font-size', '46');
    motif.textContent = card.emoji;
    svg.appendChild(motif);
    return svg;
  }

  function stageLabel(card) {
    if (card.rarity === 'mythic') return 'Mythisch';
    if (card.alt) return 'Alternativ · Stufe 3';
    return 'Stufe ' + card.stage;
  }

  function faceNode(card, count) {
    const root = document.createElement('article');
    root.className = 'tc rarity-' + card.rarity + ' tc-tilt';
    if (isHoloPlus(card.rarity)) root.classList.add('holo');
    root.style.setProperty('--ta', TYPES[card.type].a);
    root.style.setProperty('--tb', TYPES[card.type].b);
    root.dataset.card = card.id;
    const top = document.createElement('div');
    top.className = 'tc-top';
    const name = document.createElement('b');
    name.textContent = card.name;
    const hp = document.createElement('span');
    hp.textContent = card.hp + ' KP';
    top.append(name, hp);
    const wrap = document.createElement('div');
    wrap.className = 'tc-art-wrap';
    wrap.appendChild(artNode(card));
    const type = document.createElement('div');
    type.className = 'tc-type';
    type.textContent = TYPES[card.type].name + ' · ' + stageLabel(card);
    const attack = document.createElement('div');
    attack.className = 'tc-attack';
    const atk = document.createElement('span');
    atk.textContent = card.attack;
    const dmg = document.createElement('b');
    dmg.textContent = String(card.damage);
    attack.append(atk, dmg);
    const rarity = document.createElement('div');
    rarity.className = 'tc-rarity';
    rarity.textContent = RARITIES[card.rarity].name + (count > 1 ? ' · ×' + count : '');
    const shine = document.createElement('div');
    shine.className = 'tc-shine';
    root.append(top, wrap, type, attack, rarity, shine);
    bindTilt(root);
    return root;
  }

  function bindTilt(el) {
    const set = (px, py) => {
      el.style.setProperty('--rx', ((px - 0.5) * 14).toFixed(2) + 'deg');
      el.style.setProperty('--ry', ((0.5 - py) * 14).toFixed(2) + 'deg');
      el.style.setProperty('--shine', ((px * 140) - 50).toFixed(1) + '%');
    };
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width) return;
      set((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
    });
    el.addEventListener('pointerleave', () => set(0.5, 0.5));
  }

  function showShop() {
    $('cards-shop').classList.remove('hidden');
    $('cards-open').classList.add('hidden');
    $('cards-bulk').classList.add('hidden');
    $('cards-binder').classList.add('hidden');
    $('tab-shop').classList.add('active');
    $('tab-binder').classList.remove('active');
    renderShop();
  }

  function showBinder() {
    if (opening) return;
    $('cards-shop').classList.add('hidden');
    $('cards-open').classList.add('hidden');
    $('cards-bulk').classList.add('hidden');
    $('cards-binder').classList.remove('hidden');
    $('tab-shop').classList.remove('active');
    $('tab-binder').classList.add('active');
    renderBinder();
  }

  function ownedCount() {
    const bag = C.state.cardBag();
    let count = 0;
    SET.forEach((card) => { if ((bag[card.id] || 0) > 0) count += 1; });
    return count;
  }

  function renderShop() {
    const credits = C.state.get().credits;
    ['basis', 'element', 'premium'].forEach((id) => {
      $(id === 'basis' ? 'buy-basis' : id === 'element' ? 'buy-element' : 'buy-premium').disabled = opening || credits < PACKS[id].price;
      $(id === 'basis' ? 'buy-basis-10' : id === 'element' ? 'buy-element-10' : 'buy-premium-10').disabled = opening || credits < PACKS[id].price * 10;
    });
    const owned = ownedCount();
    $('cards-progress').textContent = owned + ' / ' + SET.length + ' · ' + Math.floor(owned * 100 / SET.length) + ' %';
    document.querySelectorAll('[data-element]').forEach((button) => {
      button.classList.toggle('selected', button.dataset.element === elementType);
    });
  }

  function renderOpen() {
    const pack = $('pack-visual');
    const row = $('pull-row');
    row.replaceChildren();
    if (!revealed.length) {
      pack.classList.remove('hidden', 'torn');
      $('pack-tear').classList.remove('hidden');
      $('reveal-all').classList.add('hidden');
      $('open-done').classList.add('hidden');
      $('open-banner').classList.add('hidden');
      return;
    }
    pack.classList.add('hidden');
    $('pack-tear').classList.add('hidden');
    const done = revealed.every(Boolean);
    $('reveal-all').classList.toggle('hidden', done);
    $('open-done').classList.toggle('hidden', !done);
    currentPull.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'flipper' + (revealed[index] ? ' revealed' : '') + (revealed[index] && card.rarity === 'mythic' ? ' spotlight' : '');
      const inner = document.createElement('div');
      inner.className = 'flip-inner';
      const back = document.createElement('div');
      back.className = 'flip-back';
      back.textContent = '★';
      const front = document.createElement('div');
      front.className = 'flip-front';
      const bag = C.state.cardBag();
      front.appendChild(faceNode(card, bag[card.id] || 1));
      inner.append(back, front);
      button.appendChild(inner);
      button.addEventListener('click', () => revealOne(index));
      row.appendChild(button);
    });
  }

  function spectacle(card) {
    const rank = RARITIES[card.rarity].rank;
    if (C.audio) {
      if (card.rarity === 'mythic') C.audio.mythic();
      else if (card.rarity === 'secret') C.audio.gold();
      else if (card.rarity === 'fullart') C.audio.fullArt();
      else if (card.rarity === 'ultra') C.audio.fanfare();
      else if (isHoloPlus(card.rarity)) C.audio.holo();
      else C.audio.card();
    }
    if (rank >= 5) C.effects.celebrate('mega');
    else if (rank >= 3) C.effects.celebrate('big');
    if (rank >= 4) {
      const flash = $('rare-flash');
      flash.className = 'show rarity-' + card.rarity;
      window.setTimeout(() => { flash.className = ''; }, fast() ? 40 : (card.rarity === 'mythic' ? 1600 : 900));
    }
    const banner = $('open-banner');
    if (rank >= 4) {
      banner.textContent = RARITIES[card.rarity].name + ': ' + card.name;
      banner.classList.remove('hidden');
    }
  }

  function revealOne(index) {
    if (revealed[index]) return;
    revealed[index] = true;
    spectacle(currentPull[index]);
    if (revealed.every(Boolean)) opening = false;
    renderOpen();
    renderShop();
  }

  function grant(pulls, cost, count) {
    C.state.addCredits(-cost);
    const bag = C.state.cardBag();
    pulls.forEach((card) => { bag[card.id] = (bag[card.id] || 0) + 1; });
    C.state.saveCardBag(bag);
    C.state.recordRound({ game: 'cards', wagered: cost, payout: 0, pack: true, packCount: count });
    syncCounters();
  }

  function buy(packId, count) {
    if (opening) return;
    const pack = PACKS[packId];
    const amount = count || 1;
    const cost = pack.price * amount;
    if (C.state.get().credits < cost) {
      if (C.app && C.app.toast) C.app.toast('Nicht genug Credits.');
      return;
    }
    const type = packId === 'element' ? elementType : null;
    let pulls = [];
    if (amount === 1 && C.cards._debugPack) {
      pulls = C.cards._debugPack;
      C.cards._debugPack = null;
    } else {
      for (let i = 0; i < amount; i++) pulls = pulls.concat(rollPack(packId, type, Math.random));
    }
    opening = true;
    bulkMode = amount > 1;
    grant(pulls, cost, amount);
    $('cards-shop').classList.add('hidden');
    $('cards-binder').classList.add('hidden');
    if (amount > 1) {
      currentPull = pulls;
      $('cards-open').classList.add('hidden');
      renderBulk(pack, pulls);
    } else {
      currentPull = pulls;
      revealed = [];
      $('cards-bulk').classList.add('hidden');
      $('cards-open').classList.remove('hidden');
      $('open-title').textContent = pack.name;
      renderOpen();
    }
  }

  function renderBulk(pack, pulls) {
    $('cards-bulk').classList.remove('hidden');
    $('bulk-title').textContent = '10× ' + pack.name;
    const summary = $('bulk-summary');
    summary.replaceChildren();
    Object.keys(RARITIES).forEach((id) => {
      const count = pulls.filter((card) => card.rarity === id).length;
      if (!count) return;
      const box = document.createElement('div');
      box.className = 'stat';
      const strong = document.createElement('b');
      strong.textContent = String(count);
      const span = document.createElement('span');
      span.textContent = RARITIES[id].name;
      box.append(strong, span);
      summary.appendChild(box);
    });
    const best = pulls.filter((card) => isHoloPlus(card.rarity))
      .sort((a, b) => RARITIES[b.rarity].rank - RARITIES[a.rarity].rank)
      .slice(0, 12);
    const host = $('bulk-best');
    host.replaceChildren();
    if (!best.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = 'Keine besondere Karte in diesem Schwung.';
      host.appendChild(empty);
      return;
    }
    const bag = C.state.cardBag();
    best.forEach((card) => {
      const button = miniButton(card, bag[card.id] || 1);
      host.appendChild(button);
    });
  }

  function filteredList() {
    const bag = C.state.cardBag();
    const type = $('filter-type').value;
    const rarity = $('filter-rarity').value;
    const sort = $('filter-sort').value;
    const query = ($('card-search').value || '').trim().toLocaleLowerCase('de');
    const onlyMissing = $('filter-missing').checked;
    const onlyDupes = $('filter-dupes').checked;
    const list = SET.filter((card) => {
      if (type && card.type !== type) return false;
      if (rarity && card.rarity !== rarity) return false;
      if (query && card.name.toLocaleLowerCase('de').indexOf(query) === -1) return false;
      const count = bag[card.id] || 0;
      if (onlyMissing && count > 0) return false;
      if (onlyDupes && count < 2) return false;
      return true;
    });
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'de');
      if (sort === 'rarity') return RARITIES[b.rarity].rank - RARITIES[a.rarity].rank || a.name.localeCompare(b.name, 'de');
      if (sort === 'owned') return (bag[b.id] || 0) - (bag[a.id] || 0);
      return SET.indexOf(a) - SET.indexOf(b);
    });
    return list;
  }

  function miniButton(card, count) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mini' + (count ? ' owned' : ' missing') + (isHoloPlus(card.rarity) && count ? ' holo' : '');
    button.style.setProperty('--ta', TYPES[card.type].a);
    button.style.setProperty('--tb', TYPES[card.type].b);
    const art = document.createElement('div');
    art.className = 'mini-art';
    art.textContent = count ? card.emoji : '❔';
    const name = document.createElement('b');
    name.textContent = card.name;
    const meta = document.createElement('span');
    meta.textContent = TYPES[card.type].name + ' · ' + stageLabel(card);
    button.append(art, name, meta);
    if (count > 1) {
      const badge = document.createElement('i');
      badge.textContent = '×' + count;
      button.appendChild(badge);
    }
    button.addEventListener('click', () => openDetail(card.id));
    return button;
  }

  function renderBinder() {
    const bag = C.state.cardBag();
    const owned = ownedCount();
    $('binder-progress').textContent = owned + ' / ' + SET.length + ' · ' + Math.floor(owned * 100 / SET.length) + ' % der Sammlung';
    const list = filteredList();
    const pages = Math.max(1, Math.ceil(list.length / PAGE));
    if (binderPage > pages - 1) binderPage = pages - 1;
    if (binderPage < 0) binderPage = 0;
    const slice = list.slice(binderPage * PAGE, binderPage * PAGE + PAGE);
    const grid = $('binder-grid');
    grid.replaceChildren();
    if (!slice.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = 'Keine Karten für diese Suche.';
      grid.appendChild(empty);
    }
    slice.forEach((card) => grid.appendChild(miniButton(card, bag[card.id] || 0)));
    $('page-label').textContent = 'Seite ' + (binderPage + 1) + ' von ' + pages;
    $('page-prev').disabled = binderPage <= 0;
    $('page-next').disabled = binderPage >= pages - 1;
    const value = dupeValue(bag);
    sellArmed = false;
    $('sell-dupes').textContent = value > 0 ? 'Duplikate verkaufen · +' + C.state.fmt(value) : 'Keine Duplikate';
    $('sell-dupes').disabled = value <= 0;
  }

  function openDetail(id) {
    const card = BY_ID[id];
    if (!card) return;
    const bag = C.state.cardBag();
    const host = $('detail-card');
    host.replaceChildren(faceNode(card, bag[id] || 0));
    let extra = (bag[id] || 0) > 0 ? 'Im Besitz: ' + bag[id] : 'Noch nicht in der Sammlung.';
    if (card.alt && BY_ID[card.evolvesFrom]) extra += ' Alternative Illustration von ' + BY_ID[card.evolvesFrom].name + '.';
    else if (card.evolvesFrom && BY_ID[card.evolvesFrom]) extra += ' Entwicklung von ' + BY_ID[card.evolvesFrom].name + '.';
    $('detail-count').textContent = extra;
    $('card-detail').classList.remove('hidden');
  }

  function sellDupes() {
    const value = dupeValue(C.state.cardBag());
    if (value <= 0) return;
    if (!sellArmed) {
      sellArmed = true;
      $('sell-dupes').textContent = 'Wirklich für ' + C.state.fmt(value) + ' Credits verkaufen?';
      return;
    }
    const bag = C.state.cardBag();
    SET.forEach((card) => { if ((bag[card.id] || 0) > 1) bag[card.id] = 1; });
    C.state.saveCardBag(bag);
    C.state.noteSale(value);
    sellArmed = false;
    if (C.app && C.app.toast) C.app.toast('Duplikate verkauft: +' + C.state.fmt(value) + ' Credits');
    renderBinder();
    renderShop();
  }

  function fillOdds() {
    ['basis', 'element', 'premium'].forEach((id) => {
      const list = $('odds-' + id);
      list.replaceChildren();
      oddsFor(id).forEach((line) => {
        const item = document.createElement('li');
        const strong = document.createElement('b');
        strong.textContent = line.label + ': ';
        item.append(strong, document.createTextNode(line.text));
        list.appendChild(item);
      });
    });
  }

  function debugGrant(id, count) {
    const bag = C.state.cardBag();
    bag[id] = (bag[id] || 0) + count;
    C.state.saveCardBag(bag);
    syncCounters();
  }

  function init() {
    C.state.setCollectionSize(SET.length);
    const types = $('element-types');
    TYPE_ORDER.forEach((id) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.element = id;
      button.textContent = TYPES[id].name;
      button.addEventListener('click', () => { elementType = id; renderShop(); });
      types.appendChild(button);
    });
    TYPE_ORDER.forEach((id) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = TYPES[id].name;
      $('filter-type').appendChild(option);
    });
    Object.keys(RARITIES).forEach((id) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = RARITIES[id].name;
      $('filter-rarity').appendChild(option);
    });
    fillOdds();
    $('buy-basis').addEventListener('click', () => buy('basis', 1));
    $('buy-element').addEventListener('click', () => buy('element', 1));
    $('buy-premium').addEventListener('click', () => buy('premium', 1));
    $('buy-basis-10').addEventListener('click', () => buy('basis', 10));
    $('buy-element-10').addEventListener('click', () => buy('element', 10));
    $('buy-premium-10').addEventListener('click', () => buy('premium', 10));
    $('tab-shop').addEventListener('click', showShop);
    $('tab-binder').addEventListener('click', showBinder);
    $('pack-tear').addEventListener('click', () => {
      if (C.audio) C.audio.packTear();
      $('pack-visual').classList.add('torn');
      window.setTimeout(() => {
        revealed = currentPull.map(() => false);
        renderOpen();
      }, fast() ? 20 : 420);
    });
    $('reveal-all').addEventListener('click', () => {
      let best = null;
      currentPull.forEach((card, index) => {
        if (!revealed[index]) {
          revealed[index] = true;
          if (!best || RARITIES[card.rarity].rank > RARITIES[best.rarity].rank) best = card;
        }
      });
      if (best) spectacle(best);
      opening = false;
      renderOpen();
      renderShop();
    });
    $('open-done').addEventListener('click', () => { opening = false; showBinder(); });
    $('bulk-done').addEventListener('click', () => { opening = false; bulkMode = false; showBinder(); });
    $('sell-dupes').addEventListener('click', sellDupes);
    $('detail-close').addEventListener('click', () => $('card-detail').classList.add('hidden'));
    ['filter-type', 'filter-rarity', 'filter-sort', 'filter-missing', 'filter-dupes'].forEach((id) => {
      $(id).addEventListener('change', () => { binderPage = 0; renderBinder(); });
    });
    $('card-search').addEventListener('input', () => { binderPage = 0; renderBinder(); });
    $('page-prev').addEventListener('click', () => { binderPage -= 1; renderBinder(); });
    $('page-next').addEventListener('click', () => { binderPage += 1; renderBinder(); });
    window.addEventListener('deviceorientation', (event) => {
      if (event.gamma == null || event.beta == null) return;
      const rx = Math.max(-14, Math.min(14, event.gamma / 4));
      const ry = Math.max(-14, Math.min(14, (event.beta - 45) / 5));
      document.querySelectorAll('.tc-tilt').forEach((el) => {
        el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        el.style.setProperty('--ry', (-ry).toFixed(2) + 'deg');
      });
    });
    syncCounters();
    C.cards.meta.desc = 'Öffne Booster und sammle ' + SET.length + ' originale Monster. Nur Spielcredits.';
    C.cards.meta.tag = SET.length + ' Karten';
  }

  C.cards = {
    SET: SET,
    PACKS: PACKS,
    RARITIES: RARITIES,
    TYPES: TYPES,
    meta: {
      id: 'cards',
      name: 'Kartenladen',
      icons: '🃏✨',
      desc: 'Öffne Booster und sammle ein großes originales Monsterset. Nur Spielcredits.',
      tag: '5 Karten je Pack',
      card: 'linear-gradient(135deg,#4c1d95,#9a3412)'
    },
    init: init,
    onShow() {
      if (!opening) showShop();
      else if (bulkMode) $('cards-bulk').classList.remove('hidden');
      else renderOpen();
    },
    refresh() {
      if (!$('view-cards') || $('view-cards').classList.contains('hidden')) return;
      renderShop();
      if (!$('cards-binder').classList.contains('hidden')) renderBinder();
    },
    isBusy: () => opening,
    close() { return !opening; },
    rollPack: rollPack,
    oddsFor: oddsFor,
    selfCheck: selfCheck,
    debugGrant: debugGrant,
    _debugPack: null
  };
})();
