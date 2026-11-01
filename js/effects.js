(function () {
  const C = (window.Casino = window.Casino || {});
  const COLORS = ['#f5c542', '#fb7185', '#22d3ee', '#c084fc', '#4ade80', '#fff7d6'];

  function layer() {
    return document.getElementById('fx');
  }

  function burst(kind) {
    const root = layer();
    if (!root) return;
    const mega = kind === 'mega';
    const coins = mega ? 46 : 26;
    const bits = mega ? 36 : 20;
    for (let i = 0; i < coins; i++) spawn(root, true);
    for (let i = 0; i < bits; i++) spawn(root, false);
  }

  function spawn(root, coin) {
    const el = document.createElement('div');
    el.className = coin ? 'fx-coin' : 'fx-bit';
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (1.5 + Math.random() * 1.3).toFixed(2) + 's';
    el.style.animationDelay = (Math.random() * 0.25).toFixed(2) + 's';
    if (coin) {
      el.textContent = Math.random() < 0.7 ? '🪙' : '✨';
    } else {
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.transform = 'rotate(' + Math.floor(Math.random() * 80) + 'deg)';
    }
    root.appendChild(el);
    window.setTimeout(() => el.remove(), 3400);
  }

  C.effects = {
    celebrate(kind) {
      if (kind === 'mega' || kind === 'big') burst(kind);
    }
  };
})();
