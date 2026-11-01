(function () {
  const C = (window.Casino = window.Casino || {});

  const TYPES = {
    feuer: { name: 'Feuer', a: '#7f1d1d', b: '#fb923c' },
    wasser: { name: 'Wasser', a: '#0c4a6e', b: '#38bdf8' },
    pflanze: { name: 'Pflanze', a: '#14532d', b: '#4ade80' },
    blitz: { name: 'Blitz', a: '#713f12', b: '#facc15' },
    psycho: { name: 'Psycho', a: '#4c1d95', b: '#e879f9' },
    kampf: { name: 'Kampf', a: '#7f1d1d', b: '#fca5a5' },
    drache: { name: 'Drache', a: '#1e3a8a', b: '#f59e0b' },
    geist: { name: 'Geist', a: '#1e1b4b', b: '#a78bfa' }
  };

  const RARITIES = {
    common: { name: 'Häufig', rank: 0, sell: 5 },
    uncommon: { name: 'Ungewöhnlich', rank: 1, sell: 12 },
    rare: { name: 'Selten', rank: 2, sell: 25 },
    holo: { name: 'Holo-Selten', rank: 3, sell: 60 },
    ultra: { name: 'Ultra-Selten', rank: 4, sell: 150 },
    secret: { name: 'Geheim-Selten', rank: 5, sell: 400 }
  };

  const PACKS = {
    basis: { id: 'basis', name: 'Basis-Pack', price: 100, text: 'Fünf Karten. Eine davon ist mindestens Selten.' },
    element: { id: 'element', name: 'Elementar-Pack', price: 220, text: 'Mehr Karten eines Elements und eine bessere Selten-Chance.' },
    premium: { id: 'premium', name: 'Premium-Pack', price: 480, text: 'Deutlich höhere Chance auf Holo, Ultra und Geheim.' }
  };

  const FILL = {
    basis: [{ id: 'common', w: 70 }, { id: 'uncommon', w: 30 }],
    element: [{ id: 'common', w: 60 }, { id: 'uncommon', w: 40 }],
    premium: [{ id: 'common', w: 45 }, { id: 'uncommon', w: 55 }]
  };
  const HIT = {
    basis: [{ id: 'rare', w: 70 }, { id: 'holo', w: 22 }, { id: 'ultra', w: 6 }, { id: 'secret', w: 2 }],
    element: [{ id: 'rare', w: 50 }, { id: 'holo', w: 32 }, { id: 'ultra', w: 13 }, { id: 'secret', w: 5 }],
    premium: [{ id: 'rare', w: 5 }, { id: 'holo', w: 45 }, { id: 'ultra', w: 35 }, { id: 'secret', w: 15 }]
  };
  const MID_PREMIUM = [{ id: 'rare', w: 70 }, { id: 'holo', w: 30 }];

  const ROWS = {
    feuer: [
      ['Glutling', '🦎', 50, 'Funkenstoß', 20],
      ['Aschenpfote', '🐾', 60, 'Glutbiss', 30],
      ['Zunderbock', '🐐', 70, 'Hornbrand', 40],
      ['Flammkralle', '🦅', 70, 'Feuerkralle', 40],
      ['Lavafuchs', '🦊', 90, 'Schweifbrand', 60],
      ['Kohleschwinge', '🦇', 100, 'Glutflug', 70],
      ['Magmahuf', '🐂', 120, 'Lavastampfer', 80],
      ['Pyronyx', '🦁', 140, 'Sonnenodem', 100],
      ['Inferkron', '👑', 170, 'Kernbruch', 130]
    ],
    wasser: [
      ['Tropfling', '💧', 50, 'Spritzer', 20],
      ['Bachpfote', '🦦', 60, 'Wellenbiss', 30],
      ['Perlmuschel', '🐚', 70, 'Perlenhieb', 40],
      ['Flutotter', '🦭', 70, 'Gischt', 40],
      ['Wellenspringer', '🐬', 90, 'Flutwelle', 60],
      ['Gischtadler', '🦢', 100, 'Sturzflug', 70],
      ['Tiefwal', '🐋', 120, 'Strudel', 80],
      ['Aquoryx', '🦈', 140, 'Gezeiten', 100],
      ['Ozeankrone', '🌊', 170, 'Abgrund', 130]
    ],
    pflanze: [
      ['Knospling', '🌱', 50, 'Ranke', 20],
      ['Moospfote', '🍄', 60, 'Sporen', 30],
      ['Dornenkäfer', '🪲', 70, 'Dornstoß', 40],
      ['Blütenluchs', '🐱', 70, 'Blütenhieb', 40],
      ['Rankenzweig', '🌵', 90, 'Dornenwall', 60],
      ['Wurzeltroll', '🌳', 100, 'Wurzelgriff', 70],
      ['Sonnendorn', '🌻', 120, 'Sonnenstich', 80],
      ['Chloronyx', '🍀', 140, 'Blattsturm', 100],
      ['Urwaldherz', '🌺', 170, 'Urwuchs', 130]
    ],
    blitz: [
      ['Funkenling', '⚡', 50, 'Knister', 20],
      ['Zischpfote', '🐿️', 60, 'Zischbiss', 30],
      ['Blitzhase', '🐰', 70, 'Sprungblitz', 40],
      ['Donnerkäfer', '🐝', 70, 'Summstoß', 40],
      ['Spannungsfuchs', '🦊', 90, 'Entladung', 60],
      ['Gewitterfalke', '🦅', 100, 'Sturzblitz', 70],
      ['Voltbulle', '🐃', 120, 'Donnertritt', 80],
      ['Elektrophex', '🐆', 140, 'Lichtbogen', 100],
      ['Sturmkrone', '⚙️', 170, 'Überlast', 130]
    ],
    psycho: [
      ['Traumling', '🌀', 50, 'Gedankenhauch', 20],
      ['Nebelpfote', '🐱', 60, 'Traumkratzer', 30],
      ['Gedankenfalter', '🦋', 70, 'Wirbel', 40],
      ['Spiegelkater', '🐈', 70, 'Spiegelhieb', 40],
      ['Seelenkauz', '🦉', 90, 'Hypnose', 60],
      ['Hypnoschwan', '🦢', 100, 'Schlaflied', 70],
      ['Mentalhirsch', '🦌', 120, 'Gedankenstoß', 80],
      ['Psionyx', '🦄', 140, 'Seelenblick', 100],
      ['Astralweiser', '✨', 180, 'Sternenriss', 140]
    ],
    kampf: [
      ['Muckling', '🐭', 50, 'Prankenhieb', 20],
      ['Prankenpfote', '🐾', 60, 'Haken', 30],
      ['Ringrabe', '🐦', 70, 'Schnabelstoß', 40],
      ['Stoßziege', '🐐', 70, 'Kopfnuss', 40],
      ['Faustbär', '🐻', 90, 'Schwinger', 60],
      ['Wirbelmarder', '🦡', 100, 'Wirbeltritt', 70],
      ['Arenochse', '🐂', 120, 'Rammbock', 80],
      ['Kampfnyx', '🦍', 140, 'Titanfaust', 100],
      ['Ringmeister', '🏆', 180, 'Schlussgong', 140]
    ],
    drache: [
      ['Schuppling', '🦎', 60, 'Funkenzahn', 20],
      ['Klauenpfote', '🐾', 70, 'Klauengriff', 30],
      ['Flügelwyrm', '🐲', 80, 'Flügelschlag', 40],
      ['Kristalldrache', '💎', 90, 'Kristallbiss', 50],
      ['Sturmwyrm', '🌪️', 110, 'Sturmfauch', 70],
      ['Goldkamm', '👑', 120, 'Goldatem', 80],
      ['Höhlenwurm', '🪱', 140, 'Erdspalt', 90],
      ['Drachenyx', '🐉', 160, 'Drachenodem', 110],
      ['Urwyrm', '☄️', 190, 'Urfunke', 150]
    ],
    geist: [
      ['Schattenling', '🌑', 50, 'Schattenhauch', 20],
      ['Nebelhauch', '💨', 60, 'Nebelgriff', 30],
      ['Irrlicht', '🕯️', 70, 'Irrfunke', 40],
      ['Gruftkauz', '🦉', 80, 'Nachtschrei', 40],
      ['Seelennebel', '🌫️', 100, 'Seelenraub', 60],
      ['Nachtpuppe', '🎭', 110, 'Fadengriff', 70],
      ['Grabwächter', '🪦', 130, 'Gruftschlag', 80],
      ['Phantomnyx', '👻', 150, 'Geisterkuss', 100],
      ['Flüsternacht', '🌙', 190, 'Ewiger Hauch', 150]
    ]
  };

  const TYPE_ORDER = Object.keys(ROWS);
  const SET = [];
  TYPE_ORDER.forEach((type, typeIndex) => {
    ROWS[type].forEach((row, index) => {
      const rarity = index < 8
        ? ['common', 'common', 'common', 'common', 'uncommon', 'uncommon', 'rare', 'holo'][index]
        : (typeIndex < 4 ? 'ultra' : 'secret');
      SET.push({
        id: type + '-' + (index + 1),
        type: type,
        rarity: rarity,
        name: row[0],
        emoji: row[1],
        hp: row[2],
        attack: row[3],
        damage: row[4]
      });
    });
  });
  const BY_ID = {};
  SET.forEach((card) => { BY_ID[card.id] = card; });

  let opening = false;
  let currentPull = [];
  let revealed = [];
  let elementType = 'feuer';
  let sellArmed = false;
  let detailId = null;

  function $(id) { return document.getElementById(id); }
  function fast() { return !!(C.timing && C.timing.fast); }
  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i++) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }
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
    const match = (card) => card.rarity === rarity && (!type || card.type === type) && !used.has(card.id);
    let pool = SET.filter(match);
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
    SET.forEach((card) => {
      if ((bag[card.id] || 0) <= 0) return;
      unique += 1;
      if (isHoloPlus(card.rarity)) holos += 1;
      if (card.rarity === 'secret') secrets += 1;
    });
    C.state.setCollectionCounters({ unique: unique, holos: holos, secrets: secrets });
  }

  function selfCheck() {
    const failures = [];
    const names = {};
    SET.forEach((card) => {
      if (names[card.name]) failures.push('Doppelname ' + card.name);
      names[card.name] = true;
    });
    if (SET.length !== 72) failures.push('Setgröße ' + SET.length);
    const banned = ['pokemon', 'pokémon', 'pikachu', 'glurak', 'schiggy', 'bisasam', 'nintendo', 'mewtu', 'charizard'];
    const blob = JSON.stringify(SET).toLowerCase();
    banned.forEach((word) => { if (blob.indexOf(word) !== -1) failures.push('Verbotenes Wort ' + word); });
    let basisReturn = 0;
    const hitCounts = { rare: 0, holo: 0, ultra: 0, secret: 0 };
    const runs = 3000;
    for (let i = 0; i < runs; i++) {
      const pack = rollPack('basis', null, Math.random);
      if (pack.length !== 5) failures.push('Packlänge');
      const ids = {};
      pack.forEach((card) => { ids[card.id] = (ids[card.id] || 0) + 1; });
      if (Object.keys(ids).length !== 5) failures.push('Duplikat im Pack');
      if (!isRarePlus(pack[4].rarity)) failures.push('Slot 5 nicht selten');
      if (!pack.some((card) => isRarePlus(card.rarity))) failures.push('Keine Selten+');
      hitCounts[pack[4].rarity] += 1;
      pack.forEach((card) => { basisReturn += RARITIES[card.rarity].sell; });
    }
    if (hitCounts.rare < 1900 || hitCounts.rare > 2300) failures.push('Selten-Rate ' + hitCounts.rare);
    if (hitCounts.holo < 500 || hitCounts.holo > 850) failures.push('Holo-Rate ' + hitCounts.holo);
    if (hitCounts.secret < 20 || hitCounts.secret > 120) failures.push('Geheim-Rate ' + hitCounts.secret);
    if (basisReturn / runs >= PACKS.basis.price) failures.push('Verkauf zu hoch ' + (basisReturn / runs));
    let elementHits = 0;
    let elementCards = 0;
    for (let i = 0; i < 800; i++) {
      rollPack('element', 'wasser', Math.random).forEach((card) => {
        elementCards += 1;
        if (card.type === 'wasser') elementHits += 1;
      });
      const premium = rollPack('premium', null, Math.random);
      if (!isRarePlus(premium[4].rarity) || !isRarePlus(premium[3].rarity)) failures.push('Premium ohne Selten+');
    }
    if (elementHits / elementCards < 0.55) failures.push('Elementar-Anteil ' + (elementHits / elementCards));
    return { failures: failures };
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
    const gid = 'g' + seed.toString(16) + '-' + Math.floor(Math.random() * 1e9).toString(16);
    gradient.setAttribute('id', gid);
    gradient.setAttribute('x1', '0');
    gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '1');
    gradient.setAttribute('y2', '1');
    const stopA = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stopA.setAttribute('offset', '0%');
    stopA.setAttribute('stop-color', type.a);
    const stopB = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stopB.setAttribute('offset', '100%');
    stopB.setAttribute('stop-color', type.b);
    gradient.append(stopA, stopB);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '160');
    bg.setAttribute('height', '104');
    bg.setAttribute('fill', 'url(#' + gid + ')');
    svg.appendChild(bg);
    for (let i = 0; i < 3; i++) {
      const blob = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const x = 30 + ((seed >> (i * 5)) & 1023) % 100;
      const y = 24 + ((seed >> (i * 3 + 2)) & 511) % 60;
      const r = 10 + ((seed >> (i + 4)) & 15);
      blob.setAttribute('cx', String(x));
      blob.setAttribute('cy', String(y));
      blob.setAttribute('r', String(r));
      blob.setAttribute('fill', 'rgba(255,255,255,.18)');
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
    type.textContent = TYPES[card.type].name;
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
    $('cards-binder').classList.add('hidden');
    $('tab-shop').classList.add('active');
    $('tab-binder').classList.remove('active');
    renderShop();
  }

  function showBinder() {
    if (opening) return;
    $('cards-shop').classList.add('hidden');
    $('cards-open').classList.add('hidden');
    $('cards-binder').classList.remove('hidden');
    $('tab-shop').classList.remove('active');
    $('tab-binder').classList.add('active');
    renderBinder();
  }

  function ownedCount() {
    const bag = C.state.cardBag();
    return SET.filter((card) => (bag[card.id] || 0) > 0).length;
  }

  function renderShop() {
    const credits = C.state.get().credits;
    $('buy-basis').disabled = opening || credits < PACKS.basis.price;
    $('buy-element').disabled = opening || credits < PACKS.element.price;
    $('buy-premium').disabled = opening || credits < PACKS.premium.price;
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
      return;
    }
    pack.classList.add('hidden');
    $('pack-tear').classList.add('hidden');
    $('reveal-all').classList.toggle('hidden', revealed.every(Boolean));
    $('open-done').classList.toggle('hidden', !revealed.every(Boolean));
    currentPull.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'flipper' + (revealed[index] ? ' revealed' : '');
      button.dataset.index = String(index);
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

  function revealOne(index) {
    if (revealed[index]) return;
    revealed[index] = true;
    const card = currentPull[index];
    if (C.audio) {
      C.audio.card();
      if (card.rarity === 'ultra' || card.rarity === 'secret') C.audio.fanfare();
      else if (isHoloPlus(card.rarity)) C.audio.holo();
    }
    if (card.rarity === 'ultra' || card.rarity === 'secret') C.effects.celebrate('mega');
    else if (card.rarity === 'holo') C.effects.celebrate('big');
    if (revealed.every(Boolean)) opening = false;
    renderOpen();
    renderShop();
  }

  function buy(packId) {
    if (opening) return;
    const pack = PACKS[packId];
    if (C.state.get().credits < pack.price) {
      if (C.app && C.app.toast) C.app.toast('Nicht genug Credits.');
      return;
    }
    const type = packId === 'element' ? elementType : null;
    const pulls = C.cards._debugPack || rollPack(packId, type, Math.random);
    C.cards._debugPack = null;
    opening = true;
    C.state.addCredits(-pack.price);
    const bag = C.state.cardBag();
    pulls.forEach((card) => { bag[card.id] = (bag[card.id] || 0) + 1; });
    C.state.saveCardBag(bag);
    C.state.recordRound({ game: 'cards', wagered: pack.price, payout: 0, pack: true });
    syncCounters();
    currentPull = pulls;
    revealed = [];
    $('cards-shop').classList.add('hidden');
    $('cards-binder').classList.add('hidden');
    $('cards-open').classList.remove('hidden');
    $('open-title').textContent = pack.name;
    renderOpen();
  }

  function renderBinder() {
    const bag = C.state.cardBag();
    const owned = ownedCount();
    $('binder-progress').textContent = owned + ' / ' + SET.length + ' · ' + Math.floor(owned * 100 / SET.length) + ' % der Sammlung';
    const type = $('filter-type').value;
    const rarity = $('filter-rarity').value;
    const sort = $('filter-sort').value;
    const onlyMissing = $('filter-missing').checked;
    const onlyDupes = $('filter-dupes').checked;
    let list = SET.filter((card) => {
      if (type && card.type !== type) return false;
      if (rarity && card.rarity !== rarity) return false;
      const count = bag[card.id] || 0;
      if (onlyMissing && count > 0) return false;
      if (onlyDupes && count < 2) return false;
      return true;
    });
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'de');
      if (sort === 'rarity') return RARITIES[b.rarity].rank - RARITIES[a.rarity].rank;
      if (sort === 'owned') return (bag[b.id] || 0) - (bag[a.id] || 0);
      return SET.indexOf(a) - SET.indexOf(b);
    });
    const grid = $('binder-grid');
    grid.replaceChildren();
    list.forEach((card) => {
      const count = bag[card.id] || 0;
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
      meta.textContent = TYPES[card.type].name + ' · ' + RARITIES[card.rarity].name;
      button.append(art, name, meta);
      if (count > 1) {
        const badge = document.createElement('i');
        badge.textContent = '×' + count;
        button.appendChild(badge);
      }
      button.addEventListener('click', () => openDetail(card.id));
      grid.appendChild(button);
    });
    const value = dupeValue(bag);
    sellArmed = false;
    $('sell-dupes').textContent = value > 0 ? 'Duplikate verkaufen · +' + C.state.fmt(value) : 'Keine Duplikate';
    $('sell-dupes').disabled = value <= 0;
    $('sell-dupes').dataset.value = String(value);
  }

  function openDetail(id) {
    const card = BY_ID[id];
    if (!card) return;
    detailId = id;
    const bag = C.state.cardBag();
    const host = $('detail-card');
    host.replaceChildren(faceNode(card, bag[id] || 0));
    $('detail-count').textContent = (bag[id] || 0) > 0
      ? 'Im Besitz: ' + (bag[id] || 0)
      : 'Noch nicht in der Sammlung.';
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
    SET.forEach((card) => {
      if ((bag[card.id] || 0) > 1) bag[card.id] = 1;
    });
    C.state.saveCardBag(bag);
    C.state.noteSale(value);
    sellArmed = false;
    if (C.app && C.app.toast) C.app.toast('Duplikate verkauft: +' + C.state.fmt(value) + ' Credits');
    renderBinder();
    renderShop();
  }

  function debugGrant(id, count) {
    const bag = C.state.cardBag();
    bag[id] = (bag[id] || 0) + count;
    C.state.saveCardBag(bag);
    syncCounters();
  }

  function init() {
    const types = $('element-types');
    TYPE_ORDER.forEach((id) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.element = id;
      button.textContent = TYPES[id].name;
      button.addEventListener('click', () => {
        elementType = id;
        renderShop();
      });
      types.appendChild(button);
    });
    const typeFilter = $('filter-type');
    const rarityFilter = $('filter-rarity');
    TYPE_ORDER.forEach((id) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = TYPES[id].name;
      typeFilter.appendChild(option);
    });
    Object.keys(RARITIES).forEach((id) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = RARITIES[id].name;
      rarityFilter.appendChild(option);
    });
    $('buy-basis').addEventListener('click', () => buy('basis'));
    $('buy-element').addEventListener('click', () => buy('element'));
    $('buy-premium').addEventListener('click', () => buy('premium'));
    $('tab-shop').addEventListener('click', showShop);
    $('tab-binder').addEventListener('click', showBinder);
    $('pack-tear').addEventListener('click', () => {
      if (C.audio) C.audio.packTear();
      const pack = $('pack-visual');
      pack.classList.add('torn');
      window.setTimeout(() => {
        revealed = currentPull.map(() => false);
        renderOpen();
      }, fast() ? 20 : 420);
    });
    $('reveal-all').addEventListener('click', () => {
      currentPull.forEach((card, index) => {
        if (!revealed[index]) revealOne(index);
      });
    });
    $('open-done').addEventListener('click', () => {
      opening = false;
      showBinder();
    });
    $('sell-dupes').addEventListener('click', sellDupes);
    $('detail-close').addEventListener('click', () => {
      $('card-detail').classList.add('hidden');
      detailId = null;
    });
    ['filter-type', 'filter-rarity', 'filter-sort'].forEach((id) => {
      $(id).addEventListener('change', renderBinder);
    });
    $('filter-missing').addEventListener('change', renderBinder);
    $('filter-dupes').addEventListener('change', renderBinder);
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
      desc: 'Öffne Booster und sammle 72 originale Monster. Nur Spielcredits.',
      tag: '5 Karten je Pack',
      card: 'linear-gradient(135deg,#4c1d95,#9a3412)'
    },
    init: init,
    onShow() {
      if (!opening) showShop();
      else renderOpen();
    },
    refresh() {
      if ($('view-cards').classList.contains('hidden')) return;
      renderShop();
      if (!$('cards-binder').classList.contains('hidden')) renderBinder();
    },
    isBusy: () => opening,
    close() { return !opening; },
    rollPack: rollPack,
    selfCheck: selfCheck,
    debugGrant: debugGrant,
    _debugPack: null
  };
})();
