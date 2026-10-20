import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { reviews, reviewWords } from '../data/reviews.mjs';
import { kicker, rating, quotes, reviewLinks, ctaBand } from '../components/blocks.mjs';

export const route = 'avis/';

export default function avis() {
  const body = html`
    <section class="section avis avis--page" aria-labelledby="avis-title">
      ${kicker('Avis & confiance')}
      ${rating({ lines: ['Avis', 'clients.'], titleTag: 'h1' })}
      <h2 class="visually-hidden">Ce qui revient dans les avis</h2>
      <ul class="words">${reviewWords.map((word) => html`<li>${word}</li>`)}</ul>
      <h2 class="visually-hidden">Les avis publiés sur Planity</h2>
      ${quotes(reviews)}
      ${reviewLinks()}
    </section>

    ${ctaBand({ lines: ['Votre tour', 'de tester ?'], text: 'Rejoignez les clientes et clients qui ont donné 5 étoiles au salon.', book: '', label: 'Réserver' })}`;

  return {
    title: `Avis clients : ${salon.rating.value}/5 sur ${salon.rating.planityCount} avis | Un Brun d’Hair, Aubière`,
    description: `Les avis sur le salon Un Brun d’Hair à Aubière : ${salon.rating.value}/5 sur ${salon.rating.planityCount} avis Planity. Un accueil chaleureux, de l’écoute et une ambiance cocooning.`,
    breadcrumb: [{ label: 'Avis clients', route }],
    body,
  };
}
