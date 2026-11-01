(function () {
  const C = (window.Casino = window.Casino || {});
  const SEGMENTS = [0, 1, 0, 2, 0, 1, 0, 10, 0, 1, 0, 2, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 0, 0];
  let spinning = false;
  let rot = 0;

  function $(id) { return document.getElementById(id); }
  function fast() { return !!(C.timing && C.timing.fast); }

  function colorFor(mult) {
    if (mult >= 10) return '#f5c542';
    if (mult >= 5) return '#e11d48';
    if (mult >= 2) return '#0891b2';
    if (mult === 1) return '#c2410c';
    return '#3b0764';
  }

  function selfCheck() {
    const failures = [];
    const sum = SEGMENTS.reduce((total, value) => total + value, 0);
    if (SEGMENTS.length !== 24) failures.push('Länge ' + SEGMENTS.length);
    if (sum !== 23) failures.push('Summe ' + sum);
    const slice = 360 / SEGMENTS.length;
    for (let i = 0; i < SEGMENTS.length; i++) {
      rot = 0;
      const landed = ((360 - (i * slice) % 360) % 360);
      const back = Math.round(((360 - landed) % 360) / slice) % SEGMENTS.length;
      if (back !== i) failures.push('Segment ' + i + ' -> ' + back);
    }
    rot = 0;
    return { failures: failures };
  }

  function draw() {
    const canvas = $('fortune-wheel');
    const size = canvas.clientWidth || 280;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 6;
    const slice = (Math.PI * 2) / SEGMENTS.length;
    ctx.clearRect(0, 0, size, size);
    SEGMENTS.forEach((mult, index) => {
      const start = -Math.PI / 2 + index * slice - slice / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = colorFor(mult);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.2)';
      ctx.stroke();
      const angle = -Math.PI / 2 + index * slice;
      ctx.save();
      ctx.translate(cx + Math.cos(angle) * radius * 0.72, cy + Math.sin(angle) * radius * 0.72);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = mult >= 10 ? '#1c1004' : '#fff';
      ctx.font = '800 ' + Math.max(11, size * 0.05) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('×' + mult, 0, 0);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#f5c542';
    ctx.lineWidth = Math.max(5, size * 0.022);
    ctx.stroke();
  }

  function spinTo(index) {
    const slice = 360 / SEGMENTS.length;
    const desired = (360 - (index * slice) % 360) % 360;
    const current = ((rot % 360) + 360) % 360;
    let delta = (desired - current + 360) % 360;
    const next = rot + delta + 360 * (fast() ? 0 : 5);
    const ms = fast() ? 40 : 4300;
    const canvas = $('fortune-wheel');
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        rot = next;
        resolve();
      };
      canvas.style.transition = 'transform ' + ms + 'ms cubic-bezier(.12,.72,.08,1)';
      canvas.style.transform = 'rotate(' + next + 'deg)';
      canvas.addEventListener('transitionend', finish);
      window.setTimeout(finish, ms + 250);
    });
  }

  function setMessage(text, kind) {
    const el = $('wheel-msg');
    el.textContent = text;
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }

  function sync() {
    const bet = C.BETS[C.state.get().betIdx];
    $('wheel-bet').textContent = C.state.fmt(bet);
    $('wheel-spin').disabled = spinning || C.state.get().credits < bet;
    $('wheel-minus').disabled = spinning || C.state.get().betIdx <= 0;
    $('wheel-plus').disabled = spinning || C.state.get().betIdx >= C.BETS.length - 1;
    document.body.dataset.wheelBusy = spinning ? '1' : '0';
  }

  async function spin() {
    if (spinning) return;
    const bet = C.BETS[C.state.get().betIdx];
    if (C.state.get().credits < bet) {
      setMessage('Nicht genug Credits.');
      return;
    }
    spinning = true;
    sync();
    const index = C.wheel._debugIndex === null || C.wheel._debugIndex === undefined
      ? Math.floor(Math.random() * SEGMENTS.length)
      : C.wheel._debugIndex;
    C.wheel._debugIndex = null;
    const mult = SEGMENTS[index];
    setMessage('Das Rad dreht sich…');
    $('wheel-hub').textContent = '…';
    if (C.audio) C.audio.startTicks();
    await spinTo(index);
    if (C.audio) C.audio.stopTicks();
    const returned = bet * mult;
    C.state.addCredits(-bet + returned);
    C.state.recordRound({
      game: 'wheel',
      wagered: bet,
      payout: returned,
      won: returned > bet,
      jackpot: mult >= 25
    });
    $('wheel-hub').textContent = '×' + mult;
    const profit = returned - bet;
    if (mult === 0) setMessage('×0. Der Einsatz ist weg.');
    else if (mult === 1) setMessage('×1. Einsatz zurück.');
    else setMessage('×' + mult + '! Gewinn +' + C.state.fmt(profit) + ' Credits', 'win');
    if (mult >= 10) {
      C.audio.fanfare();
      C.effects.celebrate('mega');
    } else if (mult >= 5) {
      C.audio.big();
      C.effects.celebrate('big');
    } else if (mult > 1) C.audio.win();
    else if (mult === 0) C.audio.lose();
    spinning = false;
    sync();
  }

  function init() {
    $('wheel-spin').addEventListener('click', spin);
    $('wheel-minus').addEventListener('click', () => {
      if (spinning) return;
      const snap = C.state.get();
      if (snap.betIdx <= 0) return;
      C.state.setBetIdx(snap.betIdx - 1);
      sync();
    });
    $('wheel-plus').addEventListener('click', () => {
      if (spinning) return;
      const snap = C.state.get();
      if (snap.betIdx >= C.BETS.length - 1) return;
      C.state.setBetIdx(snap.betIdx + 1);
      sync();
    });
    window.addEventListener('resize', () => {
      if (!$('view-wheel').classList.contains('hidden')) draw();
    });
    sync();
  }

  C.wheel = {
    SEGMENTS: SEGMENTS,
    meta: {
      id: 'wheel',
      name: 'Glücksrad',
      icons: '🎡✨',
      desc: 'Ein Rad mit Multiplikatoren. ×1 gibt den Einsatz zurück, ×0 verliert ihn.',
      tag: '×0 bis ×10'
    },
    init: init,
    onShow() { draw(); sync(); },
    close() { return !spinning; },
    isBusy: () => spinning,
    selfCheck: selfCheck,
    _debugIndex: null,
    refresh: sync
  };
})();
