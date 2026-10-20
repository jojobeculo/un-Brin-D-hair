import { readSalonData } from './data.js';

export function copyText(text) {
  return navigator.clipboard?.writeText(text).catch(() => {});
}

// Envoie une demande au salon par le premier canal configuré.
// Renvoie le canal utilisé : 'endpoint', 'sms', 'email' ou 'instagram'.
export async function sendRequest({ subject, text, data }) {
  // Champ piège (_gotcha) rempli : c’est un robot. Rien ne part, l’envoi semble réussi.
  if (data._gotcha) return 'endpoint';
  const { settings } = readSalonData();
  if (settings.formEndpoint) {
    const response = await fetch(settings.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, message: text, ...data }),
    });
    if (!response.ok) throw new Error(`Envoi refusé (${response.status})`);
    return 'endpoint';
  }

  const body = encodeURIComponent(text);
  if (settings.sms && matchMedia('(pointer: coarse)').matches) {
    window.location.href = `sms:${settings.sms}?&body=${body}`;
    return 'sms';
  }
  if (settings.email) {
    window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    return 'email';
  }

  // Aucun canal configuré : le texte est copié et la conversation Instagram du salon s’ouvre.
  // Pas d’attente avant window.open, sinon le navigateur bloque la fenêtre.
  copyText(text);
  window.open(`https://ig.me/m/${settings.instagram}`, '_blank', 'noopener');
  return 'instagram';
}
