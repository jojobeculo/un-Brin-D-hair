// Formats partagés par le site (navigateur) et le générateur de pages (Node).
const NBSP = String.fromCharCode(160);

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}${NBSP}min`;
  return rest ? `${hours}${NBSP}h${NBSP}${String(rest).padStart(2, '0')}` : `${hours}${NBSP}h`;
}

export function formatPrice(euros, from) {
  return `${from ? `dès${NBSP}` : ''}${euros}${NBSP}€`;
}
