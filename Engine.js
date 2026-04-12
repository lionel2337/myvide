/**
 * engine.js — MyVibe
 * Membre 3 : Développeur Back-End (Le Cerveau)
 * Logique de recommandation — simulation de la logique PHP côté client.
 * En production : cette logique serait dans recommend.php
 *
 * Algorithme :
 *  1. Parsing du texte utilisateur → extraction de mots-clés
 *  2. Normalisation & enrichissement sémantique (synonymes/tags)
 *  3. Score de similarité (matching tags) pour chaque item
 *  4. Tri et sélection des meilleures recommandations par catégorie
 */

const RecommendationEngine = (() => {

  /* =============================================
     DICTIONNAIRE SÉMANTIQUE
     Associe les mots du langage naturel à des tags.
     Équivalent PHP : $semantic_map = [...];
  ============================================= */
  const SEMANTIC_MAP = {
    // Science-fiction & Tech
    'science-fiction': ['science-fiction', 'espace', 'futur', 'technologie'],
    'sf':              ['science-fiction', 'espace', 'futur'],
    'scifi':           ['science-fiction', 'espace', 'futur'],
    'espace':          ['science-fiction', 'espace', 'aventure'],
    'futur':           ['science-fiction', 'futur', 'technologie'],
    'technologie':     ['technologie', 'science-fiction', 'futur'],
    'robot':           ['science-fiction', 'technologie'],
    'galaxie':         ['science-fiction', 'espace'],

    // Musique
    'r&b':       ['r&b', 'soul', 'pop', 'romance'],
    'rnb':       ['r&b', 'soul', 'romance'],
    'musique':   ['musique', 'jazz', 'pop', 'concert'],
    'jazz':      ['jazz', 'musique', 'classique'],
    'rap':       ['rap', 'hip-hop', 'société'],
    'hip-hop':   ['hip-hop', 'rap'],
    'afrobeats': ['afrobeats', 'afrique', 'danse'],
    'pop':       ['pop', 'danse', 'fête'],
    'classique': ['classique', 'symphonie', 'instrumental'],
    'électro':   ['électronique', 'danse', 'nuit'],

    // Sport
    'natation':     ['natation', 'eau', 'sport', 'fitness'],
    'nager':        ['natation', 'eau', 'sport'],
    'piscine':      ['natation', 'eau', 'sport'],
    'sport':        ['sport', 'fitness', 'santé'],
    'fitness':      ['fitness', 'musculation', 'sport', 'santé'],
    'running':      ['running', 'sport', 'plein air', 'santé'],
    'courir':       ['running', 'sport', 'plein air'],
    'yoga':         ['yoga', 'fitness', 'santé'],
    'athlétisme':   ['athlétisme', 'sport', 'running'],
    'gym':          ['fitness', 'musculation', 'sport'],

    // Culture & Loisirs
    'lecture':    ['lecture', 'livres', 'culture'],
    'lire':       ['lecture', 'livres', 'culture'],
    'livre':      ['lecture', 'livres', 'culture'],
    'film':       ['film', 'cinéma', 'divertissement'],
    'cinéma':     ['cinéma', 'film', 'divertissement'],
    'voyage':     ['aventure', 'culture', 'nature'],
    'nature':     ['nature', 'plein air', 'randonnée'],
    'art':        ['art', 'culture', 'musée'],
    'musée':      ['musée', 'culture', 'histoire'],
    'histoire':   ['histoire', 'culture', 'afrique'],

    // Émotions / Ambiance
    'romantique': ['romance', 'émotion', 'musique'],
    'romance':    ['romance', 'émotion'],
    'mélancolie': ['mélancolie', 'émotion', 'musique'],
    'détente':    ['détente', 'lounge', 'musique'],
    'fête':       ['fête', 'danse', 'musique'],
    'danse':      ['danse', 'fête', 'afrobeats'],
    'calme':      ['détente', 'lecture', 'nature'],
    'aventure':   ['aventure', 'action', 'science-fiction'],
    'horreur':    ['horreur', 'thriller', 'suspense'],
    'suspense':   ['suspense', 'thriller', 'horreur'],

    // Identité / Culture africaine
    'afrique':    ['afrique', 'culture', 'histoire'],
    'cameroun':   ['afrique', 'afrobeats', 'culture'],
    'philosophie':['philosophie', 'science', 'psychologie'],
    'psychologie':['psychologie', 'science', 'cerveau'],
    'société':    ['société', 'politique', 'engagé'],
    'engagé':     ['engagé', 'société', 'philosophie'],
  };

  /* =============================================
     FONCTION : parseUserInput
     Extrait les mots-clés et tags depuis le texte
     Équivalent PHP : function parseUserInput($text)
  ============================================= */
  function parseUserInput(rawText) {
    // 1. Nettoyage du texte
    let text = rawText
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
      .replace(/[''`]/g, "'")
      .replace(/[^a-z0-9\s\-&]/g, ' ');

    // 2. Tokenisation
    const stopWords = new Set([
      'je', 'j', 'aime', 'adore', 'aimer', 'aussi', 'et', 'le', 'la', 'les',
      'un', 'une', 'des', 'de', 'du', 'au', 'aux', 'en', 'sur', 'pour',
      'avec', 'sans', 'mais', 'ou', 'si', 'que', 'qui', 'ce', 'cet',
      'suis', 'tres', 'vraiment', 'beaucoup', 'plutot', 'assez', 'me', 'ma',
      'mon', 'mes', 'grand', 'petit', 'nouveau', 'vieux', 'passion', 'fan'
    ]);

    const tokens = text
      .split(/[\s,;.!?()+]+/)
      .map(t => t.trim())
      .filter(t => t.length > 1 && !stopWords.has(t));

    // 3. Expansion sémantique : mots → tags
    const tagsFound = new Set();
    const keywordsRaw = [];

    tokens.forEach(token => {
      // Correspondance directe
      if (SEMANTIC_MAP[token]) {
        SEMANTIC_MAP[token].forEach(tag => tagsFound.add(tag));
        keywordsRaw.push(token);
      }
      // Correspondance partielle (token contenu dans une clé)
      else {
        Object.keys(SEMANTIC_MAP).forEach(key => {
          if (key.includes(token) || token.includes(key)) {
            SEMANTIC_MAP[key].forEach(tag => tagsFound.add(tag));
            if (!keywordsRaw.includes(token)) keywordsRaw.push(token);
          }
        });
        // Même le token lui-même comme tag
        tagsFound.add(token);
      }
    });

    return {
      tags: Array.from(tagsFound),
      keywords: [...new Set(keywordsRaw)]
    };
  }

  /* =============================================
     FONCTION : computeScore
     Calcule le score de correspondance (0-100)
     Équivalent PHP : function computeScore($item, $userTags)
  ============================================= */
  function computeScore(item, userTags) {
    const itemTags = item.tags || item.tags;
    if (!userTags.length || !itemTags.length) return 0;

    let matches = 0;
    userTags.forEach(uTag => {
      itemTags.forEach(iTag => {
        if (iTag === uTag) matches += 2;           // match exact → fort
        else if (iTag.includes(uTag) || uTag.includes(iTag)) matches += 1; // match partiel
      });
    });

    // Normalisation sur 100
    const maxPossible = userTags.length * 2;
    return Math.min(100, Math.round((matches / maxPossible) * 100));
  }

  /* =============================================
     FONCTION : recommend
     Orchestre la recommandation complète
     Équivalent PHP : function recommend($userInput)
     Retourne : { tags, keywords, results }
  ============================================= */
  function recommend(userInput) {
    const { tags: userTags, keywords } = parseUserInput(userInput);

    if (!userTags.length) {
      return { tags: [], keywords: [], results: [] };
    }

    // Scoring sur tous les items (media + lieux)
    const allItems = [
      ...DB.media.map(item => ({
        ...item,
        displayType: item.type,
        name: item.titre,
        sub: item.auteur
      })),
      ...DB.lieux.map(item => ({
        ...item,
        displayType: 'place',
        name: item.nom,
        sub: `${item.categorie} — ${item.quartier}`
      }))
    ];

    const scored = allItems
      .map(item => ({ ...item, score: computeScore(item, userTags) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    // Sélection : meilleur par catégorie + variété
    const categories = { book: null, music: null, film: null, place: null };
    const results = [];
    const used = new Set();

    // 1er passage : meilleur de chaque catégorie
    scored.forEach(item => {
      const cat = item.displayType;
      if (categories[cat] === null && !used.has(item.id)) {
        categories[cat] = item;
        results.push(item);
        used.add(item.id);
      }
    });

    // 2ème passage : compléter jusqu'à 6 résultats (variété)
    scored.forEach(item => {
      if (results.length >= 6) return;
      if (!used.has(item.id) && item.score >= 10) {
        results.push(item);
        used.add(item.id);
      }
    });

    // Si pas assez, prendre des items aléatoires
    if (results.length < 3) {
      allItems.forEach(item => {
        if (results.length >= 4) return;
        if (!used.has(item.id)) {
          results.push({ ...item, score: 5 });
          used.add(item.id);
        }
      });
    }

    return {
      tags: userTags,
      keywords,
      results: results.slice(0, 6)
    };
  }

  // API publique
  return { recommend, parseUserInput };

})();
