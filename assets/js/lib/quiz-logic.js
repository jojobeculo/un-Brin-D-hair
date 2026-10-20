// Logique du questionnaire « Quelle coupe pour moi ? », partagée par le site et les tests.
import { formatDuration, formatPrice } from './format.js';

const LENGTH_ORDER = {
  femme: ['courts', 'milongs', 'longs'],
  enfant: ['courts', 'milongs', 'longs'],
  homme: ['tres-courts', 'courts', 'milongs'],
};

const LENGTH_OPTIONS = {
  femme: [['courts', 'Courts', 'Au niveau de l’oreille'], ['milongs', 'Mi-longs', 'Au-dessus des épaules'], ['longs', 'Longs', 'En-dessous des épaules']],
  enfant: [['courts', 'Courts', 'Au niveau de l’oreille'], ['milongs', 'Mi-longs', 'Au-dessus des épaules'], ['longs', 'Longs', 'En-dessous des épaules']],
  homme: [['tres-courts', 'Très courts', 'Moins de 2 cm'], ['courts', 'Courts', '2 à 6 cm sur le dessus'], ['milongs', 'Mi-longs', 'Au niveau des oreilles, ou plus']],
};

// Questions dans l’ordre. `when` : la question ne s’affiche que si la condition est vraie.
const QUESTIONS = [
  { id: 'pour', title: 'La coupe est pour…', options: () => [['femme', 'Moi, une coupe femme'], ['homme', 'Moi, une coupe homme'], ['enfant', 'Mon enfant', 'Moins de 12 ans']] },
  { id: 'kid', when: (a) => a.pour === 'enfant', title: 'Quelle coupe ?', hint: 'Le salon distingue la coupe garçon et la coupe fille, avec des tarifs différents.', options: () => [['garcon', 'Coupe garçon'], ['fille', 'Coupe fille']] },
  { id: 'longueur', title: 'Aujourd’hui, les cheveux sont…', hint: 'La longueur actuelle fixe le tarif.', options: (a) => LENGTH_OPTIONS[a.pour] },
  { id: 'nature', title: 'Leur nature ?', hint: 'Laissez-les sécher sans les coiffer : comment tombent-ils ?', options: () => [['raides', 'Raides', 'Lisses, sans mouvement'], ['ondules', 'Ondulés', 'En S souple'], ['boucles', 'Bouclés', 'Boucles en ressort'], ['frises', 'Frisés à crépus', 'Petites boucles serrées']] },
  { id: 'epaisseur', when: (a) => a.pour !== 'enfant', title: 'Un cheveu entre deux doigts, vous le sentez…', options: () => [['fins', 'À peine', 'Cheveux fins'], ['moyens', 'Un peu', 'Cheveux moyens'], ['epais', 'Comme un fil', 'Cheveux épais']] },
  { id: 'visage', when: (a) => a.pour !== 'enfant', title: 'La forme du visage ?', hint: 'Cheveux attachés, face au miroir : comparez le front, les pommettes et la mâchoire.', options: () => [['ovale', 'Ovale', 'Plus long que large, traits doux'], ['rond', 'Rond', 'Aussi large que long, joues pleines'], ['carre', 'Carré', 'Mâchoire large et marquée'], ['long', 'Long', 'Nettement plus long que large'], ['coeur', 'En cœur', 'Front large, menton fin'], ['inconnu', 'Je ne sais pas']] },
  { id: 'entretien', title: 'Le matin, pour les cheveux, vous avez…', options: () => [['1', '2 minutes', 'Je les laisse sécher'], ['2', '10 minutes', 'Un coup de séchoir'], ['3', '20 minutes ou plus', 'J’aime les coiffer']] },
  { id: 'envie', title: 'Côté changement, vous voulez…', options: () => [['garder', 'Garder la longueur', 'Juste une belle forme'], ['visible', 'Un changement visible', 'Quelques centimètres en moins'], ['radical', 'Un vrai changement', 'On ose']] },
  { id: 'style', when: (a) => a.pour === 'homme', title: 'Votre style ?', options: () => [['classique', 'Classique', 'Net, intemporel'], ['decontracte', 'Décontracté', 'Naturel, sans effort'], ['tendance', 'Tendance', 'Texturé, actuel']] },
  { id: 'golfes', when: (a) => a.pour === 'homme', title: 'Les cheveux se dégarnissent sur les tempes ou le dessus ?', options: () => [['non', 'Non'], ['oui', 'Oui, un peu ou plus']] },
  { id: 'frange', when: (a) => a.pour === 'femme', title: 'Une frange ?', options: () => [['oui', 'Oui, j’aime'], ['peut-etre', 'Pourquoi pas'], ['non', 'Non, jamais']] },
  { id: 'couleur', when: (a) => a.pour === 'femme', title: 'Et la couleur ?', options: () => [['naturelle', 'Je garde ma couleur'], ['eclat', 'Plus d’éclat', 'Brillance, reflets'], ['blancs', 'Couvrir mes cheveux blancs'], ['lumieres', 'Des lumières naturelles', 'Balayage subtil'], ['intense', 'Un éclaircissement visible', 'Balayage marqué']] },
];

