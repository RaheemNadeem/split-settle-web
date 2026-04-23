// Friends list
function ScreenFriends({ goto }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const friends = [
    { p: PERSON('maya'),  last: 'Lisbon trip' },
    { p: PERSON('diego'), last: 'Lisbon trip' },
    { p: PERSON('priya'), last: 'Supper club' },
    { p: PERSON('sam'),   last: 'All settled' },
    { p: PERSON('lex'),   last: 'Apt 4B' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        title="Friends"
        right={
          <div style={{ display: 'flex', gap: 2 }}>
            <IconBtn icon="search" />
            <IconBtn icon="plus" onClick={() => goto('invite')} />
          </div>
        }
        scrolled={scrolled}
      />
      <div className="screen-scroll" onScroll={e => setScrolled(e.target.scrollTop > 2)} style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '8px 20px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Pill tone="ink">All · {friends.length}</Pill>
            <Pill>Pending · 2</Pill>
          </div>
          <Card pad={0} style={{ overflow: 'hidden' }}>
            {friends.map((f, i) => {
              const bals = FRIEND_BALANCES[f.p.id] || [];
              return (
                <div key={f.p.id} onClick={() => goto('friend', { friendId: f.p.id })} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px',
                  borderBottom: i < friends.length - 1 ? '1px solid var(--line-2)' : 'none',
                  cursor: 'pointer',
                }}>
                  <Avatar person={f.p} size={38}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{f.p.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{f.last}</div>
                    </div>
                    {bals.length === 0 ? (
                      <div style={{ marginTop: 6 }}><Pill tone="neutral">All settled</Pill></div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
                        {bals.map(b => (
                          <div key={b.code} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="mono" style={{
                              fontSize: 10, fontWeight: 600, letterSpacing: 0.6,
                              color: 'var(--ink-3)', width: 30,
                            }}>{b.code}</span>
                            <span style={{
                              fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase',
                              letterSpacing: 0.5, fontWeight: 500, flex: 1,
                            }}>{b.net > 0 ? 'owes you' : 'you owe'}</span>
                            <span className="mono" style={{
                              fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
                              color: b.net > 0 ? '#047857' : '#B91C1C',
                            }}>
                              {b.symbol}{Math.abs(b.net).toFixed(b.code === 'INR' || b.code === 'JPY' ? 0 : 2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>

          <SectionLabel>Pending invites</SectionLabel>
          <Card pad={0} style={{ overflow: 'hidden' }}>
            {[
              { email: 'kai.tanaka@zoho.jp', ago: 'sent 2d ago' },
              { email: 'brett@pm.me',        ago: 'sent 5d ago' },
            ].map((inv, i) => (
              <div key={inv.email} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
                borderBottom: i < 1 ? '1px solid var(--line-2)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1.5px dashed var(--line)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)',
                }}>
                  <Icon name="bell" size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.email}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{inv.ago}</div>
                </div>
                <Btn variant="ghost" size="sm">Remind</Btn>
              </div>
            ))}
          </Card>
        </div>
      </div>
      {inviteOpen && <InviteSheet onClose={() => setInviteOpen(false)} />}
    </div>
  );
}

function InviteSheet({ onClose }) {
  const [email, setEmail] = React.useState('');
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(11, 15, 20, 0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 10 }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--bg)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '8px 0 20px',
      }}>
        <div style={{ width: 40, height: 4, background: 'var(--line)', borderRadius: 2, margin: '8px auto 16px' }}/>
        <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Invite by email</div>
          <IconBtn icon="close" onClick={onClose} />
        </div>
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.5 }}>
            They'll get a link to join. You can still add them to groups and expenses before they accept — it'll map to their account once they sign in.
          </div>
          <Field label="Email address">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="friend@example.com" style={inputStyle} autoFocus/>
          </Field>
          <Btn variant="primary" size="lg" full>Send invite</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenFriends, InviteSheet });
