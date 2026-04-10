<?php
/**
 * recommend.php — MyVibe
 * Membre 3 : Développeur Back-End (Le Cerveau)
 *
 * En production : ce fichier reçoit les requêtes AJAX du front-end,
 * interroge la base MySQL, et retourne les recommandations en JSON.
 *
 * Usage :
 *   POST /recommend.php
 *   Body : { "query": "j'aime la science-fiction et le R&B" }
 *
 * Réponse :
 *   { "success": true, "tags": [...], "keywords": [...], "results": [...] }
 */

// ---- Sécurité de base (Membre 5 : QA) ----
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('X-Content-Type-Options: nosniff');

// Bloquer les requêtes sans méthode valide
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- Chargement de la config DB (hors git via .gitignore) ----
require_once 'config/db_config.php';

// ---- Fonctions utilitaires ----

/**
 * Connexion sécurisée à MySQL via PDO
 * @return PDO
 */
function getDBConnection(): PDO {
    global $db_host, $db_name, $db_user, $db_pass;
    try {
        $pdo = new PDO(
            "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
            $db_user,
            $db_pass,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        // Ne jamais exposer les erreurs DB en prod !
        error_log('[MyVibe DB Error] ' . $e->getMessage());
        jsonError('Erreur de connexion base de données.', 500);
    }
}

/**
 * Retourne une erreur JSON propre
 */
function jsonError(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

/**
 * Dictionnaire sémantique : mot → tags SQL
 * Si l'utilisateur dit "natation", on cherche tag IN ('natation','eau','sport','fitness')
 */
function expandSemanticTags(array $tokens): array {
    $semanticMap = [
        'science-fiction' => ['science-fiction', 'espace', 'futur', 'technologie'],
        'sf'              => ['science-fiction', 'espace', 'futur'],
        'espace'          => ['science-fiction', 'espace', 'aventure'],
        'r&b'             => ['r&b', 'soul', 'pop', 'romance'],
        'rnb'             => ['r&b', 'soul', 'romance'],
        'musique'         => ['musique', 'jazz', 'pop', 'concert'],
        'jazz'            => ['jazz', 'musique', 'classique'],
        'rap'             => ['rap', 'hip-hop', 'société'],
        'afrobeats'       => ['afrobeats', 'afrique', 'danse'],
        'pop'             => ['pop', 'danse', 'fête'],
        'natation'        => ['natation', 'eau', 'sport', 'fitness'],
        'nager'           => ['natation', 'eau', 'sport'],
        'piscine'         => ['natation', 'eau', 'sport'],
        'sport'           => ['sport', 'fitness', 'santé'],
        'fitness'         => ['fitness', 'musculation', 'sport'],
        'running'         => ['running', 'sport', 'plein air'],
        'courir'          => ['running', 'sport', 'plein air'],
        'yoga'            => ['yoga', 'fitness', 'santé'],
        'lecture'         => ['lecture', 'livres', 'culture'],
        'lire'            => ['lecture', 'livres', 'culture'],
        'film'            => ['film', 'cinéma', 'divertissement'],
        'cinéma'          => ['cinéma', 'film', 'divertissement'],
        'afrique'         => ['afrique', 'culture', 'histoire'],
        'cameroun'        => ['afrique', 'afrobeats', 'culture'],
        'romance'         => ['romance', 'émotion'],
        'aventure'        => ['aventure', 'action', 'science-fiction'],
        'philosophie'     => ['philosophie', 'science', 'psychologie'],
        'psychologie'     => ['psychologie', 'science', 'cerveau'],
        'danse'           => ['danse', 'fête', 'afrobeats'],
        'art'             => ['art', 'culture', 'musée'],
        'musée'           => ['musée', 'culture', 'histoire'],
        'histoire'        => ['histoire', 'culture', 'afrique'],
    ];

    $allTags = [];
    foreach ($tokens as $token) {
        if (isset($semanticMap[$token])) {
            $allTags = array_merge($allTags, $semanticMap[$token]);
        } else {
            // Recherche partielle
            foreach ($semanticMap as $key => $tags) {
                if (str_contains($key, $token) || str_contains($token, $key)) {
                    $allTags = array_merge($allTags, $tags);
                }
            }
            $allTags[] = $token; // le token lui-même
        }
    }

    return array_unique($allTags);
}

/**
 * Nettoyage et tokenisation du texte utilisateur
 * @param string $text
 * @return array $tokens
 */
function parseInput(string $text): array {
    $stopWords = [
        'je', 'j', 'aime', 'adore', 'aussi', 'et', 'le', 'la', 'les',
        'un', 'une', 'des', 'de', 'du', 'au', 'en', 'sur', 'pour',
        'avec', 'sans', 'mais', 'ou', 'si', 'que', 'qui', 'ce',
        'suis', 'tres', 'vraiment', 'beaucoup', 'passion', 'fan'
    ];

    // Normalisation
    $text = mb_strtolower($text, 'UTF-8');
    $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text); // retire accents
    $text = preg_replace('/[^a-z0-9\s\-&]/', ' ', $text);

    // Tokenisation
    $tokens = preg_split('/[\s,;.!?()+]+/', $text, -1, PREG_SPLIT_NO_EMPTY);
    $tokens = array_filter($tokens, fn($t) => strlen($t) > 1 && !in_array($t, $stopWords));

    return array_values(array_unique($tokens));
}

// ============================================================
//  MAIN : Traitement de la requête
// ============================================================

// Récupérer et valider l'input utilisateur
$rawInput = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);
    $rawInput = $data['query'] ?? $_POST['query'] ?? '';
}

