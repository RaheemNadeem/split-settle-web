// New-user onboarding: welcome → invite friends (hero) → empty state → 1:1 thread
function ScreenOnboard({ step, setStep, onDone, invited, setInvited }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {step === 0 && <OnboardWelcome onNext={() => setStep(1)} />}
      {step === 1 && <OnboardInvite invited={invited} setInvited={setInvited} onNext={() => setStep(2)} onSkip={() => setStep(2)} />}
      {step === 2 && <OnboardReady invited={invited} onDone={onDone} />}
    </div>
  );
}

function OnboardWelcome({ onNext }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '44px 28px 20px' }}>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 2 }}>SETTLE / NEW</div>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 600,
          }}>AR</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Signed in as</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Alex Rivera</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>alex.rivera@gmail.com</div>
          </div>
        </div>
        <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05, textWrap: 'balance' }}>
          Welcome, Alex.
        </div>
        <div style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 14, lineHeight: 1.5, maxWidth: 320 }}>
          Settle works best with people you share money with. Let's bring in a friend or two — you can always add more later.
        </div>
      </div>
      <div style={{ paddingTop: 24 }}>
        <Btn variant="primary" size="lg" full onClick={onNext} icon={<Icon name="arrow-right" size={16} stroke="var(--bg)" strokeWidth={2}/>}>
          Invite your first friend
        </Btn>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button onClick={onNext} style={{
            background: 'none', border: 'none', color: 'var(--ink-3)', fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit', padding: 8,
          }}>I'll do it later</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Invite screen — the hero moment.
