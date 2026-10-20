// Composants réutilisables des pages. Chaque fonction renvoie du HTML (html`…`).
// `ctx` décrit la page en cours : ctx.rel(route) donne un lien relatif, ctx.asset(chemin) un fichier.
import { html, raw } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { category, service, startingPrice, priceOf, durationOf } from '../data/services.mjs';
import { formatDuration } from '../../assets/js/lib/format.js';
import { icon } from './icons.mjs';

const ACCENTED = /[ÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]/;

// Largeur approximative d’une ligne en capitales Archivo ExtraCondensed Black, en em.
// Sert à réduire un titre dont une ligne dépasse 4,5 em (la largeur prévue par base.css).
function lineWidth(line) {
  return [...line.toUpperCase()].reduce((sum, char) => {
    if (char === ' ') return sum + 0.22;
    if ('IJ’\'.,;:!?/-'.includes(char)) return sum + 0.26;
    if ('MW'.includes(char)) return sum + 0.62;
    return sum + 0.47;
  }, 0);
}
const external = raw(' target="_blank" rel="noopener"');

export const whatsappUrl = () => (salon.whatsapp ? `https://wa.me/${salon.whatsapp}?text=${encodeURIComponent(salon.whatsappMessage)}` : '');

// ---------- Titres ----------

export function kicker(text, num) {
  return html`<p class="kicker">${num ? html`<span class="kicker__num">${num}</span> ` : ''}${text}</p>`;
}

// Titre d’affichage sur plusieurs lignes. Une ligne avec une capitale accentuée (À, É…)
// reçoit .line--accent, sauf la première : sinon l’accent toucherait la ligne du dessus.
export function displayTitle(lines, { tag = 'h2', id, className = '', reveal = true } = {}) {
  const spans = lines.map((line, index) => {
    const accent = index > 0 && ACCENTED.test(line.toUpperCase());
    return html`<span class="${accent ? 'line line--accent' : 'line'}">${line}</span>`;
  });
  const widest = Math.max(...lines.map(lineWidth));
  const fit = widest > 4.4 ? html` style="--fit: ${(widest * 1.04).toFixed(2)}"` : '';
  const attrs = html`${id ? html` id="${id}"` : ''} class="${`display ${className}`.trim()}"${fit}${reveal ? raw(' data-reveal="lines"') : ''}`;
  return raw(`<${tag}${attrs}>${spans.map(String).join(' ')}</${tag}>`);
}

// ---------- Boutons ----------

export function ring(id, text, { radius = 80, length = 500 } = {}) {
  const d = `M100,100 m-${radius},0 a${radius},${radius} 0 1,1 ${radius * 2},0 a${radius},${radius} 0 1,1 -${radius * 2},0`;
  return html`<svg class="ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="${id}" d="${d}"/></defs><text><textPath href="#${id}" textLength="${length}">${text}</textPath></text></svg>`;
}

// Bouton rond magenta. `book` ouvre le tunnel de réservation (identifiant de prestation ou de catégorie).
export function circleLink({ id, ringText, label, iconName = 'arrow-right', book, href = salon.links.planity, newTab = false }) {
  return html`<a class="btn-circle btn-circle--xl" href="${href}"${book === undefined ? '' : html` data-book="${book}"`}${newTab ? external : ''} data-magnetic data-track="planity">
          ${ring(id, ringText)}
          ${icon(iconName, 'icon--lg')}
          <span class="visually-hidden">${label}</span>
        </a>`;
}

export function phoneLink(className = 'link-arrow', text = salon.phone.display) {
  return html`<a class="${className}" href="tel:${salon.phone.tel}" data-track="phone">${icon('phone')} ${text}</a>`;
}

export function actionLinks() {
  const whatsapp = whatsappUrl();
  return html`<ul class="action-links">
          <li><a class="link-arrow" href="${salon.links.planity}"${external} data-track="planity">Réserver sur Planity ${icon('arrow-up-right')}</a></li>
          <li>${phoneLink('link-arrow', `Appeler le ${salon.phone.display}`)}</li>
          ${whatsapp ? html`<li><a class="link-arrow" href="${whatsapp}"${external} data-track="whatsapp">${icon('whatsapp')} Écrire sur WhatsApp</a></li>` : ''}
          <li><a class="link-arrow" href="${salon.links.googleDirections}"${external} data-track="itineraire">${icon('navigation')} Itinéraire</a></li>
        </ul>`;
}

