// Plan du quartier : dessin animé à l’arrivée à l’écran, et Google Maps chargé seulement sur demande
// (aucune requête vers Google avant le clic).
export function initPlan() {
  document.querySelectorAll('[data-plan]').forEach((plan) => {
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
