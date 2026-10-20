// Récupère les 6 dernières publications Instagram du salon pour la galerie du site.
// Usage : node tools/instagram.mjs, puis node build.mjs.
// Le flux vient d’un service qui relie le compte Instagram (Behold.so ou équivalent) :
// son adresse JSON se met dans `instagramFeed` de src/data/salon.mjs.
import { writeFile } from 'node:fs/promises';
import { salon } from '../src/data/salon.mjs';

if (!salon.instagramFeed) {
  console.error('Renseignez instagramFeed dans src/data/salon.mjs (adresse du flux JSON).');
  process.exit(1);
}

const response = await fetch(salon.instagramFeed, { signal: AbortSignal.timeout(15_000) });
if (!response.ok) throw new Error(`Flux Instagram indisponible (${response.status})`);
const feed = await response.json();
const posts = (Array.isArray(feed) ? feed : feed.posts || [])
  .filter((post) => post.permalink && (post.sizes?.medium?.mediaUrl || post.thumbnailUrl || post.mediaUrl))
  .slice(0, 6)
  .map((post) => ({
    permalink: post.permalink,
    image: post.sizes?.medium?.mediaUrl || post.thumbnailUrl || post.mediaUrl,
    caption: String(post.prunedCaption || post.caption || '').split('\n')[0].slice(0, 120),
  }));

await writeFile(new URL('../src/data/instagram.json', import.meta.url), `${JSON.stringify(posts, null, 2)}\n`);
console.log(`✓ src/data/instagram.json (${posts.length} publications)`);
