// Ambiance de la page : fond lin qui glisse vers l’expresso quand une section [data-ambient="dark"]
// occupe le milieu de l’écran (transition des couleurs dans site.css), et orbes qui s’animent
// à la première interaction (rien ne bouge pendant le chargement).
export function initAmbient() {
  const root = document.documentElement;
  const sections = document.querySelectorAll('[data-ambient="dark"]');
  if (sections.length) {
    const inside = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? inside.add(entry.target) : inside.delete(entry.target)));
      root.classList.toggle('is-dark', inside.size > 0);
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  const alive = () => {
    root.classList.add('is-alive');
    ['pointermove', 'scroll', 'touchstart', 'keydown'].forEach((type) => removeEventListener(type, alive));
  };
  ['pointermove', 'scroll', 'touchstart', 'keydown'].forEach((type) => addEventListener(type, alive, { passive: true }));
}
