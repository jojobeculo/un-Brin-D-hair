import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import worker, { validateItems, checkoutParams } from '../stripe/worker.js';

const env = { STRIPE_SECRET_KEY: 'sk_test_x', SITE_URL: 'https://exemple.fr/', ALLOWED_ORIGINS: 'https://exemple.fr' };
const request = (body, origin = 'https://exemple.fr', method = 'POST') => new Request('https://paiement.test/', {
  method, headers: { Origin: origin, 'Content-Type': 'application/json' }, body: method === 'POST' ? JSON.stringify(body) : undefined,
});

test('panier : identifiants connus et quantités bornées', () => {
  assert.equal(validateItems([{ id: 'oi-shampoo', quantity: 2 }])[0].amount, 2840);
  assert.equal(validateItems([{ id: 'inconnu', quantity: 1 }]), null);
  assert.equal(validateItems([{ id: 'oi-shampoo', quantity: 0 }]), null);
  assert.equal(validateItems([{ id: 'oi-shampoo', quantity: 11 }]), null);
  assert.equal(validateItems([{ id: 'oi-shampoo', quantity: 1.5 }]), null);
  assert.equal(validateItems([]), null);
  assert.equal(validateItems('x'), null);
});

test('paramètres Stripe : prix du serveur, adresses du site', () => {
  const params = checkoutParams(validateItems([{ id: 'oi-oil', quantity: 1 }]), { email: 'a@b.fr', firstName: 'Léa', lastName: 'M' }, env.SITE_URL);
  assert.equal(params.get('line_items[0][price_data][unit_amount]'), '3280');
  assert.equal(params.get('success_url'), 'https://exemple.fr/boutique/?commande=merci&session_id={CHECKOUT_SESSION_ID}');
  assert.equal(params.get('customer_email'), 'a@b.fr');
  assert.equal(params.get('mode'), 'payment');
});

test('origine inconnue refusée', async () => {
  const response = await worker.fetch(request({}, 'https://pirate.example'), env);
  assert.equal(response.status, 403);
});

test('panier invalide refusé sans appeler Stripe', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () => { throw new Error('ne doit pas être appelé'); });
  const response = await worker.fetch(request({ items: [{ id: 'oi-oil', quantity: 99 }] }), env);
  assert.equal(response.status, 400);
  assert.equal(fetchMock.mock.callCount(), 0);
  fetchMock.mock.restore();
});

test('session créée : renvoie l’adresse de paiement', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(url, 'https://api.stripe.com/v1/checkout/sessions');
    assert.equal(init.headers.Authorization, 'Bearer sk_test_x');
    return new Response(JSON.stringify({ url: 'https://checkout.stripe.com/c/pay/test' }), { status: 200 });
  });
  const response = await worker.fetch(request({ items: [{ id: 'oi-oil', quantity: 1 }] }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { url: 'https://checkout.stripe.com/c/pay/test' });
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://exemple.fr');
  fetchMock.mock.restore();
});

test('erreur Stripe : 502', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 400 }));
  const response = await worker.fetch(request({ items: [{ id: 'oi-oil', quantity: 1 }] }), env);
  assert.equal(response.status, 502);
  fetchMock.mock.restore();
});
