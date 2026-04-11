-- ============================================================
--  FICHIER     : loisirs_yaounde.sql
--  MEMBRE 4    : Gestionnaire de Données (SQL Specialist)
--  BRANCHE GIT : feature-database
--  PROJET      : Application Loisirs – Yaoundé
--  TABLES      : Utilisateurs | Medias | Lieux_Yaounde
-- ============================================================

CREATE DATABASE IF NOT EXISTS loisirs_yaounde
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE loisirs_yaounde;

-- ============================================================
-- TABLE 1 : Utilisateurs
-- ============================================================
CREATE TABLE IF NOT EXISTS Utilisateurs (
    id_utilisateur   INT          AUTO_INCREMENT PRIMARY KEY,
    nom              VARCHAR(100) NOT NULL,
    prenom           VARCHAR(100) NOT NULL,
    email            VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe     VARCHAR(255) NOT NULL,
    ville            VARCHAR(100) DEFAULT 'Yaoundé',
    date_inscription DATETIME    DEFAULT CURRENT_TIMESTAMP,
    preferences      SET('cinema','musique','sport','art','lecture','theatre') DEFAULT NULL
);

INSERT INTO Utilisateurs (nom, prenom, email, mot_de_passe, preferences) VALUES
('Manga',      'Eric',       'eric.manga@email.cm',       SHA2('pass1234', 256), 'cinema,sport'),
('Atangana',   'Christelle', 'christelle.a@email.cm',     SHA2('azerty21', 256), 'musique,art'),
('Owona',      'Kevin',      'kevin.owona@email.cm',      SHA2('kevin99',  256), 'lecture,theatre'),
('Ngo Biyong', 'Laure',      'laure.ngo@email.cm',        SHA2('laure21',  256), 'sport,musique'),
('Fouda',      'Samuel',     'samuel.fouda@email.cm',     SHA2('sam007',   256), 'cinema,art');


-- ============================================================
-- TABLE 2 : Categories (référence pour Lieux_Yaounde)
-- ============================================================
CREATE TABLE IF NOT EXISTS Categories (
    id_categorie  INT         AUTO_INCREMENT PRIMARY KEY,
    nom_categorie VARCHAR(80) NOT NULL,
    icone         VARCHAR(10) DEFAULT NULL,
    description   TEXT
);

INSERT INTO Categories (nom_categorie, icone, description) VALUES
('Cinema',   '🎬', 'Salles de cinema, projections, cine-clubs'),
('Musique',  '🎵', 'Concerts, studios, scenes musicales'),
('Sport',    '⚽', 'Salles de sport, terrains, piscines, stades'),
('Art',      '🎨', 'Galeries, ateliers, expositions'),
('Lecture',  '📚', 'Bibliotheques, librairies, mediatheques'),
('Theatre',  '🎭', 'Salles de spectacle, compagnies theatrales');


-- ============================================================
-- TABLE 3 : Lieux_Yaounde  (données réelles – Yaoundé)
-- ============================================================
CREATE TABLE IF NOT EXISTS Lieux_Yaounde (
    id_lieu       INT            AUTO_INCREMENT PRIMARY KEY,
    id_categorie  INT            NOT NULL,
    nom_lieu      VARCHAR(150)   NOT NULL,
    adresse       VARCHAR(255)   NOT NULL,
    quartier      VARCHAR(100)   NOT NULL,
    telephone     VARCHAR(20)    DEFAULT NULL,
    horaires      VARCHAR(150)   DEFAULT 'Lun-Sam 08h-22h',
    latitude      DECIMAL(9, 6)  DEFAULT NULL,
    longitude     DECIMAL(9, 6)  DEFAULT NULL,
    note_moyenne  DECIMAL(3, 1)  DEFAULT 0.0,
    actif         BOOLEAN        DEFAULT TRUE,
    FOREIGN KEY (id_categorie) REFERENCES Categories(id_categorie)
);

INSERT INTO Lieux_Yaounde
    (id_categorie, nom_lieu, adresse, quartier, telephone, horaires, latitude, longitude, note_moyenne)
VALUES
-- 🎬 CINEMA
(1, 'Canal Olympia Yaounde',       'Rue Nachtigal, Centre-ville',           'Centre-ville', '+237 222 22 00 00', 'Mar-Dim 14h-23h',       3.866700, 11.516700, 4.5),
(1, 'Cine Club CCFYA',             'Institut Francais, Av. Charles de Gaulle','Bastos',     '+237 222 22 30 00', 'Mer-Dim 18h-22h',       3.875000, 11.510000, 4.2),
(1, 'Magic Land Cinema',           'Centre Commercial Ahala',               'Ahala',        '+237 690 11 22 33', 'Tlj 10h-23h',           3.830000, 11.505000, 3.8),

