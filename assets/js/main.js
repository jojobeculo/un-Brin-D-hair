import { initPerf } from './lib/perf.js';
import { initScroll } from './modules/scroll.js';
import { initMotion } from './modules/motion.js';
import { initMenu } from './modules/menu.js';
import { initStatus } from './modules/status.js';
import { initReveal } from './modules/reveal.js';
import { initAmbient } from './modules/ambient.js';
import { initPlan } from './modules/plan.js';
import { initCartBadge } from './modules/cart-badge.js';
import { initFlash } from './modules/flash.js';
import { initContact } from './modules/contact.js';
import { initCompare } from './modules/compare.js';
import { initRibbonLive } from './modules/ribbon-live.js';
import { initMotionToggle } from './modules/motion-toggle.js';
import { initDecor } from './modules/decor.js';
import { initParticles } from './modules/particles.js';

// Chaque module démarre seul : une erreur dans l’un n’empêche pas les autres de fonctionner.
[initPerf, initScroll, initMotion, initAmbient, initMenu, initStatus, initReveal, initPlan, initCartBadge, initFlash, initContact, initCompare, initRibbonLive, initMotionToggle, initDecor, initParticles].forEach((init) => {
  try {
    init();
  } catch (error) {
    console.error(error);
  }
});

document.documentElement.classList.add('is-ready');

// Effets de souris (curseur, traînée, boutons magnétiques…) : chargés au premier mouvement d’une souris,
// sur ordinateur comme sur tablette avec souris. Un appareil tactile seul ne télécharge pas ce code.
const loadFx = (event) => {
  if (event.pointerType !== 'mouse') return;
  removeEventListener('pointermove', loadFx);
  import('./modules/fx.js').then((module) => module.initFx(event)).catch(console.error);
};
addEventListener('pointermove', loadFx, { passive: true });

// Pages avec un module dédié (questionnaire, boutique) : chargés seulement là où ils servent.
if (document.querySelector('[data-quiz]')) import('./modules/quiz.js').then((module) => module.initQuiz()).catch(console.error);
if (document.querySelector('[data-shop]')) import('./modules/shop.js').then((module) => module.initShop()).catch(console.error);
