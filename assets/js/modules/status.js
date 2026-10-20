import { readHours, openStatus, salonNow } from '../lib/hours.js';

// « Ouvert · jusqu’à 19:00 » en direct, et la ligne du jour surlignée dans le tableau des horaires.
export function initStatus() {
  const hours = readHours();
  if (!hours.size) return;
  const labels = document.querySelectorAll('[data-open-status]');
  const rows = document.querySelectorAll('[data-hours] [data-day]');

  const update = () => {
    const now = salonNow();
    const { open, label } = openStatus(hours, now);
    labels.forEach((element) => {
      element.textContent = label;
      element.dataset.state = open ? 'open' : 'closed';
    });
    rows.forEach((row) => row.classList.toggle('is-today', Number(row.dataset.day) === now.weekday));
  };

  update();
  setInterval(update, 60_000);
}
