// Boutique click and collect : produits Davines utilisés au salon.
// Prix publics conseillés de Davines France (fr.davines.com), relevés le 20 octobre 2026.
// À ajuster aux produits réellement en stock et aux prix pratiqués par le salon.
// `needs` relie un produit aux besoins des filtres et au questionnaire « Quelle coupe pour moi ? ».
// `shape` choisit l’illustration : flacon, tube, pot, spray ou pipette.

export const needs = [
  { id: 'hydratation', label: 'Hydratation' },
  { id: 'reparation', label: 'Cheveux abîmés' },
  { id: 'couleur', label: 'Cheveux colorés' },
  { id: 'blonds', label: 'Blonds et balayages' },
  { id: 'boucles', label: 'Boucles' },
  { id: 'lissage', label: 'Anti-frisottis' },
  { id: 'volume', label: 'Volume, cheveux fins' },
  { id: 'cuir-chevelu', label: 'Cuir chevelu' },
  { id: 'coiffage', label: 'Coiffage' },
];

// Couleur d’étiquette de chaque gamme, dans les tons du site.
export const lines = {
  OI: { tint: '#C99A7A', text: 'Tous types de cheveux, douceur et brillance' },
  NOUNOU: { tint: '#D8B98A', text: 'Cheveux très secs, abîmés ou fragilisés' },
  MOMO: { tint: '#E2CFA4', text: 'Cheveux secs ou déshydratés' },
  MINU: { tint: '#9C5B4B', text: 'Cheveux colorés' },
  'LOVE CURL': { tint: '#C78C86', text: 'Cheveux bouclés et ondulés' },
  'LOVE SMOOTHING': { tint: '#D4A6A0', text: 'Cheveux rebelles ou frisottants' },
  VOLU: { tint: '#E3C4BE', text: 'Cheveux fins, sans volume' },
  MELU: { tint: '#B9B48C', text: 'Cheveux longs ou cassants' },
  'HEART OF GLASS': { tint: '#D9C7B0', text: 'Cheveux blonds et éclaircis' },
  ALCHEMIC: { tint: '#8E6A55', text: 'Raviver les reflets de la couleur' },
  NATURALTECH: { tint: '#A9A18B', text: 'Soins du cuir chevelu' },
  'THIS IS A': { tint: '#7E6B5C', text: 'Coiffage' },
};

