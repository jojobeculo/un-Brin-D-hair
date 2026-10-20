import { html } from '../lib/html.mjs';
import { servicePage } from '../components/service-page.mjs';
import { lengthsLegend } from '../components/blocks.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';

export const route = 'coupe-femme-aubiere/';

export default function coupeFemme(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Coupe femme',
    title: 'Coupe femme et brushing à Aubière | Un Brun d’Hair',
    description: `Coupe femme ${startingPrice('femme', 0)} et brushing ${startingPrice('femme', 1)} à Aubière, près de Clermont-Ferrand : diagnostic de vos cheveux et conseils personnalisés à chaque rendez-vous.`,
    schemaName: 'Coupe et brushing femme',
    kicker: 'Coupe & brushing',
    h1: html`Coupe femme <em>à Aubière</em>`,
    lead: 'Shampoing, coupe et brushing, ou brushing seul : chaque rendez-vous commence par l’écoute de vos envies et se termine par des conseils pour votre quotidien.',
    image: 'coupe',
    alt: 'Coupe aux ciseaux sur cheveux bruns lisses',
    facts: [['Coupe & brushing', startingPrice('femme', 0)], ['Brushing', startingPrice('femme', 1)], ['Durée', `${durationOf('femme-scb-courts')} à ${durationOf('femme-scb-longs')}`]],
    bookLabel: 'Je réserve ma coupe',
    benefitsTitle: html`Une coupe qui <em>vous ressemble</em>`,
    benefits: [
      { icon: 'ear', title: 'Vos envies d’abord', text: 'On parle de vos habitudes, de votre temps le matin et de la coupe que vous aimez porter.' },
      { icon: 'scissors', title: 'Une coupe sur-mesure', text: 'Pensée pour votre nature de cheveux et la forme de votre visage, pas pour une tendance.' },
      { icon: 'sparkle', title: 'Facile à coiffer', text: 'Vous repartez avec les gestes et les produits pour retrouver le résultat chez vous.' },
      { icon: 'leaf', title: 'Soins Davines', text: 'Shampoing et soins respectueux du cheveu et de l’environnement.' },
    ],
    detail: {
      kicker: 'Les longueurs',
      title: html`Court, mi-long <em>ou long</em>`,
      paragraphs: ['La durée et le tarif dépendent de la longueur de vos cheveux au moment du rendez-vous. Un repère simple :'],
      extra: html`<div style="margin-top:1.5rem">${lengthsLegend()}</div>`,
    },
    steps: [
      { title: 'L’accueil et le conseil', text: 'Vos envies, votre routine, la nature de vos cheveux.' },
      { title: 'Le shampoing', text: 'Avec les produits Davines adaptés à vos cheveux.' },
      { title: 'La coupe', text: 'Précise, pensée pour bouger avec vous.' },
      { title: 'Le brushing', text: 'Et les conseils pour le refaire à la maison.' },
    ],
    categories: ['femme', 'soin', 'options'],
    shots: ['coupe', 'brushing', 'mise-en-forme'],
    reviewsTag: 'femme',
    products: ['oi-shampoo', 'oi-all-in-one-milk', 'volu-hair-mist'],
    faq: [
      { q: 'Comment savoir si mes cheveux sont courts, mi-longs ou longs ?', a: 'Courts : au niveau de l’oreille. Mi-longs : au-dessus de l’épaule. Longs : en-dessous de l’épaule.' },
      { q: 'Le shampoing et le brushing sont-ils compris ?', a: 'Oui. La coupe femme comprend le shampoing, la coupe et le brushing. Le brushing seul comprend aussi le shampoing.' },
      { q: 'J’ai les cheveux très épais, que choisir ?', a: `Ajoutez l’option « cheveux épais » lors de votre réservation (+${durationOf('opt-epais')}, +${priceOf('opt-epais')}) : on prévoit ainsi le temps qu’il faut.` },
      { q: 'Je ne sais pas quelle coupe choisir.', a: 'Faites le questionnaire « Quelle coupe pour moi ? » sur ce site : il propose 3 coupes adaptées à vos cheveux et à votre visage. Sandy affine ensuite avec vous au salon.' },
      { q: 'Peut-on ajouter un soin ?', a: `Oui : le soin Davines (classique) s’ajoute à votre prestation, pour ${durationOf('soin-davines')} et ${priceOf('soin-davines')}.` },
    ],
    related: ['conseil-coupe/', 'coloration-aubiere/', 'soin-capillaire-aubiere/', 'tarifs/'],
    cta: { title: html`Envie <em>de changement</em> ?`, text: 'Choisissez votre coupe et le créneau qui vous arrange sur Planity : la confirmation est immédiate.' },
  });
}
