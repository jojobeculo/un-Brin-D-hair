import { readSalonData } from '../lib/data.js';
import { sendRequest } from '../lib/channel.js';
import { validateForm } from '../lib/forms.js';
import { toast } from '../lib/toast.js';

const DONE_MESSAGES = {
  endpoint: 'Votre message est bien parti : Sandy vous répond dès que possible.',
  sms: 'Votre application SMS s’est ouverte avec le message pré-rempli : il ne reste qu’à l’envoyer.',
  email: 'Votre messagerie s’est ouverte avec le message pré-rempli : il ne reste qu’à l’envoyer.',
  instagram: 'Votre message est copié : collez-le dans la conversation Instagram qui vient de s’ouvrir, puis envoyez-le.',
};

// Formulaire « Écrire au salon » de la page Contact.
export function initContact() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const done = document.querySelector('[data-contact-done]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const fields = Object.fromEntries(new FormData(form));
    const text = [
      'Message depuis le site — Un Brun d’Hair',
      `Prénom : ${fields.prenom}`,
      `Me répondre : ${fields.contact}`,
      `Sujet : ${fields.sujet}`,
      `Message : ${fields.message}`,
    ].join('\n');

    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const channel = await sendRequest({ subject: `Message du site — ${fields.sujet}`, text, data: { type: 'message-contact', ...fields } });
      done.querySelector('[data-contact-done-message]').textContent = DONE_MESSAGES[channel];
      form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch {
      toast(`L’envoi n’a pas abouti. Appelez le salon au ${readSalonData().settings.phone}.`);
    } finally {
      submit.disabled = false;
    }
  });
}
