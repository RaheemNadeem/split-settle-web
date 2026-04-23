// ─────────────────────────────────────────────────────────────
// Password-based auth flow.
// Sign up → verify email → home.
// Forgot password → reset link sent → (tap link) → reset password → changed → login.
// Conventions that drive the design:
//   • Requirements are shown as a LIVE checklist, not an error-after-submit wall.
//   • Strength is a 4-segment bar, not a vague "weak/strong" word.
//   • Codes are 6 boxes, not one long input — matches phone muscle memory.
//   • "Resend" has a visible cooldown; "Open email app" is offered because
//     the #1 drop-off in email verification is "what inbox am I on?".
// ─────────────────────────────────────────────────────────────

// Password policy — single source of truth so every screen reports the same thing.
const PW_RULES = [
  { id: 'len',   label: 'At least 8 characters',      test: p => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter',       test: p => /[A-Z]/.test(p) },
  { id: 'num',   label: 'One number',                 test: p => /[0-9]/.test(p) },
  { id: 'sym',   label: 'One symbol (!@#$…)',         test: p => /[^A-Za-z0-9]/.test(p) },
];

function pwScore(p) {
  return PW_RULES.reduce((n, r) => n + (r.test(p) ? 1 : 0), 0);
}
function pwAllPass(p) { return pwScore(p) === PW_RULES.length; }

// ──────────────────────────────────────────────────────────
// Shared sub-components
// ──────────────────────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder, autoFocus }) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{ ...inputStyle, paddingRight: 48, fontFamily: value ? 'var(--mono, ui-monospace, monospace)' : 'inherit', letterSpacing: value && !visible ? 3 : 0 }}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '10px 12px', color: 'var(--ink-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name={visible ? 'eye-off' : 'eye'} size={18} stroke="var(--ink-2)" strokeWidth={1.7}/>
      </button>
    </div>
  );
}

function StrengthBar({ score }) {
  const color =
    score <= 1 ? '#DC2626' :
    score === 2 ? '#F59E0B' :
    score === 3 ? '#65A30D' :
                  '#059669';
  const label =
    score === 0 ? '—' :
    score === 1 ? 'Weak' :
    score === 2 ? 'Fair' :
    score === 3 ? 'Good' : 'Strong';
  return (
    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < score ? color : 'var(--line-2)',
            transition: 'background 0.15s',
          }}/>
        ))}
      </div>
      <div className="mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8, color, minWidth: 42, textAlign: 'right' }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
}