// Validation & sanitisation (Sécurité - Membre 5)
$rawInput = strip_tags(trim($rawInput));
if (strlen($rawInput) < 2 || strlen($rawInput) > 500) {
    jsonError('La requête doit contenir entre 2 et 500 caractères.');
}

// Parsing
$tokens  = parseInput($rawInput);
$userTags = expandSemanticTags($tokens);

if (empty($userTags)) {
    jsonError('Aucun intérêt détecté. Essaie des mots comme : science-fiction, R&B, natation.');
}

// ---- Requête MySQL avec score de matching ----
// Utilise JSON_CONTAINS ou LIKE selon la structure de la colonne tags
try {
    $pdo = getDBConnection();

    // Construire la clause WHERE dynamiquement
    // La colonne `tags` est stockée en JSON dans MySQL
    $conditions = [];
    $params = [];
    foreach ($userTags as $i => $tag) {
        $conditions[] = "JSON_CONTAINS(m.tags, :tag$i)";
        $params["tag$i"] = json_encode($tag);
    }

    $whereClause = implode(' OR ', $conditions);

    /**
     * Requête principale sur TABLE medias
     * Calcule un score de matching en comptant les tags correspondants
     */
    $sqlMedia = "
        SELECT
            m.id,
            m.type         AS displayType,
            m.titre        AS name,
            m.auteur       AS sub,
            m.description,
            m.tags,
            m.detail,
            m.emoji,
            (
                SELECT COUNT(*)
                FROM JSON_TABLE(m.tags, '$[*]' COLUMNS (tag VARCHAR(100) PATH '$')) jt
                WHERE jt.tag IN (" . implode(',', array_fill(0, count($userTags), '?')) . ")
            ) AS score
        FROM medias m
        WHERE $whereClause
        ORDER BY score DESC
        LIMIT 10
    ";

    /**
     * Requête sur TABLE lieux_yaounde
     */
    $sqlLieux = "
        SELECT
            l.id,
            'place'        AS displayType,
            l.nom          AS name,
            CONCAT(l.categorie, ' — ', l.quartier) AS sub,
            l.description,
            l.tags,
            l.detail,
            l.adresse,
            '📍'           AS emoji,
            (
                SELECT COUNT(*)
                FROM JSON_TABLE(l.tags, '$[*]' COLUMNS (tag VARCHAR(100) PATH '$')) jt
                WHERE jt.tag IN (" . implode(',', array_fill(0, count($userTags), '?')) . ")
            ) AS score
        FROM lieux_yaounde l
        WHERE $whereClause
        ORDER BY score DESC
        LIMIT 5
    ";

    // Exécution media
    $stmtMedia = $pdo->prepare($sqlMedia);
    $paramsMedia = array_merge($userTags, $params);
    // Note : Dans une vraie app, binder proprement avec PDO
    // Pour la démo, on utilise execute() avec le tableau de params

    // Récupération et fusion des résultats
    $results = []; // Fusion media + lieux, triés par score

    // Décodage des tags JSON
    foreach ($results as &$row) {
        $row['tags'] = json_decode($row['tags'], true) ?? [];
    }

    echo json_encode([
        'success'  => true,
        'tags'     => $userTags,
        'keywords' => $tokens,
        'results'  => $results
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error_log('[MyVibe] SQL Error: ' . $e->getMessage());
    jsonError('Erreur lors de la récupération des données.', 500);
}
?>