export const activeQuestions = (answers) => QUESTIONS.filter((question) => !question.when || question.when(answers));

const LABELS = {
  raides: 'raides', ondules: 'ondulés', boucles: 'bouclés', frises: 'frisés à crépus',
  ovale: 'ovale', rond: 'rond', carre: 'carré', long: 'long', coeur: 'en cœur',
};

// Changement de longueur : 0 = même longueur, 1 ou 2 = plus court. Une coupe plus longue que les cheveux actuels est impossible.
function lengthChange(answers, cut) {
  const order = LENGTH_ORDER[answers.pour];
  return order.indexOf(answers.longueur) - order.indexOf(cut.length);
}

const CHANGE_SCORE = {
  garder: [1, 0.35, 0],
  visible: [0.45, 1, 0.6],
  radical: [0.1, 0.7, 1],
};

// Score de 0 à 1 et raisons, pour une coupe et des réponses.
function scoreCut(answers, cut) {
  const delta = lengthChange(answers, cut);
  if (delta < 0) return null;
  if (answers.pour === 'enfant' && cut.kid !== answers.kid) return null;
  const parts = [];
  const add = (weight, value, reason) => parts.push({ weight, value, reason });

  add(3, cut.texture[answers.nature], cut.texture[answers.nature] >= 0.8 ? `Pensée pour les cheveux ${LABELS[answers.nature]}` : null);
  if (cut.thickness && answers.epaisseur) {
    const reasons = { fins: 'Donne de la matière aux cheveux fins', moyens: null, epais: 'Allège les cheveux épais' };
    add(2, cut.thickness[answers.epaisseur], cut.thickness[answers.epaisseur] >= 0.9 ? reasons[answers.epaisseur] : null);
  }
  if (cut.face && answers.visage && answers.visage !== 'inconnu') {
    add(3, cut.face[answers.visage], cut.face[answers.visage] >= 0.9 ? `Met en valeur un visage ${LABELS[answers.visage]}` : null);
  }
  const time = Number(answers.entretien);
  const styling = cut.styling <= time ? 1 : cut.styling - time === 1 ? 0.4 : 0;
  const timeReason = { 1: 'Se coiffe en 2 minutes', 2: 'Se coiffe en 10 minutes', 3: 'Se prête aux coiffages travaillés' };
  add(2, styling, styling === 1 && cut.styling <= time ? timeReason[cut.styling] : null);
  const change = CHANGE_SCORE[answers.envie][Math.min(delta, 2)];
  const changeReason = delta === 0 ? 'Garde votre longueur' : delta === 1 ? 'Un changement visible' : 'Un vrai changement de tête';
  add(2, change, change >= 0.9 ? changeReason : null);
  if (answers.pour === 'femme' && answers.frange) {
    const value = answers.frange === 'peut-etre' ? 1 : answers.frange === 'oui' ? (cut.bangs ? 1 : 0.6) : (cut.bangs ? 0.1 : 1);
    add(1.5, value, answers.frange === 'oui' && cut.bangs ? 'Avec la frange que vous aimez' : null);
  }
  if (answers.pour === 'homme') {
    add(2.5, cut.styles[answers.style], cut.styles[answers.style] >= 0.9 ? `Un style ${answers.style === 'decontracte' ? 'décontracté' : answers.style}` : null);
    if (answers.golfes === 'oui') add(2, cut.golfes, cut.golfes >= 0.9 ? 'Flatteuse quand les cheveux se dégarnissent' : null);
  }

  const total = parts.reduce((sum, part) => sum + part.weight, 0);
  const value = parts.reduce((sum, part) => sum + part.weight * part.value, 0) / total;
  const reasons = parts.filter((part) => part.reason).sort((a, b) => b.weight * b.value - a.weight * a.value).map((part) => part.reason);
  return { value, reasons };
}

