import { servicePage } from '../components/service-page.mjs';
import { priceOf, durationOf } from '../data/services.mjs';

export const route = 'soins-capillaires-aubiere/';

export default function soins(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Soins Davines',
    title: 'Soins capillaires Davines à Aubière | Un Brun d’Hair',
    description: `Soin Davines adapté aux besoins de vos cheveux, à ajouter à votre coupe, coloration ou balayage (${priceOf('soin-davines')}). Un salon d’Aubière engagé et durable.`,
    schemaName: 'Soin capillaire Davines',
    kicker: 'Soins capillaires',
    lines: ['Soins', 'Davines', 'à Aubière'],
    lead: 'Le soin Davines adapté aux besoins de vos cheveux, pour prolonger votre moment de bien-être et préserver la santé de votre chevelure.',
    book: 'soin',
    bookLabel: 'Réserver un soin',
    detail: {
      kicker: 'Notre démarche',
      lines: ['Beauté', 'durable.'],
      paragraphs: [
        'Le salon travaille exclusivement avec Davines, une marque engagée qui allie performance, respect du cheveu et développement durable. Sa philosophie de « beauté durable » : prendre soin de vos cheveux tout en respectant l’environnement.',
        `L’objectif : préserver la santé de votre chevelure tout en créant des résultats naturels, lumineux et durables. Le soin classique se glisse dans votre rendez-vous, en ${durationOf('soin-davines')}. Bientôt : des rituels capillaires personnalisés.`,
      ],
    },
    categories: ['soin'],
    reviewsTag: 'soin',
    faq: [
      { q: 'Comment ajouter un soin à ma réservation ?', a: 'À l’étape 2 de la réservation, cochez « Soin Davines » : il s’ajoute à votre coupe, à votre coloration ou à votre balayage.' },
      { q: 'Quels produits utilisez-vous ?', a: 'Exclusivement la marque Davines.' },
      { q: 'Combien coûte le soin ?', a: `Le soin Davines (classique) coûte ${priceOf('soin-davines')} et dure ${durationOf('soin-davines')}.` },
    ],
    cta: { lines: ['Un moment', 'pour vous ?'], text: 'Ajoutez le soin Davines à votre prochaine prestation, en un clic à l’étape 2.' },
  });
}
