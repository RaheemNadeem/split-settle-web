// ─────────────────────────────────────────────
// Split Settle — landing page interactions
// ─────────────────────────────────────────────

// 1. Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// 2. Mobile menu toggle
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// 3. Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// 4. Intersection Observer — reveal animations
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => revealObs.observe(el));

// Fallback: anything already in view on load
requestAnimationFrame(() => {
  document.querySelectorAll('.reveal:not(.visible), .reveal-scale:not(.visible)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
  });
});

// 5. Split-text letter-by-letter reveal (hero title)
document.querySelectorAll('.split-text').forEach(el => {
  const text = el.getAttribute('data-text') || el.textContent;
  el.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = ch === ' ' ? ' ' : ch;
    span.style.transitionDelay = `${0.2 + i * 0.025}s`;
    el.appendChild(span);
  });
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
  }, { threshold: 0.2 });
  obs.observe(el);
});

// 6. Floating cards — reveal after hero mounts
window.addEventListener('load', () => {
  setTimeout(() => document.querySelectorAll('.float-card').forEach(c => c.classList.add('shown')), 400);
});

// 7. Parallax — elements with data-parallax
const parallaxEls = [...document.querySelectorAll('[data-parallax]')].map(el => ({
  el,
  speed: parseFloat(el.getAttribute('data-parallax')) || 0,
}));
let ticking = false;
function updateParallax() {
  parallaxEls.forEach(({ el, speed }) => {
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = (center - window.innerHeight / 2) * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
}, { passive: true });
updateParallax();

// 8. Cursor glow follower
const glow = document.getElementById('cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
  (function animate() {
    cx += (x - cx) * 0.08;
    cy += (y - cy) * 0.08;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  })();
} else if (glow) {
  glow.style.display = 'none';
}

// 9. Feature card radial-glow hover
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  });
});

// 11. Step 1 — typing amount
const step1Amount = document.getElementById('step1-amount');
if (step1Amount) {
  const text = '$48.00';
  let i = 0;
  setInterval(() => {
    i = i >= text.length ? 0 : i + 1;
    step1Amount.textContent = text.slice(0, i) || ' ';
  }, 400);
}

// 12. Step 3 — settle pulse
const step3Circle = document.getElementById('step3-circle');
const step3Icon = document.getElementById('step3-icon');
const step3Text = document.getElementById('step3-text');
const step3Sub = document.getElementById('step3-sub');
if (step3Circle) {
  let settled = false;
  setInterval(() => {
    settled = !settled;
    step3Circle.classList.toggle('settled', settled);
    step3Text.classList.toggle('settled', settled);
    step3Text.textContent = settled ? 'All settled!' : 'Send request';
    step3Sub.textContent = settled ? 'Zero balances' : 'Tap to notify Maya';
    step3Icon.innerHTML = settled
      ? '<path d="M9 16l5 5 9-9" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M16 8v16M8 16h16" stroke="white" stroke-width="3" stroke-linecap="round"/>';
  }, 2500);
}

// 13. Interactive expense split demo
const slider = document.getElementById('demo-slider');
const totalEl = document.getElementById('demo-total');
const footer = document.getElementById('demo-footer');
const amtEls = [0, 1, 2, 3].map(i => document.getElementById(`demo-amt-${i}`));
function updateDemo() {
  const total = Number(slider.value);
  const per = (total / 4);
  totalEl.textContent = `$${total.toFixed(2)}`;
  amtEls.forEach(el => { if (el) el.textContent = `$${per.toFixed(2)}`; });
  footer.textContent = `Each person pays $${per.toFixed(2)} — fair and square`;
  const pct = ((total - 20) / 480) * 100;
  slider.style.background = `linear-gradient(90deg, var(--accent) ${pct}%, var(--line) ${pct}%)`;
}
if (slider) {
  slider.addEventListener('input', updateDemo);
  updateDemo();
}

// 14. Live preview nav — swap iframe src between screens
const previewFrame = document.getElementById('preview-frame');
const previewNav = document.getElementById('preview-nav');
const previewLabel = document.getElementById('preview-label');
const previewSub = document.getElementById('preview-sub');
if (previewFrame && previewNav) {
  const pills = [...previewNav.querySelectorAll('.preview-pill')];

  function setPreview(pill) {
    pills.forEach(p => p.classList.toggle('active', p === pill));
    const screen = pill.dataset.screen;
    const extra = pill.dataset.params ? `&${pill.dataset.params}` : '';
    previewFrame.src = `/preview/index.html?screen=${encodeURIComponent(screen)}${extra}`;
    if (previewLabel) previewLabel.textContent = pill.dataset.label || '';
    if (previewSub) previewSub.textContent = pill.dataset.sub || '';
  }

  pills.forEach(pill => pill.addEventListener('click', () => setPreview(pill)));
}
