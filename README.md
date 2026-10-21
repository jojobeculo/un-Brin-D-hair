# Un Brun d’Hair — site du salon

Site vitrine d’**Un Brun d’Hair**, le salon de coiffure de Sandy, au 4 bis rue Champvoisin,
63170 Aubière. Les rendez-vous se prennent sur Planity.

Direction artistique : beige et brun, typographies Instrument Serif et Instrument Sans,
beaucoup d’espace, un ruban de fils fins inspiré de la vague de la vitrine.

## Pages

| Adresse | Contenu |
| --- | --- |
| `/` | Accueil : photo de Sandy, phrase forte, pourquoi choisir le salon, prestations, réalisations, avis, Instagram, réservation Planity, plan et accès |
| `/qui-suis-je/` | L’histoire de Sandy, ses valeurs, le déroulé d’un rendez-vous |
| `/tarifs/` | Toute la carte des prestations et des tarifs |
| `/coupe-femme-aubiere/`, `/coupe-homme-aubiere/`, `/coloration-aubiere/`, `/balayage-aubiere/`, `/soin-capillaire-aubiere/`, `/diagnostic-capillaire-aubiere/` | Une page par prestation : bénéfices, déroulé, tarifs, photos, avis, produits conseillés, questions fréquentes |
| `/realisations/` | Galerie et fil Instagram |
| `/avis/` | Avis clients |
| `/conseil-coupe/` | Questionnaire « Quelle coupe pour moi ? » |
| `/boutique/` | Produits Davines en click and collect |
| `/faq/` | Questions fréquentes par thème |
| `/contact/` | Plan, accès, horaires, formulaire, alerte dernière minute |
| `/carte-cadeau/` | Carte cadeau |
| `/cgv/`, `/mentions-legales/`, `/confidentialite/` | Pages légales (non indexées) |
| `404.html` | Page introuvable |

Sur chaque page :

- Bouton **« Je réserve »** toujours visible : dans l’en-tête sur ordinateur, dans la barre
  du bas sur téléphone (avec **Appeler** et **WhatsApp** ou **Itinéraire**).
- **Statut d’ouverture en direct** (« Ouvert · jusqu’à 19 h »), qui tient compte du lundi et
  du samedi ouverts une semaine sur deux. Un clic sur le statut ouvre le planning de la semaine.
- **Données structurées** Schema.org : salon (`HairSalon`), prestations et tarifs (`Service`),
  questions fréquentes (`FAQPage`), fil d’Ariane (`BreadcrumbList`). Pas de note agrégée :
  Google l’interdit pour les avis que l’établissement affiche lui-même.

## Animations

| Effet | Où | Fichier |
| --- | --- | --- |
| Titre « Un Brun d’Hair » dessiné au trait puis rempli | Accueil | `assets/css/site.css` |
| Titres révélés mot à mot, mots en italique soulignés | Toutes les pages | `assets/js/modules/reveal.js` |
| Phrase qui s’éclaire mot à mot au défilement | Accueil | `reveal.js` |
| Sections sombres avec un long dégradé lin → expresso en entrée et en sortie (le texte reste toujours sur une couleur pleine) ; l’en-tête passe en sombre au-dessus d’elles | Réservation, questionnaire, boutique, bandeaux finaux | `site.css`, `assets/js/modules/ambient.js` |
| Poussière dorée qui dérive en fond et s’écarte de la souris ou du doigt | Toutes les pages | `assets/js/modules/particles.js` |
| Position à l’arrivée (en haut, ou sur la section demandée), retour arrière qui rend la position, défilement doux vers les sections de la page | Toutes les pages | `assets/js/modules/scroll.js` |
| Ruban organique, orbes de lumière, parallaxe | Accueil, Qui suis-je, questionnaire, réservation | `ambient.js`, `motion.js`, `fx.js` |
| Plan du quartier qui se dessine, trajets à pied animés | Accueil, Contact | `assets/js/modules/plan.js` |
| Avant / après à glisser (aller-retour de démonstration à l’apparition) | Accueil, Réalisations, Coupe femme, Coloration, Balayage | `assets/js/modules/compare.js` |
| Onde au clic sur les boutons | Toutes les pages | `motion.js` |
| Curseur, traînée dorée, boutons magnétiques, cartes inclinées, orbes qui suivent la souris | Appareils avec souris | `assets/js/modules/fx.js` |
| Ruban de fond permanent et monogramme, qui suivent le défilement, la souris et le doigt | Toutes les pages | `assets/js/modules/ribbon-live.js` |
| Barre de progression du défilement, onde au toucher, survols (voisins estompés, lignes qui s’allongent) | Toutes les pages | `motion.js`, `site.css` |

