// Panier de la boutique (click and collect), gardé dans le navigateur : { identifiant produit: quantité }.
const KEY = 'ubdh-panier';
export const MAX_QUANTITY = 10;

function readCart() {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '{}');
    return Object.fromEntries(Object.entries(items).filter(([, qty]) => Number.isInteger(qty) && qty > 0));
  } catch {
    return {};
  }
}

// Stockage indisponible (navigation privée stricte) : le panier dure le temps de la page.
let memory = null;
const current = () => memory || readCart();

function save(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    memory = null;
  } catch {
    memory = items;
  }
  document.dispatchEvent(new CustomEvent('cart:change', { detail: items }));
}

export function setQuantity(id, qty) {
  const items = { ...current() };
  const value = Math.max(0, Math.min(MAX_QUANTITY, Math.round(qty)));
  if (value) items[id] = value;
  else delete items[id];
  save(items);
}

export const addToCart = (id) => setQuantity(id, (current()[id] || 0) + 1);
export const clearCart = () => save({});
export const cartItems = () => current();
export const cartCount = () => Object.values(current()).reduce((sum, qty) => sum + qty, 0);
