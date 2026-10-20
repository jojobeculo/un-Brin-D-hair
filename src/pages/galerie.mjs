import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { icon } from '../components/icons.mjs';
import { gallery, GALLERY, kicker, displayTitle, ctaBand } from '../components/blocks.mjs';

export const route = 'galerie/';

export default function galerie(ctx) {
  const body = html`
    ${gallery(ctx, GALLERY, { titleTag: 'h1', kickerText: 'Réalisations du salon', more: false })}

    <section class="section latest" aria-labelledby="latest-title">
      <header class="section__head">
        ${kicker('Instagram & TikTok')}
        ${displayTitle(['Nos dernières', 'réalisations.'], { id: 'latest-title' })}
      </header>
      <p class="lead" data-reveal>Les balayages, couleurs et coupes du moment, en photo et en vidéo, sont publiés chaque semaine sur les réseaux du salon.</p>
      <ul class="social__links" data-reveal>
        <li><a class="btn btn--solid" href="${salon.links.instagram}" target="_blank" rel="noopener">${icon('instagram')} Voir Instagram</a></li>
        <li><a class="btn" href="${salon.links.tiktok}" target="_blank" rel="noopener">${icon('tiktok')} Voir TikTok</a></li>
      </ul>
    </section>

    ${ctaBand({ lines: ['À vous', 'de briller.'], text: 'Balayage, gloss ou nouvelle coupe : réservez la transformation qui vous ressemble.', book: '', label: 'Réserver' })}`;

  return {
    title: 'Avant / après : balayages et couleurs | Un Brun d’Hair',
    description: 'Les transformations du salon Un Brun d’Hair à Aubière : balayages, gloss, couleurs et coupes. Glissez pour comparer avant et après.',
    breadcrumb: [{ label: 'Avant / après', route }],
    body,
  };
}
