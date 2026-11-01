(function () {
  const C = (window.Casino = window.Casino || {});
  const REDS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const WHEEL = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

  let bets = [];
  let lastBets = [];
  let spinning = false;
  let rot = 0;
  let chip = 10;

  function $(id) { return document.getElementById(id); }
  function fast() { return !!(C.timing && C.timing.fast); }
  function isRed(n) { return REDS.has(n); }
  function columnOf(n) { return n % 3 === 0 ? 3 : n % 3; }
  function dozenOf(n) { return Math.floor((n - 1) / 12); }

  function payoutOne(bet, number) {
    if (bet.type === 'number') return bet.value === number ? bet.amount * 36 : 0;
    if (number === 0) return 0;
    if (bet.type === 'red') return isRed(number) ? bet.amount * 2 : 0;
    if (bet.type === 'black') return !isRed(number) ? bet.amount * 2 : 0;
    if (bet.type === 'even') return number % 2 === 0 ? bet.amount * 2 : 0;
    if (bet.type === 'odd') return number % 2 === 1 ? bet.amount * 2 : 0;
    if (bet.type === 'dozen') return dozenOf(number) === bet.value ? bet.amount * 3 : 0;
    if (bet.type === 'column') return columnOf(number) === bet.value ? bet.amount * 3 : 0;
    return 0;
  }

  function settle(list, number) {
    let returned = 0;
    let stake = 0;
    list.forEach((bet) => {
      stake += bet.amount;
      returned += payoutOne(bet, number);
    });
    return { returned: returned, stake: stake, profit: returned - stake };
  }

  function rotationFor(index, turns) {
    const slice = 360 / WHEEL.length;
    const desired = (360 - (index * slice) % 360) % 360;
    const current = ((rot % 360) + 360) % 360;
    let delta = (desired - current + 360) % 360;
    return rot + delta + 360 * (turns || 0);
  }

  function selfCheck() {
    const failures = [];
    function expect(cond, label) {
      if (!cond) failures.push(label);
    }
    let red = 0;
    let straight = 0;
    let dozen = 0;
    let col = 0;
    let even = 0;
    for (let n = 0; n <= 36; n++) {
      red += settle([{ type: 'red', amount: 1 }], n).returned;
      straight += settle([{ type: 'number', value: 17, amount: 1 }], n).returned;
      dozen += settle([{ type: 'dozen', value: 0, amount: 1 }], n).returned;
      col += settle([{ type: 'column', value: 3, amount: 1 }], n).returned;
      even += settle([{ type: 'even', amount: 1 }], n).returned;
      expect(columnOf(n === 0 ? 3 : n) === (n === 0 ? 3 : (n % 3 === 0 ? 3 : n % 3)) || n === 0, 'spalte ' + n);
    }
    expect(red === 36, 'Rot EV ' + red);
    expect(straight === 36, 'Zahl EV ' + straight);
    expect(dozen === 36, 'Dutzend EV ' + dozen);
    expect(col === 36, 'Spalte EV ' + col);
    expect(even === 36, 'Gerade EV ' + even);
    expect(settle([{ type: 'number', value: 0, amount: 5 }], 0).returned === 180, 'Zero zahlt 35:1');
    expect(settle([{ type: 'red', amount: 10 }, { type: 'number', value: 1, amount: 5 }], 1).returned === 20 + 180, 'Zwei Wetten');
    expect(WHEEL.length === 37 && new Set(WHEEL).size === 37, 'Rad vollständig');
    for (let i = 0; i < WHEEL.length; i++) {
      rot = 0;
      const landed = rotationFor(i, 0) % 360;
      const slice = 360 / 37;
      const back = Math.round(((360 - landed) % 360) / slice) % 37;
      if (back !== i) failures.push('Rotation ' + i + ' -> ' + back);
    }
    rot = 0;
    return { failures: failures };
  }

  function stake() {
    return bets.reduce((sum, bet) => sum + bet.amount, 0);
  }

  function setMessage(text, kind) {
    const el = $('roulette-msg');
    el.textContent = text;
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }

  function colorName(n) {
    if (n === 0) return 'Grün';
    return isRed(n) ? 'Rot' : 'Schwarz';
  }

  function sync() {
    const total = stake();
    $('roulette-stake').textContent = C.state.fmt(total);
    $('roulette-spin').disabled = spinning || total <= 0 || C.state.get().credits < total;
    $('roulette-clear').disabled = spinning || total <= 0;
    $('roulette-repeat').disabled = spinning || !lastBets.length;
    document.querySelectorAll('[data-chip]').forEach((button) => {
      button.classList.toggle('selected', Number(button.dataset.chip) === chip);
    });
    document.querySelectorAll('[data-spot]').forEach((button) => {
      const type = button.dataset.spot;
      const value = button.dataset.value === undefined ? null : Number(button.dataset.value);
      const found = bets.find((bet) => bet.type === type && (value === null || bet.value === value));
      button.classList.toggle('has-bet', !!found);
      const badge = button.querySelector('.badge');
      if (badge) badge.textContent = found ? C.state.fmt(found.amount) : '';
    });
    document.body.dataset.rouletteBusy = spinning ? '1' : '0';
  }

  function place(type, value, label) {
    if (spinning) return;
    const credits = C.state.get().credits;
    if (stake() + chip > credits) {
      setMessage('Nicht genug Credits für diesen Chip.');
      return;
    }
    const existing = bets.find((bet) => bet.type === type && bet.value === value);
    if (existing) existing.amount += chip;
    else bets.push({ type: type, value: value, amount: chip, label: label });
    renderBetList();
    sync();
  }

  function renderBetList() {
    const list = $('roulette-bets');
    list.replaceChildren();
    if (!bets.length) {
      const empty = document.createElement('span');
      empty.className = 'muted';
      empty.textContent = 'Noch kein Einsatz.';
      list.appendChild(empty);
      return;
    }
    bets.forEach((bet, index) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'pill';
      pill.textContent = bet.label + ' · ' + C.state.fmt(bet.amount);
      pill.addEventListener('click', () => {
        if (spinning) return;
        bets.splice(index, 1);
        renderBetList();
        sync();
      });
      list.appendChild(pill);
    });
  }

  function draw() {
    const canvas = $('roulette-wheel');
    const size = canvas.clientWidth || 280;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 6;
    const slice = (Math.PI * 2) / WHEEL.length;
    ctx.clearRect(0, 0, size, size);
    WHEEL.forEach((number, index) => {
      const start = -Math.PI / 2 + index * slice - slice / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = number === 0 ? '#059669' : isRed(number) ? '#e11d48' : '#111827';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
      const angle = -Math.PI / 2 + index * slice;
      ctx.save();
      ctx.translate(cx + Math.cos(angle) * radius * 0.78, cy + Math.sin(angle) * radius * 0.78);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = '#fff';
      ctx.font = '700 ' + Math.max(9, size * 0.038) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(number), 0, 0);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#f5c542';
    ctx.lineWidth = Math.max(4, size * 0.02);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.34, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1028';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f5c542';
    ctx.stroke();
  }

  function spinWheel(index) {
    const canvas = $('roulette-wheel');
    const ms = fast() ? 40 : 4200;
    const next = rotationFor(index, fast() ? 0 : 6);
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        rot = next;
        resolve();
      };
      canvas.style.transition = 'none';
      canvas.offsetHeight;
      canvas.style.transition = 'transform ' + ms + 'ms cubic-bezier(.12,.72,.08,1)';
      canvas.style.transform = 'rotate(' + next + 'deg)';
      canvas.addEventListener('transitionend', finish);
      window.setTimeout(finish, ms + 250);
    });
  }

  async function spin() {
    if (spinning || !bets.length) {
      if (!bets.length) setMessage('Setze zuerst einen Einsatz.');
      return;
    }
    const total = stake();
    if (C.state.get().credits < total) {
      setMessage('Nicht genug Credits.');
      return;
    }
    spinning = true;
    sync();
    const number = C.roulette._debugNumber === null || C.roulette._debugNumber === undefined
      ? Math.floor(Math.random() * 37)
      : C.roulette._debugNumber;
    C.roulette._debugNumber = null;
    const index = WHEEL.indexOf(number);
    setMessage('Die Kugel rollt…');
    $('roulette-hub').textContent = '…';
    if (C.audio) C.audio.startTicks();
    await spinWheel(index);
    if (C.audio) C.audio.stopTicks();
    const snapshot = bets.map((bet) => Object.assign({}, bet));
    const result = settle(snapshot, number);
    C.state.addCredits(-total + result.returned);
    const straight = snapshot.some((bet) => bet.type === 'number' && bet.value === number);
    const jackpot = snapshot.some((bet) => payoutOne(bet, number) >= bet.amount * 25);
    C.state.recordRound({
      game: 'roulette',
      wagered: total,
      payout: result.returned,
      won: result.profit > 0,
      jackpot: jackpot,
      straight: straight
    });
    lastBets = snapshot;
    bets = [];
    spinning = false;
    $('roulette-hub').textContent = String(number);
    const tone = result.profit > 0 ? 'win' : '';
    if (result.profit > 0) {
      setMessage(number + ' ' + colorName(number) + ' · Gewinn +' + C.state.fmt(result.profit) + ' Credits', 'win');
    } else if (result.returned > 0) {
      setMessage(number + ' ' + colorName(number) + ' · Einsatz zurück.');
    } else {
      setMessage(number + ' ' + colorName(number) + ' · Nichts gewonnen.');
    }
    if (jackpot) {
      C.audio.fanfare();
      C.effects.celebrate('mega');
    } else if (straight || result.profit >= total) {
      C.audio.big();
      if (straight) C.effects.celebrate('big');
    } else if (result.profit > 0) C.audio.win();
    else C.audio.lose();
    renderBetList();
    sync();
    if (!tone) { /* keep lint quiet */ }
  }

  function buildBoard() {
    const numbers = $('roulette-numbers');
    numbers.replaceChildren();
    const zero = document.createElement('button');
    zero.type = 'button';
    zero.className = 'num green';
    zero.dataset.spot = 'number';
    zero.dataset.value = '0';
    zero.textContent = '0';
    const zeroBadge = document.createElement('i');
    zeroBadge.className = 'badge';
    zero.appendChild(zeroBadge);
    zero.addEventListener('click', () => place('number', 0, '0'));
    numbers.appendChild(zero);
    for (let n = 1; n <= 36; n++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'num ' + (isRed(n) ? 'red' : 'black');
      button.dataset.spot = 'number';
      button.dataset.value = String(n);
      button.textContent = String(n);
      const badge = document.createElement('i');
      badge.className = 'badge';
      button.appendChild(badge);
      button.addEventListener('click', () => place('number', n, String(n)));
      numbers.appendChild(button);
    }
    const outside = [
      ['red', null, 'Rot'],
      ['black', null, 'Schwarz'],
      ['even', null, 'Gerade'],
      ['odd', null, 'Ungerade'],
      ['dozen', 0, '1–12'],
      ['dozen', 1, '13–24'],
      ['dozen', 2, '25–36'],
      ['column', 1, 'Spalte 1'],
      ['column', 2, 'Spalte 2'],
      ['column', 3, 'Spalte 3']
    ];
    const wrap = $('roulette-outside');
    wrap.replaceChildren();
    outside.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'outside ' + item[0];
      button.dataset.spot = item[0];
      if (item[1] !== null) button.dataset.value = String(item[1]);
      button.textContent = item[2];
      const badge = document.createElement('i');
      badge.className = 'badge';
      button.appendChild(badge);
      button.addEventListener('click', () => place(item[0], item[1], item[2]));
      wrap.appendChild(button);
    });
    const chips = $('roulette-chips');
    chips.replaceChildren();
    C.BETS.forEach((amount) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.dataset.chip = String(amount);
      button.textContent = C.state.fmt(amount);
      button.addEventListener('click', () => {
        chip = amount;
        sync();
      });
      chips.appendChild(button);
    });
  }

  function init() {
    buildBoard();
    $('roulette-spin').addEventListener('click', spin);
    $('roulette-clear').addEventListener('click', () => {
      if (spinning) return;
      bets = [];
      renderBetList();
      sync();
    });
    $('roulette-repeat').addEventListener('click', () => {
      if (spinning || !lastBets.length) return;
      const total = lastBets.reduce((sum, bet) => sum + bet.amount, 0);
      if (total > C.state.get().credits) {
        setMessage('Nicht genug Credits für dieselben Einsätze.');
        return;
      }
      bets = lastBets.map((bet) => Object.assign({}, bet));
      renderBetList();
      sync();
    });
    window.addEventListener('resize', () => {
      if (!$('view-roulette').classList.contains('hidden')) draw();
    });
    renderBetList();
    sync();
  }

  C.roulette = {
    meta: {
      id: 'roulette',
      name: 'Roulette',
      icons: '🔴⚫🟢',
      desc: 'Europäisches Rad mit einer Null. Volle Zahl, Farben, Gerade/Ungerade, Dutzende und Spalten.',
      tag: 'Einzelne Null'
    },
    init: init,
    onShow() {
      draw();
      sync();
    },
    close() { return !spinning; },
    isBusy: () => spinning,
    settle: settle,
    payoutOne: payoutOne,
    selfCheck: selfCheck,
    _debugNumber: null,
    refresh: sync
  };
})();