export const products = [
  { id: 'oi-shampoo', line: 'OI', name: 'OI Shampoo', size: '280 ml', price: 28.4, shape: 'flacon', needs: ['hydratation'], text: 'Shampoing doux qui laisse les cheveux souples, brillants et faciles à coiffer.' },
  { id: 'oi-conditioner', line: 'OI', name: 'OI Conditioner', size: '250 ml', price: 32.4, shape: 'tube', needs: ['hydratation'], text: 'Après-shampoing qui démêle et nourrit sans alourdir.' },
  { id: 'oi-all-in-one-milk', line: 'OI', name: 'OI All In One Milk', size: '135 ml', price: 34.7, shape: 'spray', needs: ['hydratation', 'coiffage'], text: 'Lait sans rinçage : démêle, protège de la chaleur et donne de la brillance.' },
  { id: 'oi-oil', line: 'OI', name: 'OI Oil', size: '50 ml', price: 32.8, shape: 'pipette', needs: ['hydratation', 'lissage'], text: 'Huile légère pour les pointes et la brillance, sur cheveux secs ou humides.' },
  { id: 'oi-hair-butter', line: 'OI', name: 'OI Hair Butter', size: '250 ml', price: 41.8, shape: 'pot', needs: ['hydratation', 'reparation'], text: 'Masque riche pour les cheveux épais ou secs, à poser une fois par semaine.' },

  { id: 'nounou-shampoo', line: 'NOUNOU', name: 'NOUNOU Shampoo', size: '250 ml', price: 23.5, shape: 'flacon', needs: ['reparation'], text: 'Shampoing nourrissant pour les cheveux très secs, colorés ou fragilisés.' },
  { id: 'nounou-conditioner', line: 'NOUNOU', name: 'NOUNOU Conditioner', size: '250 ml', price: 29.2, shape: 'tube', needs: ['reparation'], text: 'Après-shampoing réparateur qui redonne souplesse et douceur.' },
  { id: 'nounou-mask', line: 'NOUNOU', name: 'NOUNOU Mask', size: '250 ml', price: 38, shape: 'pot', needs: ['reparation'], text: 'Masque intense pour les longueurs abîmées par la chaleur ou la couleur.' },

  { id: 'momo-shampoo', line: 'MOMO', name: 'MOMO Shampoo', size: '250 ml', price: 23.5, shape: 'flacon', needs: ['hydratation'], text: 'Shampoing hydratant pour les cheveux secs, sans les alourdir.' },
  { id: 'momo-conditioner', line: 'MOMO', name: 'MOMO Conditioner', size: '250 ml', price: 29.2, shape: 'tube', needs: ['hydratation'], text: 'Après-shampoing hydratant, pour des cheveux souples et faciles à démêler.' },

  { id: 'minu-shampoo', line: 'MINU', name: 'MINU Shampoo', size: '250 ml', price: 23.5, shape: 'flacon', needs: ['couleur'], text: 'Shampoing qui protège l’éclat de la couleur entre deux rendez-vous.' },
  { id: 'minu-conditioner', line: 'MINU', name: 'MINU Conditioner', size: '250 ml', price: 29.2, shape: 'tube', needs: ['couleur'], text: 'Après-shampoing qui prolonge l’éclat et la brillance des cheveux colorés.' },
  { id: 'minu-mask', line: 'MINU', name: 'MINU Mask', size: '250 ml', price: 38, shape: 'pot', needs: ['couleur', 'reparation'], text: 'Masque pour cheveux colorés, une fois par semaine.' },

  { id: 'love-curl-shampoo', line: 'LOVE CURL', name: 'LOVE CURL Shampoo', size: '250 ml', price: 23.5, shape: 'flacon', needs: ['boucles'], text: 'Shampoing qui respecte et dessine les boucles.' },
  { id: 'love-curl-conditioner', line: 'LOVE CURL', name: 'LOVE CURL Conditioner', size: '250 ml', price: 29.2, shape: 'tube', needs: ['boucles'], text: 'Après-shampoing qui définit les boucles et limite les frisottis.' },
  { id: 'love-curl-cream', line: 'LOVE CURL', name: 'LOVE CURL Cream', size: '150 ml', price: 32, shape: 'tube', needs: ['boucles', 'coiffage'], text: 'Crème sans rinçage pour des boucles rebondies et nettes.' },

  { id: 'love-smoothing-shampoo', line: 'LOVE SMOOTHING', name: 'LOVE SMOOTHING Shampoo', size: '250 ml', price: 23.5, shape: 'flacon', needs: ['lissage'], text: 'Shampoing qui discipline les cheveux épais et rebelles.' },
  { id: 'love-smoothing-conditioner', line: 'LOVE SMOOTHING', name: 'LOVE SMOOTHING Conditioner', size: '250 ml', price: 29.2, shape: 'tube', needs: ['lissage'], text: 'Après-shampoing lissant, contre les frisottis.' },
  { id: 'love-smoothing-serum', line: 'LOVE SMOOTHING', name: 'LOVE SMOOTHING Serum', size: '150 ml', price: 32, shape: 'pipette', needs: ['lissage', 'coiffage'], text: 'Sérum sans rinçage pour un brushing lisse qui tient.' },

  { id: 'volu-shampoo', line: 'VOLU', name: 'VOLU Shampoo', size: '250 ml', price: 23.5, shape: 'flacon', needs: ['volume'], text: 'Shampoing léger qui donne du corps aux cheveux fins.' },
  { id: 'volu-conditioner', line: 'VOLU', name: 'VOLU Conditioner', size: '250 ml', price: 29.2, shape: 'tube', needs: ['volume'], text: 'Après-shampoing léger qui démêle sans écraser les racines.' },
  { id: 'volu-hair-mist', line: 'VOLU', name: 'VOLU Hair Mist', size: '250 ml', price: 36, shape: 'spray', needs: ['volume', 'coiffage'], text: 'Brume sans rinçage pour du volume aux racines.' },

  { id: 'melu-shampoo', line: 'MELU', name: 'MELU Shampoo', size: '250 ml', price: 23.5, shape: 'flacon', needs: ['reparation'], text: 'Shampoing anti-casse pour les cheveux longs ou fragilisés.' },
  { id: 'melu-serum', line: 'MELU', name: 'MELU Serum', size: '150 ml', price: 32, shape: 'pipette', needs: ['reparation'], text: 'Sérum qui protège les pointes de la casse et de la chaleur.' },

  { id: 'heart-of-glass-shampoo', line: 'HEART OF GLASS', name: 'HEART OF GLASS Silkening Chelating Shampoo', size: '250 ml', price: 27, shape: 'flacon', needs: ['blonds'], text: 'Shampoing pour blonds, qui garde la lumière d’un balayage nette et brillante.' },
  { id: 'heart-of-glass-conditioner', line: 'HEART OF GLASS', name: 'HEART OF GLASS Rich Conditioner', size: '250 ml', price: 33.8, shape: 'tube', needs: ['blonds', 'reparation'], text: 'Après-shampoing riche pour les cheveux éclaircis.' },
  { id: 'heart-of-glass-sheer-glaze', line: 'HEART OF GLASS', name: 'HEART OF GLASS Sheer Glaze', size: '150 ml', price: 34, shape: 'tube', needs: ['blonds', 'coiffage'], text: 'Soin sans rinçage qui protège de la chaleur et fait briller les blonds.' },

  { id: 'alchemic-silver', line: 'ALCHEMIC', name: 'ALCHEMIC Shampoo Silver', size: '280 ml', price: 26, shape: 'flacon', needs: ['blonds', 'couleur'], text: 'Shampoing qui neutralise les reflets jaunes des blonds et des gris.' },
  { id: 'alchemic-golden', line: 'ALCHEMIC', name: 'ALCHEMIC Shampoo Golden', size: '280 ml', price: 26, shape: 'flacon', needs: ['couleur'], text: 'Shampoing qui ravive les reflets dorés.' },
  { id: 'alchemic-chocolate', line: 'ALCHEMIC', name: 'ALCHEMIC Shampoo Chocolate', size: '280 ml', price: 26, shape: 'flacon', needs: ['couleur'], text: 'Shampoing qui intensifie les bruns et châtains.' },

  { id: 'naturaltech-calming', line: 'NATURALTECH', name: 'CALMING Shampoo', size: '250 ml', price: 25, shape: 'flacon', needs: ['cuir-chevelu'], text: 'Shampoing apaisant pour les cuirs chevelus sensibles.' },
  { id: 'naturaltech-purifying', line: 'NATURALTECH', name: 'PURIFYING Shampoo', size: '250 ml', price: 25, shape: 'flacon', needs: ['cuir-chevelu'], text: 'Shampoing purifiant pour les cuirs chevelus à pellicules.' },
  { id: 'naturaltech-energizing', line: 'NATURALTECH', name: 'ENERGIZING Shampoo', size: '250 ml', price: 25, shape: 'flacon', needs: ['cuir-chevelu'], text: 'Shampoing tonifiant pour les cheveux fins ou qui tombent.' },

  { id: 'sea-salt-spray', line: 'THIS IS A', name: 'This is a Sea Salt Spray', size: '250 ml', price: 22.7, shape: 'spray', needs: ['coiffage', 'volume'], text: 'Spray texturisant pour un effet coiffé-décoiffé, façon retour de plage.' },
  { id: 'volume-boosting-mousse', line: 'THIS IS A', name: 'This is a Volume Boosting Mousse', size: '250 ml', price: 22.7, shape: 'spray', needs: ['coiffage', 'volume'], text: 'Mousse légère pour du volume au brushing.' },
  { id: 'curl-building-serum', line: 'THIS IS A', name: 'This is a Curl Building Serum', size: '250 ml', price: 21.4, shape: 'flacon', needs: ['coiffage', 'boucles'], text: 'Sérum qui dessine et tient les boucles.' },
  { id: 'pliable-paste', line: 'THIS IS A', name: 'This is a Medium Hold Pliable Paste', size: '125 ml', price: 26.1, shape: 'pot', needs: ['coiffage'], text: 'Pâte à fixation moyenne pour les coupes courtes et texturées.' },
  { id: 'dry-texturizer', line: 'THIS IS A', name: 'This is a Dry Texturizer', size: '250 ml', price: 26.2, shape: 'spray', needs: ['coiffage', 'volume'], text: 'Spray sec qui donne de la tenue et du mouvement aux coiffures.' },
];

export const product = (id) => products.find((item) => item.id === id);
