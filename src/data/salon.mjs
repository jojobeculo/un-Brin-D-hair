// Fiche du salon : toutes les informations pratiques du site viennent d’ici.
// Après une modification, lancer `node build.mjs` pour régénérer les pages.

export const salon = {
  name: 'Un Brun d’Hair',
  owner: 'Sandy',
  // Adresse publique du site : sert aux liens canoniques, au plan du site et aux partages.
  // À remplacer par le nom de domaine définitif.
  siteUrl: 'https://jojobeculo.github.io/un-Brin-D-hair/',

  // Espaces insécables dans le numéro affiché : il ne se coupe jamais en fin de ligne.
  phone: { display: ['04', '44', '44', '82', '87'].join(String.fromCharCode(160)), tel: '+33444448287' },
  // Numéro de mobile WhatsApp au format international sans « + » (ex. 33612345678).
  // Vide : aucun bouton WhatsApp n’est affiché. Le numéro du salon est un fixe.
  whatsapp: '',
  whatsappMessage: 'Bonjour, je souhaiterais obtenir un renseignement concernant une prestation.',
  // Adresse e-mail du salon : affichée dans les mentions légales et utilisée pour les demandes envoyées par e-mail.
  email: '',

  // Réception des formulaires (demande de rendez-vous, contact, alerte dernière minute).
  // endpoint : adresse qui reçoit les formulaires en JSON (Formspree, Getform, Make, Zapier…).
  // sms : mobile qui reçoit les demandes par SMS (le numéro du salon est un fixe).
  // Tout vide : la demande part par e-mail si `email` est rempli, sinon en message Instagram.
  forms: { endpoint: '', sms: '' },

  address: {
    street: '4 bis rue Champvoisin',
    postalCode: '63170',
    city: 'Aubière',
    region: 'Auvergne-Rhône-Alpes',
    country: 'FR',
  },
  geo: { lat: 45.751798, lng: 3.109391 },
  // Communes limitrophes d’Aubière.
  areaServed: ['Aubière', 'Clermont-Ferrand', 'Beaumont', 'Romagnat', 'Pérignat-lès-Sarliève', 'Cournon-d’Auvergne'],

  // day : 0 = dimanche. Sans open/close : fermé. alternate : ouvert une semaine sur deux (affiché sur la vitrine).
  hours: [
    { day: 1, name: 'Lundi', open: '10:00', close: '18:00', alternate: true },
    { day: 2, name: 'Mardi', open: '09:00', close: '19:00' },
    { day: 3, name: 'Mercredi', open: '09:00', close: '19:00' },
    { day: 4, name: 'Jeudi', open: '09:00', close: '19:00' },
    { day: 5, name: 'Vendredi', open: '09:00', close: '19:00' },
    { day: 6, name: 'Samedi', open: '09:00', close: '16:00', alternate: true },
    { day: 0, name: 'Dimanche' },
  ],
  // Date (AAAA-MM-JJ) d’un lundi d’une semaine où le salon ouvre le lundi ET le samedi.
  // Vide : le site indique « une semaine sur deux » sans dire laquelle, et renvoie vers Planity.
  alternateOpenWeek: '',
  hoursNote: 'Lundi et samedi : une semaine sur deux. Les disponibilités exactes sont sur Planity.',

  // Accès, relevés dans OpenStreetMap (octobre 2026) : à vérifier sur place et sur t2c.fr.
  access: {
    landmark: 'Juste à côté de la pharmacie Hauger',
    bus: 'Arrêt Champvoisin (ligne E1, réseau T2C), à environ 85 m',
    parking: 'Stationnement le long de la rue, à environ 70 m',
    bike: 'Arceaux à vélos à environ 110 m',
  },

  // Parcours de Sandy (page « Qui suis-je ? »). openingYear : année d’ouverture du salon, vide si inconnue.
  story: { experienceYears: 9, age: 25, openingYear: '' },

  // Instagram : adresse d’un flux JSON (Behold.so ou équivalent), lue par tools/instagram.mjs.
  instagramFeed: '',

  // Paiement en ligne de la boutique : adresse de la fonction Stripe (voir stripe/README.md). Vide : paiement au retrait.
  stripe: { checkoutEndpoint: '' },
  // Délai de préparation annoncé pour le click and collect.
  clickAndCollect: 'Sandy prépare votre commande et vous prévient dès qu’elle est prête. Retrait au salon, aux heures d’ouverture.',
  payment: 'Carte bancaire et espèces',
  brand: 'Davines',

  rating: {
    value: '5,0',
    planityCount: 31,
    googleCount: 27,
    subscores: [
      ['Accueil', '5,0'],
      ['Propreté', '5,0'],
      ['Cadre & ambiance', '5,0'],
      ['Qualité de la prestation', '5,0'],
    ],
  },

  links: {
    planity: 'https://www.planity.com/un-brun-dhair-63170-aubiere',
    instagram: 'https://www.instagram.com/unbrundhair/',
    tiktok: 'https://www.tiktok.com/@unbrundhair',
    googleMaps: 'https://www.google.com/maps/search/?api=1&query=Un%20Brun%20d%27Hair%204%20bis%20Rue%20Champvoisin%2063170%20Aubi%C3%A8re',
    googleDirections: 'https://www.google.com/maps/dir/?api=1&destination=4%20bis%20Rue%20Champvoisin%2C%2063170%20Aubi%C3%A8re',
    waze: 'https://waze.com/ul?ll=45.751798%2C3.109391&navigate=yes',
    applePlans: 'https://maps.apple.com/?daddr=4%20bis%20Rue%20Champvoisin%2C%2063170%20Aubi%C3%A8re',
  },

  legal: {
    company: 'UN BRUN D’HAIR',
    form: 'société à responsabilité limitée (SARL)',
    siren: '107 324 303',
    siret: '107 324 303 00018',
    naf: '96.02A (Coiffure)',
    vat: 'FR45 107 324 303',
    director: 'Sandy Brun, gérante',
    // Médiateur de la consommation (obligatoire pour la vente en ligne) : nom et site.
    mediator: null,
    // Champs à compléter avant la mise en ligne (null = affiché « à compléter »).
    capital: null,
    registration: null,
    host: null,
  },
};
