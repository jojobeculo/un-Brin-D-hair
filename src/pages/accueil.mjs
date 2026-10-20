import { html, raw } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { reviewsFor } from '../data/reviews.mjs';
import { haircuts } from '../data/haircuts.mjs';
import { haircutSvg } from '../../assets/js/lib/haircut-art.js';
import { icon } from '../components/icons.mjs';
import { hairSalonSchema } from '../components/layout.mjs';
import {
  kicker, photo, bookButton, ribbon, orbs, wave, serviceCards, shots, SHOTS, rating, quotes, reviewLinks, instagram, visit, phoneLink, stars,
} from '../components/blocks.mjs';

export const route = '';

const WHY = [
  { num: '15', unit: 'min', title: 'Le diagnostic d’abord', text: 'Vos envies, votre historique, vos habitudes : on en parle avant de commencer, pour un projet réaliste.' },
  { num: '1', unit: 'coiffeuse', title: 'Une seule interlocutrice', text: 'C’est Sandy qui vous accueille, vous conseille et vous coiffe, de votre arrivée à votre départ.' },
  { num: '100', unit: '%', title: 'Davines, et rien d’autre', text: 'Une marque engagée, qui allie performance, respect du cheveu et de l’environnement.' },
  { num: salon.rating.value, unit: '/5', title: 'Des clientes fidèles', text: `${salon.rating.planityCount} avis sur Planity : on y parle d’écoute, de conseils et d’une vraie bulle de douceur.` },
];

