-- Création de la base
CREATE DATABASE IF NOT EXISTS quickpop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quickpop;

-- Table users : gestion des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id_user BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_number VARCHAR(10) NOT NULL UNIQUE,
    name_user VARCHAR(100) NOT NULL,
    first_name_user VARCHAR(100) NOT NULL,
    email_user VARCHAR(150) NOT NULL UNIQUE,
    id_google VARCHAR(255) DEFAULT NULL,
    role_user ENUM('admin', 'enca') NOT NULL DEFAULT 'enca',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_user (role_user),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- Table videos : informations sur les vidéos
CREATE TABLE IF NOT EXISTS videos (
    id_video BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title_video VARCHAR(150) NOT NULL,
    description_video TEXT,
    category ENUM('tutorial', 'how-to', 'fun', 'education') NOT NULL DEFAULT 'tutorial',
    url_picture VARCHAR(255) NOT NULL,
    url_video VARCHAR(255) NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    FOREIGN KEY (created_by) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table policy : conditions et politique de l'application
CREATE TABLE IF NOT EXISTS policy (
    id_policy BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    policy_name VARCHAR(100) NOT NULL,
    policy_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table app_settings : paramètres globaux de l'application
CREATE TABLE IF NOT EXISTS app_settings (
    id_setting BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    app_name VARCHAR(100) NOT NULL DEFAULT 'QuickPop',
    theme ENUM('light','dark') NOT NULL DEFAULT 'light',
    default_video_category ENUM('tutorial', 'how-to', 'fun', 'education') NOT NULL DEFAULT 'tutorial',
    max_upload_size_mb INT UNSIGNED NOT NULL DEFAULT 500,
    allow_user_registration BOOLEAN NOT NULL DEFAULT TRUE,
    maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    contact_email VARCHAR(150) NOT NULL DEFAULT 'support@quickpop.com',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
