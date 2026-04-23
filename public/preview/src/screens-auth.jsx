// Auth screens: Sign in + Profile setup
function ScreenSignIn({ onDone, onSignUp, onForgot }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <div style={{ flex: 1, padding: '40px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 2 }}>SETTLE / 2026</div>
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.03em', textWrap: 'balance' }}>
            Shared expenses, <span style={{ color: 'var(--accent)' }}>settled cleanly.</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 8 }}>
          {[
            { k: 'Equal', v: '1/n' },
            { k: 'Exact',  v: '$$$' },
            { k: 'Shares', v: '2:1' },
          ].map(f => (
            <div key={f.k} style={{ padding: '10px 10px', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface)' }}>
              <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{f.v}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 3, letterSpacing: 0.3 }}>{f.k.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px 28px', background: 'var(--bg)' }}>
        <SignInForm onDone={onDone} onForgot={onForgot}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 14px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line-2)' }}/>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 1.5 }}>OR</div>
          <div style={{ flex: 1, height: 1, background: 'var(--line-2)' }}/>
        </div>
        <Btn variant="ghost" size="lg" full onClick={onDone} icon={<Icon name="google" size={18} />}>
          Continue with Google
        </Btn>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 16 }}>
          New to Settle?{' '}
          <button onClick={onSignUp} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', fontWeight: 600, padding: 0, fontSize: 13,
          }}>Create an account</button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', marginTop: 14, lineHeight: 1.5 }}>
          By continuing you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

function SignInForm({ onDone, onForgot }) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const canSubmit = /.+@.+\..+/.test(email) && pw.length > 0;
  return (
    <div>
      <input
        value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email" inputMode="email" autoComplete="email"
        style={{ ...inputStyle, marginBottom: 10 }}
      />
      <div style={{ position: 'relative' }}>
        <input
          value={pw} onChange={e => setPw(e.target.value)}
          placeholder="Password" type="password" autoComplete="current-password"
          style={{ ...inputStyle, paddingRight: 100 }}
        />
        <button onClick={onForgot} style={{
          position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '10px 12px', fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
          color: 'var(--accent)',
        }}>
          FORGOT?
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        <Btn variant="primary" size="lg" full disabled={!canSubmit} onClick={onDone}>
          Sign in
        </Btn>
      </div>
    </div>
  );
}

function ScreenProfile({ onDone }) {
  const [name, setName] = React.useState('Alex Rivera');
  const [currency, setCurrency] = React.useState('USD');
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const fileRef = React.useRef(null);

  const pickFile = () => { setMenuOpen(false); fileRef.current?.click(); };
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setAvatarUrl(r.result);
    r.readAsDataURL(f);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar title="Set up profile" subtitle="One last thing." />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 28px' }}>
          <div style={{ position: 'relative' }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onFile}
            />
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Change profile picture"
              style={{
                width: 96, height: 96, borderRadius: '50%',
                background: avatarUrl
                  ? `center/cover no-repeat url(${avatarUrl})`
                  : 'linear-gradient(135deg, #2563EB, #4F46E5)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 34, fontWeight: 600, border: 'none', cursor: 'pointer', padding: 0,
                overflow: 'hidden',
              }}
            >
              {!avatarUrl && 'AR'}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Change profile picture"
              style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid var(--bg)', cursor: 'pointer', padding: 0,
              }}
            >
              <Icon name="camera" size={14} stroke="var(--bg)" strokeWidth={2}/>
            </button>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              marginTop: 12, background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent)', fontWeight: 600, fontSize: 13,
            }}
          >
            {avatarUrl ? 'Change photo' : 'Add photo'}
          </button>
        </div>
        <Field label="Display name">
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Default currency" hint="Used when a group doesn't set its own.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['USD','EUR','GBP','JPY'].map(c => (
              <button key={c} onClick={() => setCurrency(c)} style={{
                padding: '12px 0', borderRadius: 12, border: `1px solid ${currency === c ? 'var(--ink)' : 'var(--line)'}`,
                background: currency === c ? 'var(--ink)' : 'var(--surface)',
                color: currency === c ? 'var(--bg)' : 'var(--ink)',
                fontWeight: 600, cursor: 'pointer', fontSize: 14,
              }}>{c}</button>
            ))}
          </div>
        </Field>
        <Field label="Email" hint="From Google · alex.rivera@gmail.com">
          <div style={{ ...inputStyle, color: 'var(--ink-3)', display: 'flex', alignItems: 'center' }}>alex.rivera@gmail.com</div>
        </Field>
      </div>
      <div style={{ padding: '12px 20px 20px', background: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
        <Btn variant="primary" size="lg" full onClick={onDone}>Finish setup</Btn>
      </div>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'absolute', inset: 0, background: 'rgba(11, 15, 20, 0.5)',
          display: 'flex', alignItems: 'flex-end', zIndex: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: 'var(--bg)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '10px 12px calc(18px + env(safe-area-inset-bottom, 0))',
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--line)', margin: '6px auto 14px' }}/>
            <SheetBtn icon="camera" label="Take photo" onClick={pickFile}/>
            <SheetBtn icon="image" label={avatarUrl ? 'Choose new photo' : 'Choose from library'} onClick={pickFile}/>
            {avatarUrl && (
              <SheetBtn icon="trash" label="Remove photo" tone="danger"
                        onClick={() => { setAvatarUrl(null); setMenuOpen(false); }}/>
            )}
            <button onClick={() => setMenuOpen(false)} style={{
              width: '100%', marginTop: 8, padding: '14px', borderRadius: 12,
              border: '1px solid var(--line)', background: 'var(--surface)',
              fontSize: 15, fontWeight: 600, cursor: 'pointer', color: 'var(--ink)',
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SheetBtn({ icon, label, onClick, tone }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '14px 16px', borderRadius: 12,
      border: 'none', background: 'transparent',
      display: 'flex', alignItems: 'center', gap: 14,
      fontSize: 15, fontWeight: 500, cursor: 'pointer',
      color: tone === 'danger' ? '#B91C1C' : 'var(--ink)',
      textAlign: 'left',
    }}>
      <Icon name={icon} size={18} stroke={tone === 'danger' ? '#B91C1C' : 'var(--ink-2)'} strokeWidth={1.8}/>
      {label}
    </button>
  );
}

