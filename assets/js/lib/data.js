let data;

// Horaires, carte des prestations et réglages des formulaires (src/data/salon.mjs),
// intégrés à chaque page par build.mjs (<script id="salon-data">).
export function readSalonData() {
  data ||= JSON.parse(document.getElementById('salon-data')?.textContent || '{}');
  return data;
}
