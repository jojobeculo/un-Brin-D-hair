// Poussière dorée en arrière-plan : quelques particules fines qui dérivent lentement, suivent le défilement
// à des profondeurs différentes et s’écartent doucement de la souris ou du doigt.
// Une seule toile, un sprite lumineux dessiné une fois ; pause quand l’onglet est caché.
import { calm } from '../lib/motion-pref.js';

function sprite(color) {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `rgba(${color}, 1)`);
  gradient.addColorStop(0.25, `rgba(${color}, 0.55)`);
  gradient.addColorStop(1, `rgba(${color}, 0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return canvas;
}

export function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'particles';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const context = canvas.getContext('2d');
  const light = sprite('176, 124, 74');
  const glow = sprite('230, 196, 150');
  const pointer = { x: -999, y: -999, until: 0 };
  const coarse = matchMedia('(pointer: coarse)').matches;
  let particles = [];
  let width = 0;
  let height = 0;
  let lastScroll = scrollY;
  let previous = performance.now();

  const resize = () => {
    const ratio = Math.min(2, devicePixelRatio || 1);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.round(Math.min(coarse ? 24 : 48, (width * height) / 22000));
    particles = Array.from({ length: count }, (_, index) => particles[index] || {
      x: Math.random() * width,
      y: Math.random() * height,
      depth: 0.25 + Math.random() * 0.75,
      size: 0.6 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      vx: 0,
      vy: 0,
    });
  };
  resize();
  addEventListener('resize', resize);

  const track = (x, y) => {
    pointer.x = x;
    pointer.y = y;
    pointer.until = performance.now() + 1000;
  };
  addEventListener('pointermove', (event) => track(event.clientX, event.clientY), { passive: true });
  addEventListener('touchmove', (event) => track(event.touches[0].clientX, event.touches[0].clientY), { passive: true });

  function frame(now) {
    if (document.hidden) {
      previous = now;
      requestAnimationFrame(frame);
      return;
    }
    const dt = Math.min(48, now - previous) / 16.7;
    previous = now;
    const slow = calm() ? 0.45 : 1;
    const scrolled = scrollY - lastScroll;
    lastScroll = scrollY;
    // Zones sombres à l’écran : la poussière y devient dorée et plus lumineuse.
    const darkZones = [...document.querySelectorAll('[data-ambient="dark"]')].map((section) => section.getBoundingClientRect()).filter((rect) => rect.bottom > 0 && rect.top < height).map((rect) => [rect.top + 120, rect.bottom - 120]);
    const near = now < pointer.until;
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      // Dérive lente le long d’un champ ondulé, comme une poussière dans un rayon de soleil.
      const angle = Math.sin(particle.y * 0.004 + now * 0.00012) + Math.cos(particle.x * 0.003 - now * 0.0001);
      particle.vx += Math.cos(angle) * 0.004 * slow;
      particle.vy += Math.sin(angle) * 0.004 * slow - 0.0015 * slow;
      if (near) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 130 && distance > 0.1) {
          const force = (1 - distance / 130) * 0.06;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }
      particle.vx *= 0.97;
      particle.vy *= 0.97;
      particle.x += particle.vx * dt * particle.depth * 2;
      particle.y += particle.vy * dt * particle.depth * 2 - scrolled * particle.depth * 0.25 * slow;
      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;
      const twinkle = 0.55 + 0.45 * Math.sin(now * 0.0012 + particle.phase);
      const dark = darkZones.some(([top, bottom]) => particle.y > top && particle.y < bottom);
      const size = particle.size * (dark ? 5.5 : 5.2) * (0.8 + particle.depth * 0.4);
      context.globalAlpha = (dark ? 0.8 : 0.72) * twinkle * (0.55 + particle.depth * 0.45);
      context.drawImage(dark ? glow : light, particle.x - size / 2, particle.y - size / 2, size, size);
    });
    context.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  // Après le chargement : la poussière n’entre pas en concurrence avec l’affichage de la page.
  const start = () => setTimeout(() => {
    canvas.classList.add('is-on');
    requestAnimationFrame(frame);
  }, 900);
  if (document.readyState === 'complete') start();
  else addEventListener('load', start, { once: true });
}
