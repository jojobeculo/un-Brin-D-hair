import { html } from '../lib/html.mjs';
import { categories, priceOf, startingPrice } from '../data/services.mjs';
import { pageHero, lengthsLegend, priceCategory, cta, related, bookButton } from '../components/blocks.mjs';

export const route = 'tarifs/';

export default function tarifs(ctx) {
  const body = html`
    ${pageHero(ctx, {
      kickerText: 'La carte',
      title: html`Prestations <em>&amp; tarifs</em>`,
      lead: 'Toutes les prestations commencent par l’écoute. Tarifs TTC ; les prix « dès » s’ajustent à votre chevelure et à votre projet. Paiement par carte bancaire ou en espèces.',
      actions: html`${bookButton()} <a class="btn" href="${ctx.rel('conseil-coupe/')}">Quelle coupe pour moi ?</a>`,
    })}

    <section class="section" aria-label="Carte des prestations" style="padding-top:0">
      <div style="display:grid;gap:1.5rem;margin-bottom:clamp(3rem,6vw,5rem)">
        <p>Pour choisir la bonne ligne, un repère simple :</p>
        ${lengthsLegend()}
        <nav class="chips" aria-label="Catégories de la carte">
          ${categories.map((item) => html`<a class="chip" href="#${item.anchor || `cat-${item.id}`}">${item.label}</a>`)}
        </nav>
      </div>
      <div class="carte">
        ${categories.map((item) => priceCategory(ctx, item.id, { headingTag: 'h2', pageLink: true }))}
      </div>
    </section>

    ${related(ctx, ['coupe-femme-aubiere/', 'balayage-aubiere/', 'coloration-aubiere/', 'carte-cadeau/'])}
    ${cta({ title: html`Votre choix <em>est fait</em> ?`, text: 'Réservez sur Planity : la prestation, le créneau, et c’est confirmé.' })}`;

  return {
    title: 'Tarifs du salon de coiffure à Aubière | Un Brun d’Hair',
    description: `Tarifs à Aubière : coupe femme ${startingPrice('femme', 0)}, brushing ${startingPrice('femme', 1)}, coloration ${startingPrice('couleur')}, balayage ${startingPrice('balayage')}, coupe homme ${priceOf('homme-forfait')}, enfant ${startingPrice('enfant')}.`,
    breadcrumb: [{ label: 'Tarifs', route }],
    body,
  };
}
