import { calm } from '../lib/motion-pref.js';
import { keepScrollOnReload } from './scroll.js';

// Interrupteur « Animations complètes » : garde le choix du visiteur pour tout le site, puis recharge la page.
export function initMotionToggle() {
  document.querySelectorAll('[data-motion-toggle]').forEach((button) => {
    button.setAttribute('aria-checked', String(!calm()));
    button.addEventListener('click', () => {
      try {
        localStorage.setItem('ubdh-animations', calm() ? 'full' : 'calm');
        // Nouveau choix : la fluidité de la machine est mesurée à nouveau.
        localStorage.removeItem('ubdh-perf');
      } catch {
        // Stockage bloqué : le choix vaut pour cette page seulement.
      }
      document.documentElement.dataset.motion = calm() ? 'full' : 'calm';
      keepScrollOnReload();
      location.reload();
    });
  });
}