`fx.js` se charge au premier mouvement d’une souris : les téléphones ne le téléchargent pas.
Rien ne bouge en continu pendant le chargement de la page : les orbes s’animent à la première interaction.

**Qualité adaptée à la machine.** Le site mesure sa fluidité réelle dans le navigateur du visiteur
(`assets/js/lib/perf.js`) et choisit l’un des trois niveaux suivants. Il les note sur `<html data-perf>` et
garde le résultat pour les visites suivantes. Au départ, il part d’un indice tiré de la carte graphique.
- `high` : tous les effets ;
- `lite` (puce graphique intégrée, ou moins de 45 images par seconde) : sans flou d’arrière-plan ni
  dérive des orbes, moitié moins de formes et de poussière, rubans figés au défilement ;
- `min` (rendu sans carte graphique, ou moins de 28 images par seconde) : l’essentiel, sans ruban de
  fond, formes ni poussière.

Dans tous les cas, les animations n’interrogent jamais la mise en page pendant une image : les positions
sont en cache (`assets/js/lib/geometry.js`).

**Animations complètes ou douces.** Quand le système demande moins d’animations (sous Windows :
*Paramètres › Accessibilité › Effets visuels › Effets d’animation* désactivé), le site passe en mode
doux : le curseur, les rubans, les orbes, les effets de clic et de survol et le passage en sombre
restent ; la parallaxe et les glissements d’entrée deviennent des fondus. L’interrupteur
« Animations complètes », dans le menu et le pied de page, remplace ce réglage pour le site.

## Modifier le contenu

Les pages HTML sont **générées**. Ne modifiez pas les fichiers `index.html` : modifiez `src/`,
puis régénérez le site (Node 22 ou plus, aucune dépendance) :

```sh
node build.mjs
```

La commande réécrit toutes les pages, `sitemap.xml`, `robots.txt` et `stripe/catalog.js`.

| Quoi | Où |
| --- | --- |
| Adresse, téléphone, horaires, accès, liens, note et nombre d’avis, informations légales | `src/data/salon.mjs` |
| Prestations, prix, durées | `src/data/services.mjs` |
| Produits de la boutique et prix | `src/data/products.mjs` |
| Coupes du questionnaire | `src/data/haircuts.mjs` |
| Avis cités | `src/data/reviews.mjs` |
| Textes d’une page | `src/pages/<page>.mjs` |
| Blocs communs (photos, tarifs, avis, plan, ruban…) | `src/components/blocks.mjs` |
| En-tête, menu, barre du bas, pied de page | `src/components/layout.mjs` |
| Styles | `assets/css/site.css` (+ `quiz.css`, `shop.css`) |
| Scripts | `assets/js/` |

### Lundi et samedi, une semaine sur deux

Dans `src/data/salon.mjs`, `alternateOpenWeek` reçoit la date d’un lundi d’une semaine où le
salon ouvre le lundi et le samedi (par exemple `'2026-10-19'`). Le statut d’ouverture et la
page Contact indiquent alors la bonne semaine. Vide : le site dit « une semaine sur deux »
et renvoie vers Planity.

### Photos

Les photos de `assets/img/photos/` sont des photos d’illustration (Pexels), sauf la vitrine.
Pour les remplacer par les photos du salon :

```sh
python3 tools/photos.py ma-photo.jpg coupe
```

Le script crée les versions AVIF et WebP (480, 960 et 1440 px) et le fichier `coupe.json`.
Gardez le même nom pour remplacer une photo existante. Il faut Python 3 et Pillow avec AVIF.
Les légendes sont dans `SHOTS` et `SERVICES` de `src/components/blocks.mjs`.

Les avant / après de `assets/img/avant-apres/` sont des illustrations (mèches dessinées).
Remplacez-les par des photos au format portrait 4:5 (par exemple 1200 × 1500 px), en gardant
les mêmes noms, ou changez la liste `GALLERY` de `src/components/blocks.mjs`. Les deux photos
d’une paire doivent avoir le même cadrage.

### Instagram

La galerie Instagram affiche des photos du site tant que le compte n’est pas relié.
Pour la relier :