function RulesChecklist({ password, compact }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: compact ? '1fr 1fr' : '1fr',
      gap: compact ? '6px 12px' : 8,
      marginTop: 12,
    }}>
      {PW_RULES.map(r => {
        const ok = r.test(password);
        return (
          <div key={r.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12.5, color: ok ? '#047857' : 'var(--ink-3)',
            transition: 'color 0.15s',
          }}>
            <span style={{
              width: 16, height: 16, borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: ok ? '#059669' : 'transparent',
              border: ok ? 'none' : '1.5px solid var(--line)',
              flexShrink: 0, transition: 'background 0.15s',
            }}>
              {ok && <Icon name="check" size={10} stroke="white" strokeWidth={3}/>}
            </span>
            <span>{r.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function AuthScaffold({ back, eyebrow, title, subtitle, children, footer }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <div style={{ padding: '14px 12px 0', minHeight: 48 }}>
        {back && <IconBtn icon="back" onClick={back}/>}
      </div>
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 28px 20px' }}>
        {eyebrow && (
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 2, marginBottom: 10 }}>
            {eyebrow}
          </div>
        )}
        <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', textWrap: 'balance' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 10, lineHeight: 1.5 }}>
            {subtitle}
          </div>
        )}
        <div style={{ marginTop: 28 }}>{children}</div>
      </div>
      {footer && (
        <div style={{ padding: '12px 20px 24px', background: 'var(--bg)', borderTop: '1px solid var(--line-2)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 1. Sign up
// ──────────────────────────────────────────────────────────
function ScreenSignUp({ goto, onSignIn }) {
  const [name, setName]       = React.useState('');
  const [email, setEmail]     = React.useState('');
  const [pw, setPw]           = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const canSubmit = name.trim() && /.+@.+\..+/.test(email) && pwAllPass(pw);

  return (
    <AuthScaffold
      back={() => goto('signin')}
      eyebrow="SETTLE / 2026"
      title="Create your account."
      subtitle="Track who paid, split any way, settle cleanly."
      footer={
        <>
          <Btn variant="primary" size="lg" full disabled={!canSubmit}
               onClick={() => goto('verifyEmail', { email })}>
            Create account
          </Btn>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 14 }}>
            Already have an account?{' '}
            <button onClick={onSignIn} style={linkBtn}>Sign in</button>
          </div>
        </>
      }
    >
      <Field label="Full name">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Rivera" style={inputStyle}/>
      </Field>
      <Field label="Email">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com"
               autoComplete="email" inputMode="email" style={inputStyle}/>
      </Field>
      <Field label="Password">
        <div onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 100)}>
          <PasswordInput value={pw} onChange={setPw} placeholder="Create a password"/>
        </div>
        {(focused || pw) && (
          <>
            <StrengthBar score={pwScore(pw)}/>
            <RulesChecklist password={pw} compact/>
          </>
        )}
      </Field>

      <div style={{
        marginTop: 12, padding: '12px 14px', borderRadius: 12,
        background: 'var(--surface-2)', border: '1px solid var(--line-2)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
        fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5,
      }}>
        <Icon name="lock" size={14} stroke="var(--ink-3)" strokeWidth={2}/>
        <span>We'll send a 6-digit code to verify your email. You can change it later in settings.</span>
      </div>
    </AuthScaffold>
  );
}

// ──────────────────────────────────────────────────────────
// 2. Verify email (6-digit code)
// ──────────────────────────────────────────────────────────
function ScreenVerifyEmail({ email = 'alex.rivera@gmail.com', goto }) {
  const [digits, setDigits] = React.useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = React.useState(30);
  const [verifying, setVerifying] = React.useState(false);
  const refs = React.useRef([]);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const complete = digits.every(d => d !== '');
  React.useEffect(() => {
    if (complete && !verifying) {
      setVerifying(true);
      const t = setTimeout(() => goto('home', { welcomeBack: true }), 900);
      return () => clearTimeout(t);
    }
  }, [complete]);

  const update = (i, v) => {
    const clean = v.replace(/[^0-9]/g, '').slice(0, 1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const onPaste = (e) => {
    const txt = (e.clipboardData.getData('text') || '').replace(/[^0-9]/g, '').slice(0, 6);
    if (txt.length >= 1) {
      e.preventDefault();
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < txt.length; i++) next[i] = txt[i];
      setDigits(next);
      refs.current[Math.min(txt.length, 5)]?.focus();
    }
  };

  return (
    <AuthScaffold
      back={() => goto('signup')}
      eyebrow="VERIFY YOUR EMAIL"
      title="Check your inbox."
      subtitle={<>We sent a 6-digit code to <strong style={{ color: 'var(--ink)' }}>{email}</strong>. Enter it below to finish creating your account.</>}
      footer={
        <>
          <Btn variant="primary" size="lg" full disabled={!complete || verifying} onClick={() => { if (complete) { setVerifying(true); setTimeout(() => goto('home', { welcomeBack: true }), 600); } }}>
            {verifying ? 'Verifying\u2026' : 'Verify email'}
          </Btn>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 14 }}>
            Didn't get it?{' '}
            {cooldown > 0 ? (
              <span style={{ color: 'var(--ink-3)' }}>Resend in {cooldown}s</span>
            ) : (
              <button onClick={() => setCooldown(30)} style={linkBtn}>Resend code</button>
            )}
          </div>
        </>
      }
    >
      <div onPaste={onPaste} style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 8, marginBottom: 8,
      }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => (refs.current[i] = el)}
            value={d}
            onChange={e => update(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            style={{
              width: '100%', minWidth: 0, height: 56, padding: 0,
              textAlign: 'center',
              fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
              borderRadius: 12, boxSizing: 'border-box',
              border: `1.5px solid ${verifying ? '#059669' : d ? 'var(--ink)' : 'var(--line)'}`,
              background: 'var(--surface)',
              color: 'var(--ink)', outline: 'none',
              transition: 'border-color 0.15s',
            }}
          />
        ))}
      </div>
      <button
        onClick={() => {}}
        style={{
          background: 'none', border: '1px solid var(--line-2)',
          borderRadius: 12, cursor: 'pointer',
          padding: '12px 16px', marginTop: 18,
          width: '100%',
          display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, color: 'var(--ink-2)',
        }}
      >
        <Icon name="mail" size={14} stroke="var(--ink-2)" strokeWidth={2}/>
        Open email app
      </button>
    </AuthScaffold>
  );
}

