import React, { useState } from 'react'
import { SectionHeader } from './Primitives'
import { SHOWCASE_SCREENS } from '../data'

export default function Showcase() {
  const [active, setActive] = useState(0);

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
          <div className="reveal-left showcase-stage" style={{ background: SHOWCASE_SCREENS[active].tint }}>
            <div className="corner-mark tl" />
            <div className="corner-mark tr" />
            <div className="corner-mark bl" />
            <div className="corner-mark br" />
            <div className="fig-num">FIG. {String(active + 4).padStart(2, '0')} / {SHOWCASE_SCREENS[active].tag}</div>
            <div className="showcase-phone">
              {/* Render ALL iframes, show/hide to avoid reload flash */}
              {SHOWCASE_SCREENS.map((sc, i) => {
                const url = `/preview/index.html?screen=${sc.screen}${sc.params ? '&' + sc.params : ''}`;
                return (
                  <iframe
                    key={sc.screen}
                    src={url}
                    title={`App preview ${sc.screen}`}
                    scrolling="no"
                    style={{
                      position: i === active ? 'relative' : 'absolute',
                      opacity: i === active ? 1 : 0,
                      pointerEvents: i === active ? 'auto' : 'none',
                      transition: 'opacity 0.15s ease',
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="showcase-list">
            {SHOWCASE_SCREENS.map((sc, i) => (
              <button key={i} onClick={() => setActive(i)}>
                <span className={`s-num ${i === active ? 'active' : ''}`}>0{i + 1} /</span>
                <span className={`s-caption ${i === active ? 'active' : ''}`}>{sc.caption}</span>
                <span className="s-tag">{sc.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
