// Comparateur avant / après : glisser sur l’image (souris ou doigt), ou flèches du clavier sur le curseur.
// À la première apparition, la ligne fait un aller-retour pour montrer que l’image se glisse.
import { calm } from '../lib/motion-pref.js';

export function initCompare() {
  document.querySelectorAll('[data-compare]').forEach((figure) => {
    const frame = figure.querySelector('.compare__frame');
    const range = figure.querySelector('.compare__range');
    let touched = false;

    const set = (value) => {
      const position = Math.min(100, Math.max(0, value));
      frame.style.setProperty('--pos', `${position}%`);
      range.value = String(Math.round(position));
    };
    const follow = (event) => {
      const rect = frame.getBoundingClientRect();
      set(((event.clientX - rect.left) / rect.width) * 100);
    };
    const touch = () => {
      touched = true;
      figure.classList.add('is-touched');
    };

    range.addEventListener('input', () => {
      touch();
      set(Number(range.value));
    });
    frame.addEventListener('pointerdown', (event) => {
      touch();
      frame.setPointerCapture(event.pointerId);
      figure.classList.add('is-dragging');
      // Au doigt, on attend le glissement : un simple appui peut être le début d’un défilement.
      if (event.pointerType === 'mouse') follow(event);
    });
    frame.addEventListener('pointermove', (event) => {
      if (frame.hasPointerCapture(event.pointerId)) follow(event);
    });
    const stop = () => figure.classList.remove('is-dragging');
    frame.addEventListener('pointerup', stop);
    frame.addEventListener('pointercancel', stop);

    if (calm()) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now) => {
        if (touched) return;
        const t = Math.min(1, (now - start) / 1800);
        set(50 + Math.sin(t * Math.PI * 2) * 22 * (1 - t));
        if (t < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 500);
    }, { threshold: 0.6 });
    observer.observe(frame);
  });
}
