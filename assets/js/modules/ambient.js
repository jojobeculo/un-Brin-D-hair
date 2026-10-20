// Ambiance de la page : en approchant d’une section [data-ambient="dark"], le fond glisse progressivement
// du lin à l’expresso (--mix de 0 à 1, suivi du défilement), puis revient au lin en la quittant.
// Le texte passe en crème quand le fond devient sombre (classe is-dark, avec un fondu dans site.css).
// Les orbes s’animent à la première interaction : rien ne bouge pendant le chargement.
export function initAmbient() {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll('[data-ambient="dark"]')];
  if (sections.length) {
    const near = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? near.add(entry.target) : near.delete(entry.target)));
      update();
    }, { rootMargin: '50% 0px' });
    sections.forEach((section) => observer.observe(section));

    let ticking = false;
    function update() {
      ticking = false;
      const vh = innerHeight;
      let mix = 0;
      near.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Monte sur 70 % d’écran en entrant, redescend sur 70 % d’écran en sortant.
        const enter = (vh * 0.95 - rect.top) / (vh * 0.7);
        const leave = (rect.bottom - vh * 0.05) / (vh * 0.7);
        mix = Math.max(mix, Math.min(1, Math.max(0, Math.min(enter, leave))));
      });
      const eased = mix * mix * (3 - 2 * mix);
      root.style.setProperty('--mix', eased.toFixed(3));
      root.classList.toggle('is-dark', eased > 0.55);
    }
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
