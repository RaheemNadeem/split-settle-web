import React, { useState, useEffect } from 'react'
import { EditorialButton } from './Primitives'
import { PLAY_STORE_URL } from '../data'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 32px',
        background: scrolled ? 'rgba(251,251,250,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        transition: 'all 0.35s ease',
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <a href="/" style={{
              fontFamily: 'var(--font-display)', fontSize: 28,
              fontStyle: 'italic', letterSpacing: '-0.02em',
              color: 'var(--ink)', textDecoration: 'none',
            }}>Split<span style={{ color: 'var(--lime-deep)' }}>·</span>Settle</a>
            <span className="mono" style={{
              fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em',
            }}>EST. 2026</span>
          </div>

          <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[['The math', '#ledger'], ['Features', '#features'], ['App', '#showcase'], ['vs Splitwise', '#comparison']].map(([label, href]) => (
              <a key={href} href={href} className="link-editorial mono" style={{
                fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500,
              }}>{label}</a>
            ))}
            <EditorialButton variant="lime" size="sm" href={PLAY_STORE_URL}>Get the app →</EditorialButton>
          </div>

          <button className={`nav-mobile-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {[['The math', '#ledger'], ['Features', '#features'], ['App', '#showcase'], ['vs Splitwise', '#comparison']].map(([label, href]) => (
          <a key={href} href={href} className="mobile-link" onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
        <a href={PLAY_STORE_URL} className="mobile-cta" target="_blank" rel="noopener">Get the app</a>
      </div>
    </>
  );
}
