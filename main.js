/* ===== V2 Landing — main.js ===== */

// ───── DATA ─────
const PEOPLE = [
  { id: 'you',   name: 'You',   tint: '#111110' },
  { id: 'maya',  name: 'Maya',  tint: '#A64E2C' },
  { id: 'diego', name: 'Diego', tint: '#3B6B46' },
  { id: 'sam',   name: 'Sam',   tint: '#5F4B8B' },
];

const EXPENSES = [
  { label: 'Dinner at Tasca',  amt: 48,  payer: 'you',   date: '22 Apr' },
  { label: 'Airbnb Lisbon',    amt: 320, payer: 'diego', date: '20 Apr' },
  { label: 'Groceries',        amt: 24,  payer: 'maya',  date: '19 Apr' },
  { label: 'Taxi to airport',  amt: 12,  payer: 'sam',   date: '18 Apr' },
  { label: 'Museum tickets',   amt: 36,  payer: 'you',   date: '17 Apr' },
  { label: 'Coffee + pastries',amt: 18,  payer: 'diego', date: '17 Apr' },
];

const MARQUEE_ITEMS = [
  { emoji: '🍕', label: 'Pizza + drinks', amt: 48, where: 'Brooklyn' },
  { emoji: '✈️', label: 'Flights to Lisbon', amt: 420, where: 'LIS ← JFK' },
  { emoji: '🏠', label: 'April rent', amt: 1850, where: 'Apt 4B' },
  { emoji: '🎟️', label: 'Concert tickets', amt: 180, where: 'Elsewhere Hall' },
  { emoji: '🚗', label: 'Uber to airport', amt: 32, where: '6:14 AM' },
  { emoji: '🍳', label: "Brunch @ Sadelle's", amt: 94, where: 'SoHo' },
  { emoji: '⛷️', label: 'Ski weekend lodge', amt: 720, where: 'Hunter Mtn' },
  { emoji: '☕', label: 'Coffee run', amt: 14, where: 'Blue Bottle' },
  { emoji: '🎂', label: 'Birthday cake', amt: 46, where: 'Magnolia' },
  { emoji: '🎳', label: 'Bowling night', amt: 108, where: 'Frames' },
  { emoji: '🌮', label: 'Taco Tuesday', amt: 62, where: 'Oxomoco' },
  { emoji: '🎬', label: 'Movie + popcorn', amt: 54, where: 'Nitehawk' },
];

const FEATURE_ROWS = [
  { num: '01', title: 'Smart debt simplification', sub: 'Minimum cashflow algorithm', body: 'Owe Maya $20, Maya owes Diego $20? One payment settles it. The solver finds the fewest possible transfers.', meta: 'AVG. 63% FEWER PAYMENTS' },
  { num: '02', title: 'Flexible splits', sub: 'Equal, exact, percentage, shares', body: 'Split down the middle or weight it by who ate what. Tax, tip, and rounding handled without the mental math.', meta: '4 METHODS / AUDIT TRAIL' },
  { num: '03', title: 'Any payment method', sub: 'Venmo, Zelle, cash, crypto', body: "Log it however the money moved. We track the ledger — you pick the rails. No processor fees, ever.", meta: '0% PROCESSING FEES' },
  { num: '04', title: 'Splitwise import', sub: 'Migrate in one step', body: 'Drop in your Splitwise export — groups, balances, edits, and history come across intact. Dry-run preview before commit.', meta: '95% IMPORT SUCCESS' },
  { num: '05', title: 'Real-time activity', sub: 'Live feed across the group', body: 'Every expense, edit, and settlement shows up instantly. No more "did you add that?" group chats.', meta: 'SUB-SECOND SYNC' },
  { num: '06', title: 'Multi-currency', sub: 'Travel without friction', body: 'Log in the local currency, settle in yours. FX snapshot locked to the expense date — no creative accounting.', meta: '150+ CURRENCIES' },
];

