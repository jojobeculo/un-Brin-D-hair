import { addToCart, cartCount } from '../lib/cart.js';
import { readSalonData } from '../lib/data.js';
import { toast } from '../lib/toast.js';

// Pastille du panier dans l’en-tête, et boutons « Ajouter au panier » présents sur toutes les pages.
export function initCartBadge() {
  const link = document.querySelector('[data-cart-link]');
  const count = document.querySelector('[data-cart-count]');

  const update = (bump) => {
    const total = cartCount();
    if (!link) return;
    link.hidden = total === 0;
    count.textContent = String(total);
    if (bump) {
      link.classList.remove('is-bump');
      requestAnimationFrame(() => link.classList.add('is-bump'));
    }
  };

  document.addEventListener('cart:change', () => update(true));
  window.addEventListener('storage', () => update(false));
  update(false);

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;
    addToCart(button.dataset.addToCart);
    const onShop = document.querySelector('[data-shop]');
    toast(`${button.dataset.name || 'Le produit'} est dans votre panier.`, onShop ? null : { href: `${readSalonData().settings.boutique}#panier`, label: 'Voir le panier' });
  });
}
