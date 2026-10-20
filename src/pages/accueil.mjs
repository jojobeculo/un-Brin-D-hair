import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { reviewsFor, reviewWords } from '../data/reviews.mjs';
import { icon } from '../components/icons.mjs';
import { hairSalonSchema } from '../components/layout.mjs';
import {
  kicker, displayTitle, circleLink, phoneLink, servicesList, rating, quotes, reviewLinks, hoursSentence,
  gallery, GALLERY, flash, gift, visit, faq, faqSchema, marquee, social, stars,
} from '../components/blocks.mjs';
import { priceOf, durationOf } from '../data/services.mjs';

export const route = '';

const FAQ = [
  { q: 'Comment prendre rendez-vous ?', a: `En ligne sur Planity, à toute heure, ou en 3 clics depuis ce site. Vous pouvez aussi appeler le salon au ${salon.phone.display}.` },
  { q: 'Le diagnostic est-il obligatoire ?', a: `Oui, avant tout balayage ou changement de couleur nécessitant un éclaircissement. Il dure ${durationOf('diagnostic')} et coûte ${priceOf('diagnostic')}, déduits de votre prestation si vous convenez ensemble d’un rendez-vous. Il ne peut pas avoir lieu le même jour que la prestation.` },
  { q: 'Quels produits utilisez-vous ?', a: 'Le salon travaille exclusivement avec Davines, une marque engagée dans une démarche de beauté durable : prendre soin de vos cheveux tout en respectant l’environnement.' },
  { q: 'Quels sont les horaires du salon ?', a: `${hoursSentence()}. ${salon.hoursNote}` },
  { q: 'Coiffez-vous les hommes et les enfants ?', a: `Oui : forfait homme (shampoing, coupe, coiffage) à ${priceOf('homme-forfait')}, coupe garçon de moins de 12 ans à ${priceOf('enfant-garcon')}, coupe fille de moins de 12 ans dès ${priceOf('enfant-fille-courts')}.` },
  { q: 'Quels moyens de paiement acceptez-vous ?', a: 'La carte bancaire et les espèces.' },
];

const WHY = [
  { word: 'Diagnostic', title: 'Le diagnostic d’abord', text: 'Vos envies, votre historique capillaire, vos habitudes : on en parle avant de commencer. Pour un balayage ou un éclaircissement, cette consultation est même obligatoire.' },
  { word: 'Davines', title: 'Une marque engagée', text: 'Le salon travaille exclusivement avec Davines, qui allie performance, respect du cheveu et respect de l’environnement.' },
  { word: 'Sandy', title: 'Une seule coiffeuse', text: 'Dans ce salon intimiste, c’est Sandy qui vous accueille, vous conseille et vous coiffe, de votre arrivée à votre départ.' },
  { word: salon.rating.value, title: 'Une note parfaite', text: `${salon.rating.value} sur 5 sur ${salon.rating.planityCount} avis Planity : les clientes et clients parlent d’écoute, de conseils et d’une vraie bulle de douceur.` },
];

