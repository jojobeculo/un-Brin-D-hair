import { servicePage } from '../components/service-page.mjs';
import { diagnosticWarning, GALLERY } from '../components/blocks.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';

export const route = 'coloration-aubiere/';

export default function coloration(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Coloration & gloss',
    title: 'Coloration et gloss Davines à Aubière | Un Brun d’Hair',
    description: `Coloration des racines et gloss Davines pour l’éclat et contre les reflets indésirables, ${startingPrice('couleur')} à Aubière. Diagnostic préalable si éclaircissement.`,
    schemaName: 'Coloration et gloss',
    kicker: 'Couleur',
    lines: ['Coloration', '& gloss', 'à Aubière'],
    lead: 'Rafraîchir vos racines, raviver l’éclat de votre couleur, neutraliser les reflets indésirables : la coloration et le gloss se font avec les produits Davines.',
    book: 'couleur',
    bookLabel: 'Réserver une coloration',
    detail: {
      kicker: 'Deux prestations',
      lines: ['Couleur', 'ou gloss ?'],
      paragraphs: [
        'La coloration rafraîchit votre couleur en racines. Pour une repousse de plus de 3 mois, ajoutez l’option « Allongement » : on prévoit ainsi le temps nécessaire pour un résultat optimal.',
        'Le gloss redonne de l’éclat à votre couleur, neutralise les reflets indésirables et estompe vos premiers cheveux blancs, sans créer de contrainte d’entretien. Pour un gloss sur les longueurs ou un double gloss, pensez aussi à l’option « Allongement ».',
      ],
      extra: diagnosticWarning(ctx),
    },
    categories: ['couleur', 'options'],
    gallery: [GALLERY[3]],
    reviewsTag: 'couleur',
    faq: [
      { q: 'Quelle différence entre coloration et gloss ?', a: 'La coloration rafraîchit la couleur en racines. Le gloss redonne de l’éclat, neutralise les reflets indésirables et estompe les premiers cheveux blancs, sans contrainte d’entretien.' },
      { q: 'Quand faut-il ajouter l’option Allongement ?', a: `Pour une repousse de plus de 3 mois, un gloss sur les longueurs ou un double gloss : +${durationOf('opt-allongement')} et +${priceOf('opt-allongement')}.` },
      { q: 'Faut-il un diagnostic avant une coloration ?', a: 'Oui si votre projet demande un éclaircissement : la consultation préalable est alors obligatoire, et elle se fait sur un autre jour que la couleur.' },
      { q: 'Pourquoi les prix sont-ils indiqués « dès » ?', a: 'Le tarif s’ajuste à la longueur, à l’épaisseur de vos cheveux et à votre projet couleur.' },
    ],
    cta: { lines: ['Une couleur', 'qui brille ?'], text: 'Coloration ou gloss, avec ou sans coupe : choisissez votre formule et le créneau qui vous arrange.' },
  });
}
