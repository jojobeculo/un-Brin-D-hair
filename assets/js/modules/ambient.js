// Ambiance de la page.
// - Sections [data-ambient="dark"] : leur dégradé d’entrée et de sortie est en CSS (site.css). Ici, l’en-tête
//   passe en sombre (html.is-dark) quand il survole la partie pleine d’une de ces sections.
// - Les orbes s’animent à la première interaction : rien ne bouge pendant le chargement.
import { viewBox } from '../lib/geometry.js';

export function initAmbient() {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll('[data-ambient="dark"]')];
  if (sections.length) {
    let ticking = false;
    let fades = sections.map((section) => parseFloat(getComputedStyle(section).paddingTop) * 0.6);
    addEventListener('resize', () => {
      fades = sections.map((section) => parseFloat(getComputedStyle(section).paddingTop) * 0.6);
    });
    const update = () => {
      ticking = false;
      const line = 36;
      const dark = sections.some((section, index) => {
        const rect = viewBox(section);
        return rect.top + fades[index] < line && rect.bottom - fades[index] > line;
      });
      root.classList.toggle('is-dark', dark);
    };
    addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  const alive = () => {
    root.classList.add('is-alive');
    ['pointermove', 'scroll', 'touchstart', 'keydown'].forEach((type) => removeEventListener(type, alive));
  };
  ['pointermove', 'scroll', 'touchstart', 'keydown'].forEach((type) => addEventListener(type, alive, { passive: true }));
}
