import { html } from '../lib/html.mjs';
import { servicePage } from '../components/service-page.mjs';
import { priceOf, durationOf } from '../data/services.mjs';

export const route = 'diagnostic-capillaire-aubiere/';

export default function diagnostic(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Diagnostic',
    title: 'Diagnostic capillaire à Aubière | Un Brun d’Hair',
    description: `Avant un balayage ou un éclaircissement, le diagnostic capillaire est obligatoire : ${durationOf('diagnostic')} pour définir votre projet, ${priceOf('diagnostic')} déduits ensuite.`,
    schemaName: 'Diagnostic capillaire',
    kicker: 'Diagnostic capillaire',
    lines: ['Diagnostic', 'capillaire', 'à Aubière'],
    lead: `${durationOf('diagnostic')} dédiées à vos envies et à votre chevelure, pour construire ensemble un projet personnalisé, réalisable et adapté à votre quotidien.`,
    book: 'diagnostic',
    bookLabel: 'Réserver mon diagnostic',
    detail: {
      kicker: 'Pourquoi commencer par là',
      lines: ['Écouter', 'avant', 'de colorer.'],
      paragraphs: [
        'On prend le temps d’échanger sur vos attentes, votre historique capillaire et vos habitudes, pour définir ensemble un projet en harmonie avec votre nature de cheveux et votre quotidien.',
        `Le diagnostic coûte ${priceOf('diagnostic')}. Ce montant est déduit de votre prochaine prestation si vous convenez ensemble d’un rendez-vous.`,
      ],
      extra: html`<ol class="steps steps--compact">
          <li data-reveal><span class="steps__num" aria-hidden="true">1</span><strong>Le diagnostic</strong><span>${durationOf('diagnostic')} au salon pour analyser votre chevelure et vos envies.</span></li>
          <li data-reveal><span class="steps__num" aria-hidden="true">2</span><strong>Le projet</strong><span>On définit ensemble ce qui est réalisable, et la prestation adaptée.</span></li>
          <li data-reveal><span class="steps__num" aria-hidden="true">3</span><strong>La prestation</strong><span>Un autre jour, avec les ${priceOf('diagnostic')} du diagnostic déduits.</span></li>
        </ol>`,
    },
    categories: ['diagnostic'],
    reviewsTag: 'diagnostic',
    faq: [
      { q: 'Quand le diagnostic est-il obligatoire ?', a: 'Avant tout balayage ou changement de couleur nécessitant un éclaircissement.' },
      { q: 'Peut-on faire le diagnostic le jour de la prestation ?', a: 'Non : le diagnostic ne peut pas être réservé le même jour que la prestation technique.' },
      { q: 'Le diagnostic est-il payant ?', a: `Il coûte ${priceOf('diagnostic')}, déduits de votre prochaine prestation si vous convenez ensemble d’un rendez-vous.` },
    ],
    cta: { lines: ['On commence', 'par là ?'], text: `${durationOf('diagnostic')} pour poser les bases de votre projet couleur ou balayage.` },
  });
}
