import React, { useEffect, useRef, useState } from 'react'
import { V2Pill, EditorialButton, TickNumber } from './Primitives'
import { EXPENSES, PEOPLE, personName, PLAY_STORE_URL } from '../data'

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-glow" />
      <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative' }}>

        {/* Utility strip */}
        <div className="hero-strip reveal">
          <span>Vol. 01 — The ledger issue</span>
          <span>№ 2026 / 04</span>
          <span><span className="live-dot" /> Live beta — 4,218 groups active</span>
        </div>

        {/* Main grid */}
        <div className="hero-grid">
          {/* Left: headline */}
          <div>
            <div className="reveal" style={{ marginBottom: 32 }}>
              <V2Pill>A new ledger for old friends</V2Pill>
            </div>

            <h1>
              <span className="reveal">Split </span>
              <span className="reveal d1 accent">the bill,</span><br />
              <span className="reveal d2">not the </span>
              <span className="reveal d3 underline-wrap">
                <span>friendship.</span>
                <svg viewBox="0 0 400 22" preserveAspectRatio="none">
                  <path d="M 2 14 Q 100 2, 200 10 T 398 8" fill="none"
                    stroke="var(--lime)" strokeWidth="12" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="hero-sub reveal d3">
              A tiny, obsessive expense tracker for groups that'd rather be at dinner.
              Receipts in, balances out, <span className="serif">settled</span> in seconds — with the fewest payments possible.
            </p>

            <div className="hero-actions reveal d4">
              <EditorialButton variant="solid" size="lg" href={PLAY_STORE_URL}>
                Get Split Settle <span style={{ fontSize: 16 }}>→</span>
              </EditorialButton>
              <EditorialButton variant="ghost" size="lg" href="#ledger">See the math</EditorialButton>
            </div>

            {/* Stats row */}
            <div className="hero-stats reveal d5">
              <div>
                <div className="hero-stat-num"><TickNumber value={4218} decimals={0} /></div>
                <div className="hero-stat-label">Groups tracking</div>
              </div>
              <div>
                <div className="hero-stat-num"><TickNumber value={2.4} prefix="$" suffix="M" decimals={1} /></div>
                <div className="hero-stat-label">Settled this month</div>
              </div>
              <div>
                <div className="hero-stat-num"><TickNumber value={63} suffix="%" decimals={0} /></div>
                <div className="hero-stat-label">Fewer payments*</div>
              </div>
            </div>
            <p className="hero-note reveal d5">*vs. direct-settle across the same expense set.</p>
          </div>

          {/* Right: ledger ticker */}
          <div className="reveal-scale d2">
            <LedgerTicker />
          </div>
        </div>
      </div>
    </header>
  );
}

function LedgerTicker() {
  const [visibleIdx, setVisibleIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setVisibleIdx(prev => Math.min(prev + 1, EXPENSES.length));
    }, 350);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="ledger-ticker">
      <div className="ledger-fig">
        <span>Fig. 01 — Group: Lisbon trip</span>
        <span>4 members / 6 expenses</span>
      </div>
      <div className="ledger-table">
        <div className="ledger-header">
          <span>Date</span><span>Entry</span><span>Paid by</span>
          <span style={{ textAlign: 'right' }}>Amount</span>
          <span style={{ textAlign: 'right' }}>You</span>
        </div>
        <div>
          {EXPENSES.map((e, i) => {
            const paidByYou = e.payer === 'you';
            const yourShare = e.amt / 4;
            const net = paidByYou ? e.amt - yourShare : -yourShare;
            const sign = net >= 0 ? '+' : '−';
            const color = net >= 0 ? 'var(--back)' : 'var(--owe)';
            return (
              <div key={i} className="ledger-row" style={{
                opacity: i < visibleIdx ? 1 : 0,
                transform: i < visibleIdx ? 'translateY(0)' : 'translateY(8px)',
              }}>
                <span style={{ color: 'var(--ink-3)' }}>{e.date}</span>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{e.label}</span>
                <span style={{ color: 'var(--ink-2)' }}>{personName(e.payer)}</span>
                <span style={{ textAlign: 'right', color: 'var(--ink)', fontWeight: 500 }}>${e.amt.toFixed(2)}</span>
                <span style={{ textAlign: 'right', fontWeight: 600, color }}>{sign}${Math.abs(net).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
        <div className="ledger-footer">
          <span /><span className="mono" style={{ color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 10 }}>Net balance</span>
          <span /><span />
          <span style={{ textAlign: 'right', color: 'var(--back)', fontSize: 13 }}>
            {visibleIdx >= EXPENSES.length ? '+$94.18' : '+$0.00'}
          </span>
        </div>
      </div>
      <div className="ledger-summary">
        <div>
          <div className="ledger-summary-title">You're owed $94.18</div>
          <div className="ledger-summary-sub">from 2 people · 1 payment settles it all</div>
        </div>
        <EditorialButton variant="solid" size="sm" href={PLAY_STORE_URL}>Settle up</EditorialButton>
      </div>
    </div>
  );
}
