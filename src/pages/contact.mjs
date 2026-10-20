import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { hairSalonSchema } from '../components/layout.mjs';
import { pageHero, visit, kicker, displayTitle, actionLinks, social } from '../components/blocks.mjs';

export const route = 'contact/';

export default function contact(ctx) {
  const body = html`
    ${pageHero(ctx, {
      kicker: 'Salon de coiffure à Aubière',
      lines: ['Contact', '& accès'],
      lead: `${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}, à 3,7 km de Clermont-Ferrand. Le salon vous reçoit du lundi au samedi, sur rendez-vous.`,
      book: '',
      bookLabel: 'Réserver',
      secondary: { route: 'tarifs/', label: 'Voir les tarifs' },
    })}

    ${visit(ctx, { kickerText: 'Plan & horaires', map: true })}

    <section class="section contact" aria-labelledby="contact-title">
      <div class="contact__grid">
        <div class="contact__intro">
          ${kicker('Une question ?')}
          ${displayTitle(['Écrire', 'au salon.'], { id: 'contact-title' })}
          <p>Une question sur une prestation, une carte cadeau ou un projet couleur ? Laissez un message : Sandy vous répond dès que possible.</p>
          ${actionLinks()}
        </div>

        <form class="contact__form" data-contact-form novalidate>
          <div class="field">
            <label for="ct-name">Prénom</label>
            <input id="ct-name" class="input" name="prenom" type="text" autocomplete="given-name" required aria-describedby="ct-name-error">
            <p id="ct-name-error" class="field__error" data-error-for="prenom" hidden></p>
          </div>
          <div class="field">
            <label for="ct-contact">Téléphone ou e-mail</label>
            <input id="ct-contact" class="input" name="contact" type="text" autocomplete="email" data-validate="phone-or-email" required aria-describedby="ct-contact-error">
            <p id="ct-contact-error" class="field__error" data-error-for="contact" hidden></p>
          </div>
          <div class="field">
            <label for="ct-subject">Sujet</label>
            <select id="ct-subject" class="input" name="sujet">
              ${['Une prestation', 'Un balayage ou une couleur', 'Une carte cadeau', 'Autre chose'].map((option) => html`<option>${option}</option>`)}
            </select>
          </div>
          <div class="field">
            <label for="ct-message">Votre message</label>
            <textarea id="ct-message" class="input" name="message" rows="5" required aria-describedby="ct-message-error"></textarea>
            <p id="ct-message-error" class="field__error" data-error-for="message" hidden></p>
          </div>
          <p class="visually-hidden" aria-hidden="true"><label>Ne pas remplir <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
          <button class="btn btn--solid btn--block" type="submit">Envoyer le message</button>
          <p class="form-note">Vos coordonnées servent uniquement à vous répondre. <a href="${ctx.rel('confidentialite/')}">Données personnelles</a></p>
        </form>

        <div class="contact__done" data-contact-done hidden tabindex="-1">
          <p class="display contact__done-title"><span class="line">Message</span> <span class="line">reçu.</span></p>
          <p data-contact-done-message></p>
        </div>
      </div>
    </section>

    <section class="section zone" aria-labelledby="zone-title">
      ${kicker('Autour du salon')}
      <h2 id="zone-title" class="zone__title">Aubière et les communes voisines</h2>
      <p>Le salon se trouve à Aubière, près du campus des Cézeaux, et reçoit aussi les clientes et clients des communes voisines :</p>
      <ul class="zone__list">
        ${salon.areaServed.filter((city) => city !== salon.address.city).map((city) => html`<li>${city}</li>`)}
      </ul>
    </section>

    ${social()}`;

  return {
    title: 'Contact et accès : salon de coiffure à Aubière | Un Brun d’Hair',
    description: `Un Brun d’Hair, ${salon.address.street}, ${salon.address.postalCode} ${salon.address.city} : plan, itinéraire, horaires, téléphone ${salon.phone.display} et réservation en ligne.`,
    breadcrumb: [{ label: 'Contact', route }],
    schema: [hairSalonSchema()],
    body,
  };
}
