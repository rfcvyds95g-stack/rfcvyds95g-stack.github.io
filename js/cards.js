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

  const NS = 'http://www.w3.org/2000/svg';
  const PAINT = {
    feuer: { body: '#e25822', belly: '#ffd7a8', dark: '#7c2d12', extra: '#fde047' },
    wasser: { body: '#3b82f6', belly: '#e0f2fe', dark: '#0c4a6e', extra: '#67e8f9' },
    pflanze: { body: '#22c55e', belly: '#ecfccb', dark: '#14532d', extra: '#86efac' },
    blitz: { body: '#f59e0b', belly: '#fef3c7', dark: '#78350f', extra: '#fde047' },
    psycho: { body: '#c084fc', belly: '#fae8ff', dark: '#581c87', extra: '#f0abfc' },
    kampf: { body: '#f87171', belly: '#fee2e2', dark: '#7f1d1d', extra: '#fecaca' },
    drache: { body: '#34d399', belly: '#fef3c7', dark: '#064e3b', extra: '#fbbf24' },
    geist: { body: '#ddd6fe', belly: '#f5f3ff', dark: '#4c1d95', extra: '#c4b5fd' }
  };
  const WEAK = { feuer: 'wasser', wasser: 'pflanze', pflanze: 'feuer', blitz: 'kampf', kampf: 'psycho', psycho: 'geist', geist: 'blitz', drache: 'geist' };
  const RESIST = { feuer: 'pflanze', wasser: 'feuer', pflanze: 'wasser', blitz: 'geist', kampf: 'blitz', psycho: 'kampf', geist: 'psycho', drache: 'feuer' };
  const PLACE = { feuer: 'Gluttal', wasser: 'Riff', pflanze: 'Mooswald', blitz: 'Gewitterfeld', psycho: 'Traumnebel', kampf: 'Ringplatz', drache: 'Drachenpass', geist: 'Mondbruch' };
  const ILLUS = ['Lina Velor', 'Marek Solun', 'Sera Korin', 'Arno Thal', 'Nila Borun', 'Ivo Quen', 'Tabea Rask', 'Jonas Helv'];

  function svgEl(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    if (attrs) Object.keys(attrs).forEach((key) => node.setAttribute(key, String(attrs[key])));
    if (parent) parent.appendChild(node);
    return node;
  }

  function drawCreature(parent, card, cx, cy, scale) {
    const paint = PAINT[card.type];
    const g = svgEl('g', { transform: 'translate(' + cx + ' ' + cy + ') scale(' + scale + ')' }, parent);
    const look = (hash(card.id) % 5) - 2;
    svgEl('ellipse', { cx: 2, cy: 48, rx: 30, ry: 8, fill: 'rgba(0,0,0,.28)' }, g);
    if (card.type === 'feuer' || card.type === 'drache' || card.type === 'wasser') {
      svgEl('path', { d: 'M-6 12 C -36 8 -52 -8 -46 -22 C -28 0 -12 16 -4 20 Z', fill: card.type === 'feuer' ? '#fb923c' : paint.dark }, g);
    }
    if (card.type === 'geist') {
      svgEl('ellipse', { cx: -22, cy: 4, rx: 10, ry: 16, fill: paint.extra, opacity: '0.65' }, g);
      svgEl('ellipse', { cx: 22, cy: 8, rx: 9, ry: 14, fill: paint.extra, opacity: '0.65' }, g);
    }
    if (card.type === 'drache' || card.type === 'pflanze' || card.type === 'geist') {
      svgEl('path', { d: 'M-4 -6 C -40 -42 -58 -8 -16 12 Z', fill: paint.extra }, g);
      svgEl('path', { d: 'M4 -6 C 40 -42 58 -8 16 12 Z', fill: paint.dark, opacity: '0.85' }, g);
    }
    if (card.type === 'wasser') {
      svgEl('path', { d: 'M-18 -2 C -40 -16 -42 10 -16 12 Z', fill: paint.extra }, g);
      svgEl('path', { d: 'M18 -2 C 40 -16 42 10 16 12 Z', fill: paint.extra }, g);
    }
    svgEl('ellipse', { cx: 0, cy: 10, rx: 28, ry: 22, fill: paint.body }, g);
    svgEl('ellipse', { cx: 1, cy: 14, rx: 16, ry: 13, fill: paint.belly }, g);
    svgEl('ellipse', { cx: -16, cy: 28, rx: 8, ry: 5, fill: paint.dark }, g);
    svgEl('ellipse', { cx: 16, cy: 28, rx: 8, ry: 5, fill: paint.dark }, g);
    svgEl('circle', { cx: 4, cy: -16, r: 17, fill: paint.body }, g);
    svgEl('ellipse', { cx: 2, cy: -12, rx: 8, ry: 6, fill: paint.belly }, g);
    if (card.type === 'feuer' || card.type === 'drache' || card.type === 'kampf') {
      svgEl('polygon', { points: '-6,-28 -2,-50 2,-28', fill: paint.dark }, g);
      svgEl('polygon', { points: '10,-26 16,-46 8,-24', fill: paint.dark }, g);
    } else if (card.type === 'pflanze') {
      svgEl('ellipse', { cx: -8, cy: -34, rx: 7, ry: 12, fill: paint.extra }, g);
      svgEl('ellipse', { cx: 12, cy: -32, rx: 6, ry: 11, fill: paint.dark }, g);
    } else if (card.type === 'blitz') {
      svgEl('polygon', { points: '6,-30 14,-16 4,-18 16,-2', fill: paint.extra }, g);
      svgEl('circle', { cx: -12, cy: -30, r: 4, fill: paint.dark }, g);
    } else if (card.type === 'psycho') {
      svgEl('circle', { cx: 4, cy: -36, r: 5.5, fill: paint.extra }, g);
      svgEl('circle', { cx: 4, cy: -36, r: 2.2, fill: '#fff' }, g);
    }
    svgEl('ellipse', { cx: -4, cy: -16, rx: 5, ry: 5.5, fill: '#fff' }, g);
    svgEl('ellipse', { cx: 12, cy: -16, rx: 5, ry: 5.5, fill: '#fff' }, g);
    svgEl('circle', { cx: -3 + look, cy: -15, r: 2.3, fill: paint.dark }, g);
    svgEl('circle', { cx: 13 + look, cy: -15, r: 2.3, fill: paint.dark }, g);
    svgEl('circle', { cx: -2.2 + look, cy: -16.2, r: 0.8, fill: '#fff' }, g);
    svgEl('circle', { cx: 13.8 + look, cy: -16.2, r: 0.8, fill: '#fff' }, g);
    svgEl('path', { d: 'M-1 -8 Q 5 -4 11 -8', fill: 'none', stroke: paint.dark, 'stroke-width': 1.3, 'stroke-linecap': 'round' }, g);
    svgEl('ellipse', { cx: -6, cy: 2, rx: 9, ry: 5, fill: 'rgba(255,255,255,.3)' }, g);
  }

  function drawScene(svg, card) {
    const gid = 'sc' + hash(card.id).toString(16);
    const defs = svgEl('defs', null, svg);
    const sky = svgEl('linearGradient', { id: gid, x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
    const skyColors = {
      feuer: ['#fb923c', '#7f1d1d'],
      wasser: ['#7dd3fc', '#075985'],
      pflanze: ['#bbf7d0', '#166534'],
      blitz: ['#64748b', '#1e293b'],
      psycho: ['#581c87', '#1e1b4b'],
      kampf: ['#fdba74', '#9a3412'],
      drache: ['#312e81', '#111827'],
      geist: ['#1e1b4b', '#312e81']
    }[card.type];
    svgEl('stop', { offset: '0%', 'stop-color': skyColors[0] }, sky);
    svgEl('stop', { offset: '100%', 'stop-color': skyColors[1] }, sky);
    svgEl('rect', { width: '240', height: '168', fill: 'url(#' + gid + ')' }, svg);
    if (card.type === 'feuer') {
      svgEl('polygon', { points: '20,150 90,48 150,150', fill: '#44403c' }, svg);
      svgEl('polygon', { points: '70,150 130,70 190,150', fill: '#292524' }, svg);
      svgEl('ellipse', { cx: '120', cy: '148', rx: '70', ry: '16', fill: '#ef4444' }, svg);
      svgEl('ellipse', { cx: '120', cy: '146', rx: '40', ry: '8', fill: '#fde047' }, svg);
    } else if (card.type === 'wasser') {
      svgEl('path', { d: 'M0 110 Q 40 90 80 110 T 160 110 T 240 110 V 168 H 0 Z', fill: '#0369a1' }, svg);
      svgEl('path', { d: 'M0 128 Q 50 112 100 128 T 200 128 T 280 128 V 168 H 0 Z', fill: '#0ea5e9' }, svg);
      svgEl('circle', { cx: '40', cy: '40', r: '16', fill: '#fef9c3' }, svg);
    } else if (card.type === 'pflanze') {
      svgEl('circle', { cx: '190', cy: '36', r: '18', fill: '#fde047' }, svg);
      svgEl('rect', { x: '0', y: '120', width: '240', height: '48', fill: '#166534' }, svg);
      svgEl('polygon', { points: '30,120 52,62 74,120', fill: '#14532d' }, svg);
      svgEl('polygon', { points: '150,120 178,48 206,120', fill: '#052e16' }, svg);
    } else if (card.type === 'blitz') {
      svgEl('ellipse', { cx: '60', cy: '40', rx: '40', ry: '18', fill: '#334155' }, svg);
      svgEl('ellipse', { cx: '120', cy: '34', rx: '50', ry: '20', fill: '#1e293b' }, svg);
      svgEl('polygon', { points: '150,20 132,70 156,70 140,120', fill: '#fde047' }, svg);
    } else if (card.type === 'psycho' || card.type === 'drache') {
      for (let i = 0; i < 8; i++) {
        const x = 16 + ((hash(card.id + i) % 210));
        const y = 12 + ((hash(card.id + 's' + i) % 80));
        svgEl('circle', { cx: x, cy: y, r: 1.2 + (i % 3), fill: '#fff' }, svg);
      }
      svgEl('ellipse', { cx: '120', cy: '70', rx: '70', ry: '28', fill: card.type === 'drache' ? 'rgba(251,191,36,.25)' : 'rgba(232,121,249,.35)' }, svg);
    } else if (card.type === 'kampf') {
      svgEl('circle', { cx: '180', cy: '40', r: '22', fill: '#fde047' }, svg);
      svgEl('rect', { x: '0', y: '118', width: '240', height: '50', fill: '#78350f' }, svg);
    } else {
      svgEl('circle', { cx: '170', cy: '42', r: '22', fill: '#f8fafc' }, svg);
      svgEl('ellipse', { cx: '80', cy: '120', rx: '70', ry: '18', fill: 'rgba(226,232,240,.35)' }, svg);
      svgEl('ellipse', { cx: '150', cy: '132', rx: '60', ry: '14', fill: 'rgba(226,232,240,.25)' }, svg);
    }
    if (card.rarity === 'mythic') {
      for (let i = 0; i < 14; i++) {
        svgEl('circle', {
          cx: (hash(card.id + 'm' + i) % 230) + 5,
          cy: (hash(card.id + 'n' + i) % 150) + 6,
          r: 1 + (i % 2),
          fill: i % 2 ? '#fde047' : '#fff'
        }, svg);
      }
    }
    drawCreature(svg, card, card.alt ? 132 : 120, 92, card.rarity === 'mythic' ? 1.15 : 1);
  }

  function pip(type, small) {
    const node = document.createElement('i');
    node.className = 'pip pip-' + type + (small ? ' pip-sm' : '');
    node.title = TYPES[type] ? TYPES[type].name : 'Neutral';
    node.textContent = type === 'neutral' ? '◆' : TYPES[type].name.slice(0, 1);
    return node;
  }

  function attacksOf(card) {
    const names = ATK[card.type];
    const mainIndex = hash(card.id) % names.length;
    const second = { name: names[mainIndex], damage: card.damage, cost: [card.type, card.type] };
    if (card.stage <= 1 && card.rarity !== 'mythic') {
      second.cost = [card.type];
      return [second];
    }
    const first = {
      name: names[(mainIndex + 2) % names.length],
      damage: Math.max(10, card.damage - 35),
      cost: [card.type]
    };
    if (card.stage >= 3 || card.rarity === 'mythic' || card.alt) second.cost = [card.type, card.type, 'neutral'];
    return [first, second];
  }

  function flavor(card) {
    const place = PLACE[card.type];
    const lines = [
      card.name + ' durchstreift das ' + place + '.',
      'Im ' + place + ' erzählt man sich von ' + card.name + '.',
      card.name + ' ruht nur, wenn der Wind dreht.'
    ];
    return lines[hash(card.id) % lines.length];
  }

  function numberLine(card) {
    if (card.rarity === 'mythic') {
      const myths = SET.filter((entry) => entry.rarity === 'mythic');
      const index = myths.indexOf(card) + 1;
      return 'M' + String(index).padStart(2, '0') + '/' + String(myths.length).padStart(2, '0');
    }
    return String(SET.indexOf(card) + 1).padStart(3, '0') + '/' + SET.length;
  }

  function rarityMark(card) {
    const stars = Math.min(RARITIES[card.rarity].rank, 5);
    return '★'.repeat(Math.max(1, stars));
  }

  function stageLabel(card) {
    if (card.rarity === 'mythic') return 'Mythisch';
    if (card.alt) return 'Alternativ · Stufe 3';
    return 'Stufe ' + card.stage;
  }

  function faceNode(card, count) {
    const root = document.createElement('article');
    root.className = 'tc tc-full rarity-' + card.rarity + ' tc-tilt';
    if (isHoloPlus(card.rarity)) root.classList.add('holo');
    if (card.alt) root.classList.add('bleed');
    if (RARITIES[card.rarity].rank >= 4) root.classList.add('foil-full');
    root.dataset.card = card.id;
    const frame = document.createElement('div');
    frame.className = 'tc-frame';

    const bar = document.createElement('header');
    bar.className = 'tc-namebar';
    const evo = document.createElement('div');
    evo.className = 'tc-evo';
    if (card.evolvesFrom && BY_ID[card.evolvesFrom]) {
      const mini = svgEl('svg', { viewBox: '0 0 80 64', class: 'evo-svg' });
      svgEl('rect', { width: 80, height: 64, fill: TYPES[BY_ID[card.evolvesFrom].type].a }, mini);
      drawCreature(mini, BY_ID[card.evolvesFrom], 40, 36, 0.42);
      evo.appendChild(mini);
    }
    const stage = document.createElement('span');
    stage.textContent = stageLabel(card);
    evo.appendChild(stage);
    const name = document.createElement('b');
    name.className = 'tc-name';
    name.textContent = card.name;
    const hp = document.createElement('div');
    hp.className = 'tc-hp';
    hp.append(document.createTextNode(card.hp + ' KP'), pip(card.type, true));
    bar.append(evo, name, hp);

    const window = document.createElement('div');
    window.className = 'tc-window';
    const scene = svgEl('svg', { viewBox: '0 0 240 168', class: 'tc-scene', preserveAspectRatio: 'xMidYMid slice' });
    drawScene(scene, card);
    window.appendChild(scene);
    const foil = document.createElement('div');
    foil.className = 'tc-foil';
    window.appendChild(foil);
    if (RARITIES[card.rarity].rank >= 4) {
      const sparks = document.createElement('div');
      sparks.className = 'tc-sparks';
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement('i');
        dot.style.left = (10 + (hash(card.id + i) % 78)) + '%';
        dot.style.top = (12 + (hash(card.id + 'y' + i) % 70)) + '%';
        sparks.appendChild(dot);
      }
      window.appendChild(sparks);
    }

    const attacks = document.createElement('div');
    attacks.className = 'tc-attacks';
    attacksOf(card).forEach((attack) => {
      const row = document.createElement('div');
      row.className = 'atk';
      const costs = document.createElement('span');
      costs.className = 'costs';
      attack.cost.forEach((cost) => costs.appendChild(pip(cost, true)));
      const label = document.createElement('span');
      label.className = 'atk-name';
      label.textContent = attack.name;
      const dmg = document.createElement('b');
      dmg.textContent = String(attack.damage);
      row.append(costs, label, dmg);
      attacks.appendChild(row);
    });

    const flavorText = document.createElement('p');
    flavorText.className = 'tc-flavor';
    flavorText.textContent = flavor(card);

    const stats = document.createElement('div');
    stats.className = 'tc-battle';
    [['Schwäche', WEAK[card.type]], ['Resistenz', RESIST[card.type]]].forEach((pair) => {
      const cell = document.createElement('span');
      cell.append(document.createTextNode(pair[0] + ' '), pip(pair[1], true));
      stats.appendChild(cell);
    });
    const retreat = document.createElement('span');
    retreat.append(document.createTextNode('Rückzug '));
    const retreatCost = card.rarity === 'mythic' ? 2 : Math.min(3, card.stage || 1);
    for (let i = 0; i < retreatCost; i++) retreat.appendChild(pip('neutral', true));
    stats.appendChild(retreat);

    const meta = document.createElement('div');
    meta.className = 'tc-foot';
    const illus = document.createElement('span');
    illus.textContent = 'Illus. ' + ILLUS[hash(card.id) % ILLUS.length];
    const num = document.createElement('span');
    num.textContent = numberLine(card) + ' ' + rarityMark(card) + (count > 1 ? ' ×' + count : '');
    meta.append(illus, num);

    frame.append(bar, window, attacks, flavorText, stats, meta);
    if (RARITIES[card.rarity].rank >= 4) {
      const glint = document.createElement('div');
      glint.className = 'tc-glint';
      frame.appendChild(glint);
    }
    root.appendChild(frame);
    bindTilt(root);
    return root;
  }

  function cardBack() {
    const wrap = document.createElement('div');
    wrap.className = 'flip-back';
    const gid = 'bg' + hash(String(Math.random())).toString(16);
    const svg = svgEl('svg', { viewBox: '0 0 200 280', class: 'back-svg' });
    const defs = svgEl('defs', null, svg);
    const gold = svgEl('linearGradient', { id: gid, x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
    svgEl('stop', { offset: '0%', 'stop-color': '#fde68a' }, gold);
    svgEl('stop', { offset: '50%', 'stop-color': '#b45309' }, gold);
    svgEl('stop', { offset: '100%', 'stop-color': '#fde68a' }, gold);
    svgEl('rect', { width: 200, height: 280, rx: 16, fill: '#14081f' }, svg);
    svgEl('rect', { x: 8, y: 8, width: 184, height: 264, rx: 12, fill: 'none', stroke: 'url(#' + gid + ')', 'stroke-width': 4 }, svg);
    svgEl('rect', { x: 16, y: 16, width: 168, height: 248, rx: 8, fill: 'none', stroke: '#7c2d12', 'stroke-width': 2 }, svg);
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 4; x++) {
        svgEl('rect', { x: 36 + x * 34, y: 40 + y * 34, width: 16, height: 16, transform: 'rotate(45 ' + (44 + x * 34) + ' ' + (48 + y * 34) + ')', fill: 'rgba(253,224,71,.16)' }, svg);
      }
    }
    svgEl('circle', { cx: 100, cy: 132, r: 36, fill: 'none', stroke: 'url(#' + gid + ')', 'stroke-width': 4 }, svg);
    svgEl('polygon', { points: '100,104 112,128 138,132 118,150 124,176 100,162 76,176 82,150 62,132 88,128', fill: '#fde047' }, svg);
    const title = svgEl('text', { x: 100, y: 230, 'text-anchor': 'middle', fill: '#fde68a', 'font-size': 16, 'font-family': 'sans-serif' }, svg);
    title.textContent = 'MONSTER';
    wrap.appendChild(svg);
    return wrap;
  }

  function thumbArt(card, owned) {
    const svg = svgEl('svg', { viewBox: '0 0 80 56', class: 'thumb-svg' });
    svgEl('rect', { width: 80, height: 56, rx: 8, fill: owned ? TYPES[card.type].a : '#1f1630' }, svg);
    if (owned) drawCreature(svg, card, 40, 30, 0.48);
    else {
      const mark = svgEl('text', { x: 40, y: 36, 'text-anchor': 'middle', fill: '#a89bb8', 'font-size': 22 }, svg);
      mark.textContent = '?';
    }
    return svg;
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
      const back = cardBack();
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
    art.appendChild(thumbArt(card, count > 0));
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
