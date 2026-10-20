// Liste des pages générées : { route, render }. route '' = accueil, 'x/' = dossier x/index.html.
import accueil, { route as accueilRoute } from './accueil.mjs';
import quiSuisJe, { route as quiSuisJeRoute } from './qui-suis-je.mjs';
import tarifs, { route as tarifsRoute } from './tarifs.mjs';
import coupeFemme, { route as coupeFemmeRoute } from './coupe-femme.mjs';
import coupeHomme, { route as coupeHommeRoute } from './coupe-homme.mjs';
import coloration, { route as colorationRoute } from './coloration.mjs';
import balayage, { route as balayageRoute } from './balayage.mjs';
import soin, { route as soinRoute } from './soin.mjs';
import diagnostic, { route as diagnosticRoute } from './diagnostic.mjs';
import realisations, { route as realisationsRoute } from './realisations.mjs';
import avis, { route as avisRoute } from './avis.mjs';
import faq, { route as faqRoute } from './faq.mjs';
import contact, { route as contactRoute } from './contact.mjs';
import carteCadeau, { route as carteCadeauRoute } from './carte-cadeau.mjs';
import conseilCoupe, { route as conseilCoupeRoute } from './conseil-coupe.mjs';
import boutique, { route as boutiqueRoute } from './boutique.mjs';
import { mentions, confidentialite, cgv, notFound } from './legal.mjs';

export const pages = [
  { route: accueilRoute, render: accueil },
  { route: quiSuisJeRoute, render: quiSuisJe },
  { route: tarifsRoute, render: tarifs },
  { route: coupeFemmeRoute, render: coupeFemme },
  { route: coupeHommeRoute, render: coupeHomme },
  { route: colorationRoute, render: coloration },
  { route: balayageRoute, render: balayage },
  { route: soinRoute, render: soin },
  { route: diagnosticRoute, render: diagnostic },
  { route: realisationsRoute, render: realisations },
  { route: avisRoute, render: avis },
  { route: faqRoute, render: faq },
  { route: contactRoute, render: contact },
  { route: carteCadeauRoute, render: carteCadeau },
  { route: conseilCoupeRoute, render: conseilCoupe },
  { route: boutiqueRoute, render: boutique },
  { route: 'cgv/', render: cgv },
  { route: 'mentions-legales/', render: mentions },
  { route: 'confidentialite/', render: confidentialite },
  { route: '404.html', render: notFound },
];
