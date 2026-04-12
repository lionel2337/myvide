/**
 * database.js — MyVibe
 * Membre 4 : Gestionnaire de Données (SQL Specialist)
 * Simulation de la base de données MySQL en JavaScript.
 * En production : remplacer par des requêtes PHP/MySQL.
 *
 * Tables simulées :
 *   - MEDIA  (livres, films, albums)
 *   - LIEUX_YAOUNDE (lieux réels à Yaoundé)
 */

const DB = {

  /* ==========================================
     TABLE : MEDIA
     Colonnes : id, type, titre, auteur/artiste,
     description, tags[], image_emoji, detail
  ========================================== */
  media: [

    /* -------- LIVRES -------- */
    {
      id: 'b01', type: 'book',
      titre: 'Fondation',
      auteur: 'Isaac Asimov',
      description: 'Une saga épique où un mathématicien tente de préserver la civilisation galactique à travers les âges sombres.',
      tags: ['science-fiction', 'espace', 'futur', 'technologie', 'galaxie'],
      emoji: '📚',
      detail: 'Premier tome de la célèbre série Fondation. Prix Hugo du meilleur roman de tous les temps. Un chef-d\'œuvre incontournable pour les amoureux de SF.'
    },
    {
      id: 'b02', type: 'book',
      titre: 'Dune',
      auteur: 'Frank Herbert',
      description: 'Sur une planète désertique, un jeune homme devient le messie d\'un peuple nomade au destin cosmique.',
      tags: ['science-fiction', 'aventure', 'politique', 'désert', 'futur'],
      emoji: '📚',
      detail: 'Roman culte, adapté au cinéma. Une œuvre monumentale sur le pouvoir, l\'écologie et la destinée.'
    },
    {
      id: 'b03', type: 'book',
      titre: 'Americanah',
      auteur: 'Chimamanda Ngozi Adichie',
      description: 'Le parcours émouvant d\'une femme nigériane entre Lagos, Londres et New York, naviguant identité et amour.',
      tags: ['romance', 'afrique', 'identité', 'société', 'diaspora'],
      emoji: '📚',
      detail: 'Primé au National Book Critics Circle. Un roman puissant sur la race, l\'amour et ce que signifie être africain dans le monde.'
    },
    {
      id: 'b04', type: 'book',
      titre: 'Le Soleil des Indépendances',
      auteur: 'Ahmadou Kourouma',
      description: 'La désillusion d\'un prince africain face aux indépendances postcoloniales, entre tradition et modernité.',
      tags: ['afrique', 'histoire', 'société', 'politique', 'culture'],
      emoji: '📚',
      detail: 'Œuvre fondatrice de la littérature africaine francophone. Kourouma révolutionne la langue française avec les rythmes du malinké.'
    },
    {
      id: 'b05', type: 'book',
      titre: 'Atomic Habits',
      auteur: 'James Clear',
      description: 'Comment de minuscules habitudes transforment radicalement votre vie — la science derrière les comportements humains.',
      tags: ['développement personnel', 'productivité', 'habitudes', 'psychologie', 'motivation'],
      emoji: '📚',
      detail: 'Best-seller mondial traduit en 50 langues. Un guide pratique et scientifique pour construire de bonnes habitudes.'
    },
    {
      id: 'b06', type: 'book',
      titre: 'Thinking, Fast and Slow',
      auteur: 'Daniel Kahneman',
      description: 'Le Prix Nobel explore nos deux systèmes de pensée : l\'un rapide et intuitif, l\'autre lent et rationnel.',
      tags: ['psychologie', 'science', 'philosophie', 'cerveau', 'décision'],
      emoji: '📚',
      detail: 'Révélation sur le fonctionnement de l\'esprit humain. Indispensable pour comprendre pourquoi nous prenons de mauvaises décisions.'
    },
    {
      id: 'b07', type: 'book',
      titre: 'Purple Hibiscus',
      auteur: 'Chimamanda Ngozi Adichie',
      description: 'Dans une famille nigériane sous emprise d\'un père tyrannique, une adolescente découvre la liberté et la résistance.',
      tags: ['afrique', 'famille', 'religion', 'liberté', 'romance'],
      emoji: '📚',
      detail: 'Premier roman bouleversant d\'Adichie. Une plongée intime dans la violence domestique et l\'émancipation.'
    },
    {
      id: 'b08', type: 'book',
      titre: 'The Hitchhiker\'s Guide to the Galaxy',
      auteur: 'Douglas Adams',
      description: 'Après la destruction de la Terre pour construire une autoroute galactique, un humain part à la dérive dans le cosmos.',
      tags: ['science-fiction', 'humour', 'aventure', 'espace', 'comédie'],
      emoji: '📚',
      detail: 'Comédie SF culte. La réponse à la grande question de la vie, l\'univers et tout le reste est : 42.'
    },

    /* -------- MUSIQUE -------- */
    {
      id: 'm01', type: 'music',
      titre: 'SOS — SZA',
      auteur: 'SZA',
      description: 'Un album R&B introspectif où SZA explore l\'amour, la trahison et la renaissance avec une voix cristalline.',
      tags: ['r&b', 'soul', 'pop', 'romance', 'émotions'],
      emoji: '🎵',
      detail: 'Album de l\'année 2023 selon plusieurs médias. 23 titres d\'une beauté brute. Écoute "Kill Bill" et "Snooze".'
    },
    {
      id: 'm02', type: 'music',
      titre: 'After Hours — The Weeknd',
      auteur: 'The Weeknd',
      description: 'Une plongée nocturne dans la mélancolie, l\'excès et l\'amour perdu — synthpop dark et voix envoûtante.',
      tags: ['r&b', 'pop', 'électronique', 'nuit', 'mélancolie'],
      emoji: '🎵',
      detail: 'Inclut "Blinding Lights", l\'un des singles les plus streamés de l\'histoire. Ambiance cinématographique totale.'
    },
    {
      id: 'm03', type: 'music',
      titre: 'Apollo — Salatiel',
      auteur: 'Salatiel',
      description: 'Le génie camerounais mêle afrobeats, R&B et sons du monde pour créer une signature musicale unique.',
      tags: ['afrobeats', 'cameroun', 'r&b', 'afrique', 'danse'],
      emoji: '🎵',
      detail: 'Producteur et artiste de Yaoundé, collaborateur de Beyoncé sur "Lion King: The Gift". Fierté camerounaise.'
    },
    {
      id: 'm04', type: 'music',
      titre: 'Starboy — The Weeknd',
      auteur: 'The Weeknd',
      description: 'Collaboration avec Daft Punk, un album électro-pop qui fusionne futurisme et sensualité urbaine.',
      tags: ['pop', 'électronique', 'r&b', 'danse', 'nuit'],
      emoji: '🎵',
      detail: 'Album multi-platine. Titre phare "I Feel It Coming" avec Daft Punk est devenu un classique de la décennie.'
    },
    {
      id: 'm05', type: 'music',
      titre: 'To Pimp a Butterfly — Kendrick Lamar',
      auteur: 'Kendrick Lamar',
      description: 'Un manifeste artistique mêlant jazz, funk et rap pour parler de race, d\'identité et de la condition noire en Amérique.',
      tags: ['rap', 'hip-hop', 'jazz', 'société', 'engagé'],
      emoji: '🎵',
      detail: 'Considéré comme l\'un des meilleurs albums de tous les temps. Une expérience musicale et intellectuelle sans équivalent.'
    },
    {
      id: 'm06', type: 'music',
      titre: 'Folklore — Taylor Swift',
      auteur: 'Taylor Swift',
      description: 'Un album indie-folk contemplatif, écrit en isolement, rempli d\'histoires fictives et de nostalgie douce.',
      tags: ['pop', 'folk', 'romance', 'émotions', 'indie'],
      emoji: '🎵',
      detail: 'Album de l\'année aux Grammy 2021. Swift y révèle une maturité artistique nouvelle. Écoute "august" et "exile".'
    },
    {
      id: 'm07', type: 'music',
      titre: 'Made in Lagos — Wizkid',
      auteur: 'Wizkid',
      description: 'Afrobeats doux et envoûtant — Wizkid pose une ambiance sensuelle et solaire depuis Lagos vers le monde.',
      tags: ['afrobeats', 'afrique', 'danse', 'romance', 'fête'],
      emoji: '🎵',
      detail: 'Album qui a propulsé l\'afrobeats dans les charts mondiaux. "Essence" feat. Tems est devenu un hymne planétaire.'
    },
    {
      id: 'm08', type: 'music',
      titre: 'Beethoven — Symphonies',
      auteur: 'Ludwig van Beethoven',
      description: 'Les neuf symphonies du génie de Bonn — de la tempête héroïque à l\'Ode à la Joie finale et universelle.',
      tags: ['classique', 'symphonie', 'instrumental', 'culture', 'intense'],
      emoji: '🎵',
      detail: 'La 9ème symphonie, composée sourd, reste l\'une des œuvres humaines les plus puissantes jamais créées.'
    },

    /* -------- FILMS -------- */
    {
      id: 'f01', type: 'film',
      titre: 'Interstellar',
      auteur: 'Christopher Nolan (réal.)',
      description: 'Des astronautes traversent un trou de ver pour sauver l\'humanité — entre physique quantique et amour paternel.',
      tags: ['science-fiction', 'espace', 'aventure', 'futur', 'émotion'],
      emoji: '🎬',
      detail: 'Chef-d\'œuvre de Nolan avec Hans Zimmer à la musique. Les théories sur la relativité sont scientifiquement exactes.'
    },
    {
      id: 'f02', type: 'film',
      titre: 'Black Panther',
      auteur: 'Ryan Coogler (réal.)',
      description: 'Le roi du Wakanda affronte les menaces sur son trône technologique — ode à l\'Afrique et à la fierté noire.',
      tags: ['afrique', 'aventure', 'action', 'société', 'super-héros'],
      emoji: '🎬',
      detail: 'Premier film de super-héros nominé à l\'Oscar du meilleur film. Révolution culturelle dans l\'industrie cinématographique.'
    },
    {
      id: 'f03', type: 'film',
      titre: 'Soul',
      auteur: 'Pixar / Pete Docter (réal.)',
      description: 'Un musicien de jazz décède avant son grand concert et explore le sens de la vie dans l\'au-delà.',
      tags: ['animation', 'musique', 'philosophie', 'jazz', 'émotion'],
      emoji: '🎬',
      detail: 'Oscar du meilleur film d\'animation 2021. Une méditation profonde et magnifique sur ce qui donne sens à notre existence.'
    },
    {
      id: 'f04', type: 'film',
      titre: 'Get Out',
      auteur: 'Jordan Peele (réal.)',
      description: 'Un jeune homme noir rencontre la famille blanche de sa petite amie — tension insidieuse et horreur sociale.',
      tags: ['thriller', 'horreur', 'société', 'psychologie', 'suspense'],
      emoji: '🎬',
      detail: 'Écrit et réalisé par Jordan Peele pour un budget de 4,5M$, recettes : 255M$. Commentaire brillant sur le racisme systémique.'
    },
    {
      id: 'f05', type: 'film',
      titre: 'La La Land',
      auteur: 'Damien Chazelle (réal.)',
      description: 'Deux artistes à Los Angeles s\'aiment le temps d\'un rêve entre jazz, danse et ambitions contrariées.',
      tags: ['romance', 'musique', 'danse', 'jazz', 'émotion'],
      emoji: '🎬',
      detail: '6 Oscars. Emma Stone et Ryan Gosling subliment ce musical mélancolique sur le prix des rêves.'
    },
    {
      id: 'f06', type: 'film',
      titre: 'The Matrix',
      auteur: 'Wachowski (réal.)',
      description: 'Un hacker découvre que la réalité n\'est qu\'une simulation — et se lève pour libérer l\'humanité.',
      tags: ['science-fiction', 'action', 'philosophie', 'technologie', 'futur'],
      emoji: '🎬',
      detail: 'Film fondateur du cyberpunk cinématographique. La pilule rouge ou bleue ? Trente ans après, on se pose encore la question.'
    },
  ],

  /* ==========================================
     TABLE : LIEUX_YAOUNDE
     Colonnes : id, nom, type, quartier,
     description, tags[], emoji, adresse, detail
  ========================================== */
  lieux: [
    {
      id: 'l01', type: 'place',
      nom: 'Piscine Omnisports de Yaoundé',
      categorie: 'Sport aquatique',
      quartier: 'Mfandena',
      description: 'Piscine olympique du Complexe Sportif Omnisports — idéale pour nager, s\'entraîner ou simplement se détendre.',
      tags: ['natation', 'sport', 'eau', 'fitness', 'santé'],
      emoji: '🏊',
      adresse: 'Complexe Sportif Omnisports, Mfandena, Yaoundé',
      detail: 'Piscine semi-olympique ouverte au public. Horaires : 7h-19h. Tarif : 1 000 - 2 000 FCFA. Idéal pour les nageurs réguliers.'
    },
    {
      id: 'l02', type: 'place',
      nom: 'Bibliothèque Nationale du Cameroun',
      categorie: 'Culture & Lecture',
      quartier: 'Nlongkak',
      description: 'La bibliothèque nationale rassemble des milliers d\'ouvrages africains et internationaux dans un espace studieux.',
      tags: ['lecture', 'livres', 'culture', 'étude', 'afrique'],
      emoji: '📖',
      adresse: 'Avenue de l\'Indépendance, Nlongkak, Yaoundé',
      detail: 'Accès gratuit avec inscription. Collections de littérature africaine, sciences, histoire. Salle de lecture calme et climatisée.'
    },
    {
      id: 'l03', type: 'place',
      nom: 'Canal Olympia Yaoundé',
      categorie: 'Cinéma',
      quartier: 'Bastos',
      description: 'Salle de cinéma moderne diffusant les derniers films africains et internationaux dans un confort premium.',
      tags: ['cinéma', 'film', 'culture', 'divertissement', 'sortie'],
      emoji: '🎬',
      adresse: 'Quartier Bastos, Yaoundé',
      detail: 'Cinéma avec écran géant, son Dolby. Séances à 14h, 17h et 20h. Tarif : 3 500 FCFA. Parking disponible.'
    },
    {
      id: 'l04', type: 'place',
      nom: 'Salle de Fitness Le Olympe',
      categorie: 'Sport & Fitness',
      quartier: 'Bastos',
      description: 'Salle de sport haut de gamme avec équipements modernes, cours collectifs et coaches certifiés.',
      tags: ['fitness', 'musculation', 'sport', 'santé', 'yoga'],
      emoji: '💪',
      adresse: 'Rue Nachtigal, Bastos, Yaoundé',
      detail: 'Équipements Technogym, cours de yoga, zumba, kickboxing. Abonnement mensuel : 15 000 - 25 000 FCFA.'
    },
    {
      id: 'l05', type: 'place',
      nom: 'Le Hilton Yaoundé — Bar & Lounge',
      categorie: 'Musique Live & Détente',
      quartier: 'Centre-ville',
      description: 'Bar panoramique avec musique live, cocktails raffinés et vue sur Yaoundé — l\'endroit parfait pour se détendre.',
      tags: ['musique', 'jazz', 'détente', 'sortie', 'lounge', 'r&b'],
      emoji: '🎶',
      adresse: 'Boulevard du 20 Mai, Centre-ville, Yaoundé',
      detail: 'Soirées musicales le vendredi et samedi. Ambiance élégante. Réservation conseillée. Cocktails à partir de 4 000 FCFA.'
    },
    {
      id: 'l06', type: 'place',
      nom: 'Musée National du Cameroun',
      categorie: 'Culture & Histoire',
      quartier: 'Quartier du Lac',
      description: 'Ancien palais présidentiel transformé en musée — art, histoire et traditions des 280 ethnies du Cameroun.',
      tags: ['culture', 'histoire', 'afrique', 'art', 'musée'],
      emoji: '🏛️',
      adresse: 'Quartier du Lac, Yaoundé',
      detail: 'Ouvert mar-dim 10h-17h. Entrée : 2 000 FCFA. Collections d\'arts premiers, masques rituels, objets royaux. Guide disponible.'
    },
    {
      id: 'l07', type: 'place',
      nom: 'Terrain de Running — Parc Mvog-Betsi',
      categorie: 'Sport Outdoor',
      quartier: 'Mvog-Betsi',
      description: 'Parc naturel avec pistes de jogging boisées, idéal pour courir, faire du vélo ou pratiquer la méditation en plein air.',
      tags: ['running', 'sport', 'nature', 'plein air', 'santé', 'fitness'],
      emoji: '🏃',
      adresse: 'Parc Zoologique de Mvog-Betsi, Yaoundé',
      detail: 'Accès gratuit. Piste de 3km dans un cadre verdoyant. Très fréquenté tôt le matin (6h-8h). Idéal pour sportifs matinaux.'
    },
    {
      id: 'l08', type: 'place',
      nom: 'Institut Français du Cameroun',
      categorie: 'Culture & Spectacles',
      quartier: 'Hippodrome',
      description: 'Espace culturel proposant concerts, expositions, projections de films et ateliers artistiques tout au long de l\'année.',
      tags: ['culture', 'musique', 'cinéma', 'art', 'concert', 'exposition'],
      emoji: '🎭',
      adresse: 'Avenue du Dr Jamot, Hippodrome, Yaoundé',
      detail: 'Programmation riche et variée. Médiathèque avec accès internet. Cours de français, atelier photo, soirées jazz. Entrée libre pour la médiathèque.'
    },
    {
      id: 'l09', type: 'place',
      nom: 'Stade Omnisports — Piste d\'Athlétisme',
      categorie: 'Athlétisme',
      quartier: 'Mfandena',
      description: 'Piste d\'athlétisme homologuée pour les entraînements de sprint, course de fond et sauts.',
      tags: ['sport', 'running', 'athlétisme', 'fitness', 'santé'],
      emoji: '🏟️',
      adresse: 'Stade Omnisports de Yaoundé, Mfandena',
      detail: 'Ouvert aux sportifs le matin et en fin d\'après-midi. Accès possible pour les clubs affiliés à la Fécaathlé.'
    },
    {
      id: 'l10', type: 'place',
      nom: 'Café de l\'Arbre à Palabres',
      categorie: 'Café & Lecture',
      quartier: 'Odza',
      description: 'Café littéraire chaleureux avec bibliothèque sur place, discussions culturelles et ambiance décontractée.',
      tags: ['lecture', 'café', 'culture', 'détente', 'discussion'],
      emoji: '☕',
      adresse: 'Quartier Odza, Yaoundé',
      detail: 'Café spécialité, Wi-Fi gratuit. Club de lecture chaque dimanche à 15h. Partenariat avec des auteurs locaux. Ambiance conviviale.'
    }
  ]
};
