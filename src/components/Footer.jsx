import React from 'react'

export default function Footer() {
  const cols = [
    { head: 'Product', links: [['Features', '#features'], ['The math', '#ledger'], ['Screens', '#showcase']] },
    { head: 'Company', links: [['About', '#'], ['Blog', '#']] },
    { head: 'Resources', links: [['Help center', '#'], ['Import guide', '#']] },
    { head: 'Legal', links: [['Privacy', '/privacy.html'], ['Contact', 'mailto:privacy@settle.app']] },
  ];

  return (
    <footer className="footer">
      <div className="inner">
        <div className="footer-wordmark">Split<i>·</i>Settle</div>

        <div className="footer-grid">
          <div>
            <div className="footer-quote">On the record</div>
            <p className="footer-quote-text">
              Money between friends shouldn't feel like accounting. It should feel like a rounding error on a good night.
            </p>
          </div>
          {cols.map((c, i) => (
            <div key={i} className="footer-col">
              <div className="footer-col-head">{c.head}</div>
              <ul>
                {c.links.map(([text, href]) => (
                  <li key={text}><a href={href} className="link-editorial">{text}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© 2026 Split Settle Inc.</span>
          <span>VOL. 01 · ISSUE № 2026/04 · SET IN INSTRUMENT & GEIST</span>
          <div className="footer-socials">
            <a href="#" className="link-editorial">𝕏</a>
            <a href="#" className="link-editorial">Instagram</a>
            <a href="#" className="link-editorial">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
