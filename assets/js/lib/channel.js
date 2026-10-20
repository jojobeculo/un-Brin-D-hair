import { CONFIG } from '../config.js';

export function copyText(text) {
  return navigator.clipboard?.writeText(text).catch(() => {});
}

// Envoie une demande au salon par le premier canal configuré.
// Renvoie le canal utilisé : 'endpoint', 'sms', 'email' ou 'instagram'.
export async function sendRequest({ subject, text, data }) {
  if (CONFIG.formEndpoint) {
    const response = await fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, message: text, ...data }),
    });
    if (!response.ok) throw new Error(`Envoi refusé (${response.status})`);
    return 'endpoint';
  }

  const body = encodeURIComponent(text);
  if (CONFIG.sms && matchMedia('(pointer: coarse)').matches) {
    window.location.href = `sms:${CONFIG.sms}?&body=${body}`;
    return 'sms';
  }
  if (CONFIG.email) {
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    return 'email';
  }

  // Aucun canal configuré : le texte est copié et la conversation Instagram du salon s’ouvre.
  // Pas d’attente avant window.open, sinon le navigateur bloque la fenêtre.
  copyText(text);
  window.open(`https://ig.me/m/${CONFIG.instagram}`, '_blank', 'noopener');
  return 'instagram';
}
