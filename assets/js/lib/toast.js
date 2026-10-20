let timer;

// Message bref. Une boîte de dialogue ouverte masque la page : on utilise alors son propre conteneur.
export function toast(message) {
  const element = document.querySelector('dialog[open] [data-toast]') || document.querySelector('body > [data-toast]');
  if (!element) return;
  element.textContent = message;
  element.classList.add('is-visible');
  clearTimeout(timer);
  timer = setTimeout(() => element.classList.remove('is-visible'), 4500);
}
