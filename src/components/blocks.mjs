// Composants réutilisables des pages. Chaque fonction renvoie du HTML (html`…`).
// `ctx` décrit la page en cours : ctx.rel(route) donne un lien relatif, ctx.asset(chemin) un fichier.
import { readFileSync } from 'node:fs';
import { html, raw } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { category, service, startingPrice, priceOf, durationOf } from '../data/services.mjs';
import { product, lines } from '../data/products.mjs';
import { formatDuration } from '../../assets/js/lib/format.js';
import { formatTime } from '../../assets/js/lib/hours.js';
import { bottleSvg } from '../../assets/js/lib/bottle.js';
import { ribbonPaths, RIBBONS } from '../../assets/js/lib/ribbon.js';
import { icon } from './icons.mjs';

export const external = raw(' target="_blank" rel="noopener"');

export const whatsappUrl = () => (salon.whatsapp ? `https://wa.me/${salon.whatsapp}?text=${encodeURIComponent(salon.whatsappMessage)}` : '');

// ---------- Photos ----------

const photoMeta = new Map();
function meta(name) {
  if (!photoMeta.has(name)) {
    photoMeta.set(name, JSON.parse(readFileSync(new URL(`../../assets/img/photos/${name}.json`, import.meta.url))));
  }
  return photoMeta.get(name);
}

// <picture> AVIF + WebP aux largeurs produites par tools/photos.py.
export function photo(ctx, name, { alt = '', sizes = '100vw', eager = false, className = '' } = {}) {
  const { widths, ratio } = meta(name);
  const srcset = (format) => widths.map((width) => `${ctx.asset(`assets/img/photos/${name}-${width}.${format}`)} ${width}w`).join(', ');
  const largest = widths.at(-1);
  const fallback = widths.find((width) => width >= 960) || largest;
  return html`<picture>
          <source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}">
          <img${className ? html` class="${className}"` : ''} src="${ctx.asset(`assets/img/photos/${name}-${fallback}.webp`)}" srcset="${srcset('webp')}" sizes="${sizes}" alt="${alt}" width="${largest}" height="${Math.round(largest / ratio)}"${eager ? raw(' fetchpriority="high"') : raw(' loading="lazy"')} decoding="async">
        </picture>`;
}

// ---------- Textes et boutons ----------

export const kicker = (text) => html`<p class="kicker">${text}</p>`;

export function bookButton(label = 'Je réserve', className = 'btn btn--primary') {
  return html`<a class="${className}" href="${salon.links.planity}"${external} data-track="planity" data-magnetic data-cursor="Réserver">${label} ${icon('arrow-up-right', 'icon--move')}</a>`;
}

export function phoneLink(className = 'link', text = salon.phone.display) {
  return html`<a class="${className}" href="tel:${salon.phone.tel}" data-track="phone">${icon('phone')} ${text}</a>`;
}

export function contactActions(className = 'btn') {
  const whatsapp = whatsappUrl();
  return html`${phoneLink(className, 'Appeler')}
          ${whatsapp ? html`<a class="${className}" href="${whatsapp}"${external} data-track="whatsapp">${icon('whatsapp')} WhatsApp</a>` : ''}
          <a class="${className}" href="${salon.links.googleDirections}"${external} data-track="itineraire">${icon('navigation')} Itinéraire</a>`;
}

// ---------- Décor ----------

// Ruban organique (assets/js/lib/ribbon.js) : dessin fixe, animé par fx.js sur ordinateur.
export function ribbon(name, className = '') {
  const shape = RIBBONS[name];
  const paths = ribbonPaths(shape.points, shape);
  return html`<div class="${`ribbon ribbon--${name} ${className}`.trim()}" data-ribbon="${name}"${name === 'hero' ? '' : raw(' data-parallax')} aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs><radialGradient id="ribbon-light-${name}" gradientUnits="userSpaceOnUse" cx="720" cy="450" r="700"><stop offset="0" stop-color="#C9A27A"/><stop offset="0.55" stop-color="#A9825F"/><stop offset="1" stop-color="#A9825F" stop-opacity="0.35"/></radialGradient></defs>
          <g stroke="url(#ribbon-light-${name})">${paths.map((d, index) => html`<path d="${d}" pathLength="1" style="--i:${index}"/>`)}</g>
        </svg>
      </div>`;
}

// Orbes de lumière floues (dégradés radiaux, sans filtre) : elles dérivent et suivent la souris avec inertie.
export const orbs = () => html`<div class="orbs" aria-hidden="true"><div class="orbs__layer" data-orbs><span class="orb orb--1"></span><span class="orb orb--2"></span><span class="orb orb--3"></span></div></div>`;

