(function () {
  const C = (window.Casino = window.Casino || {});
  const FS_KEY = 'slots_fs';

  const GAMES = {
    classic: {
      name: 'Lucky Classic', icons: '🍒🔔7️⃣', desc: 'Der Klassiker: 3 Walzen, 1 Gewinnlinie.', tag: '3 Walzen · 1 Linie',
      card: 'linear-gradient(135deg,#b91c1c,#7c2d12)', accent: '#fbbf24', glow: 'rgba(251,191,36,.45)',
      panel: 'linear-gradient(180deg,#7c2d12,#450a0a)',
      reels: 3, rows: 1, lines: [[0, 0, 0]],
      symbols: [
        { s: '🍒', w: 30, pay: { 1: 1, 2: 3, 3: 5 } },
        { s: '🍋', w: 25, pay: { 3: 8 } },
        { s: '🍉', w: 20, pay: { 3: 10 } },
        { s: '🔔', w: 12, pay: { 3: 20 } },
        { s: '⭐', w: 7, pay: { 3: 40 } },
        { s: '💎', w: 4, pay: { 3: 80 } },
        { s: '7️⃣', w: 2, pay: { 3: 150 } }
      ]
    },
    ocean: {
      name: 'Ozean-Schatz', icons: '🐠🦈💰', desc: '5 Walzen unter Wasser. 🌊 ist Wild und ersetzt jedes Symbol.', tag: '5 Walzen · Wild',
      card: 'linear-gradient(135deg,#0891b2,#1e3a8a)', accent: '#22d3ee', glow: 'rgba(34,211,238,.45)',
      panel: 'linear-gradient(180deg,#155e75,#082f49)',
      reels: 5, rows: 1, lines: [[0, 0, 0, 0, 0]], wild: '🌊',
      symbols: [
        { s: '🐚', w: 28, pay: { 3: 3, 4: 8, 5: 20 } },
        { s: '🐠', w: 24, pay: { 3: 4, 4: 10, 5: 30 } },
        { s: '🐙', w: 18, pay: { 3: 6, 4: 15, 5: 50 } },
        { s: '🦈', w: 12, pay: { 3: 10, 4: 30, 5: 100 } },
        { s: '🧜', w: 7, pay: { 3: 20, 4: 60, 5: 250 } },
        { s: '💰', w: 4, pay: { 3: 40, 4: 150, 5: 1000 } },
        { s: '🌊', w: 9, pay: { 3: 50, 4: 200, 5: 2000 } }
      ]
    },
    galaxy: {
      name: 'Galaxy Spins', icons: '🚀👽🪐', desc: '3×3 Raster mit 5 Gewinnlinien. 🌟 ist Wild.', tag: '3×3 · 5 Linien',
      card: 'linear-gradient(135deg,#6d28d9,#111827)', accent: '#a78bfa', glow: 'rgba(167,139,250,.5)',
      panel: 'linear-gradient(180deg,#312e81,#1e1b4b)',
      reels: 3, rows: 3, lines: [[1, 1, 1], [0, 0, 0], [2, 2, 2], [0, 1, 2], [2, 1, 0]], wild: '🌟',
      symbols: [
        { s: '🪐', w: 30, pay: { 3: 10 } },
        { s: '🌙', w: 25, pay: { 3: 15 } },
        { s: '☄️', w: 18, pay: { 3: 25 } },
        { s: '👽', w: 12, pay: { 3: 50 } },
        { s: '🚀', w: 7, pay: { 3: 100 } },
        { s: '🌟', w: 5, pay: { 3: 300 } }
      ]
    },
    pharaoh: {
      name: 'Pharaos Gold', icons: '👑🏺🐍', desc: '5×3 Walzen, 5 Gewinnlinien. 👑 ist Wild.', tag: '5×3 · 5 Linien · Wild',
      card: 'linear-gradient(135deg,#ca8a04,#78350f)', accent: '#facc15', glow: 'rgba(250,204,21,.5)',
      panel: 'linear-gradient(180deg,#854d0e,#422006)',
      reels: 5, rows: 3, lines: [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2]], wild: '👑',
      symbols: [
        { s: '🏺', w: 28, pay: { 3: 5, 4: 15, 5: 40 } },
        { s: '🐍', w: 24, pay: { 3: 8, 4: 20, 5: 60 } },
        { s: '🪲', w: 18, pay: { 3: 10, 4: 30, 5: 100 } },
        { s: '🐫', w: 12, pay: { 3: 15, 4: 50, 5: 200 } },
        { s: '👁️', w: 7, pay: { 3: 30, 4: 100, 5: 500 } },
        { s: '👑', w: 5, pay: { 3: 50, 4: 250, 5: 2500 } }
      ]
    },
    candy: {
      name: 'Candy Rausch', icons: '🍭🧁🍩', desc: '4 Walzen voller Süßes. Jeder Gewinn bekommt einen zufälligen Multiplikator bis ×5. 🌈 ist Wild.', tag: '4 Walzen · Multiplikator',
      card: 'linear-gradient(135deg,#ec4899,#8b5cf6)', accent: '#f9a8d4', glow: 'rgba(249,168,212,.5)',
      panel: 'linear-gradient(180deg,#be185d,#500724)',
      reels: 4, rows: 1, lines: [[0, 0, 0, 0]], wild: '🌈', multiplier: [1, 1, 1, 2, 2, 3, 5],
      symbols: [
        { s: '🍬', w: 28, pay: { 3: 2, 4: 6 } },
        { s: '🍭', w: 24, pay: { 3: 3, 4: 10 } },
        { s: '🍩', w: 18, pay: { 3: 5, 4: 15 } },
        { s: '🧁', w: 12, pay: { 3: 8, 4: 30 } },
        { s: '🍫', w: 7, pay: { 3: 15, 4: 60 } },
        { s: '🎂', w: 4, pay: { 3: 30, 4: 150 } },
        { s: '🌈', w: 6, pay: { 3: 40, 4: 300 } }
      ]
    },
    book: {
      name: 'Buch der Pharaonen', icons: '📖🤠🗿', desc: 'Abenteuer im Tempel: 5×3 Walzen, 10 Linien. 📖 ist Wild und Scatter. 3 Bücher bringen 10 Freispiele mit einem sich ausbreitenden Sondersymbol.', tag: '5×3 · 10 Linien · Freispiele',
      card: 'linear-gradient(135deg,#d97706,#451a03)', accent: '#fcd34d', glow: 'rgba(252,211,77,.55)',
      panel: 'linear-gradient(180deg,#92400e,#3b1d04)',
      reels: 5, rows: 3,
      lines: [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2], [1, 0, 0, 0, 1], [1, 2, 2, 2, 1], [0, 0, 1, 2, 2], [2, 2, 1, 0, 0], [1, 2, 1, 0, 1]],
      wild: '📖', scatter: '📖', scatterPay: { 3: 2, 4: 20, 5: 200 }, freeSpins: 10,
      symbols: [
        { s: '🗝️', w: 26, pay: { 3: 5, 4: 25, 5: 100 } },
        { s: '🪙', w: 26, pay: { 3: 5, 4: 25, 5: 100 } },
        { s: '🏺', w: 22, pay: { 3: 5, 4: 40, 5: 150 } },
        { s: '🦂', w: 20, pay: { 3: 5, 4: 40, 5: 150 } },
        { s: '🪲', w: 12, pay: { 2: 5, 3: 30, 4: 100, 5: 750 } },
        { s: '🗿', w: 8, pay: { 2: 5, 3: 40, 4: 400, 5: 2000 } },
        { s: '🤠', w: 4, pay: { 2: 10, 3: 100, 4: 1000, 5: 5000 } },
        { s: '📖', w: 6, pay: {} }
      ]
    }
  };

  let gameId = null;
  let game = null;
  let cols = [];
  let spinning = false;
  let auto = false;
  let roundToken = 0;
  let fsLeft = 0;
  let fsBet = 0;
  let expSym = null;
  let fsWin = 0;
  let gamble = null;

  function $(id) { return document.getElementById(id); }
  function fast() { return !!(C.timing && C.timing.fast); }
  function dur(ms) { return fast() ? Math.min(40, ms) : ms; }
  function wait(ms) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }
  function fmt(n) { return C.state.fmt(n); }

  function pick(target, rng) {
    const total = target.symbols.reduce((sum, item) => sum + item.w, 0);
    let roll = rng() * total;
    for (let i = 0; i < target.symbols.length; i++) {
      roll -= target.symbols[i].w;
      if (roll < 0) return target.symbols[i];
    }
    return target.symbols[0];
  }

  function makeGrid(target, rng) {
    const random = rng || Math.random;
    return Array.from({ length: target.reels }, () => Array.from({ length: target.rows }, () => pick(target, random)));
  }

  function evaluate(target, grid, bet) {
    const perLine = bet / target.lines.length;
    let total = 0;
    const hits = [];
    const winLines = [];
    target.lines.forEach((line, index) => {
      const syms = line.map((row, reel) => grid[reel][row]);
      const targetSym = syms.find((item) => item.s !== target.wild) || syms[0];
      let count = 0;
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].s === targetSym.s || syms[i].s === target.wild) count += 1;
        else break;
      }
      let wildCount = 0;
      if (target.wild) {
        for (let i = 0; i < syms.length; i++) {
          if (syms[i].s === target.wild) wildCount += 1;
          else break;
        }
      }
      let best = 0;
      let bestN = 0;
      const pay = targetSym.pay[count] || 0;
      if (pay > best) { best = pay; bestN = count; }
      if (wildCount) {
        const wildSym = target.symbols.find((item) => item.s === target.wild);
        const wildPay = (wildSym && wildSym.pay[wildCount]) || 0;
        if (wildPay > best) { best = wildPay; bestN = wildCount; }
      }
      if (best) {
        total += perLine * best;
        const cells = [];
        for (let reel = 0; reel < bestN; reel++) {
          hits.push([reel, line[reel]]);
          cells.push([reel, line[reel]]);
        }
        winLines.push({ index: index, cells: cells, factor: best });
      }
    });
    return { win: Math.round(total), hits: hits, winLines: winLines };
  }

  function resolveSpin(target, grid, bet, state, rng) {
    const random = rng || Math.random;
    const st = state || { free: false, fsLeft: 0, expSym: null, fsBet: 0, fsWin: 0 };
    const evaluated = evaluate(target, grid, bet);
    let win = evaluated.win;
    let mult = 1;
    if (win && target.multiplier) {
      mult = target.multiplier[Math.floor(random() * target.multiplier.length)];
      win *= mult;
    }
    let triggered = false;
    const scatterCells = [];
    if (target.scatter) {
      grid.forEach((col, reel) => col.forEach((item, row) => {
        if (item.s === target.scatter) scatterCells.push([reel, row]);
      }));
      if (scatterCells.length >= 3) {
        win += bet * (target.scatterPay[Math.min(scatterCells.length, 5)] || 0);
        triggered = true;
      }
    }
    let expandExtra = 0;
    const expandReels = [];
    if (st.free && st.expSym) {
      const special = target.symbols.find((item) => item.s === st.expSym);
      if (special) {
        const minN = Math.min.apply(null, Object.keys(special.pay).map(Number));
        grid.forEach((col, reel) => {
          if (col.some((item) => item.s === st.expSym)) expandReels.push(reel);
        });
        if (expandReels.length >= minN) {
          const perLine = bet / target.lines.length;
          expandExtra = Math.round(perLine * target.lines.length * (special.pay[Math.min(expandReels.length, 5)] || 0));
          win += expandExtra;
        }
      }
    }
    const next = {
      free: st.free,
      fsLeft: st.fsLeft,
      expSym: st.expSym,
      fsBet: st.fsBet,
      fsWin: st.free ? st.fsWin + win : st.fsWin
    };
    if (triggered && target.freeSpins) {
      if (!st.fsLeft && !st.free) {
        const pool = target.symbols.filter((item) => item.s !== target.scatter);
        next.expSym = pool[Math.floor(random() * (target.symbols.length - 1))].s;
        next.fsBet = bet;
        next.fsWin = 0;
      }
      next.fsLeft = st.fsLeft + target.freeSpins;
    }
    return {
      win: win,
      hits: evaluated.hits,
      winLines: evaluated.winLines,
      mult: mult,
      triggered: triggered,
      scatterCells: scatterCells,
      expandExtra: expandExtra,
      expandReels: expandReels,
      next: next
    };
  }

  function emptyState() {
    return { free: false, fsLeft: 0, expSym: null, fsBet: 0, fsWin: 0 };
  }

  function selfCheck() {
    const failures = [];
    function eq(actual, expected, label) {
      if (actual !== expected) failures.push(label + ': ' + actual + ' != ' + expected);
    }
    const classic = GAMES.classic;
    const cherry = classic.symbols[0];
    const lemon = classic.symbols[1];
    const seven = classic.symbols[6];
    eq(resolveSpin(classic, [[cherry], [cherry], [cherry]], 10, emptyState(), Math.random).win, 50, '3 Kirschen');
    eq(resolveSpin(classic, [[cherry], [cherry], [lemon]], 10, emptyState(), Math.random).win, 30, '2 Kirschen');
    eq(resolveSpin(classic, [[cherry], [lemon], [lemon]], 10, emptyState(), Math.random).win, 10, '1 Kirsche');
    eq(resolveSpin(classic, [[seven], [seven], [seven]], 10, emptyState(), Math.random).win, 1500, '3 Siebener');
    eq(resolveSpin(classic, [[lemon], [lemon], [cherry]], 10, emptyState(), Math.random).win, 0, '2 Zitronen');

    const ocean = GAMES.ocean;
    const wave = ocean.symbols[6];
    const shell = ocean.symbols[0];
    eq(resolveSpin(ocean, [[wave], [wave], [wave], [shell], [shell]], 10, emptyState(), Math.random).win, 500, 'Wild besser');
    eq(resolveSpin(ocean, [[shell], [shell], [shell], [shell], [shell]], 10, emptyState(), Math.random).win, 200, '5 Muscheln');

    const galaxy = GAMES.galaxy;
    const rocket = galaxy.symbols[4];
    const full = [0, 1, 2].map(() => [rocket, rocket, rocket]);
    eq(resolveSpin(galaxy, full, 10, emptyState(), Math.random).win, 1000, 'Galaxy Raketen');

    const candy = GAMES.candy;
    const rainbow = candy.symbols[6];
    eq(resolveSpin(candy, [[rainbow], [rainbow], [rainbow], [rainbow]], 10, emptyState(), () => 0.999).win, 15000, 'Candy ×5');

    const book = GAMES.book;
    const cowboy = book.symbols[6];
    const key = book.symbols[0];
    const tome = book.symbols[7];
    const grid = Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => key));
    grid[0][0] = cowboy;
    grid[1][0] = cowboy;
    const expanded = resolveSpin(book, grid, 10, { free: true, fsLeft: 4, expSym: '🤠', fsBet: 10, fsWin: 0 }, () => 0);
    eq(expanded.expandExtra, 100, 'Expand extra');
    eq(expanded.win, evaluate(book, grid, 10).win + 100, 'Expand Summe');

    const scatterGrid = Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => key));
    scatterGrid[0][1] = tome;
    scatterGrid[2][2] = tome;
    scatterGrid[4][0] = tome;
    const triggered = resolveSpin(book, scatterGrid, 10, emptyState(), () => 0);
    eq(triggered.triggered, true, 'Scatter ausgelöst');
    eq(triggered.win, evaluate(book, scatterGrid, 10).win + 20, 'Scatter Zahlung');
    eq(triggered.next.fsLeft, 10, '10 Freispiele');
    eq(triggered.next.expSym, '🗝️', 'Sondersymbol');
    eq(triggered.next.fsWin, 0, 'Freispielsumme startet neu');

    const retrigger = resolveSpin(book, scatterGrid, 10, { free: true, fsLeft: 2, expSym: '🤠', fsBet: 10, fsWin: 40 }, () => 0);
    eq(retrigger.next.fsLeft, 12, 'Retrigger');
    eq(retrigger.next.expSym, '🤠', 'Sondersymbol bleibt');
    eq(retrigger.next.fsWin, 40 + retrigger.win, 'Freispielsumme');

    Object.keys(GAMES).forEach((id) => {
      const target = GAMES[id];
      let left = 0;
      let special = null;
      let lockedBet = 0;
      let total = 0;
      for (let i = 0; i < 250; i++) {
        const free = left > 0;
        const bet = free ? lockedBet : C.BETS[i % C.BETS.length];
        if (free) left -= 1;
        const result = resolveSpin(target, makeGrid(target, Math.random), bet, {
          free: free, fsLeft: left, expSym: special, fsBet: lockedBet, fsWin: total
        }, Math.random);
        if (!Number.isInteger(result.win) || result.win < 0) failures.push(id + ' ungültiger Gewinn ' + result.win);
        left = result.next.fsLeft;
        special = result.next.expSym;
        lockedBet = result.next.fsBet;
        total = result.next.fsWin;
        if (left < 0 || left > 400) failures.push(id + ' Freispiele laufen weg: ' + left);
      }
    });
    return { failures: failures };
  }

  function persistFs() {
    try {
      if (gameId && fsLeft > 0) {
        sessionStorage.setItem(FS_KEY, JSON.stringify({
          gameId: gameId, fsLeft: fsLeft, fsBet: fsBet, expSym: expSym, fsWin: fsWin
        }));
      } else {
        sessionStorage.removeItem(FS_KEY);
      }
    } catch (err) { /* ignore */ }
  }

  function loadFs(id) {
    try {
      const raw = JSON.parse(sessionStorage.getItem(FS_KEY) || 'null');
      if (raw && raw.gameId === id && raw.fsLeft > 0) return raw;
    } catch (err) { /* ignore */ }
    return null;
  }

  function pendingFs() {
    try { return JSON.parse(sessionStorage.getItem(FS_KEY) || 'null'); }
    catch (err) { return null; }
  }

  function setMessage(text, kind) {
    const el = $('msg');
    el.textContent = text;
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }

  function linesBase() {
    if (!game) return '';
    return game.lines.length === 1
      ? '1 Gewinnlinie'
      : game.lines.length + ' Gewinnlinien (Einsatz wird aufgeteilt)';
  }

  function updateFsInfo() {
    const el = $('lines-info');
    if (!el) return;
    if (fsLeft > 0 || (expSym && fsLeft > 0)) {
      el.textContent = 'Freispiele übrig: ' + fsLeft + ' · Sondersymbol ' + expSym;
    } else {
      el.textContent = linesBase();
    }
  }

  function updateAuto() {
    $('auto').textContent = 'Automatik: ' + (auto ? 'An' : 'Aus');
    $('auto').setAttribute('aria-pressed', auto ? 'true' : 'false');
  }

  function syncBusy() {
    document.body.dataset.slotBusy = (spinning || fsLeft > 0) ? '1' : '0';
  }

  function renderControls() {
    if (!game) return;
    const snap = C.state.get();
    const bet = C.BETS[snap.betIdx];
    $('bet').textContent = fmt(bet);
    const locked = spinning || fsLeft > 0;
    $('minus').disabled = locked || snap.betIdx <= 0;
    $('plus').disabled = locked || snap.betIdx >= C.BETS.length - 1;
    $('spin').disabled = locked || snap.credits < bet;
    syncBusy();
  }

  function hideGamble() {
    gamble = null;
    $('gamble').classList.add('hidden');
  }

  function showGamble(amount, step, resetCard) {
    gamble = { amount: amount, step: step || 0, locked: false };
    $('gamble').classList.remove('hidden');
    $('g-amount').textContent = 'Risiko: ' + fmt(gamble.amount) + ' Credits';
    $('g-step').textContent = 'Runde ' + Math.min(gamble.step + 1, 5) + ' von 5';
    if (resetCard !== false) {
      $('g-card').textContent = '🂠';
      $('g-card').className = 'g-card';
    }
    const maxed = gamble.step >= 5;
    $('gamble-red').classList.toggle('hidden', maxed);
    $('gamble-black').classList.toggle('hidden', maxed);
    $('gamble-red').disabled = false;
    $('gamble-black').disabled = false;
    $('gamble-collect').disabled = false;
  }

  function setStrip(reel, symbols) {
    const strip = reel.querySelector('.reel-strip');
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0)';
    strip.replaceChildren();
    symbols.forEach((symbol) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = symbol;
      strip.appendChild(cell);
    });
  }

  function animateReel(reel, symbols) {
    const ms = dur(1080);
    const rows = symbols.length;
    const lead = fast() ? 0 : 16;
    const sequence = [];
    for (let i = 0; i < lead; i++) sequence.push(game.symbols[Math.floor(Math.random() * game.symbols.length)].s);
    symbols.forEach((symbol) => sequence.push(symbol));
    const strip = reel.querySelector('.reel-strip');
    strip.style.transition = 'none';
    strip.replaceChildren();
    sequence.forEach((symbol) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = symbol;
      strip.appendChild(cell);
    });
    strip.style.transform = 'translateY(0)';
    const cellH = reel.clientHeight / rows || 58;
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        setStrip(reel, symbols);
        if (C.audio) C.audio.reelStop();
        resolve();
      };
      if (lead === 0) {
        finish();
        return;
      }
      window.requestAnimationFrame(() => {
        strip.style.transition = 'transform ' + ms + 'ms cubic-bezier(.12,.7,.16,1)';
        strip.style.transform = 'translateY(' + (-(sequence.length - rows) * cellH) + 'px)';
        strip.addEventListener('transitionend', (event) => {
          if (event.propertyName === 'transform') finish();
        });
        window.setTimeout(finish, ms + 220);
      });
    });
  }

  function clearLines() {
    const svg = $('lines-svg');
    if (svg) svg.replaceChildren();
    document.querySelectorAll('#reels .cell.hit').forEach((cell) => cell.classList.remove('hit'));
  }

  function drawWinLines(winLines, extraCells) {
    const svg = $('lines-svg');
    const box = $('reels').getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    const mark = (reel, row) => {
      const cell = cols[reel] && cols[reel].querySelectorAll('.cell')[row];
      if (!cell) return null;
      cell.classList.add('hit');
      const rect = cell.getBoundingClientRect();
      return [(rect.left + rect.right) / 2 - box.left, (rect.top + rect.bottom) / 2 - box.top];
    };
    winLines.forEach((line) => {
      const points = line.cells.map((cell) => mark(cell[0], cell[1])).filter(Boolean);
      if (points.length < 2) return;
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      poly.setAttribute('points', points.map((point) => point.join(',')).join(' '));
      poly.setAttribute('class', 'winline');
      svg.appendChild(poly);
    });
    (extraCells || []).forEach((cell) => mark(cell[0], cell[1]));
  }

  function buildPaytable() {
    const table = $('paytable');
    table.replaceChildren();
    const counts = [];
    game.symbols.forEach((symbol) => {
      Object.keys(symbol.pay).forEach((key) => {
        const n = Number(key);
        if (counts.indexOf(n) === -1) counts.push(n);
      });
    });
    counts.sort((a, b) => a - b);
    const head = document.createElement('tr');
    const first = document.createElement('th');
    first.textContent = 'Symbol';
    head.appendChild(first);
    counts.forEach((count) => {
      const th = document.createElement('th');
      th.textContent = count + '×';
      head.appendChild(th);
    });
    table.appendChild(head);
    game.symbols.slice().reverse().forEach((symbol) => {
      const row = document.createElement('tr');
      const name = document.createElement('td');
      name.textContent = symbol.s + (symbol.s === game.wild ? ' Wild' : '');
      row.appendChild(name);
      counts.forEach((count) => {
        const td = document.createElement('td');
        td.textContent = symbol.pay[count] ? symbol.pay[count] + '×' : '–';
        row.appendChild(td);
      });
      table.appendChild(row);
    });
    const note = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = counts.length + 1;
    let text = 'Gewinne zählen von links nach rechts. Auszahlung = Einsatz pro Linie × Faktor.';
    if (game.multiplier) text += ' Dazu ein Zufalls-Multiplikator bis ×5.';
    if (game.scatter) {
      text += ' ' + game.scatter + ' Scatter irgendwo: 3× = ' + game.scatterPay[3] + '×, 4× = ' + game.scatterPay[4] + '×, 5× = ' + game.scatterPay[5] + '× Gesamteinsatz. Ab 3 Büchern ' + game.freeSpins + ' Freispiele. Das Sondersymbol zahlt auf allen Linien, auch ohne benachbarte Walzen.';
    }
    td.textContent = text;
    note.appendChild(td);
    table.appendChild(note);
  }

  function buildReels() {
    const wrap = $('reels');
    wrap.replaceChildren();
    wrap.style.setProperty('--rows', String(game.rows));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'lines-svg';
    wrap.appendChild(svg);
    cols = [];
    for (let reel = 0; reel < game.reels; reel++) {
      const col = document.createElement('div');
      col.className = 'reel';
      const strip = document.createElement('div');
      strip.className = 'reel-strip';
      col.appendChild(strip);
      wrap.appendChild(col);
      cols.push(col);
      const symbols = Array.from({ length: game.rows }, () => pick(game, Math.random).s);
      setStrip(col, symbols);
    }
  }

  function celebrateFor(win, basis) {
    if (!(basis > 0) || win <= 0) {
      if (win <= 0 && C.audio) C.audio.lose();
      return;
    }
    if (win >= basis * 25) {
      C.audio.fanfare();
      C.effects.celebrate('mega');
    } else if (win >= basis * 10) {
      C.audio.big();
      C.effects.celebrate('big');
    } else if (C.audio) {
      C.audio.win();
    }
  }

  function present(result, bet, free, basis) {
    const win = result.win;
    const multText = result.mult > 1 ? ' (×' + result.mult + ' Multiplikator)' : '';
    const extraText = result.expandExtra ? ' · ' + expSym + ' breitet sich aus: +' + fmt(result.expandExtra) : '';
    const suffix = multText + extraText;
    if (result.triggered && game.freeSpins) {
      if (!free) setMessage(game.freeSpins + ' Freispiele! Sondersymbol: ' + expSym, 'win');
      else setMessage('+' + game.freeSpins + ' weitere Freispiele!', 'win');
    } else if (win >= basis * 25 && basis > 0) {
      setMessage('Mega-Gewinn! +' + fmt(win) + ' Credits' + suffix, 'win');
    } else if (win > basis) {
      setMessage('Gewonnen! +' + fmt(win) + ' Credits' + suffix, 'win');
    } else if (win > 0) {
      setMessage('Gewinn: +' + fmt(win) + ' Credits' + suffix, 'win');
    } else {
      setMessage(free ? 'Kein Gewinn in diesem Freispiel' : 'Leider nichts – nochmal!');
    }
    $('last-win').textContent = fmt(win);
    const cells = result.scatterCells.slice();
    drawWinLines(result.winLines, cells);
    if (result.expandReels.length && expSym) {
      window.setTimeout(() => {
        result.expandReels.forEach((reel) => {
          cols[reel].querySelectorAll('.cell').forEach((cell) => {
            cell.textContent = expSym;
            cell.classList.add('hit');
          });
        });
      }, dur(250));
    }
    celebrateFor(win, basis);
  }

  async function spin() {
    if (spinning || !game) return;
    if (C.state.get().pendingKept && !gamble) C.state.settleKept();
    const free = fsLeft > 0;
    const snap = C.state.get();
    const bet = free ? fsBet : C.BETS[snap.betIdx];
    if (!free && snap.credits < bet) {
      auto = false;
      updateAuto();
      const hint = snap.credits < 100 ? ' Nicht genug Credits. Unter Einstellungen kannst du auffüllen.' : ' Nicht genug Credits.';
      setMessage(hint.trim());
      renderControls();
      return;
    }
    spinning = true;
    roundToken += 1;
    const token = roundToken;
    hideGamble();
    renderControls();
    clearLines();
    const passedLeft = free ? fsLeft - 1 : fsLeft;
    const grid = (C.slots._debugGrid && C.slots._debugGrid.slice()) || makeGrid(game, Math.random);
    C.slots._debugGrid = null;
    const rng = C.slots._debugRng || Math.random;
    C.slots._debugRng = null;
    const result = resolveSpin(game, grid, bet, {
      free: free,
      fsLeft: passedLeft,
      expSym: expSym,
      fsBet: fsBet,
      fsWin: fsWin
    }, rng);
    setMessage(free ? 'Freispiel läuft…' : 'Die Walzen laufen…');
    if (C.audio) C.audio.startTicks();
    await Promise.all(cols.map((col, index) => wait(dur(index * 150)).then(() => animateReel(col, grid[index].map((item) => item.s)))));
    if (C.audio) C.audio.stopTicks();
    if (token !== roundToken) {
      spinning = false;
      renderControls();
      return;
    }
    fsLeft = result.next.fsLeft;
    expSym = result.next.expSym;
    fsBet = result.next.fsBet;
    fsWin = result.next.fsWin;
    const basis = free ? fsBet : bet;
    C.state.addCredits((free ? 0 : -bet) + result.win);
    const offer = !free && !auto && result.win > 0 && fsLeft === 0;
    C.state.recordRound({
      game: gameId,
      wagered: free ? 0 : bet,
      payout: result.win,
      keepPending: offer,
      slotSpin: true,
      won: result.win > 0,
      jackpot: basis > 0 && result.win >= basis * 25,
      triggerFS: !!result.triggered
    });
    persistFs();
    present(result, bet, free, basis);
    updateFsInfo();
    spinning = false;
    renderControls();
    if (fsLeft > 0) {
      window.setTimeout(() => {
        if (token === roundToken) spin();
      }, dur(result.triggered ? 1600 : 900));
      return;
    }
    if (free && !result.triggered) {
      const total = fsWin;
      window.setTimeout(() => {
        if (token !== roundToken) return;
        setMessage('Freispiele beendet: insgesamt +' + fmt(total) + ' Credits', 'win');
        expSym = null;
        fsWin = 0;
        updateFsInfo();
        persistFs();
        renderControls();
        if (auto) window.setTimeout(() => { if (token === roundToken) spin(); }, dur(700));
      }, dur(1100));
      return;
    }
    if (offer) showGamble(result.win, 0);
    else if (auto) window.setTimeout(() => { if (token === roundToken) spin(); }, dur(650));
  }

  function collectGamble() {
    if (!gamble || gamble.locked) return;
    C.state.settleKept();
    setMessage('Gewinn genommen: ' + fmt(gamble.amount) + ' Credits', 'win');
    hideGamble();
  }

  async function playGamble(choice) {
    if (!gamble || gamble.step >= 5 || gamble.locked) return;
    gamble.locked = true;
    $('gamble-red').disabled = true;
    $('gamble-black').disabled = true;
    $('gamble-collect').disabled = true;
    C.state.noteGambleStake();
    let red;
    if (C.slots._debugColor) {
      red = C.slots._debugColor === 'red';
      C.slots._debugColor = null;
    } else {
      red = Math.random() < 0.5;
    }
    const suits = red ? ['♥', '♦'] : ['♠', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'B', 'D', 'K'];
    const face = ranks[Math.floor(Math.random() * ranks.length)] + suits[Math.floor(Math.random() * suits.length)];
    const card = $('g-card');
    card.className = 'g-card flip';
    if (C.audio) C.audio.card();
    await wait(dur(380));
    card.textContent = face;
    card.className = 'g-card ' + (red ? 'red' : 'black');
    const win = (choice === 'red') === red;
    if (!gamble) return;
    const nextStep = gamble.step + 1;
    if (win) {
      const amount = C.state.growKept();
      setMessage('Richtig! Der Gewinn steht jetzt bei ' + fmt(amount) + ' Credits.', 'win');
      if (C.audio) C.audio.win();
      if (nextStep >= 5) {
        C.state.settleKept();
        setMessage('Fünf Risiko-Runden geschafft. ' + fmt(amount) + ' Credits gesichert.', 'win');
        if (C.effects) C.effects.celebrate('big');
        hideGamble();
      } else {
        showGamble(amount, nextStep, false);
      }
    } else {
      const lost = gamble.amount;
      C.state.forfeitKept();
      setMessage('Falsche Farbe. ' + fmt(lost) + ' Credits sind weg.');
      if (C.audio) C.audio.lose();
      hideGamble();
    }
    renderControls();
  }

  function open(id) {
    gameId = id;
    game = GAMES[id];
    auto = false;
    updateAuto();
    hideGamble();
    const machine = $('machine');
    machine.style.setProperty('--accent', game.accent);
    machine.style.setProperty('--glow', game.glow);
    machine.style.setProperty('--panel', game.panel);
    $('slot-title').textContent = game.icons.slice(0, 2) + ' ' + game.name;
    $('slot-desc').textContent = game.desc;
    buildReels();
    buildPaytable();
    $('last-win').textContent = '0';
    const saved = loadFs(id);
    if (saved) {
      fsLeft = saved.fsLeft;
      fsBet = saved.fsBet;
      expSym = saved.expSym;
      fsWin = saved.fsWin || 0;
      setMessage('Freispiele werden fortgesetzt. Sondersymbol: ' + expSym);
      updateFsInfo();
      renderControls();
      window.setTimeout(spin, dur(500));
    } else {
      fsLeft = 0;
      fsBet = 0;
      expSym = null;
      fsWin = 0;
      setMessage('Viel Glück!');
      updateFsInfo();
      renderControls();
    }
    window.scrollTo(0, 0);
  }

  function close() {
    if (spinning || fsLeft > 0) return false;
    roundToken += 1;
    auto = false;
    updateAuto();
    if (gamble) collectGamble();
    else C.state.settleKept();
    game = null;
    syncBusy();
    return true;
  }

  function init() {
    $('spin').addEventListener('click', () => {
      if (gamble && gamble.locked) return;
      if (gamble) collectGamble();
      spin();
    });
    $('minus').addEventListener('click', () => {
      const snap = C.state.get();
      if (spinning || fsLeft > 0 || snap.betIdx <= 0) return;
      C.state.setBetIdx(snap.betIdx - 1);
      renderControls();
    });
    $('plus').addEventListener('click', () => {
      const snap = C.state.get();
      if (spinning || fsLeft > 0 || snap.betIdx >= C.BETS.length - 1) return;
      C.state.setBetIdx(snap.betIdx + 1);
      renderControls();
    });
    $('auto').addEventListener('click', () => {
      auto = !auto;
      updateAuto();
      if (auto && !spinning && fsLeft === 0) {
        if (gamble) collectGamble();
        spin();
      }
    });
    $('gamble-collect').addEventListener('click', collectGamble);
    $('gamble-red').addEventListener('click', () => playGamble('red'));
    $('gamble-black').addEventListener('click', () => playGamble('black'));
    document.addEventListener('keydown', (event) => {
      if (event.code !== 'Space') return;
      if (!document.getElementById('view-slot') || document.getElementById('view-slot').classList.contains('hidden')) return;
      if (document.body.classList.contains('modal-open')) return;
      event.preventDefault();
      if (!spinning && fsLeft === 0) {
        if (gamble) collectGamble();
        spin();
      }
    });
  }

  C.slots = {
    GAMES: GAMES,
    init: init,
    open: open,
    close: close,
    isBusy: () => spinning || fsLeft > 0,
    pendingFs: pendingFs,
    evaluate: evaluate,
    resolveSpin: resolveSpin,
    makeGrid: makeGrid,
    selfCheck: selfCheck,
    _debugGrid: null,
    _debugRng: null,
    _debugColor: null,
    refresh: renderControls
  };
})();
