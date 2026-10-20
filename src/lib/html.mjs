// Gabarit HTML : html`…` échappe les valeurs insérées, sauf celles déjà produites par html`…` ou raw().
const NBSP = String.fromCharCode(160);

class Raw {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

export const raw = (value) => new Raw(String(value));

// Typographie française : espace insécable avant : ; ! ? » € et après «.
export function frenchSpaces(text) {
  return text.replace(/ ([:;!?»€])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`);
}

export function esc(text) {
  return frenchSpaces(String(text))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replaceAll(NBSP, '&nbsp;');
}

function render(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return esc(value);
}

// Le texte écrit dans les gabarits reçoit aussi les espaces insécables.
const typography = (text) => frenchSpaces(text).replaceAll(NBSP, '&nbsp;');

export function html(strings, ...values) {
  let out = typography(strings[0]);
  values.forEach((value, index) => {
    out += render(value) + typography(strings[index + 1]);
  });
  return new Raw(out);
}

// Données structurées : JSON sûr à placer dans une balise <script>.
export function jsonLd(data) {
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}
