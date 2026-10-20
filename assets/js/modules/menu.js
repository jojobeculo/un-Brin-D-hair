export function initMenu() {
  const menu = document.getElementById('menu');
  const opener = document.querySelector('[data-menu-open]');
  if (!menu || !opener) return;

  opener.addEventListener('click', () => menu.showModal());
  menu.querySelector('[data-menu-close]').addEventListener('click', () => menu.close());
  // Le menu se ferme avant de suivre une ancre ou d’ouvrir le tunnel de réservation.
  menu.querySelectorAll('a[href^="#"], [data-book]').forEach((link) => link.addEventListener('click', () => menu.close()));
}
