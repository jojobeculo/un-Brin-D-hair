import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { priceOf, durationOf, startingPrice } from '../data/services.mjs';
import { pageHero, kicker, faqList, faqSchema, hoursSentence, cta, bookButton } from '../components/blocks.mjs';

export const route = 'faq/';

const GROUPS = [
  {
    title: 'Réservation',
    items: [
      { q: 'Comment prendre rendez-vous ?', a: `En ligne sur Planity, à toute heure, avec confirmation immédiate. Vous pouvez aussi appeler le salon au ${salon.phone.display}.` },
      { q: 'Quels sont les horaires du salon ?', a: `${hoursSentence()}. Le lundi et le samedi, le salon ouvre une semaine sur deux : les créneaux exacts sont sur Planity.` },
      { q: 'Comment annuler ou déplacer un rendez-vous ?', a: `Depuis votre compte Planity, ou en appelant le salon au ${salon.phone.display}. Prévenir le plus tôt possible permet de proposer le créneau à quelqu’un d’autre.` },
      { q: 'Puis-je être prévenue d’un créneau libéré ?', a: 'Oui : inscrivez-vous à l’alerte dernière minute sur la page Contact, par SMS ou par e-mail.' },
    ],
  },
  {
    title: 'Prestations',
    items: [
      { q: 'Le diagnostic est-il obligatoire ?', a: `Oui, avant tout balayage ou changement de couleur nécessitant un éclaircissement. Il dure ${durationOf('diagnostic')} et coûte ${priceOf('diagnostic')}, déduits de votre prestation si vous convenez ensemble d’un rendez-vous. Il a lieu un autre jour que la prestation.` },
      { q: 'Coiffez-vous les hommes et les enfants ?', a: `Oui : forfait homme (shampoing, coupe, coiffage) à ${priceOf('homme-forfait')}, coupe garçon de moins de 12 ans à ${priceOf('enfant-garcon')}, coupe fille de moins de 12 ans ${startingPrice('enfant')}.` },
      { q: 'Je ne sais pas quelle coupe choisir.', a: 'Le questionnaire « Quelle coupe pour moi ? » propose 3 coupes adaptées à vos cheveux, à votre visage et à votre temps le matin, avec leur prix et leur durée. Sandy affine avec vous au salon.' },
      { q: 'Pourquoi certains prix sont-ils indiqués « dès » ?', a: 'Le tarif s’ajuste à la longueur, à l’épaisseur de vos cheveux et à votre projet couleur. Pour les cheveux épais, une option prévoit le temps nécessaire.' },
      { q: 'Quels produits utilisez-vous ?', a: 'Exclusivement Davines, une marque engagée qui allie performance, respect du cheveu et de l’environnement.' },
    ],
  },
  {
    title: 'Boutique et paiement',
    items: [
      { q: 'Comment fonctionne le click and collect ?', a: 'Choisissez vos produits Davines dans la boutique, validez la commande, puis retirez-la au salon aux heures d’ouverture. Sandy vous prévient quand elle est prête.' },
      { q: 'Peut-on payer en ligne ?', a: 'Selon la configuration de la boutique : paiement sécurisé par carte avec Stripe, ou paiement au retrait au salon.' },
      { q: 'Quels moyens de paiement au salon ?', a: 'La carte bancaire et les espèces.' },
      { q: 'Peut-on offrir une prestation ?', a: 'Oui, avec la carte cadeau, en ligne sur Planity ou au salon.' },
    ],
  },
  {
    title: 'Accès',
    items: [
      { q: 'Où se trouve le salon ?', a: `${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}. ${salon.access.landmark}.` },
      { q: 'Où se garer ?', a: `${salon.access.parking}.` },
      { q: 'Peut-on venir en bus ?', a: `Oui : ${salon.access.bus.charAt(0).toLowerCase()}${salon.access.bus.slice(1)}.` },
    ],
  },
];

export default function faqPage(ctx) {
  const all = GROUPS.flatMap((group) => group.items);
  const body = html`
    ${pageHero(ctx, {
      kickerText: 'Questions fréquentes',
      title: html`Vos questions, <em>nos réponses</em>`,
      lead: `Réservation, prestations, boutique, accès : l’essentiel en un coup d’œil. Une autre question ? Appelez le salon au ${salon.phone.display}.`,
      actions: html`${bookButton()}`,
    })}
    <section class="section faq-groups" aria-label="Questions par thème" style="padding-top:0">
      ${GROUPS.map((group, index) => html`<div class="faq">
        <header>${kicker(String(index + 1).padStart(2, '0'))}<h2 class="h3">${group.title}</h2></header>
        ${faqList(group.items)}
      </div>`)}
    </section>
    ${cta()}`;

  return {
    title: 'Questions fréquentes | Un Brun d’Hair, coiffeur à Aubière',
    description: 'Réservation sur Planity, horaires, diagnostic, tarifs, coupe homme et enfant, boutique Davines en click and collect, accès et stationnement : toutes les réponses.',
    breadcrumb: [{ label: 'Questions fréquentes', route }],
    schema: [faqSchema(all)],
    body,
  };
}
