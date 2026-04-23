// Post-onboarding routing screens: pick who to add with, and a standalone Invite screen.

function ScreenAddPicker({ goto }) {
  const [q, setQ] = React.useState('');
  const groups = [
    { id: 'g-lisbon',  name: 'Lisbon trip',     sub: '4 members',  base: 'EUR' },
    { id: 'g-apt4b',   name: 'Apt 4B',          sub: '3 members',  base: 'USD' },
    { id: 'g-supper',  name: 'Supper club',     sub: '5 members',  base: 'USD' },
  ];
  const friends = [
    { id: 'maya',  net:  48.20 },
    { id: 'diego', net: -62.40 },
    { id: 'priya', net:  12.00 },
    { id: 'sam',   net:   0    },
    { id: 'lex',   net: -80.10 },
  ];
  const ql = q.trim().toLowerCase();
  const fG = groups.filter(g => !ql || g.name.toLowerCase().includes(ql));
  const fF = friends.filter(f => !ql || PERSON(f.id).name.toLowerCase().includes(ql));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        title="Add expense"
        subtitle="Who's it with?"
        left={<IconBtn icon="x" onClick={() => goto('home')} />}
      />
      <div style={{ padding: '8px 20px 4px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
          background: 'var(--chip)', borderRadius: 12, border: '1px solid var(--line)',
        }}>
          <Icon name="search" size={16}/>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search a group or friend"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)',
            }}
          />
        </div>
      </div>
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 0 24px' }}>

        {/* Quick 1:1 with someone new */}
        <div style={{ padding: '12px 20px 0' }}>
          <button onClick={() => goto('invite')} style={{
            width: '100%', padding: '14px', borderRadius: 14,
            border: '1.5px dashed var(--line)', background: 'transparent',
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            fontFamily: 'inherit', textAlign: 'left',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={18}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Add someone new</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Invite by email, contacts, or link</div>
            </div>
            <Icon name="chevron-right" size={16}/>
          </button>
        </div>

        {fF.length > 0 && <>
          <SectionLabel>Friends</SectionLabel>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fF.map(f => {
              const p = PERSON(f.id);
              return (
                <Card key={f.id} pad={12} onClick={() => goto('add', { peerId: f.id })}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar person={p} size={38}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                        {f.net === 0 ? 'Settled' : f.net > 0 ? `Owes you $${f.net.toFixed(2)}` : `You owe $${Math.abs(f.net).toFixed(2)}`}
                      </div>
                    </div>
                    <Icon name="chevron-right" size={16}/>
                  </div>
                </Card>
              );
            })}
          </div>
        </>}

        {fG.length > 0 && <>
          <SectionLabel>Groups</SectionLabel>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fG.map(g => (
              <Card key={g.id} pad={12} onClick={() => goto('add', { groupId: g.id })}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'var(--pos-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#065F46', fontWeight: 700, fontSize: 13,
                  }} className="mono">
                    {g.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{g.sub} · {g.base}</div>
                  </div>
                  <Icon name="chevron-right" size={16}/>
                </div>
              </Card>
            ))}
          </div>
        </>}

        {fG.length === 0 && fF.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
            No matches. Try inviting someone new.
          </div>
        )}
      </div>
    </div>
  );
}

