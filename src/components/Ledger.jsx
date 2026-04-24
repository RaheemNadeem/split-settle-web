import React, { useState, useEffect, useCallback } from 'react'
import { SectionHeader, LedgerAvatar } from './Primitives'
import { PEOPLE, computeNet, naivePayments, simplifiedPayments } from '../data'

export default function Ledger() {
  const [mode, setMode] = useState('naive');
  const net = computeNet();
  const naive = naivePayments();
  const simple = simplifiedPayments();

  // Auto-toggle
  useEffect(() => {
    const iv = setInterval(() => setMode(m => m === 'naive' ? 'simple' : 'naive'), 4500);
    return () => clearInterval(iv);
  }, []);

  const payments = mode === 'naive' ? naive : simple;
  const highlight = mode === 'simple';
  const totalMoved = payments.reduce((s, p) => s + p.amt, 0);

  return (
    <section className="ledger-section" id="ledger">
      <div className="lime-bar" />
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div className="section-head" style={{ borderTopColor: 'var(--paper)' }}>
          <div className="num reveal" style={{ color: 'var(--paper)' }}>№ 01</div>
          <div>
            <div className="mono reveal" style={{ fontSize: 11, color: 'var(--lime)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
              The math / Debt simplification
            </div>
            <h2 className="reveal d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.02em',
              color: 'var(--paper)', maxWidth: 800, textWrap: 'balance',
            }}>Twelve IOUs. <i style={{ color: 'var(--lime)' }}>Three</i> payments.</h2>
            <p className="reveal d2" style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--paper-edge)', maxWidth: 560, marginTop: 20, textWrap: 'pretty' }}>
              After a weekend in Lisbon, four friends have scattered debts across six expenses.
              Our solver finds the smallest set of payments that zeroes everyone out — no Venmo chain, no round-robin awkwardness.
            </p>
          </div>
        </div>

        <div className="ledger-content">
          {/* Left: balance matrix */}
          <div className="reveal-left">
            <div className="fig-label"><span>Fig. 02 — Net positions</span></div>
            <div className="balance-card">
              {PEOPLE.map(p => {
                const v = net[p.id];
                const sign = v >= 0 ? '+' : '−';
                const color = v >= 0 ? 'var(--back)' : 'var(--owe)';
                const label = v >= 0 ? 'Owed' : 'Owes';
                return (
                  <div key={p.id} className="balance-row">
                    <LedgerAvatar id={p.id} size={40} people={PEOPLE} />
                    <div>
                      <div className="balance-name">{p.name}</div>
                      <div className="balance-detail">{label} · {Math.abs(v).toFixed(2)} €</div>
                    </div>
                    <div className="balance-amt" style={{ color }}>{sign}${Math.abs(v).toFixed(2)}</div>
                  </div>
                );
              })}
              <div className="balance-sum"><span>Sum</span><span style={{ fontWeight: 600 }}>$0.00 ✓</span></div>
            </div>
            <div className="legend">
              <span><span className="legend-dot" style={{ background: 'var(--back)' }} /> Creditor</span>
              <span><span className="legend-dot" style={{ background: 'var(--owe)' }} /> Debtor</span>
            </div>
          </div>

          {/* Right: payments */}
          <div className="reveal-right d1">
            <div className="toggle-wrap">
              <button className={`toggle-btn ${mode === 'naive' ? 'active' : ''}`}
                onClick={() => setMode('naive')}>The old way</button>
              <button className={`toggle-btn ${mode === 'simple' ? 'active' : ''}`}
                onClick={() => setMode('simple')}>Split Settle</button>
            </div>

            <div className="fig-label">
              <span>Fig. 03 — Required payments</span>
              <span>{payments.length} transfers / ${totalMoved.toFixed(2)} moved</span>
            </div>

            <div style={{ minHeight: 480 }}>
              {payments.map((p, i) => (
                <div key={`${mode}-${i}`} className={`payment-line ${highlight ? 'highlight' : ''}`}
                  style={{ animation: `fadeIn 0.4s ease ${i * 0.06}s both` }}>
                  <LedgerAvatar id={p.from} size={32} people={PEOPLE} />
                  <span className="payment-label">pays</span>
                  <span className="payment-amt">${p.amt.toFixed(2)}</span>
                  <span className="payment-label">to</span>
                  <LedgerAvatar id={p.to} size={32} people={PEOPLE} />
                </div>
              ))}
            </div>

            <div className={`payments-summary ${highlight ? 'highlight' : ''}`}>
              <div>
                <div className="main">
                  {highlight ? `${payments.length} payments. Everyone even.` : `${payments.length} tangled IOUs.`}
                </div>
                <div className="note">
                  {highlight
                    ? `${Math.round((1 - payments.length / naive.length) * 100)}% fewer transactions than the naive approach`
                    : 'Good luck keeping track.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
