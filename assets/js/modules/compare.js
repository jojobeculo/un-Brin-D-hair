// Comparateur avant / après : glisser sur l’image, ou flèches du clavier sur le curseur.
export function initCompare() {
  document.querySelectorAll('[data-compare]').forEach((figure) => {
    const frame = figure.querySelector('.compare__frame');
    const range = figure.querySelector('.compare__range');

    const set = (value) => {
      const position = Math.min(100, Math.max(0, value));
      frame.style.setProperty('--pos', `${position}%`);
      range.value = String(Math.round(position));
    };
    const follow = (event) => {
      const rect = frame.getBoundingClientRect();
      set(((event.clientX - rect.left) / rect.width) * 100);
    };
    const stop = () => figure.classList.remove('is-dragging');

    range.addEventListener('input', () => set(Number(range.value)));
    frame.addEventListener('pointerdown', (event) => {
      frame.setPointerCapture(event.pointerId);
      figure.classList.add('is-dragging');
      // Au doigt, on attend le glissement : un simple appui peut être le début d’un défilement.
      if (event.pointerType === 'mouse') follow(event);
    });
    frame.addEventListener('pointermove', (event) => {
      if (frame.hasPointerCapture(event.pointerId)) follow(event);
    });
    frame.addEventListener('pointerup', stop);
    frame.addEventListener('pointercancel', stop);
  });
}