// ---------- En-tête des pages intérieures ----------

export function pageHero(ctx, { kicker: kickerText, lines, lead, book, bookLabel, secondary }) {
  return html`<section class="page-hero" aria-labelledby="page-title">
      ${kicker(kickerText)}
      ${displayTitle(lines, { tag: 'h1', id: 'page-title', className: 'page-hero__title', reveal: false })}
      <p class="lead page-hero__lead">${lead}</p>
      <div class="page-hero__actions" data-fab-hide>
        <a class="btn btn--solid" href="${salon.links.planity}" data-book="${book || ''}" data-track="planity">${bookLabel || 'Réserver'} ${icon('arrow-right')}</a>
        ${phoneLink('btn', 'Appeler')}
        ${secondary ? html`<a class="link-arrow" href="${ctx.rel(secondary.route)}">${secondary.label} ${icon('arrow-right')}</a>` : ''}
      </div>
    </section>`;
}

// ---------- Tarifs ----------

export function lengthsLegend() {
  return html`<ul class="lengths">
            <li>${icon('len-courts', 'icon--len')}<span><strong>Courts</strong> au niveau de l’oreille</span></li>
            <li>${icon('len-milongs', 'icon--len')}<span><strong>Mi-longs</strong> au-dessus de l’épaule</span></li>
            <li>${icon('len-longs', 'icon--len')}<span><strong>Longs</strong> en-dessous de l’épaule</span></li>
          </ul>`;
}

export function diagnosticWarning(ctx) {
  const route = 'diagnostic-capillaire-aubiere/';
  const more = ctx.route === route ? '' : html` <a href="${ctx.rel(route)}">Tout savoir sur le diagnostic</a>`;
  return html`<aside class="warning">
              ${icon('warning', 'warning__icon')}
              <div>
                <p class="warning__title">Obligatoire avant un balayage ou un éclaircissement</p>
                <p>Pour tout balayage ou changement de couleur nécessitant un éclaircissement, une consultation préalable est obligatoire : elle permet d’analyser votre chevelure et de construire un projet réalisable. Elle ne peut pas être réservée le même jour que la prestation technique.${more}</p>
              </div>
            </aside>`;
}

function priceRow(item) {
  const sign = item.option ? '+' : '';
  return html`<li class="${item.option ? 'row row--option' : 'row'}">
                <span class="row__name">${item.len ? icon(`len-${item.len}`, 'icon--len') : ''}${item.label}${item.sub ? html`<small>${item.sub}</small>` : ''}</span>
                <span class="row__time">${sign}${formatDuration(item.duration)}</span>
                <span class="row__price">${item.from ? html`<small>dès</small>` : ''}${`${sign}${item.price} €`}</span>
                ${item.option ? '' : html`<a class="row__add" href="${salon.links.planity}" data-book="${item.id}" data-track="planity" aria-label="${`Réserver : ${item.name}`}">${icon('plus')}</a>`}
              </li>`;
}

export function priceCategory(ctx, id, { num, headingTag = 'h3', pageLink = false } = {}) {
  const cat = category(id);
  const heading = raw(`<${headingTag} class="cat__title">${html`${cat.title}${cat.titleAccent ? html` <span>${cat.titleAccent}</span>` : ''}`}</${headingTag}>`);
  const groups = cat.groups.map((group) => {
    const rows = html`<ul class="rows">${group.services.map(priceRow)}</ul>`;
    if (!group.title) return rows;
    const groupTag = headingTag === 'h2' ? 'h3' : 'h4';
    return html`<div class="group">
              ${raw(`<${groupTag} class="group__title">${html`${group.title}`}</${groupTag}>`)}
              ${group.description ? html`<p class="group__desc">${group.description}</p>` : ''}
              ${rows}
            </div>`;
  });
  return html`<article id="${cat.anchor || `cat-${cat.id}`}" class="${cat.highlight ? 'cat cat--highlight' : 'cat'}">
          <header class="cat__head" data-reveal>
            ${num ? html`<p class="cat__num" aria-hidden="true">${num}</p>` : ''}
            ${heading}
            <p class="cat__desc">${cat.description}</p>
            ${cat.tip ? html`<p class="cat__tip">${cat.tip}</p>` : ''}
            ${cat.alert ? html`<p class="cat__tip cat__tip--alert">${icon('warning')} ${cat.alert} <a href="${ctx.rel('diagnostic-capillaire-aubiere/')}">Le diagnostic</a></p>` : ''}
            ${pageLink && cat.page ? html`<a class="link-arrow cat__more" href="${ctx.rel(cat.page)}${cat.anchor ? `#${cat.anchor}` : ''}">En savoir plus ${icon('arrow-right')}</a>` : ''}
          </header>
          <div class="cat__body">
            ${groups}
            ${cat.id === 'diagnostic' ? diagnosticWarning(ctx) : ''}
          </div>
        </article>`;
}