1. Créez un flux gratuit sur [behold.so](https://behold.so) (ou équivalent) avec le compte
   `@unbrundhair`, et copiez l’adresse JSON du flux dans `instagramFeed`.
2. `node tools/instagram.mjs`, puis `node build.mjs`. Relancez ces deux commandes pour
   mettre à jour la galerie (par exemple une fois par semaine).

### Plan du quartier

`python3 tools/plan.py` télécharge les données OpenStreetMap autour du salon et redessine
`assets/img/plan-quartier.svg` et `src/data/plan.json`. Google Maps ne se charge que si le
visiteur clique sur « Ouvrir Google Maps ici ».

## Boutique et paiement

La boutique fonctionne sans paiement en ligne : la commande part au salon (voir les
formulaires plus bas) et le client paie au retrait. Pour le paiement par carte avec Stripe,
suivez `stripe/README.md`, puis mettez l’adresse de la fonction dans `stripe.checkoutEndpoint`.

Avant d’ouvrir la boutique :

1. Vérifier les produits et les prix de `src/data/products.mjs` (prix publics conseillés de
   Davines, relevés le 20 octobre 2026).
2. Renseigner le médiateur de la consommation (`legal.mediator`), obligatoire pour la vente
   en ligne.

## Formulaires (contact, alerte dernière minute, commandes)

Le site n’a pas de serveur. Dans `src/data/salon.mjs`, le premier canal renseigné gagne :

1. `forms.endpoint` : URL qui reçoit les données en JSON (Formspree, Getform, Make…).
   Solution recommandée : les demandes arrivent par e-mail, sans action du client.
2. `forms.sms` : numéro de **mobile** du salon. Sur téléphone, l’application SMS s’ouvre
   avec le message pré-rempli.
3. `email` : la messagerie du visiteur s’ouvre avec le message pré-rempli.
4. Aucun canal : le message est copié et la conversation Instagram du salon s’ouvre.

Chaque formulaire contient un champ piège invisible (`_gotcha`) : quand un robot le remplit,
rien n’est envoyé.

## Lancer le site en local

```sh
node build.mjs
npx serve .
```

Les modules JavaScript ne se chargent pas en `file://` : passez par un serveur local.

## Tests

```sh
node --test tests/
```

Les tests vérifient les horaires (semaines alternées), le questionnaire (toutes les
combinaisons de réponses femme, prix tirés de la carte) et la fonction de paiement Stripe.

## Mettre en ligne

Tout hébergement statique convient (GitHub Pages, Netlify, OVH…).

1. Mettez l’adresse publique du site dans `siteUrl` de `src/data/salon.mjs`.
2. `node build.mjs`, puis publiez.
3. Déclarez `sitemap.xml` dans Google Search Console.

Avant la mise en ligne :

1. Remplacer les photos d’illustration par les photos du salon.
2. Compléter les champs `legal` (capital, immatriculation, hébergeur, médiateur) et `email`.
3. Choisir le canal des formulaires.
4. Facultatif : un numéro de **mobile** dans `whatsapp` affiche le bouton WhatsApp.
5. Faire relire à Sandy le texte de la page « Qui suis-je ? ».

## Mesure d’audience

Aucun outil de mesure n’est installé : le site ne dépose aucun cookie. Les liens clés portent
un attribut `data-track` (`planity`, `phone`, `itineraire`, `whatsapp`), utilisable comme
déclencheur dans Google Tag Manager. Pour installer Google Analytics, ajoutez d’abord un
bandeau de consentement (règles de la CNIL) et mettez à jour `/confidentialite/`.

## Structure

```
build.mjs                  génère les pages à partir de src/
src/data/                  salon, prestations, produits, coupes, avis, plan
src/pages/                 une page par fichier (index.mjs les liste)
src/components/            gabarit commun, blocs, page de prestation, icônes
src/lib/html.mjs           gabarits HTML (échappement, espaces insécables)
assets/css/                site.css, quiz.css, shop.css
assets/js/main.js          point d’entrée
assets/js/lib/             horaires, questionnaire, dessins (coupes, flacons, ruban), panier, envoi
assets/js/modules/         une fonctionnalité par fichier
assets/fonts/              Instrument Serif et Instrument Sans + licence OFL
assets/img/                photos, avant / après, plan du quartier, image de partage, icône
stripe/                    fonction de paiement (Cloudflare Workers)
tools/                     photos, plan, Instagram
tests/                     tests (node --test)
```
