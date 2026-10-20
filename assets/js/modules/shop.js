// Boutique : filtres par besoin, panier, et commande en click and collect
// (paiement Stripe si la fonction de paiement est configurée, sinon demande envoyée au salon).
import { readSalonData } from '../lib/data.js';
import { cartItems, setQuantity, clearCart, MAX_QUANTITY } from '../lib/cart.js';
import { bottleSvg } from '../lib/bottle.js';
import { validateForm } from '../lib/forms.js';
import { sendRequest } from '../lib/channel.js';
import { toast } from '../lib/toast.js';

const euros = (value) => `${value.toFixed(2).replace('.', ',')}\u00a0€`;
const escapeHtml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const DONE_MESSAGES = {
  endpoint: 'Votre commande est bien partie. Sandy la prépare et vous prévient dès qu’elle est prête à retirer au salon.',
  sms: 'Votre application SMS s’est ouverte avec la commande pré-remplie : il ne reste qu’à l’envoyer.',
  email: 'Votre messagerie s’est ouverte avec la commande pré-remplie : il ne reste qu’à l’envoyer.',
  instagram: 'Votre commande est copiée : collez-la dans la conversation Instagram qui vient de s’ouvrir, puis envoyez-la.',
};

function initFilters() {
  const buttons = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('.product');
  const live = document.querySelector('[data-filter-live]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const need = button.dataset.filter;
    buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    let shown = 0;
    items.forEach((item) => {
      item.hidden = Boolean(need) && !item.dataset.needs.split(' ').includes(need);
      if (!item.hidden) shown += 1;
    });
    live.textContent = `${shown} produit${shown > 1 ? 's' : ''} affiché${shown > 1 ? 's' : ''}`;
  }));
}

export function initShop() {
  const { shop, settings } = readSalonData();
  const catalog = new Map(shop.products.map((product) => [product.id, product]));
  const linesBox = document.querySelector('[data-cart-lines]');
  const totalBox = document.querySelector('[data-cart-total]');
  const form = document.querySelector('[data-checkout]');
  const done = document.querySelector('[data-checkout-done]');
  initFilters();

  const lines = () => Object.entries(cartItems())
    .map(([id, quantity]) => ({ product: catalog.get(id), quantity }))
    .filter((line) => line.product);

  function render() {
    const list = lines();
    const total = list.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
    linesBox.innerHTML = list.length
      ? list.map(({ product, quantity }) => `<div class="cart__line">
          ${bottleSvg(product, product.tint)}
          <div><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(product.size)} · ${euros(product.price)}</span></div>
          <div class="qty" role="group" aria-label="Quantité : ${escapeHtml(product.name)}">
            <button type="button" data-step="-1" data-id="${product.id}" aria-label="Retirer un">−</button>
            <output aria-live="polite">${quantity}</output>
            <button type="button" data-step="1" data-id="${product.id}" aria-label="Ajouter un"${quantity >= MAX_QUANTITY ? ' disabled' : ''}>+</button>
          </div>
        </div>`).join('')
      : '<p class="cart__empty">Votre panier est vide. <a href="#produits">Voir les produits</a></p>';
    totalBox.hidden = !list.length;
    totalBox.innerHTML = `<span>Total TTC, à retirer au salon</span><strong>${euros(total)}</strong>`;
    if (done.hidden) form.hidden = !list.length;
  }

  linesBox.addEventListener('click', (event) => {
    const button = event.target.closest('[data-step]');
    if (!button) return;
    const current = cartItems()[button.dataset.id] || 0;
    setQuantity(button.dataset.id, current + Number(button.dataset.step));
  });
  document.addEventListener('cart:change', render);
  addEventListener('storage', render);

  // Retour de la page de paiement Stripe.
  const params = new URLSearchParams(location.search);
  if (params.get('commande') === 'merci') {
    clearCart();
    form.hidden = true;
    done.hidden = false;
    done.querySelector('[data-checkout-message]').textContent = 'Votre paiement est confirmé. Sandy prépare votre commande et vous prévient dès qu’elle est prête à retirer au salon.';
    history.replaceState(null, '', `${location.pathname}#panier`);
    document.getElementById('panier').scrollIntoView();
    done.focus();
  } else if (params.get('commande') === 'annulee') {
    toast('Paiement annulé : votre panier est conservé.');
    history.replaceState(null, '', `${location.pathname}#panier`);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const list = lines();
    if (!list.length) return;
    const fields = Object.fromEntries(new FormData(form));
    const submit = form.querySelector('[data-checkout-submit]');
    submit.disabled = true;
    try {
      if (fields.paiement === 'en-ligne' && shop.checkoutEndpoint) {
        const response = await fetch(shop.checkoutEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: list.map(({ product, quantity }) => ({ id: product.id, quantity })),
            customer: { firstName: fields.prenom, lastName: fields.nom, phone: fields.telephone, email: fields.email, note: fields.message },
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.url) throw new Error(result.error || `Paiement indisponible (${response.status})`);
        location.href = result.url;
        return;
      }
      const total = list.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
      const text = [
        'Commande click and collect — Un Brun d’Hair',
        `Client : ${fields.prenom} ${fields.nom}`,
        `Téléphone : ${fields.telephone}`,
        `E-mail : ${fields.email}`,
        ...list.map(({ product, quantity }) => `• ${quantity} × ${product.name} (${product.size}) : ${euros(product.price * quantity)}`),
        `Total : ${euros(total)}, paiement au retrait`,
        fields.message ? `Message : ${fields.message}` : '',
      ].filter(Boolean).join('\n');
      const channel = await sendRequest({ subject: `Commande click and collect — ${fields.prenom} ${fields.nom}`, text, data: { type: 'commande-click-and-collect', total: total.toFixed(2), ...fields } });
      clearCart();
      form.hidden = true;
      done.hidden = false;
      done.querySelector('[data-checkout-message]').textContent = DONE_MESSAGES[channel];
      done.focus();
    } catch {
      toast(`La commande n’a pas abouti. Réessayez, ou appelez le salon au ${settings.phone}.`);
    } finally {
      submit.disabled = false;
    }
  });

  render();
}