// ---------- Bandeau de réservation (fin de page) ----------

export function ctaBand({ id = 'cta', lines, text, book = '', label = 'Réserver' }) {
  return html`<section class="section cta-band" aria-labelledby="${id}-title" data-fab-hide>
      <div class="cta-band__inner">
        <div class="cta-band__text">
          ${displayTitle(lines, { id: `${id}-title` })}
          <p>${text}</p>
        </div>
        <div class="cta-band__actions">
          ${circleLink({ id: `ring-${id}`, ringText: 'RÉSERVER · EN 3 CLICS · RÉSERVER · EN 3 CLICS ·', label, book })}
          ${actionLinks()}
        </div>
      </div>
    </section>`;
}

// ---------- Questions fréquentes ----------

export function faq(items, { lines = ['Vos', 'questions.'], id = 'faq' } = {}) {
  return html`<section class="section faq" aria-labelledby="${id}-title">
      <header class="section__head">
        ${kicker('Questions fréquentes')}
        ${displayTitle(lines, { id: `${id}-title` })}
      </header>
      <div class="faq__list">
        ${items.map((item) => html`<details class="faq__item">
          <summary>${item.q}${icon('chevron', 'faq__chevron')}</summary>
          <div class="faq__answer"><p>${item.a}</p></div>
        </details>`)}
      </div>
    </section>`;
}

export const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
});

// ---------- Avis ----------

export function quotes(list) {
  return html`<ul class="quotes">
        ${list.map((review) => html`<li class="quote" data-reveal>
          <blockquote><p>${review.text}</p></blockquote>
          <p class="quote__meta">Avis Planity${review.service ? ` · ${review.service}` : ''} · ${review.date}</p>
        </li>`)}
      </ul>`;
}

export function stars(className = 'stars') {
  return html`<span class="${className}" aria-hidden="true">${[1, 2, 3, 4, 5].map(() => html`<svg><use href="#i-star"/></svg>`)}</span>`;
}

export function rating({ lines, titleTag = 'h2', titleId = 'avis-title' }) {
  return html`<div class="avis__top">
        <div class="avis__score" data-reveal>
          <p class="avis__big">
            <span class="visually-hidden">Note moyenne : ${salon.rating.value} sur 5</span>
            <span class="avis__num" aria-hidden="true" data-count-to="${salon.rating.value.replace(',', '.')}">${salon.rating.value}</span><span class="avis__out" aria-hidden="true">/5</span>
          </p>
          <p class="stars stars--lg" aria-hidden="true">${[1, 2, 3, 4, 5].map(() => html`<svg><use href="#i-star"/></svg>`)}</p>
          <p class="avis__count"><strong>${salon.rating.planityCount} avis sur Planity</strong> · ${salon.rating.googleCount} avis sur Google</p>
        </div>
        <div class="avis__head">
          ${displayTitle(lines, { tag: titleTag, id: titleId })}
          <dl class="subscores">
            ${salon.rating.subscores.map(([label, value]) => html`<div><dt>${label}</dt><dd>${value}</dd></div>`)}
          </dl>
          <p class="small">Notes détaillées des avis Planity.</p>
        </div>
      </div>`;
}

export function reviewLinks() {
  return html`<ul class="avis__links">
        <li><a class="link-arrow" href="${salon.links.planity}"${external}>Tous les avis sur Planity ${icon('arrow-up-right')}</a></li>
        <li><a class="link-arrow" href="${salon.links.googleMaps}"${external}>Les avis Google ${icon('arrow-up-right')}</a></li>
      </ul>`;
}

// ---------- Avant / après ----------

