(function () {
  const C = (window.Casino = window.Casino || {});
  C.timing = { fast: false };
  const params = new URLSearchParams(location.search);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  C.timing.fast = params.has('fast') || !!reduce;

  let current = 'lobby';
  let modalOpen = false;
  let modalOnClose = null;
  let bonusSnoozed = false;
  let ready = false;
  const toastQueue = [];
  let toastShowing = false;

  function $(id) { return document.getElementById(id); }

  function busy() {
    return (C.slots && C.slots.isBusy && C.slots.isBusy())
      || (C.roulette && C.roulette.isBusy && C.roulette.isBusy())
      || (C.blackjack && C.blackjack.isBusy && C.blackjack.isBusy())
      || (C.wheel && C.wheel.isBusy && C.wheel.isBusy());
  }
  C.isAnyBusy = busy;

  function toast(text) {
    toastQueue.push(text);
    const achievements = toastQueue.filter((item) => item.indexOf('Erfolg:') === 0);
    if (achievements.length > 2) {
      const rest = toastQueue.filter((item) => item.indexOf('Erfolg:') !== 0);
      toastQueue.length = 0;
      rest.forEach((item) => toastQueue.push(item));
      toastQueue.push(achievements.length + ' neue Erfolge');
    }
    pumpToasts();
  }

  function pumpToasts() {
    if (toastShowing || !toastQueue.length) return;
    toastShowing = true;
    const text = toastQueue.shift();
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    const host = $('toasts');
    host.replaceChildren(el);
    window.setTimeout(() => {
      el.remove();
      toastShowing = false;
      pumpToasts();
    }, C.timing.fast ? 400 : 1700);
  }

  function closeModal() {
    const hook = modalOnClose;
    modalOnClose = null;
    modalOpen = false;
    document.body.classList.remove('modal-open');
    $('modal').classList.add('hidden');
    $('modal-card').replaceChildren();
    if (hook) hook();
  }

  function openModal(title, nodes, actions, onClose) {
    const card = $('modal-card');
    card.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = title;
    card.appendChild(heading);
    nodes.forEach((node) => card.appendChild(node));
    const row = document.createElement('div');
    row.className = 'modal-actions';
    actions.forEach((action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = action.primary ? 'primary' : 'ghost';
      button.textContent = action.label;
      button.addEventListener('click', action.onClick);
      row.appendChild(button);
    });
    card.appendChild(row);
    modalOnClose = onClose || null;
    $('modal').classList.remove('hidden');
    document.body.classList.add('modal-open');
    modalOpen = true;
    const focus = card.querySelector('button.primary') || card.querySelector('button');
    if (focus) focus.focus();
  }

  function gameName(id) {
    if (C.slots && C.slots.GAMES && C.slots.GAMES[id]) return C.slots.GAMES[id].name;
    if (id === 'roulette') return 'Roulette';
    if (id === 'blackjack') return 'Blackjack';
    if (id === 'wheel') return 'Glücksrad';
    return id || '–';
  }

  function show(view) {
    if (view !== current && busy()) {
      toast('Bitte die laufende Runde beenden.');
      return;
    }
    if (current === 'slot' && view !== 'slot' && !C.slots.close()) return;
    if (current === 'roulette' && view !== 'roulette' && !C.roulette.close()) return;
    if (current === 'blackjack' && view !== 'blackjack' && !C.blackjack.close()) return;
    if (current === 'wheel' && view !== 'wheel' && !C.wheel.close()) return;
    current = view;
    document.querySelectorAll('.view').forEach((el) => {
      el.classList.toggle('hidden', el.id !== 'view-' + view);
    });
    document.querySelectorAll('.nav-btn').forEach((button) => {
      const key = ['achievements', 'stats', 'settings'].indexOf(view) === -1 ? 'lobby' : view;
      button.classList.toggle('active', button.dataset.nav === key);
    });
    if (view === 'achievements') renderAchievements();
    if (view === 'stats') renderStats();
    if (view === 'settings') renderSettings();
    if (view === 'roulette') C.roulette.onShow();
    if (view === 'blackjack') C.blackjack.onShow();
    if (view === 'wheel') C.wheel.onShow();
    if (view === 'lobby') renderLobbyStatus();
    window.scrollTo(0, 0);
  }

  function renderChrome() {
    const snap = C.state.get();
    $('credits').textContent = C.state.fmt(snap.credits);
    $('level-label').textContent = 'Level ' + snap.level;
    $('xp-fill').style.width = Math.round(snap.xpPct * 100) + '%';
    $('xp-text').textContent = C.state.fmt(snap.xpInto) + ' / ' + C.state.fmt(snap.xpNeed) + ' XP';
    $('mute').textContent = snap.mute ? '🔇' : '🔊';
    $('mute').setAttribute('aria-label', snap.mute ? 'Ton einschalten' : 'Ton ausschalten');
    const bonus = snap.bonusReady;
    $('bonus-btn').classList.toggle('hidden', !bonus);
    if (bonus) $('bonus-btn').textContent = 'Bonus abholen · +' + C.state.fmt(bonus.amount);
    $('bonus-status').textContent = bonus
      ? 'Tagesbonus bereit · Tag ' + bonus.streak
      : 'Tagesbonus geholt · Serie ' + snap.streak;
    $('low-credits-hint').classList.toggle('hidden', snap.credits >= 100);
    if ($('refill-wrap')) $('refill-wrap').classList.toggle('hidden', !C.state.canRefill());
    if ($('set-mute')) $('set-mute').textContent = snap.mute ? 'Ton einschalten' : 'Ton ausschalten';
    if (!ready) return;
    if (current === 'slot' && C.slots.refresh) C.slots.refresh();
    if (current === 'roulette' && C.roulette.refresh) C.roulette.refresh();
    if (current === 'blackjack' && C.blackjack.refresh) C.blackjack.refresh();
    if (current === 'wheel' && C.wheel.refresh) C.wheel.refresh();
    if (current === 'lobby') renderLobbyStatus();
    if (current === 'stats') renderStats();
    if (current === 'achievements') renderAchievements();
  }

  function renderLobbyStatus() {
    const pending = C.slots.pendingFs && C.slots.pendingFs();
    document.querySelectorAll('.game-card').forEach((card) => {
      const flag = card.querySelector('.resume');
      if (!flag) return;
      const on = !!(pending && pending.gameId === card.dataset.game && pending.fsLeft > 0);
      flag.classList.toggle('hidden', !on);
      if (on) flag.textContent = pending.fsLeft + ' Freispiele offen';
    });
  }

  function makeCard(id, game, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-card';
    button.dataset.game = id;
    button.style.background = game.card || 'linear-gradient(135deg,#312e81,#111827)';
    const icons = document.createElement('div');
    icons.className = 'icons';
    icons.textContent = game.icons;
    const title = document.createElement('h3');
    title.textContent = game.name;
    const desc = document.createElement('p');
    desc.textContent = game.desc;
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = game.tag;
    const resume = document.createElement('span');
    resume.className = 'resume hidden';
    button.append(icons, title, desc, tag, resume);
    button.addEventListener('click', onClick);
    return button;
  }

  function renderLobby() {
    const slots = $('slot-cards');
    const tables = $('table-cards');
    slots.replaceChildren();
    tables.replaceChildren();
    Object.keys(C.slots.GAMES).forEach((id) => {
      slots.appendChild(makeCard(id, C.slots.GAMES[id], () => openSlot(id)));
    });
    [C.roulette.meta, C.blackjack.meta, C.wheel.meta].forEach((game) => {
      tables.appendChild(makeCard(game.id, game, () => openTable(game.id)));
    });
  }

  function openSlot(id) {
    if (busy()) {
      toast('Bitte die laufende Runde beenden.');
      return;
    }
    show('slot');
    C.slots.open(id);
  }

  function openTable(id) {
    if (busy()) {
      toast('Bitte die laufende Runde beenden.');
      return;
    }
    show(id);
  }

  function renderAchievements() {
    const snap = C.state.get();
    const summary = $('level-card');
    summary.replaceChildren();
    const title = document.createElement('h2');
    title.textContent = 'Level ' + snap.level;
    const bar = document.createElement('div');
    bar.className = 'xpbar big';
    const fill = document.createElement('div');
    fill.style.width = Math.round(snap.xpPct * 100) + '%';
    bar.appendChild(fill);
    const text = document.createElement('p');
    text.textContent = C.state.fmt(snap.xpInto) + ' / ' + C.state.fmt(snap.xpNeed) + ' XP bis Level ' + (snap.level + 1) + '. Belohnung: +' + C.state.fmt(snap.nextReward) + ' Credits. 1 Einsatz-Credit = 1 XP.';
    summary.append(title, bar, text);
    const list = $('ach-list');
    list.replaceChildren();
    const unlocked = snap.achievements.filter((item) => item.unlocked).length;
    const count = document.createElement('p');
    count.className = 'muted';
    count.textContent = unlocked + ' von ' + snap.achievements.length + ' Erfolgen';
    list.appendChild(count);
    snap.achievements.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'ach' + (item.unlocked ? ' on' : '');
      const icon = document.createElement('div');
      icon.className = 'ach-icon';
      icon.textContent = item.icon;
      const body = document.createElement('div');
      const name = document.createElement('h3');
      name.textContent = item.name;
      const desc = document.createElement('p');
      desc.textContent = item.desc;
      body.append(name, desc);
      if (!item.unlocked && item.goal && item.progress !== null) {
        const prog = document.createElement('p');
        prog.className = 'prog';
        prog.textContent = Math.min(item.progress, item.goal) + ' / ' + item.goal;
        body.appendChild(prog);
      }
      if (item.unlocked && item.at) {
        const when = document.createElement('p');
        when.className = 'prog';
        when.textContent = 'Erreicht am ' + new Date(item.at).toLocaleDateString('de-DE');
        body.appendChild(when);
      }
      card.append(icon, body);
      list.appendChild(card);
    });
  }

  function statBox(label, value) {
    const box = document.createElement('div');
    box.className = 'stat';
    const b = document.createElement('b');
    b.textContent = value;
    const span = document.createElement('span');
    span.textContent = label;
    box.append(b, span);
    return box;
  }

  function renderStats() {
    const snap = C.state.get();
    const stats = snap.stats;
    const root = $('stats-root');
    root.replaceChildren();
    const grid = document.createElement('div');
    grid.className = 'stat-grid';
    const net = stats.payout - stats.wagered;
    grid.append(
      statBox('Slot-Drehungen', C.state.fmt(snap.counters.slotSpins || 0)),
      statBox('Runden', C.state.fmt(stats.rounds || 0)),
      statBox('Gesamteinsatz', C.state.fmt(stats.wagered || 0)),
      statBox('Auszahlungen', C.state.fmt(stats.payout || 0)),
      statBox('Bilanz', (net > 0 ? '+' : '') + C.state.fmt(net)),
      statBox('Größter Nettogewinn', C.state.fmt(stats.biggest || 0)),
      statBox('Lieblingsspiel', snap.favorite ? gameName(snap.favorite) : '–'),
      statBox('Boni', C.state.fmt(stats.bonus || 0))
    );
    root.appendChild(grid);
    const note = document.createElement('p');
    note.className = 'muted';
    note.textContent = 'Auszahlungen sind gutgeschriebene Credits. Die Bilanz zieht den Einsatz ab. Boni sind Tagesbonus und Level-Belohnungen.';
    root.appendChild(note);
    const table = document.createElement('table');
    const head = document.createElement('tr');
    ['Spiel', 'Runden', 'Einsatz', 'Auszahlung', 'Bester Netto'].forEach((label) => {
      const th = document.createElement('th');
      th.textContent = label;
      head.appendChild(th);
    });
    table.appendChild(head);
    const ids = Object.keys(stats.games || {});
    if (!ids.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = 'Noch keine Runden. Viel Glück in der Lobby.';
      root.appendChild(empty);
      return;
    }
    ids.sort((a, b) => (stats.games[b].rounds || 0) - (stats.games[a].rounds || 0));
    ids.forEach((id) => {
      const row = stats.games[id];
      const tr = document.createElement('tr');
      [gameName(id), C.state.fmt(row.rounds), C.state.fmt(row.wagered), C.state.fmt(row.payout), C.state.fmt(row.biggest)].forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    root.appendChild(table);
  }

  function renderSettings() {
    const snap = C.state.get();
    $('set-mute').textContent = snap.mute ? 'Ton einschalten' : 'Ton ausschalten';
    $('set-level').textContent = 'Level ' + snap.level + ' · ' + C.state.fmt(snap.xp) + ' XP';
    $('refill-wrap').classList.toggle('hidden', !C.state.canRefill());
  }

  function showBonus() {
    const peek = C.state.peekBonus();
    if (!peek || modalOpen || bonusSnoozed) return;
    const lead = document.createElement('p');
    lead.textContent = 'Tag ' + peek.streak + ' in Folge. Einmal pro Kalendertag, die Serie wächst mit jedem Tag.';
    const amount = document.createElement('p');
    amount.className = 'bonus-amount';
    amount.textContent = '+' + C.state.fmt(peek.amount) + ' Credits';
    openModal('Täglicher Bonus', [lead, amount], [
      { label: 'Später', onClick: () => closeModal() },
      {
        label: 'Abholen',
        primary: true,
        onClick: () => {
          modalOnClose = null;
          const claimed = C.state.claimBonus();
          closeModal();
          if (claimed) {
            toast('Tagesbonus +' + C.state.fmt(claimed.amount) + ' Credits');
            C.effects.celebrate('big');
            if (C.audio) C.audio.win();
          }
        }
      }
    ], () => { bonusSnoozed = true; });
  }

  function showReset() {
    if (busy()) {
      toast('Bitte die laufende Runde beenden.');
      return;
    }
    const text = document.createElement('p');
    text.textContent = 'Credits, Level, Erfolge, Serie und Statistik werden gelöscht. Dein Guthaben wird auf 1.000 Credits gesetzt.';
    openModal('Fortschritt zurücksetzen?', [text], [
      { label: 'Abbrechen', onClick: () => { modalOnClose = null; closeModal(); } },
      {
        label: 'Zurücksetzen',
        primary: true,
        onClick: () => {
          modalOnClose = null;
          if (!C.state.reset()) return;
          closeModal();
          toast('Fortschritt zurückgesetzt.');
          show('lobby');
        }
      }
    ]);
  }

  function toggleMute() {
    const next = !C.state.isMuted();
    C.state.setMuted(next);
    if (!next && C.audio) {
      C.audio.unlock();
      C.audio.click();
    }
  }

  function init() {
    C.state.onToast = toast;
    C.state.onChange = renderChrome;
    C.state.init();
    C.slots.init();
    C.roulette.init();
    C.blackjack.init();
    C.wheel.init();
    renderLobby();
    renderChrome();
    show('lobby');

    $('logo').addEventListener('click', () => show('lobby'));
    $('mute').addEventListener('click', toggleMute);
    $('bonus-btn').addEventListener('click', () => { bonusSnoozed = false; showBonus(); });
    document.querySelectorAll('.nav-btn').forEach((button) => {
      button.addEventListener('click', () => show(button.dataset.nav));
    });
    $('back-slot').addEventListener('click', () => show('lobby'));
    $('back-roulette').addEventListener('click', () => show('lobby'));
    $('back-bj').addEventListener('click', () => show('lobby'));
    $('back-wheel').addEventListener('click', () => show('lobby'));
    $('set-mute').addEventListener('click', toggleMute);
    $('set-refill').addEventListener('click', () => {
      if (C.state.refill()) toast('Credits auf 1.000 aufgefüllt.');
      else toast('Auffüllen geht nur unter 100 Credits und außerhalb einer Runde.');
    });
    $('set-reset').addEventListener('click', showReset);
    $('modal').addEventListener('click', (event) => {
      if (event.target.id === 'modal') closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modalOpen) closeModal();
    });
    document.addEventListener('pointerdown', () => { if (C.audio) C.audio.unlock(); }, { passive: true });
    document.addEventListener('click', (event) => {
      const button = event.target.closest && event.target.closest('button');
      if (!button || button.dataset.silent) return;
      if (C.audio) C.audio.click();
    }, true);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        renderChrome();
        showBonus();
      }
    });
    ready = true;
    renderChrome();
    if ('serviceWorker' in navigator && !C.timing.fast) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
    showBonus();
  }

  C.app = { init: init, toast: toast, show: show };
  init();
})();
