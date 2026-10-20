const DAY = 86_400_000;

// Dimanche de Pâques (algorithme de Meeus, Jones et Butcher).
function easter(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const h = (19 * a + b - Math.floor(b / 4) - Math.floor((b - Math.floor((b + 8) / 25) + 1) / 3) + 15) % 30;
  const l = (32 + 2 * (b % 4) + 2 * Math.floor(c / 4) - h - (c % 4)) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  return new Date(year, month, ((h + l - 7 * m + 114) % 31) + 1);
}

// Fête des mères en France : dernier dimanche de mai, ou premier dimanche de juin si c’est la Pentecôte.
function mothersDay(year) {
  const date = new Date(year, 5, 0);
  date.setDate(date.getDate() - date.getDay());
  const pentecost = easter(year);
  pentecost.setDate(pentecost.getDate() + 49);
  if (date.getTime() === pentecost.getTime()) date.setDate(date.getDate() + 7);
  return date;
}

// Fête des pères : troisième dimanche de juin.
function fathersDay(year) {
  const date = new Date(year, 5, 1);
  date.setDate(1 + ((7 - date.getDay()) % 7) + 14);
  return date;
}

const OCCASIONS = [
  { id: 'saint-valentin', label: 'la Saint-Valentin', date: (year) => new Date(year, 1, 14) },
  { id: 'fete-des-meres', label: 'la fête des mères', date: mothersDay },
  { id: 'fete-des-peres', label: 'la fête des pères', date: fathersDay },
  { id: 'noel', label: 'Noël', date: (year) => new Date(year, 11, 25) },
];

function nextOccasion(today) {
  return OCCASIONS.map((occasion) => {
    let date = occasion.date(today.getFullYear());
    if (date < today) date = occasion.date(today.getFullYear() + 1);
    return { ...occasion, days: Math.round((date - today) / DAY) };
  }).sort((a, b) => a.days - b.days)[0];
}

// Carte cadeau : aperçu selon l’occasion, et compte à rebours avant la prochaine fête.
export function initGift() {
  const card = document.querySelector('[data-giftcard]');
  const title = document.querySelector('[data-giftcard-title]');
  const radios = document.querySelectorAll('[data-occasions] input');
  if (!card || !title || !radios.length) return;

  const apply = (input) => {
    title.textContent = input.dataset.title;
    card.dataset.theme = input.dataset.theme;
  };
  radios.forEach((input) => input.addEventListener('change', () => apply(input)));

  const now = new Date();
  const next = nextOccasion(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const preselected = document.querySelector(`[data-occasions] input[value="${next.id}"]`);
  if (preselected) {
    preselected.checked = true;
    apply(preselected);
  }
  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const name = next.label.charAt(0).toUpperCase() + next.label.slice(1);
    countdown.textContent = next.days === 0
      ? `C’est ${next.label} aujourd’hui !`
      : `${name} dans ${next.days} jour${next.days > 1 ? 's' : ''}`;
    countdown.hidden = false;
  }

  // Légère inclinaison 3D de la carte qui suit la souris.
  if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
  const visual = card.parentElement;
  visual.addEventListener('pointermove', (event) => {
    const rect = visual.getBoundingClientRect();
    card.style.setProperty('--ry', `${((event.clientX - rect.left) / rect.width - 0.5) * 16}deg`);
    card.style.setProperty('--rx', `${((event.clientY - rect.top) / rect.height - 0.5) * -16}deg`);
  });
  visual.addEventListener('pointerleave', () => {
    card.style.removeProperty('--rx');
    card.style.removeProperty('--ry');
  });
}
