// Mouvements liés au défilement (en-tête, barre de progression, fond de l’accueil, parallaxe des photos)
// et effets au clic : onde dans les boutons, onde dorée sous le doigt.
import { calm } from '../lib/motion-pref.js';

function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  let last = scrollY;
  return () => {
    const y = scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    header.style.setProperty('--scroll', (y / max).toFixed(4));
    header.classList.toggle('is-scrolled', y > 8);
    // Caché quand on descend, visible dès qu’on remonte (sauf si un sous-menu a le focus).
    const hide = y > 480 && y > last + 4 && !header.contains(document.activeElement);
    if (hide) header.classList.add('is-hidden');
    else if (y < last - 4 || y <= 480) header.classList.remove('is-hidden');
    last = y;
  };
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  return () => {
    const progress = Math.min(1, Math.max(0, scrollY / hero.offsetHeight));
    hero.style.setProperty('--hero-p', progress.toFixed(3));
  };
}

function initParallax() {
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
  }, { rootMargin: '10% 0px' });
  document.querySelectorAll('[data-parallax]').forEach((element) => observer.observe(element));
  return () => {
    const vh = innerHeight;
    visible.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - vh / 2) / vh;
      element.style.setProperty('--p', Math.max(-1, Math.min(1, offset)).toFixed(3));
    });
  };
}

function initClicks() {
  document.addEventListener('pointerdown', (event) => {
    // Onde dorée sous le doigt (la souris a déjà la sienne, dessinée par le curseur).
    if (event.pointerType !== 'mouse' && !event.target.closest('input, textarea, select')) {
      const tap = document.createElement('span');
      tap.className = 'tap';
      tap.setAttribute('aria-hidden', 'true');
      tap.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      document.body.append(tap);
      tap.addEventListener('animationend', () => tap.remove());
    }
    const target = event.target.closest('.btn, .dock__main');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.setProperty('--x', `${event.clientX - rect.left}px`);
    ripple.style.setProperty('--y', `${event.clientY - rect.top}px`);
    ripple.style.setProperty('--size', `${Math.max(rect.width, rect.height) * 2.2}px`);
    target.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

export function initMotion() {
  initClicks();
  const tasks = [initHeader()];
  if (!calm()) tasks.push(initHero(), initParallax());
  const active = tasks.filter(Boolean);
  let ticking = false;
  const run = () => {
    ticking = false;
    active.forEach((task) => task());
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(run);
    }
  }, { passive: true });
  run();
}