const SHOWCASE_SCREENS = [
  { screen: 'home',     caption: 'One glance, every balance',    tag: 'HOME',     tint: 'oklch(0.94 0.04 125)' },
  { screen: 'group',    caption: 'Every expense, threaded',      tag: 'GROUP',    tint: 'oklch(0.93 0.05 60)',  params: 'groupId=g-lisbon' },
  { screen: 'add',      caption: 'Ten seconds, start to posted', tag: 'ADD',      tint: 'oklch(0.93 0.04 340)' },
  { screen: 'simplify', caption: 'The fewest payments possible', tag: 'SIMPLIFY', tint: 'oklch(0.94 0.05 200)', params: 'groupId=g-lisbon' },
];

const COMPARE_ROWS = [
  ['Smart debt simplification',  'yes', 'yes'],
  ['Real-time activity feed',    'yes', 'yes'],
  ['Unlimited groups',           'yes', 'limited'],
  ['No ads, ever',               'yes', 'no'],
  ['Import your history',        'yes', '—'],
  ['Flat $0 to start',           'yes', 'yes'],
  ['Export your ledger anytime',  'yes', 'no'],
  ['Open-source math engine',    'yes', 'no'],
];

// ───── HELPERS ─────
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function personName(id) { return PEOPLE.find(p => p.id === id)?.name || id; }
function personTint(id) { return PEOPLE.find(p => p.id === id)?.tint || '#666'; }

function avatarHTML(id, size = 32) {
  const p = PEOPLE.find(x => x.id === id);
  return `<div class="balance-avatar" style="width:${size}px;height:${size}px;background:${p.tint};font-size:${size*0.4}px">${p.name[0]}</div>`;
}

// ───── NAV ─────
(function initNav() {
  const nav = $('#nav');
  const toggle = $('#nav-toggle');
  const menu = $('#mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();

// ───── REVEAL OBSERVER ─────
(function initReveals() {
  const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );
  const register = () => {
    document.querySelectorAll(SELECTOR).forEach(el => {
      if (!el.classList.contains('visible') && !el.__observed) {
        el.__observed = true;
        obs.observe(el);
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('visible');
          obs.unobserve(el);
        }
      }
    });
  };
  register();
  [50, 200, 500, 1000, 2000].forEach(ms => setTimeout(register, ms));
  window.addEventListener('scroll', () => {
    document.querySelectorAll(SELECTOR + ':not(.visible)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 20 && r.bottom > 0) el.classList.add('visible');
    });
  }, { passive: true });
})();

// ───── TICK NUMBERS ─────
(function initTickNumbers() {
  const els = document.querySelectorAll('[data-tick]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.__ticked) {
        e.target.__ticked = true;
        obs.unobserve(e.target);
        const value = parseFloat(e.target.dataset.tick);
        const decimals = parseInt(e.target.dataset.decimals || '0');
        const prefix = e.target.dataset.prefix || '';
        const suffix = e.target.dataset.suffix || '';
        const t0 = performance.now();
        const duration = 1400;
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = value * eased;
          e.target.textContent = prefix + v.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.3 });
  els.forEach(el => obs.observe(el));
})();

// ───── HERO LEDGER TICKER ─────
(function initLedgerTicker() {
  const container = $('#ledger-rows');
  if (!container) return;

  EXPENSES.forEach((e) => {
    const paidByYou = e.payer === 'you';
    const yourShare = e.amt / 4;
    const net = paidByYou ? e.amt - yourShare : -yourShare;
    const sign = net >= 0 ? '+' : '−';
    const color = net >= 0 ? 'var(--back)' : 'var(--owe)';

    const row = document.createElement('div');
    row.className = 'ledger-row';
    row.innerHTML = `
      <span style="color:var(--ink-3)">${e.date}</span>
      <span style="color:var(--ink);font-weight:500">${e.label}</span>
      <span style="color:var(--ink-2)">${personName(e.payer)}</span>
      <span style="text-align:right;color:var(--ink);font-weight:500">$${e.amt.toFixed(2)}</span>
      <span style="text-align:right;font-weight:600;color:${color}">${sign}$${Math.abs(net).toFixed(2)}</span>
    `;
    container.appendChild(row);
  });

  // Animate rows in
  let visible = 0;
  const rows = container.querySelectorAll('.ledger-row');
  const iv = setInterval(() => {
    if (visible < rows.length) {
      rows[visible].classList.add('visible');
      visible++;
    } else {
      clearInterval(iv);
      // Update net
      const netEl = $('#ledger-net');
      if (netEl) netEl.textContent = '+$94.18';
    }
  }, 350);
})();

