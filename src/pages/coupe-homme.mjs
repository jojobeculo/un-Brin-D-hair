import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { servicePage } from '../components/service-page.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';

export const route = 'coupe-homme-aubiere/';

export default function coupeHomme(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Homme & enfant',
    title: 'Coupe homme et enfant à Aubière | Un Brun d’Hair',
    description: `Coupe homme à Aubière : forfait shampoing, coupe et coiffage à ${priceOf('homme-forfait')}. Coupe enfant de moins de 12 ans ${startingPrice('enfant')}. Réservation en ligne sur Planity.`,
    schemaName: 'Coupe homme et enfant',
    kicker: 'Homme & enfant',
    h1: html`Coupe homme <em>et enfant</em> à Aubière`,
    lead: 'Un forfait simple et complet : shampoing, coupe et coiffage, pour une coupe adaptée à vos envies. Les enfants de moins de 12 ans sont aussi les bienvenus.',
    image: 'outils',
    alt: 'Ciseaux, tondeuse et brosses sur le plan de travail',
    facts: [['Forfait homme', priceOf('homme-forfait')], ['Durée', durationOf('homme-forfait')], ['Enfant', startingPrice('enfant')]],
    bookLabel: 'Je réserve ma coupe',
    benefitsTitle: html`Net, simple, <em>personnalisé</em>`,
    benefits: [
      { icon: 'ear', title: 'À l’écoute', text: 'Classique, dégradé, texturé : la coupe part de ce que vous aimez et de votre quotidien.' },
      { icon: 'clock', title: `${durationOf('homme-forfait')} chrono`, text: 'Shampoing, coupe et coiffage compris, sans attente : sur rendez-vous.' },
      { icon: 'heart', title: 'Les enfants à l’aise', text: 'Une ambiance calme et bienveillante pour les moins de 12 ans.' },
    ],
    detail: {
      kicker: 'Le forfait',
      title: html`Tout est <em>compris</em>`,
      paragraphs: [
        `Le forfait homme comprend le shampoing, la coupe et le coiffage, en ${durationOf('homme-forfait')}, pour ${priceOf('homme-forfait')}.`,
        'Pour les plus jeunes, la coupe garçon et la coupe fille ont chacune leur tarif, selon la longueur des cheveux.',
      ],
    },
    steps: [
      { title: 'On en parle', text: 'La coupe que vous voulez, et comment vous vous coiffez.' },
      { title: 'Le shampoing', text: 'Pour une coupe précise sur cheveux propres.' },
      { title: 'La coupe', text: 'Aux ciseaux et à la tondeuse, selon le style.' },
      { title: 'Le coiffage', text: 'Avec le produit adapté, et le conseil pour le refaire.' },
    ],
    categories: ['homme', 'enfant'],
    reviewsTag: 'homme',
    products: ['pliable-paste', 'dry-texturizer', 'naturaltech-energizing'],
    faq: [
      { q: 'Que comprend le forfait homme ?', a: `Le shampoing, la coupe et le coiffage, pour ${priceOf('homme-forfait')} et ${durationOf('homme-forfait')}.` },
      { q: 'Quels sont les tarifs pour les enfants ?', a: `Pour les moins de 12 ans : ${priceOf('enfant-garcon')} la coupe garçon, ${priceOf('enfant-fille-courts')} la coupe fille sur cheveux courts à mi-longs, ${priceOf('enfant-fille-longs')} sur cheveux longs.` },
      { q: 'Faites-vous la barbe ?', a: 'Non : le salon propose la coupe et le coiffage, pas la taille de barbe.' },
      { q: 'Comment réserver ?', a: `En ligne sur Planity, à toute heure, ou par téléphone au ${salon.phone.display}.` },
    ],
    related: ['conseil-coupe/', 'boutique/', 'tarifs/', 'contact/'],
    cta: { title: html`Une coupe <em>nette</em> ?`, text: `${durationOf('homme-forfait')}, un forfait complet, et le créneau qui vous arrange sur Planity.` },
  });
}
