import React, { useState, useEffect, useRef } from 'react'

// V2 Pill badge
export function V2Pill({ children, dark = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 12px 6px 10px', borderRadius: 100,
      background: dark ? 'var(--ink)' : 'transparent',
      color: dark ? 'var(--paper)' : 'var(--ink-2)',
      fontSize: 12, fontWeight: 500,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      border: dark ? 'none' : '1px solid var(--line)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: dark ? 'var(--lime)' : 'var(--lime-deep)',
        boxShadow: dark ? '0 0 8px var(--lime)' : 'none',
      }} />
      {children}
    </span>
  );
}

// Section Header
export function SectionHeader({ eyebrow, number, title, children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '80px 1fr',
      gap: 20, alignItems: 'baseline',
      borderTop: '1px solid var(--ink)',
      paddingTop: 20, marginBottom: 44,
    }}>
      <div className="mono reveal" style={{
        fontSize: 11, color: 'var(--ink-2)', letterSpacing: '0.05em',
        textTransform: 'uppercase', fontWeight: 500,
      }}>{number}</div>
      <div>
        <div className="mono reveal" style={{
          fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em',
          textTransform: 'uppercase', fontWeight: 500, marginBottom: 10,
        }}>{eyebrow}</div>
        <h2 className="reveal d1" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 64px)',
          fontWeight: 400, lineHeight: 0.95,
          letterSpacing: '-0.02em', color: 'var(--ink)',
          maxWidth: 800, textWrap: 'balance',
        }}>{title}</h2>
        {children && (
          <div className="reveal d2" style={{ marginTop: 16, maxWidth: 520 }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// Editorial Button
export function EditorialButton({ children, variant = 'solid', href, onClick, style = {}, size = 'md' }) {
  const [hover, setHover] = useState(false);
  const basePad = size === 'lg' ? '14px 26px' : size === 'sm' ? '8px 16px' : '12px 22px';
  const fontSize = size === 'lg' ? 13 : size === 'sm' ? 11 : 12;

  const variants = {
    solid: {
      background: hover ? 'var(--lime-ink)' : 'var(--ink)',
      color: 'var(--paper)', border: '1px solid var(--ink)',
    },
    lime: {
      background: hover ? 'var(--lime-deep)' : 'var(--lime)',
      color: 'var(--ink)', border: '1px solid var(--lime-deep)',
      boxShadow: hover ? '0 4px 0 var(--ink)' : '0 2px 0 var(--ink)',
    },
    ghost: {
      background: hover ? 'var(--ink)' : 'transparent',
      color: hover ? 'var(--paper)' : 'var(--ink)',
      border: '1px solid var(--ink)',
    },
  };

  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: basePad, borderRadius: 999,
        fontFamily: 'var(--font-mono)', fontSize, fontWeight: 500,
        letterSpacing: '0.02em', textTransform: 'uppercase',
        textDecoration: 'none', cursor: 'pointer',
        transform: hover && variant === 'lime' ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
        ...variants[variant], ...style,
      }}>
      {children}
    </Tag>
  );
}

// Animated tick counter
export function TickNumber({ value, prefix = '', suffix = '', decimals = 2, duration = 1400 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); obs.unobserve(el); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let raf; const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, duration]);

  const fmt = shown.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref} className="mono">{prefix}{fmt}{suffix}</span>;
}

// Ledger Avatar
export function LedgerAvatar({ id, size = 32, people }) {
  const p = people.find(x => x.id === id);
  if (!p) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: p.tint, color: 'var(--paper)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: size * 0.4, fontWeight: 600,
      border: '1px solid var(--ink)', flexShrink: 0,
    }}>{p.name[0]}</div>
  );
}
