// Ruban organique : une mèche de fils fins qui suit une courbe et se vrille sur elle-même,
// comme la vague de la vitrine. Partagé par le générateur (dessin fixe) et fx.js (dessin animé).

// Point et tangente d’une courbe de Catmull-Rom passant par `points`, pour t entre 0 et 1.
function spline(points, t) {
  const n = points.length - 1;
  const scaled = Math.min(t * n, n - 1e-6);
  const i = Math.floor(scaled);
  const u = scaled - i;
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(n, i + 2)];
  const at = (k) => {
    const a = p0[k];
    const b = p1[k];
    const c = p2[k];
    const d = p3[k];
    const value = 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    const slope = 0.5 * ((-a + c) + 2 * (2 * a - 5 * b + 4 * c - d) * u + 3 * (-a + 3 * b - 3 * c + d) * u * u);
    return [value, slope];
  };
  const [x, dx] = at(0);
  const [y, dy] = at(1);
  const length = Math.hypot(dx, dy) || 1;
  return { x, y, nx: -dy / length, ny: dx / length };
}

// Tracés des fils. options :
// - strands : nombre de fils ; spread : demi-largeur du ruban ; twists : nombre de vrilles ;
// - phase : rotation de la vrille (défilement) ;
// - pointer : { x, y, radius, strength } attire le ruban et l’élargit près de la souris.
export function ribbonPaths(points, { strands = 9, spread = 34, twists = 2.2, phase = 0, samples = 72, pointer = null } = {}) {
  const spine = [];
  for (let s = 0; s <= samples; s += 1) {
    const t = s / samples;
    const p = spline(points, t);
    let { x, y } = p;
    let width = spread * (0.35 + 0.65 * Math.sin(Math.PI * t));
    if (pointer) {
      const distance = Math.hypot(pointer.x - x, pointer.y - y);
      const pull = Math.exp(-((distance / pointer.radius) ** 2)) * pointer.strength;
      x += (pointer.x - x) * pull * 0.35;
      y += (pointer.y - y) * pull * 0.35;
      width *= 1 + pull * 0.9;
    }
    spine.push({ x, y, nx: p.nx, ny: p.ny, width, t });
  }
  const paths = [];
  for (let k = 0; k < strands; k += 1) {
    const lane = strands === 1 ? 0 : (k / (strands - 1)) * 2 - 1;
    let d = '';
    spine.forEach(({ x, y, nx, ny, width, t }, index) => {
      const offset = width * lane * Math.cos(Math.PI * twists * t + phase);
      d += `${index ? 'L' : 'M'}${(x + nx * offset).toFixed(1)} ${(y + ny * offset).toFixed(1)}`;
    });
    paths.push(d);
  }
  return paths;
}

// Formes prévues par section (repère 1440 × 900), placées de façon asymétrique.
export const RIBBONS = {
  hero: { points: [[420, 1020], [700, 880], [900, 660], [1120, 540], [1340, 300], [1580, 120]], spread: 44, twists: 2.6 },
  story: { points: [[1560, 120], [1200, 260], [980, 160], [700, 420], [380, 560], [-120, 820]], spread: 38, twists: 2 },
  quiz: { points: [[1180, -120], [1360, 160], [1260, 420], [1400, 680], [1280, 1020]], spread: 42, twists: 2.4 },
  book: { points: [[1580, 640], [1240, 820], [920, 740], [620, 860], [300, 780], [-140, 860]], spread: 40, twists: 2.2 },
};
