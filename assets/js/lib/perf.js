// Niveau de qualité des effets, adapté à la machine : 'high' (tout), 'lite' (allégé), 'min' (essentiel).
// - Au départ : le niveau mesuré lors d’une visite précédente, sinon un indice tiré de la carte graphique.
// - Ensuite : la fluidité réelle est mesurée pendant les animations ; si elle chute, le niveau baisse.
// Le niveau est posé sur <html data-perf> (dans <head>) et gardé pour les visites suivantes.
const LEVELS = ['high', 'lite', 'min'];
const root = document.documentElement;

export const perfLevel = () => root.dataset.perf || 'high';
export const atLeast = (level) => LEVELS.indexOf(perfLevel()) <= LEVELS.indexOf(level);

function lower(level, remember) {
  if (LEVELS.indexOf(level) <= LEVELS.indexOf(perfLevel())) return;
  root.dataset.perf = level;
  if (remember) {
    try {
      localStorage.setItem('ubdh-perf', level);
    } catch {
      // Stockage bloqué : le niveau vaut pour cette page.
    }
  }
  dispatchEvent(new CustomEvent('perf:change', { detail: level }));
}

// Indice de départ, une seule fois et après le chargement : rendu logiciel → essentiel, puce intégrée → allégé.
function guessFromGpu() {
  try {
    if (localStorage.getItem('ubdh-perf')) return;
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
    else if (/intel|radeon\(tm\) graphics|radeon vega|mali|adreno|powervr/i.test(renderer) || (navigator.hardwareConcurrency || 8) <= 4) lower('lite', false);
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

function probe(now) {
  if (document.hidden || now > activeUntil) {
    probing = false;
    last = 0;
    return;
  }
  if (last && now - last < 250) frames.push(now - last);
  last = now;
  if (frames.length >= 60) {
    const median = frames.sort((a, b) => a - b)[30];
    frames = [];
    // Moins de 45 images par seconde : on allège ; moins de 28 : on garde l’essentiel.
    if (median > 22 && perfLevel() === 'high') lower('lite', true);
    else if (median > 36 && perfLevel() === 'lite') lower('min', true);
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
