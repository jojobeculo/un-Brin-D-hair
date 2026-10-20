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
    h1: html`Diagnostic <em>capillaire</em> à Aubière`,
    lead: `${durationOf('diagnostic')} dédiées à vos envies et à votre chevelure, pour construire ensemble un projet personnalisé, réalisable et adapté à votre quotidien.`,
    image: 'mise-en-forme',
    alt: 'Coiffeuse qui observe et travaille une coiffure',
    facts: [['Durée', durationOf('diagnostic')], ['Prix', `${priceOf('diagnostic')}, déduits ensuite`]],
    bookLabel: 'Je réserve mon diagnostic',
    benefitsTitle: html`Écouter <em>avant de colorer</em>`,
    benefits: [
      { icon: 'ear', title: 'Vos attentes', text: 'La couleur que vous imaginez, photos à l’appui si vous voulez.' },
      { icon: 'drop', title: 'Votre historique', text: 'Colorations, henné, lissages : ce qui a été fait compte.' },
      { icon: 'check', title: 'Un projet réalisable', text: 'Ce qui est possible en une fois, et ce qui demandera plusieurs étapes.' },
    ],
    detail: {
      kicker: 'Pourquoi commencer par là',
      title: html`Un vrai <em>projet</em> couleur`,
      paragraphs: [
        'On prend le temps d’échanger sur vos attentes, votre historique capillaire et vos habitudes, pour définir ensemble un projet en harmonie avec votre nature de cheveux et votre quotidien.',
        `Le diagnostic coûte ${priceOf('diagnostic')}. Ce montant est déduit de votre prochaine prestation si vous convenez ensemble d’un rendez-vous.`,
      ],
    },
    steps: [
      { title: 'Le diagnostic', text: `${durationOf('diagnostic')} au salon pour analyser votre chevelure et vos envies.` },
      { title: 'Le projet', text: 'Ce qui est réalisable, la prestation adaptée et son prix.' },
      { title: 'La prestation', text: `Un autre jour, avec les ${priceOf('diagnostic')} du diagnostic déduits.` },
    ],
    categories: ['diagnostic'],
    reviewsTag: 'diagnostic',
    faq: [
      { q: 'Quand le diagnostic est-il obligatoire ?', a: 'Avant tout balayage ou changement de couleur nécessitant un éclaircissement.' },
      { q: 'Peut-on faire le diagnostic le jour de la prestation ?', a: 'Non : le diagnostic ne peut pas être réservé le même jour que la prestation technique.' },
      { q: 'Le diagnostic est-il payant ?', a: `Il coûte ${priceOf('diagnostic')}, déduits de votre prochaine prestation si vous convenez ensemble d’un rendez-vous.` },
      { q: 'Que dois-je apporter ?', a: 'Des photos de la couleur que vous aimez, et si possible la liste des colorations ou soins faits ces deux dernières années.' },
    ],
    related: ['balayage-aubiere/', 'coloration-aubiere/', 'conseil-coupe/', 'tarifs/'],
    cta: { title: html`On commence <em>par là</em> ?`, text: `${durationOf('diagnostic')} pour poser les bases de votre projet couleur ou balayage. Réservation sur Planity.` },
  });
}
