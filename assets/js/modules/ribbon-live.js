// Rubans vivants, sur ordinateur comme sur téléphone : ils se vrillent au défilement
// et s’élargissent en s’illuminant près de la souris ou du doigt. Le ruban de fond (.backdrop) suit toute la page.
import { ribbonPaths, RIBBONS } from '../lib/ribbon.js';
import { calm } from '../lib/motion-pref.js';

const lerp = (from, to, amount) => from + (to - from) * amount;

export function initRibbonLive() {
  const ribbons = [...document.querySelectorAll('[data-ribbon]')];
  if (!ribbons.length) return;
  const backdrop = document.querySelector('.backdrop');
  const hero = document.querySelector('[data-hero]');
  const pointer = { x: -9999, y: -9999, until: 0 };
  const visible = new Set();
  const states = new Map();
  let running = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
    wake();
  });
  ribbons.forEach((element) => observer.observe(element));

  function frame(now) {
    let active = false;
    const vh = innerHeight;
    const pageProgress = scrollY / Math.max(1, document.documentElement.scrollHeight - vh);
    if (backdrop) {
      backdrop.style.setProperty('--page-p', calm() ? '0' : pageProgress.toFixed(4));
      const opacity = hero ? Math.min(1, Math.max(0, (scrollY - vh * 0.45) / (vh * 0.5))) : 1;
      backdrop.style.setProperty('--backdrop-o', opacity.toFixed(3));
    }
    const near = now < pointer.until;
    visible.forEach((element) => {
      const name = element.dataset.ribbon;
      const shape = RIBBONS[name];
      const svg = element.querySelector('svg');
      const rect = svg.getBoundingClientRect();
      const state = states.get(element) || { phase: 0, strength: 0, x: 720, y: 450, key: '' };
      states.set(element, state);
      const scale = Math.max(rect.width / 1440, rect.height / 900);
      const x = (pointer.x - rect.left - (rect.width - 1440 * scale) / 2) / scale;
      const y = (pointer.y - rect.top - (rect.height - 900 * scale) / 2) / scale;
      const inside = near && pointer.y > rect.top && pointer.y < rect.bottom;
      const phaseTarget = name === 'backdrop' ? pageProgress * 5 : ((rect.top + rect.height / 2 - vh / 2) / vh) * 2.4;
      state.phase = lerp(state.phase, phaseTarget, 0.08);
      state.strength = lerp(state.strength, inside ? 1 : 0, 0.07);
      state.x = lerp(state.x, inside ? x : state.x, 0.14);
      state.y = lerp(state.y, inside ? y : state.y, 0.14);
      const key = `${state.phase.toFixed(3)}|${state.strength.toFixed(3)}|${state.x.toFixed(0)}|${state.y.toFixed(0)}`;
      if (key === state.key) return;
      state.key = key;
      active = true;
      const paths = ribbonPaths(shape.points, { ...shape, phase: state.phase, pointer: { x: state.x, y: state.y, radius: 260, strength: state.strength * 0.55 } });
      element.querySelectorAll('path').forEach((node, index) => node.setAttribute('d', paths[index]));
      const light = element.querySelector('radialGradient');
      light.setAttribute('cx', state.x.toFixed(0));
      light.setAttribute('cy', state.y.toFixed(0));
      light.setAttribute('r', (700 - state.strength * 420).toFixed(0));
      element.style.setProperty('--ribbon-w', (1.15 + state.strength * 1.1).toFixed(2));
    });
    running = active || near;
    if (running) requestAnimationFrame(frame);
  }

  function wake() {
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  const track = (x, y, duration) => {
    pointer.x = x;
    pointer.y = y;
    pointer.until = performance.now() + duration;
    wake();
  };
  addEventListener('pointermove', (event) => track(event.clientX, event.clientY, event.pointerType === 'mouse' ? 1500 : 900), { passive: true });
  addEventListener('touchmove', (event) => track(event.touches[0].clientX, event.touches[0].clientY, 900), { passive: true });
  addEventListener('scroll', wake, { passive: true });
  wake();
}
