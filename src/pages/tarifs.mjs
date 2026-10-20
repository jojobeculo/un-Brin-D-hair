import { html } from '../lib/html.mjs';
import { categories, priceOf, startingPrice } from '../data/services.mjs';
import { pageHero, lengthsLegend, priceCategory, flash, ctaBand } from '../components/blocks.mjs';

export const route = 'tarifs/';

export default function tarifs(ctx) {
  const listed = categories.map((item) => item.id);
  const body = html`
    ${pageHero(ctx, {
      kicker: 'La carte',
      lines: ['Tarifs &', 'prestations.'],
      lead: 'Toutes les prestations commencent par l’écoute. Tarifs TTC ; les prix « dès » s’ajustent à votre chevelure et à votre projet. Paiement par carte bancaire ou en espèces.',
      book: '',
      bookLabel: 'Réserver',
      secondary: { route: 'diagnostic-capillaire-aubiere/', label: 'Le diagnostic' },
    })}

    <section class="section carte" aria-label="Carte des prestations">
      <div class="carte__intro" data-reveal>
        <p>Pour choisir la bonne ligne, un repère simple :</p>
        ${lengthsLegend()}
        <nav class="chips" aria-label="Catégories de la carte">
          ${categories.map((item) => html`<a class="chip" href="#${item.anchor || `cat-${item.id}`}">${item.label}</a>`)}
        </nav>
      </div>
      <div class="carte__list">
        ${listed.map((id, index) => priceCategory(ctx, id, { num: String(index + 1).padStart(2, '0'), headingTag: 'h2', pageLink: true }))}
      </div>
    </section>

    ${flash(ctx)}
    ${ctaBand({ lines: ['Votre choix', 'est fait ?'], text: 'Réservez en 3 clics : la prestation, les petits plus, puis le créneau.', book: '', label: 'Réserver' })}`;

  return {
    title: 'Tarifs du salon de coiffure à Aubière | Un Brun d’Hair',
    description: `Tarifs à Aubière : coupe femme ${startingPrice('femme', 0)}, brushing ${startingPrice('femme', 1)}, coloration ${startingPrice('couleur')}, balayage ${startingPrice('balayage')}, coupe homme ${priceOf('homme-forfait')}, enfant ${startingPrice('enfant')}.`,
    breadcrumb: [{ label: 'Tarifs', route }],
    body,
  };
}