// Vague de la vitrine : petit trait décoratif.
export const wave = (className = 'statement__wave draw-line') => html`<svg class="${className}" viewBox="0 0 320 24" aria-hidden="true" data-reveal-line><path d="M2 12 C 22 2, 42 2, 62 12 S 102 22, 122 12 S 162 2, 182 12 S 222 22, 242 12 S 282 2, 318 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" pathLength="1"/></svg>`;

// ---------- En-tête des pages intérieures ----------

export function pageHero(ctx, { kickerText, title, lead, image, alt = '', facts = [], actions }) {
  return html`<section class="${image ? 'page-hero page-hero--media' : 'page-hero'}" aria-labelledby="page-title">
      <div>
        ${kicker(kickerText)}
        <h1 id="page-title" data-split>${title}</h1>
        ${lead ? html`<p class="lead">${lead}</p>` : ''}
        <div class="actions">${actions === undefined ? html`${bookButton()} ${phoneLink('btn', 'Appeler')}` : actions}</div>
        ${facts.length ? html`<ul class="page-hero__facts">${facts.map(([label, value]) => html`<li>${label} <strong>${value}</strong></li>`)}</ul>` : ''}
      </div>
      ${image ? html`<div class="page-hero__media"><div class="arch" data-reveal="mask">${photo(ctx, image, { alt, sizes: '(min-width: 960px) 460px, 90vw', eager: true })}</div></div>` : ''}
    </section>`;
}

// ---------- Prestations ----------

const SERVICES = [
  { id: 'femme', title: 'Coupe & brushing', text: 'Une coupe pensée pour vos cheveux et votre quotidien, conseils compris.', image: 'coupe', alt: 'Coupe aux ciseaux sur cheveux bruns' },
  { id: 'couleur', title: 'Coloration & gloss', text: 'Racines, éclat, reflets neutralisés, premiers cheveux blancs estompés.', image: 'couleur', alt: 'Mise en forme de cheveux cuivrés' },
  { id: 'balayage', title: 'Balayage', text: 'Lumières & Subtil ou Éclat & Intense, toujours après un diagnostic.', image: 'boucles', alt: 'Cheveux longs méchés blonds et bouclés' },
  { id: 'homme', title: 'Homme & enfant', text: 'Shampoing, coupe et coiffage. Les moins de 12 ans aussi.', image: 'outils', alt: 'Ciseaux et brosses de coiffure sur un plan de travail' },
  { id: 'soin', title: 'Soins Davines', text: 'Le soin adapté aux besoins de vos cheveux, pendant votre rendez-vous.', image: 'soin', alt: 'Shampoing au bac à shampoing' },
  { id: 'diagnostic', title: 'Diagnostic capillaire', text: '15 minutes pour définir votre projet, déduites de votre prestation.', image: 'mise-en-forme', alt: 'Coiffeuse qui travaille une coiffure attachée' },
];

export function serviceCards(ctx, ids = SERVICES.map((item) => item.id), { headingTag = 'h3' } = {}) {
  return html`<ul class="cards">
        ${ids.map((id, index) => {
          const item = SERVICES.find((entry) => entry.id === id);
          const cat = category(id);
          const href = `${ctx.rel(cat.page)}${cat.anchor ? `#${cat.anchor}` : ''}`;
          return html`<li data-reveal style="--stagger:${index % 3}">
          <a class="card" href="${href}" data-cursor="Explorer">
            <div class="card__media" data-liquid>${photo(ctx, item.image, { alt: item.alt, sizes: '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw' })}</div>
            <div class="card__body">
              ${raw(`<${headingTag} class="card__title">${html`${item.title}`}</${headingTag}>`)}
              <p class="card__text">${item.text}</p>
              <p class="card__foot"><span>${id === 'homme' ? priceOf('homme-forfait') : startingPrice(id)}</span>${icon('arrow-right')}</p>
            </div>
          </a>
        </li>`;
        })}
      </ul>`;
}

// ---------- Réalisations (photos d’illustration, à remplacer par les photos du salon) ----------

export const SHOTS = [
  { image: 'boucles', title: 'Balayage lumineux', tag: 'Balayage', alt: 'Cheveux longs blonds et bouclés, vus de dos', layout: 'tall' },
  { image: 'coupe', title: 'Coupe sur cheveux lisses', tag: 'Coupe', alt: 'Coupe aux ciseaux sur cheveux bruns lisses' },
  { image: 'brushing', title: 'Brushing', tag: 'Brushing', alt: 'Brushing à la brosse ronde et au séchoir' },
  { image: 'couleur', title: 'Reflets cuivrés', tag: 'Couleur', alt: 'Cheveux cuivrés mis en boucles au fer', layout: 'wide' },
  { image: 'mise-en-forme', title: 'Coiffure attachée', tag: 'Coiffage', alt: 'Chignon bouclé en cours de réalisation' },
  { image: 'soin', title: 'Soin au bac', tag: 'Soin', alt: 'Shampoing et soin au bac' },
];

