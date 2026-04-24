import React from 'react'
import { SectionHeader } from './Primitives'
import { COMPARE_ROWS } from '../data'

function Mark({ v }) {
  if (v === 'yes') return (
    <span className="check-mark">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 7.5l3 3 5-6" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
  if (v === 'no' || v === '—') return <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>—</span>;
  return <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>{v}</span>;
}

export default function Comparison() {
  return (
    <section className="comparison-section" id="comparison">
      <div className="inner">
        <SectionHeader number="№ 04" eyebrow="Positioning / The others"
          title={<>We like them too. <i>But.</i></>}>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)' }}>
            A fair comparison. If you're happy on Splitwise, stay there — genuinely, no hard feelings. If you're tired of pop-up ads on the expense-add screen, we made something for you.
          </p>
        </SectionHeader>

        <div className="compare-table">
          <div className="compare-header">
            <div className="feature-col">Feature</div>
            <div className="us-col">Split Settle</div>
            <div className="them-col">Splitwise</div>
          </div>
          {COMPARE_ROWS.map((r, i) => (
            <div key={i} className="compare-row">
              <div className="feat-name">{r[0]}</div>
              <div className="cell"><Mark v={r[1]} /></div>
              <div className="cell"><Mark v={r[2]} /></div>
            </div>
          ))}
        </div>
        <p className="compare-note">Comparison based on public feature lists as of April 2026. We try to keep this honest — tell us if we missed something.</p>
      </div>
    </section>
  );
}
