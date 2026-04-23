// Add expense + expense detail + split selector
function ScreenAddExpense({ goto, ctx }) {
  const [amount, setAmount] = React.useState('48.60');
  const [title, setTitle] = React.useState('Brunch at Pastelaria');
  const [payer, setPayer] = React.useState('me');
  const [splitOpen, setSplitOpen] = React.useState(false);
  const [split, setSplit] = React.useState('equal');
  const [participants, setParticipants] = React.useState(['me','maya','diego','priya']);
  const [currency, setCurrency] = React.useState('EUR');
  const [cat, setCat] = React.useState('Food');

  const share = (parseFloat(amount) || 0) / participants.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon="close" onClick={() => goto('home')} />}
        title="New expense"
        right={<Btn size="sm" variant="primary" onClick={() => goto('expense', { expenseId: 'e6' })}>Save</Btn>}
      />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 16px' }}>

        {/* Amount hero */}
        <div style={{
          padding: '24px 0 20px', textAlign: 'center',
          borderBottom: '1px solid var(--line-2)', marginBottom: 16,
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
            <select value={currency} onChange={e => setCurrency(e.target.value)} style={{
              border: 'none', background: 'transparent', fontSize: 28, fontWeight: 500,
              color: 'var(--ink-3)', cursor: 'pointer', outline: 'none',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {['USD','EUR','GBP','JPY'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="mono"
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                fontSize: 64, fontWeight: 600, letterSpacing: '-0.03em',
                width: 200, textAlign: 'left', color: 'var(--ink)',
              }}
            />
          </div>
          <div style={{ marginTop: 4, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Pill tone="neutral">Lisbon trip</Pill>
            <Pill tone="neutral">{cat}</Pill>
          </div>
        </div>

        <Field label="Description">
          <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle}/>
        </Field>

        <Field label="Paid by">
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {['me','maya','diego','priya'].map(id => {
              const p = PERSON(id);
              const on = payer === id;
              return (
                <button key={id} onClick={() => setPayer(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px 6px 6px', borderRadius: 100,
                  border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                  background: on ? 'var(--ink)' : 'var(--surface)',
                  color: on ? 'var(--bg)' : 'var(--ink)',
                  cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
                }}>
                  <Avatar person={p} size={24} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name === 'You' ? 'You' : p.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Split">
          <button onClick={() => setSplitOpen(true)} style={{
            ...inputStyle, cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name={{equal:'equals',exact:'exact',percent:'percent',shares:'shares'}[split]} size={16} stroke="var(--ink-2)" />
              <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{split} · {participants.length} people</span>
            </span>
            <Icon name="arrow-down" size={16} stroke="var(--ink-3)"/>
          </button>
          <div style={{ marginTop: 10, padding: '12px 14px', borderRadius: 10, background: 'var(--chip)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-2)', letterSpacing: 0.5 }}>EACH PAYS</div>
            <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>€{share.toFixed(2)}</div>
          </div>
        </Field>

        <Field label="Category">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Food','Transit','Lodging','Groceries','Drinks','Other'].map(c => {
              const on = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '8px 12px', borderRadius: 100,
                  border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                  background: on ? 'var(--ink)' : 'var(--surface)',
                  color: on ? 'var(--bg)' : 'var(--ink-2)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                }}>{c}</button>
              );
            })}
          </div>
        </Field>

        <Field label="When">
          <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-2)' }}>
            <Icon name="calendar" size={16} stroke="var(--ink-3)" />
            <span>Today · Apr 17, 2026</span>
          </div>
        </Field>

        <button style={{
          padding: '14px', border: '1.5px dashed var(--line)', background: 'transparent',
          borderRadius: 12, width: '100%', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: 'var(--ink-2)', fontSize: 13, fontWeight: 500,
        }}>
          <Icon name="plus" size={14}/> Add receipt
        </button>
      </div>

      {splitOpen && <SplitSheet split={split} setSplit={setSplit} amount={parseFloat(amount) || 0} participants={participants} setParticipants={setParticipants} onClose={() => setSplitOpen(false)} />}
    </div>
  );
}

function SplitSheet({ split, setSplit, amount, participants, setParticipants, onClose }) {
  const [local, setLocal] = React.useState(split);
  const [exact, setExact] = React.useState({ me: 12.15, maya: 12.15, diego: 12.15, priya: 12.15 });
  const [percents, setPercents] = React.useState({ me: 25, maya: 25, diego: 25, priya: 25 });
  const [shares, setShares] = React.useState({ me: 1, maya: 1, diego: 2, priya: 1 });

  const methods = [
    { id: 'equal',   label: 'Equal',       desc: 'Split evenly',               icon: 'equals' },
    { id: 'exact',   label: 'Exact amounts', desc: 'Type specific amounts',     icon: 'exact' },
    { id: 'percent', label: 'Percentages', desc: 'By % of total',              icon: 'percent' },
    { id: 'shares',  label: 'Shares',      desc: 'Proportional (e.g. 2:1:1)',  icon: 'shares' },
  ];

  const renderDetail = () => {
    if (local === 'equal') {
      return participants.map(id => {
        const p = PERSON(id);
        return (
          <div key={id} style={rowStyle}>
            <Avatar person={p} size={30}/>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{p.name === 'You' ? 'You' : p.name}</div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>€{(amount / participants.length).toFixed(2)}</div>
          </div>
        );
      });
    }
    if (local === 'exact') {
      const sum = Object.values(exact).reduce((a,b) => a + b, 0);
      return (
        <>
          {participants.map(id => {
            const p = PERSON(id);
            return (
              <div key={id} style={rowStyle}>
                <Avatar person={p} size={30}/>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{p.name === 'You' ? 'You' : p.name}</div>
                <input
                  type="number"
                  className="mono"
                  value={exact[id]}
                  onChange={e => setExact({...exact, [id]: parseFloat(e.target.value) || 0})}
                  style={{ width: 84, padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 8, textAlign: 'right', fontSize: 14, fontWeight: 600 }}
                />
              </div>
            );
          })}
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '12px 4px',
            fontSize: 13, color: Math.abs(sum - amount) < 0.01 ? 'var(--pos)' : 'var(--warn)',
          }}>
            <span>Sum · €{sum.toFixed(2)}</span>
            <span>€{(amount - sum).toFixed(2)} {Math.abs(sum - amount) < 0.01 ? '✓' : 'left'}</span>
          </div>
        </>
      );
    }
    if (local === 'percent') {
      const sum = Object.values(percents).reduce((a,b) => a + b, 0);
      return (
        <>
          {participants.map(id => {
            const p = PERSON(id);
            return (
              <div key={id} style={rowStyle}>
                <Avatar person={p} size={30}/>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{p.name === 'You' ? 'You' : p.name}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginRight: 8 }}>
                  €{(amount * percents[id] / 100).toFixed(2)}
                </div>
                <input
                  type="number"
                  className="mono"
                  value={percents[id]}
                  onChange={e => setPercents({...percents, [id]: parseFloat(e.target.value) || 0})}
                  style={{ width: 64, padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 8, textAlign: 'right', fontSize: 14, fontWeight: 600 }}
                />
                <span className="mono" style={{ fontSize: 13, color: 'var(--ink-2)' }}>%</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 4px', fontSize: 13, color: sum === 100 ? 'var(--pos)' : 'var(--warn)' }}>
            <span>Total</span><span>{sum}% {sum === 100 ? '✓' : ''}</span>
          </div>
        </>
      );
    }
    if (local === 'shares') {
      const sum = Object.values(shares).reduce((a,b) => a + b, 0);
      return participants.map(id => {
        const p = PERSON(id);
        const val = amount * shares[id] / sum;
        return (
          <div key={id} style={rowStyle}>
            <Avatar person={p} size={30}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name === 'You' ? 'You' : p.name}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>€{val.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => setShares({...shares, [id]: Math.max(0, shares[id] - 1)})} style={stepStyle}>−</button>
              <div className="mono" style={{ width: 28, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{shares[id]}</div>
              <button onClick={() => setShares({...shares, [id]: shares[id] + 1})} style={stepStyle}>+</button>
            </div>
          </div>
        );
      });
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(11, 15, 20, 0.4)',
      display: 'flex', alignItems: 'flex-end', zIndex: 10,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--bg)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '8px 0 20px', maxHeight: '88%', overflowY: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: 'var(--line)', borderRadius: 2, margin: '8px auto 16px' }}/>
        <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Split method</div>
          <IconBtn icon="close" onClick={onClose} />
        </div>

        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {methods.map(m => {
            const on = local === m.id;
            return (
              <button key={m.id} onClick={() => setLocal(m.id)} style={{
                padding: '14px 14px', borderRadius: 14, textAlign: 'left',
                border: `1.5px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                background: on ? 'var(--ink)' : 'var(--surface)',
                color: on ? 'var(--bg)' : 'var(--ink)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <Icon name={m.icon} size={18} stroke="currentColor" strokeWidth={1.8}/>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 10 }}>{m.label}</div>
                <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 2 }}>{m.desc}</div>
              </button>
            );
          })}
        </div>

        <SectionLabel>{local === 'equal' ? 'Each person pays' : 'Allocate'}</SectionLabel>
        <div style={{ padding: '0 20px' }}>
          <Card pad={4} style={{ overflow: 'hidden' }}>
            <div style={{ padding: 8 }}>{renderDetail()}</div>
          </Card>
        </div>

        <div style={{ padding: '16px 20px 0' }}>
          <Btn variant="primary" size="lg" full onClick={() => { setSplit(local); onClose(); }}>Apply</Btn>
        </div>
      </div>
    </div>
  );
}

const rowStyle = { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px' };
const stepStyle = { width: 28, height: 28, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' };

function ScreenExpense({ expenseId, goto }) {
  const e = EXPENSES.find(x => x.id === expenseId) || EXPENSES[0];
  const payer = PERSON(e.payer);
  const share = e.amount / e.participants.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon="back" onClick={() => goto('group', { groupId: e.group })} />}
        title="Expense"
        right={<IconBtn icon="more" />}
      />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 16px' }}>
        <div style={{ padding: '20px 0 8px' }}>
          <Pill tone="neutral">{e.cat}</Pill>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 10, letterSpacing: '-0.02em' }}>{e.title}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em' }}>
              €{e.amount.toFixed(2)}
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{e.currency}</span>
          </div>
        </div>

        <div style={{ padding: '12px 14px', background: 'var(--chip)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px' }}>
          <Avatar person={payer} size={36} />
          <div style={{ flex: 1, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{payer.name === 'You' ? 'You' : payer.name.split(' ')[0]}</span>
            <span style={{ color: 'var(--ink-2)' }}> paid on {e.date}, 2026</span>
          </div>
        </div>

        <SectionLabel right={<span className="mono" style={{ textTransform: 'capitalize', color: 'var(--ink-2)' }}>{e.split}</span>}>Split between {e.participants.length}</SectionLabel>
        <Card pad={0} style={{ overflow: 'hidden' }}>
          {e.participants.map((id, i) => {
            const p = PERSON(id);
            const you = id === 'me';
            return (
              <div key={id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderBottom: i < e.participants.length - 1 ? '1px solid var(--line-2)' : 'none',
                background: you ? 'var(--chip)' : 'transparent',
              }}>
                <Avatar person={p} size={32}/>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
                  {p.name === 'You' ? 'You' : p.name}
                  {id === e.payer && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--ink-3)' }}>paid</span>}
                </div>
                <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>€{share.toFixed(2)}</div>
              </div>
            );
          })}
        </Card>

        {e.note && (
          <div style={{ marginTop: 16, padding: 14, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface)' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Note</div>
            <div style={{ fontSize: 14, marginTop: 4, color: 'var(--ink-2)' }}>{e.note}</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Btn variant="ghost" full onClick={() => goto('editExpense', { expenseId: e.id })} icon={<Icon name="edit" size={14}/>}>Edit</Btn>
          <Btn variant="ghost" full onClick={() => goto('deleteExpense', { expenseId: e.id })} icon={<Icon name="trash" size={14}/>}>Delete</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenAddExpense, ScreenExpense, SplitSheet });
