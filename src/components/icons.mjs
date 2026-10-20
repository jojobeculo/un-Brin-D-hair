import { html, raw } from '../lib/html.mjs';

const stroke = (paths, width = 2) => `<g fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;

// Formes décoratives du fond (decor.js) : sans épaisseur de trait, réglée en CSS (elle grossit à l’approche de la souris).
const deco = (paths) => `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
const DECO = {
  'deco-arch': ['0 0 48 56', deco('<path d="M6 54V24a18 18 0 0 1 36 0v30"/><path d="M13 54V25a11 11 0 0 1 22 0v29"/>')],
  'deco-wave': ['0 0 64 24', deco('<path d="M2 12c7-9 13-9 20 0s13 9 20 0 13-9 20 0"/>')],
  'deco-curl': ['0 0 48 48', deco('<path d="M25 24a2 2 0 1 1-3-2 5 5 0 1 1 7 5 9 9 0 1 1-11-12 13 13 0 1 1-6 21"/>')],
  'deco-ring': ['0 0 48 48', deco('<circle cx="24" cy="24" r="20"/><circle cx="24" cy="24" r="13" stroke-dasharray="2 5"/>')],
  'deco-dots': ['0 0 48 16', '<g fill="currentColor"><circle cx="6" cy="8" r="2.4"/><circle cx="24" cy="8" r="2.4"/><circle cx="42" cy="8" r="2.4"/></g>'],
  'deco-sparkle': ['0 0 48 48', deco('<path d="M24 4c1.6 9 4.6 12.4 14 14-9.4 1.6-12.4 5-14 14-1.6-9-4.6-12.4-14-14 9.4-1.6 12.4-5 14-14z"/>')],
  'deco-leaf': ['0 0 48 48', deco('<path d="M8 40C8 20 20 8 42 6c0 22-12 34-34 34z"/><path d="M8 40c8-10 16-17 26-22"/>')],
  'deco-scissors': ['0 0 48 48', deco('<circle cx="11" cy="12" r="6"/><circle cx="11" cy="36" r="6"/><path d="M16 15l26 21M16 33l26-21"/>')],
  'deco-comb': ['0 0 64 24', deco('<path d="M4 6h56v5H4z"/><path d="M8 11v9M14 11v9M20 11v9M26 11v9M32 11v9M38 11v9M44 11v9M50 11v9M56 11v9"/>')],
  'deco-drop': ['0 0 48 48', deco('<path d="M24 6s14 15 14 25a14 14 0 0 1-28 0C10 21 24 6 24 6z"/><path d="M18 32a6 6 0 0 0 6 6"/>')],
};

