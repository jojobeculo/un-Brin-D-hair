import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { kicker, displayTitle } from '../components/blocks.mjs';

const todo = (value, hint) => value || html`<mark>[à compléter${hint ? ` : ${hint}` : ''}]</mark>`;

export function mentions(ctx) {
  const { legal } = salon;
  const body = html`
    <section class="section legal" aria-labelledby="legal-title">
      ${kicker('Un Brun d’Hair · Aubière')}
      ${displayTitle(['Mentions', 'légales.'], { tag: 'h1', id: 'legal-title', className: 'legal__title', reveal: false })}
      <div class="prose">
        <h2>Éditeur du site</h2>
        <p><strong>${legal.company}</strong>, ${legal.form} au capital de ${todo(legal.capital)} €.</p>
        <ul>
          <li>Siège social : ${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}</li>
          <li>SIREN : ${legal.siren} — SIRET du siège : ${legal.siret}</li>
          <li>Immatriculation : ${todo(legal.registration, 'RCS ou registre des métiers')}</li>
          <li>Code APE : ${legal.naf}</li>
          <li>TVA intracommunautaire : ${legal.vat}</li>
          <li>Téléphone : <a href="tel:${salon.phone.tel}">${salon.phone.display}</a></li>
          <li>E-mail : ${salon.email ? html`<a href="mailto:${salon.email}">${salon.email}</a>` : todo(null)}</li>
        </ul>

        <h2>Directrice de la publication</h2>
        <p>${legal.director}.</p>

        <h2>Hébergement</h2>
        <p>${todo(legal.host, 'nom de l’hébergeur, adresse et téléphone')}</p>

        <h2>Propriété intellectuelle</h2>
        <p>Les textes, la mise en page et les éléments graphiques de ce site appartiennent à Un Brun d’Hair ou font l’objet d’une licence. Toute reproduction sans autorisation est interdite. Les avis clients cités proviennent de la page publique du salon sur Planity.</p>

        <h2>Données personnelles</h2>
        <p>Le traitement des données envoyées depuis ce site est décrit dans la <a href="${ctx.rel('confidentialite/')}">politique de confidentialité</a>.</p>

        <h2>Crédits</h2>
        <ul>
          <li>Typographies : Archivo (SIL Open Font License 1.1) et Clash Grotesk (Indian Type Foundry, ITF Free Font License).</li>
          <li>Carte : © les contributeurs d’OpenStreetMap, bibliothèque Leaflet.</li>
          <li>Produits : le salon travaille avec la marque Davines.</li>
        </ul>
      </div>
    </section>`;
  return {
    title: 'Mentions légales | Un Brun d’Hair, salon de coiffure à Aubière',
    description: 'Mentions légales du site Un Brun d’Hair, salon de coiffure à Aubière : éditeur, directrice de la publication, hébergement et crédits.',
    breadcrumb: [{ label: 'Mentions légales', route: 'mentions-legales/' }],
    noindex: true,
    body,
  };
}

export function confidentialite() {
  const body = html`
    <section class="section legal" aria-labelledby="legal-title">
      ${kicker('Un Brun d’Hair · Aubière')}
      ${displayTitle(['Données', 'personnelles.'], { tag: 'h1', id: 'legal-title', className: 'legal__title', reveal: false })}
      <div class="prose">
        <h2>Responsable du traitement</h2>
        <p>Un Brun d’Hair, ${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}, est responsable du traitement des données envoyées depuis ce site. Ces données servent uniquement à répondre à votre demande ; elles ne sont ni vendues, ni cédées.</p>

        <h2>Données collectées</h2>
        <ul>
          <li><strong>Demande de rendez-vous</strong> : prénom, téléphone, message et prestation souhaitée. Usage : vous recontacter pour confirmer le créneau. Conservation : le temps de traiter la demande, puis au plus 12 mois.</li>
          <li><strong>Message depuis la page Contact</strong> : prénom, téléphone ou e-mail, sujet et message. Usage : vous répondre. Conservation : au plus 12 mois.</li>
          <li><strong>Alerte dernière minute</strong> : prénom, numéro de mobile ou e-mail, préférences de jours et de prestation. Usage : vous prévenir quand un créneau se libère, avec votre consentement. Conservation : jusqu’à votre désinscription, au plus 3 ans après le dernier contact.</li>
          <li><strong>Réservation sur Planity</strong> : les données saisies sur Planity sont traitées par Planity, selon sa propre politique de confidentialité.</li>
        </ul>
        <p>Selon la configuration du site, votre demande part par un service d’envoi de formulaires, par votre application SMS ou e-mail, ou par la messagerie Instagram.</p>

        <h2>Vos droits</h2>
        <p>Vous pouvez accéder à vos données, les rectifier, les effacer, vous opposer à leur traitement ou demander leur portabilité. Pour cela, contactez le salon au <a href="tel:${salon.phone.tel}">${salon.phone.display}</a> ou directement au salon. Vous pouvez aussi déposer une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.</p>

        <h2>Cookies et services tiers</h2>
        <p>Ce site ne dépose aucun cookie de mesure d’audience ni de publicité. Pour afficher les pages, votre navigateur charge des contenus chez des services tiers, qui reçoivent alors votre adresse IP : la police Clash Grotesk (Fontshare), la bibliothèque Leaflet (jsDelivr) et les fonds de carte (OpenStreetMap, page Contact). Les liens vers Planity, Instagram, TikTok, WhatsApp, Google Maps, Waze et Plans mènent vers des services soumis à leurs propres règles.</p>
      </div>
    </section>`;
  return {
    title: 'Politique de confidentialité | Un Brun d’Hair',
    description: 'Comment Un Brun d’Hair, salon de coiffure à Aubière, traite les données envoyées depuis son site : demandes de rendez-vous, messages et alerte dernière minute.',
    breadcrumb: [{ label: 'Confidentialité', route: 'confidentialite/' }],
    noindex: true,
    body,
  };
}

export function notFound(ctx) {
  const body = html`
    <section class="section legal" aria-labelledby="legal-title">
      ${kicker('Erreur 404')}
      ${displayTitle(['Page', 'introuvable.'], { tag: 'h1', id: 'legal-title', className: 'legal__title', reveal: false })}
      <div class="prose">
        <p class="lead">Cette page n’existe pas ou a changé d’adresse.</p>
        <ul class="action-links">
          <li><a class="link-arrow" href="${ctx.rel('')}">Retour à l’accueil</a></li>
          <li><a class="link-arrow" href="${ctx.rel('tarifs/')}">Voir les tarifs</a></li>
          <li><a class="link-arrow" href="${ctx.rel('contact/')}">Contact &amp; accès</a></li>
        </ul>
      </div>
    </section>`;
  return {
    title: 'Page introuvable | Un Brun d’Hair',
    description: 'Cette page n’existe pas. Retrouvez le salon de coiffure Un Brun d’Hair à Aubière.',
    noindex: true,
    body,
  };
}
