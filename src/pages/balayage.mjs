import { html } from '../lib/html.mjs';
import { servicePage } from '../components/service-page.mjs';
import { GALLERY } from '../components/blocks.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';

export const route = 'balayage-aubiere/';

export default function balayage(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Balayage',
    title: 'Balayage sur-mesure à Aubière | Un Brun d’Hair',
    description: `Balayage sur-mesure à Aubière : Lumières & Subtil ${startingPrice('balayage', 0)}, Éclat & Intense ${startingPrice('balayage', 1)}, coupe et brushing inclus. Diagnostic préalable obligatoire.`,
    schemaName: 'Balayage',
    kicker: 'Balayages sur-mesure',
    lines: ['Balayage', 'à Aubière'],
    lead: 'Deux intensités, un même principe : un résultat lumineux, harmonieux et facile à porter au quotidien. Shampoing, coupe et brushing sont inclus.',
    book: 'balayage',
    bookLabel: 'Réserver un balayage',
    detail: {
      kicker: 'Deux techniques',
      lines: ['Lumières', 'ou éclat ?'],
      paragraphs: [
        'Le balayage Lumières & Subtil se fait tout en finesse : il apporte une lumière naturelle sans contraste marqué, réveille votre couleur et donne de la profondeur. Le rendu est doux, élégant et facile à entretenir.',
        'Le balayage Éclat & Intense apporte davantage de relief et de dimension grâce à un travail de nuances. Le résultat est plus lumineux et plus marqué, tout en restant en harmonie avec votre couleur.',
      ],
      extra: html`<ol class="steps steps--compact">
          <li data-reveal><span class="steps__num" aria-hidden="true">1</span><strong>Le diagnostic</strong><span>${durationOf('diagnostic')}, obligatoire, sur un autre jour. Les ${priceOf('diagnostic')} sont déduits de votre balayage.</span></li>
          <li data-reveal><span class="steps__num" aria-hidden="true">2</span><strong>Le balayage</strong><span>De ${durationOf('balayage-lumieres-courts')} à ${durationOf('balayage-eclat-longs')} selon la technique et la longueur de vos cheveux.</span></li>
          <li data-reveal><span class="steps__num" aria-hidden="true">3</span><strong>Coupe &amp; brushing</strong><span>Inclus, pour repartir avec un résultat fini.</span></li>
        </ol>`,
    },
    categories: ['balayage', 'diagnostic', 'options'],
    gallery: GALLERY.slice(0, 2),
    reviewsTag: 'balayage',
    faq: [
      { q: 'Le diagnostic est-il obligatoire avant un balayage ?', a: `Oui. Cette consultation de ${durationOf('diagnostic')} permet d’analyser votre chevelure, d’évaluer vos possibilités et de construire ensemble un projet réalisable. Elle coûte ${priceOf('diagnostic')}, déduits de votre balayage si vous convenez ensemble d’un rendez-vous.` },
      { q: 'Peut-on faire le diagnostic et le balayage le même jour ?', a: 'Non : le diagnostic ne peut pas être réservé le même jour que la prestation technique.' },
      { q: 'Combien de temps dure un balayage ?', a: `De ${durationOf('balayage-lumieres-courts')} à ${durationOf('balayage-eclat-longs')} selon la technique et la longueur, shampoing, coupe et brushing compris.` },
      { q: 'Quelle différence entre Lumières & Subtil et Éclat & Intense ?', a: 'Lumières & Subtil apporte une lumière naturelle, sans contraste marqué. Éclat & Intense donne plus de relief et un résultat plus visible, grâce à un travail de nuances.' },
      { q: 'J’ai les cheveux épais, est-ce plus long ?', a: `Ajoutez l’option « cheveux épais » à votre réservation (+${durationOf('opt-epais')}, +${priceOf('opt-epais')}) pour prévoir le temps qu’il faut.` },
    ],
    cta: { lines: ['Envie', 'de lumière ?'], text: 'Pas encore de diagnostic ? Le tunnel de réservation vous propose de le réserver d’abord.' },
  });
}
