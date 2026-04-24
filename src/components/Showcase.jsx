import React, { useState, useEffect } from 'react'
import { SectionHeader } from './Primitives'
import { SHOWCASE_SCREENS } from '../data'

export default function Showcase() {
  const [active, setActive] = useState(0);
  const [key, setKey] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const iv = setInterval(() => {
      setActive(a => (a + 1) % SHOWCASE_SCREENS.length);
      setKey(k => k + 1);
    }, 3600);
    return () => clearInterval(iv);
  }, []);

  const s = SHOWCASE_SCREENS[active];
  const url = `/preview/index.html?screen=${s.screen}${s.params ? '&' + s.params : ''}`;

  return (
    <section className="showcase-section" id="showcase">
      <div className="inner">
        <SectionHeader number="№ 03" eyebrow="The product / Screens"
          title={<>Four screens. <i>That's the app.</i></>}>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)' }}>
            We spent a year cutting. No menus within menus, no dashboards pretending to be useful.
            The whole product fits on four screens — which is why it's faster to use.
          </p>
        </SectionHeader>

        <div className="showcase-grid">
          <div className="reveal-left showcase-stage" style={{ background: s.tint }}>
            <div className="corner-mark tl" />
            <div className="corner-mark tr" />
            <div className="corner-mark bl" />
            <div className="corner-mark br" />
            <div className="fig-num">FIG. {String(active + 4).padStart(2, '0')} / {s.tag}</div>
            <div className="showcase-phone">
              <iframe
                key={url}
                src={url}
                title="App preview"
                loading="lazy"
                scrolling="no"
              />
            </div>
          </div>

          <div className="showcase-list">
            {SHOWCASE_SCREENS.map((sc, i) => (
              <button key={i} onClick={() => {
                setActive(i);
                setKey(k => k + 1);
              }}>
                <span className={`s-num ${i === active ? 'active' : ''}`}>0{i + 1} /</span>
                <span className={`s-caption ${i === active ? 'active' : ''}`}>{sc.caption}</span>
                <span className="s-tag">{sc.tag}</span>
                {i === active && <div key={key} className="progress-bar" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
