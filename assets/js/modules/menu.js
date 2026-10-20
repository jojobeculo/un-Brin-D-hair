// Menu plein écran (mobile et tablette).
export function initMenu() {
  const menu = document.getElementById('menu');
  const opener = document.querySelector('[data-menu-open]');
  if (!menu || !opener) return;

  opener.addEventListener('click', () => menu.showModal());
  menu.querySelector('[data-menu-close]').addEventListener('click', () => menu.close());
  // Une ancre de la page en cours : le menu se ferme avant de défiler.
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu.close()));
  // Clic sur le fond (hors du contenu) : fermeture.
  menu.addEventListener('click', (event) => {
    if (event.target === menu) menu.close();
  });
}
