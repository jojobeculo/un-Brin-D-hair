import { html } from '../lib/html.mjs';
import { pageHero, gift, faq, faqSchema, social } from '../components/blocks.mjs';
import { startingPrice } from '../data/services.mjs';

export const route = 'carte-cadeau/';

const FAQ = [
  { q: 'Comment acheter une carte cadeau ?', a: 'En ligne sur Planity : ouvrez la page du salon et cliquez sur « Offrir ». Vous pouvez aussi l’acheter directement au salon, par carte bancaire ou en espèces.' },
  { q: 'Quel montant choisir ?', a: `Quelques repères : un brushing ${startingPrice('femme', 1)}, une coupe ${startingPrice('femme', 0)}, un gloss ${startingPrice('couleur')}, un balayage ${startingPrice('balayage')}.` },
];

export default function carteCadeau(ctx) {
  const body = html`
    ${pageHero(ctx, {
      kicker: 'Offrir un moment',
      lines: ['Carte', 'cadeau'],
      lead: 'Une coupe, un gloss, un balayage ou un soin Davines : offrez un moment chez Un Brun d’Hair, pour un anniversaire, Noël, la fête des mères… ou juste comme ça.',
      book: '',
      bookLabel: 'Réserver pour moi',
      secondary: { route: 'tarifs/', label: 'Voir les tarifs' },
    })}
    ${gift(ctx)}
    ${faq(FAQ)}
    ${social()}`;

  return {
    title: 'Carte cadeau coiffure à Aubière | Un Brun d’Hair',
    description: 'Offrez un moment chez Un Brun d’Hair à Aubière : carte cadeau en ligne sur Planity ou au salon, pour une coupe, un gloss, un balayage ou un soin Davines.',
    breadcrumb: [{ label: 'Carte cadeau', route }],
    schema: [faqSchema(FAQ)],
    body,
  };
}
