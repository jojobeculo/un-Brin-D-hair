const LEAFLET = {
  css: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css',
  cssIntegrity: 'sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jFvuavGOndn6pjVqS6ny56CAt3nsEVT4H',
  js: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js',
  jsIntegrity: 'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH',
};

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  const style = Object.assign(document.createElement('link'), {
    rel: 'stylesheet',
    href: LEAFLET.css,
    integrity: LEAFLET.cssIntegrity,
    crossOrigin: 'anonymous',
  });
  document.head.append(style);
  return new Promise((resolve, reject) => {
    const script = Object.assign(document.createElement('script'), {
      src: LEAFLET.js,
      integrity: LEAFLET.jsIntegrity,
      crossOrigin: 'anonymous',
      onload: resolve,
      onerror: reject,
    });
    document.head.append(script);
  });
}

function draw(container) {
  const { L } = window;
  const center = [Number(container.dataset.lat), Number(container.dataset.lng)];
  // Au doigt, un glissement fait défiler la page ; la carte se déplace à deux doigts.
  const touch = matchMedia('(pointer: coarse)').matches;
  const map = L.map(container, { center, zoom: 16, scrollWheelZoom: false, dragging: !touch });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const icon = L.divIcon({
    className: 'map-pin',
    html: '<svg class="icon" aria-hidden="true"><use href="#i-bolt"/></svg>',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -24],
  });
  L.marker(center, { icon, title: 'Un Brun d’Hair', alt: 'Un Brun d’Hair' })
    .addTo(map)
    .bindPopup('<strong>Un Brun d’Hair</strong><br>4 bis rue Champvoisin, 63170 Aubière');
  container.classList.add('is-loaded');
}

// Plan interactif chargé seulement à l’approche de la section, pour ne pas ralentir la page.
export function initMap() {
  const container = document.querySelector('[data-map]');
  if (!container) return;
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    // En cas d’échec, le lien « Voir le plan » reste affiché.
    loadLeaflet().then(() => draw(container)).catch(() => {});
  }, { rootMargin: '400px' });
  observer.observe(container);
}