-- 🎵 MUSIQUE
(2, 'Palais des Congres de Yaounde','Avenue Konrad Adenauer',               'Centre-ville', '+237 222 23 10 00', 'Variable selon agenda', 3.866400, 11.508300, 4.7),
(2, 'Le Boeuf sur le Toit',        'Rue 1.820, Bastos',                     'Bastos',       '+237 677 77 77 01', 'Jeu-Sam 20h-02h',       3.878900, 11.506200, 4.3),
(2, 'Studio Sanza',                'Quartier Elig-Edzoa',                   'Elig-Edzoa',   '+237 694 11 22 33', 'Lun-Sam 09h-20h',       3.860000, 11.522000, 3.9),
(2, 'New Bell Music Stage',        'Avenue Kennedy, Mvan',                  'Mvan',         '+237 675 55 44 33', 'Ven-Dim 18h-01h',       3.845000, 11.513000, 4.0),

-- ⚽ SPORT
(3, 'Stade Ahmadou Ahidjo',        'Avenue du 20 Mai',                      'Centre-ville', '+237 222 22 50 00', 'Variable (matches)',     3.861700, 11.515700, 4.6),
(3, 'Complexe Sportif de Mfandena','Quartier Mfandena',                     'Mfandena',     '+237 222 21 00 10', 'Lun-Dim 06h-22h',       3.850000, 11.530000, 4.1),
(3, 'FitZone Gym Bastos',          'Rue 1.220, Bastos',                     'Bastos',       '+237 691 33 44 55', 'Lun-Sam 06h-22h',       3.877000, 11.508000, 4.4),
(3, 'Piscine Municipale Yaounde',  'Avenue de l Independance',              'Centre-ville', '+237 222 22 60 00', 'Mar-Dim 07h-18h',       3.864000, 11.517000, 3.7),
(3, 'Terrain de Basket Tsinga',    'Quartier Tsinga',                       'Tsinga',       NULL,                'Lun-Dim 06h-21h',       3.880000, 11.512000, 3.5),

-- 🎨 ART
(4, 'Galerie Artcameron',          'Rue 1.500, Bastos',                     'Bastos',       '+237 696 22 11 00', 'Lun-Sam 09h-18h',       3.876000, 11.509000, 4.3),
(4, 'Atelier Doual Art',           'Quartier Nlongkak',                     'Nlongkak',     '+237 699 44 55 66', 'Lun-Ven 09h-17h',       3.872000, 11.520000, 4.0),
(4, 'Musee National du Cameroun',  'Avenue du 20 Mai',                      'Centre-ville', '+237 222 22 45 00', 'Mar-Dim 09h-17h30',     3.863000, 11.514000, 4.6),

-- 📚 LECTURE
(5, 'Bibliotheque Nationale',      'Avenue du 20 Mai',                      'Centre-ville', '+237 222 22 55 00', 'Lun-Ven 08h-18h',       3.862500, 11.515000, 4.2),
(5, 'Mediatheque de Yaounde',      'Avenue Charles de Gaulle, Bastos',      'Bastos',       '+237 222 22 30 10', 'Lun-Sam 09h-18h',       3.874000, 11.511000, 4.4),
(5, 'Librairie des Peuples Noirs', 'Rue Castelnau, Mvog-Ada',               'Mvog-Ada',     '+237 222 23 05 00', 'Lun-Sam 08h-19h',       3.855000, 11.520000, 4.1),

-- 🎭 THEATRE
(6, 'Theatre National du Cameroun','Avenue du 20 Mai',                      'Centre-ville', '+237 222 22 40 00', 'Mer-Dim 18h-22h',       3.863500, 11.514500, 4.5),
(6, 'Compagnie Featurettes',       'Quartier Essos',                        'Essos',        '+237 677 88 99 00', 'Variable selon agenda', 3.858000, 11.525000, 4.0),
(6, 'Centre Culturel Camerounais', 'Rue Elig-Essono',                       'Elig-Essono',  '+237 222 21 80 00', 'Lun-Sam 09h-20h',       3.869000, 11.519000, 4.2);


