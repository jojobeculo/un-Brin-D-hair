// Apparitions au défilement : blocs [data-reveal], titres découpés en mots [data-split],
// phrase qui s’éclaire mot à mot [data-words], compteurs [data-count] et traits [data-reveal-line].
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Enveloppe chaque mot d’un élément dans <span class="w"><span>…</span></span>, sans toucher aux balises (em, br…).
function splitWords(element, className) {
  let index = 0;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/([ \t\n\r]+)/).forEach((part) => {
      if (!part) return;
      if (/^[ \t\n\r]+$/.test(part)) {
        fragment.append(part);
        return;
      }
      const outer = document.createElement('span');
      outer.className = className;
      if (className === 'w') {
        const inner = document.createElement('span');
        inner.textContent = part;
        inner.style.setProperty('--d', String(index));
        outer.append(inner);
      } else {
        outer.textContent = part;
      }
      index += 1;
      fragment.append(outer);
    });
    node.replaceWith(fragment);
  });
  return index;
}

function countUp(element) {
  const target = Number(element.dataset.count);
  const decimals = element.dataset.count.includes('.') ? 1 : 0;
  const format = (value) => value.toFixed(decimals).replace('.', ',');
  if (reduced || !Number.isFinite(target)) return;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 1100);
    element.textContent = format(target * (1 - (1 - t) ** 3));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function litWords(container) {
  const words = [...container.querySelectorAll('.sw')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = container.getBoundingClientRect();
    const vh = innerHeight;
    const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.55)));
    const lit = Math.ceil(progress * words.length);
    words.forEach((word, index) => word.classList.toggle('is-lit', index < lit));
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) addEventListener('scroll', onScroll, { passive: true });
    else removeEventListener('scroll', onScroll);
    update();
  });
  observer.observe(container);
}

export function initReveal() {
  document.querySelectorAll('[data-split]').forEach((element) => {
    splitWords(element, 'w');
    element.classList.add('split');
  });
  document.querySelectorAll('[data-words]').forEach((element) => {
    splitWords(element, 'sw');
    if (!reduced) litWords(element);
  });

  // Le titre principal s’anime dès le chargement.
  requestAnimationFrame(() => document.querySelectorAll('[data-split="load"]').forEach((element) => element.classList.add('is-in')));

  const targets = document.querySelectorAll('[data-reveal], [data-split]:not([data-split="load"]), [data-reveal-line], [data-count], .ribbon');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      if (entry.target.dataset.count) countUp(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  targets.forEach((element) => observer.observe(element));
}
