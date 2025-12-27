-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : sam. 27 déc. 2025 à 07:35
-- Version du serveur : 8.0.44
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `quickpop`
--

-- --------------------------------------------------------

--
-- Structure de la table `app_settings`
--

CREATE TABLE `app_settings` (
  `id` int NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `app_name_one` varchar(100) NOT NULL DEFAULT 'Quick',
  `app_name_two` varchar(100) NOT NULL DEFAULT 'Pop',
  `version` varchar(50) DEFAULT '1.0.0',
  `maintenance_mode` tinyint(1) DEFAULT '0',
  `support_email` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `default_language` varchar(50) DEFAULT 'Français',
  `notification_preferences` json DEFAULT NULL,
  `app_name` varchar(100) DEFAULT 'QuickPop',
  `max_video_size_mb` int DEFAULT '500',
  `allowed_video_formats` varchar(255) DEFAULT 'mp4,webm,mov,avi,mkv',
  `cloud_storage_provider` varchar(50) DEFAULT 'aws_s3',
  `cloud_storage_bucket` varchar(150) DEFAULT NULL,
  `notifications_enabled` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `app_settings`
--

INSERT INTO `app_settings` (`id`, `logo_url`, `app_name_one`, `app_name_two`, `version`, `maintenance_mode`, `support_email`, `created_at`, `updated_at`, `default_language`, `notification_preferences`, `app_name`, `max_video_size_mb`, `allowed_video_formats`, `cloud_storage_provider`, `cloud_storage_bucket`, `notifications_enabled`) VALUES
(1, NULL, 'Quick', 'Pop', '1.0.0', 0, 'ahobautfrederick@gmail.com', '2025-12-24 21:41:03', '2025-12-25 00:48:25', 'Français', '[{\"label\": \"Nouveaux utilisateurs\", \"checked\": true}, {\"label\": \"Certifications obtenues\", \"checked\": true}, {\"label\": \"Modules complétés\", \"checked\": true}, {\"label\": \"Rapports hebdomadaires\", \"checked\": true}]', 'QuickPop', 500, 'mp4,webm,mov,avi,mkv', 'aws_s3', NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Détartages', NULL),
(2, 'Ruptures', NULL),
(3, 'Technique', NULL),
(4, 'ADM', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `certifications`
--

CREATE TABLE `certifications` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `validity_months` int DEFAULT '12',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `certifications`
--

INSERT INTO `certifications` (`id`, `name`, `validity_months`, `created_at`, `description`) VALUES
(9, 'Entretien quotidien tourelle à boissons', 12, '2025-12-24 21:00:41', NULL),
(10, 'Entretien quotidien lave-vaisselle', 12, '2025-12-24 22:07:16', NULL),
(11, 'Entretien bimensuel tourelle à boissons', 12, '2025-12-25 00:25:29', NULL),
(12, 'Entretien mensuel steamer', 12, '2025-12-25 00:41:14', NULL),
(13, 'Entretien hebdo tourelle à boissons', 12, '2025-12-25 00:44:03', NULL),
(14, 'Entretien bimensuel lave-vaisselle', 12, '2025-12-25 21:27:00', NULL),
(15, 'Entretien mensuel lave-vaisselle', 12, '2025-12-25 21:43:57', NULL),
(16, 'Entretien bimensuel séchoir', 12, '2025-12-25 21:46:03', NULL),
(17, 'Entretien hebdo steamer', 12, '2025-12-26 02:40:52', NULL),
(18, 'Entretien quotidien steamer', 12, '2025-12-26 02:42:30', NULL),
(19, 'Entretien hebdo séchoir', 12, '2025-12-26 02:58:08', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `video_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id` int NOT NULL,
  `video_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `video_id`, `user_id`, `created_at`) VALUES
(1, 58, 5, '2025-12-24 20:35:19'),
(2, 55, 5, '2025-12-24 20:44:45'),
(3, 51, 7, '2025-12-25 00:38:15'),
(4, 57, 7, '2025-12-25 00:41:32'),
(5, 52, 5, '2025-12-25 01:42:06'),
(6, 61, 5, '2025-12-26 02:39:00');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `body` text NOT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `status` enum('unread','read') DEFAULT 'unread',
  `url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `body`, `type`, `status`, `url`, `created_at`, `read_at`) VALUES
(16, 7, 'Test Notification System', 'Ceci est un test pour vérifier l\'historique.', 'info', 'read', NULL, '2025-12-24 23:36:31', '2025-12-25 00:08:19'),
(19, 7, 'Message Admin', 'Nouvelle vidéo ', 'info', 'read', NULL, '2025-12-24 23:44:15', '2025-12-25 00:08:20'),
(22, 7, 'Message Admin', 'T’y', 'info', 'read', NULL, '2025-12-24 23:44:29', '2025-12-25 00:08:21'),
(25, 7, 'Test Broadcast', 'This is a test broadcast notification', 'info', 'read', '/test', '2025-12-24 23:52:11', '2025-12-25 00:08:22'),
(28, 7, 'Nouvelle Vidéo Disponible !', 'Découvrez \"fff\" dans la catégorie 3.', 'success', 'read', '/app/play?id=63', '2025-12-24 23:59:01', '2025-12-25 00:08:24'),
(29, 5, 'Nouvelle Vidéo Disponible !', 'Découvrez \"fff\" dans la catégorie 3.', 'success', 'read', '/app/play?id=63', '2025-12-24 23:59:01', '2025-12-24 23:59:25'),
(31, 7, 'Nouvelle Vidéo Disponible !', 'Découvrez \"cc\" dans la catégorie 4.', 'success', 'read', '/app/play?id=64', '2025-12-25 00:00:40', '2025-12-25 00:08:27'),
(32, 5, 'Nouvelle Vidéo Disponible !', 'Découvrez \"cc\" dans la catégorie 4.', 'success', 'read', '/app/play?id=64', '2025-12-25 00:00:40', '2025-12-25 00:07:34'),
(34, 7, 'Nouvelle Vidéo Disponible !', 'Découvrez \"million\" dans la catégorie Technique.', 'success', 'read', '/app/play?id=65', '2025-12-25 00:07:23', '2025-12-25 00:08:26'),
(35, 5, 'Nouvelle Vidéo Disponible !', 'Découvrez \"million\" dans la catégorie Technique.', 'success', 'read', '/app/play?id=65', '2025-12-25 00:07:23', '2025-12-25 00:17:58'),
(37, 7, 'Message Admin', 'test notif', 'info', 'read', NULL, '2025-12-25 21:22:10', '2025-12-26 00:36:07'),
(38, 5, 'Message Admin', 'test notif', 'info', 'read', NULL, '2025-12-25 21:22:10', '2025-12-25 21:25:02'),
(40, 5, 'Certification obtenue !', 'Félicitations ! Vous avez obtenu la certification : Entretien bimensuel lave-vaisselle', 'success', 'read', '/certifications', '2025-12-25 21:27:00', '2025-12-25 21:42:36'),
(41, 7, 'Message Admin', 'vv', 'info', 'read', NULL, '2025-12-25 21:30:38', '2025-12-26 00:36:07'),
(42, 5, 'Message Admin', 'vv', 'info', 'read', NULL, '2025-12-25 21:30:38', '2025-12-25 21:42:38'),
(44, 7, 'Message Admin', 'vv', 'info', 'read', NULL, '2025-12-25 21:31:57', '2025-12-26 00:36:06'),
(45, 5, 'Message Admin', 'vv', 'info', 'read', NULL, '2025-12-25 21:31:57', '2025-12-25 21:42:35'),
(47, 7, 'Message Admin', 'bbjjj', 'info', 'read', NULL, '2025-12-25 21:33:21', '2025-12-26 00:36:05'),
(48, 5, 'Message Admin', 'bbjjj', 'info', 'read', NULL, '2025-12-25 21:33:21', '2025-12-25 21:42:34'),
(50, 7, 'Message Admin', 'QuickPop/backend\n/Config/\nFrédérickFrédérick\nFrédérick\nand\nFrédérick\ntest jenkis\nc5910e6\n · \n18 hours ago\nName	Last commit message	Last commit date\n..\ndb.js\ntest jenkis\n18 hours ago\nmailer.js', 'info', 'read', NULL, '2025-12-25 21:34:06', '2025-12-26 00:36:04'),
(51, 5, 'Message Admin', 'QuickPop/backend\n/Config/\nFrédérickFrédérick\nFrédérick\nand\nFrédérick\ntest jenkis\nc5910e6\n · \n18 hours ago\nName	Last commit message	Last commit date\n..\ndb.js\ntest jenkis\n18 hours ago\nmailer.js', 'info', 'read', NULL, '2025-12-25 21:34:06', '2025-12-25 21:46:39'),
(53, 7, 'Message Admin', 'bbbbbbbbrrrrrrrrreeee', 'info', 'read', NULL, '2025-12-25 21:40:40', '2025-12-26 00:36:04'),
(54, 5, 'Message Admin', 'bbbbbbbbrrrrrrrrreeee', 'info', 'read', NULL, '2025-12-25 21:40:40', '2025-12-25 21:42:31'),
(56, 7, 'Message Admin', 'ooo', 'info', 'read', NULL, '2025-12-25 21:41:16', '2025-12-26 00:36:03'),
(57, 5, 'Message Admin', 'ooo', 'info', 'read', NULL, '2025-12-25 21:41:16', '2025-12-25 21:47:29'),
(59, 7, 'Message Admin', 'jjjj', 'info', 'read', NULL, '2025-12-25 21:41:28', '2025-12-26 00:36:01'),
(60, 5, 'Message Admin', 'jjjj', 'info', 'read', NULL, '2025-12-25 21:41:28', '2025-12-25 21:47:18'),
(62, 5, 'Certification obtenue !', 'Félicitations ! Vous avez obtenu la certification : Entretien mensuel lave-vaisselle', 'success', 'read', '/certifications', '2025-12-25 21:43:57', '2025-12-25 21:46:42'),
(63, 5, 'Certification obtenue !', 'Félicitations ! Vous avez obtenu la certification : Entretien bimensuel séchoir', 'success', 'read', '/certifications', '2025-12-25 21:46:03', '2025-12-25 21:47:02'),
(64, 7, 'Message Admin', 'notification test', 'info', 'unread', NULL, '2025-12-26 00:54:11', NULL),
(65, 5, 'Message Admin', 'notification test', 'info', 'read', NULL, '2025-12-26 00:54:11', '2025-12-26 01:03:56'),
(67, 5, 'Certification obtenue !', 'Félicitations ! Vous avez obtenu la certification : Entretien hebdo steamer', 'success', 'read', '/certifications', '2025-12-26 02:40:52', '2025-12-26 02:41:21'),
(68, 5, 'Certification obtenue !', 'Félicitations ! Vous avez obtenu la certification : Entretien mensuel steamer', 'success', 'read', '/certifications', '2025-12-26 02:41:34', '2025-12-26 02:55:18'),
(69, 5, 'Certification obtenue !', 'Félicitations ! Vous avez obtenu la certification : Entretien quotidien steamer', 'success', 'read', '/certifications', '2025-12-26 02:42:30', '2025-12-26 02:55:19'),
(70, 5, 'Certification obtenue !', 'Félicitations ! Vous avez obtenu la certification : Entretien hebdo séchoir', 'success', 'read', '/certifications', '2025-12-26 02:58:08', '2025-12-26 09:38:22'),
(71, 5, 'Certification obtenue !', 'Félicitations ! Vous avez obtenu la certification : Entretien hebdo tourelle à boissons', 'success', 'read', '/certifications', '2025-12-26 03:15:38', '2025-12-26 09:38:19');

-- --------------------------------------------------------

--
-- Structure de la table `playlists`
--

CREATE TABLE `playlists` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `playlist_videos`
--

CREATE TABLE `playlist_videos` (
  `id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `video_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ratings`
--

CREATE TABLE `ratings` (
  `id` int NOT NULL,
  `video_id` int NOT NULL,
  `user_id` int NOT NULL,
  `score` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Déchargement des données de la table `ratings`
--

INSERT INTO `ratings` (`id`, `video_id`, `user_id`, `score`, `created_at`) VALUES
(1, 61, 5, 5, '2025-12-24 20:03:32'),
(15, 58, 5, 2, '2025-12-24 22:07:08'),
(16, 52, 5, 3, '2025-12-25 01:47:56'),
(17, 49, 5, 4, '2025-12-25 02:11:02'),
(18, 56, 5, 5, '2025-12-25 05:37:33'),
(19, 55, 5, 5, '2025-12-26 00:54:53');

-- --------------------------------------------------------

--
-- Structure de la table `support`
--

CREATE TABLE `support` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `subject` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `support`
--

INSERT INTO `support` (`id`, `user_id`, `subject`, `message`, `status`, `created_at`) VALUES
(1, 5, 'Hhh', 'Hhhhhh', 'open', '2025-12-26 01:21:32');

-- --------------------------------------------------------

--
-- Structure de la table `trainings`
--

CREATE TABLE `trainings` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `estimated_time` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `video_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `trainings`
--

INSERT INTO `trainings` (`id`, `title`, `description`, `estimated_time`, `created_at`, `video_id`) VALUES
(11, 'Management d\'équipe', NULL, '2h 15min', '2025-12-18 21:18:33', NULL),
(12, 'Procédures d\'urgence', NULL, '1h 30min', '2025-12-18 21:18:33', NULL),
(13, 'Hygiène HACCP', NULL, '4h 00min', '2025-12-18 21:18:33', NULL),
(14, 'Accueil Client', NULL, '1h 45min', '2025-12-18 21:18:33', NULL),
(15, 'Film d’action explosif', 'Un film rempli de scènes d’action spectaculaires et de rebondissements.', '0min', '2025-12-18 21:19:18', 9),
(16, 'Entretien quotidien lave-vaisselle', 'Maintenance quotidienne de la machine lave-vaisselle : nettoyage des composants, vérification des cycles, respect des normes sanitaires et prévention des dysfonctionnements afin d’assurer un lavage efficace.', '2min', '2025-12-24 20:35:34', 58),
(17, 'Entretien hebdo tourelle à boissons', 'Maintenance hebdomadaire de la tourelle à boissons : nettoyage approfondi des circuits, contrôle des réglages, vérification de l’hygiène et prévention des anomalies pour garantir une qualité constante.', '1min', '2025-12-24 20:36:14', 55),
(18, 'Entretien quotidien tourelle à boissons', 'Maintenance journalière de la tourelle à boissons : assainissement des équipements, contrôle opérationnel, respect des normes sanitaires et anticipation des anomalies pour assurer une prestation irréprochable.', '2min', '2025-12-24 21:00:40', 61),
(19, 'Entretien bimensuel tourelle à boissons', 'Maintenance hebdomadaire du lave-vaisselle : nettoyage approfondi des filtres et bras de lavage, contrôle du fonctionnement général, vérification de l’hygiène et prévention des anomalies pour garantir une efficacité constante.', '3min', '2025-12-25 00:25:20', 51),
(20, 'Entretien bimensuel tourelle à boissons', 'Maintenance hebdomadaire du lave-vaisselle : nettoyage approfondi des filtres et bras de lavage, contrôle du fonctionnement général, vérification de l’hygiène et prévention des anomalies pour garantir une efficacité constante.', '3min', '2025-12-25 00:25:20', 51),
(21, 'Entretien bimensuel tourelle à boissons', 'Maintenance hebdomadaire du lave-vaisselle : nettoyage approfondi des filtres et bras de lavage, contrôle du fonctionnement général, vérification de l’hygiène et prévention des anomalies pour garantir une efficacité constante.', '3min', '2025-12-25 00:25:20', 51),
(22, 'Entretien mensuel steamer', 'Maintenance mensuelle du steamer : détartrage, inspection des éléments techniques, réglages nécessaires et contrôle des performances pour garantir un fonctionnement durable et sécurisé.', '2min', '2025-12-25 00:39:14', 57),
(23, 'Entretien mensuel steamer', 'Maintenance mensuelle du steamer : détartrage, inspection des éléments techniques, réglages nécessaires et contrôle des performances pour garantir un fonctionnement durable et sécurisé.', '2min', '2025-12-25 00:39:14', 57),
(24, 'Entretien hebdo lave-vaisselle', 'Maintenance hebdomadaire du lave-vaisselle : nettoyage approfondi des filtres et bras de lavage, contrôle du fonctionnement général, vérification de l’hygiène et prévention des anomalies pour garantir une efficacité constante.', '3min', '2025-12-25 01:41:49', 52),
(25, 'Entretien mensuel lave-vaisselle', 'Maintenance mensuelle du lave-vaisselle : détartrage, contrôle des organes mécaniques, ajustements techniques et vérification des performances afin d’assurer fiabilité et longévité de l’équipement.', '3min', '2025-12-25 05:27:52', 56),
(26, 'Entretien mensuel lave-vaisselle', 'Maintenance mensuelle du lave-vaisselle : détartrage, contrôle des organes mécaniques, ajustements techniques et vérification des performances afin d’assurer fiabilité et longévité de l’équipement.', '3min', '2025-12-25 05:27:52', 56),
(27, 'Entretien mensuel lave-vaisselle', 'Maintenance mensuelle du lave-vaisselle : détartrage, contrôle des organes mécaniques, ajustements techniques et vérification des performances afin d’assurer fiabilité et longévité de l’équipement.', '3min', '2025-12-25 05:27:52', 56),
(28, 'Entretien mensuel lave-vaisselle', 'Maintenance mensuelle du lave-vaisselle : détartrage, contrôle des organes mécaniques, ajustements techniques et vérification des performances afin d’assurer fiabilité et longévité de l’équipement.', '3min', '2025-12-25 05:27:52', 56),
(29, 'Entretien bimensuel lave-vaisselle', 'Maintenance bimensuelle du lave-vaisselle : nettoyage complet des filtres et joints, inspection des composants, vérification des performances et prévention des pannes pour garantir un fonctionnement fiable et durable.', '3min', '2025-12-25 21:27:00', 49),
(30, 'Entretien bimensuel séchoir', 'Maintenance bimensuelle du séchoir : nettoyage des filtres et conduits, inspection des éléments techniques, vérification du rendement et prévention des dysfonctionnements pour assurer une utilisation sûre et performante.\n', '3min', '2025-12-25 21:45:44', 50),
(31, 'Entretien hebdo steamer', 'Maintenance hebdomadaire du steamer : nettoyage renforcé, contrôle des composants, vérification des réglages et prévention des dysfonctionnements afin d’assurer une performance optimale.', '2min', '2025-12-26 02:40:33', 54),
(32, 'Entretien quotidien steamer', 'Maintenance quotidienne du steamer : nettoyage approfondi, contrôle du fonctionnement, respect des règles d’hygiène et prévention des pannes pour garantir une utilisation optimale.', '1min', '2025-12-26 02:42:30', 60),
(33, 'Entretien hebdo séchoir', 'Maintenance hebdomadaire du steamer : nettoyage renforcé, contrôle des composants, vérification des réglages et prévention des dysfonctionnements afin d’assurer une performance optimale.', '2min', '2025-12-26 02:58:08', 53);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `code` int NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar_url` varchar(500) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_code` varchar(10) DEFAULT NULL,
  `reset_expires` timestamp NULL DEFAULT NULL,
  `restaurant` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `fullname`, `code`, `email`, `password`, `role`, `is_active`, `last_login_at`, `created_at`, `avatar_url`, `last_login`, `updated_at`, `reset_code`, `reset_expires`, `restaurant`) VALUES
(5, 'Ayméric Ahobaut', 39, 'ahobautfrederick@gmail.com', '$2b$10$noc4epAlwtqNaL.LbbR5lememahM/drRHCem.lbMVLXh64CCOV812', 'admin', 1, NULL, '2025-12-15 15:40:16', NULL, '2025-12-26 16:36:41', '2025-12-26 16:36:40', '944641', '2025-12-26 01:10:18', 'Quick Paris Place de Clichy'),
(7, 'Freddy', 34, 'aaahobaut@gmail.com', '$2b$10$ZW2ZU/eJU.PAqYP0BsbhKeYnHo1Fu1J4Du93SoCAvsfaxlZWhYIZK', 'admin', 1, NULL, '2025-12-24 23:36:10', NULL, '2025-12-26 00:37:00', '2025-12-26 00:37:00', NULL, NULL, 'SUP');

-- --------------------------------------------------------

--
-- Structure de la table `user_certifications`
--

CREATE TABLE `user_certifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `certification_id` int NOT NULL,
  `obtained_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `status` enum('valid','expired','revoked') DEFAULT 'valid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_certifications`
--

INSERT INTO `user_certifications` (`id`, `user_id`, `certification_id`, `obtained_at`, `expires_at`, `status`) VALUES
(14, 5, 9, '2025-12-24 21:00:41', '2026-12-24 21:00:41', 'valid'),
(15, 5, 10, '2025-12-24 22:07:16', '2026-12-24 22:07:16', 'valid'),
(16, 7, 11, '2025-12-25 00:25:30', '2026-12-25 00:25:30', 'valid'),
(17, 7, 12, '2025-12-25 00:41:15', '2026-12-25 00:41:15', 'valid'),
(18, 7, 13, '2025-12-25 00:44:04', '2026-12-25 00:44:04', 'valid'),
(19, 5, 14, '2025-12-25 21:27:01', '2026-12-25 21:27:01', 'valid'),
(20, 5, 15, '2025-12-25 21:43:57', '2026-12-25 21:43:57', 'valid'),
(21, 5, 16, '2025-12-25 21:46:04', '2026-12-25 21:46:04', 'valid'),
(22, 5, 17, '2025-12-26 02:40:52', '2026-12-26 02:40:52', 'valid'),
(23, 5, 12, '2025-12-26 02:41:34', '2026-12-26 02:41:34', 'valid'),
(24, 5, 18, '2025-12-26 02:42:31', '2026-12-26 02:42:31', 'valid'),
(25, 5, 19, '2025-12-26 02:58:08', '2026-12-26 02:58:08', 'valid'),
(26, 5, 13, '2025-12-26 03:15:38', '2026-12-26 03:15:38', 'valid');

-- --------------------------------------------------------

--
-- Structure de la table `user_trainings`
--

CREATE TABLE `user_trainings` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `training_id` int NOT NULL,
  `progress` int DEFAULT '0',
  `status` enum('not_started','in_progress','completed') DEFAULT 'not_started',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_trainings`
--

INSERT INTO `user_trainings` (`id`, `user_id`, `training_id`, `progress`, `status`, `updated_at`) VALUES
(14, 5, 18, 52, 'completed', '2025-12-26 09:35:13'),
(15, 5, 16, 45, 'completed', '2025-12-26 09:37:50'),
(16, 7, 20, 0, 'in_progress', '2025-12-25 00:25:20'),
(17, 7, 19, 99, 'completed', '2025-12-25 00:43:07'),
(18, 7, 21, 0, 'in_progress', '2025-12-25 00:25:20'),
(19, 7, 22, 100, 'completed', '2025-12-25 00:41:30'),
(20, 7, 23, 0, 'not_started', '2025-12-25 00:39:14'),
(21, 7, 17, 100, 'completed', '2025-12-25 00:44:08'),
(22, 5, 24, 0, 'not_started', '2025-12-25 01:41:49'),
(23, 5, 27, 0, 'not_started', '2025-12-25 05:27:52'),
(24, 5, 25, 100, 'completed', '2025-12-25 21:44:11'),
(25, 5, 28, 0, 'not_started', '2025-12-25 05:27:52'),
(26, 5, 26, 0, 'not_started', '2025-12-25 05:27:52'),
(27, 5, 29, 100, 'completed', '2025-12-25 21:27:00'),
(28, 5, 30, 100, 'completed', '2025-12-25 21:46:22'),
(29, 5, 31, 100, 'completed', '2025-12-26 02:41:04'),
(30, 5, 22, 100, 'completed', '2025-12-26 02:41:34'),
(31, 5, 32, 100, 'completed', '2025-12-26 02:42:30'),
(32, 5, 33, 100, 'completed', '2025-12-26 02:58:08'),
(33, 5, 17, 100, 'completed', '2025-12-26 03:17:04'),
(34, 7, 18, 0, 'not_started', '2025-12-26 10:07:04');

-- --------------------------------------------------------

--
-- Structure de la table `videos`
--

CREATE TABLE `videos` (
  `id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `video_url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `views` int DEFAULT '0',
  `category_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `duration` int DEFAULT NULL,
  `processing_status` enum('uploading','processing','ready','failed') DEFAULT 'uploading',
  `is_public` tinyint(1) DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_trending` tinyint(1) DEFAULT '0',
  `uploaded_by` int NOT NULL DEFAULT '1',
  `cloud_provider` enum('aws_s3','cloudinary','azure','gcs','bunny','google_drive','dropbox','backblaze','other') DEFAULT 'other',
  `cloud_file_id` varchar(255) DEFAULT NULL,
  `cloud_bucket` varchar(150) DEFAULT NULL,
  `certification_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `video_url`, `thumbnail_url`, `views`, `category_id`, `user_id`, `created_at`, `duration`, `processing_status`, `is_public`, `is_featured`, `is_trending`, `uploaded_by`, `cloud_provider`, `cloud_file_id`, `cloud_bucket`, `certification_id`) VALUES
(49, 'Entretien bimensuel lave-vaisselle', 'Maintenance bimensuelle du lave-vaisselle : nettoyage complet des filtres et joints, inspection des composants, vérification des performances et prévention des pannes pour garantir un fonctionnement fiable et durable.', '/videos/proxy/1766552697847_Entretien bimensuel lave-vaisselle.mp4?provider=backblaze', 'https://underdog.shop/cdn/shop/articles/filtre_lave_vaisselle_1e0b0bc0-9fa9-425b-b5d4-69a3e5650758.png?v=1762955056', 6, 2, NULL, '2025-12-24 05:05:02', 216, 'uploading', 1, 1, 0, 5, 'backblaze', '1766552697847_Entretien bimensuel lave-vaisselle.mp4', 'quickpop', NULL),
(50, 'Entretien bimensuel séchoir', 'Maintenance bimensuelle du séchoir : nettoyage des filtres et conduits, inspection des éléments techniques, vérification du rendement et prévention des dysfonctionnements pour assurer une utilisation sûre et performante.\n', '/videos/proxy/1766552703497_Entretien bimensuel seÌchoir.mp4?provider=backblaze', 'https://www.test-achats.be/-/media/ta/images/home/home%20appliances/tumble%20dryers/dossier/entretien-seche-linge/cleaning-dryer-inside-645px.jpg?la=fr-be&rev=31ffc1ec-d028-498d-a900-2c8208333ab1&h=430&w=645&mw=660&hash=B2C1939E4555336AA8DBBD5727C0825F', 8, 3, NULL, '2025-12-24 05:05:07', 199, 'uploading', 1, 0, 1, 5, 'backblaze', '1766552703497_Entretien bimensuel seÌchoir.mp4', 'quickpop', NULL),
(51, 'Entretien bimensuel tourelle à boissons', 'Maintenance hebdomadaire du lave-vaisselle : nettoyage approfondi des filtres et bras de lavage, contrôle du fonctionnement général, vérification de l’hygiène et prévention des anomalies pour garantir une efficacité constante.', '/videos/proxy/1766552708254_Entretien bimensuel tourelle aÌ boissons.mp4?provider=backblaze', 'https://mobyice.fr/wp-content/uploads/2024/10/Tourelle-a-soda-8-becs-postmix.webp', 8, 4, NULL, '2025-12-24 05:05:13', 203, 'uploading', 1, 0, 0, 5, 'backblaze', '1766552708254_Entretien bimensuel tourelle aÌ boissons.mp4', 'quickpop', NULL),
(52, 'Entretien hebdo lave-vaisselle', 'Maintenance hebdomadaire du lave-vaisselle : nettoyage approfondi des filtres et bras de lavage, contrôle du fonctionnement général, vérification de l’hygiène et prévention des anomalies pour garantir une efficacité constante.', '/videos/proxy/1766552713928_Entretien hebdo lave-vaisselle.mp4?provider=backblaze', 'https://deegreez.fr/wp-content/uploads/2023/09/entretenir-un-lave-vaisselle-professionnel-copie-scaled.jpeg', 2, 2, NULL, '2025-12-24 05:05:18', 202, 'uploading', 1, 0, 1, 5, 'backblaze', '1766552713928_Entretien hebdo lave-vaisselle.mp4', 'quickpop', NULL),
(53, 'Entretien hebdo séchoir', 'Maintenance hebdomadaire du steamer : nettoyage renforcé, contrôle des composants, vérification des réglages et prévention des dysfonctionnements afin d’assurer une performance optimale.', '/videos/proxy/1766552718778_Entretien hebdo seÌchoir.mp4?provider=backblaze', 'https://media.weldom.fr/v2/media/catalog/product/0383758_02.jpg?width=298&format=webp', 8, 1, NULL, '2025-12-24 05:05:21', 153, 'uploading', 1, 0, 1, 5, 'backblaze', '1766552718778_Entretien hebdo seÌchoir.mp4', 'quickpop', NULL),
(54, 'Entretien hebdo steamer', 'Maintenance hebdomadaire du steamer : nettoyage renforcé, contrôle des composants, vérification des réglages et prévention des dysfonctionnements afin d’assurer une performance optimale.', '/videos/proxy/1766552722127_Entretien hebdo steamer.mp4?provider=backblaze', 'https://steam-one.com/cdn/shop/articles/Visuel_blog_-_Entretien_SteamCube_9e45d4ad-f3c3-4de7-b54d-e1077d7804d9.jpg?v=1750932295', 2, 4, NULL, '2025-12-24 05:05:26', 152, 'uploading', 1, 1, 0, 5, 'backblaze', '1766552722127_Entretien hebdo steamer.mp4', 'quickpop', NULL),
(55, 'Entretien hebdo tourelle à boissons', 'Maintenance hebdomadaire de la tourelle à boissons : nettoyage approfondi des circuits, contrôle des réglages, vérification de l’hygiène et prévention des anomalies pour garantir une qualité constante.', '/videos/proxy/1766552727365_Entretien hebdo tourelle aÌ boissons.mp4?provider=backblaze', 'https://cloudfront-eu-central-1.images.arcpublishing.com/lexpress/I6MVB4L5YFG6ZIKSJXQJKMH3DQ.jpg', 15, 3, NULL, '2025-12-24 05:05:30', 114, 'uploading', 1, 0, 1, 5, 'backblaze', '1766552727365_Entretien hebdo tourelle aÌ boissons.mp4', 'quickpop', NULL),
(56, 'Entretien mensuel lave-vaisselle', 'Maintenance mensuelle du lave-vaisselle : détartrage, contrôle des organes mécaniques, ajustements techniques et vérification des performances afin d’assurer fiabilité et longévité de l’équipement.', '/videos/proxy/1766552731535_Entretien mensuel lave-vaisselle.mp4?provider=backblaze', 'https://www.hobart.fr/assets/Images/Content/Feature/Hobart-dishwasher-spray-arm-maintenance-cleaning.jpg', 4, 2, NULL, '2025-12-24 05:05:35', 235, 'uploading', 1, 1, 0, 5, 'backblaze', '1766552731535_Entretien mensuel lave-vaisselle.mp4', 'quickpop', NULL),
(57, 'Entretien mensuel steamer', 'Maintenance mensuelle du steamer : détartrage, inspection des éléments techniques, réglages nécessaires et contrôle des performances pour garantir un fonctionnement durable et sécurisé.', '/videos/proxy/1766552736417_Entretien mensuel steamer.mp4?provider=backblaze', 'https://www.fairedupain.com/assets/img/nettoyage-cuve-machine-pain_d97c394887686febf62e566a77e292fc.jpg', 7, 2, NULL, '2025-12-24 05:05:38', 146, 'uploading', 1, 1, 0, 5, 'backblaze', '1766552736417_Entretien mensuel steamer.mp4', 'quickpop', NULL),
(58, 'Entretien quotidien lave-vaisselle', 'Maintenance quotidienne de la machine lave-vaisselle : nettoyage des composants, vérification des cycles, respect des normes sanitaires et prévention des dysfonctionnements afin d’assurer un lavage efficace.', '/videos/proxy/1766552739261_Entretien quotidien lave-vaisselle.mp4?provider=backblaze', 'https://www.cids.fr/medias/100415-lave-vaisselle-a-capot-hobart-aup.jpg', 12, 1, NULL, '2025-12-24 05:05:44', 132, 'uploading', 1, 1, 0, 5, 'backblaze', '1766552739261_Entretien quotidien lave-vaisselle.mp4', 'quickpop', NULL),
(59, 'Entretien quotidien séchoir', '', '/videos/proxy/1766552744844_Entretien quotidien seÌchoir.mp4?provider=backblaze', 'https://www.hobart.fr/assets/Images/Content/Feature/HOBART-wash-arms-with-arm-slider.jpg', 2, 3, NULL, '2025-12-24 05:05:49', 110, 'uploading', 1, 0, 1, 5, 'backblaze', '1766552744844_Entretien quotidien seÌchoir.mp4', 'quickpop', NULL),
(60, 'Entretien quotidien steamer', 'Maintenance quotidienne du steamer : nettoyage approfondi, contrôle du fonctionnement, respect des règles d’hygiène et prévention des pannes pour garantir une utilisation optimale.', '/videos/proxy/1766552749919_Entretien quotidien steamer.mp4?provider=backblaze', 'https://i.pinimg.com/1200x/65/ef/d9/65efd93591215a98848111334694e4ff.jpg', 16, 4, NULL, '2025-12-24 05:05:52', 112, 'uploading', 1, 0, 1, 5, 'backblaze', '1766552749919_Entretien quotidien steamer.mp4', 'quickpop', NULL),
(61, 'Entretien quotidien tourelle à boissons', 'Maintenance journalière de la tourelle à boissons : assainissement des équipements, contrôle opérationnel, respect des normes sanitaires et anticipation des anomalies pour assurer une prestation irréprochable.', '/videos/proxy/1766552752948_Entretien quotidien tourelle aÌ boissons.mp4?provider=backblaze', 'https://i.pinimg.com/736x/ef/dc/90/efdc90d7edc793f7f18676683e39e638.jpg', 72, 2, NULL, '2025-12-24 05:05:56', 134, 'uploading', 1, 1, 1, 5, 'backblaze', '1766552752948_Entretien quotidien tourelle aÌ boissons.mp4', 'quickpop', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `video_id` (`video_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `video_id` (`video_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_status` (`user_id`,`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Index pour la table `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `playlist_videos`
--
ALTER TABLE `playlist_videos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `playlist_id` (`playlist_id`,`video_id`),
  ADD KEY `video_id` (`video_id`);

--
-- Index pour la table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rating` (`video_id`,`user_id`),
  ADD KEY `idx_video` (`video_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Index pour la table `support`
--
ALTER TABLE `support`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `trainings`
--
ALTER TABLE `trainings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_video` (`video_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `user_certifications`
--
ALTER TABLE `user_certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `certification_id` (`certification_id`);

--
-- Index pour la table `user_trainings`
--
ALTER TABLE `user_trainings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `training_id` (`training_id`);

--
-- Index pour la table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_video_certification` (`certification_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT pour la table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `playlist_videos`
--
ALTER TABLE `playlist_videos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `support`
--
ALTER TABLE `support`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `trainings`
--
ALTER TABLE `trainings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `user_certifications`
--
ALTER TABLE `user_certifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `user_trainings`
--
ALTER TABLE `user_trainings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `playlists`
--
ALTER TABLE `playlists`
  ADD CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `playlist_videos`
--
ALTER TABLE `playlist_videos`
  ADD CONSTRAINT `playlist_videos_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `playlist_videos_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `support`
--
ALTER TABLE `support`
  ADD CONSTRAINT `support_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `user_certifications`
--
ALTER TABLE `user_certifications`
  ADD CONSTRAINT `user_certifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_certifications_ibfk_2` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_trainings`
--
ALTER TABLE `user_trainings`
  ADD CONSTRAINT `user_trainings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_trainings_ibfk_2` FOREIGN KEY (`training_id`) REFERENCES `trainings` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `fk_video_certification` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
