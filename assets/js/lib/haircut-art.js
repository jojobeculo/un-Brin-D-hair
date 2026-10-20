// Illustration d’une coupe : silhouette sans visage, dessinée à partir de sa description (`art`).
// Partagé par le site (résultats du questionnaire) et le générateur de pages.

const SKIN = '#EAD6C2';
const SKIN_SHADE = '#DDC3AA';
const TOP = '#CDB49A';
const HAIR = '#5B3B28';
const STRAND = '#3D2719';
const LIGHT = '#D9B58E';

const BOTTOM = { pixie: 100, ear: 122, chin: 150, shoulder: 178, long: 206, verylong: 214 };
const r = (n) => Math.round(n * 10) / 10;

// Bord vertical (de y0 à y1, à l’abscisse x) selon la texture.
function side(x0, y0, x1, y1, tex, flip) {
  const steps = tex === 'straight' ? 1 : tex === 'wavy' ? 3 : 6;
  let d = '';
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    if (tex === 'straight') {
      d += ` Q${r(x1 + (flip ? -3 : 3))} ${r((y0 + y1) / 2)} ${r(x)} ${r(y)}`;
    } else {
      const bulge = (tex === 'wavy' ? 6 : 5) * (i % 2 ? 1 : -1) * (flip ? -1 : 1);
      const mx = x0 + (x1 - x0) * (t - 0.5 / steps) + bulge;
      const my = y0 + (y1 - y0) * (t - 0.5 / steps);
      d += ` Q${r(mx)} ${r(my)} ${r(x)} ${r(y)}`;
    }
  }
  return d;
}

// Bord du bas, de droite (xr) à gauche (xl).
function bottomEdge(xr, xl, y, art) {
  const width = xr - xl;
  if (art.v) return ` L${r(xl + width / 2)} ${r(y + 16)} L${r(xl)} ${r(y)}`;
  if (art.layers && art.tex !== 'curly' && art.tex !== 'coily') {
    let d = '';
    const n = 7;
    for (let i = 1; i <= n; i += 1) {
      const x = xr - (width * i) / n;
      d += ` L${r(x + width / n / 2)} ${r(y + (i % 2 ? 7 : -3))} L${r(x)} ${r(y)}`;
    }
    return d;
  }
  if (art.tex === 'curly' || art.tex === 'coily') {
    let d = '';
    const n = art.tex === 'coily' ? 8 : 6;
    for (let i = 1; i <= n; i += 1) {
      const x = xr - (width * i) / n;
      d += ` Q${r(x + width / n / 2)} ${r(y + 9)} ${r(x)} ${r(y)}`;
    }
    return d;
  }
  if (art.tex === 'wavy') return ` Q${r(xl + width * 0.75)} ${r(y + 8)} ${r(xl + width / 2)} ${r(y + 2)} Q${r(xl + width * 0.25)} ${r(y - 4)} ${r(xl)} ${r(y)}`;
  if (art.aline) return ` Q${r(xl + width / 2)} ${r(y - 16)} ${r(xl)} ${r(y)}`;
  return ` Q${r(xl + width / 2)} ${r(y + 5)} ${r(xl)} ${r(y)}`;
}

// Masse arrière des cheveux mi-longs à longs (derrière le visage).
function backMass(art) {
  const y = BOTTOM[art.len];
  const hw = 38 + art.vol * 20 + (art.len === 'long' || art.len === 'verylong' ? 6 : 0);
  const yr = art.asym ? y - 20 : y;
  let d = `M63 96 C58 52 80 42 100 42 C120 42 142 52 137 96`;
  d += side(137, 96, 100 + hw, yr, art.tex, false);
  d += bottomEdge(100 + hw, 100 - hw, y, art);
  d += side(100 - hw, y, 63, 96, art.tex, true).replace(/^/, '');
  return `<path d="${d}Z" fill="${HAIR}"/>`;
}

// Calotte et frange (devant le visage).
function front(art) {
  const short = art.len === 'pixie' || art.len === 'ear';
  const sideY = art.len === 'pixie' ? 98 : art.len === 'ear' ? 116 : 104;
  const outer = short ? `M64 ${sideY} C56 56 78 40 100 40 C122 40 144 56 136 ${sideY}` : 'M64 104 C58 54 78 40 100 40 C122 40 142 54 136 104';
  let line;
  switch (art.bangs) {
    case 'blunt':
      line = ' L134 88 L66 88';
      break;
    case 'wispy':
      line = ' L134 84 L126 90 L118 84 L110 91 L102 84 L94 90 L86 84 L78 90 L70 84 L66 86';
      break;
    case 'curtain':
      line = ' C132 84 116 70 102 72 L98 72 C84 70 68 84 66 98';
      break;
    case 'side':
      line = ' C132 86 120 70 92 72 C80 76 70 84 66 92';
      break;
    default:
      line = art.part === 'side' ? ' C132 82 112 64 86 66 C76 72 68 84 66 98' : ' C132 82 116 66 102 66 L98 66 C84 66 68 82 66 98';
  }
  let d = `${outer} L136 ${short ? sideY : 104}${line}Z`;
  if (short && art.tex === 'curly') d = 'M60 112 Q54 92 60 76 Q58 58 74 50 Q82 38 96 40 Q110 34 122 44 Q140 50 140 70 Q148 86 140 110 C134 90 120 72 100 72 C80 72 66 90 60 112Z';
  if (short && art.tex === 'coily') d = 'M58 112 Q48 88 56 66 Q56 44 78 38 Q96 26 116 34 Q140 38 144 62 Q154 86 142 112 C136 90 120 74 100 74 C80 74 64 90 58 112Z';
  return `<path d="${d}" fill="${HAIR}"/>`;
}

