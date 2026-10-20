// Gabarit des pages de prestations : bénéfices, déroulé, tarifs, photos, avis, produits, FAQ et liens internes.
import { html } from '../lib/html.mjs';
import { reviewsFor } from '../data/reviews.mjs';
import { serviceSchema } from './layout.mjs';
import { icon } from './icons.mjs';
import {
  pageHero, kicker, priceCategory, shots, SHOTS, beforeAfter, quotes, faq, faqSchema, cta, related, productMini, bookButton, phoneLink,
} from './blocks.mjs';

export function servicePage(ctx, page) {
  const reviews = reviewsFor(page.reviewsTag);
  const pictures = (page.shots || []).map((name) => SHOTS.find((shot) => shot.image === name));
  const body = html`
    ${pageHero(ctx, {
      kickerText: page.kicker,
      title: page.h1,
      lead: page.lead,
      image: page.image,
      alt: page.alt,
      facts: page.facts,
      actions: html`${bookButton(page.bookLabel || 'Je réserve')} ${phoneLink('btn', 'Appeler')}`,
    })}

    <section class="section" aria-labelledby="benefits-title">
      <header class="section__head">
        ${kicker('Les bénéfices')}
        <h2 id="benefits-title" data-split>${page.benefitsTitle}</h2>
      </header>
      <ul class="${page.benefits.length === 4 ? 'benefits benefits--4' : 'benefits benefits--3'}">
        ${page.benefits.map((item, index) => html`<li data-reveal style="--stagger:${index}">
          ${icon(item.icon)}
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </li>`)}
      </ul>
    </section>

    <div class="band band--creme">
      <section class="section" aria-labelledby="detail-title">
        <div class="split-layout split-layout--sticky">
          <div>
            ${kicker(page.detail.kicker)}
            <h2 id="detail-title" data-split>${page.detail.title}</h2>
            ${page.detail.paragraphs.map((text) => html`<p class="lead" style="margin-top:1.25rem">${text}</p>`)}
          </div>
          <div>
            <h3 class="visit__label">Comment ça se passe</h3>
            <ol class="steps">
              ${page.steps.map((step, index) => html`<li data-reveal style="--stagger:${index}"><strong>${step.title}</strong><span>${step.text}</span></li>`)}
            </ol>
            ${page.detail.extra || ''}
          </div>
        </div>
      </section>
    </div>

    <section id="tarifs" class="section" aria-labelledby="prices-title">
      <header class="section__head">
        ${kicker('Tarifs')}
        <h2 id="prices-title" data-split>Les <em>tarifs</em></h2>
        <p>Tarifs TTC. Les prix « dès » s’ajustent à la longueur, à l’épaisseur de vos cheveux et à votre projet. Paiement par carte bancaire ou en espèces.</p>
      </header>
      <div class="carte">
        ${page.categories.map((id) => priceCategory(ctx, id))}
      </div>
    </section>

    ${page.compares ? beforeAfter(ctx, page.compares) : ''}

    ${pictures.length ? html`<section class="section" aria-labelledby="pictures-title">
      <header class="section__head">
        ${kicker('En images')}
        <h2 id="pictures-title" data-split>${page.picturesTitle || html`Le <em>résultat</em>`}</h2>
      </header>
      ${shots(ctx, pictures)}
      <p class="note">Photos d’illustration, en attendant les réalisations du salon.</p>
    </section>` : ''}

    ${reviews.length ? html`<div class="band band--creme">
      <section class="section" aria-labelledby="reviews-title">
        <header class="section__head">
          ${kicker('Avis clients')}
          <h2 id="reviews-title" data-split>Elles et ils <em>en parlent</em></h2>
        </header>
        ${quotes(reviews)}
      </section>
    </div>` : ''}

    ${page.products ? html`<section class="section" aria-labelledby="products-title">
      <header class="section__head section__head--split">
        ${kicker('À la maison')}
        <h2 id="products-title" data-split>Prolonger le <em>résultat</em></h2>
        <p>Les soins Davines utilisés au salon, à réserver en click and collect et à retirer lors de votre rendez-vous.</p>
      </header>
      ${productMini(ctx, page.products)}
    </section>` : ''}

    ${faq(page.faq)}
    ${related(ctx, page.related)}
    ${cta(page.cta)}`;

  return {
    title: page.title,
    description: page.description,
    breadcrumb: [{ label: page.crumb, route: page.route }],
    schema: [serviceSchema(ctx, { name: page.schemaName, description: page.description, route: page.route, categories: page.categories }), faqSchema(page.faq)],
    body,
  };
}