export default function accueil(ctx) {
  const body = html`
    <section id="top" class="hero" aria-labelledby="hero-title">
      <div class="hero__top">
        <p class="kicker"><a href="${ctx.rel('contact/')}">Salon de coiffure à ${salon.address.city}</a></p>
        <p class="status-pill" data-open-status>Du lundi au samedi, sur rendez-vous</p>
      </div>

      <h1 id="hero-title" class="display hero__title">
        <span class="visually-hidden">Un Brun d’Hair, salon de coiffure à Aubière</span>
        <span class="line" aria-hidden="true"><span class="hero__word">Un</span> <span class="hero__word">Brun</span></span>
        <span class="line hero__shift" aria-hidden="true">D’Hair</span>
      </h1>

      <div class="hero__bottom">
        <p class="lead hero__lead">Coupes, couleurs et balayages sur-mesure, avec les soins Davines, dans un salon intimiste où l’on se sent <mark>comme à la maison</mark>.</p>
        <div class="hero__actions" data-fab-hide>
          ${circleLink({ id: 'ring-hero', ringText: 'RÉSERVER · EN 3 CLICS · RÉSERVER · EN 3 CLICS ·', label: 'Réserver en 3 clics', book: '' })}
          <ul class="hero__links">
            <li><a class="link-arrow" href="${ctx.rel('tarifs/')}">Voir les prestations ${icon('arrow-right')}</a></li>
            <li>${phoneLink()}</li>
            <li><a class="link-arrow" href="${salon.links.googleDirections}" target="_blank" rel="noopener" data-track="itineraire">${icon('navigation')} Itinéraire</a></li>
          </ul>
        </div>
        <a class="rating-chip" href="${ctx.rel('avis/')}">
          <span class="rating-chip__score">${salon.rating.value}</span>
          ${stars()}
          <span>${salon.rating.planityCount} avis Planity</span>
        </a>
      </div>
    </section>

    ${marquee(['Coupe femme', 'Brushing', 'Couleur', 'Gloss', 'Balayage lumières & subtil', 'Balayage éclat & intense', 'Coupe homme', 'Coupe enfant', 'Soins Davines', 'Diagnostic'])}

    <section class="section why" aria-labelledby="why-title">
      <header class="section__head">
        ${kicker('Le salon')}
        ${displayTitle(['Pourquoi', 'choisir', 'Un Brun d’Hair ?'], { id: 'why-title' })}
      </header>
      <ul class="why__list">
        ${WHY.map((item) => html`<li class="why__item" data-reveal>
          <p class="why__word" aria-hidden="true">${item.word}</p>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </li>`)}
      </ul>
      <p class="why__more" data-reveal><a class="link-arrow" href="${ctx.rel('salon/')}">Découvrir le salon et Sandy ${icon('arrow-right')}</a></p>
    </section>

    ${servicesList(ctx)}

    <section class="section avis" aria-labelledby="avis-title">
      ${kicker('Avis & confiance')}
      ${rating({ lines: ['Comme à', 'la maison.'] })}
      <h3 class="visually-hidden">Ce qui revient dans les avis</h3>
      <ul class="words">${reviewWords.map((word) => html`<li>${word}</li>`)}</ul>
      ${quotes(reviewsFor('home'))}
      <ul class="avis__links">
        <li><a class="link-arrow" href="${ctx.rel('avis/')}">Lire tous les avis ${icon('arrow-right')}</a></li>
      </ul>
      ${reviewLinks()}
    </section>

    ${gallery(ctx, GALLERY.slice(0, 2), { more: false, allLink: true })}

    <section id="reserver" class="section reserve" aria-labelledby="reserve-title" data-fab-hide>
      ${kicker('Réservation')}
      ${displayTitle(['Réservez', 'en 3 clics.'], { id: 'reserve-title' })}
      <ol class="steps">
        <li data-reveal><span class="steps__num" aria-hidden="true">1</span><strong>La prestation</strong><span>Coupe, couleur, balayage, homme, enfant…</span></li>
        <li data-reveal><span class="steps__num" aria-hidden="true">2</span><strong>Les petits plus</strong><span>Cheveux épais, allongement, soin Davines</span></li>
        <li data-reveal><span class="steps__num" aria-hidden="true">3</span><strong>Le créneau</strong><span>Le jour et l’heure qui vous arrangent</span></li>
      </ol>
      <div class="reserve__actions">
        ${circleLink({ id: 'ring-reserve', ringText: 'COMMENCER · C’EST PARTI · COMMENCER · C’EST PARTI ·', label: 'Commencer la réservation', book: '' })}
        <div class="reserve__alt">
          <p>Vous préférez en direct ?</p>
          <ul>
            <li><a class="link-arrow" href="${salon.links.planity}" target="_blank" rel="noopener" data-track="planity">Réserver sur Planity ${icon('arrow-up-right')}</a></li>
            <li>${phoneLink('link-arrow', `Appeler le ${salon.phone.display}`)}</li>
          </ul>
        </div>
      </div>
    </section>

    ${flash(ctx)}
    ${gift(ctx, { more: true })}
    ${visit(ctx, { map: false })}
    ${faq(FAQ)}
    ${social()}`;

  return {
    title: 'Un Brun d’Hair, coiffeur à Aubière | Coupe, couleur, balayage',
    description: `Salon de coiffure intimiste à Aubière, près de Clermont-Ferrand : coupes femme, homme et enfant, couleur, gloss et balayages Davines. Note ${salon.rating.value}/5.`,
    schema: [hairSalonSchema(), faqSchema(FAQ)],
    body,
  };
}