// Mèches : quelques traits sur la calotte et sur les côtés, jamais sur le visage.
function strands(art, light) {
  const y = BOTTOM[art.len] || 120;
  const color = light ? 'url(#hl)' : STRAND;
  const opacity = light ? 1 : 0.35;
  const width = light ? 3 : 1.2;
  const hw = 38 + art.vol * 20;
  const long = !['pixie', 'ear'].includes(art.len);
  const paths = [];
  if (art.tex === 'curly' || art.tex === 'coily') {
    const radius = art.tex === 'coily' ? 2.2 : 3.4;
    const spots = [[80, 50], [94, 46], [108, 47], [121, 52], [70, 64], [130, 64]];
    if (long) {
      for (let yy = 104; yy < y - 6; yy += 16) spots.push([100 - hw + 9, yy], [100 + hw - 9, yy], [64 - (yy % 32 ? 4 : 0), yy + 8], [136 + (yy % 32 ? 4 : 0), yy + 8]);
    }
    for (const [cx, cy] of spots) paths.push(`<circle cx="${r(cx)}" cy="${r(cy)}" r="${radius}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}"/>`);
    return paths.join('');
  }
  paths.push(`<path d="M100 44 C88 46 78 54 72 68 M100 44 C112 46 122 54 128 68" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${opacity}"/>`);
  if (long) {
    const wave = art.tex === 'wavy' ? 7 : 2;
    for (const [x0, x1] of [[66, 100 - hw + 6], [68, 100 - hw + 14], [134, 100 + hw - 6], [132, 100 + hw - 14]]) {
      const outward = x0 < 100 ? -1 : 1;
      paths.push(`<path d="M${x0} 92 C${x0 + outward * wave} ${r(92 + (y - 92) * 0.35)} ${r(x1 - outward * wave)} ${r(92 + (y - 92) * 0.7)} ${r(x1)} ${y - 6}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${opacity}"/>`);
    }
  }
  return paths.join('');
}