const inputStyle = {
  width: '100%', padding: '14px 14px', borderRadius: 12,
  border: '1px solid var(--line)', background: 'var(--surface)',
  fontSize: 15, color: 'var(--ink)', outline: 'none',
};

// ──────────────────────────────────────────────
// Welcome back — returning-user re-auth.
// Distinct from cold sign-in: we already know who you are, so the
// screen is personal (avatar, last-session copy, pending-settle nudge)
// and the primary action is a single-tap biometric unlock.
// ──────────────────────────────────────────────
function ScreenWelcomeBack({ onDone, onSwitch }) {
  const me = (typeof ME !== 'undefined' && ME) || { name: 'Alex Rivera', email: 'alex.rivera@gmail.com' };
  const [state, setState] = React.useState('idle'); // idle | scanning | success
  const [showPin, setShowPin] = React.useState(false);
  const [pin, setPin] = React.useState('');

  const startScan = () => {
    if (state !== 'idle') return;
    setState('scanning');
    setTimeout(() => setState('success'), 1100);
    setTimeout(() => onDone && onDone(), 1700);
  };

  // Pulled from the ledger if available so the nudge feels real.
  const nudge = (() => {
    try {
      const bals = typeof BALANCES_BY_CURRENCY !== 'undefined' ? BALANCES_BY_CURRENCY : null;
      if (!bals || !bals.length) return null;
      const top = bals.slice().sort((a, b) => (b.owedToYou + b.youOwe) - (a.owedToYou + a.youOwe))[0];
      const net = top.owedToYou - top.youOwe;
      const frac = (top.code === 'INR' || top.code === 'JPY') ? 0 : 2;
      return {
        code: top.code,
        label: net >= 0 ? 'in your favor' : 'you owe',
        amount: `${top.symbol}${Math.abs(net).toFixed(frac)}`,
        tone: net >= 0 ? 'pos' : 'neg',
      };
    } catch { return null; }
  })();

  const initials = me.name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <div style={{ padding: '48px 28px 0' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 2 }}>SETTLE / 2026</div>
      </div>

      <div style={{ flex: 1, padding: '32px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Avatar with a soft concentric ring — signals identity, not generic */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{
            position: 'absolute', inset: -10, borderRadius: '50%',
            border: '1px dashed var(--line)', opacity: state === 'scanning' ? 1 : 0.45,
            animation: state === 'scanning' ? 'wbRing 1.1s ease-out infinite' : 'none',
          }}/>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
          }}>{initials}</div>
          {state === 'success' && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 28, height: 28, borderRadius: '50%',
              background: '#059669',
              border: '3px solid var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={14} stroke="white" strokeWidth={2.5}/>
            </div>
          )}
        </div>

        <div style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500 }}>Welcome back,</div>
        <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.02em', marginTop: 4 }}>
          {me.name.split(' ')[0]}.
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{me.email}</div>

        {/* Pending-settle nudge, if we have ledger data */}
        {nudge && (
          <div style={{
            marginTop: 22, padding: '10px 14px',
            borderRadius: 999, background: 'var(--surface-2)',
            border: '1px solid var(--line-2)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: 'var(--ink-2)',
          }}>
            <span className="mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8, color: 'var(--ink-3)' }}>{nudge.code}</span>
            <span>{nudge.label}</span>
            <span className="mono" style={{
              fontWeight: 600, letterSpacing: '-0.01em',
              color: nudge.tone === 'pos' ? '#047857' : '#B91C1C',
            }}>{nudge.amount}</span>
          </div>
        )}

        {/* Biometric tap target */}
        <button
          onClick={startScan}
          disabled={state !== 'idle'}
          style={{
            marginTop: 40, width: 92, height: 92, borderRadius: '50%',
            background: state === 'success' ? '#059669' : 'var(--ink)',
            border: 'none', cursor: state === 'idle' ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.15s, background 0.2s',
            transform: state === 'scanning' ? 'scale(0.96)' : 'scale(1)',
          }}
        >
          {state === 'success' ? (
            <Icon name="check" size={36} stroke="white" strokeWidth={2.5}/>
          ) : (
            <FingerprintGlyph pulsing={state === 'scanning'} />
          )}
        </button>

        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 16, minHeight: 20 }}>
          {state === 'idle'     && 'Tap to unlock with Face ID'}
          {state === 'scanning' && 'Scanning…'}
          {state === 'success'  && 'Unlocked'}
        </div>
      </div>

      <div style={{ padding: '12px 20px 24px', textAlign: 'center' }}>
        {!showPin ? (
          <>
            <button onClick={() => setShowPin(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'var(--ink-2)', fontWeight: 500,
              padding: '8px 12px',
            }}>
              Use passcode instead
            </button>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 12 }}>
              Not {me.name.split(' ')[0]}?{' '}
              <button onClick={onSwitch} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--accent)', fontWeight: 600, fontSize: 12, padding: 0,
              }}>Switch account</button>
            </div>
          </>
        ) : (
          <div style={{ padding: '0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: i < pin.length ? 'var(--ink)' : 'transparent',
                  border: '1.5px solid var(--line)',
                  transition: 'background 0.15s',
                }}/>
              ))}
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
              maxWidth: 220, margin: '0 auto',
            }}>
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => {
                if (!k) return <div key={i}/>;
                const isDel = k === '⌫';
                return (
                  <button key={i} onClick={() => {
                    if (isDel) setPin(p => p.slice(0, -1));
                    else if (pin.length < 4) {
                      const next = pin + k;
                      setPin(next);
                      if (next.length === 4) setTimeout(() => onDone && onDone(), 300);
                    }
                  }} style={{
                    height: 44, borderRadius: 12, border: 'none',
                    background: isDel ? 'transparent' : 'var(--surface-2)',
                    fontSize: 18, fontWeight: 500, cursor: 'pointer',
                    color: 'var(--ink)',
                  }}>{k}</button>
                );
              })}
            </div>
            <button onClick={() => { setShowPin(false); setPin(''); }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--ink-3)', marginTop: 14,
            }}>Use Face ID</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wbRing {
          0%   { transform: scale(1);    opacity: 0.6; }
          100% { transform: scale(1.35); opacity: 0;   }
        }
        @keyframes wbPulse {
          0%, 100% { opacity: 1;   }
          50%      { opacity: 0.35;}
        }
      `}</style>
    </div>
  );
}

function FingerprintGlyph({ pulsing }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
         style={{ animation: pulsing ? 'wbPulse 0.8s ease-in-out infinite' : 'none' }}>
      <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72a.499.499 0 0 1-.41-.79c.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25a.5.5 0 1 1-.81.58c-.9-1.27-2.04-2.26-3.39-2.95-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.98-.08.14-.23.2-.4.2zm6.25 12.07a.47.47 0 0 1-.35-.15c-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39a.5.5 0 0 1-1 0c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39a.5.5 0 0 1 1 0c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1a7.297 7.297 0 0 1-2.17-5.22c0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29a11.14 11.14 0 0 1-.73-3.96c0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.22-.25.37-.47.37z"
            fill="white"/>
    </svg>
  );
}



function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 8, letterSpacing: 0.2, textTransform: 'uppercase' }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

Object.assign(window, { ScreenSignIn, ScreenWelcomeBack, ScreenProfile, Field, inputStyle });
