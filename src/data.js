// Data constants used across V2 landing components

export const PEOPLE = [
  { id: 'you',   name: 'You',   tint: '#111110' },
  { id: 'maya',  name: 'Maya',  tint: '#A64E2C' },
  { id: 'diego', name: 'Diego', tint: '#3B6B46' },
  { id: 'sam',   name: 'Sam',   tint: '#5F4B8B' },
];

export const EXPENSES = [
  { label: 'Dinner at Tasca',   amt: 48,  payer: 'you',   date: '22 Apr' },
  { label: 'Airbnb Lisbon',     amt: 320, payer: 'diego', date: '20 Apr' },
  { label: 'Groceries',         amt: 24,  payer: 'maya',  date: '19 Apr' },
  { label: 'Taxi to airport',   amt: 12,  payer: 'sam',   date: '18 Apr' },
  { label: 'Museum tickets',    amt: 36,  payer: 'you',   date: '17 Apr' },
  { label: 'Coffee + pastries', amt: 18,  payer: 'diego', date: '17 Apr' },
];

export const MARQUEE_ITEMS = [
  { emoji: '🍕', label: 'Pizza + drinks',     amt: 48,   where: 'Brooklyn' },
  { emoji: '✈️', label: 'Flights to Lisbon',   amt: 420,  where: 'LIS ← JFK' },
  { emoji: '🏠', label: 'April rent',          amt: 1850, where: 'Apt 4B' },
  { emoji: '🎟️', label: 'Concert tickets',     amt: 180,  where: 'Elsewhere Hall' },
  { emoji: '🚗', label: 'Uber to airport',     amt: 32,   where: '6:14 AM' },
  { emoji: '🍳', label: "Brunch @ Sadelle's",  amt: 94,   where: 'SoHo' },
  { emoji: '⛷️', label: 'Ski weekend lodge',   amt: 720,  where: 'Hunter Mtn' },
  { emoji: '☕', label: 'Coffee run',           amt: 14,   where: 'Blue Bottle' },
  { emoji: '🎂', label: 'Birthday cake',       amt: 46,   where: 'Magnolia' },
  { emoji: '🎳', label: 'Bowling night',       amt: 108,  where: 'Frames' },
  { emoji: '🌮', label: 'Taco Tuesday',        amt: 62,   where: 'Oxomoco' },
  { emoji: '🎬', label: 'Movie + popcorn',     amt: 54,   where: 'Nitehawk' },
];

export const FEATURE_ROWS = [
  { num: '01', title: 'Smart debt simplification', sub: 'Minimum cashflow algorithm', body: 'Owe Maya $20, Maya owes Diego $20? One payment settles it. The solver finds the fewest possible transfers.', meta: 'AVG. 63% FEWER PAYMENTS' },
  { num: '02', title: 'Flexible splits', sub: 'Equal, exact, percentage, shares', body: 'Split down the middle or weight it by who ate what. Tax, tip, and rounding handled without the mental math.', meta: '4 METHODS / AUDIT TRAIL' },
  { num: '03', title: 'Any payment method', sub: 'Venmo, Zelle, cash, crypto', body: 'Log it however the money moved. We track the ledger — you pick the rails. No processor fees, ever.', meta: '0% PROCESSING FEES' },
  { num: '04', title: 'Splitwise import', sub: 'Migrate in one step', body: 'Drop in your Splitwise export — groups, balances, edits, and history come across intact. Dry-run preview before commit.', meta: '95% IMPORT SUCCESS' },
  { num: '05', title: 'Real-time activity', sub: 'Live feed across the group', body: 'Every expense, edit, and settlement shows up instantly. No more "did you add that?" group chats.', meta: 'SUB-SECOND SYNC' },
  { num: '06', title: 'Multi-currency', sub: 'Travel without friction', body: 'Log in the local currency, settle in yours. FX snapshot locked to the expense date — no creative accounting.', meta: '150+ CURRENCIES' },
];

export const SHOWCASE_SCREENS = [
  { screen: 'home',     caption: 'One glance, every balance',    tag: 'HOME',     tint: 'oklch(0.94 0.04 125)' },
  { screen: 'group',    caption: 'Every expense, threaded',      tag: 'GROUP',    tint: 'oklch(0.93 0.05 60)',  params: 'groupId=g-lisbon' },
  { screen: 'add',      caption: 'Ten seconds, start to posted', tag: 'ADD',      tint: 'oklch(0.93 0.04 340)' },
  { screen: 'simplify', caption: 'The fewest payments possible', tag: 'SIMPLIFY', tint: 'oklch(0.94 0.05 200)', params: 'groupId=g-lisbon' },
];

export const COMPARE_ROWS = [
  ['Smart debt simplification',  'yes', 'yes'],
  ['Real-time activity feed',    'yes', 'yes'],
  ['Unlimited groups',           'yes', 'limited'],
  ['No ads, ever',               'yes', 'no'],
  ['Import your history',        'yes', '—'],
  ['Flat $0 to start',           'yes', 'yes'],
  ['Export your ledger anytime', 'yes', 'no'],
  ['Open-source math engine',    'yes', 'no'],
];

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.splitesettle.com';

// Utility functions
export function personName(id) { return PEOPLE.find(p => p.id === id)?.name || id; }
export function personTint(id) { return PEOPLE.find(p => p.id === id)?.tint || '#666'; }

export function computeNet() {
  const net = {};
  PEOPLE.forEach(p => net[p.id] = 0);
  EXPENSES.forEach(e => {
    const per = e.amt / 4;
    net[e.payer] += e.amt;
    PEOPLE.forEach(p => net[p.id] -= per);
  });
  return net;
}

export function naivePayments() {
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

export function simplifiedPayments() {
  const net = computeNet();
  const creditors = [], debtors = [];
  Object.entries(net).forEach(([id, v]) => {
    if (v > 0.01) creditors.push({ id, amt: v });
    else if (v < -0.01) debtors.push({ id, amt: -v });
  });
  const out = [];
  const creds = creditors.map(c => ({ ...c }));
  const debs = debtors.map(d => ({ ...d }));
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
