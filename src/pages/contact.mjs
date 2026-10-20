import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { hairSalonSchema } from '../components/layout.mjs';
import { pageHero, visit, kicker, flash, contactActions, bookButton } from '../components/blocks.mjs';

export const route = 'contact/';

export default function contact(ctx) {
  const body = html`
    ${pageHero(ctx, {
      kickerText: 'Salon de coiffure à Aubière',
      title: html`Contact <em>&amp; accès</em>`,
      lead: `${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}, à 3,7 km de Clermont-Ferrand. Le salon vous reçoit sur rendez-vous, du lundi au samedi selon les semaines.`,
      actions: html`${bookButton()} ${contactActions()}`,
    })}

    ${visit(ctx, { title: html`Plan, horaires <em>et accès</em>`, kickerText: 'Venir au salon' })}

    <div class="band band--creme">
      <section id="ecrire" class="section" aria-labelledby="contact-title">
        <div class="contact-grid">
          <div>
            ${kicker('Une question ?')}
            <h2 id="contact-title" data-split>Écrire <em>au salon</em></h2>
            <p class="lead" style="margin-top:1.25rem">Une question sur une prestation, une carte cadeau, une commande ou un projet couleur ? Laissez un message : Sandy vous répond dès que possible.</p>
            <p style="margin-top:1.25rem">Pour réserver, le plus rapide reste Planity : les disponibilités sont en temps réel.</p>
          </div>

          <div>
            <form class="form" data-contact-form novalidate>
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
                  ${['Une prestation', 'Un balayage ou une couleur', 'Une commande de la boutique', 'Une carte cadeau', 'Autre chose'].map((option) => html`<option>${option}</option>`)}
                </select>
              </div>
              <div class="field">
                <label for="ct-message">Votre message</label>
                <textarea id="ct-message" class="input" name="message" rows="5" required aria-describedby="ct-message-error"></textarea>
                <p id="ct-message-error" class="field__error" data-error-for="message" hidden></p>
              </div>
              <p class="trap" aria-hidden="true"><label>Ne pas remplir <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
              <button class="btn btn--primary btn--block" type="submit">Envoyer le message</button>
              <p class="form-note">Vos coordonnées servent uniquement à vous répondre. <a href="${ctx.rel('confidentialite/')}">Données personnelles</a></p>
            </form>
            <div class="done" data-contact-done hidden tabindex="-1">
              <p class="done__title">Message reçu.</p>
              <p data-contact-done-message></p>
            </div>
          </div>
        </div>
      </section>
    </div>

    ${flash(ctx)}

    <section class="section" aria-labelledby="zone-title" style="padding-top:0">
      ${kicker('Autour du salon')}
      <h2 id="zone-title" class="h3">Aubière et les communes voisines</h2>
      <p style="margin-top:1rem">Le salon se trouve à Aubière, près du campus des Cézeaux, et reçoit aussi les clientes et clients des communes voisines :</p>
      <ul class="zone">
        ${salon.areaServed.filter((city) => city !== salon.address.city).map((city) => html`<li>${city}</li>`)}
      </ul>
    </section>`;

  return {
    title: 'Contact et accès : coiffeur à Aubière | Un Brun d’Hair',
    description: `Un Brun d’Hair, ${salon.address.street}, ${salon.address.postalCode} ${salon.address.city} : plan, itinéraire, bus, stationnement, horaires et téléphone ${salon.phone.display}.`,
    breadcrumb: [{ label: 'Contact', route }],
    schema: [hairSalonSchema()],
    body,
  };
}
