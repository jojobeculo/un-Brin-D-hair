// Position de la page à l’arrivée et ancres :
// - nouvelle page ou actualisation : en haut (ou sur l’ancre demandée, sans long défilement animé) ;
// - retour arrière : la position quittée est rendue ;
// - lien vers une section de la page en cours : défilement doux (immédiat en animations douces).
import { calm } from '../lib/motion-pref.js';

const key = () => `ubdh-scroll:${location.pathname}`;
const store = {
  get: (name) => { try { return sessionStorage.getItem(name); } catch { return null; } },
  set: (name, value) => { try { sessionStorage.setItem(name, value); } catch { /* stockage bloqué */ } },
  remove: (name) => { try { sessionStorage.removeItem(name); } catch { /* stockage bloqué */ } },
};

// À appeler avant un rechargement voulu (interrupteur d’animations) : la page revient au même endroit.
export function keepScrollOnReload() {
  store.set('ubdh-keep', String(scrollY));
}

export function initScroll() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const navigation = performance.getEntriesByType?.('navigation')[0]?.type;
  const kept = store.get('ubdh-keep');
  store.remove('ubdh-keep');
  if (kept !== null) scrollTo(0, Number(kept));
  else if (navigation === 'back_forward' && store.get(key()) !== null) scrollTo(0, Number(store.get(key())));
  else if (!location.hash) scrollTo(0, 0);
  addEventListener('pagehide', () => store.set(key(), String(scrollY)));

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    try {
      history.pushState(null, '', url.hash);
    } catch {
      // Cadre isolé (aperçu) : l’adresse ne change pas, le défilement se fait quand même.
    }
    target.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' });
    // Le focus suit, pour le clavier et les lecteurs d’écran.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}
