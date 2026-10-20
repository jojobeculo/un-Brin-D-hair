import { CONFIG } from '../config.js';

const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const SLOT_STEP = 30;
const MIN_NOTICE = 60;

function toMinutes(hhmm) {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`;
}

// Horaires lus dans le tableau [data-hours] : jour (0 = dimanche) -> [ouverture, fermeture] en minutes.
export function readHours() {
  const hours = new Map();
  document.querySelectorAll('[data-hours] [data-day]').forEach((row) => {
    const { day, open, close } = row.dataset;
    if (open && close) hours.set(Number(day), [toMinutes(open), toMinutes(close)]);
  });
  return hours;
}

// Date et heure du salon (Europe/Paris), quel que soit le fuseau du visiteur.
export function salonNow(date = new Date()) {
  const parts = {};
  new Intl.DateTimeFormat('en-GB', {
    timeZone: CONFIG.timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date).forEach(({ type, value }) => {
    parts[type] = value;
  });
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    weekday: WEEKDAYS[parts.weekday],
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export function openStatus(hours, now = salonNow()) {
  const today = hours.get(now.weekday);
  if (today && now.minutes >= today[0] && now.minutes < today[1]) {
    return { open: true, label: `Ouvert · jusqu’à ${formatTime(today[1])}` };
  }
  if (today && now.minutes < today[0]) {
    return { open: false, label: `Fermé · ouvre à ${formatTime(today[0])}` };
  }
  for (let offset = 1; offset <= 7; offset += 1) {
    const weekday = (now.weekday + offset) % 7;
    const next = hours.get(weekday);
    if (next) {
      const when = offset === 1 ? 'demain' : DAY_NAMES[weekday];
      return { open: false, label: `Fermé · ouvre ${when} à ${formatTime(next[0])}` };
    }
  }
  return { open: false, label: 'Fermé' };
}

// Les `count` prochains jours d’ouverture, aujourd’hui compris. Dates à minuit UTC.
export function nextOpenDays(hours, count, now = salonNow()) {
  const days = [];
  for (let offset = 0; days.length < count && offset < count + 7; offset += 1) {
    const date = new Date(Date.UTC(now.year, now.month - 1, now.day + offset));
    const weekday = date.getUTCDay();
    if (hours.has(weekday)) days.push({ date, weekday, isToday: offset === 0 });
  }
  return days;
}

// Heures de début possibles pour une prestation de `duration` minutes, par pas de 30 minutes.
export function slotsFor(day, hours, duration, now = salonNow()) {
  const [open, close] = hours.get(day.weekday);
  const earliest = day.isToday ? Math.ceil((now.minutes + MIN_NOTICE) / SLOT_STEP) * SLOT_STEP : open;
  const slots = [];
  for (let start = Math.max(open, earliest); start + duration <= close; start += SLOT_STEP) {
    slots.push(start);
  }
  return slots;
}
