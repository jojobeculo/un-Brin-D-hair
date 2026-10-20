import { servicePage } from '../components/service-page.mjs';
import { lengthsLegend } from '../components/blocks.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';

export const route = 'coiffeur-femme-aubiere/';

export default function femme(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Coupe femme',
    title: 'Coiffeur femme à Aubière : coupe et brushing | Un Brun d’Hair',
    description: `Coupe femme ${startingPrice('femme', 0)} et brushing ${startingPrice('femme', 1)} à Aubière, près de Clermont-Ferrand, avec diagnostic et conseils personnalisés à chaque rendez-vous.`,
    schemaName: 'Coupe et brushing femme',
    kicker: 'Coupes & brushings',
    lines: ['Coiffeur', 'femme', 'à Aubière'],
    lead: 'Shampoing, coupe et brushing, ou brushing seul : chaque rendez-vous commence par l’écoute de vos envies et se termine par des conseils pour votre quotidien.',
    book: 'femme',
    bookLabel: 'Réserver une coupe',
    detail: {
      kicker: 'La coupe',
      lines: ['Une coupe', 'qui vous', 'ressemble.'],
      paragraphs: [
        'Court, mi-long ou long : la durée et le tarif dépendent de la longueur de vos cheveux. Pour choisir la bonne ligne, un repère simple :',
      ],
      extra: lengthsLegend(),
    },
    categories: ['femme', 'soin', 'options'],
    reviewsTag: 'femme',
    faq: [
      { q: 'Comment savoir si mes cheveux sont courts, mi-longs ou longs ?', a: 'Courts : au niveau de l’oreille. Mi-longs : au-dessus de l’épaule. Longs : en-dessous de l’épaule.' },
      { q: 'Le shampoing et le brushing sont-ils compris ?', a: 'Oui. La coupe femme comprend le shampoing, la coupe et le brushing. Le brushing seul comprend aussi le shampoing.' },
      { q: 'J’ai les cheveux très épais, que choisir ?', a: `Ajoutez l’option « cheveux épais » à votre réservation (+${durationOf('opt-epais')}, +${priceOf('opt-epais')}) : on prévoit ainsi le temps qu’il faut.` },
      { q: 'Peut-on ajouter un soin ?', a: `Oui : le soin Davines (classique) s’ajoute à votre prestation, pour ${durationOf('soin-davines')} et ${priceOf('soin-davines')}.` },
    ],
    cta: { lines: ['Envie', 'de changement ?'], text: 'Choisissez votre coupe, ajoutez un soin si vous le souhaitez, puis le créneau qui vous arrange.' },
  });
}