// Légende : longueur, durée et prix de la prestation `book`, lus dans la carte des prestations.
export const GALLERY = [
  { slug: 'balayage-lumieres', title: 'Balayage Lumières & Subtil', book: 'balayage-lumieres-longs', before: 'Avant : mèche brune unie', after: 'Après : mèche illuminée par un balayage lumières et subtil', modifier: 'a' },
  { slug: 'balayage-eclat', title: 'Balayage Éclat & Intense', book: 'balayage-eclat-longs', before: 'Avant : mèche brune aux longueurs ternes', after: 'Après : mèche aux nuances lumineuses d’un balayage éclat et intense', modifier: 'b' },
  { slug: 'coupe', title: 'Coupe & brushing', book: 'femme-scb-milongs', before: 'Avant : longueurs irrégulières et pointes abîmées', after: 'Après : coupe nette et brushing lisse', modifier: 'c' },
  { slug: 'gloss', title: 'Gloss & brillance', book: 'couleur-scb-longs', before: 'Avant : mèche terne aux reflets cuivrés', after: 'Après : mèche brillante, reflets neutralisés par un gloss', modifier: 'd' },
];

const galleryMeta = (item) => `${service(item.book).label} · ${durationOf(item.book)} · ${priceOf(item.book)}`;

export function compare(ctx, item, modifier = item.modifier) {
  const image = (state) => ctx.asset(`assets/img/avant-apres/${item.slug}-${state}.svg`);
  return html`<figure class="compare compare--${modifier}" data-compare data-reveal>
          <div class="compare__frame" data-cursor="Glisser">
            <img class="compare__img" src="${image('apres')}" alt="${item.after}" width="800" height="1000" loading="lazy" decoding="async">
            <img class="compare__img compare__img--before" src="${image('avant')}" alt="${item.before}" width="800" height="1000" loading="lazy" decoding="async">
            <span class="compare__tag">Avant</span>
            <span class="compare__tag compare__tag--after">Après</span>
            <span class="compare__line" aria-hidden="true"></span>
            <span class="compare__handle" aria-hidden="true">${icon('drag')}</span>
            <input class="compare__range" type="range" min="0" max="100" value="50" aria-label="${`Comparer avant et après : ${item.title}`}">
          </div>
          <figcaption>
            <span class="compare__title">${item.title}</span>
            <span class="compare__meta">${galleryMeta(item)}</span>
            <a class="link-arrow" href="${salon.links.planity}" data-book="${item.book}" data-track="planity">Réserver ${icon('arrow-right')}</a>
          </figcaption>
        </figure>`;
}

export function gallery(ctx, items, { lines = ['Avant', '/ après.'], kickerText = 'Transformations', intro, more = true, allLink = false, titleTag = 'h2' } = {}) {
  const modifiers = ['a', 'b', 'c', 'd'];
  return html`<section class="section gallery" aria-labelledby="gallery-title">
      <header class="section__head gallery__head">
        <div>
          ${kicker(kickerText)}
          ${displayTitle(lines, { tag: titleTag, id: 'gallery-title' })}
        </div>
        <p class="gallery__intro" data-reveal>${intro || 'Balayages, couleurs, coupes : des transformations pensées pour chaque chevelure, jamais en série. Glissez pour comparer.'}</p>
      </header>
      <div class="gallery__grid">
        ${items.map((item, index) => compare(ctx, item, modifiers[index % 4]))}
      </div>
      ${more ? html`<p class="gallery__more" data-reveal>Toutes les réalisations, en photo et en vidéo : <a href="${salon.links.instagram}"${external}>Instagram</a> et <a href="${salon.links.tiktok}"${external}>TikTok</a>, @unbrundhair.</p>` : ''}
      ${allLink ? html`<p class="gallery__more" data-reveal><a class="link-arrow" href="${ctx.rel('galerie/')}">Voir toutes les transformations ${icon('arrow-right')}</a></p>` : ''}
    </section>`;
}

// ---------- Horaires et accès ----------

