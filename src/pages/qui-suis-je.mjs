import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { reviewsFor } from '../data/reviews.mjs';
import { icon } from '../components/icons.mjs';
import { pageHero, kicker, photo, ribbon, quotes, cta, related, bookButton } from '../components/blocks.mjs';

export const route = 'qui-suis-je/';

// Texte écrit à partir des informations publiques du salon : à relire et compléter par Sandy.
export default function quiSuisJe(ctx) {
  const { story } = salon;
  const body = html`
    ${pageHero(ctx, {
      kickerText: 'Qui suis-je ?',
      title: html`Sandy, <em>votre coiffeuse</em> à Aubière`,
      lead: 'Bienvenue chez Un Brun d’Hair : un salon intimiste, chaleureux et apaisant, où c’est moi qui vous accueille, vous conseille et vous coiffe.',
      image: 'sandy-salon',
      alt: 'Sandy devant la vitrine de son salon, rue Champvoisin à Aubière',
      actions: html`${bookButton()} <a class="btn" href="#histoire">Mon histoire ${icon('arrow-right', 'icon--move')}</a>`,
    })}

    <section id="histoire" class="section has-ribbon" aria-labelledby="story-title">
      ${ribbon('story')}
      <div class="story">
        <div class="arch" data-reveal="mask" data-zoom data-cursor="Voir">
          ${photo(ctx, 'outils', { alt: 'Ciseaux, peignes et brosses sur le plan de travail du salon', sizes: '(min-width: 960px) 40vw, 90vw' })}
        </div>
        <div class="story__text">
          ${kicker('Mon histoire')}
          <h2 id="story-title" data-split>Un métier <em>de passion</em></h2>
          <p style="margin-top:1.5rem">J’ai ${story.age} ans et je coiffe depuis ${story.experienceYears} ans. Très tôt, j’ai aimé ce moment où une cliente se regarde dans le miroir et se reconnaît, en mieux.</p>
          <p>Avec Un Brun d’Hair, j’ai voulu un salon à mon image : un lieu calme, où l’on prend le temps. Ici, pas de travail à la chaîne : une seule coiffeuse, et un rendez-vous qui vous est entièrement consacré.</p>
          <p>Je travaille exclusivement avec Davines, une marque qui partage mes valeurs : prendre soin des cheveux tout en respectant l’environnement.</p>
          <p class="signature">Au plaisir de vous accueillir, Sandy</p>
          <ul class="facts">
            <li><strong data-count="${story.age}">${story.age}</strong><span>ans</span></li>
            <li><strong data-count="${story.experienceYears}">${story.experienceYears}</strong><span>ans de métier</span></li>
            <li><strong>${salon.rating.value}</strong><span>sur ${salon.rating.planityCount} avis Planity</span></li>
          </ul>
        </div>
      </div>
    </section>

    <div class="band band--creme">
      <section class="section" aria-labelledby="values-title">
        <header class="section__head">
          ${kicker('Mes valeurs')}
          <h2 id="values-title" data-split>Ce qui compte <em>pour moi</em></h2>
        </header>
        <ul class="benefits benefits--3">
          <li data-reveal>${icon('ear')}<h3>L’écoute</h3><p>Vos envies, votre historique capillaire, votre quotidien : on en parle d’abord, pour construire ensemble un projet qui vous ressemble.</p></li>
          <li data-reveal style="--stagger:1">${icon('leaf')}<h3>La beauté durable</h3><p>Des produits Davines, performants et respectueux du cheveu comme de l’environnement.</p></li>
          <li data-reveal style="--stagger:2">${icon('sparkle')}<h3>Le naturel</h3><p>Des résultats lumineux et faciles à porter, adaptés à votre personnalité et à votre rythme.</p></li>
        </ul>
      </section>
    </div>

    <section class="section" aria-labelledby="rdv-title">
      <div class="split-layout split-layout--sticky">
        <div>
          ${kicker('Votre rendez-vous')}
          <h2 id="rdv-title" data-split>Comment <em>ça se passe</em></h2>
          <p class="lead" style="margin-top:1.25rem">Du premier mot au dernier coup de brosse, c’est la même personne qui s’occupe de vous.</p>
        </div>
        <ol class="steps">
          <li data-reveal><strong>L’accueil</strong><span>On s’installe, on prend le temps, et on parle de vos envies.</span></li>
          <li data-reveal style="--stagger:1"><strong>Le conseil</strong><span>Votre nature de cheveux, votre routine, votre quotidien : on définit le bon projet.</span></li>
          <li data-reveal style="--stagger:2"><strong>La prestation</strong><span>Réalisée avec précision, avec les produits Davines.</span></li>
          <li data-reveal style="--stagger:3"><strong>Le coiffage</strong><span>Vous repartez coiffée ou coiffé, avec des conseils pour garder le résultat.</span></li>
        </ol>
      </div>
    </section>

    <div class="band band--creme">
      <section class="section" aria-labelledby="quotes-title">
        <header class="section__head">
          ${kicker('Avis clients')}
          <h2 id="quotes-title" data-split>Ce qu’on <em>dit du salon</em></h2>
        </header>
        ${quotes(reviewsFor('salon'))}
      </section>
    </div>

    ${related(ctx, ['tarifs/', 'realisations/', 'avis/', 'contact/'])}
    ${cta({ title: html`On se <em>rencontre</em> ?`, text: `Choisissez votre prestation et le créneau qui vous arrange : je vous attends au ${salon.address.street}.` })}`;

  return {
    title: 'Qui suis-je ? Sandy, coiffeuse à Aubière | Un Brun d’Hair',
    description: `Sandy, ${story.age} ans, coiffeuse depuis ${story.experienceYears} ans, vous accueille dans son salon intimiste d’Aubière : écoute, conseils personnalisés et produits Davines.`,
    breadcrumb: [{ label: 'Qui suis-je ?', route }],
    body,
  };
}
