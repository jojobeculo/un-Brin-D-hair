// Plan du quartier : dessin animé à l’arrivée à l’écran, et Google Maps chargé seulement sur demande
// (aucune requête vers Google avant le clic).
export function initPlan() {
  document.querySelectorAll('[data-plan]').forEach((plan) => {
    // Le fond de plan (52 Ko) ne se charge qu’à l’approche de la carte.
    const base = plan.querySelector('[data-href]');
    const loader = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      base.setAttribute('href', base.dataset.href);
      loader.disconnect();
    }, { rootMargin: '600px 0px' });
    loader.observe(plan);
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        plan.classList.add('is-in');
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(plan);

    plan.querySelector('[data-plan-google]')?.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = plan.dataset.embed;
      frame.title = 'Google Maps : Un Brun d’Hair à Aubière';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      plan.prepend(frame);
      plan.classList.add('is-google');
    });
  });
}
