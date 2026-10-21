// Positions des éléments dans la page, mises en cache : les animations n’interrogent jamais la mise en page
// pendant une image (c’est ce qui fait ramer les ordinateurs modestes). Le cache se vide quand la page change
// de taille (fenêtre, polices, images, contenu).
const cache = new Map();
let dirty = true;
const invalidate = () => {
  dirty = true;
};

addEventListener('resize', invalidate);
addEventListener('load', invalidate);
document.fonts?.ready.then(invalidate);
if ('ResizeObserver' in window) new ResizeObserver(invalidate).observe(document.documentElement);

// { top, left, width, height } dans la page (et non dans la fenêtre).
export function box(element) {
  if (dirty) {
    cache.clear();
    dirty = false;
  }
  let value = cache.get(element);
  if (!value) {
    const rect = element.getBoundingClientRect();
    value = { top: rect.top + scrollY, left: rect.left + scrollX, width: rect.width, height: rect.height };
    cache.set(element, value);
  }
  return value;
}

// Même chose, ramenée à la fenêtre : { top, bottom, left, width, height }.
export function viewBox(element) {
  const value = box(element);
  const top = value.top - scrollY;
  return { top, bottom: top + value.height, left: value.left - scrollX, width: value.width, height: value.height };
}