// ──────────────────────────────────────────────────────────
// 3. Forgot password
// ──────────────────────────────────────────────────────────
function ScreenForgotPassword({ goto }) {
  const [email, setEmail] = React.useState('');
  const valid = /.+@.+\..+/.test(email);
  return (
    <AuthScaffold
      back={() => goto('signin')}
      eyebrow="ACCOUNT RECOVERY"
      title="Forgot your password?"
      subtitle="Enter the email you used to sign up and we'll send you a link to reset it."
      footer={
        <>
          <Btn variant="primary" size="lg" full disabled={!valid}
               onClick={() => goto('resetLinkSent', { email })}>
            Send reset link
          </Btn>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 14 }}>
            Remembered it?{' '}
            <button onClick={() => goto('signin')} style={linkBtn}>Back to sign in</button>
          </div>
        </>
      }
    >
      <Field label="Email">
        <input
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@domain.com" autoFocus
          inputMode="email" autoComplete="email"
          style={inputStyle}
        />
      </Field>
    </AuthScaffold>
  );
}

// ──────────────────────────────────────────────────────────
// 4. Reset link sent (confirmation — before the user clicks the email link)
// ──────────────────────────────────────────────────────────
function ScreenResetLinkSent({ email = 'alex.rivera@gmail.com', goto }) {
  const [cooldown, setCooldown] = React.useState(30);
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  return (
    <AuthScaffold
      back={() => goto('forgot')}
      footer={
        <>
          {/* This button simulates the user having tapped the link in their inbox. */}
          <Btn variant="primary" size="lg" full onClick={() => goto('resetPassword', { email })}
               icon={<Icon name="mail" size={16} stroke="var(--bg)" strokeWidth={2}/>}>
            Simulate: open reset link
          </Btn>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 14 }}>
            Didn't get it?{' '}
            {cooldown > 0 ? (
              <span style={{ color: 'var(--ink-3)' }}>Resend in {cooldown}s</span>
            ) : (
              <button onClick={() => setCooldown(30)} style={linkBtn}>Resend link</button>
            )}
          </div>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 10 }}>
        {/* Envelope illustration — inline SVG, matches the existing brand stroke style */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'var(--pos-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
        }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <rect x="2.5" y="5" width="19" height="14" rx="2.5"
                  stroke="#047857" strokeWidth="1.6"/>
            <path d="M2.8 6 L12 13 L21.2 6"
                  stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="19" cy="6" r="4" fill="#059669"/>
            <path d="M17 6 L18.5 7.5 L21 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          Check your inbox.
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 10, lineHeight: 1.5, maxWidth: 320 }}>
          We sent a password reset link to
        </div>
        <div className="mono" style={{
          marginTop: 12, padding: '8px 14px', borderRadius: 999,
          background: 'var(--surface-2)', border: '1px solid var(--line-2)',
          fontSize: 13, fontWeight: 500, color: 'var(--ink)',
        }}>
          {email}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 18, lineHeight: 1.5, maxWidth: 300 }}>
          The link expires in 1 hour. Check your spam folder if you don't see it.
        </div>
      </div>
    </AuthScaffold>
  );
}

