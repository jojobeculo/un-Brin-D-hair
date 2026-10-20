import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { kicker } from '../components/blocks.mjs';

const todo = (value, hint) => value || html`<mark>[à compléter${hint ? ` : ${hint}` : ''}]</mark>`;

function legalPage(kickerText, title, content) {
  return html`
    <section class="section" aria-labelledby="legal-title" style="padding-top:clamp(2rem,4vw,3rem)">
      ${kicker(kickerText)}
      <h1 id="legal-title" class="h2">${title}</h1>
      <div class="prose">${content}</div>
    </section>`;
}

export function mentions(ctx) {
  const { legal } = salon;
  const body = legalPage('Un Brun d’Hair · Aubière', html`Mentions <em>légales</em>`, html`
        <h2>Éditeur du site</h2>
        <p><strong>${legal.company}</strong>, ${legal.form} au capital de ${todo(legal.capital)} €.</p>
        <ul>
          <li>Siège social : ${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}</li>
          <li>SIREN : ${legal.siren} — SIRET du siège : ${legal.siret}</li>
          <li>Immatriculation : ${todo(legal.registration, 'RCS ou registre national des entreprises')}</li>
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
        <p>Les textes, la mise en page et les éléments graphiques de ce site appartiennent à Un Brun d’Hair ou font l’objet d’une licence. Toute reproduction sans autorisation est interdite. Les avis clients cités proviennent de la page publique du salon sur Planity. Davines et les noms de ses gammes sont des marques de leur propriétaire.</p>

        <h2>Données personnelles</h2>
        <p>Le traitement des données envoyées depuis ce site est décrit dans la <a href="${ctx.rel('confidentialite/')}">politique de confidentialité</a>. Les ventes de la boutique suivent les <a href="${ctx.rel('cgv/')}">conditions générales de vente</a>.</p>

        <h2>Crédits</h2>
        <ul>
          <li>Typographies : Instrument Serif et Instrument Sans (SIL Open Font License 1.1).</li>
          <li>Photos d’illustration : Pexels (licence Pexels), sauf la photo de la vitrine.</li>
          <li>Plan du quartier : données © les contributeurs d’OpenStreetMap, licence ODbL.</li>
          <li>Illustrations des coupes et des produits : dessins originaux du site.</li>
        </ul>`);
  return {
    title: 'Mentions légales | Un Brun d’Hair, salon de coiffure à Aubière',
    description: 'Mentions légales du site Un Brun d’Hair, salon de coiffure à Aubière : éditeur, directrice de la publication, hébergement et crédits.',
    breadcrumb: [{ label: 'Mentions légales', route: 'mentions-legales/' }],
    noindex: true,
    body,
  };
}

export function confidentialite(ctx) {
  const body = legalPage('Un Brun d’Hair · Aubière', html`Données <em>personnelles</em>`, html`
        <h2>Responsable du traitement</h2>
        <p>Un Brun d’Hair, ${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}, est responsable du traitement des données envoyées depuis ce site. Ces données servent uniquement à répondre à votre demande ; elles ne sont ni vendues, ni cédées.</p>

        <h2>Données collectées</h2>
        <ul>
          <li><strong>Message depuis la page Contact</strong> : prénom, téléphone ou e-mail, sujet et message. Usage : vous répondre. Conservation : au plus 12 mois.</li>
          <li><strong>Alerte dernière minute</strong> : prénom, numéro de mobile ou e-mail, préférences de jours et de prestation. Usage : vous prévenir quand un créneau se libère, avec votre consentement. Conservation : jusqu’à votre désinscription, au plus 3 ans après le dernier contact.</li>
          <li><strong>Commande en click and collect</strong> : nom, prénom, téléphone, e-mail et produits commandés. Usage : préparer la commande, vous prévenir qu’elle est prête, tenir la comptabilité. Conservation : 10 ans pour les pièces comptables, sinon 3 ans après la commande.</li>
          <li><strong>Paiement en ligne</strong> : il est traité par Stripe, qui reçoit vos données bancaires selon sa propre politique de confidentialité. Le salon n’a jamais accès au numéro de votre carte.</li>
          <li><strong>Questionnaire « Quelle coupe pour moi ? »</strong> : vos réponses restent dans votre navigateur et ne sont envoyées à personne.</li>
          <li><strong>Réservation sur Planity</strong> : les données saisies sur Planity sont traitées par Planity, selon sa propre politique de confidentialité.</li>
        </ul>
        <p>Selon la configuration du site, votre demande part par un service d’envoi de formulaires, par votre application SMS ou e-mail, ou par la messagerie Instagram.</p>

        <h2>Stockage dans votre navigateur</h2>
        <p>Le panier de la boutique est gardé dans votre navigateur (stockage local) pour ne pas le perdre d’une page à l’autre. Ce n’est pas un cookie de suivi : il ne sert qu’à la boutique, et vous pouvez le vider à tout moment. Le site ne dépose aucun cookie de mesure d’audience ni de publicité.</p>

        <h2>Services tiers</h2>
        <p>Les polices, images et scripts du site sont servis par le site lui-même. Google Maps ne se charge que si vous cliquez sur « Ouvrir Google Maps ici » sur le plan : Google reçoit alors votre adresse IP. Les liens vers Planity, Instagram, TikTok, WhatsApp, Google Maps, Waze, Plans et Stripe mènent vers des services soumis à leurs propres règles.</p>

        <h2>Vos droits</h2>
        <p>Vous pouvez accéder à vos données, les rectifier, les effacer, vous opposer à leur traitement ou demander leur portabilité. Pour cela, contactez le salon au <a href="tel:${salon.phone.tel}">${salon.phone.display}</a> ou directement au salon. Vous pouvez aussi déposer une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.</p>
        <p>Voir aussi les <a href="${ctx.rel('cgv/')}">conditions générales de vente</a>.</p>`);
  return {
    title: 'Politique de confidentialité | Un Brun d’Hair',
    description: 'Comment Un Brun d’Hair, salon de coiffure à Aubière, traite les données envoyées depuis son site : messages, alerte dernière minute, commandes et paiement.',
    breadcrumb: [{ label: 'Confidentialité', route: 'confidentialite/' }],
    noindex: true,
    body,
  };
}

