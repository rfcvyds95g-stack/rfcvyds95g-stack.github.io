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

  function svgEl(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    if (attrs) Object.keys(attrs).forEach((key) => node.setAttribute(key, String(attrs[key])));
    if (parent) parent.appendChild(node);
    return node;
  }

  const PAINT = {
    feuer: { body: '#ea580c', belly: '#ffedd5', dark: '#7c2d12', mid: '#c2410c', hot: '#fde047' },
    wasser: { body: '#0284c7', belly: '#e0f2fe', dark: '#0c4a6e', mid: '#0369a1', hot: '#7dd3fc' },
    pflanze: { body: '#16a34a', belly: '#ecfccb', dark: '#14532d', mid: '#166534', hot: '#86efac' },
    blitz: { body: '#f59e0b', belly: '#fef3c7', dark: '#78350f', mid: '#d97706', hot: '#fde047' },
    psycho: { body: '#a855f7', belly: '#fae8ff', dark: '#581c87', mid: '#7e22ce', hot: '#e9d5ff' },
    kampf: { body: '#ef4444', belly: '#fee2e2', dark: '#7f1d1d', mid: '#b91c1c', hot: '#fecaca' },
    drache: { body: '#0f766e', belly: '#fef3c7', dark: '#134e4a', mid: '#115e59', hot: '#fbbf24' },
    geist: { body: '#c4b5fd', belly: '#f5f3ff', dark: '#4c1d95', mid: '#6d28d9', hot: '#ddd6fe' }
  };
  const WEAK = { feuer: 'wasser', wasser: 'pflanze', pflanze: 'feuer', blitz: 'kampf', kampf: 'psycho', psycho: 'geist', geist: 'blitz', drache: 'geist' };
  const RESIST = { feuer: 'pflanze', wasser: 'feuer', pflanze: 'wasser', blitz: 'geist', kampf: 'blitz', psycho: 'kampf', geist: 'psycho', drache: 'feuer' };
  const SPECIES = { feuer: 'Flammenwesen', wasser: 'Riffwesen', pflanze: 'Waldwesen', blitz: 'Sturmwesen', psycho: 'Traumwesen', kampf: 'Ringwesen', drache: 'Drachenwesen', geist: 'Nebelwesen' };
  const EFFECT = {
    feuer: 'Lege 1 Feuer-Energie ab. Das gegnerische Monster ist verbrannt.',
    wasser: 'Das gegnerische Monster wird fortgespült und setzt einmal aus.',
    pflanze: 'Heilwurzeln heilen dieses Monster um 20 KP.',
    blitz: 'Wirf eine Münze. Bei Kopf ist das gegnerische Monster gelähmt.',
    psycho: 'Das gegnerische Monster schläft.',
    kampf: 'Dieser Angriff trifft auch Monster auf der Bank für 20 Schaden.',
    drache: 'Wirf eine Münze. Bei Zahl hat dieser Angriff keinen Effekt.',
    geist: 'Lege 1 Energie ab. Das gegnerische Monster ist verwirrt.'
  };

  function drawBeast(svg, card, gid) {
    const paint = PAINT[card.type];
    const bodyId = gid + 'body';
    const bellyId = gid + 'belly';
    const fireId = gid + 'fire';
    const defs = svg.querySelector('defs') || svgEl('defs', null, svg);
    const body = svgEl('linearGradient', { id: bodyId, x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
    svgEl('stop', { offset: '0%', 'stop-color': paint.hot }, body);
    svgEl('stop', { offset: '55%', 'stop-color': paint.body }, body);
    svgEl('stop', { offset: '100%', 'stop-color': paint.dark }, body);
    const belly = svgEl('linearGradient', { id: bellyId, x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
    svgEl('stop', { offset: '0%', 'stop-color': '#fff' }, belly);
    svgEl('stop', { offset: '100%', 'stop-color': paint.belly }, belly);
    const flame = svgEl('radialGradient', { id: fireId, cx: '0.5', cy: '0.8', r: '0.7' }, defs);
    svgEl('stop', { offset: '0%', 'stop-color': '#fff' }, flame);
    svgEl('stop', { offset: '35%', 'stop-color': paint.hot }, flame);
    svgEl('stop', { offset: '100%', 'stop-color': paint.body, 'stop-opacity': '0' }, flame);
    const g = svgEl('g', { transform: 'translate(148 118)' }, svg);
    svgEl('ellipse', { cx: 8, cy: 48, rx: 54, ry: 10, fill: 'rgba(0,0,0,.35)' }, g);
    const stroke = { stroke: paint.dark, 'stroke-width': 1.6, 'stroke-linejoin': 'round' };
    svgEl('path', Object.assign({ d: 'M-18 6 Q-78 18 -96 -8 Q-70 8 -22 16 Z', fill: 'url(#' + bodyId + ')' }, stroke), g);
    if (card.type === 'feuer' || card.type === 'drache') {
      svgEl('path', { d: 'M-90 -6 Q-118 -28 -96 -48 Q-100 -20 -78 -8 Q-92 -24 -70 -36 Q-74 -12 -62 0 Z', fill: 'url(#' + fireId + ')' }, g);
    } else if (card.type === 'wasser') {
      svgEl('path', { d: 'M-78 0 Q-110 -16 -96 16 Q-88 6 -70 10 Z', fill: paint.hot, stroke: paint.dark }, g);
    } else if (card.type === 'blitz') {
      svgEl('polygon', { points: '-70,8 -96,-20 -78,-8 -104,-36 -62,-6', fill: paint.hot, stroke: paint.dark }, g);
    } else if (card.type === 'pflanze') {
      svgEl('ellipse', { cx: -78, cy: -8, rx: 14, ry: 8, fill: paint.hot, stroke: paint.dark }, g);
    }
    svgEl('path', Object.assign({ d: 'M-6 18 L-16 46 L4 46 L8 18 Z', fill: paint.mid }, stroke), g);
    svgEl('path', Object.assign({ d: 'M28 18 L24 46 L46 46 L48 16 Z', fill: paint.mid }, stroke), g);
    svgEl('path', { d: 'M-16 46 l4 -6 l4 6 M-6 46 l4 -6 l4 6 M24 46 l4 -6 l4 6 M36 46 l4 -6 l4 6', fill: paint.belly }, g);
    svgEl('ellipse', Object.assign({ cx: 16, cy: 2, rx: 46, ry: 30, fill: 'url(#' + bodyId + ')' }, stroke), g);
    svgEl('ellipse', { cx: 24, cy: 8, rx: 24, ry: 18, fill: 'url(#' + bellyId + ')' }, g);
    if (card.stage >= 2 || card.rarity === 'mythic') {
      svgEl('path', Object.assign({ d: 'M8 -8 Q-20 -62 -62 -48 Q-28 -36 -24 -18 Q-8 -28 0 -8 Q8 -20 20 -6 Z', fill: paint.mid, opacity: '0.95' }, stroke), g);
    }
    if (card.stage >= 3 || card.alt || card.rarity === 'mythic') {
      svgEl('path', { d: 'M-8 -16 l-8 -22 l16 12 z M6 -24 l-2 -24 l14 16 z M20 -26 l4 -22 l10 18 z', fill: paint.hot, stroke: paint.dark }, g);
    }
    svgEl('path', Object.assign({ d: 'M40 -6 Q62 -34 92 -24 L104 -6 Q78 0 52 10 Z', fill: 'url(#' + bodyId + ')' }, stroke), g);
    svgEl('path', Object.assign({ d: 'M78 -22 Q108 -30 132 -8 Q136 2 118 8 L96 6 Q82 -4 78 -14 Z', fill: 'url(#' + bodyId + ')' }, stroke), g);
    svgEl('path', Object.assign({ d: 'M104 2 L128 4 Q132 12 120 14 L100 10 Z', fill: paint.belly }, stroke), g);
    svgEl('path', { d: 'M108 4 l3 5 l3 -5 M116 4 l3 5 l3 -5 M124 4 l3 5 l3 -5', fill: '#fff', stroke: paint.dark, 'stroke-width': 0.6 }, g);
    svgEl('polygon', { points: '86,-28 74,-52 96,-24', fill: paint.hot, stroke: paint.dark }, g);
    svgEl('polygon', { points: '98,-30 96,-54 112,-26', fill: paint.hot, stroke: paint.dark }, g);
    svgEl('ellipse', { cx: 108, cy: -12, rx: 7, ry: 6, fill: '#fef9c3' }, g);
    svgEl('ellipse', { cx: 110, cy: -12, rx: 2.6, ry: 4.2, fill: '#111' }, g);
    svgEl('circle', { cx: 108.5, cy: -14, r: 1.3, fill: '#fff' }, g);
    svgEl('path', { d: 'M96 -18 L124 -16', stroke: paint.dark, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    if (card.type === 'feuer' || card.type === 'drache') {
      svgEl('path', { d: 'M128 -2 Q168 -12 210 8 L210 36 Q160 16 128 8 Z', fill: 'url(#' + fireId + ')', opacity: '0.9' }, g);
    } else if (card.type === 'wasser') {
      svgEl('path', { d: 'M120 8 Q150 0 168 16 Q150 12 124 18 Z', fill: paint.hot, opacity: '0.8' }, g);
    } else if (card.type === 'psycho') {
      svgEl('circle', { cx: 96, cy: -36, r: 6, fill: paint.hot, stroke: '#fff' }, g);
      svgEl('circle', { cx: 96, cy: -36, r: 2.4, fill: '#fff' }, g);
    }
    if (card.type === 'geist') {
      svgEl('ellipse', { cx: 20, cy: 8, rx: 18, ry: 22, fill: paint.hot, opacity: '0.35' }, g);
    }
  }

  function drawScene(svg, card) {
    const gid = 'sc' + hash(card.id).toString(16);
    const defs = svgEl('defs', null, svg);
    const sky = svgEl('linearGradient', { id: gid, x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
    const skies = {
      feuer: ['#1c0505', '#7c2d12', '#f97316'],
      wasser: ['#082f49', '#0369a1', '#7dd3fc'],
      pflanze: ['#052e16', '#166534', '#86efac'],
      blitz: ['#0f172a', '#334155', '#fde047'],
      psycho: ['#1e1b4b', '#581c87', '#e9d5ff'],
      kampf: ['#431407', '#9a3412', '#fdba74'],
      drache: ['#1e1b4b', '#312e81', '#fbbf24'],
      geist: ['#020617', '#312e81', '#cbd5e1']
    }[card.type];
    skies.forEach((color, index) => svgEl('stop', { offset: Math.round(index * 50) + '%', 'stop-color': color }, sky));
    svgEl('rect', { width: 300, height: 190, fill: 'url(#' + gid + ')' }, svg);
    if (card.type === 'feuer') {
      svgEl('path', { d: 'M0 150 L50 70 L80 95 L110 40 L135 75 L150 60 L190 150Z', fill: '#3b0a0a' }, svg);
      svgEl('path', { d: 'M110 40 Q100 20 108 5 Q115 22 125 12 Q120 30 110 40Z', fill: '#fde047' }, svg);
      svgEl('path', { d: 'M170 150 L230 80 L260 110 L300 70 L300 150Z', fill: '#450a0a' }, svg);
      svgEl('path', { d: 'M0 162 Q80 142 150 160 T300 154 L300 190 L0 190Z', fill: '#ea580c' }, svg);
      svgEl('path', { d: 'M0 174 Q70 160 140 174 T300 168', stroke: '#fef08a', 'stroke-width': 2, fill: 'none' }, svg);
    } else if (card.type === 'wasser') {
      svgEl('circle', { cx: 46, cy: 36, r: 16, fill: '#fef9c3' }, svg);
      svgEl('path', { d: 'M0 120 Q70 96 140 122 T300 116 L300 190 L0 190Z', fill: '#075985' }, svg);
      svgEl('path', { d: 'M0 146 Q80 128 160 148 T320 140 L320 190 L0 190Z', fill: '#0284c7' }, svg);
    } else if (card.type === 'pflanze') {
      svgEl('circle', { cx: 250, cy: 36, r: 22, fill: '#fde047' }, svg);
      svgEl('path', { d: 'M20 150 L48 70 L78 150Z', fill: '#14532d' }, svg);
      svgEl('path', { d: 'M180 150 L214 48 L250 150Z', fill: '#052e16' }, svg);
      svgEl('rect', { x: 0, y: 148, width: 300, height: 42, fill: '#166534' }, svg);
    } else if (card.type === 'blitz') {
      svgEl('ellipse', { cx: 70, cy: 42, rx: 48, ry: 18, fill: '#1e293b' }, svg);
      svgEl('ellipse', { cx: 150, cy: 36, rx: 60, ry: 22, fill: '#0f172a' }, svg);
      svgEl('polygon', { points: '188,18 164,78 196,74 170,140', fill: '#fde047' }, svg);
      svgEl('rect', { x: 0, y: 150, width: 300, height: 40, fill: '#1f2937' }, svg);
    } else if (card.type === 'kampf') {
      svgEl('circle', { cx: 240, cy: 42, r: 26, fill: '#fde047' }, svg);
      svgEl('path', { d: 'M0 120 L40 80 L90 120 L140 70 L190 120 L240 90 L300 120 L300 190 L0 190Z', fill: '#7c2d12' }, svg);
      svgEl('rect', { x: 0, y: 150, width: 300, height: 40, fill: '#78350f' }, svg);
    } else if (card.type === 'geist') {
      svgEl('circle', { cx: 230, cy: 40, r: 26, fill: '#f8fafc' }, svg);
      svgEl('ellipse', { cx: 80, cy: 150, rx: 90, ry: 22, fill: 'rgba(226,232,240,.28)' }, svg);
      svgEl('ellipse', { cx: 190, cy: 162, rx: 80, ry: 16, fill: 'rgba(226,232,240,.22)' }, svg);
    } else {
      for (let i = 0; i < 10; i++) {
        svgEl('circle', { cx: 20 + (hash(card.id + 's' + i) % 260), cy: 12 + (hash(card.id + 't' + i) % 90), r: 1.2, fill: '#fff' }, svg);
      }
      svgEl('ellipse', { cx: 160, cy: 70, rx: 90, ry: 28, fill: card.type === 'drache' ? 'rgba(251,191,36,.22)' : 'rgba(216,180,254,.28)' }, svg);
      svgEl('path', { d: 'M0 150 L60 90 L120 140 L180 70 L240 130 L300 100 L300 190 L0 190Z', fill: '#1e1b4b' }, svg);
    }
    if (card.rarity === 'mythic' || isHoloPlus(card.rarity)) {
      for (let i = 0; i < 8; i++) {
        svgEl('circle', { cx: 16 + (hash(card.id + 'p' + i) % 270), cy: 10 + (hash(card.id + 'q' + i) % 120), r: 1.1 + (i % 2), fill: '#fff' }, svg);
      }
    }
    drawBeast(svg, card, gid);
  }

  function pip(type) {
    const node = document.createElement('i');
    node.className = 'orb orb-' + (type || 'neutral');
    node.textContent = type && type !== 'neutral' && TYPES[type] ? TYPES[type].name.slice(0, 1) : '';
    return node;
  }

  function attacksOf(card) {
    const names = ATK[card.type];
    const mainIndex = hash(card.id) % names.length;
    const strong = { name: names[mainIndex], damage: card.damage, cost: [card.type, card.type], effect: EFFECT[card.type] };
    if ((card.stage || 1) <= 1 && card.rarity !== 'mythic') {
      strong.cost = [card.type];
      strong.effect = '';
      return [strong];
    }
    const weak = { name: names[(mainIndex + 2) % names.length], damage: Math.max(20, Math.round(card.damage * 0.4)), cost: [card.type], effect: '' };
    if ((card.stage || 1) >= 3 || card.rarity === 'mythic' || card.alt) strong.cost = [card.type, card.type, 'neutral'];
    return [weak, strong];
  }

  function measures(card) {
    const step = card.rarity === 'mythic' ? 4 : Math.min(3, card.stage || 1);
    const sizes = [0.5, 0.9, 1.6, 2.4, 4.2];
    const weights = [6, 24, 80, 190, 520];
    const jitter = hash(card.id) % 5;
    return {
      size: String(sizes[step] + jitter / 20).replace('.', ','),
      weight: weights[step] + jitter * 4
    };
  }

  function flavor(card) {
    const place = { feuer: 'Vulkanen', wasser: 'Riffen', pflanze: 'Mooswäldern', blitz: 'Gewitterfeldern', psycho: 'Traumnebeln', kampf: 'Ringplätzen', drache: 'Drachenpässen', geist: 'Mondbrüchen' }[card.type];
    const lines = [
      card.name + ' schläft nur dort, wo das ' + SPECIES[card.type] + ' zu Hause ist.',
      'Sein Ruf hallt durch die ' + place + ', lange bevor man es sieht.',
      card.name + ' nährt sich an der Kraft der ' + place + '.'
    ];
    return lines[hash(card.name) % lines.length];
  }

  function numberLine(card) {
    if (card.rarity === 'mythic') {
      const myths = SET.filter((entry) => entry.rarity === 'mythic');
      return 'M' + String(myths.indexOf(card) + 1).padStart(2, '0') + '/' + String(myths.length).padStart(2, '0');
    }
    return String(SET.indexOf(card) + 1).padStart(3, '0') + '/' + SET.length;
  }

  function stageLabel(card) {
    if (card.rarity === 'mythic') return 'Mythisch';
    if (card.alt) return 'Alternativ';
    return 'Stufe ' + card.stage;
  }

  function faceNode(card, count) {
    const root = document.createElement('article');
    root.className = 'tc tc-legends rarity-' + card.rarity + ' tc-tilt';
    if (isHoloPlus(card.rarity)) root.classList.add('holo');
    if (card.alt) root.classList.add('alt-art');
    root.dataset.card = card.id;
    const inner = document.createElement('div');
    inner.className = 'leg-inner type-' + card.type;
    const pattern = document.createElement('div');
    pattern.className = 'leg-pattern';
    const hdr = document.createElement('header');
    hdr.className = 'leg-hdr';
    const evo = document.createElement('div');
    evo.className = 'leg-evo';
    if (card.evolvesFrom && BY_ID[card.evolvesFrom]) {
      evo.textContent = BY_ID[card.evolvesFrom].emoji;
    }
    const titles = document.createElement('div');
    const stage = document.createElement('div');
    stage.className = 'leg-stage';
    stage.textContent = stageLabel(card).toUpperCase();
    const name = document.createElement('div');
    name.className = 'leg-name';
    name.textContent = card.name;
    titles.append(stage, name);
    const hp = document.createElement('div');
    hp.className = 'leg-hp';
    const hpNum = document.createElement('b');
    hpNum.textContent = String(card.hp);
    hp.append(document.createTextNode('KP '), hpNum, pip(card.type));
    hdr.append(evo, titles, hp);
    const art = document.createElement('div');
    art.className = 'leg-art';
    const scene = svgEl('svg', { viewBox: '0 0 300 190', preserveAspectRatio: 'xMidYMid slice' });
    drawScene(scene, card);
    art.appendChild(scene);
    if (isHoloPlus(card.rarity)) {
      const foil = document.createElement('div');
      foil.className = 'leg-foil';
      art.appendChild(foil);
    }
    const info = document.createElement('div');
    info.className = 'leg-info';
    const size = measures(card);
    info.textContent = SPECIES[card.type] + ' · Größe ' + size.size + ' m · Gewicht ' + size.weight + ' kg';
    const attacks = document.createElement('div');
    let effect = '';
    attacksOf(card).forEach((attack) => {
      const row = document.createElement('div');
      row.className = 'leg-atk';
      const costs = document.createElement('div');
      costs.className = 'leg-cost';
      attack.cost.forEach((cost) => costs.appendChild(pip(cost)));
      const label = document.createElement('div');
      label.className = 'leg-an';
      label.textContent = attack.name;
      const dmg = document.createElement('div');
      dmg.className = 'leg-dmg';
      dmg.textContent = String(attack.damage);
      row.append(costs, label, dmg);
      attacks.appendChild(row);
      if (attack.effect) effect = attack.effect;
    });
    const desc = document.createElement('div');
    desc.className = 'leg-desc';
    desc.textContent = effect;
    const line = document.createElement('div');
    line.className = 'leg-line';
    const wrr = document.createElement('div');
    wrr.className = 'leg-wrr';
    [['Schwäche', WEAK[card.type], '×2'], ['Resistenz', RESIST[card.type], '−30']].forEach((part) => {
      const cell = document.createElement('div');
      cell.append(document.createTextNode(part[0] + ' '), pip(part[1]), document.createTextNode(part[2]));
      wrr.appendChild(cell);
    });
    const retreat = document.createElement('div');
    retreat.append(document.createTextNode('Rückzug '));
    const steps = card.rarity === 'mythic' ? 2 : Math.min(3, card.stage || 1);
    for (let i = 0; i < steps; i++) retreat.appendChild(pip('neutral'));
    wrr.appendChild(retreat);
    const quote = document.createElement('div');
    quote.className = 'leg-flavor';
    quote.textContent = flavor(card);
    const foot = document.createElement('div');
    foot.className = 'leg-foot';
    const illus = document.createElement('span');
    illus.textContent = 'Illus. Lucky Studio';
    const rar = document.createElement('span');
    rar.className = 'leg-rar';
    rar.textContent = '★ ' + RARITIES[card.rarity].name;
    const num = document.createElement('span');
    num.textContent = numberLine(card) + (count > 1 ? ' ×' + count : '');
    foot.append(illus, rar, num);
    inner.append(pattern, hdr, art, info, attacks, desc, line, wrr, quote, foot);
    if (RARITIES[card.rarity].rank >= 6) {
      const glint = document.createElement('div');
      glint.className = 'leg-glint';
      inner.appendChild(glint);
    }
    root.appendChild(inner);
    bindTilt(root);
    return root;
  }

  function cardBack() {
    const wrap = document.createElement('div');
    wrap.className = 'flip-back legends-back';
    const stars = document.createElement('div');
    stars.className = 'back-stars';
    const ring = document.createElement('div');
    ring.className = 'back-ring';
    const core = document.createElement('div');
    core.className = 'back-core';
    core.append(document.createTextNode('MONSTER'), document.createElement('br'), document.createTextNode('LEGENDS'));
    const small = document.createElement('small');
    small.textContent = 'SAMMELKARTEN';
    core.appendChild(small);
    ring.appendChild(core);
    wrap.append(stars, ring);
    return wrap;
  }

  function thumbArt(card, owned) {
    const svg = svgEl('svg', { viewBox: '0 0 80 56', class: 'thumb-svg' });
    svgEl('rect', { width: 80, height: 56, rx: 8, fill: owned ? PAINT[card.type].mid : '#1f1630' }, svg);
    if (owned) {
      const mark = svgEl('text', { x: 40, y: 36, 'text-anchor': 'middle', 'font-size': 22 }, svg);
      mark.textContent = card.emoji;
    } else {
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
