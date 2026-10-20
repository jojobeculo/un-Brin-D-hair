// Effets réservés à l’ordinateur (souris, écran large, mouvements autorisés) : chargé à la demande par main.js.
// Curseur, traînée dorée dans l’accueil, ruban organique qui réagit à la souris, orbes de lumière avec inertie,
// boutons magnétiques, cartes inclinées en 3D et reflet liquide sur les photos.
// Une seule boucle requestAnimationFrame, arrêtée dès que tout est immobile.
import { ribbonPaths, RIBBONS } from '../lib/ribbon.js';

const mouse = { x: innerWidth / 2, y: innerHeight / 2, moved: 0 };
const systems = [];
let running = false;

function loop(now) {
  let active = false;
  systems.forEach((system) => {
    if (system(now)) active = true;
  });
  running = active;
  if (running) requestAnimationFrame(loop);
}

function wake() {
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}

const lerp = (from, to, amount) => from + (to - from) * amount;
const settled = (a, b) => Math.abs(a - b) < 0.01;

// Éléments visibles à l’écran, suivis par IntersectionObserver.
function visibleSet(selector) {
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
    wake();
  });
  document.querySelectorAll(selector).forEach((element) => observer.observe(element));
  return visible;
}

// ---------- Curseur ----------

function ringPath(radius, amplitude, phase) {
  let d = '';
  for (let i = 0; i <= 56; i += 1) {
    const angle = (i / 56) * Math.PI * 2;
    const r = radius + amplitude * Math.sin(angle * 7 + phase);
    d += `${i ? 'L' : 'M'}${(60 + r * Math.cos(angle)).toFixed(1)} ${(60 + r * Math.sin(angle)).toFixed(1)}`;
  }
  return `${d}Z`;
}

function cursor() {
  const root = document.createElement('div');
  root.className = 'cursor is-hidden';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<svg class="cursor__ring" viewBox="0 0 120 120"><path/></svg><span class="cursor__dot"></span><span class="cursor__label"></span>';
  document.body.append(root);
  document.documentElement.classList.add('has-cursor');
  const ring = root.querySelector('.cursor__ring');
  const path = ring.querySelector('path');
  const dot = root.querySelector('.cursor__dot');
  const label = root.querySelector('.cursor__label');
  const dotPos = { x: mouse.x, y: mouse.y };
  const ringPos = { x: mouse.x, y: mouse.y };
  let radius = 8;
  let target = 8;
  let amplitude = 0;
  let phase = 0;

  const interactive = 'a, button, summary, label, select, [data-cursor]';
  document.addEventListener('pointerover', (event) => {
    const element = event.target.closest(interactive);
    const text = element?.closest('[data-cursor]')?.dataset.cursor || '';
    const field = event.target.closest('input:not([type="checkbox"]):not([type="radio"]), textarea');
    root.classList.toggle('is-hidden', Boolean(field));
    root.classList.toggle('is-hover', Boolean(element));
    root.classList.toggle('has-label', Boolean(text));
    label.textContent = text;
    target = text ? 46 : element ? 24 : 8;
    wake();
  });
  document.documentElement.addEventListener('mouseleave', () => root.classList.add('is-hidden'));
  addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') return;
    const burst = document.createElement('span');
    burst.className = 'cursor__burst';
    burst.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    root.append(burst);
    burst.addEventListener('animationend', () => burst.remove());
    radius *= 0.75;
  });

  systems.push(() => {
    if (mouse.moved) root.classList.remove('is-hidden');
    dotPos.x = lerp(dotPos.x, mouse.x, 0.35);
    dotPos.y = lerp(dotPos.y, mouse.y, 0.35);
    const dx = mouse.x - ringPos.x;
    const dy = mouse.y - ringPos.y;
    ringPos.x += dx * 0.16;
    ringPos.y += dy * 0.16;
    const speed = Math.hypot(dx, dy);
    amplitude = lerp(amplitude, Math.min(4.5, speed * 0.07), 0.12);
    radius = lerp(radius, target, 0.16);
    phase += 0.05 + speed * 0.004;
    dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    label.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    path.setAttribute('d', ringPath(radius, amplitude + (target > 20 ? 1.1 : 0), phase));
    return speed > 0.1 || !settled(radius, target) || amplitude > 0.05 || Math.hypot(mouse.x - dotPos.x, mouse.y - dotPos.y) > 0.1;
  });
}