export function cgv(ctx) {
  const { legal } = salon;
  const mediator = legal.mediator ? html`<a href="${legal.mediator.url}" target="_blank" rel="noopener">${legal.mediator.name}</a>` : todo(null, 'nom et site du médiateur de la consommation');
  const body = legalPage('Boutique Davines · Click and collect', html`Conditions <em>générales de vente</em>`, html`
        <p>Ces conditions s’appliquent aux produits commandés sur la boutique du site et retirés au salon (click and collect). Elles ne concernent pas les prestations de coiffure, réservées sur Planity.</p>

        <h2>1. Vendeur</h2>
        <p>${legal.company}, ${legal.form}, ${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}. SIRET ${legal.siret}. Téléphone : <a href="tel:${salon.phone.tel}">${salon.phone.display}</a>.</p>

        <h2>2. Produits</h2>
        <p>Les produits proposés sont des soins capillaires de la marque Davines, utilisés au salon. Les illustrations sont indicatives. Les produits sont proposés dans la limite des stocks disponibles : si un produit manque, Sandy vous prévient et vous propose un équivalent ou le remboursement.</p>

        <h2>3. Prix</h2>
        <p>Les prix sont indiqués en euros, toutes taxes comprises. Le prix appliqué est celui affiché au moment de la commande. Aucun frais de livraison : la commande se retire au salon.</p>

        <h2>4. Commande</h2>
        <p>Vous choisissez vos produits, indiquez vos coordonnées, acceptez ces conditions, puis validez la commande. Selon la configuration de la boutique, vous payez en ligne ou au retrait. Un récapitulatif vous est envoyé, et Sandy vous prévient quand la commande est prête.</p>

        <h2>5. Paiement</h2>
        <p>Le paiement en ligne se fait par carte bancaire sur la page sécurisée de Stripe : le salon n’a jamais accès à vos données bancaires. Le paiement au retrait se fait au salon, par carte bancaire ou en espèces.</p>

        <h2>6. Retrait au salon</h2>
        <p>La commande se retire au ${salon.address.street} à ${salon.address.city}, aux heures d’ouverture, sur présentation de votre nom. Une commande non retirée 30 jours après l’avis de mise à disposition peut être annulée ; elle est alors remboursée si elle a été payée.</p>

        <h2>7. Droit de rétractation</h2>
        <p>Pour une commande passée à distance, vous disposez de 14 jours après le retrait pour vous rétracter, sans avoir à vous justifier (article L221-18 du Code de la consommation). Rapportez le produit au salon ou informez-nous par téléphone ou par écrit ; le remboursement intervient au plus tard 14 jours après, par le même moyen de paiement.</p>
        <p>Exception : les produits d’hygiène et de soin qui ont été ouverts ou descellés après le retrait ne peuvent pas être repris, pour des raisons d’hygiène et de protection de la santé (article L221-28, 3° du Code de la consommation).</p>

        <h2>8. Garanties légales</h2>
        <p>Les produits bénéficient de la garantie légale de conformité (articles L217-3 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil).</p>

        <h2>9. Données personnelles</h2>
        <p>Les données de commande sont traitées comme décrit dans la <a href="${ctx.rel('confidentialite/')}">politique de confidentialité</a>.</p>

        <h2>10. Réclamations et médiation</h2>
        <p>Pour toute réclamation, contactez d’abord le salon. En cas de désaccord, vous pouvez recourir gratuitement au médiateur de la consommation : ${mediator}.</p>

        <h2>11. Droit applicable</h2>
        <p>Ces conditions sont soumises au droit français.</p>`);
  return {
    title: 'Conditions générales de vente | Un Brun d’Hair',
    description: 'Conditions générales de vente de la boutique Davines en click and collect d’Un Brun d’Hair, à Aubière : commande, paiement, retrait, rétractation et garanties.',
    breadcrumb: [{ label: 'Conditions de vente', route: 'cgv/' }],
    noindex: true,
    body,
  };
}

export function notFound(ctx) {
  const body = legalPage('Erreur 404', html`Page <em>introuvable</em>`, html`
        <p class="lead">Cette page n’existe pas ou a changé d’adresse.</p>
        <div class="actions" style="margin-top:2rem">
          <a class="btn btn--primary" href="${ctx.rel('')}">Retour à l’accueil</a>
          <a class="btn" href="${ctx.rel('tarifs/')}">Prestations &amp; tarifs</a>
          <a class="btn" href="${ctx.rel('contact/')}">Contact &amp; accès</a>
        </div>`);
  return {
    title: 'Page introuvable | Un Brun d’Hair',
    description: 'Cette page n’existe pas. Retrouvez le salon de coiffure Un Brun d’Hair à Aubière.',
    noindex: true,
    body,
  };
}
