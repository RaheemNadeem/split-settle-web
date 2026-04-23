// Sample data for the Settle prototype
const ME = { id: 'me', name: 'You', initials: 'YO', color: 'oklch(0.62 0.14 260)' };

const PEOPLE = [
  { id: 'maya',  name: 'Maya Okafor',    email: 'maya@okafor.co',    initials: 'MO', color: 'oklch(0.62 0.14 340)' },
  { id: 'diego', name: 'Diego Martín',   email: 'diego@martin.app',  initials: 'DM', color: 'oklch(0.62 0.14 45)' },
  { id: 'priya', name: 'Priya Ravindran', email: 'priya@ravin.com',  initials: 'PR', color: 'oklch(0.62 0.14 200)' },
  { id: 'sam',   name: 'Sam Chen',       email: 'sam@chen.dev',      initials: 'SC', color: 'oklch(0.62 0.14 110)' },
  { id: 'lex',   name: 'Lex Bauer',      email: 'lex@bauer.io',      initials: 'LB', color: 'oklch(0.62 0.14 290)' },
];

const GROUPS = [
  {
    id: 'g-lisbon',
    name: 'Lisbon trip',
    sub: 'Apr 10 – 17 · 4 members',
    net: 84.20,
    members: ['me', 'maya', 'diego', 'priya'],
    base: 'EUR',
  },
  {
    id: 'g-apt',
    name: 'Apt 4B · rent & utilities',
    sub: 'Shared · 3 members',
    net: -142.50,
    members: ['me', 'sam', 'lex'],
    base: 'USD',
  },
  {
    id: 'g-supper',
    name: 'Supper club',
    sub: 'Monthly · 5 members',
    net: 18.75,
    members: ['me', 'maya', 'diego', 'priya', 'sam'],
    base: 'USD',
  },
];

const EXPENSES = [
  { id: 'e1', group: 'g-lisbon', title: 'Time Out Market dinner', payer: 'maya',  amount: 128.40, date: 'Apr 14', cat: 'Food', split: 'equal', participants: ['me','maya','diego','priya'], note: 'Split 4 ways, Priya vegetarian', currency: 'EUR' },
  { id: 'e2', group: 'g-lisbon', title: 'Uber to Belém',          payer: 'me',    amount: 22.10,  date: 'Apr 13', cat: 'Transit', split: 'equal', participants: ['me','maya','diego','priya'], currency: 'EUR' },
  { id: 'e3', group: 'g-lisbon', title: 'Airbnb · 7 nights',      payer: 'diego', amount: 1340.00,date: 'Apr 10', cat: 'Lodging', split: 'shares', participants: ['me','maya','diego','priya'], currency: 'EUR' },
  { id: 'e4', group: 'g-lisbon', title: 'Pastéis de Belém',       payer: 'priya', amount: 14.80,  date: 'Apr 13', cat: 'Food', split: 'exact', participants: ['me','priya'], currency: 'EUR' },
  { id: 'e5', group: 'g-lisbon', title: 'Tram + metro 7-day',     payer: 'maya',  amount: 164.00, date: 'Apr 11', cat: 'Transit', split: 'equal', participants: ['me','maya','diego','priya'], currency: 'EUR' },
  { id: 'e6', group: 'g-lisbon', title: 'Fado dinner at Tasca',   payer: 'me',    amount: 96.50,  date: 'Apr 15', cat: 'Food', split: 'percent', participants: ['me','maya','diego','priya'], currency: 'EUR' },
];

const ACTIVITY = [
  { id: 'a1', who: 'maya',  verb: 'added',    what: 'Time Out Market dinner',   ctx: 'Lisbon trip', amt: 128.40, ago: '2h', you: -32.10 },
  { id: 'a2', who: 'me',    verb: 'paid',     what: 'Fado dinner at Tasca',     ctx: 'Lisbon trip', amt: 96.50,  ago: '5h', you: 72.38 },
  { id: 'a3', who: 'sam',   verb: 'settled',  what: 'owed you',                 ctx: 'Apt 4B',      amt: 240.00, ago: 'yesterday', you: 240.00, settle: true },
  { id: 'a4', who: 'diego', verb: 'added',    what: 'Airbnb · 7 nights',        ctx: 'Lisbon trip', amt: 1340.00, ago: '4d', you: -335.00 },
  { id: 'a5', who: 'priya', verb: 'edited',   what: 'Pastéis de Belém',        ctx: 'Lisbon trip', amt: 14.80,  ago: '4d', you: -7.40 },
  { id: 'a6', who: 'lex',   verb: 'added',    what: 'Internet · April',         ctx: 'Apt 4B',      amt: 75.00,  ago: '6d', you: -25.00 },
];

// Balances for the current user across groups
const OVERALL = { owedToYou: 386.45, youOwe: 214.30, net: 172.15, currency: 'USD' };

// Import preview fixture
const IMPORT_PREVIEW = {
  file: 'splitwise-export-2026-04-01.csv',
  size: '1.2 MB',
  rows: 487,
  groups: 6,
  expenses: 412,
  settlements: 48,
  users: 14,
  matched: 11,
  pending: 3,
  totals: { expenses: 18420.55, settlements: 9210.00 },
  unresolved: [
    { email: 'taro.ito@example.jp', count: 24 },
    { email: 'roommate.old@gmail.com', count: 41 },
    { email: 'j.smith@acme.co', count: 9 },
  ],
};

const PERSON = id => id === 'me' ? ME : PEOPLE.find(p => p.id === id);

// Per-currency balances for the current user (multi-currency, each treated as its own bucket)
const BALANCES_BY_CURRENCY = [
  { code: 'USD', symbol: '$',  owedToYou: 186.45, youOwe:  84.30 },
  { code: 'EUR', symbol: '€',  owedToYou:  92.00, youOwe: 118.20 },
  { code: 'INR', symbol: '₹',  owedToYou: 1250.00,youOwe:   0    },
  { code: 'GBP', symbol: '£',  owedToYou:   0,    youOwe:  42.50 },
];

// Per-currency balances with each friend — each currency is its own ledger
const FRIEND_BALANCES = {
  maya:  [ { code: 'EUR', symbol: '€', net:  48.20 }, { code: 'USD', symbol: '$', net:  12.00 } ],
  diego: [ { code: 'EUR', symbol: '€', net: -62.40 }, { code: 'INR', symbol: '₹', net: 1250.00 } ],
  priya: [ { code: 'USD', symbol: '$', net:  12.00 } ],
  sam:   [],
  lex:   [ { code: 'USD', symbol: '$', net: -80.10 }, { code: 'GBP', symbol: '£', net: -42.50 } ],
};

// Supported currencies for the selector
const CURRENCIES = [
  { code: 'USD', symbol: '$',   name: 'US Dollar' },
  { code: 'EUR', symbol: '€',   name: 'Euro' },
  { code: 'GBP', symbol: '£',   name: 'British Pound' },
  { code: 'INR', symbol: '₹',   name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$',  name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar' },
  { code: 'BRL', symbol: 'R$',  name: 'Brazilian Real' },
];

Object.assign(window, { ME, PEOPLE, GROUPS, EXPENSES, ACTIVITY, OVERALL, IMPORT_PREVIEW, PERSON, BALANCES_BY_CURRENCY, FRIEND_BALANCES, CURRENCIES });
