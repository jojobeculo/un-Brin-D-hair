const INTERACTIVE = 'a, button, label, summary, [role="button"], input[type="checkbox"], input[type="radio"], input[type="range"], .compare__frame';
const NATIVE = 'input[type="text"], input[type="tel"], input[type="email"], textarea, select';
// Fonds foncés (menu, pied de page, barre de résumé) : le curseur passe en clair.
const DARK = '.menu, .footer, .booking__summary, .toast';
const SMOOTHING = 0.2;

// Curseur personnalisé : un point précis et un anneau qui le suit, plus grand sur les éléments cliquables.
// Réservé aux souris : les écrans tactiles gardent leur comportement habituel.
export function initCursor() {
  if (!matchMedia('(pointer: fine) and (hover: hover)').matches) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const root = document.createElement('div');
  root.className = 'cursor';
  root.setAttribute('aria-hidden', 'true');
  const ring = document.createElement('span');
  ring.className = 'cursor__ring';
  const label = document.createElement('span');
  label.className = 'cursor__label';
  ring.append(label);
  const dot = document.createElement('span');
  dot.className = 'cursor__dot';
  root.append(ring, dot);

  // Les boîtes de dialogue (menu, réservation) passent par-dessus la page : le curseur doit
  // être dans la même couche, donc un popover, ré-affiché à chaque ouverture de dialogue.
  const popover = 'popover' in HTMLElement.prototype;
  if (popover) root.popover = 'manual';
  document.body.append(root);
  const bringToFront = () => {
    if (!popover) return;
    try {
      root.hidePopover();
    } catch {
      // Déjà masqué.
    }
    root.showPopover();
  };
  bringToFront();
  const dialogs = new MutationObserver(bringToFront);
  document.querySelectorAll('dialog').forEach((dialog) => dialogs.observe(dialog, { attributes: true, attributeFilter: ['open'] }));

  document.documentElement.classList.add('has-cursor');

  let x = -100;
  let y = -100;
  let ringX = x;
  let ringY = y;
  let frame = 0;

  const paint = () => {
    frame = 0;
    if (reducedMotion.matches) {
      ringX = x;
      ringY = y;
    } else {
      ringX += (x - ringX) * SMOOTHING;
      ringY += (y - ringY) * SMOOTHING;
    }
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (Math.abs(x - ringX) > 0.1 || Math.abs(y - ringY) > 0.1) frame = requestAnimationFrame(paint);
  };

  const classify = (target) => {
    const element = target instanceof Element ? target : null;
    root.classList.toggle('is-native', Boolean(element?.closest(NATIVE)));
    root.classList.toggle('is-active', Boolean(element?.closest(INTERACTIVE)));
    root.classList.toggle('is-light', Boolean(element?.closest(DARK)));
    const labelled = element?.closest('[data-cursor]');
    label.textContent = labelled ? labelled.dataset.cursor : '';
    root.classList.toggle('has-label', Boolean(labelled));
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    x = event.clientX;
    y = event.clientY;
    if (!root.classList.contains('is-visible')) {
      ringX = x;
      ringY = y;
      root.classList.add('is-visible');
    }
    classify(event.target);
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });
  document.addEventListener('pointerdown', () => root.classList.add('is-pressed'));
  document.addEventListener('pointerup', () => root.classList.remove('is-pressed'));
  document.documentElement.addEventListener('pointerleave', () => root.classList.remove('is-visible'));
  window.addEventListener('blur', () => root.classList.remove('is-visible'));
}
