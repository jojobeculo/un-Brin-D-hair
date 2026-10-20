// Numéro français (06 12 34 56 78, +33 6 12 34 56 78) ou international (+41…).
const PHONE = /^(?:(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}|\+(?:[\s.-]?\d){8,15})$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errorFor(field) {
  if (field.type === 'checkbox') return field.checked ? '' : 'Merci de cocher cette case pour continuer.';
  const value = field.value.trim();
  if (!value) return 'Ce champ est obligatoire.';
  if (field.type === 'tel' && !PHONE.test(value)) return 'Numéro invalide : 10 chiffres, par exemple 06 12 34 56 78.';
  if (field.type === 'email' && !EMAIL.test(value)) return 'Adresse e-mail invalide, par exemple prenom@exemple.fr.';
  if (field.dataset.validate === 'phone-or-email' && !PHONE.test(value) && !EMAIL.test(value)) {
    return 'Indiquez un numéro de téléphone ou une adresse e-mail, par exemple 06 12 34 56 78.';
  }
  return '';
}

export function resetErrors(form) {
  form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
  form.querySelectorAll('[data-error-for]').forEach((error) => {
    error.hidden = true;
  });
}

// Vérifie les champs requis, affiche les messages et place le focus sur le premier champ en erreur.
export function validateForm(form) {
  let firstInvalid = null;
  form.querySelectorAll('[required]').forEach((field) => {
    const message = errorFor(field);
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    if (message && !firstInvalid) firstInvalid = field;
  });
  firstInvalid?.focus();
  return !firstInvalid;
}