-- ============================================================
-- TABLE 4 : Medias  (films, livres, morceaux liés aux lieux)
-- ============================================================
CREATE TABLE IF NOT EXISTS Medias (
    id_media     INT          AUTO_INCREMENT PRIMARY KEY,
    id_categorie INT          NOT NULL,
    titre        VARCHAR(200) NOT NULL,
    auteur       VARCHAR(150) DEFAULT NULL,
    annee        YEAR         DEFAULT NULL,
    description  TEXT,
    disponible   BOOLEAN      DEFAULT TRUE,
    FOREIGN KEY (id_categorie) REFERENCES Categories(id_categorie)
);

INSERT INTO Medias (id_categorie, titre, auteur, annee, description) VALUES
-- Films
(1, 'Les Saignantes',          'Jean-Pierre Bekolo',    2005, 'Film camerounais culte – thriller futuriste'),
(1, 'Quartier Mozart',         'Jean-Pierre Bekolo',    1992, 'Comedie dramatique, patrimoine cinema africain'),
(1, 'Notre etrangere',         'Sarah Bouyain',         2018, 'Film franco-burkinabe diffuse au CCFYA'),
-- Musique
(2, 'African Queen',           'Petit Pays',            1996, 'Ambassadeur de la musique camerounaise'),
(2, 'Sans domicile fixe',      'Lapiro de Mbanga',      1988, 'Makossa emblematique du Cameroun'),
(2, 'Chanter pour survivre',   'Charlotte Dipanda',     2012, 'Album soul-gospel camerounais'),
-- Livres
(5, 'Une vie de boy',          'Ferdinand Oyono',       1956, 'Roman classique camerounais – disponible BN'),
(5, 'Le vieux negre et la medaille','Ferdinand Oyono',  1956, 'Roman – Bibliotheque Nationale'),
(5, 'Ville cruelle',           'Eza Boto (Beti)',       1954, 'Litterature camerounaise fondatrice');


-- ============================================================
-- REQUÊTES SQL UTILES
-- ============================================================

-- 1. Tous les lieux actifs par catégorie
SELECT c.nom_categorie, l.nom_lieu, l.quartier, l.telephone, l.horaires
FROM Lieux_Yaounde l
JOIN Categories c ON l.id_categorie = c.id_categorie
WHERE l.actif = TRUE
ORDER BY c.nom_categorie, l.note_moyenne DESC;

-- 2. Top 5 des lieux les mieux notés
SELECT nom_lieu, quartier, note_moyenne,
       (SELECT nom_categorie FROM Categories WHERE id_categorie = l.id_categorie) AS categorie
FROM Lieux_Yaounde l
WHERE actif = TRUE
ORDER BY note_moyenne DESC
LIMIT 5;

-- 3. Lieux de sport à Yaoundé
SELECT nom_lieu, adresse, quartier, telephone, horaires, note_moyenne
FROM Lieux_Yaounde
WHERE id_categorie = (SELECT id_categorie FROM Categories WHERE nom_categorie = 'Sport')
  AND actif = TRUE
ORDER BY note_moyenne DESC;

-- 4. Lieux par quartier (ex : Bastos)
SELECT c.nom_categorie, l.nom_lieu, l.adresse, l.note_moyenne
FROM Lieux_Yaounde l
JOIN Categories c ON l.id_categorie = c.id_categorie
WHERE l.quartier = 'Bastos' AND l.actif = TRUE
ORDER BY l.note_moyenne DESC;

-- 5. Médias disponibles avec leur catégorie
SELECT c.nom_categorie, m.titre, m.auteur, m.annee, m.description
FROM Medias m
JOIN Categories c ON m.id_categorie = c.id_categorie
WHERE m.disponible = TRUE
ORDER BY c.nom_categorie, m.annee DESC;

-- 6. Nombre de lieux par catégorie
SELECT c.nom_categorie, COUNT(l.id_lieu) AS total_lieux
FROM Categories c
LEFT JOIN Lieux_Yaounde l ON c.id_categorie = l.id_categorie AND l.actif = TRUE
GROUP BY c.nom_categorie
ORDER BY total_lieux DESC;

-- 7. Utilisateurs intéressés par le cinéma
SELECT nom, prenom, email
FROM Utilisateurs
WHERE FIND_IN_SET('cinema', preferences) > 0
ORDER BY nom;

-- 8. Note moyenne globale par catégorie
SELECT c.nom_categorie,
       ROUND(AVG(l.note_moyenne), 2) AS note_moy,
       COUNT(l.id_lieu)              AS nb_lieux
FROM Categories c
JOIN Lieux_Yaounde l ON c.id_categorie = l.id_categorie
WHERE l.actif = TRUE
GROUP BY c.nom_categorie
ORDER BY note_moy DESC;

-- ============================================================
-- FIN DU FICHIER loisirs_yaounde.sql
-- ============================================================