export default function accueil(ctx) {
  const teaser = haircuts.femme.find((cut) => cut.id === 'lob-rideau');
  const body = html`
    <section class="hero" aria-labelledby="hero-title" data-hero>
      ${orbs()}
      ${ribbon('hero')}
      <div class="hero__grid">
        <div class="hero__text">
          ${kicker('Salon de coiffure à Aubière')}
          <h1 id="hero-title" class="hero__title">
            <span class="visually-hidden">Un Brun d’Hair, salon de coiffure à Aubière</span>
            <svg class="wordmark" viewBox="0 0 640 290" aria-hidden="true"><text x="2" y="122">Un Brun</text><text class="it" x="150" y="268">d’Hair</text></svg>
          </h1>
          <p class="hero__claim">Prendre soin de vos cheveux, <em>comme à la maison.</em></p>
          <p class="lead hero__lead">Sandy vous accueille dans son salon du ${salon.address.street} : coupes, couleurs et balayages sur-mesure, avec les soins Davines.</p>
          <div class="actions hero__actions">
            ${bookButton('Je réserve')}
            <a class="btn" href="#prestations" data-cursor="Explorer">Découvrir mes prestations ${icon('arrow-right', 'icon--move')}</a>
          </div>
          <div class="hero__proof">
            <a href="${ctx.rel('avis/')}"><strong>${salon.rating.value}/5</strong> ${stars()} ${salon.rating.planityCount} avis Planity</a>
            <span>${icon('leaf')} Produits Davines</span>
          </div>
        </div>
        <div class="hero__media">
          <span class="hero__monogram" aria-hidden="true">B</span>
          <div class="arch" data-liquid data-cursor="Bonjour !">
            ${photo(ctx, 'sandy-salon', { alt: 'Sandy devant la vitrine de son salon Un Brun d’Hair, rue Champvoisin à Aubière', sizes: '(min-width: 900px) 440px, 86vw', eager: true })}
          </div>
          <p class="hero__caption"><strong>Sandy</strong>Coiffeuse depuis ${salon.story.experienceYears} ans, à votre écoute</p>
        </div>
      </div>
      <span class="hero__scroll" aria-hidden="true"></span>
    </section>

    <div class="band band--creme">
      <section class="section statement" aria-label="Notre engagement">
        ${wave()}
        <p class="statement__text" data-words>Ici, on prend le temps : vous écouter, comprendre vos cheveux, et créer <em>une coupe qui vous ressemble.</em></p>
        <p class="statement__sign">Sandy, fondatrice d’Un Brun d’Hair</p>
      </section>
    </div>

    <section class="section" aria-labelledby="why-title">
      <header class="section__head">
        ${kicker('Pourquoi choisir le salon')}
        <h2 id="why-title" data-split>Un salon <em>intimiste</em> et une coiffeuse attentive</h2>
      </header>
      <ul class="why">
        ${WHY.map((item, index) => html`<li data-reveal style="--stagger:${index}">
          <p class="why__num" aria-hidden="true"><span data-count="${item.num.replace(',', '.')}">${item.num}</span><em>${item.unit}</em></p>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </li>`)}
      </ul>
    </section>

    <div class="band">
      <section id="prestations" class="section" aria-labelledby="services-title">
        <header class="section__head section__head--split">
          ${kicker('Prestations')}
          <h2 id="services-title" data-split>Mes <em>prestations</em></h2>
          <p>Chaque rendez-vous commence par l’écoute de vos envies. Tarifs TTC ; les prix « dès » s’ajustent à votre chevelure et à votre projet.</p>
        </header>
        ${serviceCards(ctx)}
        <div class="section__foot">
          <a class="btn btn--primary" href="${ctx.rel('tarifs/')}">Voir tous les tarifs ${icon('arrow-right', 'icon--move')}</a>
          <a class="link" href="${ctx.rel('conseil-coupe/')}">Pas sûre de la coupe ? Faites le test ${icon('arrow-right')}</a>
        </div>
      </section>
    </div>

    <section class="section" aria-labelledby="shots-title">
      <header class="section__head section__head--split">
        ${kicker('Réalisations')}
        <h2 id="shots-title" data-split>Des cheveux qui <em>vous ressemblent</em></h2>
        <p>Balayages lumineux, coupes nettes, brushings souples : un résultat naturel, facile à porter au quotidien.</p>
      </header>
      ${shots(ctx, SHOTS)}
      <div class="section__foot">
        <a class="link" href="${ctx.rel('realisations/')}">Voir les réalisations ${icon('arrow-right')}</a>
        <p class="note">Photos d’illustration, en attendant les photos du salon.</p>
      </div>
    </section>

    <div class="band band--creme">
      <section class="section" aria-labelledby="avis-title">
        ${rating({ title: html`« Comme <em>à la maison</em> »` })}
        ${quotes(reviewsFor('home'))}
        <div class="section__foot">
          <a class="link" href="${ctx.rel('avis/')}">Lire tous les avis ${icon('arrow-right')}</a>
          ${reviewLinks()}
        </div>
      </section>
    </div>

    ${instagram(ctx)}

    <div class="has-ribbon" data-ambient="dark">
      ${orbs()}
      ${ribbon('book')}
      <section id="reserver" class="section" aria-labelledby="book-title">
        <div class="book">
          <div>
            ${kicker('Réservation en ligne')}
            <h2 id="book-title" data-split>Réservez <em>en une minute</em></h2>
            <p class="lead" style="margin-top:1.5rem">Les disponibilités de Sandy sont en temps réel sur Planity, 24 h/24. La confirmation est immédiate.</p>
            <div class="actions" style="margin-top:2rem">
              ${bookButton('Je réserve sur Planity')}
              ${phoneLink('btn', 'Appeler')}
            </div>
            <p class="book__alt">Une question avant de réserver ? <a href="${ctx.rel('contact/')}#ecrire">Écrivez au salon</a></p>
          </div>
          <div>
            <ol class="book__steps">
              <li data-reveal><strong>Choisissez la prestation</strong><span>Coupe, couleur, balayage, homme, enfant…</span></li>
              <li data-reveal style="--stagger:1"><strong>Le créneau qui vous arrange</strong><span>Du lundi au samedi, selon les semaines</span></li>
              <li data-reveal style="--stagger:2"><strong>C’est confirmé</strong><span>Confirmation immédiate, à retrouver dans votre compte Planity</span></li>
            </ol>
            <a class="quiz-teaser" href="${ctx.rel('conseil-coupe/')}" data-reveal data-cursor="Le test">
              ${raw(haircutSvg(teaser.art, { id: 'teaser' }))}
              <span><strong>Quelle coupe pour moi ?</strong><span>6 à 9 questions, 3 coupes conseillées avec leur prix et leur durée</span></span>
            </a>
          </div>
        </div>
      </section>
    </div>

    ${visit(ctx)}`;

  return {
    title: 'Coiffeur à Aubière : Un Brun d’Hair, coupe, couleur, balayage',
    description: `Un Brun d’Hair, salon de coiffure à Aubière près de Clermont-Ferrand : Sandy vous coiffe, coupes femme, homme et enfant, couleur et balayage Davines. ${salon.rating.value}/5 sur Planity.`,
    schema: [hairSalonSchema()],
    body,
  };
}
