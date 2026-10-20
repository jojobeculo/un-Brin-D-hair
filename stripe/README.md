# Paiement en ligne de la boutique (Stripe Checkout)

La boutique fonctionne sans paiement en ligne : la commande part au salon et se paie au retrait.
Pour ajouter le paiement par carte, cette fonction crée une page de paiement Stripe Checkout.
La clé secrète Stripe reste sur le serveur. Les prix viennent de `catalog.js`, que `node build.mjs`
génère à partir de `src/data/products.mjs`. Le navigateur n’envoie que les identifiants et les quantités.

## Mise en service

1. Créez un compte sur [stripe.com](https://stripe.com) et récupérez la clé secrète (`sk_live_…`, ou `sk_test_…` pour essayer).
2. Créez un compte gratuit [Cloudflare](https://dash.cloudflare.com), puis dans ce dossier :
   ```sh
   npx wrangler login
   npx wrangler secret put STRIPE_SECRET_KEY
   npx wrangler deploy
   ```
3. Vérifiez `SITE_URL` et `ALLOWED_ORIGINS` dans `wrangler.toml` (adresse définitive du site).
4. Copiez l’adresse affichée par `wrangler deploy` (`https://un-brun-dhair-paiement.….workers.dev`)
   dans `stripe.checkoutEndpoint` de `src/data/salon.mjs`, puis lancez `node build.mjs`.
5. Remplissez le médiateur de la consommation (`legal.mediator`) : il est obligatoire pour la vente en ligne.

Les paiements apparaissent dans le tableau de bord Stripe, avec le nom, le téléphone et le message du client.
Après chaque changement de prix dans `src/data/products.mjs` : `node build.mjs`, puis `npx wrangler deploy`.

## Tests

`node --test tests/` vérifie la validation du panier et les paramètres envoyés à Stripe, sans appel réseau.
