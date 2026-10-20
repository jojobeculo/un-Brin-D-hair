// Gabarit commun à toutes les pages : <head> (SEO, partage), navigation, pied de page, tunnel de réservation.
import { html, raw, jsonLd } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { bookingData, category, allServices } from '../data/services.mjs';
import { icon, sprite } from './icons.mjs';
import { ring, whatsappUrl } from './blocks.mjs';

export const MAIN_NAV = [
  { route: 'salon/', label: 'Le salon' },
  { route: 'tarifs/', label: 'Tarifs' },
  { route: 'balayage-aubiere/', label: 'Balayage' },
  { route: 'coloration-aubiere/', label: 'Coloration' },
  { route: 'galerie/', label: 'Avant / après' },
  { route: 'avis/', label: 'Avis' },
  { route: 'contact/', label: 'Contact' },
];

export const SERVICE_NAV = [
  { route: 'coiffeur-femme-aubiere/', label: 'Coupe femme' },
  { route: 'coiffeur-homme-aubiere/', label: 'Homme & enfant' },
  { route: 'coloration-aubiere/', label: 'Coloration & gloss' },
  { route: 'balayage-aubiere/', label: 'Balayage' },
  { route: 'soins-capillaires-aubiere/', label: 'Soins Davines' },
  { route: 'diagnostic-capillaire-aubiere/', label: 'Diagnostic' },
  { route: 'carte-cadeau/', label: 'Carte cadeau' },
];

const STYLES = ['tokens', 'base', 'components', 'sections', 'booking'];
const external = raw(' target="_blank" rel="noopener"');
const current = (ctx, route) => (ctx.route === route ? raw(' aria-current="page"') : '');

export const salonId = `${salon.siteUrl}#salon`;

const prices = allServices.filter((item) => !item.option).map((item) => item.price);

// Fiche Schema.org du salon (accueil et contact).
export function hairSalonSchema() {
  const days = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': salonId,
    name: salon.name,
    url: salon.siteUrl,
    image: `${salon.siteUrl}assets/img/og-image.png`,
    description: 'Salon de coiffure intimiste à Aubière : coupes femme, homme et enfant, couleur, gloss et balayages sur-mesure avec les produits Davines.',
    telephone: salon.phone.tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: salon.address.street,
      postalCode: salon.address.postalCode,
      addressLocality: salon.address.city,
      addressRegion: salon.address.region,
      addressCountry: salon.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: salon.geo.lat, longitude: salon.geo.lng },
    hasMap: salon.links.googleMaps,
    openingHoursSpecification: salon.hours.filter((day) => day.open).map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days[day.day],
      opens: day.open,
      closes: day.close,
    })),
    areaServed: salon.areaServed.map((name) => ({ '@type': 'City', name })),
    priceRange: `${Math.min(...prices)} € – ${Math.max(...prices)} €`,
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Carte bancaire, Espèces',
    sameAs: [salon.links.instagram, salon.links.tiktok, salon.links.planity],
    potentialAction: { '@type': 'ReserveAction', target: salon.links.planity },
  };
}

// Fiche Schema.org d’une prestation, avec ses tarifs (prix minimum pour les tarifs « dès »).
export function serviceSchema(ctx, { name, description, route, categories }) {
  const offers = categories
    .flatMap((id) => category(id).groups.flatMap((group) => group.services))
    .map((item) => ({
      '@type': 'Offer',
      name: item.name,
      priceCurrency: 'EUR',
      ...(item.from
        ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: item.price, priceCurrency: 'EUR' } }
        : { price: item.price }),
    }));
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType: name,
    description,
    url: ctx.abs(route),
    areaServed: salon.areaServed.map((city) => ({ '@type': 'City', name: city })),
    provider: {
      '@type': 'HairSalon',
      '@id': salonId,
      name: salon.name,
      telephone: salon.phone.tel,
      address: {
        '@type': 'PostalAddress',
        streetAddress: salon.address.street,
        postalCode: salon.address.postalCode,
        addressLocality: salon.address.city,
        addressCountry: salon.address.country,
      },
    },
    offers,
  };
}

function breadcrumbSchema(ctx, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: ctx.abs(item.route) })),
  };
}

