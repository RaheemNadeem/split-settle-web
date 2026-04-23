// Edit existing expense (reuses AddExpense shape, prefilled), delete-confirm sheet, and generic error screen.

function ScreenEditExpense({ expenseId, goto }) {
  const e = EXPENSES.find(x => x.id === expenseId) || EXPENSES[0];
  const [title, setTitle] = React.useState(e.title);
  const [amount, setAmount] = React.useState(String(e.amount));
  const [currency, setCurrency] = React.useState(e.currency || 'USD');
  const [cat, setCat] = React.useState(e.cat);
  const [note, setNote] = React.useState(e.note || '');
  const [payer, setPayer] = React.useState(e.payer);

  const sym = (CURRENCIES.find(c => c.code === currency) || {}).symbol || '$';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon="x" onClick={() => goto('expense', { expenseId })} />}
        title="Edit expense"
        subtitle={`#${e.id.toUpperCase()}`}
        right={<Btn size="sm" onClick={() => goto('expense', { expenseId })}>Save</Btn>}
      />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 24px' }}>

        {/* Amount + currency hero */}
        <div style={{
          padding: '18px 16px', borderRadius: 16, background: 'var(--surface)',
          border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <select
            value={currency}
            onChange={ev => setCurrency(ev.target.value)}
            className="mono"
            style={{
              padding: '10px 12px', borderRadius: 10, background: 'var(--chip)',
              border: '1px solid var(--line)', fontSize: 14, fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer',
              color: 'var(--ink)',
            }}
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
          </select>
          <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="mono" style={{ fontSize: 28, fontWeight: 600, color: 'var(--ink-3)' }}>{sym}</span>
            <input
              value={amount}
              onChange={ev => setAmount(ev.target.value)}
              inputMode="decimal"
              className="mono"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em',
                fontFamily: "'JetBrains Mono', monospace", color: 'var(--ink)',
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Description</label>
          <input
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            style={{
              width: '100%', marginTop: 6, padding: '12px 14px',
              borderRadius: 12, border: '1px solid var(--line)',
              background: 'var(--surface)', fontSize: 14, fontFamily: 'inherit',
              color: 'var(--ink)', outline: 'none',
            }}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Paid by</label>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 8 }}>
            {['me', ...e.participants.filter(p => p !== 'me')].map(id => {
              const p = PERSON(id);
              const on = payer === id;
              return (
                <button key={id} onClick={() => setPayer(id)} style={{
                  flexShrink: 0, padding: '8px 12px 8px 8px', borderRadius: 999,
                  border: '1px solid ' + (on ? 'var(--ink)' : 'var(--line)'),
                  background: on ? 'var(--ink)' : 'var(--surface)',
                  color: on ? 'var(--bg)' : 'var(--ink)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                  <Avatar person={p} size={24} />
                  {p.name === 'You' ? 'You' : p.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Category</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {['Food','Transit','Lodging','Entertainment','Groceries','Utilities','Other'].map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '6px 12px', borderRadius: 999,
                border: '1px solid ' + (cat === c ? 'var(--ink)' : 'var(--line)'),
                background: cat === c ? 'var(--ink)' : 'var(--surface)',
                color: cat === c ? 'var(--bg)' : 'var(--ink-2)',
                fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Note</label>
          <textarea
            value={note}
            onChange={ev => setNote(ev.target.value)}
            placeholder="Add a note…"
            style={{
              width: '100%', marginTop: 6, padding: '12px 14px',
              borderRadius: 12, border: '1px solid var(--line)',
              background: 'var(--surface)', fontSize: 14, fontFamily: 'inherit',
              color: 'var(--ink)', outline: 'none', resize: 'vertical', minHeight: 70,
            }}
          />
        </div>

        <button
          onClick={() => goto('deleteExpense', { expenseId })}
          style={{
            width: '100%', marginTop: 18, padding: '14px', borderRadius: 12,
            border: '1px solid #FCA5A5',
            background: 'transparent', color: '#B91C1C',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
          Delete this expense
        </button>
      </div>
    </div>
  );
}

// Delete confirm — modal-style sheet that emphasizes irreversibility
function ScreenDeleteExpense({ expenseId, goto }) {
  const e = EXPENSES.find(x => x.id === expenseId) || EXPENSES[0];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'rgba(11, 15, 20, 0.5)', justifyContent: 'flex-end',
    }}>
      <div style={{
        background: 'var(--bg)', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: '22px 22px calc(22px + env(safe-area-inset-bottom, 0))',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: '#FEE2E2', color: '#B91C1C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="trash" size={26} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 14, letterSpacing: '-0.01em' }}>
          Delete "{e.title}"?
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 8 }}>
          This action is <strong style={{ color: '#B91C1C' }}>irreversible</strong>. All split balances tied to this expense will be
          recalculated for everyone in <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{(GROUPS.find(g => g.id === e.group) || {}).name || 'this group'}</span>.
        </div>

        <div style={{
          marginTop: 14, padding: '12px 14px', borderRadius: 12,
          background: 'var(--chip)', border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{e.date}</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{e.title}</div>
          <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>
            {(CURRENCIES.find(c => c.code === (e.currency || 'USD')) || {}).symbol}{e.amount.toFixed(2)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button
            onClick={() => goto('expense', { expenseId })}
            style={{
              flex: 1, padding: '14px', borderRadius: 12,
              border: '1px solid var(--line)', background: 'var(--surface)',
              fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              color: 'var(--ink)',
            }}>
            Cancel
          </button>
          <button
            onClick={() => goto('group', { groupId: e.group })}
            style={{
              flex: 1, padding: '14px', borderRadius: 12, border: 'none',
              background: '#DC2626',
              color: 'white',
              fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}>
            Delete forever
          </button>
        </div>
      </div>
    </div>
  );
}

// Generic error screen
function ScreenError({ goto, kind = 'generic' }) {
  const presets = {
    generic: {
      code: 'ERR_UNKNOWN',
      title: 'Something went sideways.',
      message: "We hit an unexpected snag. Your data is safe — nothing was changed.",
      actions: [
        { label: 'Try again',   primary: true, onClick: () => goto('home') },
        { label: 'Report issue', onClick: () => {} },
      ],
    },
    offline: {
      code: 'ERR_NETWORK',
      title: "You're offline.",
      message: "We can't reach the Splitly servers. Changes you make will sync automatically when you're back.",
      actions: [
        { label: 'Retry',     primary: true, onClick: () => goto('home') },
        { label: 'Work offline', onClick: () => goto('home') },
      ],
    },
    server: {
      code: 'ERR_5XX',
      title: 'Our servers are having a moment.',
      message: "This usually clears up in a few minutes. We've been paged.",
      actions: [
        { label: 'Try again',    primary: true, onClick: () => goto('home') },
        { label: 'Status page',  onClick: () => {} },
      ],
    },
    save: {
      code: 'ERR_SAVE_FAILED',
      title: "We couldn't save that expense.",
      message: "Your draft is kept on this device. Tap retry to try again, or edit and submit once more.",
      actions: [
        { label: 'Retry',   primary: true, onClick: () => goto('home') },
        { label: 'Discard', onClick: () => goto('home') },
      ],
    },
  };
  const p = presets[kind] || presets.generic;
  const [kindSel, setKindSel] = React.useState(kind);
  const sel = presets[kindSel] || presets.generic;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar left={<IconBtn icon="x" onClick={() => goto('home')} />} title="Something went wrong" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{
          width: 68, height: 68, borderRadius: 18,
          background: '#FEF3C7', color: '#B45309',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div className="mono" style={{ fontSize: 11, letterSpacing: 2, color: 'var(--ink-3)', fontWeight: 600 }}>{sel.code}</div>
        <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6, letterSpacing: '-0.02em', textWrap: 'balance' }}>{sel.title}</div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 10, lineHeight: 1.5, textWrap: 'pretty' }}>{sel.message}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          {sel.actions.map((a, i) => (
            <button key={i} onClick={a.onClick} style={{
              padding: '14px', borderRadius: 12, border: 'none',
              background: a.primary ? 'var(--ink)' : 'var(--surface)',
              color: a.primary ? 'var(--bg)' : 'var(--ink)',
              borderColor: a.primary ? 'var(--ink)' : 'var(--line)',
              borderStyle: 'solid', borderWidth: 1,
              fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{a.label}</button>
          ))}
        </div>

        {/* Demo switcher — useful in the prototype */}
        <div style={{ marginTop: 30, padding: 12, borderRadius: 10, background: 'var(--chip)', border: '1px dashed var(--line)' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--ink-3)', fontWeight: 600 }}>PROTOTYPE · SIMULATE</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {Object.keys(presets).map(k => (
              <button key={k} onClick={() => setKindSel(k)} style={{
                padding: '5px 10px', borderRadius: 999, fontSize: 11.5,
                border: '1px solid ' + (kindSel === k ? 'var(--ink)' : 'var(--line)'),
                background: kindSel === k ? 'var(--ink)' : 'var(--surface)',
                color: kindSel === k ? 'var(--bg)' : 'var(--ink-2)',
                fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
              }}>{k}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenEditExpense, ScreenDeleteExpense, ScreenError });