// ---------- Traînée dorée (accueil) ----------

function trail() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'trail';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const context = canvas.getContext('2d');
  const points = [];
  let last = null;
  const resize = () => {
    const ratio = Math.min(2, devicePixelRatio || 1);
    canvas.width = hero.clientWidth * ratio;
    canvas.height = hero.clientHeight * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  hero.addEventListener('pointermove', (event) => {
    const now = performance.now();
    const rect = hero.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top, t: now };
    // Seuls les gestes rapides laissent une traînée.
    if (last && Math.hypot(point.x - last.x, point.y - last.y) / Math.max(1, now - last.t) > 0.7) points.push(point);
    last = point;
  });

  systems.push((now) => {
    while (points.length && now - points[0].t > 320) points.shift();
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < points.length; i += 1) {
      const a = points[i - 1];
      const b = points[i];
      const life = 1 - (now - b.t) / 320;
      context.strokeStyle = `rgba(201, 162, 122, ${(life * 0.55).toFixed(3)})`;
      context.lineWidth = 0.5 + life * 2.2;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    }
    return points.length > 0;
  });
}

// ---------- Ruban organique ----------

function ribbons() {
  const visible = visibleSet('[data-ribbon]');
  const states = new Map();
  systems.push(() => {
    let active = false;
    visible.forEach((element) => {
      const shape = RIBBONS[element.dataset.ribbon];
      const svg = element.querySelector('svg');
      const rect = svg.getBoundingClientRect();
      const state = states.get(element) || { phase: 0, strength: 0, x: 720, y: 450, key: '' };
      states.set(element, state);
      const scale = Math.max(rect.width / 1440, rect.height / 900);
      const x = (mouse.x - rect.left - (rect.width - 1440 * scale) / 2) / scale;
      const y = (mouse.y - rect.top - (rect.height - 900 * scale) / 2) / scale;
      const inside = mouse.y > rect.top && mouse.y < rect.bottom;
      const phaseTarget = ((rect.top + rect.height / 2 - innerHeight / 2) / innerHeight) * 2.4;
      state.phase = lerp(state.phase, phaseTarget, 0.08);
      state.strength = lerp(state.strength, inside ? 1 : 0, 0.06);
      state.x = lerp(state.x, x, 0.12);
      state.y = lerp(state.y, y, 0.12);
      const key = `${state.phase.toFixed(3)}|${state.strength.toFixed(3)}|${state.x.toFixed(0)}|${state.y.toFixed(0)}`;
      if (key === state.key) return;
      state.key = key;
      active = true;
      const paths = ribbonPaths(shape.points, { ...shape, phase: state.phase, pointer: { x: state.x, y: state.y, radius: 240, strength: state.strength * 0.5 } });
      element.querySelectorAll('path').forEach((node, index) => node.setAttribute('d', paths[index]));
      const light = element.querySelector('radialGradient');
      light.setAttribute('cx', state.x.toFixed(0));
      light.setAttribute('cy', state.y.toFixed(0));
      light.setAttribute('r', (700 - state.strength * 380).toFixed(0));
      element.style.setProperty('--ribbon-w', (1 + state.strength * 0.7).toFixed(2));
    });
    return active;
  });
}

// ---------- Orbes de lumière ----------

function orbs() {
  const visible = visibleSet('[data-orbs]');
  const offsets = new Map();
  systems.push(() => {
    let active = false;
    visible.forEach((layer) => {
      const offset = offsets.get(layer) || { x: 0, y: 0 };
      offsets.set(layer, offset);
      const tx = (mouse.x / innerWidth - 0.5) * 70;
      const ty = (mouse.y / innerHeight - 0.5) * 50;
      offset.x = lerp(offset.x, tx, 0.035);
      offset.y = lerp(offset.y, ty, 0.035);
      layer.style.setProperty('--ox', `${offset.x.toFixed(1)}px`);
      layer.style.setProperty('--oy', `${offset.y.toFixed(1)}px`);
      if (!settled(offset.x, tx) || !settled(offset.y, ty)) active = true;
    });
    return active;
  });
}