function breadcrumb(ctx, trail) {
  return html`<nav class="breadcrumb" aria-label="Fil d’Ariane">
      <ol>
        ${trail.map((item, index) => (index === trail.length - 1
          ? html`<li><span aria-current="page">${item.label}</span></li>`
          : html`<li><a href="${ctx.rel(item.route)}">${item.label}</a></li>`))}
      </ol>
    </nav>`;
}

function menu(ctx) {
  return html`<dialog id="menu" class="menu" aria-labelledby="menu-title">
    <button class="corner corner--left corner--static" type="button" data-menu-close>
      ${icon('close')}
      <span class="visually-hidden">Fermer le menu</span>
    </button>
    <h2 id="menu-title" class="visually-hidden">Menu</h2>
    <nav class="menu__nav" aria-label="Pages du site">
      <ol class="menu__list">
        <li><a href="${ctx.rel('')}"${current(ctx, '')}><span class="menu__num">00</span>Accueil</a></li>
        ${MAIN_NAV.map((item, index) => html`<li><a href="${ctx.rel(item.route)}"${current(ctx, item.route)}><span class="menu__num">${String(index + 1).padStart(2, '0')}</span>${item.label}</a></li>`)}
      </ol>
    </nav>
    <div class="menu__aside">
      <a class="btn btn--ink menu__book" href="${salon.links.planity}" data-book data-track="planity">Réserver ${icon('arrow-right')}</a>
      <p class="menu__status" data-open-status>Du lundi au samedi, sur rendez-vous</p>
      <ul class="menu__services">
        ${SERVICE_NAV.map((item) => html`<li><a href="${ctx.rel(item.route)}"${current(ctx, item.route)}>${item.label}</a></li>`)}
      </ul>
      <p>${salon.address.street}<br>${salon.address.postalCode} ${salon.address.city}</p>
      <p><a href="tel:${salon.phone.tel}" data-track="phone">${salon.phone.display}</a></p>
      <ul class="menu__social">
        <li><a href="${salon.links.instagram}"${external}>Instagram</a></li>
        <li><a href="${salon.links.tiktok}"${external}>TikTok</a></li>
        <li><a href="${salon.links.planity}"${external} data-track="planity">Planity</a></li>
      </ul>
    </div>
  </dialog>`;
}

function footer(ctx) {
  const whatsapp = whatsappUrl();
  return html`<footer class="footer">
    <p class="footer__mark" aria-hidden="true" data-reveal="chars">Un Brun d’Hair</p>
    <div class="footer__grid">
      <div>
        <h2 class="footer__label">Le salon</h2>
        <address>${salon.address.street}<br>${salon.address.postalCode} ${salon.address.city}</address>
        <p>Du lundi au samedi, sur rendez-vous. <a href="${ctx.rel('contact/')}">Horaires et accès</a></p>
      </div>
      <div>
        <h2 class="footer__label">Prestations</h2>
        <ul>
          ${SERVICE_NAV.map((item) => html`<li><a href="${ctx.rel(item.route)}">${item.label}</a></li>`)}
          <li><a href="${ctx.rel('tarifs/')}">Tous les tarifs</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer__label">Découvrir</h2>
        <ul>
          <li><a href="${ctx.rel('salon/')}">Le salon &amp; Sandy</a></li>
          <li><a href="${ctx.rel('galerie/')}">Avant / après</a></li>
          <li><a href="${ctx.rel('avis/')}">Avis clients</a></li>
          <li><a href="${ctx.rel('contact/')}">Contact &amp; accès</a></li>
          <li><a href="${ctx.rel('mentions-legales/')}">Mentions légales</a></li>
          <li><a href="${ctx.rel('confidentialite/')}">Confidentialité</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer__label">Contact</h2>
        <ul>
          <li><a href="tel:${salon.phone.tel}" data-track="phone">${salon.phone.display}</a></li>
          ${whatsapp ? html`<li><a href="${whatsapp}"${external} data-track="whatsapp">WhatsApp</a></li>` : ''}
          <li><a href="${salon.links.planity}"${external} data-track="planity">Réserver sur Planity</a></li>
          <li><a href="${salon.links.instagram}"${external}>Instagram</a></li>
          <li><a href="${salon.links.tiktok}"${external}>TikTok</a></li>
        </ul>
      </div>
    </div>
    <p class="footer__legal">© ${new Date().getFullYear()} Un Brun d’Hair · Salon de coiffure à Aubière (63170) · Produits Davines</p>
  </footer>`;
}

