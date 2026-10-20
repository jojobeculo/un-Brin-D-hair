// Le bouton flottant « Réserver » s’efface là où la page propose déjà de réserver (bouton du hero, carte, formulaires…).
export function initFab() {
  const fab = document.querySelector('[data-fab]');
  const zones = document.querySelectorAll('.hero__actions, #carte, #reserver, #flash, #offrir, #venir, .footer');
  if (!fab || !zones.length) return;

  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    fab.classList.toggle('is-visible', visible.size === 0);
  });
  zones.forEach((zone) => observer.observe(zone));
}
