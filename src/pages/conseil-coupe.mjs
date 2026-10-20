import { html } from '../lib/html.mjs';
import { salon } from '../data/salon.mjs';
import { haircuts, couleurs } from '../data/haircuts.mjs';
import { products, lines } from '../data/products.mjs';
import { servicesData } from '../data/services.mjs';
import { pageHero, kicker, ribbon, orbs, faq, faqSchema, related } from '../components/blocks.mjs';
import { icon } from '../components/icons.mjs';

export const route = 'conseil-coupe/';

const FAQ = [
  { q: 'Le résultat est-il fiable ?', a: 'Le questionnaire applique les règles de base du métier : nature et épaisseur du cheveu, forme du visage, temps de coiffage et envie de changement. Il donne une première piste ; Sandy valide la coupe avec vous au salon, en voyant vos cheveux.' },
  { q: 'Que veut dire le pourcentage de compatibilité ?', a: 'C’est la part des critères que la coupe remplit, pondérée par leur importance : la nature du cheveu et la forme du visage comptent plus que la frange. Il ne dépasse jamais 98 % : la dernière validation se fait toujours ensemble.' },
  { q: 'Comment est calculé le prix ?', a: 'Avec la carte du salon : le tarif dépend de la longueur actuelle de vos cheveux, de la couleur choisie et, pour les cheveux épais, de l’option qui prévoit le temps nécessaire.' },
  { q: 'Mes réponses sont-elles enregistrées ?', a: 'Non. Le calcul se fait dans votre navigateur ; rien n’est envoyé.' },
];

export default function conseilCoupe(ctx) {
  const catalog = {
    haircuts,
    couleurs,
    services: servicesData(),
    products: products.map(({ id, line, name, size, price, shape }) => ({ id, line, name, size, price, shape, tint: lines[line].tint })),
    planity: salon.links.planity,
  };
  const body = html`
    ${pageHero(ctx, {
      kickerText: 'Conseil coupe',
      title: html`Quelle coupe <em>pour moi</em> ?`,
      lead: 'De 6 à 9 questions, 2 minutes : trois coupes adaptées à vos cheveux, à votre visage et à votre temps le matin, avec leur score de compatibilité, leur prix et leur durée au salon.',
      actions: html`<a class="btn btn--primary" href="#test" data-magnetic>Commencer le test ${icon('arrow-right', 'icon--move')}</a>`,
      facts: [['Coupes étudiées', String(haircuts.femme.length + haircuts.homme.length + haircuts.enfant.length)], ['Résultat', '3 coupes'], ['Gratuit', 'sans inscription']],
    })}

    <div class="has-ribbon" data-ambient="dark">
      ${orbs()}
      ${ribbon('quiz')}
      <section id="test" class="section quiz" aria-labelledby="quiz-title" data-quiz>
        <h2 id="quiz-title" class="visually-hidden">Le questionnaire</h2>
        <div class="quiz__stage" data-quiz-stage>
          <noscript><p class="lead">Le questionnaire a besoin de JavaScript. Sandy vous conseille aussi directement au salon : <a href="tel:${salon.phone.tel}">${salon.phone.display}</a>.</p></noscript>
        </div>
        <p class="visually-hidden" aria-live="polite" data-quiz-live></p>
      </section>
    </div>

    <section class="section" aria-labelledby="method-title">
      <header class="section__head">
        ${kicker('La méthode')}
        <h2 id="method-title" data-split>Comment le test <em>choisit</em></h2>
      </header>
      <ul class="benefits benefits--4">
        <li data-reveal>${icon('drop')}<h3>La nature du cheveu</h3><p>Raide, ondulé, bouclé ou frisé : la coupe doit suivre la façon dont vos cheveux tombent naturellement. C’est le critère qui pèse le plus.</p></li>
        <li data-reveal style="--stagger:1">${icon('sparkle')}<h3>La forme du visage</h3><p>Allonger un visage rond, adoucir une mâchoire carrée, équilibrer un front large : les règles classiques de la coiffure.</p></li>
        <li data-reveal style="--stagger:2">${icon('clock')}<h3>Votre temps le matin</h3><p>Une coupe qui demande 20 minutes de brushing ne convient pas à qui n’a que 2 minutes.</p></li>
        <li data-reveal style="--stagger:3">${icon('scissors')}<h3>Votre envie</h3><p>Garder la longueur ou oser : le test ne propose jamais une coupe plus longue que vos cheveux actuels.</p></li>
      </ul>
    </section>

    ${faq(FAQ)}
    ${related(ctx, ['coupe-femme-aubiere/', 'coupe-homme-aubiere/', 'balayage-aubiere/', 'boutique/'])}`;

  return {
    title: 'Quelle coupe pour moi ? Le test coiffure | Un Brun d’Hair, Aubière',
    description: 'Test gratuit en 2 minutes : nature de cheveux, visage, temps le matin. Trois coupes conseillées avec score de compatibilité, prix et durée au salon Un Brun d’Hair à Aubière.',
    breadcrumb: [{ label: 'Quelle coupe pour moi ?', route }],
    schema: [faqSchema(FAQ)],
    styles: ['quiz'],
    data: { quiz: catalog },
    body,
  };
}