// ---------- Boutons magnétiques ----------

function magnetic() {
  const buttons = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? buttons.add(entry.target) : buttons.delete(entry.target)));
  });
  document.querySelectorAll('[data-magnetic]').forEach((button) => {
    observer.observe(button);
    button.addEventListener('click', () => {
      button.classList.remove('is-shock');
      requestAnimationFrame(() => button.classList.add('is-shock'));
    });
    button.addEventListener('animationend', () => button.classList.remove('is-shock'));
  });
  addEventListener('pointermove', () => {
    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect();
      const dx = mouse.x - (rect.left + rect.width / 2);
      const dy = mouse.y - (rect.top + rect.height / 2);
      const reach = Math.max(rect.width, rect.height) * 0.85;
      const near = Math.hypot(dx, dy) < reach;
      button.classList.toggle('is-pulled', near);
      button.style.setProperty('--mx', near ? `${(dx * 0.3).toFixed(1)}px` : '0px');
      button.style.setProperty('--my', near ? `${(dy * 0.35).toFixed(1)}px` : '0px');
    });
  }, { passive: true });
}

// ---------- Cartes inclinées ----------

function tilt() {
  let current = null;
  const reset = (element) => {
    element.classList.remove('is-tilting');
    element.style.setProperty('--rx', '0deg');
    element.style.setProperty('--ry', '0deg');
  };
  document.addEventListener('pointermove', (event) => {
    const element = event.target.closest('[data-tilt]');
    if (current && current !== element) reset(current);
    current = element;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    element.classList.add('is-tilting');
    element.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
    element.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
    element.style.setProperty('--gx', `${(x * 100).toFixed(0)}%`);
    element.style.setProperty('--gy', `${(y * 100).toFixed(0)}%`);
  }, { passive: true });
  document.addEventListener('pointerleave', () => current && reset(current));
}

// ---------- Reflet liquide sur les photos ----------

function liquid() {
  const holder = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  holder.setAttribute('aria-hidden', 'true');
  holder.setAttribute('width', '0');
  holder.setAttribute('height', '0');
  holder.style.position = 'absolute';
  holder.innerHTML = '<filter id="liquid" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="2" seed="4" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>';
  document.body.append(holder);
  const turbulence = holder.querySelector('feTurbulence');
  const displacement = holder.querySelector('feDisplacementMap');
  let hovered = null;
  let fading = null;
  let start = 0;
  let scale = 0;

  document.querySelectorAll('[data-liquid]').forEach((element) => {
    element.addEventListener('pointerenter', () => {
      if (fading && fading !== element) fading.classList.remove('is-liquid');
      hovered = element;
      fading = null;
      start = performance.now();
      element.classList.add('is-liquid');
      wake();
    });
    element.addEventListener('pointerleave', () => {
      fading = element;
      hovered = null;
      wake();
    });
  });

  systems.push((now) => {
    if (!hovered && !fading) return false;
    const elapsed = now - start;
    const target = hovered ? 7 + 16 * Math.exp(-elapsed / 650) : 0;
    scale = lerp(scale, target, 0.12);
    const wobble = Math.sin(now / 900);
    turbulence.setAttribute('baseFrequency', `${(0.011 + wobble * 0.003).toFixed(4)} ${(0.019 - wobble * 0.004).toFixed(4)}`);
    displacement.setAttribute('scale', scale.toFixed(2));
    if (!hovered && scale < 0.2) {
      fading?.classList.remove('is-liquid');
      fading = null;
      return false;
    }
    return true;
  });
}

export function initFx() {
  addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.moved = 1;
    wake();
  }, { passive: true });
  addEventListener('scroll', wake, { passive: true });
  [cursor, trail, ribbons, orbs, magnetic, tilt, liquid].forEach((init) => {
    try {
      init();
    } catch (error) {
      console.error(error);
    }
  });
  wake();
}