// ───── MARQUEE ─────
(function initMarquee() {
  function makeItems(items) {
    return items.map(it => `
      <div class="marquee-item">
        <span class="emoji">${it.emoji}</span>
        <span class="label">${it.label}</span>
        <span class="where">${it.where}</span>
        <span class="amt">$${it.amt.toFixed(2)}</span>
        <span class="dot-sm"></span>
      </div>
    `).join('');
  }

  const ltr = $('#marquee-ltr');
  const rtl = $('#marquee-rtl');
  if (ltr) ltr.innerHTML = makeItems(MARQUEE_ITEMS) + makeItems(MARQUEE_ITEMS);
  const reversed = [...MARQUEE_ITEMS].reverse();
  if (rtl) rtl.innerHTML = makeItems(reversed) + makeItems(reversed);
})();

// ───── DEBT SIMPLIFICATION (The Math Section) ─────
(function initDebtSimplification() {
  // Compute net balances
  const net = {};
  PEOPLE.forEach(p => net[p.id] = 0);
  EXPENSES.forEach(e => {
    const per = e.amt / 4;
    net[e.payer] += e.amt;
    PEOPLE.forEach(p => net[p.id] -= per);
  });

  // Render balance card
  const balanceCard = $('#balance-card');
  if (balanceCard) {
    let html = '';
    PEOPLE.forEach((p, i) => {
      const v = net[p.id];
      const sign = v >= 0 ? '+' : '−';
      const color = v >= 0 ? 'var(--back)' : 'var(--owe)';
      const label = v >= 0 ? 'Owed' : 'Owes';
      html += `
        <div class="balance-row">
          ${avatarHTML(p.id, 40)}
          <div>
            <div class="balance-name">${p.name}</div>
            <div class="balance-detail">${label} · ${Math.abs(v).toFixed(2)} €</div>
          </div>
          <div class="balance-amt" style="color:${color}">${sign}$${Math.abs(v).toFixed(2)}</div>
        </div>
      `;
    });
    html += `<div class="balance-sum"><span>Sum</span><span style="font-weight:600">$0.00 ✓</span></div>`;
    balanceCard.innerHTML = html;
  }

  // Naive payments: each expense creates edges
  function naivePayments() {
    const edges = {};
    EXPENSES.forEach(e => {
      const per = e.amt / 4;
      PEOPLE.forEach(p => {
        if (p.id === e.payer) return;
        const key = `${p.id}->${e.payer}`;
        edges[key] = (edges[key] || 0) + per;
      });
    });
    return Object.entries(edges).map(([k, v]) => {
      const [from, to] = k.split('->');
      return { from, to, amt: v };
    });
  }

  // Simplified payments: greedy min-cashflow
  function simplifiedPayments() {
    const creditors = [], debtors = [];
    Object.entries(net).forEach(([id, v]) => {
      if (v > 0.01) creditors.push({ id, amt: v });
      else if (v < -0.01) debtors.push({ id, amt: -v });
    });
    const out = [];
    const creds = creditors.map(c => ({...c}));
    const debs = debtors.map(d => ({...d}));
    while (debs.length && creds.length) {
      const d = debs[0], c = creds[0];
      const pay = Math.min(d.amt, c.amt);
      out.push({ from: d.id, to: c.id, amt: pay });
      d.amt -= pay; c.amt -= pay;
      if (d.amt < 0.01) debs.shift();
      if (c.amt < 0.01) creds.shift();
    }
    return out;
  }

  const naive = naivePayments();
  const simple = simplifiedPayments();
  let mode = 'naive';

  function renderPayments() {
    const payments = mode === 'naive' ? naive : simple;
    const totalMoved = payments.reduce((s, p) => s + p.amt, 0);
    const highlight = mode === 'simple';

    const list = $('#payments-list');
    if (list) {
      list.innerHTML = payments.map((p, i) => `
        <div class="payment-line ${highlight ? 'highlight' : ''}" style="animation:fadeIn 0.4s ease ${i * 0.06}s both">
          ${avatarHTML(p.from, 32)}
          <span class="payment-label">pays</span>
          <span class="payment-amt">$${p.amt.toFixed(2)}</span>
          <span class="payment-label">to</span>
          ${avatarHTML(p.to, 32)}
        </div>
      `).join('');
    }

    const stats = $('#payments-stats');
    if (stats) stats.textContent = `${payments.length} transfers / $${totalMoved.toFixed(2)} moved`;

    const summary = $('#payments-summary');
    const mainEl = $('#summary-main');
    const noteEl = $('#summary-note');
    if (summary) summary.classList.toggle('highlight', highlight);
    if (mainEl) mainEl.textContent = highlight
      ? `${payments.length} payments. Everyone even.`
      : `${payments.length} tangled IOUs.`;
    if (noteEl) noteEl.textContent = highlight
      ? `${Math.round((1 - payments.length / naive.length) * 100)}% fewer transactions than the naive approach`
      : 'Good luck keeping track.';

    // Toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });
  }

  renderPayments();

  // Toggle handlers
  $('#toggle-naive')?.addEventListener('click', () => { mode = 'naive'; renderPayments(); });
  $('#toggle-simple')?.addEventListener('click', () => { mode = 'simple'; renderPayments(); });

  // Auto-toggle demo
  setInterval(() => {
    mode = mode === 'naive' ? 'simple' : 'naive';
    renderPayments();
  }, 4500);
})();

