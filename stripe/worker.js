// Fonction de paiement de la boutique (Cloudflare Workers) : crée une session Stripe Checkout.
// Les prix viennent de catalog.js (généré par build.mjs), jamais du navigateur.
// Variables : STRIPE_SECRET_KEY (secret), SITE_URL (adresse du site, avec / final),
// ALLOWED_ORIGINS (origines autorisées, séparées par des virgules).
import catalog from './catalog.js';

const MAX_LINES = 20;
const MAX_QUANTITY = 10;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean);
  return allowed.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
    : null;
}

const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });

// Lignes validées : identifiant connu, quantité entière de 1 à 10, au plus 20 lignes.
export function validateItems(items) {
  if (!Array.isArray(items) || !items.length || items.length > MAX_LINES) return null;
  const lines = [];
  for (const item of items) {
    const product = catalog[item?.id];
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY) return null;
    lines.push({ ...product, quantity: item.quantity });
  }
  return lines;
}

const clip = (value, length) => String(value || '').trim().slice(0, length);

export function checkoutParams(lines, customer, siteUrl) {
  const params = new URLSearchParams({
    mode: 'payment',
    locale: 'fr',
    success_url: `${siteUrl}boutique/?commande=merci&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}boutique/?commande=annulee`,
    'phone_number_collection[enabled]': 'true',
    'custom_text[submit][message]': 'Click and collect : retrait au salon Un Brun d’Hair, 4 bis rue Champvoisin, Aubière.',
    'metadata[retrait]': 'click and collect',
    'metadata[client]': clip(`${clip(customer?.firstName, 60)} ${clip(customer?.lastName, 60)}`, 120),
    'metadata[telephone]': clip(customer?.phone, 30),
    'metadata[message]': clip(customer?.note, 400),
  });
  const email = clip(customer?.email, 200);
  if (EMAIL.test(email)) params.set('customer_email', email);
  lines.forEach((line, index) => {
    params.set(`line_items[${index}][quantity]`, String(line.quantity));
    params.set(`line_items[${index}][price_data][currency]`, 'eur');
    params.set(`line_items[${index}][price_data][unit_amount]`, String(line.amount));
    params.set(`line_items[${index}][price_data][product_data][name]`, line.name);
  });
  return params;
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (!cors) return json({ error: 'Origine non autorisée' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405, cors);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Requête invalide' }, 400, cors);
    }
    const lines = validateItems(body?.items);
    if (!lines) return json({ error: 'Panier invalide' }, 400, cors);

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: checkoutParams(lines, body.customer, env.SITE_URL),
      signal: AbortSignal.timeout(10_000),
    });
    const session = await response.json().catch(() => ({}));
    if (!response.ok || !session.url) return json({ error: 'Paiement indisponible' }, 502, cors);
    return json({ url: session.url }, 200, cors);
  },
};
