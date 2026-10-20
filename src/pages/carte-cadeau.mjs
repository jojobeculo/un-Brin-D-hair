import { html, raw } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { pageHero, kicker, faq, faqSchema, related, external } from '../components/blocks.mjs';
import { icon } from '../components/icons.mjs';
import { startingPrice } from '../data/services.mjs';
import { ribbonPaths, RIBBONS } from '../../assets/js/lib/ribbon.js';

export const route = 'carte-cadeau/';

const FAQ = [
  { q: 'Comment acheter une carte cadeau ?', a: 'En ligne sur Planity : ouvrez la page du salon et choisissez « Offrir ». Vous pouvez aussi l’acheter directement au salon, par carte bancaire ou en espèces.' },
  { q: 'Quel montant choisir ?', a: `Quelques repères : un brushing ${startingPrice('femme', 1)}, une coupe ${startingPrice('femme', 0)}, une couleur ${startingPrice('couleur')}, un balayage ${startingPrice('balayage')}.` },
  { q: 'Peut-on offrir un produit Davines ?', a: 'Oui : choisissez-le dans la boutique en click and collect, et retirez-le au salon.' },
];

export default function carteCadeau(ctx) {
  const lines = ribbonPaths(RIBBONS.hero.points, { ...RIBBONS.hero, spread: 60, strands: 7 });
  const body = html`
    ${pageHero(ctx, {
      kickerText: 'Offrir un moment',
      title: html`La carte <em>cadeau</em>`,
      lead: 'Une coupe, une couleur, un balayage ou un soin Davines : offrez un moment chez Un Brun d’Hair, pour un anniversaire, Noël, la fête des mères… ou juste comme ça.',
      actions: html`<a class="btn btn--primary" href="${salon.links.planity}"${external} data-magnetic data-cursor="Offrir">${icon('gift')} Offrir sur Planity</a> <a class="btn" href="${ctx.rel('boutique/')}">Offrir un produit</a>`,
    })}

    <section class="section" aria-labelledby="gift-title" style="padding-top:0">
      <div class="split-layout">
        <div class="giftcard" data-tilt data-reveal>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3">${lines.map((d) => raw(`<path d="${d}"/>`))}</g></svg>
          <p class="giftcard__label">Carte cadeau</p>
          <p class="giftcard__brand">Un Brun <em>d’Hair</em></p>
        </div>
        <div>
          ${kicker('Une idée de montant ?')}
          <h2 id="gift-title" data-split>Ce que <em>l’on peut offrir</em></h2>
          <ul class="ideas">
            <li><span>Un brushing</span> <strong>${startingPrice('femme', 1)}</strong></li>
            <li><span>Une coupe et un brushing</span> <strong>${startingPrice('femme', 0)}</strong></li>
            <li><span>Une couleur</span> <strong>${startingPrice('couleur')}</strong></li>
            <li><span>Un balayage</span> <strong>${startingPrice('balayage')}</strong></li>
          </ul>
          <p class="small">Achat en ligne sur Planity, ou au salon par carte bancaire ou en espèces.</p>
        </div>
      </div>
    </section>

    ${faq(FAQ)}
    ${related(ctx, ['tarifs/', 'boutique/', 'qui-suis-je/', 'contact/'])}`;

  return {
    title: 'Carte cadeau coiffure à Aubière | Un Brun d’Hair',
    description: 'Offrez un moment chez Un Brun d’Hair à Aubière : carte cadeau en ligne sur Planity ou au salon, pour une coupe, une couleur, un balayage ou un soin Davines.',
    breadcrumb: [{ label: 'Carte cadeau', route }],
    schema: [faqSchema(FAQ)],
    body,
  };
}
