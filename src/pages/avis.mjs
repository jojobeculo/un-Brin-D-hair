import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { reviews, reviewWords } from '../data/reviews.mjs';
import { rating, quotes, reviewLinks, cta } from '../components/blocks.mjs';

export const route = 'avis/';

export default function avis() {
  const body = html`
    <section class="section" aria-labelledby="avis-title" style="padding-top:clamp(2rem,4vw,3rem)">
      ${rating({ title: html`Avis <em>clients</em>`, titleTag: 'h1' })}
      <h2 class="visually-hidden">Ce qui revient dans les avis</h2>
      <ul class="words">${reviewWords.map((word) => html`<li>${word}</li>`)}</ul>
      <h2 class="visually-hidden">Les avis publiés sur Planity</h2>
      ${quotes(reviews)}
      <div class="section__foot">${reviewLinks()}</div>
    </section>

    ${cta({ title: html`Votre tour <em>de tester</em> ?`, text: 'Rejoignez les clientes et clients qui ont donné 5 étoiles au salon.' })}`;

  return {
    title: `Avis clients : ${salon.rating.value}/5 sur ${salon.rating.planityCount} avis | Un Brun d’Hair, Aubière`,
    description: `Les avis sur le salon Un Brun d’Hair à Aubière : ${salon.rating.value}/5 sur ${salon.rating.planityCount} avis Planity. Un accueil chaleureux, de l’écoute et une ambiance cocooning.`,
    breadcrumb: [{ label: 'Avis clients', route }],
    body,
  };
}