// ───── FEATURES ─────
(function initFeatures() {
  const list = $('#features-list');
  if (!list) return;

  list.innerHTML = FEATURE_ROWS.map((f, i) => `
    <div class="feature-row reveal ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <div class="lime-marker"></div>
      <div class="feature-num">${f.num} /</div>
      <div>
        <div class="feature-title">${f.title}</div>
        <div class="feature-sub">${f.sub}</div>
      </div>
      <div class="feature-body">${f.body}</div>
      <div class="feature-meta">${f.meta}</div>
    </div>
  `).join('');
})();

// ───── SHOWCASE ─────
(function initShowcase() {
  const list = $('#showcase-list');
  const stage = $('#showcase-stage');
  const frame = $('#showcase-frame');
  const figNum = $('#showcase-fig');
  if (!list || !frame) return;

  let active = 0;

  function render() {
    const s = SHOWCASE_SCREENS[active];
    const url = `/preview/index.html?screen=${s.screen}${s.params ? '&' + s.params : ''}`;
    frame.src = url;
    if (stage) stage.style.background = s.tint;
    if (figNum) figNum.textContent = `FIG. ${String(active + 4).padStart(2, '0')} / ${s.tag}`;

    list.innerHTML = SHOWCASE_SCREENS.map((sc, i) => `
      <button data-idx="${i}">
        <span class="s-num ${i === active ? 'active' : ''}">0${i + 1} /</span>
        <span class="s-caption ${i === active ? 'active' : ''}">${sc.caption}</span>
        <span class="s-tag">${sc.tag}</span>
        ${i === active ? '<div class="progress-bar"></div>' : ''}
      </button>
    `).join('');

    list.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        active = parseInt(btn.dataset.idx);
        render();
        clearInterval(autoIv);
        autoIv = setInterval(() => { active = (active + 1) % SHOWCASE_SCREENS.length; render(); }, 3600);
      });
    });
  }

  render();
  let autoIv = setInterval(() => { active = (active + 1) % SHOWCASE_SCREENS.length; render(); }, 3600);
})();

// ───── COMPARISON TABLE ─────
(function initComparison() {
  const container = $('#compare-rows');
  if (!container) return;

  function markHTML(v) {
    if (v === 'yes') return `<span class="check-mark"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5l3 3 5-6" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
    if (v === 'no' || v === '—') return `<span class="mono" style="font-size:11px;color:var(--ink-3)">—</span>`;
    return `<span class="mono" style="font-size:11px;color:var(--ink-2)">${v}</span>`;
  }

  container.innerHTML = COMPARE_ROWS.map((r, i) => `
    <div class="compare-row">
      <div class="feat-name">${r[0]}</div>
      <div class="cell">${markHTML(r[1])}</div>
      <div class="cell">${markHTML(r[2])}</div>
    </div>
  `).join('');
})();
