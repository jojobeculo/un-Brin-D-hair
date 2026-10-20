import { html, raw } from '../lib/html.mjs';

const stroke = (paths, width = 2) => `<g fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;

const SYMBOLS = {
  bolt: ['0 0 24 24', '<path fill="currentColor" d="M14.2 1.5 4.5 13.6h6.1l-1.3 8.9 9.7-12.1h-6.1z"/>'],
  'arrow-right': ['0 0 24 24', stroke('<path d="M4 12h15M13 6l6 6-6 6"/>')],
  'arrow-left': ['0 0 24 24', stroke('<path d="M20 12H5M11 6l-6 6 6 6"/>')],
  'arrow-down': ['0 0 24 24', stroke('<path d="M12 4v15M6 13l6 6 6-6"/>')],
  'arrow-up-right': ['0 0 24 24', stroke('<path d="M7 17 17 7M8 7h9v9"/>')],
  chevron: ['0 0 24 24', stroke('<path d="m6 9 6 6 6-6"/>', 2.25)],
  plus: ['0 0 24 24', stroke('<path d="M12 5v14M5 12h14"/>', 2.25)],
  close: ['0 0 24 24', stroke('<path d="m6 6 12 12M18 6 6 18"/>', 2.25)],
  check: ['0 0 24 24', stroke('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 2.25)],
  star: ['0 0 24 24', '<path fill="currentColor" d="m12 2.6 2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5-4.8-4.5 6.5-.8z"/>'],
  phone: ['0 0 24 24', stroke('<path d="M5.2 3h3.4l1.7 4.4-2.2 1.5a11.5 11.5 0 0 0 5 5l1.5-2.2 4.4 1.7v3.4a2.3 2.3 0 0 1-2.5 2.3C9.8 18.5 5.5 14.2 3 6.2A2.3 2.3 0 0 1 5.2 3z"/>')],
  mail: ['0 0 24 24', stroke('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>')],
  whatsapp: ['0 0 24 24', '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/>'],
  instagram: ['0 0 24 24', `${stroke('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>')}<circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/>`],
  tiktok: ['0 0 24 24', '<path fill="currentColor" d="M16.6 2h-3.3v13.1a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V8.9a6.3 6.3 0 1 0 5.3 6.2V8.4a7.9 7.9 0 0 0 4.4 1.4V6.5a4.4 4.4 0 0 1-4.4-4.5z"/>'],
  pin: ['0 0 24 24', stroke('<path d="M12 21.5s-7-6.3-7-11.8a7 7 0 0 1 14 0c0 5.5-7 11.8-7 11.8z"/><circle cx="12" cy="9.7" r="2.6"/>')],
  navigation: ['0 0 24 24', stroke('<path d="m3 11 18-8-8 18-2-8z"/>')],
  gift: ['0 0 24 24', stroke('<path d="M3.5 8h17v4h-17zM5 12v9h14v-9M12 8v13"/><path d="M12 8C10.5 4 6.5 2.8 6.5 5.5 6.5 7 8.5 8 12 8zm0 0c1.5-4 5.5-5.2 5.5-2.5C17.5 7 15.5 8 12 8z"/>')],
  drag: ['0 0 24 24', stroke('<path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5"/>', 2.25)],
  warning: ['0 0 24 24', stroke('<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.3"/>')],
  'len-courts': ['0 0 32 32', stroke('<circle cx="16" cy="13" r="5.2"/><path d="M9.6 14.5C8.8 7.5 12.3 4 16 4s7.2 3.5 6.4 10.5"/><path d="M4.5 31c1.4-4.6 5.6-7 11.5-7s10.1 2.4 11.5 7"/>', 1.75)],
  'len-milongs': ['0 0 32 32', stroke('<circle cx="16" cy="13" r="5.2"/><path d="M10 21.5c-1.8-4-2-8.4-.4-11.8C11 5.6 13.4 4 16 4s5 1.6 6.4 5.7c1.6 3.4 1.4 7.8-.4 11.8"/><path d="M4.5 31c1.4-4.6 5.6-7 11.5-7s10.1 2.4 11.5 7"/>', 1.75)],
  'len-longs': ['0 0 32 32', stroke('<circle cx="16" cy="13" r="5.2"/><path d="M8.6 29.5c-1.3-6.5-1.8-13.5.8-19.6C10.9 5.6 13.4 4 16 4s5.1 1.6 6.6 5.9c2.6 6.1 2.1 13.1.8 19.6"/><path d="M4.5 31c1.4-4.6 5.6-7 11.5-7s10.1 2.4 11.5 7"/>', 1.75)],
};

export function icon(name, className = '') {
  if (!SYMBOLS[name]) throw new Error(`Icône inconnue : ${name}`);
  return html`<svg class="${`icon ${className}`.trim()}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

export function sprite() {
  const symbols = Object.entries(SYMBOLS).map(([name, [viewBox, body]]) => `<symbol id="i-${name}" viewBox="${viewBox}">${body}</symbol>`).join('\n    ');
  return raw(`<svg class="sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n    ${symbols}\n  </svg>`);
}
