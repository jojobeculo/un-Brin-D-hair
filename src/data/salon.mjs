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

  // day : 0 = dimanche. Sans open/close : fermé.
  hours: [
    { day: 1, name: 'Lundi', open: '10:00', close: '18:00' },
    { day: 2, name: 'Mardi', open: '09:00', close: '19:00' },
    { day: 3, name: 'Mercredi', open: '09:00', close: '19:00' },
    { day: 4, name: 'Jeudi', open: '09:00', close: '19:00' },
    { day: 5, name: 'Vendredi', open: '09:00', close: '19:00' },
    { day: 6, name: 'Samedi', open: '09:00', close: '16:00' },
    { day: 0, name: 'Dimanche' },
  ],
  hoursNote: 'Les horaires peuvent varier d’une semaine à l’autre : les infos à jour sont publiées sur Instagram et TikTok.',
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
    // Champs à compléter avant la mise en ligne (null = affiché « à compléter »).
    capital: null,
    registration: null,
    host: null,
  },
};
