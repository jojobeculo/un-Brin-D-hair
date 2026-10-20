// Horaires du salon : statut « ouvert / fermé » et semaines alternées (lundi et samedi une semaine sur deux).
// Partagé par le site et les tests (Node).
const TIME_ZONE = 'Europe/Paris';
const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const DAY = 86_400_000;

function toMinutes(hhmm) {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return hours * 60 + minutes;
}

// 540 -> « 9 h », 1110 -> « 18 h 30 » (usage typographique français).
export function formatTime(minutes) {
  const NBSP = String.fromCharCode(160);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}${NBSP}h${NBSP}${String(rest).padStart(2, '0')}` : `${hours}${NBSP}h`;
}

// Horaires de src/data/salon.mjs : jour (0 = dimanche) -> { open, close, alternate } en minutes.
export function parseHours(list = []) {
  const hours = new Map();
  list.forEach(({ day, open, close, alternate }) => {
    if (open && close) hours.set(day, { open: toMinutes(open), close: toMinutes(close), alternate: Boolean(alternate) });
  });
  return hours;
}

// Date et heure du salon (Europe/Paris), quel que soit le fuseau du visiteur.
export function salonNow(date = new Date()) {
  const parts = {};
  new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
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
    date: Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)),
    weekday: WEEKDAYS[parts.weekday],
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

// Semaine ouverte le lundi et le samedi ? true, false, ou null si la semaine de référence n’est pas connue.
// `reference` : date AAAA-MM-JJ d’un lundi d’une semaine ouverte.
export function isOpenWeek(date, reference) {
  if (!reference) return null;
  const monday = (time) => time - ((new Date(time).getUTCDay() + 6) % 7) * DAY;
  const weeks = Math.round((monday(date) - monday(Date.parse(`${reference}T00:00:00Z`))) / (7 * DAY));
  return weeks % 2 === 0;
}

// 'open', 'closed' ou 'maybe' (jour alterné sans semaine de référence) pour un jour donné.
function dayState(hours, weekday, date, reference) {
  const entry = hours.get(weekday);
  if (!entry) return 'closed';
  if (!entry.alternate) return 'open';
  const open = isOpenWeek(date, reference);
  if (open === null) return 'maybe';
  return open ? 'open' : 'closed';
}

// Statut affiché dans l’en-tête : { state: 'open' | 'closed' | 'maybe', label }.
export function openStatus(hours, now = salonNow(), reference = '') {
  const today = hours.get(now.weekday);
  const todayState = dayState(hours, now.weekday, now.date, reference);
  if (todayState === 'open' && now.minutes >= today.open && now.minutes < today.close) {
    return { state: 'open', label: `Ouvert · jusqu’à ${formatTime(today.close)}` };
  }
  if (todayState === 'maybe' && now.minutes >= today.open && now.minutes < today.close) {
    const name = DAY_NAMES[now.weekday];
    return { state: 'maybe', label: `${name.charAt(0).toUpperCase()}${name.slice(1)} : ouvert une semaine sur deux` };
  }
  if (todayState === 'open' && now.minutes < today.open) {
    return { state: 'closed', label: `Fermé · ouvre à ${formatTime(today.open)}` };
  }
  let maybe = todayState === 'maybe' && now.minutes < today.open ? 'aujourd’hui' : '';
  for (let offset = 1; offset <= 14; offset += 1) {
    const weekday = (now.weekday + offset) % 7;
    const state = dayState(hours, weekday, now.date + offset * DAY, reference);
    const when = offset === 1 ? 'demain' : DAY_NAMES[weekday];
    if (state === 'maybe' && !maybe) maybe = when;
    if (state === 'open') {
      if (maybe) return { state: 'closed', label: `Fermé · réouverture ${maybe} ou ${when}` };
      return { state: 'closed', label: `Fermé · ouvre ${when} à ${formatTime(hours.get(weekday).open)}` };
    }
  }
  return { state: 'closed', label: 'Fermé' };
}
