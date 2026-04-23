// Group overview + expense list
function ScreenGroup({ groupId, goto }) {
  const g = GROUPS.find(x => x.id === groupId) || GROUPS[0];
  const groupExpenses = EXPENSES.filter(e => e.group === g.id);
  const [tab, setTab] = React.useState('expenses');
  const [scrolled, setScrolled] = React.useState(false);

  // Compute per-member share from expenses (rough)
  const members = g.members.map(m => {
    const person = PERSON(m);
    const paid = groupExpenses.filter(e => e.payer === m).reduce((s, e) => s + e.amount, 0);
    const owed = groupExpenses.reduce((s, e) => e.participants.includes(m) ? s + e.amount / e.participants.length : s, 0);
    return { person, paid, net: paid - owed };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon="back" onClick={() => goto('home')} />}
        title={g.name}
        subtitle={g.sub}
        right={<IconBtn icon="more" />}
        scrolled={scrolled}
      />
      <div className="screen-scroll" onScroll={e => setScrolled(e.target.scrollTop > 2)} style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>

        {/* Balance header */}
        <div style={{ padding: '12px 20px 8px' }}>
          <div style={{
            padding: 18, borderRadius: 16,
            background: g.net >= 0 ? 'var(--pos-soft)' : 'var(--warn-soft)',
            border: `1px solid ${g.net >= 0 ? '#A7F3D0' : '#FECACA'}`,
          }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, color: g.net >= 0 ? '#047857' : '#991B1B' }}>
              {g.net >= 0 ? 'YOU ARE OWED' : 'YOU OWE'}
            </div>
            <div className="mono" style={{ fontSize: 36, fontWeight: 600, marginTop: 6, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
              {g.net >= 0 ? '+' : '−'}{{USD:'$',EUR:'€'}[g.base]}{Math.abs(g.net).toFixed(2)}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <Btn size="sm" variant="primary" onClick={() => goto('simplify', { groupId: g.id })}>Settle up</Btn>
              <Btn size="sm" variant="ghost" onClick={() => goto('add', { groupId: g.id })} icon={<Icon name="plus" size={14}/>}>Add expense</Btn>
            </div>
          </div>
        </div>

        {/* Members strip */}
        <div style={{ padding: '4px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AvatarStack ids={g.members} size={28} />
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{g.members.length} members</div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '16px 20px 8px', display: 'flex', gap: 4, borderBottom: '1px solid var(--line-2)' }}>
          {['expenses', 'balances', 'settings'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 14px', background: 'none', border: 'none',
              borderBottom: `2px solid ${tab === t ? 'var(--ink)' : 'transparent'}`,
              color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              marginBottom: -1, textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>

        {tab === 'expenses' && (
          <div>
            <SectionLabel>April 2026</SectionLabel>
            <div style={{ padding: '0 20px' }}>
              <Card pad={0} style={{ overflow: 'hidden' }}>
                {groupExpenses.map((e, i) => (
                  <ExpenseRow key={e.id} e={e} divider={i < groupExpenses.length - 1} onClick={() => goto('expense', { expenseId: e.id })} />
                ))}
              </Card>
            </div>
          </div>
        )}

        {tab === 'balances' && (
          <div style={{ padding: '4px 20px' }}>
            <Card pad={0} style={{ overflow: 'hidden' }}>
              {members.map((m, i) => (
                <div key={m.person.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
                  borderBottom: i < members.length - 1 ? '1px solid var(--line-2)' : 'none',
                }}>
                  <Avatar person={m.person} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.person.name === 'You' ? 'You' : m.person.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>paid {{USD:'$',EUR:'€'}[g.base]}{m.paid.toFixed(2)}</div>
                  </div>
                  <Money value={m.net} currency={g.base} size={14} weight={600} colorize signed />
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === 'settings' && (
          <div style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SettingsRow label="Group name" value={g.name} />
            <SettingsRow label="Default currency" value={g.base} />
            <SettingsRow label="Simplify debts" value="On" tone="accent" />
            <SettingsRow label="Members" value={`${g.members.length} people`} chev />
            <div style={{ marginTop: 12 }}>
              <Btn variant="ghost" full>Leave group</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExpenseRow({ e, divider, onClick }) {
  const payer = PERSON(e.payer);
  const yourShare = e.amount / e.participants.length;
  const youAre = e.payer === 'me'
    ? { label: 'You get back', val: e.amount - yourShare }
    : { label: 'You owe', val: -yourShare };
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 14px',
      borderBottom: divider ? '1px solid var(--line-2)' : 'none', cursor: 'pointer',
    }}>
      <div className="mono" style={{
        width: 44, textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.5 }}>{e.date.split(' ')[0].toUpperCase()}</div>
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.1 }}>{e.date.split(' ')[1]}</div>
      </div>
      <div style={{ width: 1, height: 30, background: 'var(--line)' }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
          {payer.name === 'You' ? 'You' : payer.name.split(' ')[0]} paid <Money value={e.amount} currency={e.currency} size={11.5} mono weight={500} />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{youAre.label}</div>
        <Money value={youAre.val} currency={e.currency} size={13} weight={600} colorize signed />
      </div>
    </div>
  );
}

function SettingsRow({ label, value, tone, chev }) {
  return (
    <div style={{
      padding: '14px 16px', background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, marginTop: 3, fontWeight: 500, color: tone === 'accent' ? 'var(--accent)' : 'var(--ink)' }}>{value}</div>
      </div>
      {chev && <Icon name="arrow-right" size={16} stroke="var(--ink-3)"/>}
    </div>
  );
}

Object.assign(window, { ScreenGroup, ExpenseRow, SettingsRow });
