# Mini-Docto+ – Projet Complet

**Mini-Docto+** est une plateforme qui facilite la mise en relation entre **patients** et **professionnels de santé**.
Elle se compose de trois grandes parties :

1. **Frontend Web (React.js)** – interface web responsive dédiée aux professionnels
2. **Application Mobile (Flutter)** – interface destinée aux patients
3. **Backend (Node.js + MongoDB)** – API de gestion de l'authentification, des rendez-vous et des disponibilités

Le frontend React et le backend sont **déployés sur Vercel** :

- [Backend](https://mini-docto-2ph9.vercel.app/)
- [Frontend React](https://mini-docto.vercel.app/)

## Structure du projet

```
mini-docto/
├── backend/        # Backend Node.js + MongoDB (API REST)
├── frontend/       # Frontend web React.js (Pro)
├── mobile/         # Application mobile Flutter (User)
└── README.md       # README global (ce fichier)
```

## Prérequis

- **Node.js**
- **MongoDB** (local ou cloud)
- **Flutter SDK** (>= 3.0.0)
- **Dart** (>= 2.17)
- **Android Studio** ou **VS Code** pour la partie mobile

## Installation & Démarrage rapide

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/mini-docto.git
cd mini-docto
```

### 2. Backend (API Node.js + MongoDB)

**Stack utilisée :**

- Node.js v18+
- Express.js
- MongoDB avec Mongoose
- JSON Web Token (JWT) – authentification
- bcryptjs – hachage des mots de passe
- dotenv – gestion des variables d'environnement
- nodemon – développement
- express-validator – validation des entrées

**Exemple de fichier `.env` :**

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mini-docto
JWT_SECRET=SecretKey123
JWT_EXPIRES_IN=2d
```

**Installation et lancement :**

```bash
cd backend
npm install
npm run dev
```

API disponible sur : `http://localhost:5000/api`

### 3. Frontend Web (React.js)

**Stack utilisée :**

- React.js (Vite ou CRA)
- React Router DOM – navigation
- Axios – requêtes API
- TailwindCSS – design responsive
- SweetAlert2 – notifications
- LocalStorage – gestion de session (JWT token)

#### Gestion des variables d'environnement React

Pour pouvoir utiliser **localhost** en développement et l'API Vercel en production, on utilise des variables d'environnement :

1. Créer un fichier `.env` à la racine du frontend :

```env
# Développement local
VITE_API_URL=http://localhost:5000/api

# Production / Vercel
# VITE_API_URL=https://mini-docto-2ph9.vercel.app/api
```

2. Dans `api.js` :

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

> Ensuite, React utilisera automatiquement la bonne URL selon le fichier `.env` ou les variables d'environnement Vercel.

**Installation et lancement :**

```bash
cd ../frontend
npm install
npm run dev
```

Disponible sur : [http://localhost:5173](http://localhost:5173)

En production sur Vercel : [https://mini-docto.vercel.app/](https://mini-docto.vercel.app/)

### 4. Application Mobile (Flutter)

**Stack utilisée :**

- **Flutter SDK** >= 3.9.0
- **Dart** >= 3.9.0
- **Firebase Analytics** (`firebase_analytics`) pour Google Analytics 4 (GA4)
- **Firebase Core** (`firebase_core`) pour l'initialisation Firebase
- **HTTP** (`http`) pour les requêtes API vers le backend Node.js
- **SharedPreferences** (`shared_preferences`) pour la persistance locale des données (JWT, préférences utilisateur)

```bash
cd ../mobile
flutter pub get
flutter run
```

Exécutable sur **émulateur** ou **appareil Android/iOS**.

## Liste des API

### 1. Auth (Authentification & Profil)

| Méthode | Endpoint                   | Description                                    | Accès      |
| ------- | -------------------------- | ---------------------------------------------- | ---------- |
| POST    | `/api/auth/register`       | Créer un compte utilisateur/professionnel     | Public     |
| POST    | `/api/auth/login`          | Connexion utilisateur/professionnel           | Public     |
| GET     | `/api/auth/me`             | Récupérer les informations du profil connecté | Auth (JWT) |
| PUT     | `/api/auth/update-profile` | Mettre à jour le profil utilisateur           | Auth (JWT) |

### 2. User (Patients)

| Méthode | Endpoint           | Description                               | Accès                   |
| ------- | ------------------ | ----------------------------------------- | ----------------------- |
| POST    | `/api/appointment` | Réserver un rendez-vous                   | Auth (JWT), rôle `user` |
| GET     | `/api/appointment` | Récupérer tous les rendez-vous du patient | Auth (JWT), rôle `user` |
| PUT     | `/api/update/:id`  | Modifier un rendez-vous                   | Auth (JWT), rôle `user` |
| PUT     | `/api/cancel/:id`  | Annuler un rendez-vous                    | Auth (JWT), rôle `user` |
| GET     | `/api/:id`         | Récupérer un professionnel par ID         | Auth (JWT), rôle `user` |

### 3. Professional (Professionnels)

| Méthode | Endpoint                              | Description                                    | Accès                  |
| ------- | ------------------------------------- | ---------------------------------------------- | ---------------------- |
| GET     | `/api/professionals/`                 | Liste de tous les professionnels              | Auth (JWT)             |
| POST    | `/api/professionals/availability`     | Ajouter des disponibilités                    | Auth (JWT), rôle `pro` |
| GET     | `/api/professionals/availability`     | Récupérer les disponibilités du professionnel | Auth (JWT), rôle `pro` |
| PUT     | `/api/professionals/availability/:id` | Modifier une disponibilité                    | Auth (JWT), rôle `pro` |
| DELETE  | `/api/professionals/availability/:id` | Supprimer une disponibilité                   | Auth (JWT), rôle `pro` |
| GET     | `/api/professionals/appointments`     | Récupérer tous les rendez-vous associés       | Auth (JWT), rôle `pro` |

### Remarques

- Tous les endpoints protégés nécessitent un **JWT** valide dans l'en-tête `Authorization: Bearer <token>`.
- Les rôles (`user` ou `pro`) définissent les droits d'accès aux routes.

## Interfaces & Captures d'écran

### Web (Professionnels)

| Interface                   | Capture d'écran                                              | Description                                                                                                     |
| --------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Login**                   | ![Login](screenshots/web/login.PNG)                         | Connexion des professionnels avec email et mot de passe.                                                       |
| **Erreur Login**            | ![Error Login](screenshots/web/error-login.PNG)             | Alerte affichée en cas d'identifiants incorrects.                                                              |
| **Register**                | ![Register](screenshots/web/register.PNG)                   | Création d'un compte professionnel Mini-Docto+.                                                                |
| **Dashboard Pro**           | ![Dashboard Pro](screenshots/web/dashboard-pro.PNG)         | Vue principale : disponibilités, rendez-vous groupés par patient, tableau des pros avec score et statistiques. |
| **Nouveau Dashboard Pro**   | ![Dashboard New Pro](screenshots/web/dashboard-new-pro.PNG) | Version alternative du dashboard pour les nouveaux professionnels.                                             |
| **Ajouter Disponibilité**   | ![Add Availability](screenshots/web/add-availability.PNG)   | Formulaire d'ajout de créneaux horaires.                                                                       |
| **Modifier Disponibilité**  | ![Update Availability](screenshots/web/update-availability.PNG) | Fenêtre d'édition d'une disponibilité existante.                                                               |
| **Supprimer Disponibilité** | ![Delete Availability](screenshots/web/delete-availability.PNG) | Confirmation avant suppression d'une disponibilité.                                                            |
| **Profil**                  | ![Profile](screenshots/web/profile.PNG)                     | Consultation et modification du profil (informations + mot de passe).                                          |
| **Logout**                  | ![Logout](screenshots/web/logout.PNG)                       | Écran ou message de déconnexion sécurisée.                                                                     |

### Mobile (Patients)

| Interface              | Capture                                                   | Description                                                                                                                     |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**               | ![Auth](screenshots/mobile/auth.png)                     | Connexion et inscription avec alertes en cas d'erreur ou succès.                                                               |
| **Réserver RDV**       | ![Réserver RDV](screenshots/mobile/book_appointment.png) | Liste des professionnels triés par score. Consultation des informations d'un professionnel et réservation d'un créneau horaire. |
| **Mes rendez-vous**    | ![Mes RDV](screenshots/mobile/rdv.png)                   | Liste des rendez-vous avec options de modification ou d'annulation.                                                            |
| **Profil utilisateur** | ![Profil](screenshots/mobile/menu-profile.png)           | Consultation et modification du profil utilisateur, accès au menu avec bouton de déconnexion.                                  |

## Sécurité

- Authentification sécurisée avec **JWT**
- Hachage des mots de passe via **bcryptjs**
- Validation des entrées API avec **express-validator**
- Gestion des rôles : distinction **patients** (`user`) et **professionnels** (`pro`)
- Routes protégées via **ProtectedRoute**
- Nettoyage automatique du **localStorage** à la déconnexion
- Interface réactive et moderne grâce à **TailwindCSS**

## Performance

- Requêtes MongoDB optimisées avec **index** (email, professionalId)
- Utilisation d'`async/await` pour un middleware léger et rapide
- Gestion centralisée des erreurs pour une meilleure stabilité backend

## Intégration Google Analytics 4 (GA4)

L'application intègre **Google Analytics 4** pour le suivi et l'analyse des utilisateurs web (React) et mobile (Flutter).

### Implémentation

**Frontend Web :** Librairie `react-ga4` avec suivi automatique des pages vues, événements personnalisés et durée de session.

**Mobile Flutter :** Intégration via `firebase_analytics` pour tracker les événements d'inscription (tentatives, échecs, succès).

### Dashboard Google Analytics

![Dashboard Google Analytics](analytics.PNG)

*Tableau de bord GA4 montrant les métriques en temps réel, pages vues et événements personnalisés de l'application Mini-Docto+.*

### Bénéfices

- Suivi centralisé des utilisateurs web et mobile
- Vision complète du parcours utilisateur
- Événements personnalisés adaptés aux besoins métier