function bookingDialog(ctx) {
  return html`<dialog id="booking" class="booking" aria-labelledby="booking-title">
    <div class="booking__inner">
      <div class="booking__bar">
        <button class="corner-btn" type="button" data-booking-back>
          ${icon('arrow-left')}
          <span class="visually-hidden">Étape précédente</span>
        </button>
        <div class="booking__progress">
          <h2 id="booking-title" class="booking__label">Réservation</h2>
          <ol class="progress">
            <li data-progress="1">Prestation</li>
            <li data-progress="2">Petits plus</li>
            <li data-progress="3">Créneau</li>
          </ol>
        </div>
        <button class="corner-btn" type="button" data-booking-close>
          ${icon('close')}
          <span class="visually-hidden">Fermer la réservation</span>
        </button>
      </div>

      <p class="visually-hidden" aria-live="polite" data-booking-live></p>

      <section class="step" data-step="1" aria-labelledby="step-1-title">
        <p class="step__kicker">Étape 1 sur 3</p>
        <h3 id="step-1-title" class="step__title" tabindex="-1">Quelle prestation ?</h3>
        <div class="tabs" role="group" aria-label="Catégories de prestations" data-tabs></div>
        <div class="choices" data-choices></div>
      </section>

      <section class="step" data-step="2" aria-labelledby="step-2-title" hidden>
        <p class="step__kicker">Étape 2 sur 3</p>
        <h3 id="step-2-title" class="step__title" tabindex="-1">Les petits plus.</h3>
        <div class="gate" data-gate hidden></div>
        <fieldset class="options" data-options>
          <legend class="options__legend">À ajouter à votre rendez-vous</legend>
          <div data-options-list></div>
        </fieldset>
        <button class="btn btn--solid" type="button" data-next>Continuer ${icon('arrow-right')}</button>
      </section>

      <section class="step" data-step="3" aria-labelledby="step-3-title" hidden>
        <p class="step__kicker">Étape 3 sur 3</p>
        <h3 id="step-3-title" class="step__title" tabindex="-1">Quand ?</h3>
        <div class="days" data-days></div>
        <div class="slots" data-slots></div>
        <p class="step__note">Créneaux indicatifs, calculés d’après les horaires d’ouverture : Sandy vous confirme la disponibilité.</p>
      </section>

      <section class="step" data-step="4" aria-labelledby="step-4-title" hidden>
        <p class="step__kicker">Validation</p>
        <h3 id="step-4-title" class="step__title" tabindex="-1">On valide ?</h3>
        <dl class="recap" data-recap></dl>
        <div class="validate">
          <div class="validate__block validate__block--planity">
            <h4>Confirmer en ligne</h4>
            <p>Disponibilités en temps réel et confirmation immédiate sur Planity. Votre récapitulatif est copié pour retrouver la bonne prestation.</p>
            <a class="btn btn--solid" href="${salon.links.planity}"${external} data-planity data-track="planity">Confirmer sur Planity ${icon('arrow-up-right')}</a>
          </div>
          <form class="validate__block" data-request-form novalidate>
            <h4>Ou envoyer une demande au salon</h4>
            <div class="field">
              <label for="bk-name">Prénom</label>
              <input id="bk-name" class="input" name="prenom" type="text" autocomplete="given-name" required aria-describedby="bk-name-error">
              <p id="bk-name-error" class="field__error" data-error-for="prenom" hidden></p>
            </div>
            <div class="field">
              <label for="bk-phone">Téléphone</label>
              <input id="bk-phone" class="input" name="telephone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="bk-phone-error">
              <p id="bk-phone-error" class="field__error" data-error-for="telephone" hidden></p>
            </div>
            <div class="field">
              <label for="bk-message">Un mot pour Sandy <span class="optional">(facultatif)</span></label>
              <textarea id="bk-message" class="input" name="message" rows="3"></textarea>
            </div>
            <p class="visually-hidden" aria-hidden="true"><label>Ne pas remplir <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
            <button class="btn btn--ink" type="submit">Envoyer ma demande</button>
            <p class="form-note">Ou appelez directement le <a href="tel:${salon.phone.tel}" data-track="phone">${salon.phone.display}</a>. <a href="${ctx.rel('confidentialite/')}">Données personnelles</a></p>
          </form>
        </div>
      </section>

      <section class="step" data-step="done" aria-labelledby="step-done-title" hidden>
        <h3 id="step-done-title" class="step__title step__title--xl" tabindex="-1"><span class="line">C’est</span> <span class="line line--accent">noté.</span></h3>
        <p class="lead" data-done-message></p>
        <div class="done__actions">
          <button class="btn" type="button" data-booking-close>Fermer</button>
          <a class="btn" href="${salon.links.instagram}"${external}>${icon('instagram')} Suivre @unbrundhair</a>
        </div>
      </section>
    </div>

    <p class="toast" role="status" data-toast></p>

    <div class="booking__summary" data-summary hidden>
      <p class="summary__what" data-summary-what></p>
      <p class="summary__total" data-summary-total></p>
    </div>
  </dialog>`;
}

