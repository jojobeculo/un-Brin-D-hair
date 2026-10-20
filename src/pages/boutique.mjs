import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { products, needs, lines } from '../data/products.mjs';
import { pageHero, kicker, orbs, bottle, faq, faqSchema, related } from '../components/blocks.mjs';
import { icon } from '../components/icons.mjs';

export const route = 'boutique/';

const euros = (value) => `${value.toFixed(2).replace('.', ',')} €`;

export default function boutique(ctx) {
  const online = Boolean(salon.stripe.checkoutEndpoint);
  const FAQ = [
    { q: 'Comment fonctionne le click and collect ?', a: `Ajoutez vos produits au panier, validez la commande, puis retirez-la au ${salon.address.street} aux heures d’ouverture. ${salon.clickAndCollect}` },
    { q: 'Comment payer ?', a: online ? 'Par carte bancaire en ligne, sur la page sécurisée de Stripe, ou au salon au moment du retrait (carte bancaire ou espèces).' : 'Au salon, au moment du retrait : carte bancaire ou espèces.' },
    { q: 'Quel produit choisir pour mes cheveux ?', a: 'Filtrez par besoin, faites le questionnaire « Quelle coupe pour moi ? » qui conseille deux produits, ou demandez à Sandy lors de votre rendez-vous.' },
    { q: 'Puis-je retourner un produit ?', a: 'Oui, sous 14 jours après le retrait, s’il n’a pas été ouvert. Les produits ouverts ne peuvent pas être repris pour des raisons d’hygiène. Voir les conditions générales de vente.' },
  ];
  const body = html`
    ${pageHero(ctx, {
      kickerText: 'Boutique Davines',
      title: html`Les soins <em>du salon</em>, chez vous`,
      lead: `Les produits Davines que Sandy utilise au salon, en click and collect : vous commandez en ligne, vous retirez au ${salon.address.street}.`,
      actions: html`<a class="btn btn--primary" href="#produits" data-magnetic>Voir les produits ${icon('arrow-right', 'icon--move')}</a> <a class="btn" href="#panier">${icon('bag')} Mon panier</a>`,
      facts: [['Retrait', 'au salon, sans frais'], ['Paiement', online ? 'en ligne ou au retrait' : 'au retrait'], ['Produits', String(products.length)]],
    })}

    <section class="section" aria-labelledby="how-title" style="padding-top:0">
      <h2 id="how-title" class="visually-hidden">Comment ça marche</h2>
      <ol class="steps" style="grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:1.5rem 3rem">
        <li data-reveal><strong>Je choisis</strong><span>Par besoin : hydratation, couleur, boucles, volume…</span></li>
        <li data-reveal style="--stagger:1"><strong>Je valide</strong><span>${online ? 'Paiement sécurisé par carte, ou au retrait.' : 'Paiement au retrait, par carte ou en espèces.'}</span></li>
        <li data-reveal style="--stagger:2"><strong>Je retire au salon</strong><span>Sandy vous prévient dès que la commande est prête.</span></li>
      </ol>
    </section>

    <div class="has-ribbon" data-ambient="dark" data-shop>
      ${orbs()}
      <section id="produits" class="section" aria-labelledby="products-title">
        <header class="section__head section__head--split">
          ${kicker('La sélection')}
          <h2 id="products-title" data-split>Choisir <em>par besoin</em></h2>
          <p>Prix publics conseillés par Davines, TTC. Les produits disponibles au salon peuvent varier : Sandy vous prévient en cas de rupture.</p>
        </header>
        <div class="chips shop__filters" role="group" aria-label="Filtrer les produits">
          <button class="chip" type="button" aria-pressed="true" data-filter="">Tout</button>
          ${needs.map((need) => html`<button class="chip" type="button" aria-pressed="false" data-filter="${need.id}">${need.label}</button>`)}
        </div>
        <p class="visually-hidden" aria-live="polite" data-filter-live></p>
        <ul class="shop__grid">
          ${products.map((item) => html`<li id="${item.id}" class="product" data-needs="${item.needs.join(' ')}" data-tilt>
            <div class="product__visual" style="--tint:${lines[item.line].tint}">${bottle(item)}</div>
            <p class="product__line">${item.line}</p>
            <h3 class="product__name">${item.name}</h3>
            <p class="product__text">${item.text}</p>
            <div class="product__foot">
              <p><strong>${euros(item.price)}</strong> <span>${item.size}</span></p>
              <button class="btn btn--primary btn--sm" type="button" data-add-to-cart="${item.id}" data-name="${item.name}" aria-label="${`Ajouter ${item.name} au panier`}">${icon('plus')} Ajouter</button>
            </div>
          </li>`)}
        </ul>
      </section>
    </div>

    <div class="band band--creme">
      <section id="panier" class="section" aria-labelledby="cart-title">
        <div class="cart">
          <div>
            ${kicker('Click and collect')}
            <h2 id="cart-title" data-split>Mon <em>panier</em></h2>
            <div class="cart__lines" data-cart-lines>
              <p class="cart__empty">Votre panier est vide. <a href="#produits">Voir les produits</a></p>
            </div>
            <p class="cart__total" data-cart-total hidden></p>
            <p class="small">${salon.clickAndCollect}</p>
          </div>

          <div>
            <form class="form cart__form" data-checkout novalidate hidden>
              <h3 class="h3">Mes coordonnées</h3>
              <div class="cart__row">
                <div class="field">
                  <label for="co-first">Prénom</label>
                  <input id="co-first" class="input" name="prenom" type="text" autocomplete="given-name" required aria-describedby="co-first-error">
                  <p id="co-first-error" class="field__error" data-error-for="prenom" hidden></p>
                </div>
                <div class="field">
                  <label for="co-last">Nom</label>
                  <input id="co-last" class="input" name="nom" type="text" autocomplete="family-name" required aria-describedby="co-last-error">
                  <p id="co-last-error" class="field__error" data-error-for="nom" hidden></p>
                </div>
              </div>
              <div class="field">
                <label for="co-phone">Téléphone</label>
                <input id="co-phone" class="input" name="telephone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="co-phone-error">
                <p id="co-phone-error" class="field__error" data-error-for="telephone" hidden></p>
              </div>
              <div class="field">
                <label for="co-email">E-mail</label>
                <input id="co-email" class="input" name="email" type="email" inputmode="email" autocomplete="email" required aria-describedby="co-email-error">
                <p id="co-email-error" class="field__error" data-error-for="email" hidden></p>
              </div>
              ${online ? html`<fieldset>
                <legend>Paiement</legend>
                <div class="pills">
                  <label><input type="radio" name="paiement" value="en-ligne" checked><span>${icon('card')} En ligne, par carte</span></label>
                  <label><input type="radio" name="paiement" value="au-retrait"><span>${icon('store')} Au retrait</span></label>
                </div>
              </fieldset>` : html`<input type="hidden" name="paiement" value="au-retrait">`}
              <div class="field">
                <label for="co-note">Un mot pour Sandy <span class="optional">(facultatif)</span></label>
                <textarea id="co-note" class="input" name="message" rows="3"></textarea>
              </div>
              <p class="trap" aria-hidden="true"><label>Ne pas remplir <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
              <label class="consent">
                <input type="checkbox" name="cgv" required aria-describedby="co-cgv-error">
                <span>J’ai lu et j’accepte les <a href="${ctx.rel('cgv/')}">conditions générales de vente</a>.</span>
              </label>
              <p id="co-cgv-error" class="field__error" data-error-for="cgv" hidden></p>
              <button class="btn btn--primary btn--block" type="submit" data-checkout-submit>${online ? 'Payer et commander' : 'Commander, je paie au retrait'}</button>
              <p class="form-note">${online ? 'Paiement sécurisé par Stripe : le salon n’a jamais accès à votre carte. ' : ''}Vos coordonnées servent uniquement à préparer la commande. <a href="${ctx.rel('confidentialite/')}">Données personnelles</a></p>
            </form>
            <div class="done" data-checkout-done hidden tabindex="-1">
              <p class="done__title">Merci&nbsp;!</p>
              <p data-checkout-message></p>
            </div>
          </div>
        </div>
      </section>
    </div>

    ${faq(FAQ)}
    ${related(ctx, ['conseil-coupe/', 'soin-capillaire-aubiere/', 'carte-cadeau/', 'contact/'])}`;

  return {
    title: 'Boutique Davines en click and collect à Aubière | Un Brun d’Hair',
    description: `Shampoings, soins et produits de coiffage Davines utilisés au salon Un Brun d’Hair, à commander en ligne et à retirer à Aubière. ${products.length} produits, retrait sans frais.`,
    breadcrumb: [{ label: 'Boutique', route }],
    schema: [faqSchema(FAQ)],
    styles: ['shop'],
    data: {
      shop: {
        products: products.map(({ id, name, size, price, line, shape }) => ({ id, name, size, price, line, shape, tint: lines[line].tint })),
        checkoutEndpoint: salon.stripe.checkoutEndpoint,
      },
    },
    body,
  };
}
