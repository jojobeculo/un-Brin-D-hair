// Rubans vivants, sur ordinateur comme sur téléphone : ils se vrillent au défilement et s’élargissent
// en s’illuminant près de la souris ou du doigt.
// Coût maîtrisé : positions en cache (geometry.js), ruban de fond déplacé par la carte graphique seulement,
// tracés recalculés au plus 30 fois par seconde en qualité allégée, et figés en qualité essentielle.
import { ribbonPaths, RIBBONS } from '../lib/ribbon.js';
import { calm } from '../lib/motion-pref.js';
import { viewBox } from '../lib/geometry.js';
import { perfLevel, sampleFrame } from '../lib/perf.js';

const lerp = (from, to, amount) => from + (to - from) * amount;

export function initRibbonLive() {
  const ribbons = [...document.querySelectorAll('[data-ribbon]:not([data-ribbon="backdrop"])')];
  const backdrop = document.querySelector('.backdrop');
  const hero = document.querySelector('[data-hero]');
  const pointer = { x: -9999, y: -9999, until: 0 };
  const visible = new Set();
  const states = new Map();
  let running = false;
  let lastDraw = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
    wake();
  });
  ribbons.forEach((element) => observer.observe(element));

  function frame(now) {
    const level = perfLevel();
    const vh = innerHeight;
    // Ruban de fond et monogramme : seulement des variables lues par des transformations (aucun nouveau tracé).
    if (backdrop) {
      const progress = scrollY / Math.max(1, document.documentElement.scrollHeight - vh);
      if (level === 'high' && !calm()) backdrop.style.setProperty('--page-p', progress.toFixed(3));
      const opacity = hero ? Math.min(1, Math.max(0, (scrollY - vh * 0.45) / (vh * 0.5))) : 1;
      backdrop.style.setProperty('--backdrop-o', opacity.toFixed(2));
    }
    const near = now < pointer.until;
    const throttle = level === 'high' ? 0 : 33;
    let active = false;
    if (level !== 'min' && now - lastDraw >= throttle) {
      lastDraw = now;
      visible.forEach((element) => {
        const shape = RIBBONS[element.dataset.ribbon];
        const rect = viewBox(element);
        const state = states.get(element) || { phase: 0, strength: 0, x: 720, y: 450, key: '' };
        states.set(element, state);
        const scale = Math.max(rect.width / 1440, rect.height / 900);
        const x = (pointer.x - rect.left - (rect.width - 1440 * scale) / 2) / scale;
        const y = (pointer.y - rect.top - (rect.height - 900 * scale) / 2) / scale;
        const inside = near && pointer.y > rect.top && pointer.y < rect.bottom;
        // Vrille au défilement en qualité complète ; ailleurs, le ruban ne réagit qu’à la souris ou au doigt.
        const phaseTarget = level === 'high' ? ((rect.top + rect.height / 2 - vh / 2) / vh) * 2.4 : state.phase;
        state.phase = lerp(state.phase, phaseTarget, 0.1);
        state.strength = lerp(state.strength, inside ? 1 : 0, 0.1);
        if (inside) {
          state.x = lerp(state.x, x, 0.18);
          state.y = lerp(state.y, y, 0.18);
        }
        const key = `${state.phase.toFixed(2)}|${state.strength.toFixed(2)}|${Math.round(state.x / 4)}|${Math.round(state.y / 4)}`;
        if (key === state.key) return;
        state.key = key;
        active = true;
        const paths = ribbonPaths(shape.points, { ...shape, phase: state.phase, samples: level === 'high' ? 72 : 40, pointer: { x: state.x, y: state.y, radius: 260, strength: state.strength * 0.55 } });
        element.querySelectorAll('path').forEach((node, index) => node.setAttribute('d', paths[index]));
        const light = element.querySelector('radialGradient');
        light.setAttribute('cx', state.x.toFixed(0));
        light.setAttribute('cy', state.y.toFixed(0));
        light.setAttribute('r', (700 - state.strength * 420).toFixed(0));
      });
    } else if (level !== 'min') {
      active = true;
    }
    if (active) sampleFrame(now);
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
  addEventListener('pointermove', (event) => track(event.clientX, event.clientY, event.pointerType === 'mouse' ? 1200 : 900), { passive: true });
  addEventListener('touchmove', (event) => track(event.touches[0].clientX, event.touches[0].clientY, 900), { passive: true });
  addEventListener('scroll', wake, { passive: true });
  wake();
}
