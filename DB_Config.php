<?php
/**
 * config/db_config.php — MyVibe
 * Membre 5 : QA & DevOps (Sécurité)
 *
 * ⚠️  CE FICHIER EST DANS .gitignore — NE JAMAIS COMMITTER !
 * Contient les identifiants de connexion à la base de données.
 *
 * En production : utiliser des variables d'environnement
 *   $db_pass = getenv('MYVIBE_DB_PASS');
 */

// Identifiants de connexion MySQL
$db_host = 'localhost';
$db_name = 'myvibe_db';
$db_user = 'myvibe_user';     // ← Changer en production
$db_pass = 'VOTRE_MOT_DE_PASSE_ICI';  // ← REMPLACER !

// Optionnel : URL de base pour les assets
define('BASE_URL', 'http://localhost/myvibe/');
define('APP_ENV', 'development'); // 'development' ou 'production'

// En mode production : désactiver l'affichage des erreurs
if (APP_ENV === 'production') {
    ini_set('display_errors', 0);
    error_reporting(0);
}