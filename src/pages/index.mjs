// Liste des pages générées : { route, render }. route '' = accueil, 'x/' = dossier x/index.html.
import accueil, { route as accueilRoute } from './accueil.mjs';
import salonPage, { route as salonRoute } from './salon.mjs';
import tarifs, { route as tarifsRoute } from './tarifs.mjs';
import femme, { route as femmeRoute } from './femme.mjs';
import homme, { route as hommeRoute } from './homme.mjs';
import coloration, { route as colorationRoute } from './coloration.mjs';
import balayage, { route as balayageRoute } from './balayage.mjs';
import soins, { route as soinsRoute } from './soins.mjs';
import diagnostic, { route as diagnosticRoute } from './diagnostic.mjs';
import galerie, { route as galerieRoute } from './galerie.mjs';
import avis, { route as avisRoute } from './avis.mjs';
import contact, { route as contactRoute } from './contact.mjs';
import carteCadeau, { route as carteCadeauRoute } from './carte-cadeau.mjs';
import { mentions, confidentialite, notFound } from './legal.mjs';

export const pages = [
  { route: accueilRoute, render: accueil },
  { route: salonRoute, render: salonPage },
  { route: tarifsRoute, render: tarifs },
  { route: femmeRoute, render: femme },
  { route: hommeRoute, render: homme },
  { route: colorationRoute, render: coloration },
  { route: balayageRoute, render: balayage },
  { route: soinsRoute, render: soins },
  { route: diagnosticRoute, render: diagnostic },
  { route: galerieRoute, render: galerie },
  { route: avisRoute, render: avis },
  { route: contactRoute, render: contact },
  { route: carteCadeauRoute, render: carteCadeau },
  { route: 'mentions-legales/', render: mentions },
  { route: 'confidentialite/', render: confidentialite },
  { route: '404.html', render: notFound },
];
