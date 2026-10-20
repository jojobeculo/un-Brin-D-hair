const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Découpe un texte en lettres, chacune avec sa position (--i, à partir de `start`), pour les animer en cascade.
// Les lettres d’un même mot restent groupées : un mot ne se coupe jamais en fin de ligne.
// Renvoie la position qui suit la dernière lettre.
function splitChars(element, start = 0) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  let index = start;
  texts.forEach((node) => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (!part.trim()) {
        fragment.append(part);
        return;
      }
      const word = document.createElement('span');
      word.className = 'split-word';
      [...part].forEach((char) => {
        const letter = document.createElement('span');
        letter.className = 'split-char';
        letter.style.setProperty('--i', index);
        index += 1;
        letter.textContent = char;
        word.append(letter);
      });
      fragment.append(word);
    });
    node.replaceWith(fragment);
  });
  element.classList.add('is-split');
  return index;
}

// Seules les lignes visibles du titre sont découpées : les lecteurs d’écran lisent son texte masqué.
function splitHeroTitle() {
  const title = document.querySelector('.hero__title');
  if (!title) return;
  let index = 0;
  title.querySelectorAll('.line').forEach((line) => {
    index = splitChars(line, index);
  });
  title.classList.add('is-split');
}

// Les bandeaux défilants accélèrent avec le défilement de la page, suivent son sens et s’inclinent.
function marqueeVelocity() {
  const marquees = [...document.querySelectorAll('.marquee')]
    .map((element) => ({ element, animation: element.querySelector('.marquee__track')?.getAnimations()[0] }))
    .filter((marquee) => marquee.animation);
  if (!marquees.length) return;

  let lastY = window.scrollY;
  let velocity = 0;
  let direction = 1;
  let frame = 0;

  const tick = () => {
    const y = window.scrollY;
    velocity += (y - lastY - velocity) * 0.2;
    lastY = y;
    if (Math.abs(velocity) > 0.5) direction = Math.sign(velocity);
    const speed = 1 + Math.min(Math.abs(velocity) / 10, 4);
    const skew = Math.max(-10, Math.min(10, velocity * -0.35));
    marquees.forEach(({ element, animation }) => {
      animation.updatePlaybackRate(direction * speed);
      element.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
    });
    if (Math.abs(velocity) > 0.05) {
      frame = requestAnimationFrame(tick);
    } else {
      frame = 0;
      marquees.forEach(({ element, animation }) => {
        animation.updatePlaybackRate(direction);
        element.style.setProperty('--skew', '0deg');
      });
    }
  };

  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: true });
}

export function initMotion() {
  if (reducedMotion.matches) return;
  splitHeroTitle();
  const footerMark = document.querySelector('.footer__mark');
  if (footerMark) splitChars(footerMark);
  marqueeVelocity();
}