// « Lundi de 10:00 à 18:00, du mardi au vendredi de 09:00 à 19:00… » : les jours qui se suivent avec les mêmes horaires sont regroupés.
export function hoursSentence() {
  const groups = [];
  salon.hours.forEach((day) => {
    const last = groups.at(-1);
    if (last && last.open === day.open && last.close === day.close) last.days.push(day.name.toLowerCase());
    else groups.push({ open: day.open, close: day.close, days: [day.name.toLowerCase()] });
  });
  const sentence = groups.map(({ open, close, days }) => {
    const when = days.length > 1 ? `du ${days[0]} au ${days.at(-1)}` : days[0];
    if (!open) return `fermé ${days.length > 1 ? when : `le ${when}`}`;
    return `${when} de ${open} à ${close}`;
  }).join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function hoursTable() {
  return html`<table class="hours" data-hours>
            <caption class="visually-hidden">Horaires d’ouverture</caption>
            <tbody>
              ${salon.hours.map((day) => html`<tr data-day="${day.day}"><th scope="row">${day.name}</th><td>${day.open ? `${day.open} – ${day.close}` : 'Fermé'}</td></tr>`)}
            </tbody>
          </table>`;
}

export function directions() {
  return html`<ul class="directions">
            <li><a class="btn" href="${salon.links.googleDirections}"${external} data-track="itineraire">${icon('navigation')} Google Maps</a></li>
            <li><a class="btn" href="${salon.links.waze}"${external} data-track="itineraire">${icon('navigation')} Waze</a></li>
            <li><a class="btn" href="${salon.links.applePlans}"${external} data-track="itineraire">${icon('navigation')} Plans</a></li>
            <li><a class="btn" href="${salon.links.planity}"${external} data-track="planity">${icon('arrow-up-right')} Planity</a></li>
          </ul>`;
}

export function visit(ctx, { titleTag = 'h2', kickerText = 'Venir au salon', map = true } = {}) {
  return html`<section class="section visit" aria-labelledby="visit-title" data-fab-hide>
      <header class="section__head">
        ${kicker(kickerText)}
        ${displayTitle(['4 bis rue', 'Champvoisin'], { tag: titleTag, id: 'visit-title', className: 'visit__title' })}
        <p class="visit__city">63170 Aubière <span>— à 3,7 km de Clermont-Ferrand, près du campus des Cézeaux</span></p>
      </header>
      <div class="${map ? 'visit__grid' : 'visit__grid visit__grid--nomap'}">
        ${map ? html`<div class="map" data-map data-lat="${salon.geo.lat}" data-lng="${salon.geo.lng}">
          <a class="map__fallback" href="${salon.links.googleMaps}"${external}>
            ${icon('pin', 'icon--lg')}
            <span>Voir le plan</span>
          </a>
        </div>` : ''}
        <div class="visit__info">
          <h3 class="visit__label">Itinéraire</h3>
          ${directions()}
          ${phoneLink('btn btn--solid', 'Appeler le salon')}
        </div>
        <div class="visit__info">
          <h3 class="visit__label">Horaires</h3>
          <p class="status-pill" data-open-status>Du lundi au samedi, sur rendez-vous</p>
          ${hoursTable()}
          <p class="small">${salon.hoursNote}</p>
          <p class="small">Paiement : ${salon.payment.toLowerCase()}.</p>
        </div>
      </div>
    </section>`;
}

// ---------- Alerte dernière minute ----------

export function flash(ctx) {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return html`<section id="flash" class="section flash" aria-labelledby="flash-title" data-fab-hide>
      <div class="flash__card">
        <div class="flash__intro">
          <p class="kicker">Alerte annulations ${icon('bolt', 'flash__bolt')}</p>
          ${displayTitle(['Dernière', 'minute.'], { id: 'flash-title' })}
          <p class="flash__text">Un rendez-vous annulé, un créneau qui se libère ? Inscrivez-vous : on vous prévient en priorité, par SMS ou par e-mail, et vous réservez avant tout le monde.</p>
          <ul class="ticks">
            <li>${icon('check')} Gratuit et sans engagement</li>
            <li>${icon('check')} Uniquement des créneaux libérés, jamais de publicité</li>
            <li>${icon('check')} Désinscription sur simple message</li>
          </ul>
        </div>

        <form class="flash__form" data-flash-form novalidate>
          <fieldset class="segmented">
            <legend>On vous prévient par</legend>
            <label><input type="radio" name="canal" value="sms" checked><span>SMS</span></label>
            <label><input type="radio" name="canal" value="email"><span>E-mail</span></label>
          </fieldset>
          <div class="field">
            <label for="flash-contact" data-contact-label>Votre numéro de mobile</label>
            <input id="flash-contact" class="input" name="contact" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78" required aria-describedby="flash-contact-error">
            <p id="flash-contact-error" class="field__error" data-error-for="contact" hidden></p>
          </div>
          <div class="field">
            <label for="flash-name">Prénom</label>
            <input id="flash-name" class="input" name="prenom" type="text" autocomplete="given-name">
          </div>
          <div class="field">
            <label for="flash-service">Prestation souhaitée</label>
            <select id="flash-service" class="input" name="prestation">
              ${['Peu importe', 'Coupe & brushing femme', 'Brushing', 'Couleur ou gloss', 'Balayage', 'Coupe homme', 'Coupe enfant', 'Diagnostic'].map((option) => html`<option>${option}</option>`)}
            </select>
          </div>
          <fieldset class="checks">
            <legend>Vos jours possibles</legend>
            ${days.map((day) => html`<label><input type="checkbox" name="jours" value="${day}"><span>${day.slice(0, 3)}</span></label>`)}
          </fieldset>
          <fieldset class="checks">
            <legend>Plutôt</legend>
            ${['Peu importe', 'Le matin', 'L’après-midi'].map((moment, index) => html`<label><input type="radio" name="moment" value="${moment}"${index === 0 ? raw(' checked') : ''}><span>${moment}</span></label>`)}
          </fieldset>
          <p class="visually-hidden" aria-hidden="true"><label>Ne pas remplir <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
          <label class="consent">
            <input type="checkbox" name="consentement" required aria-describedby="flash-consent-error">
            <span>J’accepte qu’Un Brun d’Hair me contacte au sujet des créneaux libérés. Désinscription possible à tout moment.</span>
          </label>
          <p id="flash-consent-error" class="field__error" data-error-for="consentement" hidden></p>
          <button class="btn btn--solid btn--block" type="submit">${icon('bolt')} M’inscrire à l’alerte</button>
          <p class="form-note">Vos coordonnées servent uniquement à vous prévenir d’un créneau libéré. <a href="${ctx.rel('confidentialite/')}">Données personnelles</a></p>
        </form>

        <div class="flash__done" data-flash-done hidden tabindex="-1">
          <p class="display flash__done-title"><span class="line">C’est</span> <span class="line line--accent">noté.</span></p>
          <p data-flash-done-message></p>
        </div>
      </div>
    </section>`;
}

// ---------- Carte cadeau ----------

const OCCASIONS = [
  ['noel', 'Joyeux Noël.', 'bubblegum', 'Noël'],
  ['saint-valentin', 'Avec amour.', 'chalk', 'Saint-Valentin'],
  ['fete-des-meres', 'Bonne fête, maman.', 'blush', 'Fête des mères'],
  ['fete-des-peres', 'Bonne fête, papa.', 'blush', 'Fête des pères'],
  ['anniversaire', 'Joyeux anniversaire.', 'chalk', 'Anniversaire'],
  ['juste', 'Pour toi.', 'bubblegum', 'Juste comme ça'],
];

export function gift(ctx, { titleTag = 'h2', kickerText = 'Carte cadeau', more = false } = {}) {
  return html`<section id="offrir" class="section gift" aria-labelledby="gift-title" data-fab-hide>
      <div class="gift__grid">
        <div class="gift__text">
          ${kicker(kickerText)}
          ${displayTitle(['Offrir.'], { tag: titleTag, id: 'gift-title', className: 'gift__title' })}
          <p class="lead">Un moment rien qu’à soi, ça s’offre. La carte cadeau s’achète en ligne en quelques clics, ou directement au salon.</p>
          <p class="countdown" data-countdown hidden></p>
          <fieldset class="checks gift__occasions" data-occasions>
            <legend>L’occasion</legend>
            ${OCCASIONS.map(([value, title, theme, label]) => html`<label><input type="radio" name="occasion" value="${value}" data-title="${title}" data-theme="${theme}"${value === 'juste' ? raw(' checked') : ''}><span>${label}</span></label>`)}
          </fieldset>
          <div class="gift__ideas">
            <p>Une idée de montant ?</p>
            <ul>
              <li><span>Un brushing</span> <strong>${startingPrice('femme', 1)}</strong></li>
              <li><span>Une coupe</span> <strong>${startingPrice('femme', 0)}</strong></li>
              <li><span>Un gloss</span> <strong>${startingPrice('couleur')}</strong></li>
              <li><span>Un balayage</span> <strong>${startingPrice('balayage')}</strong></li>
            </ul>
          </div>
          <div class="gift__actions">
            ${circleLink({ id: 'ring-gift', ringText: 'OFFRIR · CARTE CADEAU · OFFRIR · CARTE CADEAU ·', label: 'Acheter une carte cadeau sur Planity', iconName: 'gift', newTab: true })}
            <p>Achat en ligne sur Planity : cliquez sur <strong>« Offrir »</strong> depuis la page du salon. Au salon : carte bancaire ou espèces.</p>
          </div>
          ${more ? html`<a class="link-arrow" href="${ctx.rel('carte-cadeau/')}">Tout sur la carte cadeau ${icon('arrow-right')}</a>` : ''}
        </div>
        <div class="gift__visual" aria-hidden="true">
          <div class="giftcard" data-giftcard data-theme="bubblegum">
            <p class="giftcard__label">Carte cadeau</p>
            <p class="giftcard__title" data-giftcard-title>Pour toi.</p>
            <div class="giftcard__foot">
              <p class="giftcard__brand">Un Brun d’Hair</p>
              <p class="giftcard__meta">4 bis rue Champvoisin · Aubière</p>
            </div>
            <svg class="giftcard__bolt"><use href="#i-bolt"/></svg>
          </div>
        </div>
      </div>
    </section>`;
}

// ---------- Divers ----------

export function marquee(items, { big = false } = {}) {
  const track = [...items, ...items].map((item) => html`<span>${item}</span>`);
  return html`<div class="${big ? 'marquee marquee--big' : 'marquee'}" aria-hidden="true">
      <div class="marquee__track">${track}</div>
    </div>`;
}

export function social() {
  return html`<section class="social" aria-labelledby="social-title">
      <h2 id="social-title" class="visually-hidden">Suivre Un Brun d’Hair sur les réseaux</h2>
      ${marquee(['@unbrundhair', '@unbrundhair', '@unbrundhair', '@unbrundhair'], { big: true })}
      <div class="social__body">
        <p>Réalisations en vidéo, coulisses du salon et horaires de la semaine : tout se passe sur les réseaux.</p>
        <ul class="social__links">
          <li><a class="btn" href="${salon.links.instagram}"${external}>${icon('instagram')} Voir Instagram</a></li>
          <li><a class="btn" href="${salon.links.tiktok}"${external}>${icon('tiktok')} TikTok</a></li>
        </ul>
      </div>
    </section>`;
}

// Liste des prestations, avec un lien vers chaque page détaillée.
export function servicesList(ctx, { lines = ['Les', 'prestations.'], kickerText = 'Prestations & tarifs', titleTag = 'h2' } = {}) {
  const items = [
    { id: 'femme', title: 'Coupe & brushing femme', text: `Brushing ${startingPrice('femme', 1)}, coupe et brushing ${startingPrice('femme', 0)}. Conseils personnalisés à chaque rendez-vous.` },
    { id: 'couleur', title: 'Coloration & gloss', text: 'Racines, éclat, reflets neutralisés et premiers cheveux blancs estompés.' },
    { id: 'balayage', title: 'Balayage', text: 'Lumières & Subtil ou Éclat & Intense, toujours après un diagnostic.' },
    { id: 'homme', title: 'Coupe homme', text: 'Shampoing, coupe et coiffage, adaptés à vos envies.' },
    { id: 'enfant', title: 'Coupe enfant', text: 'Pour les moins de 12 ans, dans une ambiance calme et bienveillante.' },
    { id: 'soin', title: 'Soins Davines', text: 'Le soin adapté aux besoins de vos cheveux, en complément de votre prestation.' },
    { id: 'diagnostic', title: 'Diagnostic capillaire', text: `${durationOf('diagnostic')} pour définir votre projet. Les ${priceOf('diagnostic')} sont déduits de votre prestation.` },
  ];
  return html`<section class="section services" aria-labelledby="services-title">
      <header class="section__head services__head">
        <div>
          ${kicker(kickerText)}
          ${displayTitle(lines, { tag: titleTag, id: 'services-title' })}
        </div>
        <p data-reveal>Tarifs TTC. Les prix « dès » s’ajustent à votre chevelure et à votre projet. <a href="${ctx.rel('tarifs/')}">Voir toute la carte</a></p>
      </header>
      <ul class="services__list">
        ${items.map((item) => {
          const cat = category(item.id);
          return html`<li class="service">
          <a class="service__link" href="${ctx.rel(cat.page)}${cat.anchor ? `#${cat.anchor}` : ''}">
            <span class="service__title">${item.title}</span>
            <span class="service__text">${item.text}</span>
            <span class="service__price">${startingPrice(item.id)}</span>
            ${icon('arrow-right', 'service__arrow')}
          </a>
        </li>`;
        })}
      </ul>
    </section>`;
}

