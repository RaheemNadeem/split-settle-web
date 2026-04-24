import React from 'react'
import { MARQUEE_ITEMS } from '../data'

function MarqueeItem({ it }) {
  return (
    <div className="marquee-item">
      <span className="emoji">{it.emoji}</span>
      <span className="label">{it.label}</span>
      <span className="where">{it.where}</span>
      <span className="amt">${it.amt.toFixed(2)}</span>
      <span className="dot-sm" />
    </div>
  );
}

function MarqueeRow({ items, dir = 'ltr', duration = 70 }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-row">
      <div className="marquee-track" style={{
        animation: `marquee-${dir} ${duration}s linear infinite`,
      }}>
        {doubled.map((it, i) => <MarqueeItem key={i} it={it} />)}
      </div>
    </div>
  );
}

export default function Marquee() {
  const reversed = [...MARQUEE_ITEMS].reverse();
  return (
    <section className="marquee-section">
      <div className="marquee-header">
        <h2 className="reveal">The receipts of a life <i>shared.</i></h2>
        <p className="reveal d1 aside">Groceries. Rent. That trip you won't stop talking about. Log it once — in under ten seconds.</p>
      </div>
      <MarqueeRow items={MARQUEE_ITEMS} dir="ltr" duration={70} />
      <MarqueeRow items={reversed} dir="rtl" duration={90} />
    </section>
  );
}
