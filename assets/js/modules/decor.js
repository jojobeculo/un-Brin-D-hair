// Éléments décoratifs du fond, sur ordinateur comme sur téléphone :
// - au défilement, chacun glisse à sa vitesse (profondeur) et revient par le bas, en tournant doucement ;
// - la souris les décale avec inertie (effet de profondeur) ;
// - à l’approche de la souris ou du doigt, ils s’écartent, grossissent, s’épaississent et s’éclairent (--near).
import { calm } from '../lib/motion-pref.js';

const lerp = (from, to, amount) => from + (to - from) * amount;

export function initDecor() {
  const root = document.querySelector('[data-decor]');
  if (!root) return;
  const items = [...root.children].map((element) => ({
    element,
    x: parseFloat(element.style.getPropertyValue('--x')) / 100,
    y: Number(element.style.getPropertyValue('--y')),
    depth: Number(element.style.getPropertyValue('--depth')),
    size: parseFloat(element.style.getPropertyValue('--s')),
    tx: 0, ty: 0, near: 0, push: [0, 0],
  }));
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, active: 0 };
  const offset = { x: 0, y: 0 };
  let running = false;

  function frame(now) {
    const vw = innerWidth;
    const vh = innerHeight;
    const band = vh * 1.6;
    const speed = calm() ? 0.5 : 1;
    const active = now < pointer.active;
    offset.x = lerp(offset.x, (pointer.x / vw - 0.5) * 2, 0.05);
    offset.y = lerp(offset.y, (pointer.y / vh - 0.5) * 2, 0.05);
    let moving = Math.abs(offset.x - (pointer.x / vw - 0.5) * 2) > 0.002;
    items.forEach((item, index) => {
      const travel = scrollY * (0.12 + item.depth * 0.4) * speed;
      const y = ((((item.y * band - travel) % band) + band) % band) - vh * 0.3;
      const x = item.x * vw;
      const cx = x + item.size / 2;
      const cy = y + item.size / 2;
      const dx = cx - pointer.x;
      const dy = cy - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      const reach = 170 + item.size;
      const closeness = active ? Math.max(0, 1 - distance / reach) : 0;
      const force = closeness * closeness * 70;
      item.push[0] = lerp(item.push[0], (dx / distance) * force, 0.12);
      item.push[1] = lerp(item.push[1], (dy / distance) * force, 0.12);
      item.near = lerp(item.near, closeness, 0.12);
      const tx = item.push[0] + offset.x * item.depth * -26;
      const ty = y + item.push[1] + offset.y * item.depth * -18;
      if (Math.abs(tx - item.tx) > 0.05 || Math.abs(ty - item.ty) > 0.05 || item.near > 0.002) moving = true;
      item.tx = tx;
      item.ty = ty;
      const style = item.element.style;
      style.setProperty('--tx', `${tx.toFixed(1)}px`);
      style.setProperty('--ty', `${ty.toFixed(1)}px`);
      style.setProperty('--near', item.near.toFixed(3));
      style.setProperty('--rot', `${(scrollY * 0.03 * item.depth * (index % 2 ? 1 : -1) * speed).toFixed(1)}deg`);
    });
    running = moving || active;
    if (running) requestAnimationFrame(frame);
  }

  function wake() {
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  const track = (x, y, duration) => {
    pointer.x = x;
    pointer.y = y;
    pointer.active = performance.now() + duration;
    wake();
  };
  addEventListener('pointermove', (event) => track(event.clientX, event.clientY, 1200), { passive: true });
  addEventListener('pointerdown', (event) => track(event.clientX, event.clientY, 900), { passive: true });
  addEventListener('touchmove', (event) => track(event.touches[0].clientX, event.touches[0].clientY, 900), { passive: true });
  addEventListener('scroll', wake, { passive: true });
  addEventListener('resize', wake);
  wake();
}
