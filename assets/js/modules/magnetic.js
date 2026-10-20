// Les grands boutons ronds suivent légèrement la souris.
export function initMagnetic() {
  if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mx', `${(event.clientX - rect.left - rect.width / 2) * 0.25}px`);
      button.style.setProperty('--my', `${(event.clientY - rect.top - rect.height / 2) * 0.25}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.removeProperty('--mx');
      button.style.removeProperty('--my');
    });
  });
}