const SYMBOLS = {
  'arrow-right': ['0 0 24 24', stroke('<path d="M4 12h15M13 6l6 6-6 6"/>', 1.6)],
  'arrow-left': ['0 0 24 24', stroke('<path d="M20 12H5M11 6l-6 6 6 6"/>', 1.6)],
  'arrow-up-right': ['0 0 24 24', stroke('<path d="M7 17 17 7M8 7h9v9"/>', 1.6)],
  chevron: ['0 0 24 24', stroke('<path d="m6 9 6 6 6-6"/>', 1.8)],
  plus: ['0 0 24 24', stroke('<path d="M12 5v14M5 12h14"/>', 1.6)],
  minus: ['0 0 24 24', stroke('<path d="M5 12h14"/>', 1.6)],
  close: ['0 0 24 24', stroke('<path d="m6 6 12 12M18 6 6 18"/>', 1.6)],
  check: ['0 0 24 24', stroke('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 1.8)],
  star: ['0 0 24 24', '<path fill="currentColor" d="m12 2.6 2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5-4.8-4.5 6.5-.8z"/>'],
  phone: ['0 0 24 24', stroke('<path d="M5.2 3h3.4l1.7 4.4-2.2 1.5a11.5 11.5 0 0 0 5 5l1.5-2.2 4.4 1.7v3.4a2.3 2.3 0 0 1-2.5 2.3C9.8 18.5 5.5 14.2 3 6.2A2.3 2.3 0 0 1 5.2 3z"/>', 1.5)],
  mail: ['0 0 24 24', stroke('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>', 1.5)],
  whatsapp: ['0 0 24 24', '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/>'],
  instagram: ['0 0 24 24', `${stroke('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>', 1.5)}<circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/>`],
  tiktok: ['0 0 24 24', '<path fill="currentColor" d="M16.6 2h-3.3v13.1a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V8.9a6.3 6.3 0 1 0 5.3 6.2V8.4a7.9 7.9 0 0 0 4.4 1.4V6.5a4.4 4.4 0 0 1-4.4-4.5z"/>'],
  pin: ['0 0 24 24', stroke('<path d="M12 21.5s-7-6.3-7-11.8a7 7 0 0 1 14 0c0 5.5-7 11.8-7 11.8z"/><circle cx="12" cy="9.7" r="2.6"/>', 1.5)],
  navigation: ['0 0 24 24', stroke('<path d="m3 11 18-8-8 18-2-8z"/>', 1.5)],
  gift: ['0 0 24 24', stroke('<path d="M3.5 8h17v4h-17zM5 12v9h14v-9M12 8v13"/><path d="M12 8C10.5 4 6.5 2.8 6.5 5.5 6.5 7 8.5 8 12 8zm0 0c1.5-4 5.5-5.2 5.5-2.5C17.5 7 15.5 8 12 8z"/>', 1.5)],
  warning: ['0 0 24 24', stroke('<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.3"/>', 1.5)],
  bag: ['0 0 24 24', stroke('<path d="M5 8h14l-1 13H6z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>', 1.5)],
  bus: ['0 0 24 24', stroke('<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M8 18v2.5M16 18v2.5"/><circle cx="8.5" cy="14.5" r=".6"/><circle cx="15.5" cy="14.5" r=".6"/>', 1.5)],
  parking: ['0 0 24 24', stroke('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M10 17V7.5h3a3 3 0 0 1 0 6h-3"/>', 1.5)],
  bike: ['0 0 24 24', stroke('<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16 9.5 8.5h6L18 16M9.5 8.5 12 16l3.5-7.5M8 6h3"/>', 1.5)],
  clock: ['0 0 24 24', stroke('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 1.5)],
  scissors: ['0 0 24 24', stroke('<circle cx="6" cy="6.5" r="2.5"/><circle cx="6" cy="17.5" r="2.5"/><path d="M8.2 7.8 20 17M8.2 16.2 20 7"/>', 1.5)],
  leaf: ['0 0 24 24', stroke('<path d="M5 19C5 10 10 4.5 20 4c0 10-5.5 15-15 15z"/><path d="M5 19c3-4 6-7 10-9"/>', 1.5)],
  sparkle: ['0 0 24 24', stroke('<path d="M12 3c.8 4.6 2.4 6.2 7 7-4.6.8-6.2 2.4-7 7-.8-4.6-2.4-6.2-7-7 4.6-.8 6.2-2.4 7-7z"/><path d="M19 15.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5z"/>', 1.4)],
  drop: ['0 0 24 24', stroke('<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/><path d="M9 15a3 3 0 0 0 3 3"/>', 1.5)],
  heart: ['0 0 24 24', stroke('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>', 1.5)],
  ear: ['0 0 24 24', stroke('<path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5.5 1.6"/><path d="M10 9.5a2 2 0 0 1 4 0c0 1.2-1.2 1.5-1.2 2.5"/>', 1.5)],
  calendar: ['0 0 24 24', stroke('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', 1.5)],
  card: ['0 0 24 24', stroke('<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>', 1.5)],
  store: ['0 0 24 24', stroke('<path d="M4 9.5V20h16V9.5M3 9.5 5 4h14l2 5.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M10 20v-5h4v5"/>', 1.5)],
  'len-courts': ['0 0 32 32', stroke('<circle cx="16" cy="13" r="5.2"/><path d="M9.6 14.5C8.8 7.5 12.3 4 16 4s7.2 3.5 6.4 10.5"/><path d="M4.5 31c1.4-4.6 5.6-7 11.5-7s10.1 2.4 11.5 7"/>', 1.75)],
  'len-milongs': ['0 0 32 32', stroke('<circle cx="16" cy="13" r="5.2"/><path d="M10 21.5c-1.8-4-2-8.4-.4-11.8C11 5.6 13.4 4 16 4s5 1.6 6.4 5.7c1.6 3.4 1.4 7.8-.4 11.8"/><path d="M4.5 31c1.4-4.6 5.6-7 11.5-7s10.1 2.4 11.5 7"/>', 1.75)],
  'len-longs': ['0 0 32 32', stroke('<circle cx="16" cy="13" r="5.2"/><path d="M8.6 29.5c-1.3-6.5-1.8-13.5.8-19.6C10.9 5.6 13.4 4 16 4s5.1 1.6 6.6 5.9c2.6 6.1 2.1 13.1.8 19.6"/><path d="M4.5 31c1.4-4.6 5.6-7 11.5-7s10.1 2.4 11.5 7"/>', 1.75)],
};

export function icon(name, className = '') {
  if (!SYMBOLS[name]) throw new Error(`Icône inconnue : ${name}`);
  return html`<svg class="${`icon ${className}`.trim()}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

export function sprite() {
  const symbols = Object.entries({ ...SYMBOLS, ...DECO }).map(([name, [viewBox, body]]) => `<symbol id="i-${name}" viewBox="${viewBox}">${body}</symbol>`).join('\n    ');
  return raw(`<svg class="sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n    ${symbols}\n  </svg>`);
}