// page : { route, title, description, breadcrumb?, schema?, noindex?, body }
export function layout(page, ctx) {
  const url = ctx.abs(page.route);
  const image = `${salon.siteUrl}assets/img/og-image.png`;
  const trail = page.breadcrumb ? [{ label: 'Accueil', route: '' }, ...page.breadcrumb] : null;
  const schemas = [...(page.schema || []), ...(trail ? [breadcrumbSchema(ctx, trail)] : [])];
  const whatsapp = whatsappUrl();
  const settings = {
    phone: salon.phone.display,
    email: salon.email,
    instagram: new URL(salon.links.instagram).pathname.replaceAll('/', ''),
    formEndpoint: salon.forms.endpoint,
    sms: salon.forms.sms,
  };
  const data = JSON.stringify({ hours: salon.hours, categories: bookingData(), settings }).replace(/</g, '\\u003c');

  return html`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  ${page.noindex ? raw('<meta name="robots" content="noindex">') : html`<link rel="canonical" href="${url}">`}
  <meta name="theme-color" content="#fff8f6">
  <link rel="icon" href="${ctx.asset('favicon.svg')}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${ctx.asset('assets/img/apple-touch-icon.png')}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="${salon.name}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Un Brun d’Hair, salon de coiffure à Aubière">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.description}">
  <meta name="twitter:image" content="${image}">

  <script>if ('noModule' in HTMLScriptElement.prototype) document.documentElement.classList.add('js');</script>

  <link rel="preload" href="${ctx.asset('assets/fonts/archivo-extracondensed-black.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://api.fontshare.com">
  <link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
  <!-- Clash Grotesk (ITF Free Font License) : servie par l’API Fontshare, la licence interdit de publier les fichiers dans un dépôt public. -->
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f%5B%5D=clash-grotesk@400,500,600,700&amp;display=swap">
  ${STYLES.map((name) => html`<link rel="stylesheet" href="${ctx.asset(`assets/css/${name}.css`)}">\n  `)}<script type="module" src="${ctx.asset('assets/js/main.js')}"></script>
  ${schemas.map((schema) => jsonLd(schema))}
</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu</a>

  <header>
    <button class="corner corner--left" type="button" aria-haspopup="dialog" aria-controls="menu" data-menu-open>
      <span class="burger" aria-hidden="true"><span></span><span></span></span>
      <span class="visually-hidden">Ouvrir le menu</span>
    </button>
    <a class="corner corner--right" href="${ctx.rel('')}" aria-label="Un Brun d’Hair, accueil">
      ${icon('bolt')}
    </a>
    <a class="fab" href="${salon.links.planity}" data-book data-fab data-track="planity">
      ${ring('ring-fab', 'RÉSERVER · RÉSERVER · RÉSERVER ·', { radius: 76, length: 477 })}
      ${icon('bolt')}
      <span class="visually-hidden">Réserver</span>
    </a>
    ${whatsapp ? html`<a class="fab-whatsapp" href="${whatsapp}"${external} data-track="whatsapp">${icon('whatsapp')}<span class="visually-hidden">Écrire au salon sur WhatsApp</span></a>` : ''}
  </header>

  ${menu(ctx)}

  <main id="contenu">
    ${trail ? breadcrumb(ctx, trail) : ''}
    ${page.body}
  </main>

  ${footer(ctx)}

  ${bookingDialog(ctx)}

  <p class="toast" role="status" data-toast></p>

  <script type="application/json" id="salon-data">${raw(data)}</script>
  ${sprite()}
</body>
</html>
`;
}
