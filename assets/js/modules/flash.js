import { sendRequest } from '../lib/channel.js';
import { validateForm, resetErrors } from '../lib/forms.js';
import { toast } from '../lib/toast.js';
import { CONFIG } from '../config.js';

const DONE_MESSAGES = {
  endpoint: 'Votre inscription est enregistrée : dès qu’un créneau se libère, on vous prévient en priorité.',
  sms: 'Votre application SMS s’est ouverte avec l’inscription pré-remplie : il ne reste qu’à l’envoyer.',
  email: 'Votre messagerie s’est ouverte avec l’inscription pré-remplie : il ne reste qu’à l’envoyer.',
  instagram: 'Votre inscription est copiée : collez-la dans la conversation Instagram qui vient de s’ouvrir, puis envoyez-la.',
};

const CONTACT_FIELD = {
  sms: { type: 'tel', inputMode: 'tel', autocomplete: 'tel', placeholder: '06 12 34 56 78', label: 'Votre numéro de mobile' },
  email: { type: 'email', inputMode: 'email', autocomplete: 'email', placeholder: 'prenom@exemple.fr', label: 'Votre adresse e-mail' },
};

// Alerte « dernière minute » : inscription pour être prévenu d’un créneau libéré.
export function initFlash() {
  const form = document.querySelector('[data-flash-form]');
  if (!form) return;
  const contact = form.elements.contact;
  const label = form.querySelector('[data-contact-label]');
  const done = document.querySelector('[data-flash-done]');

  form.querySelectorAll('input[name="canal"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const field = CONTACT_FIELD[radio.value];
      Object.assign(contact, { type: field.type, inputMode: field.inputMode, autocomplete: field.autocomplete, placeholder: field.placeholder });
      label.textContent = field.label;
      resetErrors(form);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const data = new FormData(form);
    const canal = data.get('canal') === 'email' ? 'e-mail' : 'SMS';
    const jours = data.getAll('jours').join(', ') || 'Tous les jours d’ouverture';
    const fields = {
      prenom: data.get('prenom') || '—',
      contact: data.get('contact'),
      canal,
      prestation: data.get('prestation'),
      jours,
      moment: data.get('moment'),
    };
    const text = [
      'Inscription à l’alerte dernière minute — Un Brun d’Hair',
      `Prénom : ${fields.prenom}`,
      `Me prévenir par ${canal} : ${fields.contact}`,
      `Prestation : ${fields.prestation}`,
      `Jours possibles : ${jours}`,
      `Moment : ${fields.moment}`,
    ].join('\n');

    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const channel = await sendRequest({ subject: 'Alerte dernière minute', text, data: { type: 'alerte-derniere-minute', ...fields } });
      done.querySelector('[data-flash-done-message]').textContent = DONE_MESSAGES[channel];
      form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch {
      toast(`L’inscription n’a pas abouti. Appelez le salon au ${CONFIG.phoneDisplay}.`);
    } finally {
      submit.disabled = false;
    }
  });
}
