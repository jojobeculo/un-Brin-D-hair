import { html } from '../lib/html.mjs';
import { pageHero, shots, SHOTS, instagram, cta, related, bookButton } from '../components/blocks.mjs';

export const route = 'realisations/';

export default function realisations(ctx) {
  const body = html`
    ${pageHero(ctx, {
      kickerText: 'Réalisations',
      title: html`Coupes, couleurs <em>et balayages</em>`,
      lead: 'Des transformations pensées pour chaque chevelure, jamais en série : un résultat naturel, lumineux et facile à porter au quotidien.',
      actions: html`${bookButton()}`,
    })}

    <section class="section" aria-label="Galerie" style="padding-top:0">
      ${shots(ctx, SHOTS)}
      <p class="note">Photos d’illustration : elles seront remplacées par les réalisations du salon.</p>
    </section>

    ${instagram(ctx)}
    ${related(ctx, ['balayage-aubiere/', 'coupe-femme-aubiere/', 'coloration-aubiere/', 'avis/'])}
    ${cta({ title: html`À vous <em>de briller</em>`, text: 'Balayage, gloss ou nouvelle coupe : réservez la transformation qui vous ressemble.' })}`;

  return {
    title: 'Réalisations : coupes, couleurs et balayages | Un Brun d’Hair, Aubière',
    description: 'Les réalisations du salon Un Brun d’Hair à Aubière : balayages lumineux, colorations, coupes et brushings, avec les produits Davines.',
    breadcrumb: [{ label: 'Réalisations', route }],
    body,
  };
}
