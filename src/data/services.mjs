import { formatDuration, formatPrice } from '../../assets/js/lib/format.js';

// Carte des prestations. Durées en minutes, prix en euros TTC.
// `from: true` affiche « dès » : le prix s’ajuste à la chevelure et au projet.
// `len` choisit le pictogramme de longueur : courts, milongs ou longs.
// `name` est le libellé complet de la prestation (questionnaire, données structurées).

export const categories = [
  {
    id: 'diagnostic',
    label: 'Diagnostic',
    page: 'diagnostic-capillaire-aubiere/',
    title: 'Diagnostic capillaire',
    description: '15 minutes dédiées à vos envies et à votre chevelure. On échange sur vos attentes, votre historique capillaire et vos habitudes pour définir ensemble un projet personnalisé.',
    highlight: true,
    groups: [
      {
        services: [
          { id: 'diagnostic', label: 'Diagnostic personnalisé', sub: 'Déduit de votre prochaine prestation si vous convenez ensemble d’un rendez-vous', name: 'Diagnostic capillaire', duration: 15, price: 15 },
        ],
      },
    ],
  },
  {
    id: 'femme',
    label: 'Femme',
    page: 'coupe-femme-aubiere/',
    title: 'Coupes & brushings',
    titleAccent: 'Femme',
    description: 'Diagnostic et conseils personnalisés à chaque rendez-vous. Pour prolonger ce moment, ajoutez le soin Davines adapté à vos cheveux.',
    options: ['opt-epais', 'soin-davines'],
    featured: true,
    groups: [
      {
        title: 'Shampoing + coupe + brushing',
        services: [
          { id: 'femme-scb-courts', len: 'courts', label: 'Cheveux courts', sub: 'Au niveau de l’oreille', name: 'Shampoing + coupe + brushing · cheveux courts', duration: 30, price: 37 },
          { id: 'femme-scb-milongs', len: 'milongs', label: 'Cheveux mi-longs', sub: 'Au-dessus des épaules', name: 'Shampoing + coupe + brushing · cheveux mi-longs', duration: 45, price: 40 },
          { id: 'femme-scb-longs', len: 'longs', label: 'Cheveux longs', sub: 'En-dessous des épaules', name: 'Shampoing + coupe + brushing · cheveux longs', duration: 60, price: 43 },
        ],
      },
      {
        title: 'Shampoing + brushing',
        services: [
          { id: 'femme-sb-courts', len: 'courts', label: 'Cheveux courts', name: 'Shampoing + brushing · cheveux courts', duration: 30, price: 26 },
          { id: 'femme-sb-milongs', len: 'milongs', label: 'Cheveux mi-longs', name: 'Shampoing + brushing · cheveux mi-longs', duration: 45, price: 29 },
          { id: 'femme-sb-longs', len: 'longs', label: 'Cheveux longs', name: 'Shampoing + brushing · cheveux longs', duration: 60, price: 32 },
        ],
      },
    ],
  },
  {
    id: 'couleur',
    label: 'Couleur & gloss',
    page: 'coloration-aubiere/',
    title: 'Coloration',
    titleAccent: 'ou gloss',
    description: 'Rafraîchissement des racines, brillance, neutralisation des reflets. Le gloss redonne de l’éclat à votre couleur et estompe les premiers cheveux blancs, sans contrainte d’entretien.',
    tip: 'Repousse de plus de 3 mois, gloss sur les longueurs ou double gloss ? Ajoutez l’option Allongement.',
    options: ['opt-allongement', 'opt-epais', 'soin-davines'],
    gate: 'eclaircissement',
    groups: [
      {
        title: 'Couleur ou gloss + shampoing + coupe + brushing',
        services: [
          { id: 'couleur-scb-courts', len: 'courts', label: 'Cheveux courts', name: 'Couleur ou gloss + shampoing + coupe + brushing · cheveux courts', duration: 90, price: 75, from: true },
          { id: 'couleur-scb-milongs', len: 'milongs', label: 'Cheveux mi-longs', name: 'Couleur ou gloss + shampoing + coupe + brushing · cheveux mi-longs', duration: 105, price: 78, from: true },
          { id: 'couleur-scb-longs', len: 'longs', label: 'Cheveux longs', name: 'Couleur ou gloss + shampoing + coupe + brushing · cheveux longs', duration: 120, price: 81, from: true },
        ],
      },
      {
        title: 'Couleur ou gloss + shampoing + brushing',
        services: [
          { id: 'couleur-sb-courts', len: 'courts', label: 'Cheveux courts', name: 'Couleur ou gloss + shampoing + brushing · cheveux courts', duration: 90, price: 64, from: true },
          { id: 'couleur-sb-milongs', len: 'milongs', label: 'Cheveux mi-longs', name: 'Couleur ou gloss + shampoing + brushing · cheveux mi-longs', duration: 105, price: 67, from: true },
        ],
      },
    ],
  },
  {
    id: 'balayage',
    label: 'Balayages',
    page: 'balayage-aubiere/',
    title: 'Balayages',
    titleAccent: 'sur-mesure',
    description: 'Deux intensités, un même principe : un résultat lumineux, harmonieux et facile à porter au quotidien. Shampoing, coupe et brushing inclus.',
    alert: 'Consultation préalable obligatoire : réservez d’abord votre diagnostic.',
    options: ['opt-epais', 'soin-davines'],
    gate: 'diagnostic',
    groups: [
      {
        title: 'Balayage Lumières & Subtil',
        description: 'Tout en finesse : une lumière naturelle, sans contraste marqué. Un rendu doux, élégant et facile à entretenir.',
        services: [
          { id: 'balayage-lumieres-courts', len: 'courts', label: 'Cheveux courts', name: 'Balayage Lumières & Subtil + shampoing + coupe + brushing · cheveux courts', duration: 180, price: 110, from: true },
          { id: 'balayage-lumieres-longs', len: 'longs', label: 'Cheveux longs', name: 'Balayage Lumières & Subtil + shampoing + coupe + brushing · cheveux longs', duration: 270, price: 140, from: true },
        ],
      },
      {
        title: 'Balayage Éclat & Intense',
        description: 'Plus de relief et de dimension grâce à un travail de nuances : un changement plus visible, qui reste naturel.',
        services: [
          { id: 'balayage-eclat-courts', len: 'courts', label: 'Cheveux courts', name: 'Balayage Éclat & Intense + shampoing + coupe + brushing · cheveux courts', duration: 240, price: 130, from: true },
          { id: 'balayage-eclat-longs', len: 'longs', label: 'Mi-longs à longs', name: 'Balayage Éclat & Intense + shampoing + coupe + brushing · cheveux mi-longs à longs', duration: 330, price: 160, from: true },
        ],
      },
    ],
  },
  {
    id: 'homme',
    label: 'Homme',
    page: 'coupe-homme-aubiere/',
    title: 'Coupe',
    titleAccent: 'Homme',
    description: 'Une prestation personnalisée, pour une coupe adaptée à vos envies.',
    groups: [
      {
        services: [
          { id: 'homme-forfait', label: 'Forfait homme', sub: 'Shampoing, coupe, coiffage', name: 'Forfait homme · shampoing, coupe, coiffage', duration: 30, price: 25 },
        ],
      },
    ],
  },
  {
    id: 'enfant',
    label: 'Enfants',
    page: 'coupe-homme-aubiere/',
    anchor: 'enfants',
    title: 'Enfants',
    titleAccent: '−12 ans',
    description: 'Une coupe pensée pour les plus jeunes, dans une ambiance calme et bienveillante pour que chaque enfant se sente à l’aise.',
    groups: [
      {
        services: [
          { id: 'enfant-garcon', label: 'Coupe garçon', name: 'Coupe garçon (−12 ans)', duration: 30, price: 15 },
          { id: 'enfant-fille-courts', len: 'milongs', label: 'Coupe fille', sub: 'Cheveux courts à mi-longs', name: 'Coupe fille (−12 ans) · cheveux courts à mi-longs', duration: 30, price: 25 },
          { id: 'enfant-fille-longs', len: 'longs', label: 'Coupe fille', sub: 'Cheveux longs', name: 'Coupe fille (−12 ans) · cheveux longs', duration: 45, price: 30 },
        ],
      },
    ],
  },
  {
    id: 'soin',
    label: 'Soins',
    page: 'soin-capillaire-aubiere/',
    title: 'La carte',
    titleAccent: 'des soins',
    description: 'Le soin Davines adapté aux besoins de vos cheveux. Bientôt : des rituels capillaires personnalisés pour prolonger votre moment de bien-être.',
    groups: [
      {
        services: [
          { id: 'soin-davines', label: 'Soin Davines', sub: 'Classique', name: 'Soin Davines (classique)', hint: 'Le soin adapté aux besoins de vos cheveux, pour prolonger le moment.', duration: 5, price: 7 },
        ],
      },
    ],
  },
  {
    id: 'options',
    label: 'En plus',
    title: 'Les petits trucs',
    titleAccent: 'en plus',
    description: 'À ajouter à votre réservation sur Planity : on prévoit ainsi le temps qu’il faut pour vous et pour votre chevelure.',
    bookable: false,
    groups: [
      {
        services: [
          { id: 'opt-epais', label: 'Cheveux épais', sub: 'Pour les chevelures généreuses', name: 'Cheveux épais', hint: 'Pour les chevelures généreuses : on prévoit le temps qu’il faut.', duration: 30, price: 20, option: true },
          { id: 'opt-allongement', label: 'Allongement gloss ou couleur', sub: 'Pour raviver longueurs et pointes', name: 'Allongement gloss ou couleur', hint: 'Repousse de plus de 3 mois, gloss sur les longueurs ou double gloss.', duration: 30, price: 20, option: true },
        ],
      },
    ],
  },
];

export const category = (id) => categories.find((item) => item.id === id);

export const allServices = categories.flatMap((item) => item.groups.flatMap((group) => group.services.map((service) => ({ ...service, category: item.id }))));

export const service = (id) => allServices.find((item) => item.id === id);

// Prix et durées pour les textes des pages, au format affiché : priceOf('diagnostic') -> « 15 € ».
export const priceOf = (id) => formatPrice(service(id).price, service(id).from);
export const durationOf = (id) => formatDuration(service(id).duration);

// Prix d’appel d’une catégorie, ou d’un de ses groupes : le plus bas, avec « dès »
// s’il y a plusieurs prix ou un prix variable. startingPrice('femme', 1) -> « dès 26 € ».
export function startingPrice(id, groupIndex) {
  const groups = category(id).groups;
  const items = (groupIndex === undefined ? groups : [groups[groupIndex]]).flatMap((group) => group.services);
  const min = Math.min(...items.map((item) => item.price));
  return formatPrice(min, items.length > 1 || items.some((item) => item.from));
}

// Prestations réservables, intégrées en JSON dans les pages qui calculent un prix (questionnaire).
export function servicesData() {
  return allServices.map(({ id, name, duration, price, from }) => ({ id, name, duration, price, from: Boolean(from) }));
}
