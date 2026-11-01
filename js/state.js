(function () {
  const C = (window.Casino = window.Casino || {});
  const CREDIT_KEY = 'slots_credits';
  const META_KEY = 'slots_meta';
  const START = 1000;

  C.START = START;
  C.BETS = [5, 10, 25, 50, 100, 250, 500];

  const ACHIEVEMENTS = [
    { id: 'first_win', name: 'Erster Gewinn', desc: 'Gewinne zum ersten Mal Credits.', icon: '✨' },
    { id: 'jackpot', name: 'Mega-Gewinn', desc: 'Erziele mindestens das 25-Fache deines Einsatzes.', icon: '💎' },
    { id: 'spins_100', name: '100 Drehungen', desc: 'Drehe 100 Mal an den Slots.', icon: '🎰', goal: 100 },
    { id: 'spins_1000', name: 'Tausendsassa', desc: 'Drehe 1.000 Mal an den Slots.', icon: '🔥', goal: 1000 },
    { id: 'first_fs', name: 'Freispiele', desc: 'Löse im Buch der Pharaonen Freispiele aus.', icon: '📖' },
    { id: 'played_classic', name: 'Klassiker', desc: 'Spiele Lucky Classic.', icon: '🍒' },
    { id: 'played_ocean', name: 'Tauchgang', desc: 'Spiele Ozean-Schatz.', icon: '🐠' },
    { id: 'played_galaxy', name: 'Sternenreise', desc: 'Spiele Galaxy Spins.', icon: '🚀' },
    { id: 'played_pharaoh', name: 'Goldsucher', desc: 'Spiele Pharaos Gold.', icon: '👑' },
    { id: 'played_candy', name: 'Naschkatze', desc: 'Spiele Candy Rausch.', icon: '🍭' },
    { id: 'played_book', name: 'Tempelwächter', desc: 'Spiele Buch der Pharaonen.', icon: '🤠' },
    { id: 'played_roulette', name: 'Croupier', desc: 'Setze eine Runde Roulette.', icon: '🎡' },
    { id: 'played_blackjack', name: 'Kartengeber', desc: 'Spiele eine Runde Blackjack.', icon: '🃏' },
    { id: 'played_wheel', name: 'Rad des Glücks', desc: 'Drehe am Glücksrad.', icon: '🎯' },
    { id: 'gamble_win', name: 'Mutig', desc: 'Gewinne eine Risiko-Runde auf Rot oder Schwarz.', icon: '♥' },
    { id: 'streak_3', name: 'Serie', desc: 'Hole den Tagesbonus an 3 Tagen in Folge ab.', icon: '📅', goal: 3 },
    { id: 'level_5', name: 'Aufsteiger', desc: 'Erreiche Level 5.', icon: '⭐', goal: 5 },
    { id: 'natural', name: 'Blackjack', desc: 'Erziele einen Blackjack.', icon: '🂡' },
    { id: 'straight', name: 'Volltreffer', desc: 'Triff beim Roulette eine volle Zahl.', icon: '🟢' }
  ];

  let credits = START;
  let meta = null;

  function todayKey(date) {
    const d = date || new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return todayKey(d);
  }

  function defaultMeta() {
    return {
      v: 1,
      mute: false,
      xp: 0,
      betIdx: 1,
      streak: 0,
      lastBonus: '',
      ach: {},
      pendingKept: null,
      counters: {
        slotSpins: 0,
        gambleWins: 0,
        jackpots: 0,
        freespinTriggers: 0,
        naturals: 0,
        straights: 0,
        firstWin: 0,
        played: {}
      },
      stats: {
        rounds: 0,
        wagered: 0,
        payout: 0,
        bonus: 0,
        biggest: 0,
        biggestGame: '',
        games: {}
      }
    };
  }

  function xpThreshold(level) {
    if (level <= 1) return 0;
    return 50 * (level - 1) * level;
  }

  function levelFromXp(xp) {
    let level = 1;
    const safe = Math.max(0, xp || 0);
    while (level < 200 && xpThreshold(level + 1) <= safe) level += 1;
    return level;
  }

  function bonusAmount(streak) {
    const n = Math.max(1, streak || 1);
    return Math.min(50 + (n - 1) * 25, 300);
  }

  function fmt(n) {
    return Math.round(Number(n) || 0).toLocaleString('de-DE');
  }

  function toast(text) {
    if (C.state && typeof C.state.onToast === 'function') C.state.onToast(text);
  }

  function emit() {
    if (C.state && typeof C.state.onChange === 'function') C.state.onChange();
  }

  function saveCredits() {
    localStorage.setItem(CREDIT_KEY, String(Math.round(credits)));
  }

  function saveMeta() {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }

  function loadCredits() {
    const raw = localStorage.getItem(CREDIT_KEY);
    credits = +raw || START;
    if (!Number.isFinite(credits) || credits < 0) credits = START;
    credits = Math.round(credits);
  }

  function gameStats(id) {
    if (!meta.stats.games[id]) {
      meta.stats.games[id] = { rounds: 0, wagered: 0, payout: 0, biggest: 0 };
    }
    return meta.stats.games[id];
  }

  function loadMeta() {
    const base = defaultMeta();
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(META_KEY) || 'null');
    } catch (err) {
      raw = null;
    }
    if (!raw || typeof raw !== 'object') {
      meta = base;
      return;
    }
    meta = Object.assign(base, raw);
    meta.counters = Object.assign(base.counters, raw.counters || {});
    meta.counters.played = Object.assign({}, (raw.counters && raw.counters.played) || {});
    meta.stats = Object.assign(base.stats, raw.stats || {});
    meta.stats.games = (raw.stats && raw.stats.games) || {};
    meta.ach = raw.ach || {};
    meta.pendingKept = raw.pendingKept || null;
    const maxBet = C.BETS.length - 1;
    meta.betIdx = Math.max(0, Math.min(maxBet, meta.betIdx | 0));
  }

  function progressFor(id) {
    if (id === 'spins_100' || id === 'spins_1000') return meta.counters.slotSpins || 0;
    if (id === 'level_5') return levelFromXp(meta.xp);
    if (id === 'streak_3') return meta.streak || 0;
    return null;
  }

  function isMet(id) {
    const c = meta.counters;
    switch (id) {
      case 'first_win': return c.firstWin > 0;
      case 'jackpot': return c.jackpots > 0;
      case 'spins_100': return c.slotSpins >= 100;
      case 'spins_1000': return c.slotSpins >= 1000;
      case 'first_fs': return c.freespinTriggers > 0;
      case 'gamble_win': return c.gambleWins > 0;
      case 'streak_3': return (meta.streak || 0) >= 3;
      case 'level_5': return levelFromXp(meta.xp) >= 5;
      case 'natural': return c.naturals > 0;
      case 'straight': return c.straights > 0;
      default:
        if (id.indexOf('played_') === 0) return (c.played[id.slice(7)] || 0) > 0;
        return false;
    }
  }

  function reconcile() {
    let changed = false;
    ACHIEVEMENTS.forEach((item) => {
      if (isMet(item.id) && !meta.ach[item.id]) {
        meta.ach[item.id] = Date.now();
        changed = true;
        toast('Erfolg: ' + item.name);
      }
    });
    if (changed) saveMeta();
  }

  function considerBiggest(game, net) {
    if (net > meta.stats.biggest) {
      meta.stats.biggest = net;
      meta.stats.biggestGame = game;
    }
    const row = gameStats(game);
    if (net > row.biggest) row.biggest = net;
  }

  function applyXp(amount) {
    const gain = Math.max(0, Math.round(amount || 0));
    if (!gain) return { levels: [], reward: 0 };
    const before = levelFromXp(meta.xp);
    meta.xp += gain;
    const after = levelFromXp(meta.xp);
    let reward = 0;
    const levels = [];
    for (let level = before + 1; level <= after; level += 1) {
      const bonus = 20 * level;
      reward += bonus;
      levels.push({ level: level, reward: bonus });
    }
    if (reward) {
      credits += reward;
      meta.stats.bonus += reward;
    }
    return { levels: levels, reward: reward };
  }

  function flush(xpRes) {
    saveCredits();
    saveMeta();
    emit();
    if (xpRes && xpRes.levels) {
      xpRes.levels.forEach((row) => {
        toast('Level ' + row.level + ' erreicht! +' + fmt(row.reward) + ' Credits');
      });
    }
    reconcile();
  }

  function settleKept() {
    const pending = meta && meta.pendingKept;
    if (!pending) return;
    meta.stats.payout += pending.amount;
    gameStats(pending.game).payout += pending.amount;
    considerBiggest(pending.game, pending.amount - (pending.wagered || 0));
    meta.pendingKept = null;
    saveMeta();
    emit();
  }

  function peekBonus() {
    if (!meta) return null;
    const today = todayKey();
    if (meta.lastBonus === today) return null;
    const streak = meta.lastBonus === yesterdayKey() ? (meta.streak || 0) + 1 : 1;
    return { streak: streak, amount: bonusAmount(streak) };
  }

  const api = {
    onChange: null,
    onToast: null,
    achievements: ACHIEVEMENTS,
    bonusAmount: bonusAmount,
    xpThreshold: xpThreshold,
    levelFromXp: levelFromXp,
    fmt: fmt,
    init() {
      loadCredits();
      loadMeta();
      if (meta.pendingKept) {
        const pending = meta.pendingKept;
        meta.stats.payout += pending.amount;
        gameStats(pending.game).payout += pending.amount;
        considerBiggest(pending.game, pending.amount - (pending.wagered || 0));
        meta.pendingKept = null;
      }
      saveCredits();
      saveMeta();
      reconcile();
      emit();
    },
    get() {
      const level = levelFromXp(meta.xp);
      const floor = xpThreshold(level);
      const next = xpThreshold(level + 1);
      const into = meta.xp - floor;
      const need = Math.max(1, next - floor);
      let favorite = '';
      let bestRounds = -1;
      Object.keys(meta.stats.games).forEach((id) => {
        const rounds = meta.stats.games[id].rounds || 0;
        if (rounds > bestRounds) {
          bestRounds = rounds;
          favorite = id;
        }
      });
      return {
        credits: credits,
        level: level,
        xp: meta.xp,
        xpInto: into,
        xpNeed: need,
        xpPct: Math.max(0, Math.min(1, into / need)),
        nextReward: 20 * (level + 1),
        mute: !!meta.mute,
        streak: meta.streak || 0,
        bonusReady: peekBonus(),
        stats: meta.stats,
        counters: meta.counters,
        achievements: ACHIEVEMENTS.map((item) => ({
          id: item.id,
          name: item.name,
          desc: item.desc,
          icon: item.icon,
          goal: item.goal || null,
          unlocked: !!meta.ach[item.id],
          at: meta.ach[item.id] || 0,
          progress: progressFor(item.id)
        })),
        favorite: favorite,
        betIdx: meta.betIdx,
        pendingKept: meta.pendingKept
      };
    },
    isMuted() {
      return !!(meta && meta.mute);
    },
    setMuted(value) {
      meta.mute = !!value;
      saveMeta();
      emit();
      if (C.audio && C.audio.applyMute) C.audio.applyMute();
    },
    setBetIdx(index) {
      meta.betIdx = Math.max(0, Math.min(C.BETS.length - 1, index | 0));
      saveMeta();
    },
    addCredits(delta) {
      credits = Math.max(0, Math.round(credits + delta));
      saveCredits();
      emit();
      return credits;
    },
    peekBonus: peekBonus,
    claimBonus() {
      const peek = peekBonus();
      if (!peek) return null;
      meta.streak = peek.streak;
      meta.lastBonus = todayKey();
      credits += peek.amount;
      meta.stats.bonus += peek.amount;
      flush(null);
      return peek;
    },
    settleKept: settleKept,
    forfeitKept() {
      const pending = meta.pendingKept;
      if (!pending) return 0;
      const amount = pending.amount;
      meta.pendingKept = null;
      credits = Math.max(0, credits - amount);
      saveCredits();
      saveMeta();
      emit();
      return amount;
    },
    noteGambleStake() {
      const pending = meta.pendingKept;
      if (!pending) return null;
      const xpRes = applyXp(pending.amount);
      flush(xpRes);
      return pending.amount;
    },
    growKept() {
      const pending = meta.pendingKept;
      if (!pending) return 0;
      const prev = pending.amount;
      credits += prev;
      pending.amount = prev * 2;
      meta.counters.gambleWins += 1;
      flush(null);
      return pending.amount;
    },
    recordRound(opts) {
      const game = opts.game;
      const wagered = Math.max(0, Math.round(opts.wagered || 0));
      const payout = Math.max(0, Math.round(opts.payout || 0));
      const row = gameStats(game);
      meta.stats.rounds += 1;
      meta.stats.wagered += wagered;
      row.rounds += 1;
      row.wagered += wagered;
      meta.counters.played[game] = (meta.counters.played[game] || 0) + 1;
      if (opts.slotSpin) meta.counters.slotSpins += 1;
      if (opts.won) meta.counters.firstWin = 1;
      if (opts.jackpot) meta.counters.jackpots += 1;
      if (opts.triggerFS) meta.counters.freespinTriggers += 1;
      if (opts.natural) meta.counters.naturals += 1;
      if (opts.straight) meta.counters.straights += 1;
      if (opts.keepPending) {
        meta.pendingKept = { game: game, amount: payout, wagered: wagered };
      } else {
        meta.stats.payout += payout;
        row.payout += payout;
        considerBiggest(game, payout - wagered);
      }
      const xpRes = applyXp(wagered);
      flush(xpRes);
    },
    canRefill() {
      if (!meta || credits >= 100 || meta.pendingKept) return false;
      if (typeof C.isAnyBusy === 'function' && C.isAnyBusy()) return false;
      return true;
    },
    refill() {
      if (!api.canRefill()) return false;
      credits = START;
      saveCredits();
      emit();
      return true;
    },
    reset() {
      if (typeof C.isAnyBusy === 'function' && C.isAnyBusy()) return false;
      credits = START;
      meta = defaultMeta();
      try { sessionStorage.removeItem('slots_bj_hand'); } catch (err) { /* ignore */ }
      try { sessionStorage.removeItem('slots_fs'); } catch (err) { /* ignore */ }
      saveCredits();
      saveMeta();
      emit();
      return true;
    }
  };

  C.state = api;
})();
