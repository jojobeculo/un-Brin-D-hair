import { html } from '../lib/html.mjs';
import { servicePage } from '../components/service-page.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';

export const route = 'balayage-aubiere/';

export default function balayage(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Balayage',
    title: 'Balayage sur-mesure à Aubière | Un Brun d’Hair',
    description: `Balayage à Aubière : Lumières & Subtil ${startingPrice('balayage', 0)}, Éclat & Intense ${startingPrice('balayage', 1)}, coupe et brushing inclus. Diagnostic préalable obligatoire.`,
    schemaName: 'Balayage',
    kicker: 'Balayages sur-mesure',
    h1: html`Balayage <em>à Aubière</em>`,
    lead: 'Deux intensités, un même principe : un résultat lumineux, harmonieux et facile à porter au quotidien. Shampoing, coupe et brushing sont inclus.',
    image: 'boucles',
    alt: 'Cheveux longs méchés blonds et bouclés, vus de dos',
    facts: [['Lumières & Subtil', startingPrice('balayage', 0)], ['Éclat & Intense', startingPrice('balayage', 1)], ['Diagnostic', priceOf('diagnostic')]],
    bookLabel: 'Je réserve mon diagnostic',
    benefitsTitle: html`De la lumière, <em>sans démarcation</em>`,
    benefits: [
      { icon: 'sparkle', title: 'Un rendu naturel', text: 'Des nuances posées à main levée, là où la lumière toucherait vos cheveux.' },
      { icon: 'clock', title: 'Une repousse douce', text: 'Pas de ligne nette en racines : le balayage s’entretient en espaçant les rendez-vous.' },
      { icon: 'ear', title: 'Un projet réaliste', text: 'Le diagnostic préalable vérifie ce que vos cheveux peuvent supporter.' },
      { icon: 'leaf', title: 'Cheveux préservés', text: 'Soins Davines pendant et après l’éclaircissement.' },
    ],
    detail: {
      kicker: 'Deux techniques',
      title: html`Lumières <em>ou éclat</em> ?`,
      paragraphs: [
        'Le balayage Lumières & Subtil se fait tout en finesse : une lumière naturelle sans contraste marqué, un rendu doux et facile à entretenir.',
        'Le balayage Éclat & Intense apporte davantage de relief grâce à un travail de nuances : un résultat plus lumineux, en harmonie avec votre couleur.',
      ],
    },
    steps: [
      { title: 'Le diagnostic', text: `${durationOf('diagnostic')}, obligatoire, un autre jour. Les ${priceOf('diagnostic')} sont déduits du balayage.` },
      { title: 'Le balayage', text: `De ${durationOf('balayage-lumieres-courts')} à ${durationOf('balayage-eclat-longs')} selon la technique et la longueur.` },
      { title: 'Le soin', text: 'Pour refermer la fibre et faire briller les nuances.' },
      { title: 'Coupe et brushing', text: 'Inclus, pour repartir avec un résultat fini.' },
    ],
    categories: ['balayage', 'diagnostic', 'options'],
    compares: ['balayage-lumieres', 'balayage-eclat'],
    shots: ['boucles', 'couleur', 'brushing'],
    reviewsTag: 'balayage',
    products: ['heart-of-glass-shampoo', 'heart-of-glass-conditioner', 'oi-oil'],
    faq: [
      { q: 'Le diagnostic est-il obligatoire avant un balayage ?', a: `Oui. Cette consultation de ${durationOf('diagnostic')} permet d’analyser votre chevelure et de construire un projet réalisable. Elle coûte ${priceOf('diagnostic')}, déduits de votre balayage si vous convenez ensemble d’un rendez-vous.` },
      { q: 'Peut-on faire le diagnostic et le balayage le même jour ?', a: 'Non : le diagnostic ne peut pas être réservé le même jour que la prestation technique.' },
      { q: 'Combien de temps dure un balayage ?', a: `De ${durationOf('balayage-lumieres-courts')} à ${durationOf('balayage-eclat-longs')} selon la technique et la longueur, shampoing, coupe et brushing compris.` },
      { q: 'Quelle différence entre Lumières & Subtil et Éclat & Intense ?', a: 'Lumières & Subtil apporte une lumière naturelle, sans contraste marqué. Éclat & Intense donne plus de relief et un résultat plus visible, grâce à un travail de nuances.' },
      { q: 'Comment entretenir mon balayage ?', a: 'Un shampoing doux pour cheveux éclaircis, comme la gamme Heart of Glass de Davines, et une huile sur les pointes. Sandy vous conseille selon vos cheveux.' },
    ],
    related: ['diagnostic-capillaire-aubiere/', 'coloration-aubiere/', 'realisations/', 'boutique/'],
    cta: { title: html`Envie <em>de lumière</em> ?`, text: 'Commencez par le diagnostic sur Planity : 15 minutes pour construire votre projet.' },
  });
}
