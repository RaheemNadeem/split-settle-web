import React from 'react'
import { SectionHeader } from './Primitives'
import { FEATURE_ROWS } from '../data'

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="inner">
        <SectionHeader number="№ 02" eyebrow="The catalogue / Features"
          title={<>Small tool. <i>Big opinions.</i></>}>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)' }}>
            Six things we obsess over so you don't have to. Everything else is a distraction.
          </p>
        </SectionHeader>

        <div>
          {FEATURE_ROWS.map((f, i) => (
            <div key={i} className="feature-row reveal">
              <div className="lime-marker" />
              <div className="feature-num">{f.num} /</div>
              <div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-sub">{f.sub}</div>
              </div>
              <div className="feature-body">{f.body}</div>
              <div className="feature-meta">{f.meta}</div>
            </div>
          ))}
          <div className="feature-end" />
        </div>
      </div>
    </section>
  );
}
