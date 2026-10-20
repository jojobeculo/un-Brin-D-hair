// Illustration d’un produit (flacon, tube, pot, spray ou pipette) à la couleur de sa gamme.
// Dessin générique : pas de photo de produit de la marque. Partagé par le site et le générateur de pages.
const SHAPES = {
  flacon: { body: 'M24 40 Q24 34 30 34 L50 34 Q56 34 56 40 L56 128 Q56 134 50 134 L30 134 Q24 134 24 128Z', cap: 'M32 16 L48 16 L48 34 L32 34Z', label: [28, 70, 24, 40] },
  tube: { body: 'M22 22 L58 22 L52 118 Q51 126 44 126 L36 126 Q29 126 28 118Z', cap: 'M33 126 L47 126 L47 136 L33 136Z', label: [27, 52, 26, 38] },
  pot: { body: 'M14 66 Q14 60 20 60 L60 60 Q66 60 66 66 L66 128 Q66 134 60 134 L20 134 Q14 134 14 128Z', cap: 'M12 46 Q12 42 16 42 L64 42 Q68 42 68 46 L68 60 L12 60Z', label: [18, 82, 44, 32] },
  spray: { body: 'M26 50 Q26 44 32 44 L48 44 Q54 44 54 50 L54 128 Q54 134 48 134 L32 134 Q26 134 26 128Z', cap: 'M34 22 L46 22 L46 44 L34 44Z M46 26 L58 26 L58 31 L46 31Z', label: [29, 74, 22, 38] },
  pipette: { body: 'M24 68 Q24 60 32 58 L48 58 Q56 60 56 68 L56 128 Q56 134 50 134 L30 134 Q24 134 24 128Z', cap: 'M34 22 Q34 12 40 12 Q46 12 46 22 L46 40 L50 40 L50 58 L30 58 L30 40 L34 40Z', label: [28, 84, 24, 32] },
};

const escapeXml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function bottleSvg(product, tint) {
  const shape = SHAPES[product.shape] || SHAPES.flacon;
  const [x, y, w, h] = shape.label;
  const words = product.line.split(' ');
  const text = words.map((word, index) => `<tspan x="${x + w / 2}" dy="${index ? 8 : 0}">${escapeXml(word)}</tspan>`).join('');
  return `<svg class="bottle" viewBox="0 0 80 140" aria-hidden="true" style="--tint:${tint}">
<ellipse cx="40" cy="136" rx="30" ry="3" fill="#33241B" opacity="0.08"/>
<path d="${shape.cap}" fill="#33241B" opacity="0.82"/>
<path d="${shape.body}" fill="currentColor"/>
<path d="${shape.body}" fill="url(#bottle-shine)" opacity="0.5"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#FBF8F4" opacity="0.92"/>
<text x="${x + w / 2}" y="${y + h / 2 + 2 - (words.length - 1) * 4}" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="6" font-weight="600" letter-spacing="0.5" fill="#33241B">${text}</text>
</svg>`;
}

// Dégradé partagé par toutes les illustrations d’une page (à insérer une fois).
export const bottleDefs = '<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs><linearGradient id="bottle-shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.3" stop-color="#fff" stop-opacity="0.55"/><stop offset="0.45" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>';
