# Un Brun d’Hair — site du salon

Site vitrine et de prise de rendez-vous d’**Un Brun d’Hair**, salon de coiffure au
4 bis rue Champvoisin, 63170 Aubière.

Direction artistique « Agence Foudre » : pages magazine en rose lipstick et vert profond,
titres géants condensés, deux cercles de navigation aux coins de l’écran.

## Pages

| Adresse | Contenu |
| --- | --- |
| `/` | Accueil : présentation, prestations, avis, avant / après, réservation, alerte dernière minute, carte cadeau, accès, questions fréquentes |
| `/salon/` | Le salon et Sandy, valeurs, déroulé d’un rendez-vous |
| `/tarifs/` | Toute la carte des prestations et des tarifs |
| `/coiffeur-femme-aubiere/` | Coupes et brushings femme |
| `/coiffeur-homme-aubiere/` | Coupe homme et coupes enfant |
| `/coloration-aubiere/` | Coloration et gloss |
| `/balayage-aubiere/` | Balayages Lumières & Subtil, Éclat & Intense |
| `/soins-capillaires-aubiere/` | Soins Davines |
| `/diagnostic-capillaire-aubiere/` | Diagnostic capillaire (obligatoire avant un balayage ou un éclaircissement) |
| `/galerie/` | Avant / après |
| `/avis/` | Avis clients |
| `/contact/` | Plan, itinéraire, horaires, formulaire de contact |
| `/carte-cadeau/` | Carte cadeau |
| `/mentions-legales/`, `/confidentialite/` | Pages légales (non indexées) |
| `404.html` | Page introuvable |

Sur chaque page :

- **Réservation en 3 clics** : prestation → options (cheveux épais, allongement, soin Davines)
  → créneau. La validation envoie vers Planity, ou envoie une demande au salon.
  Le tunnel applique la règle du salon : diagnostic obligatoire avant un balayage.
  Il s’ouvre sur la bonne catégorie selon la page.
- **Statut d’ouverture en direct** (« Ouvert · jusqu’à 19:00 ») dans le menu et les blocs horaires.
- **Bouton flottant « Réserver »**, menu plein écran, fil d’Ariane.
- **Données structurées** Schema.org : salon (`HairSalon`), prestations et tarifs (`Service`),
  questions fréquentes (`FAQPage`), fil d’Ariane (`BreadcrumbList`).
- **Curseur personnalisé** (souris uniquement) et animations au défilement. Les animations
  s’arrêtent si le visiteur a demandé moins d’animations dans son système.

## Modifier le contenu

Les pages HTML sont **générées**. Ne modifiez pas les fichiers `index.html` : modifiez
`src/`, puis régénérez le site (Node 18 ou plus, aucune dépendance) :

```sh
node build.mjs
```

La commande réécrit toutes les pages, `sitemap.xml` et `robots.txt`.

| Quoi | Où |
| --- | --- |
| Adresse, téléphone, horaires, liens (Planity, Instagram, TikTok, plans), note et nombre d’avis, informations légales | `src/data/salon.mjs` |
| Prestations, prix, durées, options de l’étape 2 | `src/data/services.mjs` |
| Avis cités | `src/data/reviews.mjs` |
| Textes d’une page | `src/pages/<page>.mjs` |
| Blocs communs (tarifs, avis, galerie, accès, carte cadeau…) | `src/components/blocks.mjs` |
| En-tête, menu, pied de page, tunnel de réservation | `src/components/layout.mjs` |
| Styles | `assets/css/` |
| Scripts | `assets/js/` |

Les horaires, les prix, la note et le nombre d’avis sont écrits une seule fois, dans
`src/data/`. Les pages, les données Schema.org, le statut d’ouverture et le tunnel de
réservation les reprennent tous.

## Lancer le site en local

```sh
node build.mjs
npx serve .
```

Ouvrez ensuite l’adresse affichée. Les modules JavaScript ne se chargent pas en `file://` :
passez par un serveur local. En local, la page `404.html` s’affiche sans styles : ses liens
partent de l’adresse du site en ligne (voir `siteUrl`).

## Mettre en ligne

Tout hébergement statique convient (GitHub Pages, Netlify, OVH…).
Pour GitHub Pages : *Settings → Pages → Deploy from a branch*, branche `main`, dossier `/`.

