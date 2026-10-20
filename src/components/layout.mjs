// Gabarit commun à toutes les pages : <head> (SEO, partage), en-tête, menu mobile, barre d’actions, pied de page.
import { html, raw, jsonLd } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { category, allServices } from '../data/services.mjs';
import { bottleDefs } from '../../assets/js/lib/bottle.js';
import { icon, sprite } from './icons.mjs';
import { external, whatsappUrl, PAGES } from './blocks.mjs';

const NAV = [
  { route: 'qui-suis-je/', label: 'Qui suis-je ?' },
  { route: 'realisations/', label: 'Réalisations' },
  { route: 'conseil-coupe/', label: 'Conseil coupe' },
  { route: 'boutique/', label: 'Boutique' },
  { route: 'contact/', label: 'Contact' },
];

const SERVICE_ROUTES = ['coupe-femme-aubiere/', 'coupe-homme-aubiere/', 'coloration-aubiere/', 'balayage-aubiere/', 'soin-capillaire-aubiere/', 'diagnostic-capillaire-aubiere/', 'tarifs/', 'carte-cadeau/'];

const current = (ctx, route) => (ctx.route === route ? raw(' aria-current="page"') : '');

const salonId = `${salon.siteUrl}#salon`;

const prices = allServices.filter((item) => !item.option).map((item) => item.price);

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: salon.address.street,
  postalCode: salon.address.postalCode,
  addressLocality: salon.address.city,
  addressRegion: salon.address.region,
  addressCountry: salon.address.country,
};

