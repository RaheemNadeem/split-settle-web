// Shared UI atoms for the Settle prototype
// Uses CSS variables from index.html for theming.

function Avatar({ person, size = 36, ring = false }) {
  if (!person) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: person.color, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, letterSpacing: 0.3,
      flexShrink: 0,
      boxShadow: ring ? '0 0 0 2px var(--surface), 0 0 0 3px var(--line)' : 'none',
      fontFamily: "'Inter Tight', sans-serif",
    }}>{person.initials}</div>
  );
}

function AvatarStack({ ids, size = 26, max = 4 }) {
  const shown = ids.slice(0, max);
  const rest = ids.length - max;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((id, i) => (
        <div key={`${id}-${i}`} style={{ marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--surface)', borderRadius: '50%' }}>
          <Avatar person={PERSON(id)} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div style={{
          marginLeft: -8, width: size, height: size, borderRadius: '50%',
          background: 'var(--chip)', color: 'var(--ink-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, border: '2px solid var(--surface)',
        }}>+{rest}</div>
      )}
    </div>
  );
}

function Money({ value, currency = 'USD', size = 16, weight = 500, signed = false, colorize = false, mono = true }) {
  const abs = Math.abs(value);
  const sign = value < 0 ? '−' : (signed && value > 0 ? '+' : '');
  const sym = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' }[currency] || '$';
  const color = !colorize ? 'inherit' : value > 0 ? 'var(--pos)' : value < 0 ? 'var(--warn)' : 'var(--ink-2)';
  return (
    <span className={mono ? 'mono' : ''} style={{ fontSize: size, fontWeight: weight, color, letterSpacing: '-0.01em' }}>
      {sign}{sym}{abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

function Pill({ children, tone = 'neutral', size = 'sm' }) {
  const tones = {
    neutral: { bg: 'var(--chip)', fg: 'var(--ink-2)' },
    accent:  { bg: 'var(--accent-soft)', fg: 'var(--accent-deep)' },
    warn:    { bg: 'var(--warn-soft)', fg: '#991B1B' },
    ink:     { bg: 'var(--ink)', fg: 'var(--bg)' },
  };
  const t = tones[tone];
  const p = size === 'sm' ? '3px 8px' : '6px 12px';
  const fs = size === 'sm' ? 11 : 13;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: p, borderRadius: 100, background: t.bg, color: t.fg,
      fontSize: fs, fontWeight: 500, letterSpacing: 0.1,
      fontFamily: "'Inter Tight', sans-serif",
    }}>{children}</span>
  );
}

function Btn({ children, variant = 'primary', size = 'md', onClick, icon, full, disabled, style = {} }) {
  const variants = {
    primary: { bg: 'var(--ink)', fg: 'var(--bg)', bd: 'var(--ink)' },
    accent:  { bg: 'var(--accent)', fg: 'white', bd: 'var(--accent)' },
    warn:    { bg: 'var(--warn)', fg: 'white', bd: 'var(--warn)' },
    ghost:   { bg: 'transparent', fg: 'var(--ink)', bd: 'var(--line)' },
    soft:    { bg: 'var(--chip)', fg: 'var(--ink)', bd: 'transparent' },
  };
  const sizes = {
    sm: { p: '8px 12px', fs: 13, h: 34 },
    md: { p: '10px 16px', fs: 14, h: 42 },
    lg: { p: '14px 20px', fs: 15, h: 52 },
  };
  const v = variants[variant], s = sizes[size];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: s.p, height: s.h, borderRadius: 12,
      background: v.bg, color: v.fg, border: `1px solid ${v.bd}`,
      fontSize: s.fs, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1, width: full ? '100%' : 'auto',
      letterSpacing: '-0.005em',
      transition: 'transform 80ms ease, opacity 80ms ease',
      ...style,
    }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: s.fs - 1 }}>{icon}</span>}
      {children}
    </button>
  );
}

function Card({ children, pad = 16, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface)', borderRadius: 16,
      border: '1px solid var(--line)', padding: pad,
      boxShadow: 'var(--elev)', cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

function SectionLabel({ children, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '20px 20px 8px', color: 'var(--ink-3)',
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8,
    }}>
      <span>{children}</span>
      {right}
    </div>
  );
}

