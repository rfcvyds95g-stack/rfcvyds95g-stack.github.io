(function () {
  const C = (window.Casino = window.Casino || {});
  let ctx = null;
  let master = null;
  let tickTimer = 0;

  function muted() {
    return !!(C.state && C.state.isMuted && C.state.isMuted());
  }

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.22;
      master.connect(ctx.destination);
    } catch (err) {
      ctx = null;
    }
    return ctx;
  }

  function unlock() {
    const c = ensure();
    if (c && c.state === 'suspended') c.resume();
    applyMute();
  }

  function applyMute() {
    if (!ctx || !master) return;
    const target = muted() ? 0 : 0.22;
    try {
      master.gain.setTargetAtTime(target, ctx.currentTime, 0.02);
    } catch (err) {
      master.gain.value = target;
    }
  }

  function tone(freq, dur, type, gain, delay, endFreq) {
    if (!ensure() || muted()) return;
    const t = ctx.currentTime + (delay || 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), t + dur);
    g.gain.setValueAtTime(Math.max(0.0001, gain), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  function noise(dur, gain) {
    if (!ensure() || muted()) return;
    const n = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    src.start();
  }

  const api = {
    unlock,
    applyMute,
    click() {
      tone(660, 0.045, 'square', 0.05);
    },
    tick() {
      tone(980, 0.028, 'square', 0.035, 0, 420);
    },
    startTicks() {
      api.stopTicks();
      if (C.timing && C.timing.fast) return;
      tickTimer = window.setInterval(() => api.tick(), 86);
    },
    stopTicks() {
      if (tickTimer) window.clearInterval(tickTimer);
      tickTimer = 0;
    },
    reelStop() {
      tone(180, 0.09, 'sine', 0.08, 0, 70);
      noise(0.04, 0.04);
    },
    win() {
      [523, 659, 784].forEach((f, i) => tone(f, 0.16, 'triangle', 0.07, i * 0.09));
    },
    big() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.08, i * 0.11));
      tone(1568, 0.3, 'sine', 0.04, 0.4);
    },
    fanfare() {
      [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, 0.28, 'triangle', 0.085, i * 0.12));
      tone(1046, 0.45, 'square', 0.03, 0.7);
    },
    lose() {
      tone(320, 0.18, 'sine', 0.05, 0, 140);
    },
    card() {
      noise(0.05, 0.06);
      tone(240, 0.06, 'triangle', 0.04);
    }
  };

  C.audio = api;
})();
