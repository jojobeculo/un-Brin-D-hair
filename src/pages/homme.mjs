import { salon } from '../data/salon.mjs';
import { servicePage } from '../components/service-page.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';

export const route = 'coiffeur-homme-aubiere/';

export default function homme(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Homme & enfant',
    title: 'Coiffeur homme et enfant à Aubière | Un Brun d’Hair',
    description: `Coupe homme à Aubière : forfait shampoing, coupe et coiffage à ${priceOf('homme-forfait')}. Coupe enfant de moins de 12 ans ${startingPrice('enfant')}. Réservation en ligne ou par téléphone.`,
    schemaName: 'Coupe homme et enfant',
    kicker: 'Homme & enfant',
    lines: ['Coiffeur', 'homme', 'à Aubière'],
    lead: 'Un forfait simple et complet : shampoing, coupe et coiffage, pour une coupe adaptée à vos envies. Les enfants de moins de 12 ans sont aussi les bienvenus.',
    book: 'homme',
    bookLabel: 'Réserver une coupe',
    detail: {
      kicker: 'Le forfait',
      lines: ['Simple,', 'net,', 'personnalisé.'],
      paragraphs: [
        `Le forfait homme comprend le shampoing, la coupe et le coiffage, en ${durationOf('homme-forfait')}. Comme pour chaque prestation du salon, tout commence par vos envies : la coupe est pensée pour vos cheveux et votre quotidien.`,
        'Pour les plus jeunes, la coupe se fait dans une ambiance calme et bienveillante, pour que chaque enfant se sente à l’aise.',
      ],
    },
    categories: ['homme', 'enfant'],
    reviewsTag: 'homme',
    faq: [
      { q: 'Que comprend le forfait homme ?', a: `Le shampoing, la coupe et le coiffage, pour ${priceOf('homme-forfait')} et ${durationOf('homme-forfait')}.` },
      { q: 'Quels sont les tarifs pour les enfants ?', a: `Pour les moins de 12 ans : ${priceOf('enfant-garcon')} la coupe garçon, ${priceOf('enfant-fille-courts')} la coupe fille sur cheveux courts à mi-longs, ${priceOf('enfant-fille-longs')} sur cheveux longs.` },
      { q: 'Comment réserver ?', a: `En ligne sur Planity, en 3 clics depuis ce site, ou par téléphone au ${salon.phone.display}.` },
    ],
    cta: { lines: ['Une coupe', 'nette ?'], text: `${durationOf('homme-forfait')}, un forfait complet, et le créneau qui vous arrange.` },
  });
}
