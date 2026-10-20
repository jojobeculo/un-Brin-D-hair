import { html } from '../lib/html.mjs';
import { servicePage } from '../components/service-page.mjs';
import { priceOf, durationOf } from '../data/services.mjs';

export const route = 'soin-capillaire-aubiere/';

export default function soin(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Soins Davines',
    title: 'Soin capillaire Davines à Aubière | Un Brun d’Hair',
    description: `Soin Davines adapté aux besoins de vos cheveux, à ajouter à votre coupe, coloration ou balayage (${priceOf('soin-davines')}). Un salon d’Aubière engagé pour une beauté durable.`,
    schemaName: 'Soin capillaire Davines',
    kicker: 'Soins capillaires',
    h1: html`Soins <em>Davines</em> à Aubière`,
    lead: 'Le soin Davines adapté aux besoins de vos cheveux, pour prolonger votre moment de bien-être et préserver la santé de votre chevelure.',
    image: 'soin',
    alt: 'Shampoing et soin au bac à shampoing',
    facts: [['Soin classique', priceOf('soin-davines')], ['Durée', `+${durationOf('soin-davines')}`]],
    benefitsTitle: html`Des cheveux <em>en bonne santé</em>`,
    benefits: [
      { icon: 'drop', title: 'Hydratation', text: 'Pour les cheveux secs, colorés ou abîmés par la chaleur.' },
      { icon: 'sparkle', title: 'Brillance', text: 'Une fibre lissée, qui reflète mieux la lumière.' },
      { icon: 'leaf', title: 'Beauté durable', text: 'Davines conçoit ses soins en limitant leur impact sur l’environnement.' },
    ],
    detail: {
      kicker: 'Notre démarche',
      title: html`Prendre le <em>temps</em>`,
      paragraphs: [
        'Le salon travaille exclusivement avec Davines, une marque engagée qui allie performance, respect du cheveu et développement durable.',
        `Le soin classique se glisse dans votre rendez-vous, en ${durationOf('soin-davines')}. Bientôt : des rituels capillaires personnalisés.`,
      ],
    },
    steps: [
      { title: 'Le diagnostic', text: 'Sécheresse, casse, cuir chevelu : on identifie le besoin.' },
      { title: 'Le soin', text: 'Posé au bac, pendant votre prestation.' },
      { title: 'Le conseil', text: 'Le produit qui prolonge l’effet à la maison.' },
    ],
    categories: ['soin'],
    shots: ['soin', 'brushing'],
    reviewsTag: 'soin',
    products: ['nounou-mask', 'oi-hair-butter', 'naturaltech-calming'],
    faq: [
      { q: 'Comment ajouter un soin à ma réservation ?', a: 'Sur Planity, ajoutez le « Soin Davines » à votre coupe, à votre coloration ou à votre balayage. Vous pouvez aussi le demander au salon.' },
      { q: 'Quels produits utilisez-vous ?', a: 'Exclusivement la marque Davines. Une sélection est disponible en click and collect dans la boutique du site.' },
      { q: 'Combien coûte le soin ?', a: `Le soin Davines (classique) coûte ${priceOf('soin-davines')} et dure ${durationOf('soin-davines')}.` },
    ],
    related: ['boutique/', 'coupe-femme-aubiere/', 'coloration-aubiere/', 'diagnostic-capillaire-aubiere/'],
    cta: { title: html`Un moment <em>pour vous</em> ?`, text: 'Ajoutez le soin Davines à votre prochaine prestation sur Planity.' },
  });
}