// Pourcentage affiché : jamais 100 %, la coupe se valide toujours ensemble au salon.
export const compatibility = (value) => Math.max(35, Math.min(98, Math.round(value * 100)));

// Les 3 meilleures coupes, chacune d’une famille différente.
export function recommend(answers, catalog) {
  const list = catalog[answers.pour] || [];
  const scored = list
    .map((cut) => ({ cut, result: scoreCut(answers, cut) }))
    .filter((item) => item.result)
    .sort((a, b) => b.result.value - a.result.value || a.cut.styling - b.cut.styling);
  const picks = [];
  const families = new Set();
  for (const item of scored) {
    if (families.has(item.cut.family)) continue;
    families.add(item.cut.family);
    picks.push({ cut: item.cut, score: compatibility(item.result.value), reasons: item.result.reasons.slice(0, 3) });
    if (picks.length === 3) break;
  }
  return picks;
}

// Prestation du salon correspondant aux réponses : prix et durée lus dans la carte (#salon-data).
export function estimate(answers, services, colors) {
  const ids = [];
  let color = null;
  if (answers.pour === 'homme') ids.push('homme-forfait');
  else if (answers.pour === 'enfant') ids.push(answers.kid === 'garcon' ? 'enfant-garcon' : answers.longueur === 'longs' ? 'enfant-fille-longs' : 'enfant-fille-courts');
  else {
    const len = answers.longueur;
    const balayageLen = len === 'courts' ? 'courts' : 'longs';
    color = colors[answers.couleur] || null;
    if (answers.couleur === 'eclat' || answers.couleur === 'blancs') ids.push(`couleur-scb-${len}`);
    else if (answers.couleur === 'lumieres') ids.push(`balayage-lumieres-${balayageLen}`);
    else if (answers.couleur === 'intense') ids.push(`balayage-eclat-${balayageLen}`);
    else ids.push(`femme-scb-${len}`);
    if (answers.epaisseur === 'epais') ids.push('opt-epais');
  }
  const items = ids.map((id) => services.get(id)).filter(Boolean);
  const price = items.reduce((sum, item) => sum + item.price, 0);
  const duration = items.reduce((sum, item) => sum + item.duration, 0);
  const from = items.some((item) => item.from);
  return {
    items,
    color,
    diagnostic: Boolean(color?.diagnostic),
    price: formatPrice(price, from),
    duration: formatDuration(duration),
    serviceName: items[0]?.name || '',
  };
}

// Deux produits Davines pour entretenir la coupe, selon la nature du cheveu et la couleur.
export function suggestProducts(answers, cut) {
  const ids = [];
  if (answers.couleur === 'lumieres' || answers.couleur === 'intense') ids.push('heart-of-glass-shampoo');
  else if (answers.couleur === 'eclat' || answers.couleur === 'blancs') ids.push('minu-shampoo');
  if (answers.nature === 'boucles' || answers.nature === 'frises') ids.push('love-curl-shampoo', 'love-curl-cream');
  else if (answers.epaisseur === 'fins') ids.push('volu-shampoo', 'volu-hair-mist');
  else if (answers.epaisseur === 'epais' || answers.nature === 'ondules') ids.push('love-smoothing-shampoo', 'oi-oil');
  else ids.push('oi-shampoo', 'oi-all-in-one-milk');
  if (cut.art?.men && cut.styling >= 2) ids.splice(1, 0, 'pliable-paste');
  return [...new Set(ids)].slice(0, 2);
}