export function shots(ctx, items = SHOTS) {
  return html`<div class="shots">
        ${items.map((item, index) => html`<figure class="${item.layout ? `shot shot--${item.layout}` : 'shot'}" data-reveal style="--stagger:${index % 4}" data-parallax data-liquid data-cursor="Voir">
          ${photo(ctx, item.image, { alt: item.alt, sizes: item.layout === 'wide' ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 50vw' })}
          <figcaption><strong>${item.title}</strong><span>${item.tag}</span></figcaption>
        </figure>`)}
      </div>`;
}

// ---------- Avant / après (illustrations, à remplacer par des photos du salon) ----------

export const GALLERY = [
  { slug: 'balayage-lumieres', title: 'Balayage Lumières & Subtil', book: 'balayage-lumieres-longs', before: 'Avant : mèche brune unie', after: 'Après : mèche illuminée par un balayage lumières et subtil' },
  { slug: 'balayage-eclat', title: 'Balayage Éclat & Intense', book: 'balayage-eclat-longs', before: 'Avant : mèche brune aux longueurs ternes', after: 'Après : mèche aux nuances lumineuses d’un balayage éclat et intense' },
  { slug: 'coupe', title: 'Coupe & brushing', book: 'femme-scb-milongs', before: 'Avant : longueurs irrégulières et pointes abîmées', after: 'Après : coupe nette et brushing lisse' },
  { slug: 'gloss', title: 'Gloss & brillance', book: 'couleur-scb-longs', before: 'Avant : mèche terne aux reflets cuivrés', after: 'Après : mèche brillante, reflets neutralisés par un gloss' },
];

function compare(ctx, item, index) {
  const image = (state) => ctx.asset(`assets/img/avant-apres/${item.slug}-${state}.svg`);
  return html`<figure class="compare" data-compare data-reveal style="--stagger:${index % 2}">
          <div class="compare__frame" data-cursor="Glisser" data-liquid>
            <img class="compare__img" src="${image('apres')}" alt="${item.after}" width="800" height="1000" loading="lazy" decoding="async">
            <img class="compare__img compare__img--before" src="${image('avant')}" alt="${item.before}" width="800" height="1000" loading="lazy" decoding="async">
            <span class="compare__tag">Avant</span>
            <span class="compare__tag compare__tag--after">Après</span>
            <span class="compare__line" aria-hidden="true"></span>
            <span class="compare__handle" aria-hidden="true">${icon('arrow-left')}${icon('arrow-right')}</span>
            <input class="compare__range" type="range" min="0" max="100" value="50" aria-label="${`Comparer avant et après : ${item.title}`}">
          </div>
          <figcaption>
            <span><strong>${item.title}</strong><small>${service(item.book).label} · ${durationOf(item.book)} · ${priceOf(item.book)}</small></span>
            <a class="link" href="${salon.links.planity}"${external} data-track="planity" data-cursor="Réserver">Je réserve ${icon('arrow-up-right')}</a>
          </figcaption>
        </figure>`;
}

export function beforeAfter(ctx, slugs = GALLERY.map((item) => item.slug), { titleTag = 'h2', title = html`Avant <em>/ après</em>`, intro = 'Glissez sur l’image pour comparer. Des transformations pensées pour chaque chevelure, jamais en série.', more = '' } = {}) {
  const items = slugs.map((slug) => GALLERY.find((item) => item.slug === slug));
  return html`<section class="section" aria-labelledby="ba-title">
      <header class="section__head section__head--split">
        ${kicker('Transformations')}
        ${raw(`<${titleTag} id="ba-title" data-split>${html`${title}`}</${titleTag}>`)}
        <p>${intro}</p>
      </header>
      <div class="${items.length === 1 ? 'compares compares--single' : 'compares'}">
        ${items.map((item, index) => compare(ctx, item, index))}
      </div>
      <div class="section__foot">
        ${more ? html`<a class="link" href="${more}">Voir toutes les réalisations ${icon('arrow-right')}</a>` : ''}
        <p class="note">Illustrations, en attendant les photos avant / après du salon.</p>
      </div>
    </section>`;
}

// ---------- Avis ----------

export function stars() {
  return html`<span class="stars" aria-hidden="true">${[1, 2, 3, 4, 5].map(() => html`<svg><use href="#i-star"/></svg>`)}</span>`;
}

export function rating({ title, titleTag = 'h2', id = 'avis-title' }) {
  return html`<div class="rating">
        <p class="rating__score" data-reveal>
          <span class="visually-hidden">Note moyenne : ${salon.rating.value} sur 5</span>
          <span class="rating__num" aria-hidden="true" data-count="${salon.rating.value.replace(',', '.')}">${salon.rating.value}</span><span class="rating__out" aria-hidden="true">/5</span>
        </p>
        <div class="rating__meta">
          ${kicker('Avis clients')}
          ${raw(`<${titleTag} id="${id}" data-split>${html`${title}`}</${titleTag}>`)}
          <p>${stars()} <strong>${salon.rating.planityCount} avis sur Planity</strong> · ${salon.rating.googleCount} avis sur Google</p>
          <dl class="subscores">
            ${salon.rating.subscores.map(([label, value]) => html`<div><dt>${label}</dt><dd>${value}</dd></div>`)}
          </dl>
        </div>
      </div>`;
}

export function quotes(list) {
  return html`<ul class="quotes">
        ${list.map((review, index) => html`<li class="quote" data-reveal style="--stagger:${index % 3}">
          <blockquote><p>${review.text}</p></blockquote>
          <p class="quote__meta">Avis Planity${review.service ? ` · ${review.service}` : ''} · ${review.date}</p>
        </li>`)}
      </ul>`;
}

export function reviewLinks() {
  return html`<a class="link" href="${salon.links.planity}"${external}>Tous les avis sur Planity ${icon('arrow-up-right')}</a>
        <a class="link" href="${salon.links.googleMaps}"${external}>Les avis Google ${icon('arrow-up-right')}</a>`;
}

// ---------- Instagram ----------

// Publications récupérées par tools/instagram.mjs (src/data/instagram.json). Sans flux : photos du site.
function instagramPosts() {
  try {
    return JSON.parse(readFileSync(new URL('../data/instagram.json', import.meta.url))).slice(0, 6);
  } catch {
    return [];
  }
}

export function instagram(ctx, { titleTag = 'h2' } = {}) {
  const posts = instagramPosts();
  const fallback = ['coupe', 'boucles', 'brushing', 'couleur', 'mise-en-forme', 'soin'];
  return html`<section class="section" aria-labelledby="insta-title">
      <div class="insta__head">
        <div>
          ${kicker('Instagram')}
          ${raw(`<${titleTag} id="insta-title" data-split>${html`Les dernières <em>réalisations</em>`}</${titleTag}>`)}
        </div>
        <a class="btn" href="${salon.links.instagram}"${external}>${icon('instagram')} Suivre @unbrundhair</a>
      </div>
      <ul class="insta">
        ${posts.length
          ? posts.map((post, index) => html`<li data-reveal style="--stagger:${index}"><a href="${post.permalink}"${external} aria-label="${`Voir la publication Instagram : ${post.caption || 'réalisation du salon'}`}"><img src="${post.image}" alt="${post.caption || ''}" width="400" height="400" loading="lazy" decoding="async"></a></li>`)
          : fallback.map((name, index) => html`<li data-reveal style="--stagger:${index}"><a href="${salon.links.instagram}"${external} aria-label="Voir le compte Instagram du salon">${photo(ctx, name, { sizes: '(min-width: 900px) 200px, 33vw' })}</a></li>`)}
      </ul>
      ${posts.length ? '' : html`<p class="note" style="margin-top:1rem">Photos d’illustration : le fil Instagram du salon s’affichera ici une fois relié (voir README).</p>`}
    </section>`;
}

// ---------- Horaires et accès ----------

const DAYS_LOWER = (name) => name.toLowerCase();
const timeOf = (hhmm) => {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return formatTime(hours * 60 + minutes);
};

// « Lundi de 10 h à 18 h, du mardi au vendredi de 9 h à 19 h… » : les jours qui se suivent avec les mêmes horaires sont regroupés.
export function hoursSentence() {
  const groups = [];
  salon.hours.forEach((day) => {
    const last = groups.at(-1);
    if (last && last.open === day.open && last.close === day.close) last.days.push(DAYS_LOWER(day.name));
    else groups.push({ open: day.open, close: day.close, days: [DAYS_LOWER(day.name)] });
  });
  const sentence = groups.map(({ open, close, days }) => {
    const when = days.length > 1 ? `du ${days[0]} au ${days.at(-1)}` : days[0];
    if (!open) return `fermé ${days.length > 1 ? when : `le ${when}`}`;
    return `${when} de ${timeOf(open)} à ${timeOf(close)}`;
  }).join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function hoursTable() {
  return html`<table class="hours" data-hours>
            <caption class="visually-hidden">Horaires d’ouverture</caption>
            <tbody>
              ${salon.hours.map((day) => html`<tr data-day="${day.day}"><th scope="row">${day.name}</th><td>${day.open ? html`${timeOf(day.open)} – ${timeOf(day.close)}${day.alternate ? html`<sup>*</sup>` : ''}` : 'Fermé'}</td></tr>`)}
            </tbody>
          </table>
          <p class="small"><sup>*</sup> Une semaine sur deux. <span data-alt-week></span> Les créneaux exacts sont sur Planity.</p>`;
}

// Plan du quartier : fond OpenStreetMap (tools/plan.py) et couche animée (rues principales, noms, repères).
const plan = JSON.parse(readFileSync(new URL('../data/plan.json', import.meta.url)));
const POI = { bus: ['bus', 'Bus E1'], parking: ['parking', 'Parking'], velo: ['bike', 'Vélos'] };

// Trajet à pied d’un repère jusqu’au salon : courbe douce, tracée à l’arrivée du plan.
function walk(poi, cx, cy, index) {
  const mx = (poi.x + cx) / 2 - (cy - poi.y) * 0.25;
  const my = (poi.y + cy) / 2 + (cx - poi.x) * 0.25;
  const d = `M${poi.x} ${poi.y} Q${mx.toFixed(0)} ${my.toFixed(0)} ${cx} ${cy - 4}`;
  return html`<mask id="plan-walk-${index}"><path class="plan__route-mask" d="${d}" pathLength="1" style="--delay:${(1.5 + index * 0.4).toFixed(1)}s"/></mask>
              <path class="plan__route" d="${d}" mask="url(#plan-walk-${index})"/>`;
}

// Le plan est zoomé ×1,5 autour du salon : fenêtre de 534 × 374 m au centre du fond de 800 × 560 m.
const ZOOM = { x: 133, y: 93, width: 534, height: 374 };

function planMap(ctx) {
  const cx = plan.width / 2;
  const cy = plan.height / 2;
  const right = ZOOM.x + ZOOM.width;
  const googleEmbed = `https://www.google.com/maps?q=${encodeURIComponent(`Un Brun d'Hair, ${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}`)}&output=embed`;
  const minutes = (poi) => Math.max(1, Math.round(poi.distance / 80));
  return html`<div class="plan" data-plan data-embed="${googleEmbed}" data-cursor="Explorer">
          <svg class="plan__overlay" viewBox="${ZOOM.x} ${ZOOM.y} ${ZOOM.width} ${ZOOM.height}" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="plan-desc">
            <desc id="plan-desc">Plan du quartier : le salon au ${salon.address.street}, à Aubière. L’arrêt de bus, le stationnement et les arceaux à vélos sont à une ou deux minutes à pied.</desc>
            <image class="plan__base" data-href="${ctx.asset('assets/img/plan-quartier.svg')}" x="0" y="0" width="${plan.width}" height="${plan.height}" preserveAspectRatio="none"/>
            <g class="plan__main">${plan.main.map((d) => html`<path d="${d}" pathLength="1"/>`)}</g>
            <g class="plan__layer">
              <defs>${plan.labels.map((label, index) => html`<path id="plan-street-${index}" d="${label.d}"/>`)}</defs>
              ${plan.labels.map((label, index) => html`<text class="plan__label" style="--delay:${(1.4 + index * 0.15).toFixed(2)}s"><textPath href="#plan-street-${index}" startOffset="50%" text-anchor="middle">${label.name}</textPath></text>`)}
              ${plan.pois.filter((poi) => poi.kind !== 'velo').map((poi, index) => walk(poi, cx, cy, index))}
              ${plan.pois.map((poi, index) => html`<g class="plan__poi" style="--delay:${(1.1 + index * 0.2).toFixed(1)}s">
                <title>${POI[poi.kind][1]} : à environ ${poi.distance} m du salon</title>
                <circle cx="${poi.x}" cy="${poi.y}" r="9"/>
                <use href="#i-${POI[poi.kind][0]}" x="${poi.x - 5.5}" y="${poi.y - 5.5}" width="11" height="11"/>
                <text x="${poi.x}" y="${poi.y + 19}" text-anchor="middle">${POI[poi.kind][1]} · ${minutes(poi)} min</text>
              </g>`)}
              <g class="plan__salon" style="--delay:.7s">
                <circle class="halo" cx="${cx}" cy="${cy}" r="18"/>
                <path class="pin" d="M${cx} ${cy + 2} c-6 -7.5 -10 -12 -10 -17.5 a10 10 0 0 1 20 0 c0 5.5 -4 10 -10 17.5z"/>
                <text class="pin__mark" x="${cx}" y="${cy - 11}" text-anchor="middle">B</text>
                <text x="${cx}" y="${cy + 22}" text-anchor="middle">Un Brun d’Hair</text>
              </g>
              <g class="plan__north" transform="translate(${right - 34} ${ZOOM.y + 30})"><path d="M0 -10 L4.5 4.5 L0 1.5 L-4.5 4.5Z"/><text y="16" text-anchor="middle">N</text></g>
              <g class="plan__scale" transform="translate(${right - 134} ${ZOOM.y + 66})"><line x1="0" y1="0" x2="100" y2="0"/><line x1="0" y1="-3" x2="0" y2="3"/><line x1="100" y1="-3" x2="100" y2="3"/><text x="50" y="-6" text-anchor="middle">100 m</text></g>
            </g>
          </svg>
          <div class="plan__bar">
            <button class="btn btn--sm" type="button" data-plan-google>${icon('pin')} Ouvrir Google Maps ici</button>
            <span class="plan__credit">© <a href="https://www.openstreetmap.org/copyright"${external}>OpenStreetMap</a></span>
          </div>
        </div>`;
}

function directions() {
  return html`<div class="directions">
            <a class="btn btn--sm" href="${salon.links.googleDirections}"${external} data-track="itineraire">Google Maps</a>
            <a class="btn btn--sm" href="${salon.links.waze}"${external} data-track="itineraire">Waze</a>
            <a class="btn btn--sm" href="${salon.links.applePlans}"${external} data-track="itineraire">Plans</a>
          </div>`;
}

export function visit(ctx, { titleTag = 'h2', title = html`Venir <em>au salon</em>`, kickerText = 'Contact & accès' } = {}) {
  const { access } = salon;
  return html`<section id="acces" class="section" aria-labelledby="visit-title">
      <header class="section__head">
        ${kicker(kickerText)}
        ${raw(`<${titleTag} id="visit-title" data-split>${html`${title}`}</${titleTag}>`)}
      </header>
      <div class="visit">
        <div data-reveal>
          ${planMap(ctx)}
        </div>
        <div class="visit__info">
          <div>
            <address class="visit__address">${salon.address.street}<br>${salon.address.postalCode} ${salon.address.city}<small>${access.landmark}, près du campus des Cézeaux.</small></address>
          </div>
          <div class="actions">
            ${bookButton('Je réserve', 'btn btn--primary btn--sm')}
            ${phoneLink('btn btn--sm', salon.phone.display)}
          </div>
          <div>
            <h3 class="visit__label">Accès</h3>
            <ul class="access">
              <li>${icon('bus')}<span>${access.bus}</span></li>
              <li>${icon('parking')}<span>${access.parking}</span></li>
              <li>${icon('bike')}<span>${access.bike}</span></li>
            </ul>
          </div>
          <div>
            <h3 class="visit__label">Itinéraire</h3>
            ${directions()}
          </div>
          <div>
            <h3 class="visit__label">Horaires</h3>
            <p class="status" data-open-status>Du lundi au samedi, sur rendez-vous</p>
            ${hoursTable()}
          </div>
        </div>
      </div>
    </section>`;
}

// ---------- Tarifs ----------

export function lengthsLegend() {
  return html`<ul class="lengths">
            <li><strong>Courts</strong> au niveau de l’oreille</li>
            <li><strong>Mi-longs</strong> au-dessus de l’épaule</li>
            <li><strong>Longs</strong> en-dessous de l’épaule</li>
          </ul>`;
}

export function diagnosticWarning(ctx) {
  const route = 'diagnostic-capillaire-aubiere/';
  const more = ctx.route === route ? '' : html` <a href="${ctx.rel(route)}">Tout savoir sur le diagnostic</a>`;
  return html`<aside class="warning">
              ${icon('warning')}
              <div>
                <p class="warning__title">Obligatoire avant un balayage ou un éclaircissement</p>
                <p>Une consultation préalable permet d’analyser votre chevelure et de construire un projet réalisable. Elle ne peut pas avoir lieu le même jour que la prestation technique.${more}</p>
              </div>
            </aside>`;
}

function priceRow(item) {
  const sign = item.option ? '+' : '';
  return html`<li class="${item.option ? 'row row--option' : 'row'}">
                <span class="row__name">${item.label}${item.sub ? html`<small>${item.sub}</small>` : ''}</span>
                <span class="row__time">${sign}${formatDuration(item.duration)}</span>
                <span class="row__price">${item.from ? html`<small>dès</small>` : ''}${`${sign}${item.price} €`}</span>
              </li>`;
}

export function priceCategory(ctx, id, { headingTag = 'h3', pageLink = false } = {}) {
  const cat = category(id);
  const heading = raw(`<${headingTag}>${html`${cat.title}${cat.titleAccent ? html` <em>${cat.titleAccent}</em>` : ''}`}</${headingTag}>`);
  const groupTag = headingTag === 'h2' ? 'h3' : 'h4';
  const groups = cat.groups.map((group) => {
    const rows = html`<ul class="rows">${group.services.map(priceRow)}</ul>`;
    if (!group.title) return rows;
    return html`<div class="group">
              ${raw(`<${groupTag} class="group__title">${html`${group.title}`}</${groupTag}>`)}
              ${group.description ? html`<p class="group__desc">${group.description}</p>` : ''}
              ${rows}
            </div>`;
  });
  return html`<article id="${cat.anchor || `cat-${cat.id}`}" class="cat">
          <header class="cat__head">
            ${heading}
            <p>${cat.description}</p>
            ${cat.tip ? html`<p class="cat__tip">${cat.tip}</p>` : ''}
            ${cat.alert ? html`<p class="cat__tip cat__tip--alert">${cat.alert} <a href="${ctx.rel('diagnostic-capillaire-aubiere/')}">Le diagnostic</a></p>` : ''}
            ${pageLink && cat.page ? html`<a class="link" href="${ctx.rel(cat.page)}${cat.anchor ? `#${cat.anchor}` : ''}">En savoir plus ${icon('arrow-right')}</a>` : ''}
          </header>
          <div>
            ${groups}
            ${cat.id === 'diagnostic' ? diagnosticWarning(ctx) : ''}
          </div>
        </article>`;
}

// ---------- Questions fréquentes ----------

export function faqList(items) {
  return html`<div class="faq__list">
        ${items.map((item) => html`<details class="faq__item">
          <summary>${item.q}${icon('plus')}</summary>
          <div class="faq__answer"><p>${item.a}</p></div>
        </details>`)}
      </div>`;
}

export function faq(items, { title = html`Vos <em>questions</em>`, id = 'faq', more } = {}) {
  return html`<section class="section" aria-labelledby="${id}-title">
      <div class="faq">
        <header>
          ${kicker('Questions fréquentes')}
          <h2 id="${id}-title" data-split>${title}</h2>
          ${more ? html`<p style="margin-top:1.5rem">${more}</p>` : ''}
        </header>
        ${faqList(items)}
      </div>
    </section>`;
}

export const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
});

// ---------- Bandeau final ----------

export function cta({ title = html`On se <em>rencontre</em> ?`, text = 'Choisissez votre prestation et le créneau qui vous arrange sur Planity : la confirmation est immédiate.' } = {}) {
  return html`<div class="has-ribbon" data-ambient="dark">
    ${orbs()}
    <section class="section cta" aria-labelledby="cta-title">
      ${kicker('Réservation')}
      <h2 id="cta-title" data-split>${title}</h2>
      <p>${text}</p>
      <div class="actions" style="justify-content:center">
        ${bookButton('Je réserve sur Planity')}
        ${phoneLink('btn', 'Appeler')}
      </div>
    </section>
  </div>`;
}

// ---------- Liens internes ----------

export const PAGES = {
  'coupe-femme-aubiere/': ['Coupe femme', 'Coupe et brushing'],
  'coupe-homme-aubiere/': ['Coupe homme & enfant', 'Forfait homme, moins de 12 ans'],
  'coloration-aubiere/': ['Coloration & gloss', 'Racines, éclat, cheveux blancs'],
  'balayage-aubiere/': ['Balayage', 'Lumières & Subtil, Éclat & Intense'],
  'soin-capillaire-aubiere/': ['Soins Davines', 'Le soin adapté à vos cheveux'],
  'diagnostic-capillaire-aubiere/': ['Diagnostic capillaire', '15 minutes pour définir votre projet'],
  'tarifs/': ['Tous les tarifs', 'La carte complète'],
  'conseil-coupe/': ['Quelle coupe pour moi ?', 'Le questionnaire en 2 minutes'],
  'boutique/': ['La boutique Davines', 'Click and collect au salon'],
  'carte-cadeau/': ['Carte cadeau', 'Offrir un moment au salon'],
  'qui-suis-je/': ['Qui suis-je ?', 'Sandy, votre coiffeuse'],
  'realisations/': ['Réalisations', 'Coupes, couleurs, balayages'],
  'avis/': ['Avis clients', `${salon.rating.value}/5 sur Planity`],
  'faq/': ['Questions fréquentes', 'Réservation, prestations, boutique'],
  'contact/': ['Contact & accès', 'Plan, horaires, stationnement'],
};

export function related(ctx, routes, { title = html`À voir <em>aussi</em>` } = {}) {
  return html`<section class="section" aria-labelledby="related-title">
      <header class="section__head">
        <h2 id="related-title" class="h3">${title}</h2>
      </header>
      <ul class="related">
        ${routes.map((route) => html`<li><a href="${ctx.rel(route)}"><span>${PAGES[route][0]}<small>${PAGES[route][1]}</small></span>${icon('arrow-right')}</a></li>`)}
      </ul>
    </section>`;
}

// ---------- Produits ----------

export const bottle = (item) => raw(bottleSvg(item, lines[item.line].tint));

export function productMini(ctx, ids) {
  return html`<ul class="pmini">
        ${ids.map(product).map((item) => html`<li data-reveal><a href="${ctx.rel('boutique/')}#${item.id}">
          ${bottle(item)}
          <span><strong>${item.name}</strong><span>${item.size} · ${item.price.toFixed(2).replace('.', ',')} €</span></span>
        </a></li>`)}
      </ul>`;
}

// ---------- Alerte dernière minute ----------

export function flash(ctx) {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return html`<section id="derniere-minute" class="section" aria-labelledby="flash-title">
      <div class="flash-card">
        <div>
          ${kicker('Alerte annulations')}
          <h2 id="flash-title" data-split>Un créneau <em>se libère</em> ?</h2>
          <p class="lead" style="margin-top:1.25rem">Inscrivez-vous : on vous prévient en priorité, par SMS ou par e-mail, quand un rendez-vous est annulé.</p>
          <ul class="ticks">
            <li>${icon('check')} Gratuit et sans engagement</li>
            <li>${icon('check')} Uniquement des créneaux libérés, jamais de publicité</li>
            <li>${icon('check')} Désinscription sur simple message</li>
          </ul>
        </div>

        <form class="form" data-flash-form novalidate>
          <fieldset>
            <legend>On vous prévient par</legend>
            <div class="pills">
              <label><input type="radio" name="canal" value="sms" checked><span>SMS</span></label>
              <label><input type="radio" name="canal" value="email"><span>E-mail</span></label>
            </div>
          </fieldset>
          <div class="field">
            <label for="flash-contact" data-contact-label>Votre numéro de mobile</label>
            <input id="flash-contact" class="input" name="contact" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78" required aria-describedby="flash-contact-error">
            <p id="flash-contact-error" class="field__error" data-error-for="contact" hidden></p>
          </div>
          <div class="field">
            <label for="flash-name">Prénom <span class="optional">(facultatif)</span></label>
            <input id="flash-name" class="input" name="prenom" type="text" autocomplete="given-name">
          </div>
          <div class="field">
            <label for="flash-service">Prestation souhaitée</label>
            <select id="flash-service" class="input" name="prestation">
              ${['Peu importe', 'Coupe & brushing femme', 'Brushing', 'Couleur ou gloss', 'Balayage', 'Coupe homme', 'Coupe enfant', 'Diagnostic'].map((option) => html`<option>${option}</option>`)}
            </select>
          </div>
          <fieldset>
            <legend>Vos jours possibles</legend>
            <div class="pills">
              ${days.map((day) => html`<label><input type="checkbox" name="jours" value="${day}"><span>${day.slice(0, 3)}.</span></label>`)}
            </div>
          </fieldset>
          <fieldset>
            <legend>Plutôt</legend>
            <div class="pills">
              ${['Peu importe', 'Le matin', 'L’après-midi'].map((moment, index) => html`<label><input type="radio" name="moment" value="${moment}"${index === 0 ? raw(' checked') : ''}><span>${moment}</span></label>`)}
            </div>
          </fieldset>
          <p class="trap" aria-hidden="true"><label>Ne pas remplir <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
          <label class="consent">
            <input type="checkbox" name="consentement" required aria-describedby="flash-consent-error">
            <span>J’accepte qu’Un Brun d’Hair me contacte au sujet des créneaux libérés. Désinscription possible à tout moment.</span>
          </label>
          <p id="flash-consent-error" class="field__error" data-error-for="consentement" hidden></p>
          <button class="btn btn--primary btn--block" type="submit">M’inscrire à l’alerte</button>
          <p class="form-note">Vos coordonnées servent uniquement à vous prévenir d’un créneau libéré. <a href="${ctx.rel('confidentialite/')}">Données personnelles</a></p>
        </form>

        <div class="done" data-flash-done hidden tabindex="-1">
          <p class="done__title">C’est noté.</p>
          <p data-flash-done-message></p>
        </div>
      </div>
    </section>`;
}

