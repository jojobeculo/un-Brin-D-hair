import { initMenu } from './modules/menu.js';
import { initStatus } from './modules/status.js';
import { initBooking } from './modules/booking.js';
import { initFlash } from './modules/flash.js';
import { initContact } from './modules/contact.js';
import { initCompare } from './modules/compare.js';
import { initGift } from './modules/gift.js';
import { initMap } from './modules/map.js';
import { initFab } from './modules/fab.js';
import { initMagnetic } from './modules/magnetic.js';
import { initReveal } from './modules/reveal.js';
import { initCursor } from './modules/cursor.js';
import { initMotion } from './modules/motion.js';

// Chaque module démarre seul : une erreur dans l’un n’empêche pas les autres de fonctionner.
[initMotion, initMenu, initStatus, initBooking, initFlash, initContact, initCompare, initGift, initMap, initFab, initMagnetic, initReveal, initCursor].forEach((init) => {
  try {
    init();
  } catch (error) {
    console.error(error);
  }
});

document.documentElement.classList.add('is-ready');