// Tabs: Email · Contacts · Link
// ─────────────────────────────────────────────────────────────
function OnboardInvite({ invited, setInvited, onNext, onSkip }) {
  const [tab, setTab] = React.useState('email');

  return (
    <>
      <TopBar
        title="Invite friends"
        subtitle="Bring one or two to get started"
        left={<div style={{ width: 8 }}/>}
      />

      {/* Tabs */}
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
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {tab === 'email' && <InviteEmail invited={invited} setInvited={setInvited}/>}
        {tab === 'contacts' && <InviteContacts invited={invited} setInvited={setInvited}/>}
        {tab === 'link' && <InviteLink/>}
      </div>

      {/* Sticky invited summary + CTA */}
      <div style={{
        padding: '12px 20px 20px', background: 'var(--bg)',
        borderTop: '1px solid var(--line)',
      }}>
        {invited.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <AvatarStack ids={invited.slice(0, 4).map(() => 'me')} size={24}/>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{invited.length}</span> invited · {invited.slice(0, 2).join(', ')}{invited.length > 2 ? ` +${invited.length - 2}` : ''}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="lg" onClick={onSkip}>Skip</Btn>
          <Btn variant="primary" size="lg" full onClick={onNext} disabled={invited.length === 0 && tab !== 'link'}>
            {invited.length > 0 ? `Continue with ${invited.length}` : 'Continue'}
          </Btn>
        </div>
      </div>
    </>
  );
}

function InviteEmail({ invited, setInvited }) {
  const [val, setVal] = React.useState('');
  const [error, setError] = React.useState('');
  const add = () => {
    const v = val.trim().toLowerCase();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setError('Not a valid email'); return; }
    if (invited.includes(v)) { setError('Already added'); return; }
    setInvited([...invited, v]);
    setVal(''); setError('');
  };
  const suggestions = ['maya@okafor.co', 'diego@martin.app', 'priya@ravin.com', 'sam@chen.dev'];

  return (
    <div>
      <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.5 }}>
        Type an email and hit enter. They'll get a link to join — no app install needed to accept.
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6,
        padding: 10, border: `1px solid ${error ? 'var(--warn)' : 'var(--line)'}`,
        borderRadius: 12, background: 'var(--surface)',
      }}>
        {invited.map(e => (
          <span key={e} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 4px 6px 10px', background: 'var(--chip)',
            borderRadius: 100, fontSize: 12.5, fontWeight: 500,
          }}>
            <span className="mono" style={{ fontSize: 11 }}>{e}</span>
            <button onClick={() => setInvited(invited.filter(x => x !== e))} style={{
              width: 18, height: 18, borderRadius: '50%', border: 'none',
              background: 'var(--ink-3)', color: 'var(--bg)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="close" size={10} stroke="var(--bg)" strokeWidth={2.5}/>
            </button>
          </span>
        ))}
        <input
          value={val}
          onChange={e => { setVal(e.target.value); setError(''); }}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder={invited.length ? 'Add another…' : 'friend@example.com'}
          style={{
            flex: 1, minWidth: 140, border: 'none', outline: 'none',
            background: 'transparent', fontSize: 14, padding: '6px 4px',
          }}
        />
      </div>
      {error && <div style={{ color: 'var(--warn)', fontSize: 12, marginTop: 6 }}>{error}</div>}

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>From your Gmail</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {suggestions.map(s => {
            const on = invited.includes(s);
            return (
              <button key={s} onClick={() => on ? setInvited(invited.filter(x => x !== s)) : setInvited([...invited, s])} style={{
                padding: '10px 12px', border: 'none', background: 'transparent',
                borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
                }}>{s[0].toUpperCase()}</div>
                <div className="mono" style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-2)' }}>{s}</div>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `1.5px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                  background: on ? 'var(--ink)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {on && <Icon name="check" size={12} stroke="var(--bg)" strokeWidth={2.8}/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InviteContacts({ invited, setInvited }) {
  const contacts = [
    { name: 'Maya Okafor',    email: 'maya@okafor.co',   initials: 'MO', color: 'oklch(0.62 0.14 340)' },
    { name: 'Diego Martín',   email: 'diego@martin.app', initials: 'DM', color: 'oklch(0.62 0.14 45)' },
    { name: 'Priya Ravindran', email: 'priya@ravin.com', initials: 'PR', color: 'oklch(0.62 0.14 200)' },
    { name: 'Sam Chen',       email: 'sam@chen.dev',     initials: 'SC', color: 'oklch(0.62 0.14 110)' },
    { name: 'Kai Tanaka',     email: 'kai.t@zoho.jp',    initials: 'KT', color: 'oklch(0.62 0.14 30)' },
    { name: 'Brett Lim',      email: 'brett@pm.me',      initials: 'BL', color: 'oklch(0.62 0.14 270)' },
  ];
  const [q, setQ] = React.useState('');
  const shown = contacts.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}>
          <Icon name="search" size={16}/>
        </div>
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search contacts"
          style={{ ...inputStyle, paddingLeft: 40 }}
        />
      </div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 1, marginBottom: 6, padding: '0 6px' }}>
        FROM GOOGLE CONTACTS · {contacts.length}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {shown.map(c => {
          const on = invited.includes(c.email);
          return (
            <button key={c.email} onClick={() => on ? setInvited(invited.filter(x => x !== c.email)) : setInvited([...invited, c.email])} style={{
              padding: '10px 8px', border: 'none', background: 'transparent',
              borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: c.color,
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600,
              }}>{c.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{c.email}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                border: `1.5px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                background: on ? 'var(--ink)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && <Icon name="check" size={12} stroke="var(--bg)" strokeWidth={2.8}/>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InviteLink() {
  const [copied, setCopied] = React.useState(false);
  const link = 'settle.app/join/alexrivera-4f82';
  return (
    <div>
      <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.5 }}>
        Share a personal invite link over any messenger. Whoever opens it gets paired with you automatically.
      </div>
      <div style={{
        padding: 16, border: '1.5px dashed var(--line)', borderRadius: 14,
        background: 'var(--surface)',
      }}>
        <div className="mono" style={{ fontSize: 13, wordBreak: 'break-all', color: 'var(--ink)' }}>{link}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          <Btn variant="primary" size="sm" full onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            {copied ? 'Copied ✓' : 'Copy link'}
          </Btn>
          <Btn variant="ghost" size="sm" full>Share…</Btn>
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {['Messages','WhatsApp','Signal','Mail'].map(app => (
          <div key={app} style={{
            padding: '14px 0', background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 12, textAlign: 'center', fontSize: 11, fontWeight: 500, color: 'var(--ink-2)',
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--chip)', margin: '0 auto 6px' }}/>
            {app}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// "You're set" empty-state landing
// ─────────────────────────────────────────────────────────────
function OnboardReady({ invited, onDone }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 20px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'var(--pos-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--pos)', marginBottom: 20,
        }}>
          <Icon name="check" size={36} strokeWidth={2.2}/>
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {invited.length > 0 ? `${invited.length} invite${invited.length === 1 ? '' : 's'} sent.` : "You're set."}
        </div>
        <div style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 12, lineHeight: 1.5 }}>
          {invited.length > 0
            ? "They can open any expense you add right away — they don't need to accept first."
            : "You can add friends any time from the Friends tab."}
        </div>

        {invited.length > 0 && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {invited.slice(0, 3).map(e => (
              <div key={e} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--ink-2)' }}>{e[0].toUpperCase()}</div>
                <div className="mono" style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-2)' }}>{e}</div>
                <Pill tone="accent"><Icon name="check" size={10} strokeWidth={2.5}/> Sent</Pill>
              </div>
            ))}
            {invited.length > 3 && <div style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>+ {invited.length - 3} more</div>}
          </div>
        )}
      </div>
      <div>
        <Btn variant="primary" size="lg" full onClick={onDone}>
          {invited.length > 0 ? 'Add your first expense' : 'Go to Home'}
        </Btn>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenOnboard });
