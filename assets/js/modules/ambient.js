// Ambiance de la page.
// - Sections [data-ambient="dark"] : leur dégradé d’entrée et de sortie est en CSS (site.css). Ici, l’en-tête
//   passe en sombre (html.is-dark) quand il survole la partie pleine d’une de ces sections.
// - Les orbes s’animent à la première interaction : rien ne bouge pendant le chargement.
export function initAmbient() {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll('[data-ambient="dark"]')];
  if (sections.length) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = 36;
      const dark = sections.some((section) => {
        const rect = section.getBoundingClientRect();
        const fade = parseFloat(getComputedStyle(section).paddingTop) * 0.6;
        return rect.top + fade < line && rect.bottom - fade > line;
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
