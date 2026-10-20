const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// La note « 5,0 » compte depuis zéro quand elle apparaît.
function countUp(element) {
  const target = Number(element.dataset.countTo);
  if (reducedMotion.matches || !target) return;
  const start = performance.now();
  const duration = 1200;
  const frame = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = (target * eased).toFixed(1).replace('.', ',');
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      entry.target.querySelectorAll('[data-count-to]').forEach(countUp);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}
