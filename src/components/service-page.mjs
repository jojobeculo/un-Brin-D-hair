// Modèle commun aux pages de prestations : en-tête, présentation, tarifs, réalisations, avis, FAQ, réservation.
import { html } from '../lib/html.mjs';
import { reviewsFor } from '../data/reviews.mjs';
import { salon } from '../data/salon.mjs';
import { serviceSchema } from './layout.mjs';
import { icon } from './icons.mjs';
import { pageHero, kicker, displayTitle, priceCategory, gallery, quotes, faq, faqSchema, ctaBand } from './blocks.mjs';

export function servicePage(ctx, page) {
  const reviews = reviewsFor(page.reviewsTag);
  const body = html`
    ${pageHero(ctx, { kicker: page.kicker, lines: page.lines, lead: page.lead, book: page.book, bookLabel: page.bookLabel, secondary: { route: 'tarifs/', label: 'Tous les tarifs' } })}

    <section class="section detail" aria-labelledby="detail-title">
      <header class="section__head">
        ${kicker(page.detail.kicker)}
        ${displayTitle(page.detail.lines, { id: 'detail-title' })}
      </header>
      <div class="detail__body">
        ${page.detail.paragraphs.map((paragraph) => html`<p data-reveal>${paragraph}</p>`)}
        ${page.detail.extra || ''}
      </div>
    </section>

    <section class="section carte" aria-labelledby="prices-title">
      <header class="section__head">
        ${kicker('Tarifs TTC')}
        ${displayTitle(page.pricesLines || ['Les', 'tarifs.'], { id: 'prices-title' })}
      </header>
      <div class="carte__list">
        ${page.categories.map((id) => priceCategory(ctx, id))}
      </div>
    </section>

    ${page.gallery ? gallery(ctx, page.gallery, { lines: ['Avant', '/ après.'], more: false, allLink: true }) : ''}

    ${reviews.length ? html`<section class="section avis avis--compact" aria-labelledby="reviews-title">
      <header class="section__head">
        ${kicker('Avis clients')}
        ${displayTitle(['Ce qu’on', 'en dit.'], { id: 'reviews-title' })}
      </header>
      ${quotes(reviews)}
      <p class="avis__more"><a class="link-arrow" href="${ctx.rel('avis/')}">Tous les avis : ${salon.rating.value} sur 5 ${icon('arrow-right')}</a></p>
    </section>` : ''}

    ${faq(page.faq)}
    ${ctaBand({ lines: page.cta.lines, text: page.cta.text, book: page.book, label: page.bookLabel })}`;

  return {
    title: page.title,
    description: page.description,
    breadcrumb: [{ label: page.crumb, route: page.route }],
    schema: [serviceSchema(ctx, { name: page.schemaName, description: page.description, route: page.route, categories: page.categories.filter((id) => id !== 'options') }), faqSchema(page.faq)],
    body,
  };
}
