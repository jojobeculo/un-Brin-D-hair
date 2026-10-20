// Réglages du salon utilisés par les scripts. Les textes visibles sont dans index.html.
export const CONFIG = {
  phoneDisplay: '04 44 44 82 87',
  instagram: 'unbrundhair',
  timeZone: 'Europe/Paris',

  // Adresse qui reçoit les formulaires en JSON (Formspree, Getform, Make, Zapier…).
  // Vide : la demande part par SMS, par e-mail, sinon en message Instagram (voir lib/channel.js).
  formEndpoint: '',
  // Mobile qui reçoit les demandes par SMS. Le numéro du salon est un fixe : laisser vide.
  sms: '',
  // Adresse e-mail du salon, pour les demandes envoyées depuis la messagerie du visiteur.
  email: '',
};
