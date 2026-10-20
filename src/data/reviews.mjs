// Avis clients réels, publiés sur la page Planity du salon (relevés en octobre 2026).
// Le texte est cité tel quel ; « […] » marque un passage coupé.
// `tags` relie un avis aux pages de prestations concernées.

export const reviews = [
  { text: 'Sandy est extraordinaire. Accueillante, chaleureuse et extrêmement talentueuse. Elle a des doigts en or et une technique parfaite. C’est une professionnelle que je recommande les yeux fermés.', date: 'septembre 2026', tags: ['home', 'salon'] },
  { text: 'Salon et accueil très chaleureux. Sandy est de très bons conseils et a parfaitement compris ce que je voulais. Dynamique et professionnelle, je suis ravie de ma coupe : je recommande vivement !', date: 'octobre 2026', tags: ['home', 'femme'] },
  { text: 'Je lui confie mes cheveux depuis 4 ans et toujours aussi ravie ! De très bons conseils et un résultat au top. Balayage et coupe exactement comme je voulais. Je recommande les yeux fermés !', date: 'août 2026', service: 'Balayage Éclat & Intense', tags: ['home', 'balayage'] },
  { text: 'Une vraie bulle de douceur ! Sandy est très souriante et aux petits soins. J’ai passé un pur moment de relaxation et la coupe est tout simplement au top.', date: 'septembre 2026', tags: ['femme', 'salon'] },
  { text: 'Ravie de mon balayage ! Une prestation soignée et professionnelle ! Un accueil chaleureux, une coiffeuse souriante, adorable et à l’écoute ! L’ambiance est agréable dans ce joli salon ! Je recommande', date: 'août 2026', tags: ['balayage'] },
  { text: 'Joli petit salon, bien situé et accessible. Coiffeuse adorable, à l’écoute de vos envies et qui prend le temps d’étudier votre nature de cheveux et votre routine. N’hésitez pas à aller dans ce salon !', date: 'août 2026', tags: ['salon', 'diagnostic', 'contact'] },
  { text: 'Très contente de ma coupe et de ma couleur ! À l’écoute et de bons conseils. Je recommande sans hésiter !', date: 'août 2026', tags: ['couleur'] },
  { text: 'Une personne agréable et chaleureuse, à l’écoute des envies et avec de bons conseils. Mes cheveux vous remercient !', date: 'septembre 2026', tags: ['soin', 'diagnostic'] },
  { text: 'Je recommande ce nouveau salon. Sandy m’a reçu avec professionnalisme de mon arrivée à mon départ dans une ambiance cocooning et bien évidemment avec une coiffure irréprochable.', date: 'septembre 2026', tags: ['homme', 'salon'] },
  { text: 'Sandy est parfaite, tant dans l’accueil de ses clients que dans ses prestations. Comprend exactement ce que l’on veut.', date: 'octobre 2026', tags: ['homme'] },
  { text: 'Sandy est très à l’écoute de notre envie et très professionnelle. Ce fut un moment très agréable et détendu. Venez vous faire coiffer chez elle et vous en ressortirez ravie comme je l’ai été.', date: 'septembre 2026', tags: ['femme'] },
  { text: 'Encore un très bon moment passé avec Sandy, nous ne pouvons que recommander ce salon, nous sommes toujours très bien accueillis, Sandy est tellement adorable, nous ne changerons pour rien au monde !', date: 'août 2026', tags: ['salon'] },
  { text: 'Une coiffeuse super souriante, à l’écoute, et avec de l’or dans les mains ! Des produits incroyables !', date: 'août 2026', tags: ['soin', 'couleur'] },
  { text: 'Je recommande ce salon les yeux fermés. Sandy est une personne joviale qui met très vite en confiance.', date: 'septembre 2026', tags: [] },
  { text: 'Jeune femme très agréable et à l’écoute de sa clientèle. Je recommande vivement !', date: 'août 2026', tags: [] },
  { text: 'Sandy est très à l’écoute et de bons conseils.', date: 'septembre 2026', tags: ['diagnostic'] },
  { text: 'Très satisfaite de la prestation, j’ai passé un bon moment… hâte de revenir', date: 'septembre 2026', tags: [] },
];

export const reviewsFor = (tag, limit = 3) => reviews.filter((review) => review.tags.includes(tag)).slice(0, limit);

// Expressions qui reviennent dans les avis.
export const reviewWords = ['« Bulle de douceur »', '« Doigts en or »', '« À l’écoute »', '« Ambiance cocooning »', '« Comme à la maison »'];