// Coiffures courtes « homme » (et enfants) : dessus et côtés.
function menHair(art) {
  const parts = [];
  const sides = {
    skin: '',
    fade: `<path d="M64 74 Q60 96 66 112 L72 112 Q68 94 72 76Z M136 74 Q140 96 134 112 L128 112 Q132 94 128 76Z" fill="url(#fade)"/>`,
    short: `<path d="M63 72 Q58 96 64 108 L72 106 Q68 92 72 76Z M137 72 Q142 96 136 108 L128 106 Q132 92 128 76Z" fill="${HAIR}"/>`,
    medium: `<path d="M62 70 Q54 100 62 124 L74 120 Q68 96 72 76Z M138 70 Q146 100 138 124 L126 120 Q132 96 128 76Z" fill="${HAIR}"/>`,
    long: `<path d="M62 70 Q50 120 56 176 L80 176 Q70 120 72 76Z M138 70 Q150 120 144 176 L120 176 Q130 120 128 76Z" fill="${HAIR}"/>`,
  };
  const tops = {
    buzz: `<path d="M66 82 C62 52 80 46 100 46 C120 46 138 52 134 82 C126 70 114 64 100 64 C86 64 74 70 66 82Z" fill="${HAIR}" opacity="0.55"/>`,
    crew: `<path d="M66 82 C60 50 78 42 100 42 C122 42 140 50 134 82 C128 68 116 62 100 62 C84 62 72 68 66 82Z" fill="${HAIR}"/>`,
    crop: `<path d="M65 84 C58 48 80 40 100 40 C120 40 142 48 135 84 L130 74 L70 74Z" fill="${HAIR}"/><path d="M70 74 L130 74 L130 72 L70 72Z" fill="${STRAND}" opacity="0.3"/>`,
    textured: `<path d="M65 84 C58 50 72 40 80 42 L86 34 L92 42 L100 32 L106 42 L114 34 L118 44 C134 44 142 56 135 84 L130 74 L124 78 L118 72 L110 78 L102 72 L94 78 L86 72 L78 78 L70 72Z" fill="${HAIR}"/>`,
    cesar: `<path d="M65 84 C60 52 80 44 100 44 C120 44 140 52 135 84 L132 72 L68 72Z" fill="${HAIR}"/>`,
    quiff: `<path d="M65 86 C60 54 68 40 80 36 C84 22 108 18 120 30 C138 36 140 56 135 86 C130 70 118 60 104 58 C90 56 74 64 65 86Z" fill="${HAIR}"/>`,
    side: `<path d="M64 88 C58 50 80 40 100 40 C122 40 142 50 136 88 C130 68 114 58 90 60 C80 62 70 72 64 88Z" fill="${HAIR}"/><path d="M88 42 Q86 52 88 60" stroke="${STRAND}" stroke-width="1.4" fill="none" opacity="0.6"/>`,
    slick: `<path d="M65 86 C58 46 80 36 100 36 C122 36 142 46 135 86 C130 70 118 64 100 64 C82 64 70 70 65 86Z" fill="${HAIR}"/><path d="M84 62 Q90 46 104 40 M96 62 Q102 48 116 42 M108 63 Q114 50 126 48" stroke="${STRAND}" stroke-width="1.2" fill="none" opacity="0.45"/>`,
    ivy: `<path d="M65 86 C60 52 80 42 100 42 C120 42 140 52 135 86 C130 70 116 62 94 64 C82 66 72 74 65 86Z" fill="${HAIR}"/>`,
    curly: `<path d="M64 86 Q56 70 64 58 Q62 44 76 42 Q82 30 96 34 Q108 26 118 36 Q134 36 136 52 Q146 64 136 86 C130 72 116 64 100 64 C84 64 70 72 64 86Z" fill="${HAIR}"/>`,
    afro: `<path d="M62 88 Q50 72 58 56 Q56 36 76 32 Q90 18 108 24 Q132 22 140 44 Q152 62 138 88 C130 74 116 66 100 66 C84 66 70 74 62 88Z" fill="${HAIR}"/>`,
    flow: `<path d="M62 104 C52 54 78 38 100 38 C124 38 150 54 138 104 C136 112 132 118 128 122 C130 100 126 80 112 70 C96 62 80 66 72 80 C68 92 70 112 72 122 C66 116 62 110 62 104Z" fill="${HAIR}"/>`,
    long: `<path d="M64 100 C56 52 78 40 100 40 C122 40 144 52 136 100 C132 82 118 68 102 66 L98 66 C82 68 68 82 64 100Z" fill="${HAIR}"/>`,
  };
  parts.push(sides[art.sides] || '');
  parts.push(tops[art.top] || tops.crop);
  return parts.join('');
}

// SVG complet. options.highlight : mèches claires (balayage) ; options.title : texte pour les lecteurs d’écran ;
// options.id : préfixe des dégradés, unique quand plusieurs dessins partagent une page.
export function haircutSvg(art, { highlight = false, title = '', id = 'cut' } = {}) {
  const men = Boolean(art.men);
  const long = !men && ['chin', 'shoulder', 'long', 'verylong'].includes(art.len);
  const shortSides = men || art.len === 'pixie' || art.len === 'ear';
  const ears = shortSides ? `<ellipse cx="69" cy="104" rx="5" ry="9" fill="${SKIN_SHADE}"/><ellipse cx="131" cy="104" rx="5" ry="9" fill="${SKIN_SHADE}"/>` : '';
  const label = title ? `<title>${title}</title>` : '';
  const svg = `<svg viewBox="0 0 200 210" ${title ? 'role="img"' : 'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg">${label}
<defs><linearGradient id="hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="${LIGHT}" stop-opacity="0"/><stop offset="1" stop-color="${LIGHT}"/></linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${HAIR}"/><stop offset="1" stop-color="${HAIR}" stop-opacity="0.15"/></linearGradient></defs>
${art.mullet ? `<path d="M70 110 Q66 150 62 176 L138 176 Q134 150 130 110Z" fill="${HAIR}"/>` : ''}${long ? backMass(art) : ''}
<path d="M28 210 C32 178 66 164 100 164 C134 164 168 178 172 210Z" fill="${TOP}"/>
<path d="M88 132 L112 132 L114 168 Q100 176 86 168Z" fill="${SKIN_SHADE}"/>
${ears}<ellipse cx="100" cy="102" rx="31" ry="40" fill="${SKIN}"/>
${men ? menHair(art) : front(art)}
${!men ? strands(art, false) : ''}${highlight && !men ? strands(art, true) : ''}
</svg>`;
  return svg.replace(/id="(hl|fade)"/g, `id="${id}-$1"`).replace(/url\(#(hl|fade)\)/g, `url(#${id}-$1)`);
}
