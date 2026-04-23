// Add-expense picker (choose individual friend or group) + standalone Invite screen
function ScreenAddPicker({ goto }) {
  const friends = [
    { p: PERSON('maya'),  net: 48.20  },
    { p: PERSON('diego'), net: -62.40 },
    { p: PERSON('priya'), net: 12.00  },
    { p: PERSON('sam'),   net: 0      },
    { p: PERSON('lex'),   net: -80.10 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar left={<IconBtn icon="close" onClick={() => goto('home')}/>} title="Add expense"/>
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.5 }}>
          Who is this expense with? Pick a friend for a 1:1 expense, or a group for multi-way splits.
        </div>

        <SectionLabel>With a friend</SectionLabel>
        <Card pad={0} style={{ overflow: 'hidden' }}>
          {friends.map((f, i) => (
            <button key={f.p.id} onClick={() => goto('add', { peerId: f.p.id })} style={{
              width: '100%', padding: '12px 14px', background: 'var(--surface)',
              border: 'none', borderBottom: i < friends.length - 1 ? '1px solid var(--line-2)' : 'none',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            }}>
              <Avatar person={f.p} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{f.p.name}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{f.p.email}</div>
              </div>
              {f.net === 0
                ? <Pill tone="neutral">Settled</Pill>
                : <Money value={f.net} size={13} weight={600} colorize signed/>}
              <Icon name="arrow-right" size={14} stroke="var(--ink-3)"/>
            </button>
          ))}
        </Card>

        <SectionLabel>In a group</SectionLabel>
        <Card pad={0} style={{ overflow: 'hidden' }}>
          {GROUPS.map((g, i) => (
            <button key={g.id} onClick={() => goto('add', { groupId: g.id })} style={{
              width: '100%', padding: '12px 14px', background: 'var(--surface)',
              border: 'none', borderBottom: i < GROUPS.length - 1 ? '1px solid var(--line-2)' : 'none',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div className="mono" style={{
                width: 36, height: 36, borderRadius: 10,
                background: g.net >= 0 ? 'var(--pos-soft)' : 'var(--warn-soft)',
                color: g.net >= 0 ? '#065F46' : '#991B1B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 12,
              }}>
                {g.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{g.sub}</div>
              </div>
              <Icon name="arrow-right" size={14} stroke="var(--ink-3)"/>
            </button>
          ))}
        </Card>

        <div style={{ marginTop: 14 }}>
          <button onClick={() => goto('invite')} style={{
            width: '100%', padding: 14, border: '1.5px dashed var(--line)',
            background: 'transparent', borderRadius: 12, cursor: 'pointer',
            fontFamily: 'inherit', color: 'var(--ink-2)', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="plus" size={14}/> Invite a new friend
          </button>
        </div>
      </div>
    </div>
  );
}

// Standalone Invite screen — accessible any time, not just onboarding
function ScreenInvite({ goto }) {
  const [invited, setInvited] = React.useState([]);
  const [tab, setTab] = React.useState('email');
  const [sent, setSent] = React.useState(false);

  if (sent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
        <TopBar left={<IconBtn icon="close" onClick={() => goto('home')}/>} title="Invite friends"/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px', justifyContent: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, background: 'var(--accent-soft)',
            color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Icon name="check" size={32} strokeWidth={2.2}/>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
            {invited.length} invite{invited.length === 1 ? '' : 's'} sent.
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 10, lineHeight: 1.5 }}>
            You can already add expenses with them — Settle will link everything up when they accept.
          </div>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {invited.slice(0, 4).map(e => (
              <div key={e} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{e[0].toUpperCase()}</div>
                <div className="mono" style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-2)' }}>{e}</div>
                <Pill tone="accent"><Icon name="check" size={10} strokeWidth={2.5}/> Sent</Pill>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
            <Btn variant="ghost" size="lg" full onClick={() => { setSent(false); setInvited([]); }}>Invite more</Btn>
            <Btn variant="primary" size="lg" full onClick={() => goto('friend', { friendId: 'new' })}>Add expense</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar left={<IconBtn icon="close" onClick={() => goto('home')}/>} title="Invite friends"/>
      <div style={{ padding: '4px 20px 0', display: 'flex', gap: 4, borderBottom: '1px solid var(--line-2)' }}>
        {[
          { id: 'email',    label: 'Email' },
          { id: 'contacts', label: 'Contacts' },
          { id: 'link',     label: 'Share link' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 12px', background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? 'var(--ink)' : 'transparent'}`,
            color: tab === t.id ? 'var(--ink)' : 'var(--ink-3)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {tab === 'email' && <InviteEmail invited={invited} setInvited={setInvited}/>}
        {tab === 'contacts' && <InviteContacts invited={invited} setInvited={setInvited}/>}
        {tab === 'link' && <InviteLink/>}
      </div>
      <div style={{ padding: '12px 20px 20px', background: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
        <Btn variant="primary" size="lg" full disabled={invited.length === 0 && tab !== 'link'} onClick={() => setSent(true)}>
          {invited.length > 0 ? `Send ${invited.length} invite${invited.length === 1 ? '' : 's'}` : 'Send invite'}
        </Btn>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenAddPicker, ScreenInvite });