// Simple icon set — hand-crafted stroke SVGs, no emoji
function Icon({ name, size = 20, stroke = 'currentColor', strokeWidth = 1.6 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'plus':      return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'back':      return <svg {...common}><path d="M15 18l-6-6 6-6"/></svg>;
    case 'close':     return <svg {...common}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'search':    return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'bell':      return <svg {...common}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8Z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'more':      return <svg {...common}><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>;
    case 'home':      return <svg {...common}><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>;
    case 'friends':   return <svg {...common}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="3"/><path d="M15 20a5.5 5.5 0 0 1 6.5-5.4"/></svg>;
    case 'groups':    return <svg {...common}><rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="13" width="7" height="7" rx="1.5"/><rect x="14" y="13" width="7" height="7" rx="1.5"/></svg>;
    case 'activity':  return <svg {...common}><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>;
    case 'account':   return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'check':     return <svg {...common}><path d="m4 12 5 5L20 6"/></svg>;
    case 'arrow-right': return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-down':  return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case 'calendar':  return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'tag':       return <svg {...common}><path d="M3 12V4h8l10 10-8 8z"/><circle cx="8" cy="8" r="1.5"/></svg>;
    case 'upload':    return <svg {...common}><path d="M12 17V4M6 10l6-6 6 6"/><path d="M4 20h16"/></svg>;
    case 'equals':    return <svg {...common}><path d="M5 9h14M5 15h14"/></svg>;
    case 'percent':   return <svg {...common}><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M5 19 19 5"/></svg>;
    case 'shares':    return <svg {...common}><rect x="3" y="10" width="4" height="10"/><rect x="10" y="6" width="4" height="14"/><rect x="17" y="13" width="4" height="7"/></svg>;
    case 'exact':     return <svg {...common}><path d="M12 2v20M7 5h7a3.5 3.5 0 0 1 0 7H7m0 0h9a3.5 3.5 0 0 1 0 7H7"/></svg>;
    case 'file':      return <svg {...common}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>;
    case 'google':    return <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.8 3.3-8Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .6-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.6H2.2v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC04" d="M5.8 14a6.5 6.5 0 0 1 0-4.2V7H2.2a11 11 0 0 0 0 10l3.6-2.8Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.1-3.1A11 11 0 0 0 12 1a11 11 0 0 0-9.8 6l3.6 2.8c.9-2.7 3.3-4.6 6.2-4.6Z"/></svg>;
    case 'camera':    return <svg {...common}><path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>;
    case 'image':     return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m3 17 5-5 5 5 3-3 5 5"/></svg>;
    case 'trash':     return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>;
    case 'lock':      return <svg {...common}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
    case 'mail':      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case 'shield':    return <svg {...common}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/></svg>;
    case 'eye':       return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eye-off':   return <svg {...common}><path d="M3 3l18 18"/><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.7 6.7A17 17 0 0 0 2 12s3.5 6 10 6a10.7 10.7 0 0 0 4-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>;
    default: return null;
  }
}

// Bottom navigation bar (Material-ish but warm/original)
function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home',     label: 'Home',     icon: 'home' },
    { id: 'groups',   label: 'Groups',   icon: 'groups' },
    { id: 'activity', label: 'Activity', icon: 'activity' },
    { id: 'account',  label: 'Account',  icon: 'account' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '6px 8px 10px', background: 'var(--surface)',
      borderTop: '1px solid var(--line)',
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 0', color: on ? 'var(--ink)' : 'var(--ink-3)',
          }}>
            <Icon name={t.icon} size={22} stroke="currentColor" strokeWidth={on ? 2 : 1.5} />
            <span style={{ fontSize: 10, fontWeight: on ? 600 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Top bar specific to the app — simpler than MD
function TopBar({ title, subtitle, left, right, scrolled }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 16px 12px', background: 'var(--surface)',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      minHeight: 52, flexShrink: 0,
    }}>
      {left}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function IconBtn({ icon, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      width: 38, height: 38, borderRadius: 12, border: 'none',
      background: 'transparent', color: 'var(--ink)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <Icon name={icon} size={20} />
      {badge && <span style={{
        position: 'absolute', top: 7, right: 8, width: 7, height: 7,
        borderRadius: '50%', background: 'var(--warn)',
      }}/>}
    </button>
  );
}

Object.assign(window, { Avatar, AvatarStack, Money, Pill, Btn, Card, SectionLabel, Icon, BottomNav, TopBar, IconBtn });
