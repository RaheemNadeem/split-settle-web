import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Ledger from './components/Ledger'
import Features from './components/Features'
import Showcase from './components/Showcase'
import Comparison from './components/Comparison'
import CTA from './components/CTA'
import Footer from './components/Footer'

function useRevealObserver() {
  useEffect(() => {
    const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const register = () => {
      document.querySelectorAll(SELECTOR).forEach(el => {
        if (!el.classList.contains('visible') && !el.__observed) {
          el.__observed = true;
          obs.observe(el);
          // Immediately visible elements
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('visible');
            obs.unobserve(el);
          }
        }
      });
    };

    // Register on mount + re-register after renders
    register();
    const timers = [50, 200, 500, 1000, 2000].map(ms => setTimeout(register, ms));

    // Fallback scroll handler
    const onScroll = () => {
      document.querySelectorAll(SELECTOR + ':not(.visible)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 20 && r.bottom > 0) el.classList.add('visible');
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, []);
}

export default function App() {
  useRevealObserver();

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Ledger />
      <Features />
      <Showcase />
      <Comparison />
      <CTA />
      <Footer />
    </>
  );
}
