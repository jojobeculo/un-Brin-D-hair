import { html } from '../lib/html.mjs';
import { reviewsFor } from '../data/reviews.mjs';
import { pageHero, kicker, displayTitle, quotes, ctaBand } from '../components/blocks.mjs';

export const route = 'salon/';

export default function salonPage(ctx) {
  const body = html`
    ${pageHero(ctx, {
      kicker: 'Coiffeuse à Aubière',
      lines: ['Le salon', '& Sandy'],
      lead: 'Bienvenue chez Un Brun d’Hair, le salon de Sandy au cœur d’Aubière : un espace intimiste, chaleureux et apaisant, où chaque rendez-vous devient un vrai moment de détente.',
      book: '',
      bookLabel: 'Réserver',
      secondary: { route: 'tarifs/', label: 'Voir les tarifs' },
    })}

    <section class="section manifesto" aria-labelledby="salon-title">
      <header class="section__head">
        ${kicker('Nos valeurs')}
        ${displayTitle(['Prendre', 'le temps.'], { id: 'salon-title' })}
      </header>
      <div class="manifesto__body">
        <p class="manifesto__lead" data-reveal>Chaque prestation est personnalisée, pensée avec soin, conseillée selon vos envies et réalisée avec précision. <mark>Intimiste, chaleureux et apaisant</mark> : le salon est fait pour que l’on s’y sente bien.</p>
        <ol class="principles">
          <li data-reveal>
            <span class="principles__num" aria-hidden="true">01</span>
            <h3>Le diagnostic d’abord</h3>
            <p>Vos envies, votre historique capillaire, vos habitudes : on en parle d’abord, pour construire ensemble un projet en harmonie avec votre nature de cheveux et votre quotidien.</p>
          </li>
          <li data-reveal>
            <span class="principles__num" aria-hidden="true">02</span>
            <h3>Beauté durable</h3>
            <p>Le salon travaille exclusivement avec Davines, une marque engagée qui allie performance, respect du cheveu et développement durable.</p>
          </li>
          <li data-reveal>
            <span class="principles__num" aria-hidden="true">03</span>
            <h3>Des résultats qui vous ressemblent</h3>
            <p>L’objectif : préserver la santé de votre chevelure tout en créant des résultats naturels, lumineux et durables, adaptés à votre personnalité et à votre quotidien.</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section sandy" aria-labelledby="sandy-title">
      <div class="sandy__grid">
        <header class="section__head">
          ${kicker('L’équipe')}
          ${displayTitle(['Sandy,', 'votre', 'coiffeuse.'], { id: 'sandy-title' })}
        </header>
        <div class="sandy__body">
          <p class="lead" data-reveal>Chez Un Brun d’Hair, c’est Sandy qui vous accueille, vous conseille et réalise votre prestation, de votre arrivée à votre départ.</p>
          <p data-reveal>Dans les avis, ses clientes et clients parlent d’écoute, de bons conseils et de « doigts en or ». Certaines lui confient leurs cheveux depuis des années, et l’ont suivie dans son nouveau salon d’Aubière.</p>
          <p class="signature" data-reveal>« Au plaisir de vous accueillir chez Un Brun d’Hair. » <span>— Sandy</span></p>
        </div>
      </div>
      ${quotes(reviewsFor('salon'))}
    </section>

    <section class="section rdv" aria-labelledby="rdv-title">
      <header class="section__head">
        ${kicker('Votre rendez-vous')}
        ${displayTitle(['Comment', 'ça se passe.'], { id: 'rdv-title' })}
      </header>
      <ol class="steps steps--four">
        <li data-reveal><span class="steps__num" aria-hidden="true">1</span><strong>L’accueil</strong><span>On s’installe, on prend le temps, et on parle de vos envies.</span></li>
        <li data-reveal><span class="steps__num" aria-hidden="true">2</span><strong>Le conseil</strong><span>Votre nature de cheveux, votre routine, votre quotidien : on définit ensemble le bon projet.</span></li>
        <li data-reveal><span class="steps__num" aria-hidden="true">3</span><strong>La prestation</strong><span>Réalisée avec précision, avec les produits Davines.</span></li>
        <li data-reveal><span class="steps__num" aria-hidden="true">4</span><strong>Le coiffage</strong><span>Vous repartez coiffée ou coiffé, avec des conseils pour garder le résultat.</span></li>
      </ol>
    </section>

    ${ctaBand({ lines: ['On se', 'rencontre ?'], text: 'Choisissez votre prestation et le créneau qui vous arrange : Sandy vous attend au 4 bis rue Champvoisin.', book: '', label: 'Réserver' })}`;

  return {
    title: 'Le salon & Sandy, coiffeuse à Aubière | Un Brun d’Hair',
    description: 'Un salon intimiste, chaleureux et apaisant au cœur d’Aubière : découvrez Sandy, sa démarche de beauté durable avec Davines et le déroulé de votre rendez-vous.',
    breadcrumb: [{ label: 'Le salon', route }],
    body,
  };
}
