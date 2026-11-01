(function () {
  const C = (window.Casino = window.Casino || {});
  const KEY = 'slots_bj_hand';
  const SUIT = { H: '♥', D: '♦', C: '♣', S: '♠' };
  const RANK = { 1: 'A', 11: 'B', 12: 'D', 13: 'K' };

  let phase = 'bet';
  let shoe = [];
  let dealer = [];
  let hands = [];
  let active = 0;
  let hideHole = true;
  let totalStake = 0;
  let splitUsed = false;

  function $(id) { return document.getElementById(id); }
  function fast() { return !!(C.timing && C.timing.fast); }

  function handTotal(cards) {
    let total = 0;
    let aces = 0;
    cards.forEach((card) => {
      if (card.r === 1) { aces += 1; total += 11; }
      else total += Math.min(10, card.r);
    });
    while (total > 21 && aces > 0) { total -= 10; aces -= 1; }
    return { total: total, soft: aces > 0 };
  }

  function isBlackjack(cards) {
    return cards.length === 2 && handTotal(cards).total === 21;
  }

  function dealerShouldHit(cards) {
    return handTotal(cards).total < 17;
  }

  function settleHands(list, dealerCards) {
    const dealerScore = handTotal(dealerCards);
    const dealerBJ = isBlackjack(dealerCards);
    let returned = 0;
    const details = [];
    list.forEach((hand) => {
      const score = handTotal(hand.cards);
      let back = 0;
      let tag = 'lose';
      if (hand.natural && dealerBJ) { back = hand.bet; tag = 'push'; }
      else if (hand.natural) { back = hand.bet + Math.round(hand.bet * 3 / 2); tag = 'blackjack'; }
      else if (score.total > 21) { back = 0; tag = 'bust'; }
      else if (dealerBJ || dealerScore.total > score.total && dealerScore.total <= 21) { back = 0; tag = 'lose'; }
      else if (dealerScore.total > 21 || score.total > dealerScore.total) { back = hand.bet * 2; tag = 'win'; }
      else if (score.total === dealerScore.total) { back = hand.bet; tag = 'push'; }
      returned += back;
      details.push({ tag: tag, back: back, total: score.total });
    });
    return { returned: returned, details: details, dealerTotal: dealerScore.total };
  }

  function selfCheck() {
    const failures = [];
    function expect(cond, label) {
      if (!cond) failures.push(label);
    }
    const ten = { r: 13, s: 'S' };
    const six = { r: 6, s: 'H' };
    const ace = { r: 1, s: 'D' };
    const nine = { r: 9, s: 'C' };
    const eight = { r: 8, s: 'H' };
    expect(handTotal([ace, six]).total === 17 && handTotal([ace, six]).soft, 'Soft 17');
    expect(!dealerShouldHit([ace, six]), 'Dealer hält bei Soft 17');
    expect(dealerShouldHit([ten, six]), 'Dealer zieht bei 16');
    expect(!dealerShouldHit([{ r: 10, s: 'S' }, { r: 7, s: 'H' }]), 'Dealer hält bei 17');
    const bj = settleHands([{ cards: [ace, ten], bet: 10, natural: true }], [nine, eight]);
    expect(bj.returned === 25, 'Blackjack 3:2 ist ' + bj.returned);
    const push = settleHands([{ cards: [ace, ten], bet: 10, natural: true }], [ace, { r: 10, s: 'C' }]);
    expect(push.returned === 10 && push.details[0].tag === 'push', 'Blackjack gegen Blackjack');
    const bust = settleHands([{ cards: [ten, six, eight], bet: 10, natural: false }], [nine, eight]);
    expect(bust.returned === 0 && bust.details[0].tag === 'bust', 'Überkauft');
    const win = settleHands([{ cards: [ten, { r: 10, s: 'H' }], bet: 10, natural: false }], [nine, eight]);
    expect(win.returned === 20, '20 gegen 17');
    const tie = settleHands([{ cards: [ten, nine], bet: 25, natural: false }], [nine, { r: 10, s: 'D' }]);
    expect(tie.returned === 25 && tie.details[0].tag === 'push', 'Unentschieden');
    const doubled = settleHands([{ cards: [ten, nine, { r: 2, s: 'S' }], bet: 20, natural: false }], [ten, eight]);
    expect(doubled.returned === 40, 'Verdoppelt gewonnen');
    const odd = Math.round(25 * 3 / 2);
    expect(odd === 38, '25 Einsatz rundet 3:2 auf 38');
    return { failures: failures };
  }

  function freshShoe() {
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const suits = ['H', 'D', 'C', 'S'];
    const next = [];
    for (let deck = 0; deck < 6; deck++) {
      ranks.forEach((rank) => suits.forEach((suit) => next.push({ r: rank, s: suit })));
    }
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = next[i];
      next[i] = next[j];
      next[j] = swap;
    }
    return next;
  }

  function draw() {
    if (shoe.length < 20) shoe = freshShoe();
    if (C.blackjack._debugDraws && C.blackjack._debugDraws.length) return C.blackjack._debugDraws.shift();
    return shoe.pop();
  }

  function rankLabel(rank) { return RANK[rank] || String(rank); }
  function redSuit(suit) { return suit === 'H' || suit === 'D'; }

  function save() {
    try {
      if (phase === 'bet') sessionStorage.removeItem(KEY);
      else {
        sessionStorage.setItem(KEY, JSON.stringify({
          phase: phase, shoe: shoe, dealer: dealer, hands: hands, active: active,
          hideHole: hideHole, totalStake: totalStake, splitUsed: splitUsed
        }));
      }
    } catch (err) { /* ignore */ }
  }

  function restore() {
    try {
      const raw = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (!raw || !raw.hands || !raw.hands.length) return;
      phase = raw.phase;
      shoe = raw.shoe || [];
      dealer = raw.dealer || [];
      hands = raw.hands;
      active = raw.active || 0;
      hideHole = !!raw.hideHole;
      totalStake = raw.totalStake || 0;
      splitUsed = !!raw.splitUsed;
    } catch (err) { /* ignore */ }
  }

  function setMessage(text, kind) {
    const el = $('bj-msg');
    el.textContent = text;
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }

  function cardNode(card, hidden) {
    const el = document.createElement('div');
    el.className = 'pcard' + (hidden ? ' back' : redSuit(card.s) ? ' red' : '');
    if (hidden) {
      el.textContent = '7';
      return el;
    }
    const rank = document.createElement('b');
    rank.textContent = rankLabel(card.r);
    const suit = document.createElement('span');
    suit.textContent = SUIT[card.s];
    el.appendChild(rank);
    el.appendChild(suit);
    return el;
  }

  function renderCards(target, cards, hideSecond) {
    target.replaceChildren();
    cards.forEach((card, index) => target.appendChild(cardNode(card, hideSecond && index === 1)));
  }

  function tagText(tag) {
    if (tag === 'blackjack') return 'Blackjack';
    if (tag === 'bust') return 'Überkauft';
    if (tag === 'win') return 'Gewonnen';
    if (tag === 'push') return 'Unentschieden';
    return 'Verloren';
  }

  function render() {
    renderCards($('bj-dealer'), dealer, hideHole && dealer.length > 1);
    const player = $('bj-player');
    player.replaceChildren();
    hands.forEach((hand, index) => {
      const box = document.createElement('div');
      box.className = 'hand' + (phase === 'player' && index === active ? ' active' : '');
      if (hands.length > 1) {
        const label = document.createElement('div');
        label.className = 'hand-label';
        label.textContent = 'Hand ' + (index + 1) + ' · ' + C.state.fmt(hand.bet);
        box.appendChild(label);
      }
      const row = document.createElement('div');
      row.className = 'cards';
      hand.cards.forEach((card) => row.appendChild(cardNode(card, false)));
      box.appendChild(row);
      const score = document.createElement('div');
      score.className = 'score';
      score.textContent = handTotal(hand.cards).total > 21 ? 'Überkauft' : String(handTotal(hand.cards).total);
      box.appendChild(score);
      player.appendChild(box);
    });
    if (!hands.length) {
      const hint = document.createElement('p');
      hint.className = 'muted';
      hint.textContent = 'Setze und gib die Karten.';
      player.appendChild(hint);
    }
    const dealerScore = $('bj-dealer-score');
    if (!dealer.length) dealerScore.textContent = '';
    else if (hideHole) dealerScore.textContent = 'offen ' + handTotal([dealer[0]]).total;
    else dealerScore.textContent = String(handTotal(dealer).total);

    const snap = C.state.get();
    const bet = C.BETS[snap.betIdx];
    $('bj-bet').textContent = C.state.fmt(bet);
    const playing = phase === 'player';
    $('bj-deal').disabled = phase === 'player' || phase === 'dealer' || snap.credits < bet;
    $('bj-deal').textContent = phase === 'done' ? 'Neue Runde' : 'Geben';
    $('bj-hit').disabled = !playing;
    $('bj-stand').disabled = !playing;
    const hand = hands[active];
    const canDouble = playing && hand && hand.cards.length === 2 && !hand.splitAce && snap.credits >= hand.bet;
    const canSplit = playing && hand && !splitUsed && hand.cards.length === 2 && hand.cards[0].r === hand.cards[1].r && snap.credits >= hand.bet;
    $('bj-double').disabled = !canDouble;
    $('bj-split').disabled = !canSplit;
    $('bj-minus').disabled = phase === 'player' || phase === 'dealer' || snap.betIdx <= 0;
    $('bj-plus').disabled = phase === 'player' || phase === 'dealer' || snap.betIdx >= C.BETS.length - 1;
    document.body.dataset.bjBusy = (phase === 'player' || phase === 'dealer') ? '1' : '0';
    save();
  }

  function finishRound() {
    hideHole = false;
    const result = settleHands(hands, dealer);
    C.state.addCredits(result.returned);
    const natural = hands.some((hand) => hand.natural && result.details[hands.indexOf(hand)].tag === 'blackjack');
    C.state.recordRound({
      game: 'blackjack',
      wagered: totalStake,
      payout: result.returned,
      won: result.returned > totalStake,
      jackpot: totalStake > 0 && result.returned >= totalStake * 25,
      natural: natural
    });
    const text = result.details.map((detail, index) => {
      const prefix = result.details.length > 1 ? 'Hand ' + (index + 1) + ': ' : '';
      return prefix + tagText(detail.tag);
    }).join(' · ');
    const profit = result.returned - totalStake;
    if (natural) {
      setMessage(text + ' · +' + C.state.fmt(profit) + ' Credits', 'win');
      C.audio.fanfare();
      C.effects.celebrate('big');
    } else if (profit > 0) {
      setMessage(text + ' · Gewinn +' + C.state.fmt(profit) + ' Credits', 'win');
      C.audio.win();
    } else if (profit === 0) {
      setMessage(text + ' · Einsatz zurück.');
    } else {
      setMessage(text + '.');
      C.audio.lose();
    }
    phase = 'done';
    totalStake = 0;
    render();
  }

  function anyLive() {
    return hands.some((hand) => handTotal(hand.cards).total <= 21 && !hand.natural);
  }

  function dealerLoop() {
    phase = 'dealer';
    hideHole = false;
    render();
    const step = () => {
      if (anyLive() && dealerShouldHit(dealer)) {
        dealer.push(draw());
        if (C.audio) C.audio.card();
        render();
        window.setTimeout(step, fast() ? 20 : 480);
      } else finishRound();
    };
    window.setTimeout(step, fast() ? 20 : 360);
  }

  function advance() {
    const hand = hands[active];
    if (hand && handTotal(hand.cards).total >= 21) hand.done = true;
    if (hand && !hand.done) {
      render();
      return;
    }
    for (let i = active + 1; i < hands.length; i++) {
      if (!hands[i].done) {
        active = i;
        render();
        return;
      }
    }
    dealerLoop();
  }

  function deal() {
    if (phase === 'player' || phase === 'dealer') return;
    const bet = C.BETS[C.state.get().betIdx];
    if (C.state.get().credits < bet) {
      setMessage('Nicht genug Credits.');
      return;
    }
    C.state.addCredits(-bet);
    totalStake = bet;
    splitUsed = false;
    dealer = [draw(), draw()];
    hands = [{ cards: [draw(), draw()], bet: bet, done: false, natural: false, splitAce: false }];
    active = 0;
    hideHole = true;
    phase = 'player';
    if (C.audio) C.audio.card();
    const playerBJ = isBlackjack(hands[0].cards);
    const dealerBJ = isBlackjack(dealer);
    if (playerBJ || dealerBJ) {
      hands[0].natural = playerBJ;
      hideHole = false;
      finishRound();
      return;
    }
    setMessage('Ziehen, halten, verdoppeln oder teilen.');
    render();
  }

  function hit() {
    const hand = hands[active];
    if (phase !== 'player' || !hand || hand.done) return;
    hand.cards.push(draw());
    if (C.audio) C.audio.card();
    if (handTotal(hand.cards).total >= 21) hand.done = true;
    advance();
  }

  function stand() {
    const hand = hands[active];
    if (phase !== 'player' || !hand) return;
    hand.done = true;
    advance();
  }

  function doubleDown() {
    const hand = hands[active];
    if (phase !== 'player' || !hand || hand.cards.length !== 2 || hand.splitAce) return;
    if (C.state.get().credits < hand.bet) return;
    C.state.addCredits(-hand.bet);
    totalStake += hand.bet;
    hand.bet *= 2;
    hand.cards.push(draw());
    hand.done = true;
    if (C.audio) C.audio.card();
    advance();
  }

  function split() {
    const hand = hands[active];
    if (phase !== 'player' || !hand || splitUsed) return;
    if (hand.cards.length !== 2 || hand.cards[0].r !== hand.cards[1].r) return;
    if (C.state.get().credits < hand.bet) return;
    C.state.addCredits(-hand.bet);
    totalStake += hand.bet;
    splitUsed = true;
    const aces = hand.cards[0].r === 1;
    const second = hand.cards.pop();
    hand.cards.push(draw());
    hand.splitAce = aces;
    const other = {
      cards: [second, draw()],
      bet: hand.bet,
      done: aces,
      natural: false,
      splitAce: aces
    };
    hand.done = aces || handTotal(hand.cards).total >= 21;
    other.done = aces || handTotal(other.cards).total >= 21;
    hands.splice(active + 1, 0, other);
    if (C.audio) C.audio.card();
    if (aces || hand.done) advance();
    else render();
  }

  function init() {
    restore();
    $('bj-deal').addEventListener('click', () => {
      if (phase === 'done') {
        phase = 'bet';
        dealer = [];
        hands = [];
        hideHole = true;
        setMessage('Neue Runde. Viel Glück.');
        render();
        return;
      }
      deal();
    });
    $('bj-hit').addEventListener('click', hit);
    $('bj-stand').addEventListener('click', stand);
    $('bj-double').addEventListener('click', doubleDown);
    $('bj-split').addEventListener('click', split);
    $('bj-minus').addEventListener('click', () => {
      if (phase === 'player' || phase === 'dealer') return;
      const snap = C.state.get();
      if (snap.betIdx <= 0) return;
      C.state.setBetIdx(snap.betIdx - 1);
      render();
    });
    $('bj-plus').addEventListener('click', () => {
      if (phase === 'player' || phase === 'dealer') return;
      const snap = C.state.get();
      if (snap.betIdx >= C.BETS.length - 1) return;
      C.state.setBetIdx(snap.betIdx + 1);
      render();
    });
    if (phase === 'bet') setMessage('Dealer hält bei 17. Blackjack zahlt 3:2.');
    render();
    if (phase === 'dealer') dealerLoop();
  }

  C.blackjack = {
    meta: {
      id: 'blackjack',
      name: 'Blackjack',
      icons: '🂡🂱',
      desc: 'Dealer hält bei 17. Verdoppeln und Teilen möglich. Blackjack zahlt 3:2.',
      tag: '6 Decks'
    },
    init: init,
    onShow() { render(); },
    close() { return phase !== 'player' && phase !== 'dealer'; },
    isBusy: () => phase === 'player' || phase === 'dealer',
    handTotal: handTotal,
    settleHands: settleHands,
    dealerShouldHit: dealerShouldHit,
    selfCheck: selfCheck,
    _debugDraws: null,
    refresh: render
  };
})();
