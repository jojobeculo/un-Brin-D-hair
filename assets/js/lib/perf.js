// Niveau de qualité des effets, adapté à la machine : 'high' (tout), 'lite' (allégé), 'min' (essentiel).
// - Au départ : le niveau mesuré lors d’une visite précédente, sinon un indice tiré de la carte graphique.
// - Ensuite : la fluidité réelle est mesurée pendant les animations ; si elle chute, le niveau baisse.
// Le niveau est posé sur <html data-perf> (dans <head>). Une baisse mesurée est gardée 7 jours, puis la machine
// est mesurée à nouveau : un ralentissement passager ne prive pas un bon ordinateur des effets pour toujours.
const LEVELS = ['high', 'lite', 'min'];
const KEEP = 7 * 24 * 3600 * 1000;
const root = document.documentElement;

export const perfLevel = () => root.dataset.perf || 'high';
export const atLeast = (level) => LEVELS.indexOf(perfLevel()) <= LEVELS.indexOf(level);

function lower(level, remember) {
  if (LEVELS.indexOf(level) <= LEVELS.indexOf(perfLevel())) return;
  root.dataset.perf = level;
  if (remember) {
    try {
      localStorage.setItem('ubdh-perf', `${level}|${Date.now() + KEEP}`);
    } catch {
      // Stockage bloqué : le niveau vaut pour cette page.
    }
  }
  dispatchEvent(new CustomEvent('perf:change', { detail: level }));
}

// Indice de départ, une seule fois et après le chargement : rendu logiciel → essentiel ; ancienne puce Intel
// (HD, UHD) ou puce de téléphone → allégé. Les puces intégrées récentes (Iris Xe, Arc, Radeon, Apple) gardent tout :
// la mesure décide.
function guessFromGpu() {
  try {
    const [, until] = (localStorage.getItem('ubdh-perf') || '').split('|');
    if (Number(until) > Date.now()) return;
  } catch {
    // Pas de stockage : on devine à chaque visite.
  }
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) {
      lower('min', false);
      return;
    }
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) lower('min', false);
    else if (/intel.*\bu?hd graphics|mali|adreno|powervr/i.test(renderer) || (navigator.hardwareConcurrency || 8) <= 4) lower('lite', false);
  } catch {
    // Aucune information : on garde le niveau et on laisse la mesure décider.
  }
}

// Mesure de la fluidité : les animations signalent qu’elles tournent (sampleFrame), et une sonde unique mesure
// le vrai intervalle entre deux images tant qu’il y a de l’activité.
let frames = [];
let activeUntil = 0;
let probing = false;
let last = 0;
let slow = 0;

function probe(now) {
  if (document.hidden || now > activeUntil) {
    probing = false;
    last = 0;
    return;
  }
  // Les premières secondes (chargement des images et des polices) ne comptent pas.
  if (last && now - last < 250 && now > 2500) frames.push(now - last);
  last = now;
  if (frames.length >= 60) {
    const median = frames.sort((a, b) => a - b)[30];
    frames = [];
    // Moins de 45 images par seconde : on allège ; moins de 28 : on garde l’essentiel.
    // Il faut deux mesures lentes de suite : un pic passager (autre programme, onglet chargé) ne suffit pas.
    const target = perfLevel() === 'high' && median > 22 ? 'lite' : perfLevel() === 'lite' && median > 36 ? 'min' : '';
    slow = target ? slow + 1 : 0;
    if (slow >= 2) {
      slow = 0;
      lower(target, true);
    }
  }
  requestAnimationFrame(probe);
}

export function sampleFrame(now) {
  activeUntil = now + 300;
  if (!probing) {
    probing = true;
    requestAnimationFrame(probe);
  }
}

// L’indice est calculé dès la première interaction (jamais pendant le chargement, pour ne pas le retarder),
// avant que les effets ne tournent vraiment.
export function initPerf() {
  const events = ['pointermove', 'scroll', 'touchstart', 'keydown'];
  const run = () => {
    events.forEach((type) => removeEventListener(type, run));
    guessFromGpu();
  };
  events.forEach((type) => addEventListener(type, run, { passive: true }));
}
