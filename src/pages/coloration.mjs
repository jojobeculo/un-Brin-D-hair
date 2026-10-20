import { html } from '../lib/html.mjs';
import { servicePage } from '../components/service-page.mjs';
import { diagnosticWarning } from '../components/blocks.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';

export const route = 'coloration-aubiere/';

export default function coloration(ctx) {
  return servicePage(ctx, {
    route,
    crumb: 'Coloration & gloss',
    title: 'Coloration et gloss Davines à Aubière | Un Brun d’Hair',
    description: `Coloration des racines et gloss Davines pour l’éclat, contre les reflets indésirables et les premiers cheveux blancs, ${startingPrice('couleur')} à Aubière.`,
    schemaName: 'Coloration et gloss',
    kicker: 'Couleur',
    h1: html`Coloration <em>&amp; gloss</em> à Aubière`,
    lead: 'Rafraîchir vos racines, raviver l’éclat de votre couleur, neutraliser les reflets indésirables : la coloration et le gloss se font avec les produits Davines.',
    image: 'couleur',
    alt: 'Cheveux cuivrés et brillants mis en forme au fer',
    facts: [['Dès', startingPrice('couleur')], ['Durée', `${durationOf('couleur-scb-courts')} à ${durationOf('couleur-scb-longs')}`]],
    bookLabel: 'Je réserve ma couleur',
    benefitsTitle: html`Une couleur <em>qui brille</em>`,
    benefits: [
      { icon: 'drop', title: 'Racines rafraîchies', text: 'Une couleur uniforme des racines aux longueurs.' },
      { icon: 'sparkle', title: 'L’éclat du gloss', text: 'Brillance, reflets neutralisés, premiers cheveux blancs estompés, sans contrainte d’entretien.' },
      { icon: 'leaf', title: 'Respect du cheveu', text: 'Les colorations et soins Davines, pour une fibre préservée.' },
    ],
    detail: {
      kicker: 'Deux prestations',
      title: html`Couleur <em>ou gloss</em> ?`,
      paragraphs: [
        'La coloration rafraîchit votre couleur en racines. Pour une repousse de plus de 3 mois, ajoutez l’option « Allongement » : on prévoit le temps nécessaire.',
        'Le gloss redonne de l’éclat à votre couleur, neutralise les reflets indésirables et estompe vos premiers cheveux blancs. Pour un gloss sur les longueurs ou un double gloss, pensez aussi à l’option « Allongement ».',
      ],
      extra: html`<div style="margin-top:2rem">${diagnosticWarning(ctx)}</div>`,
    },
    steps: [
      { title: 'Le conseil couleur', text: 'Votre teinte, vos envies, l’entretien que vous êtes prête à faire.' },
      { title: 'La pose', text: 'Coloration en racines ou gloss sur l’ensemble.' },
      { title: 'Le shampoing soin', text: 'Pour fixer la couleur et la brillance.' },
      { title: 'Coupe et brushing', text: 'Selon la formule choisie.' },
    ],
    categories: ['couleur', 'options'],
    compares: ['gloss'],
    shots: ['couleur', 'boucles'],
    reviewsTag: 'couleur',
    products: ['minu-shampoo', 'minu-conditioner', 'alchemic-chocolate'],
    faq: [
      { q: 'Quelle différence entre coloration et gloss ?', a: 'La coloration rafraîchit la couleur en racines. Le gloss redonne de l’éclat, neutralise les reflets indésirables et estompe les premiers cheveux blancs, sans contrainte d’entretien.' },
      { q: 'Quand faut-il ajouter l’option Allongement ?', a: `Pour une repousse de plus de 3 mois, un gloss sur les longueurs ou un double gloss : +${durationOf('opt-allongement')} et +${priceOf('opt-allongement')}.` },
      { q: 'Faut-il un diagnostic avant une coloration ?', a: 'Oui si votre projet demande un éclaircissement : la consultation préalable est alors obligatoire, et elle se fait sur un autre jour que la couleur.' },
      { q: 'Pourquoi les prix sont-ils indiqués « dès » ?', a: 'Le tarif s’ajuste à la longueur, à l’épaisseur de vos cheveux et à votre projet couleur.' },
    ],
    related: ['balayage-aubiere/', 'diagnostic-capillaire-aubiere/', 'boutique/', 'tarifs/'],
    cta: { title: html`Une couleur <em>lumineuse</em> ?`, text: 'Coloration ou gloss, avec ou sans coupe : choisissez votre formule et le créneau sur Planity.' },
  });
}
