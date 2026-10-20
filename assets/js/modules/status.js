import { readSalonData } from '../lib/data.js';
import { parseHours, openStatus, salonNow, isOpenWeek } from '../lib/hours.js';

// « Ouvert · jusqu’à 19 h » en direct, la ligne du jour dans le tableau des horaires,
// et la semaine en cours pour le lundi et le samedi (une semaine sur deux).
export function initStatus() {
  const data = readSalonData();
  const hours = parseHours(data.hours);
  if (!hours.size) return;
  const reference = data.alternateOpenWeek;
  const labels = document.querySelectorAll('[data-open-status]');
  const rows = document.querySelectorAll('[data-hours] [data-day]');
  const week = document.querySelectorAll('[data-alt-week]');

  const update = () => {
    const now = salonNow();
    const { state, label } = openStatus(hours, now, reference);
    const short = { open: 'Ouvert', closed: 'Fermé', maybe: 'Horaires' }[state];
    labels.forEach((element) => {
      (element.querySelector('[data-status-label]') || element).textContent = label;
      const compact = element.querySelector('[data-status-short]');
      if (compact) compact.textContent = short;
      element.dataset.state = state;
    });
    rows.forEach((row) => row.classList.toggle('is-today', Number(row.dataset.day) === now.weekday));
    const open = isOpenWeek(now.date, reference);
    if (open !== null) {
      const text = open ? 'Cette semaine, le salon ouvre lundi et samedi.' : 'Cette semaine, le salon est fermé lundi et samedi.';
      week.forEach((element) => {
        element.textContent = text;
      });
    }
  };

  update();
  setInterval(update, 60_000);
}