// ──────────────────────────────────────────────────────────
// 5. Reset password (reached by clicking the email link)
// ──────────────────────────────────────────────────────────
function ScreenResetPassword({ email = 'alex.rivera@gmail.com', goto }) {
  const [pw, setPw]             = React.useState('');
  const [pw2, setPw2]           = React.useState('');
  const [touched2, setTouched2] = React.useState(false);

  const pwValid = pwAllPass(pw);
  const match   = pw === pw2 && pw2.length > 0;
  const showMatchErr = touched2 && !match && pw2.length > 0;
  const canSubmit = pwValid && match;

  return (
    <AuthScaffold
      eyebrow="RESET PASSWORD"
      title="Set a new password."
      subtitle={<>Resetting password for <strong style={{ color: 'var(--ink)' }}>{email}</strong>. Choose something you haven't used before.</>}
      footer={
        <Btn variant="primary" size="lg" full disabled={!canSubmit} onClick={() => goto('passwordChanged')}>
          Reset password
        </Btn>
      }
    >
      <Field label="New password">
        <PasswordInput value={pw} onChange={setPw} placeholder="Create a new password" autoFocus/>
        <StrengthBar score={pwScore(pw)}/>
        <RulesChecklist password={pw} compact/>
      </Field>

      <Field label="Confirm new password">
        <PasswordInput value={pw2} onChange={v => { setPw2(v); if (!touched2) setTouched2(true); }}
                       placeholder="Re-enter password"/>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, minHeight: 18,
          color: showMatchErr ? '#B91C1C'
               : match         ? '#047857'
               : 'var(--ink-3)',
        }}>
          {pw2 && match && <Icon name="check" size={12} stroke="#059669" strokeWidth={2.5}/>}
          {showMatchErr  ? 'Passwords don\u2019t match'
            : match      ? 'Passwords match'
            : 'Re-enter to confirm'}
        </div>
      </Field>
    </AuthScaffold>
  );
}

// ──────────────────────────────────────────────────────────
// 6. Password changed confirmation
// ──────────────────────────────────────────────────────────
function ScreenPasswordChanged({ goto }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 28px', textAlign: 'center',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: '#059669',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 28px rgba(5, 150, 105, 0.35)',
          animation: 'pcPop 0.5s cubic-bezier(.18,1.1,.35,1.05)',
        }}>
          <Icon name="check" size={44} stroke="white" strokeWidth={2.8}/>
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 28, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Password changed.
        </div>
        <div style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 14, maxWidth: 300, lineHeight: 1.5 }}>
          You've been signed out of all devices. Sign in with your new password to continue.
        </div>

        <div style={{
          marginTop: 32, padding: '14px 18px', borderRadius: 12,
          background: 'var(--surface-2)', border: '1px solid var(--line-2)',
          display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left',
          maxWidth: 340,
        }}>
          <Icon name="shield" size={16} stroke="var(--ink-2)" strokeWidth={2}/>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
            For your security, sessions on other phones and browsers were ended. Active shares and import jobs are safe.
          </div>
        </div>
      </div>
      <div style={{ padding: '16px 20px 28px' }}>
        <Btn variant="primary" size="lg" full onClick={() => goto('signin')}>Go to sign in</Btn>
      </div>
      <style>{`
        @keyframes pcPop {
          0%   { transform: scale(0.3);  opacity: 0; }
          70%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const linkBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--accent)', fontWeight: 600, padding: 0,
  fontSize: 'inherit',
};

Object.assign(window, {
  ScreenSignUp, ScreenVerifyEmail,
  ScreenForgotPassword, ScreenResetLinkSent,
  ScreenResetPassword, ScreenPasswordChanged,
  PW_RULES, pwScore, pwAllPass,
});
