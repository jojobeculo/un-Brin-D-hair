export function initMenu() {
  const menu = document.getElementById('menu');
  const opener = document.querySelector('[data-menu-open]');
  if (!menu || !opener) return;

  opener.addEventListener('click', () => menu.showModal());
  menu.querySelector('[data-menu-close]').addEventListener('click', () => menu.close());
  // Le menu se ferme, puis le navigateur suit l’ancre du lien.
  menu.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => menu.close()));
}