// Standalone Invite screen — reuses the onboarding invite UX in a single-page form.
function ScreenInvite({ goto }) {
  const [tab, setTab] = React.useState('email'); // email | contacts | link
  const [emails, setEmails] = React.useState([]);
  const [draft, setDraft] = React.useState('');
  const [selected, setSelected] = React.useState({});
  const [copied, setCopied] = React.useState(false);

  const contacts = [
    { id: 'c1', name: 'Maya Okafor',   email: 'maya@okafor.co' },
    { id: 'c2', name: 'Diego Martín',  email: 'diego@martin.app' },
    { id: 'c3', name: 'Priya Shah',    email: 'priya.shah@gmail.com' },
    { id: 'c4', name: 'Sam Rivera',    email: 'sam.rivera@gmail.com' },
    { id: 'c5', name: 'Lex Tanaka',    email: 'lex@tanakastudio.com' },
    { id: 'c6', name: 'Rory Bell',     email: 'rory.b@hey.com' },
  ];

  const addEmail = () => {
    const v = draft.trim().toLowerCase();
    if (!v || !/^\S+@\S+\.\S+$/.test(v) || emails.includes(v)) return;
    setEmails([...emails, v]);
    setDraft('');
  };
  const selectedCount = emails.length + Object.values(selected).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        title="Invite friends"
        subtitle="They'll be able to split with you right away"
        left={<IconBtn icon="x" onClick={() => goto('home')} />}
      />
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 20px 4px' }}>
        {[
          { id: 'email',    label: 'Email' },
          { id: 'contacts', label: 'Contacts' },
          { id: 'link',     label: 'Share link' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer',
            background: tab === t.id ? 'var(--ink)' : 'var(--chip)',
            color: tab === t.id ? 'var(--bg)' : 'var(--ink-2)',
            border: '1px solid ' + (tab === t.id ? 'var(--ink)' : 'var(--line)'),
          }}>{t.label}</button>
        ))}
      </div>

      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 24px' }}>

        {tab === 'email' && (
          <>
            <Card pad={14}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {emails.map(e => (
                  <span key={e} style={{
                    padding: '5px 8px 5px 10px', borderRadius: 999, fontSize: 12,
                    background: 'var(--pos-soft)', color: '#065F46',
                    display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500,
                  }}>
                    {e}
                    <span onClick={() => setEmails(emails.filter(x => x !== e))} style={{ cursor: 'pointer', opacity: 0.6 }}>×</span>
                  </span>
                ))}
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ',' || e.key === ' ') { e.preventDefault(); addEmail(); } }}
                  onBlur={addEmail}
                  placeholder={emails.length ? 'Add another…' : 'friend@email.com'}
                  style={{
                    flex: 1, minWidth: 140, border: 'none', outline: 'none',
                    background: 'transparent', fontFamily: 'inherit', fontSize: 14,
                    padding: '4px 0', color: 'var(--ink)',
                  }}
                />
              </div>
            </Card>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>Tip: Enter or comma to add. We'll send a one-click sign-up link.</div>
          </>
        )}

        {tab === 'contacts' && (
          <Card pad={0} style={{ overflow: 'hidden' }}>
            {contacts.map((c, i) => (
              <label key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderBottom: i < contacts.length - 1 ? '1px solid var(--line-2)' : 'none',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={!!selected[c.id]}
                  onChange={e => setSelected({ ...selected, [c.id]: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#2563EB' }}
                />
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', background: 'var(--chip)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
                }}>{c.name.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.email}</div>
                </div>
              </label>
            ))}
          </Card>
        )}

        {tab === 'link' && (
          <>
            <Card pad={16} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 10 }}>Your personal invite link</div>
              <div className="mono" style={{
                padding: '12px 14px', borderRadius: 10, background: 'var(--chip)',
                fontSize: 13, color: 'var(--ink)', letterSpacing: '-0.01em',
                wordBreak: 'break-all', border: '1px solid var(--line)',
              }}>splitly.app/alex-chen</div>
              <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }} style={{
                marginTop: 12, padding: '10px 18px', borderRadius: 999,
                background: copied ? 'var(--pos-soft)' : 'var(--ink)',
                color: copied ? '#065F46' : 'var(--bg)',
                border: 'none', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
                cursor: 'pointer',
              }}>{copied ? '✓ Copied' : 'Copy link'}</button>
            </Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
              {['Messages','WhatsApp','More'].map(l => (
                <button key={l} style={{
                  padding: '12px 8px', borderRadius: 12, background: 'var(--surface)',
                  border: '1px solid var(--line)', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                  color: 'var(--ink-2)', cursor: 'pointer',
                }}>{l}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{
        padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0))',
        borderTop: '1px solid var(--line-2)', background: 'var(--surface)',
      }}>
        <button
          disabled={tab !== 'link' && selectedCount === 0}
          onClick={() => goto('home')}
          style={{
            width: '100%', padding: '14px', borderRadius: 14, border: 'none',
            background: (tab === 'link' || selectedCount > 0) ? 'var(--ink)' : 'var(--chip)',
            color: (tab === 'link' || selectedCount > 0) ? 'var(--bg)' : 'var(--ink-3)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 15,
            cursor: (tab === 'link' || selectedCount > 0) ? 'pointer' : 'not-allowed',
          }}>
          {tab === 'link'
            ? 'Done'
            : selectedCount > 0
              ? `Send ${selectedCount} invite${selectedCount === 1 ? '' : 's'}`
              : 'Pick someone to invite'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenAddPicker, ScreenInvite });
