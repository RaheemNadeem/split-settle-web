import React from 'react'
import { EditorialButton, TickNumber } from './Primitives'
import { PLAY_STORE_URL } from '../data'

export default function CTA() {
  return (
    <section className="cta-section" id="download">
      <div className="glow" />
      <div className="serial left">№ 05 · FIN ·</div>
      <div className="serial right">· DOWNLOAD ·</div>

      <div className="cta-inner">
        <h2 className="reveal">Go enjoy<br /><i>the dinner.</i></h2>
        <p className="cta-sub reveal d1">
          Free to start. No credit card. No ads in your expense feed.
          The app is waiting on your phone — the hard part is getting your friends to install it.
        </p>
        <div className="cta-buttons reveal d2">
          <EditorialButton variant="lime" size="lg" href={PLAY_STORE_URL}>⬇ Google Play</EditorialButton>
          <EditorialButton variant="ghost" size="lg" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}
            onClick={e => e.preventDefault()}>⬇ App Store (Soon)</EditorialButton>
          <EditorialButton variant="ghost" size="lg" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}
            onClick={e => e.preventDefault()}>Import from Splitwise</EditorialButton>
        </div>
        <div className="cta-counter reveal d3">
          <span className="glow-dot" />
          <TickNumber value={4218} decimals={0} /> groups active · <TickNumber value={38291} decimals={0} /> expenses this week
        </div>
      </div>
    </section>
  );
}
