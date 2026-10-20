import { initMotion } from './modules/motion.js';
import { initMenu } from './modules/menu.js';
import { initStatus } from './modules/status.js';
import { initReveal } from './modules/reveal.js';
import { initAmbient } from './modules/ambient.js';
import { initPlan } from './modules/plan.js';
import { initCartBadge } from './modules/cart-badge.js';
import { initFlash } from './modules/flash.js';
import { initContact } from './modules/contact.js';

// Chaque module démarre seul : une erreur dans l’un n’empêche pas les autres de fonctionner.
[initMotion, initAmbient, initMenu, initStatus, initReveal, initPlan, initCartBadge, initFlash, initContact].forEach((init) => {
  try {
    init();
  } catch (error) {
    console.error(error);
  }
});

document.documentElement.classList.add('is-ready');

// Effets riches seulement sur ordinateur (souris, écran large) et si les animations sont autorisées :
// les téléphones ne téléchargent pas ce code.
if (matchMedia('(pointer: fine) and (hover: hover) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) {
  import('./modules/fx.js').then((module) => module.initFx()).catch(console.error);
}

// Pages avec un module dédié (questionnaire, boutique) : chargés seulement là où ils servent.
if (document.querySelector('[data-quiz]')) import('./modules/quiz.js').then((module) => module.initQuiz()).catch(console.error);
if (document.querySelector('[data-shop]')) import('./modules/shop.js').then((module) => module.initShop()).catch(console.error);