1. Dans `src/data/salon.mjs`, mettez l’adresse publique du site dans `siteUrl`
   (actuellement `https://jojobeculo.github.io/un-Brin-D-hair/`). Elle sert aux liens
   canoniques, au plan du site, aux images de partage et aux liens de la page 404.
2. Régénérez le site avec `node build.mjs`, puis publiez.
3. Déclarez `sitemap.xml` dans Google Search Console. Les robots lisent `robots.txt`
   seulement à la racine d’un domaine : sur un sous-dossier GitHub Pages, la déclaration
   dans Search Console est nécessaire.

Avant la mise en ligne :

1. Remplacer les illustrations avant / après par de vraies photos (voir plus bas).
2. Compléter les champs `legal` de `src/data/salon.mjs` (capital, immatriculation,
   hébergeur) et l’adresse `email` : la page des mentions légales affiche
   « [à compléter] » tant qu’ils sont vides.
3. Choisir le canal des formulaires (voir plus bas).
4. Facultatif : un numéro de **mobile** dans `whatsapp` affiche un bouton WhatsApp sur
   toutes les pages.

## Formulaires (demande de rendez-vous, contact, alerte dernière minute)

Le site n’a pas de serveur. Dans `src/data/salon.mjs`, le premier canal renseigné gagne :

1. `forms.endpoint` : URL qui reçoit les données en JSON (Formspree, Getform, Make, Zapier…).
   Solution recommandée : les demandes arrivent par e-mail, sans action du client.
2. `forms.sms` : numéro de **mobile** du salon. Sur téléphone, l’application SMS s’ouvre
   avec le message pré-rempli.
3. `email` : la messagerie du visiteur s’ouvre avec le message pré-rempli.
4. Aucun canal : le message est copié et la conversation Instagram du salon s’ouvre.

Chaque formulaire contient un champ piège invisible (`_gotcha`) : quand un robot le remplit,
rien n’est envoyé. Formspree reconnaît aussi ce champ.

## Mesure d’audience

Aucun outil de mesure n’est installé : le site ne dépose aucun cookie. Les liens clés portent
un attribut `data-track` (`planity`, `phone`, `itineraire`, `whatsapp`). Ces attributs servent
de déclencheurs de clic dans Google Tag Manager. Pour installer Google Analytics, ajoutez
d’abord un bandeau de consentement aux cookies (règles de la CNIL) et mettez à jour la page
`/confidentialite/`.

## Photos avant / après

Les fichiers de `assets/img/avant-apres/` sont des illustrations provisoires (mèches dessinées).
Remplacez-les par des photos au format portrait 4:5 (par exemple 1200 × 1500 px), en gardant
les mêmes noms de fichiers, ou changez les noms et les textes alternatifs dans la liste
`GALLERY` de `src/components/blocks.mjs`. Les deux photos d’une paire doivent avoir le même
cadrage.

## Structure

```
build.mjs                  génère les pages à partir de src/
src/data/                  salon, prestations et tarifs, avis
src/pages/                 une page par fichier (index.mjs les liste)
src/components/            gabarit commun, blocs, icônes
src/lib/html.mjs           gabarits HTML (échappement, espaces insécables)
index.html, */index.html   pages générées
404.html, sitemap.xml, robots.txt
assets/css/                tokens.css (couleurs, typo), base.css, components.css,
                           sections.css, booking.css
assets/js/main.js          point d’entrée
assets/js/lib/             données de la page, horaires, envoi des demandes, validation
assets/js/modules/         une fonctionnalité par fichier
assets/fonts/              Archivo ExtraCondensed Black + licence OFL
assets/img/                image de partage, icône, avant / après
```

## Typographies

- **Titres** : Archivo ExtraCondensed Black (licence SIL OFL), hébergée dans le dépôt.
  Alternative libre à Beni Black, qui est payante.
- **Texte** : Clash Grotesk, chargée depuis l’API Fontshare. Sa licence (ITF Free Font
  License) interdit de publier les fichiers de police dans un dépôt public.

## Carte

Le plan de la page Contact utilise Leaflet (chargé à l’approche de la section) et les tuiles
OpenStreetMap. Pour un trafic important, passez à un fournisseur de tuiles avec clé
(MapTiler, Stadia…).
