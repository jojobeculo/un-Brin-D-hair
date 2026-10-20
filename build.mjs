// Génère les pages HTML du site à partir de src/ : `node build.mjs`.
// Aucune dépendance : Node 18 ou plus suffit.
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { salon } from './src/data/salon.mjs';
import { layout } from './src/components/layout.mjs';
import { pages } from './src/pages/index.mjs';
import { products } from './src/data/products.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// Liens relatifs : le site fonctionne à la racine d’un domaine comme dans un sous-dossier (GitHub Pages).
// La page 404 s’affiche à n’importe quelle adresse : ses liens partent de la racine du site.
function context(route) {
  const depth = route.endsWith('/') ? route.split('/').length - 1 : 0;
  const prefix = route === '404.html' ? new URL(salon.siteUrl).pathname : '../'.repeat(depth);
  return {
    route,
    rel: (target) => prefix + target || './',
    asset: (path) => prefix + path,
    abs: (target) => new URL(target, salon.siteUrl).href,
  };
}

const outputFile = (route) => (route.endsWith('.html') ? route : `${route}index.html`);

// Anciennes adresses (avant la refonte) : supprimées pour ne pas laisser de pages en double.
for (const old of ['salon', 'galerie', 'coiffeur-femme-aubiere', 'coiffeur-homme-aubiere', 'soins-capillaires-aubiere']) {
  await rm(join(ROOT, old), { recursive: true, force: true });
}

const indexed = [];
for (const { route, render } of pages) {
  const ctx = context(route);
  const page = { route, ...render(ctx) };
  const file = join(ROOT, outputFile(route));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, String(layout(page, ctx)));
  if (!page.noindex) indexed.push(route);
  console.log(`✓ ${outputFile(route)}`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexed.map((route) => `  <url><loc>${new URL(route, salon.siteUrl).href}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
await writeFile(join(ROOT, 'sitemap.xml'), sitemap);
await writeFile(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', salon.siteUrl).href}\n`);
console.log(`✓ sitemap.xml (${indexed.length} pages), robots.txt`);

// Catalogue de la fonction de paiement (stripe/) : les prix sont fixés côté serveur, en centimes.
const stripeCatalog = Object.fromEntries(products.map(({ id, name, size, price }) => [id, { name: `${name} (${size})`, amount: Math.round(price * 100) }]));
await writeFile(join(ROOT, 'stripe', 'catalog.js'), `// Généré par build.mjs à partir de src/data/products.mjs : ne pas modifier.\nexport default ${JSON.stringify(stripeCatalog, null, 2)};\n`);
console.log(`✓ stripe/catalog.js (${products.length} produits)`);
