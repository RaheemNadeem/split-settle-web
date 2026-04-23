// Simplify debts + record settlement
function ScreenSimplify({ groupId, goto }) {
  const g = GROUPS.find(x => x.id === groupId) || GROUPS[0];
  // Minimum-transaction graph (hand-crafted for demo clarity)
  const transactions = [
    { from: 'diego', to: 'me',    amount: 84.20, cur: 'EUR' },
    { from: 'maya',  to: 'priya', amount: 32.10, cur: 'EUR' },
    { from: 'diego', to: 'priya', amount: 12.40, cur: 'EUR' },
  ];
  const [sel, setSel] = React.useState(new Set(transactions.map((_, i) => i)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon="back" onClick={() => goto('group', { groupId: g.id })}/>}
        title="Simplify debts"
        subtitle={g.name}
      />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 16px' }}>
        <div style={{
          padding: 16, borderRadius: 14, background: 'var(--chip)',
          display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--ink)', color: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="shares" size={18} stroke="var(--bg)" />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>3 transactions instead of 6</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.45 }}>
              Settle everyone up with the fewest payments possible.
            </div>
          </div>
        </div>

        <SectionLabel>Suggested payments</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {transactions.map((t, i) => {
            const from = PERSON(t.from), to = PERSON(t.to);
            const on = sel.has(i);
            return (
              <Card key={i} pad={14} onClick={() => {
                const n = new Set(sel);
                on ? n.delete(i) : n.add(i);
                setSel(n);
              }} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                border: `1.5px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar person={from} size={34}/>
                  <div style={{ margin: '0 8px', color: 'var(--ink-3)' }}>
                    <Icon name="arrow-right" size={14} stroke="var(--ink-3)"/>
                  </div>
                  <Avatar person={to} size={34}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5 }}>
                    <span style={{ fontWeight: 600 }}>{from.name === 'You' ? 'You' : from.name.split(' ')[0]}</span>
                    <span style={{ color: 'var(--ink-3)' }}> pays </span>
                    <span style={{ fontWeight: 600 }}>{to.name === 'You' ? 'You' : to.name.split(' ')[0]}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>cash or manual</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Money value={t.amount} currency={t.cur} size={15} weight={600} />
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `1.5px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                  background: on ? 'var(--ink)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {on && <Icon name="check" size={14} stroke="var(--bg)" strokeWidth={2.5}/>}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '12px 20px 20px', background: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
        <Btn variant="primary" size="lg" full onClick={() => goto('record', { groupId: g.id })}>
          Record {sel.size} settlement{sel.size === 1 ? '' : 's'}
        </Btn>
      </div>
    </div>
  );
}

function ScreenRecord({ goto, groupId }) {
  const [method, setMethod] = React.useState('cash');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon="back" onClick={() => goto('simplify', { groupId })}/>}
        title="Record settlement"
      />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 16px' }}>
        <div style={{ padding: '24px 0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Avatar person={PERSON('diego')} size={56} />
          <div style={{ color: 'var(--ink-3)' }}>
            <Icon name="arrow-right" size={22} />
          </div>
          <Avatar person={ME} size={56} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>Diego pays you</div>
          <div className="mono" style={{ fontSize: 44, fontWeight: 600, marginTop: 4, letterSpacing: '-0.03em' }}>€84.20</div>
        </div>

        <Field label="Paid via">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { id: 'cash', label: 'Cash' },
              { id: 'bank', label: 'Bank' },
              { id: 'other', label: 'Other' },
            ].map(m => {
              const on = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  padding: '14px 0', borderRadius: 12,
                  border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                  background: on ? 'var(--ink)' : 'var(--surface)',
                  color: on ? 'var(--bg)' : 'var(--ink)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>{m.label}</button>
              );
            })}
          </div>
        </Field>
        <Field label="Date">
          <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-2)' }}>
            <Icon name="calendar" size={16} stroke="var(--ink-3)"/>
            <span>Today · Apr 17, 2026</span>
          </div>
        </Field>
        <Field label="Note (optional)">
          <input placeholder="e.g. Venmo reference #2348" style={inputStyle}/>
        </Field>
      </div>
      <div style={{ padding: '12px 20px 20px', background: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
        <Btn variant="accent" size="lg" full onClick={() => goto('group', { groupId })} icon={<Icon name="check" size={16} stroke="white" strokeWidth={2.2}/>}>
          Confirm settlement
        </Btn>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenSimplify, ScreenRecord });
