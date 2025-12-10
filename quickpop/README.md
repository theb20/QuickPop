
# QuickPop

**QuickPop** est une application web pour la gestion et le stockage de vidéos pour le restaurant Quick. Elle permet aux utilisateurs et administrateurs de gérer, consulter et publier des vidéos de manière sécurisée, avec des paramètres globaux et des politiques de l’application configurables.

---

## 🚀 Fonctionnalités

* **Gestion des utilisateurs** : création, activation/désactivation, rôle (`admin` / `enca`) et connexion via email ou Google (`id_google`).
* **Gestion des vidéos** : ajout, modification, suppression et consultation des vidéos avec titre, description, catégorie, image et lien vidéo.
* **Paramètres de l’application** : configuration du thème, taille maximale d’upload, catégorie par défaut, mode maintenance et email de contact.
* **Politique et conditions** : stockage des politiques et conditions de l’application pour consultation par les utilisateurs.
* **Sécurité et logs** : suivi des connexions et contrôle des utilisateurs actifs.
* **Performances** : indexation sur les colonnes souvent recherchées (`role_user`, `category`, `is_active`).

---

## 🗂 Base de données

### Tables principales

* `users` : informations des utilisateurs, rôle, état actif et identifiant Google.
* `videos` : informations sur les vidéos et utilisateur qui les a ajoutées.
* `app_settings` : paramètres globaux de l’application.
* `policy` : conditions et politiques de l’application.

Toutes les tables utilisent **InnoDB** avec des **timestamps** `created_at` et `updated_at` pour un suivi précis.

---

## 💻 Technologies

* **Frontend** : React.js (interface web moderne et réactive).
* **Backend** : Node.js + Express.js (API RESTful pour la gestion des données).
* **Base de données** : MySQL / MariaDB (relationnelle avec clés primaires, étrangères et index).
* **Authentification** : Google OAuth.


## 🔐 Sécurité

* Passwords hashés (bcrypt) avant stockage en base.
* Rôles utilisateurs pour limiter l’accès aux fonctionnalités sensibles.
* Possibilité de désactiver un utilisateur via `is_active`.

---

## 📈 Prochaines améliorations

* Tableau de statistiques vidéo (vues, likes, commentaires).
* Notifications pour les administrateurs et utilisateurs.
* Support multi-langue.
* Gestion des playlists et catégories dynamiques.

---

## 📄 Licence

Tous droits réservés © [2025] QuickPop
Le contenu de ce projet, le code source, les images et toutes les ressources associées sont la propriété exclusive de QuickPop.
Toute reproduction, distribution, modification ou utilisation sans autorisation expresse est strictement interdite.

