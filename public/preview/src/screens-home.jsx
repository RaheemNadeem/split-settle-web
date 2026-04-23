// Home dashboard + activity feed
function ScreenHome({ goto, welcomeBack }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [toast, setToast] = React.useState(welcomeBack || null);

  React.useEffect(() => {
    if (!welcomeBack) return;
    setToast(welcomeBack);
    const hide = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(hide);
  }, [welcomeBack]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', position: 'relative' }}>
      {toast && (
        <div style={{
          position: 'absolute', top: 10, left: 12, right: 12, zIndex: 30,
          padding: '10px 14px', borderRadius: 14,
          background: 'var(--ink)', color: 'var(--bg)',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 10px 28px rgba(11, 15, 20, 0.25)',
          animation: 'hwbToast 3.2s ease-in-out forwards',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#059669',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name="check" size={14} stroke="white" strokeWidth={2.5}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em' }}>Welcome back, Alex.</div>
            <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 1 }}>You're signed in.</div>
          </div>
          <button onClick={() => setToast(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--bg)', opacity: 0.6, padding: 4, display: 'flex',
          }}>
            <Icon name="close" size={14} stroke="var(--bg)" strokeWidth={2}/>
          </button>
          <style>{`
            @keyframes hwbToast {
              0%   { transform: translateY(-18px); opacity: 0; }
              8%   { transform: translateY(0);     opacity: 1; }
              85%  { transform: translateY(0);     opacity: 1; }
              100% { transform: translateY(-10px); opacity: 0; }
            }
          `}</style>
        </div>
      )}
      <TopBar
        title="Home"
        subtitle="Hi, Alex"
        left={<div style={{ width: 6 }}/>}
        right={<div style={{ display: 'flex', gap: 2 }}><IconBtn icon="search" /><IconBtn icon="bell" badge /></div>}
        scrolled={scrolled}
      />
      <div className="screen-scroll" onScroll={e => setScrolled(e.target.scrollTop > 2)} style={{ flex: 1, overflowY: 'auto', padding: '4px 0 24px' }}>

        {/* Hero balance — multi-currency, each treated as its own ledger */}
        <div style={{ padding: '12px 20px 8px' }}>
          <Card pad={20} style={{
            background: 'linear-gradient(180deg, var(--ink), #141A22)',
            color: 'var(--bg)', border: 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.7 }}>BALANCES</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: 1, opacity: 0.55 }}>{BALANCES_BY_CURRENCY.length} currencies</div>
            </div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>Each currency is tracked on its own — no conversions.</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 16, borderRadius: 12, overflow: 'hidden', background: '#202A38' }}>
              {BALANCES_BY_CURRENCY.map((b, i) => {
                const net = b.owedToYou - b.youOwe;
                const frac = (n) => (b.code === 'INR' || b.code === 'JPY') ? 0 : 2;
                return (
                  <div key={b.code} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', background: '#1A2230',
                  }}>
                    <div className="mono" style={{
                      width: 44, fontSize: 11, fontWeight: 600, letterSpacing: 1,
                      color: '#CBD2DC',
                    }}>{b.code}</div>
                    <div style={{ flex: 1, display: 'flex', gap: 10, fontSize: 11, opacity: 0.75 }}>
                      {b.owedToYou > 0 && (
                        <span>
                          <span style={{ color: '#6EE7B7' }}>+{b.symbol}{b.owedToYou.toFixed(frac())}</span>
                          <span style={{ opacity: 0.5, marginLeft: 4 }}>owed</span>
                        </span>
                      )}
                      {b.youOwe > 0 && (
                        <span>
                          <span style={{ color: '#FCA5A5' }}>−{b.symbol}{b.youOwe.toFixed(frac())}</span>
                          <span style={{ opacity: 0.5, marginLeft: 4 }}>owe</span>
                        </span>
                      )}
                    </div>
                    <div className="mono" style={{
                      fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em',
                      color: net >= 0 ? '#6EE7B7' : '#FCA5A5',
                    }}>
                      {net >= 0 ? '+' : '−'}{b.symbol}{Math.abs(net).toFixed(frac())}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '12px 20px 4px' }}>
          <QuickAction icon="plus" label="Add expense" onClick={() => goto('addPicker')} primary />
          <QuickAction icon="friends" label="Invite" onClick={() => goto('invite')} />
          <QuickAction icon="arrow-right" label="Settle" onClick={() => goto('simplify')} />
          <QuickAction icon="upload" label="Import" onClick={() => goto('import')} />
        </div>

        {/* Friends (1:1) — quick access */}
        <SectionLabel right={<span style={{ color: 'var(--ink-2)', cursor: 'pointer', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }} onClick={() => goto('friends')}>See all</span>}>Friends · 1:1</SectionLabel>
        <div style={{ padding: '0 20px', display: 'flex', gap: 10, overflowX: 'auto' }}>
          {['maya','diego','priya','sam','lex'].map(id => {
            const p = PERSON(id);
            const net = ({maya:48.20, diego:-62.40, priya:12.00, sam:0, lex:-80.10})[id];
            return (
              <button key={id} onClick={() => goto('friend', { friendId: id })} style={{
                flexShrink: 0, width: 96, padding: '12px 8px', borderRadius: 14,
                background: 'var(--surface)', border: '1px solid var(--line)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <Avatar person={p} size={36}/>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name.split(' ')[0]}</div>
                {net === 0
                  ? <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>settled</div>
                  : <Money value={net} size={11} weight={600} colorize signed/>}
              </button>
            );
          })}
          <button onClick={() => goto('invite')} style={{
            flexShrink: 0, width: 96, padding: '12px 8px', borderRadius: 14,
            background: 'transparent', border: '1.5px dashed var(--line)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink-2)',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={18}/>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Invite</div>
          </button>
        </div>

        {/* Groups */}
        <SectionLabel right={<span style={{ color: 'var(--ink-2)', cursor: 'pointer', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>See all</span>}>Your groups</SectionLabel>
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GROUPS.map(g => (
            <Card key={g.id} pad={14} onClick={() => goto('group', { groupId: g.id })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: g.net >= 0 ? 'var(--pos-soft)' : 'var(--warn-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: g.net >= 0 ? '#065F46' : '#991B1B',
                  fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
                }} className="mono">
                  {g.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{g.sub}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                    {g.net >= 0 ? 'Owed' : 'Owe'}
                  </div>
                  <Money value={g.net} currency={g.base} size={15} weight={600} colorize signed />
                </div>
              </div>
            </Card>
          ))}
          <button onClick={() => goto('newGroup')} style={{
            padding: '14px', borderRadius: 14, border: '1.5px dashed var(--line)',
            background: 'transparent', cursor: 'pointer', color: 'var(--ink-2)',
            fontSize: 14, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="plus" size={16}/> New group
          </button>
        </div>

        <SectionLabel right={<span style={{ color: 'var(--ink-2)', cursor: 'pointer', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }} onClick={() => goto('activity')}>View all</span>}>Recent activity</SectionLabel>
        <div style={{ padding: '0 20px' }}>
          <Card pad={0} style={{ overflow: 'hidden' }}>
            {ACTIVITY.slice(0, 3).map((a, i) => (
              <ActivityRow key={a.id} a={a} divider={i < 2} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick, primary }) {
  return (
    <button onClick={onClick} style={{
      padding: '14px 10px', borderRadius: 14,
      background: primary ? 'var(--ink)' : 'var(--surface)',
      color: primary ? 'var(--bg)' : 'var(--ink)',
      border: `1px solid ${primary ? 'var(--ink)' : 'var(--line)'}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      cursor: 'pointer', fontFamily: 'inherit',
    }}>
      <Icon name={icon} size={18} stroke="currentColor" strokeWidth={1.8} />
      <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
    </button>
  );
}

function ActivityRow({ a, divider }) {
  const who = PERSON(a.who);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
      borderBottom: divider ? '1px solid var(--line-2)' : 'none',
    }}>
      <Avatar person={who} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, lineHeight: 1.35 }}>
          <span style={{ fontWeight: 600 }}>{who.name === 'You' ? 'You' : who.name.split(' ')[0]}</span>
          <span style={{ color: 'var(--ink-2)' }}> {a.verb} </span>
          <span style={{ fontWeight: 500 }}>{a.what}</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2, display: 'flex', gap: 8 }}>
          <span>{a.ctx}</span><span>·</span><span>{a.ago}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Money value={a.you} size={13} weight={600} colorize signed />
      </div>
    </div>
  );
}

function ScreenActivity({ goto }) {
  const [scrolled, setScrolled] = React.useState(false);
  const grouped = [
    { label: 'Today', items: ACTIVITY.slice(0, 2) },
    { label: 'Yesterday', items: ACTIVITY.slice(2, 3) },
    { label: 'This week', items: ACTIVITY.slice(3) },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar title="Activity" right={<IconBtn icon="search" />} scrolled={scrolled} />
      <div className="screen-scroll" onScroll={e => setScrolled(e.target.scrollTop > 2)} style={{ flex: 1, overflowY: 'auto' }}>
        {grouped.map(g => (
          <div key={g.label}>
            <SectionLabel>{g.label}</SectionLabel>
            <div style={{ padding: '0 20px' }}>
              <Card pad={0} style={{ overflow: 'hidden' }}>
                {g.items.map((a, i) => <ActivityRow key={a.id} a={a} divider={i < g.items.length - 1} />)}
              </Card>
            </div>
          </div>
        ))}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

Object.assign(window, { ScreenHome, ScreenActivity, ActivityRow });
