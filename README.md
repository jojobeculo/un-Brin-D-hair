# Un Brun d’Hair — site du salon

Site vitrine et de prise de rendez-vous d’**Un Brun d’Hair**, salon de coiffure au
4 bis rue Champvoisin, 63170 Aubière.

Direction artistique « Agence Foudre » : page magazine en rose lipstick et vert profond,
titres géants condensés, deux cercles de navigation aux coins de l’écran.

## Contenu

- **Hero** avec statut d’ouverture en direct (« Ouvert · jusqu’à 19:00 »).
- **La carte** : toutes les prestations et tous les tarifs. Le bouton **+** d’une ligne ouvre
  la réservation avec la prestation déjà choisie.
- **Réservation en 3 clics** : prestation → options (cheveux épais, allongement, soin Davines)
  → créneau. La validation envoie vers Planity, ou envoie une demande au salon.
  Le tunnel applique la règle du salon : diagnostic obligatoire avant un balayage.
- **Alerte dernière minute** : inscription par SMS ou e-mail pour les créneaux libérés.
- **Avis** : note 5,0/5 et avis réels publiés sur Planity.
- **Avant / après** : comparateurs à glisser (illustrations provisoires, voir plus bas).
- **Carte cadeau** : achat en ligne sur Planity, compte à rebours avant la prochaine fête.
- **Venir au salon** : plan interactif, Google Maps, Waze, Plans, horaires.
- **Curseur personnalisé** (souris uniquement) : un point et un anneau qui s’agrandit sur les éléments cliquables. Il est géré par `assets/js/modules/cursor.js` et la fin de `components.css`.

## Lancer le site en local

Le site est statique : aucune compilation.

```sh
npx serve .
# ou
python3 -m http.server 8000
```

Ouvrez ensuite l’adresse affichée. Les modules JavaScript ne se chargent pas en `file://` :
passez par un serveur local.

## Mettre en ligne

Tout hébergement statique convient (GitHub Pages, Netlify, OVH…).
Pour GitHub Pages : *Settings → Pages → Deploy from a branch*, branche `main`, dossier `/`.

Avant la mise en ligne :

1. Remplacer les illustrations avant / après par de vraies photos.
2. Compléter les champs `[à compléter]` de `mentions-legales.html` (capital, immatriculation,
   e-mail, hébergeur).
3. Choisir le canal des formulaires dans `assets/js/config.js` (voir plus bas).
4. Mettre l’URL complète du site dans `og:image` (`index.html`) : les réseaux sociaux
   n’acceptent pas les chemins relatifs.

## Modifier le contenu

| Quoi | Où |
| --- | --- |
| Prix et durées | `index.html`, section `#carte` : texte affiché **et** attributs `data-price` (en €) et `data-duration` (en minutes). Le tunnel de réservation lit ces attributs. |
| Options proposées à l’étape 2 | attribut `data-options` de chaque catégorie (`opt-epais`, `opt-allongement`, `soin-davines`). |
| Horaires | tableau `[data-hours]` de la section `#venir` (`data-open`, `data-close`) et bloc JSON-LD en haut de `index.html`. |
| Téléphone, Planity, Instagram | liens dans `index.html` et `mentions-legales.html` ; numéro affiché dans les messages d’erreur et compte Instagram dans `assets/js/config.js`. |
| Note et nombre d’avis | section `#avis` et puce du hero. |

## Formulaires (demande de rendez-vous, alerte dernière minute)

Le site n’a pas de serveur. Dans `assets/js/config.js`, le premier canal renseigné gagne :

1. `formEndpoint` : URL qui reçoit les données en JSON (Formspree, Getform, Make, Zapier…).
   Solution recommandée : les demandes arrivent par e-mail, sans action du client.
2. `sms` : numéro de **mobile** du salon. Sur téléphone, l’application SMS s’ouvre avec le
   message pré-rempli.
3. `email` : la messagerie du visiteur s’ouvre avec le message pré-rempli.
4. Aucun canal : le message est copié et la conversation Instagram du salon s’ouvre.

## Photos avant / après

Les fichiers de `assets/img/avant-apres/` sont des illustrations provisoires (mèches dessinées).
Remplacez-les par des photos au format portrait 4:5 (par exemple 1200 × 1500 px, JPEG ou WebP),
puis mettez à jour les attributs `src` et `alt` dans la section `#avant-apres`.
Les deux photos d’une paire doivent avoir le même cadrage.

## Structure

```
index.html                 page unique
mentions-legales.html      mentions légales et données personnelles
favicon.svg
assets/css/                tokens.css (couleurs, typo), base.css, components.css,
                           sections.css, booking.css
assets/js/main.js          point d’entrée
assets/js/config.js        réglages du salon
assets/js/lib/             horaires, envoi des demandes, validation, messages
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

Le plan utilise Leaflet (chargé à l’approche de la section) et les tuiles OpenStreetMap.
Pour un trafic important, passez à un fournisseur de tuiles avec clé (MapTiler, Stadia…).
