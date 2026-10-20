let timer;

// Message bref en bas de l’écran. `link` : { href, label } facultatif.
export function toast(message, link) {
  const element = document.querySelector('body > [data-toast]');
  if (!element) return;
  element.textContent = message;
  if (link) {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.label;
    element.append(anchor);
  }
  element.classList.add('is-visible');
  clearTimeout(timer);
  timer = setTimeout(() => element.classList.remove('is-visible'), 5000);
}