// Fiche Schema.org du salon (accueil et contact). Pas de note agrégée : Google l’interdit pour les avis
// que l’établissement affiche lui-même sur son site.
export function hairSalonSchema() {
  const days = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': salonId,
    name: salon.name,
    url: salon.siteUrl,
    image: [`${salon.siteUrl}assets/img/og-image.png`, `${salon.siteUrl}assets/img/photos/sandy-salon-600.webp`],
    description: 'Salon de coiffure à Aubière tenu par Sandy : coupes femme, homme et enfant, couleur, gloss et balayages sur-mesure avec les produits Davines.',
    telephone: salon.phone.tel,
    address: postalAddress,
    geo: { '@type': 'GeoCoordinates', latitude: salon.geo.lat, longitude: salon.geo.lng },
    hasMap: salon.links.googleMaps,
    // Lundi et samedi ne sont ouverts qu’une semaine sur deux : seuls les jours réguliers sont déclarés.
    openingHoursSpecification: salon.hours.filter((day) => day.open && !day.alternate).map((day) => ({
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
    provider: { '@type': 'HairSalon', '@id': salonId, name: salon.name, telephone: salon.phone.tel, address: postalAddress },
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

const logo = (ctx) => html`<a class="logo" href="${ctx.rel('')}" aria-label="Un Brun d’Hair, accueil">Un Brun <em>d’Hair</em></a>`;

function header(ctx) {
  const servicesActive = SERVICE_ROUTES.includes(ctx.route);
  return html`<header class="header" data-header>
    <div class="header__inner">
      ${logo(ctx)}
      <nav class="nav" aria-label="Navigation principale">
        <ul>
          <li class="nav__drop">
            <a class="nav__link" href="${ctx.rel('tarifs/')}"${servicesActive ? raw(' aria-current="page"') : ''}>Prestations ${icon('chevron')}</a>
            <div class="nav__panel">
              <ul>
                ${SERVICE_ROUTES.map((route) => html`<li><a href="${ctx.rel(route)}"${current(ctx, route)}>${PAGES[route][0]} <small>${PAGES[route][1]}</small></a></li>`)}
              </ul>
            </div>
          </li>
          ${NAV.map((item) => html`<li><a class="nav__link" href="${ctx.rel(item.route)}"${current(ctx, item.route)}>${item.label}</a></li>`)}
        </ul>
      </nav>
      <div class="header__end">
        <p class="status" data-open-status>Du lundi au samedi, sur rendez-vous</p>
        <a class="cart-link" href="${ctx.rel('boutique/')}#panier" data-cart-link hidden>
          ${icon('bag')}<span class="cart-link__count" data-cart-count>0</span><span class="visually-hidden">article(s) dans le panier</span>
        </a>
        <a class="btn btn--primary btn--sm header__book" href="${salon.links.planity}"${external} data-track="planity">Je réserve</a>
        <button class="menu-btn" type="button" aria-haspopup="dialog" aria-controls="menu" data-menu-open>Menu <span class="menu-btn__lines" aria-hidden="true"></span></button>
      </div>
    </div>
  </header>`;
}

function menu(ctx) {
  const links = [{ route: '', label: 'Accueil' }, { route: 'tarifs/', label: 'Prestations & tarifs' }, ...NAV];
  return html`<dialog id="menu" class="menu" aria-label="Menu">
    <div class="menu__top">
      ${logo(ctx)}
      <button class="menu__close" type="button" data-menu-close>Fermer ${icon('close')}</button>
    </div>
    <div class="menu__body">
      <nav aria-label="Pages du site">
        <ul class="menu__list">
          ${links.map((item, index) => html`<li style="--i:${index}"><a href="${ctx.rel(item.route)}"${current(ctx, item.route)}>${item.label}<span>${String(index + 1).padStart(2, '0')}</span></a></li>`)}
        </ul>
      </nav>
      <ul class="menu__services">
        ${SERVICE_ROUTES.slice(0, 6).map((route) => html`<li><a href="${ctx.rel(route)}">${PAGES[route][0]}</a></li>`)}
      </ul>
      <div class="menu__foot">
        <a class="btn btn--primary btn--block" href="${salon.links.planity}"${external} data-track="planity">Je réserve sur Planity</a>
        <p class="status" data-open-status>Du lundi au samedi, sur rendez-vous</p>
        <p>${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}<br><a href="tel:${salon.phone.tel}" data-track="phone">${salon.phone.display}</a></p>
      </div>
    </div>
  </dialog>`;
}

function dock() {
  const whatsapp = whatsappUrl();
  return html`<nav class="dock" aria-label="Actions rapides">
    <a class="dock__main" href="${salon.links.planity}"${external} data-track="planity">${icon('calendar')} Je réserve</a>
    <a href="tel:${salon.phone.tel}" data-track="phone">${icon('phone')} Appeler</a>
    ${whatsapp
      ? html`<a href="${whatsapp}"${external} data-track="whatsapp">${icon('whatsapp')} WhatsApp</a>`
      : html`<a href="${salon.links.googleDirections}"${external} data-track="itineraire">${icon('navigation')} Itinéraire</a>`}
  </nav>`;
}

function footer(ctx) {
  const whatsapp = whatsappUrl();
  return html`<footer class="footer">
    <div class="footer__inner">
      <div class="footer__top">
        <p class="footer__mark" aria-hidden="true">Un Brun <em>d’Hair</em></p>
        <a class="btn btn--light" href="${salon.links.planity}"${external} data-track="planity">Je réserve sur Planity ${icon('arrow-up-right')}</a>
      </div>
      <div class="footer__grid">
        <div>
          <h2>Le salon</h2>
          <address>${salon.address.street}<br>${salon.address.postalCode} ${salon.address.city}</address>
          <p class="status" data-open-status>Du lundi au samedi, sur rendez-vous</p>
          <ul style="margin-top:1rem">
            <li><a href="tel:${salon.phone.tel}" data-track="phone">${salon.phone.display}</a></li>
            ${whatsapp ? html`<li><a href="${whatsapp}"${external} data-track="whatsapp">WhatsApp</a></li>` : ''}
            <li><a href="${ctx.rel('contact/')}">Plan, horaires et accès</a></li>
          </ul>
        </div>
        <div>
          <h2>Prestations</h2>
          <ul>
            ${SERVICE_ROUTES.map((route) => html`<li><a href="${ctx.rel(route)}">${PAGES[route][0]}</a></li>`)}
          </ul>
        </div>
        <div>
          <h2>Découvrir</h2>
          <ul>
            ${['qui-suis-je/', 'realisations/', 'avis/', 'conseil-coupe/', 'boutique/', 'faq/'].map((route) => html`<li><a href="${ctx.rel(route)}">${PAGES[route][0]}</a></li>`)}
          </ul>
        </div>
        <div>
          <h2>Suivre le salon</h2>
          <ul>
            <li><a href="${salon.links.instagram}"${external}>Instagram</a></li>
            <li><a href="${salon.links.tiktok}"${external}>TikTok</a></li>
            <li><a href="${salon.links.planity}"${external} data-track="planity">Planity</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__legal">
        <p>© ${new Date().getFullYear()} Un Brun d’Hair · Coiffeuse à Aubière (63170) · Produits Davines</p>
        <ul>
          <li><a href="${ctx.rel('mentions-legales/')}">Mentions légales</a></li>
          <li><a href="${ctx.rel('cgv/')}">Conditions de vente</a></li>
          <li><a href="${ctx.rel('confidentialite/')}">Confidentialité</a></li>
        </ul>
      </div>
    </div>
  </footer>`;
}

// page : { route, title, description, breadcrumb?, schema?, noindex?, styles?, data?, body, image? }
export function layout(page, ctx) {
  const url = ctx.abs(page.route);
  const image = `${salon.siteUrl}assets/img/og-image.png`;
  const trail = page.breadcrumb ? [{ label: 'Accueil', route: '' }, ...page.breadcrumb] : null;
  const schemas = [...(page.schema || []), ...(trail ? [breadcrumbSchema(ctx, trail)] : [])];
  const data = {
    hours: salon.hours,
    alternateOpenWeek: salon.alternateOpenWeek,
    settings: {
      phone: salon.phone.display,
      email: salon.email,
      instagram: new URL(salon.links.instagram).pathname.replaceAll('/', ''),
      formEndpoint: salon.forms.endpoint,
      sms: salon.forms.sms,
      boutique: ctx.rel('boutique/'),
    },
    ...page.data,
  };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return html`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  ${page.noindex ? raw('<meta name="robots" content="noindex">') : html`<link rel="canonical" href="${url}">`}
  <meta name="theme-color" content="#F4EEE6">
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

  <script>document.documentElement.classList.add('js');setTimeout(()=>{if(!document.documentElement.classList.contains('is-ready'))document.documentElement.classList.remove('js')},4000);</script>
  <link rel="preload" href="${ctx.asset('assets/fonts/instrument-serif.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${ctx.asset('assets/fonts/instrument-sans.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${ctx.asset('assets/css/site.css')}">
  ${(page.styles || []).map((name) => html`<link rel="stylesheet" href="${ctx.asset(`assets/css/${name}.css`)}">\n  `)}<script type="module" src="${ctx.asset('assets/js/main.js')}"></script>
  ${schemas.map((schema) => jsonLd(schema))}
</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  ${header(ctx)}
  ${menu(ctx)}

  <main id="contenu">
    ${trail ? breadcrumb(ctx, trail) : ''}
    ${page.body}
  </main>

  ${footer(ctx)}
  ${dock()}
  <p class="toast" role="status" data-toast></p>

  <script type="application/json" id="salon-data">${raw(json)}</script>
  ${sprite()}
  ${raw(bottleDefs)}
</body>
</html>
`;
}
