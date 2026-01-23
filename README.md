# Cluedo - Application React

Application web du jeu Cluedo développée avec React, Vite et React Router.

## 📋 Prérequis

- Node.js 18+ et npm
- Serveur API Symfony (voir documentation API ci-dessous)

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## 📁 Structure du projet

```
react/
├── src/
│   ├── pages/           # Pages de l'application
│   │   ├── Login.jsx    # Page de connexion
│   │   ├── Register.jsx # Page d'inscription
│   │   ├── Games.jsx    # Liste des parties
│   │   └── Game.jsx     # Plateau de jeu
│   ├── components/      # Composants réutilisables
│   │   ├── DicePopup.jsx   # Popup du dé
│   │   ├── CardGrid.jsx    # Grille des cartes
│   │   └── ChatZone.jsx    # Zone de chat et sélection
│   ├── styles/          # Feuilles de style
│   │   ├── auth.css     # Styles authentification
│   │   └── game.css     # Styles du jeu
│   ├── App.jsx          # Composant principal
│   ├── App.css          # Styles globaux
│   ├── main.jsx         # Point d'entrée
│   └── index.css        # Styles de base
└── public/
    └── assets/          # Images et ressources statiques
```

## 🎮 Fonctionnalités

### Authentification
- **Connexion** : `/login`
- **Inscription** : `/register`
- Stockage du token JWT dans localStorage

### Gestion des parties
- **Liste des parties** : `/games`
- Affichage de toutes les parties de l'utilisateur
- Création de nouvelles parties
- Reprise de parties en cours

### Jeu
- **Plateau de jeu** : `/game/:id` ou `/game` (nouvelle partie)
- Grille interactive des lieux, personnages et armes
- Lancer de dé avec animation
- Chat et historique des actions
- Validation d'hypothèses

## 🔌 Intégration API

L'application communique avec une API Symfony backend. Les endpoints utilisés :

### Authentification
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription

### Parties
- `GET /api/games` - Liste des parties
- `POST /api/games` - Créer une partie
- `GET /api/games/{id}` - Détails d'une partie
- `PUT /api/games/{id}/move` - Effectuer un mouvement

Voir `API_DOCUMENTATION.md` pour plus de détails.

## 🎨 Personnalisation

Les styles peuvent être modifiés dans :
- `src/styles/auth.css` - Pages d'authentification
- `src/styles/game.css` - Interface de jeu
- `src/index.css` - Styles globaux

## 🛠️ Technologies utilisées

- **React 19** - Framework UI
- **React Router DOM 7** - Routage
- **Vite 7** - Build tool
- **CSS personnalisé** - Styling

## 📝 Mode développement

En mode développement, l'application fonctionne avec des données de test si l'API n'est pas disponible. Les appels API échouent gracieusement et utilisent des données mockées.

## 🌐 Variables d'environnement

Créez un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:8000
```

## 🚢 Déploiement

```bash
# Builder l'application
npm run build

# Le dossier dist/ contient les fichiers prêts pour la production
```

Configurez votre serveur web pour servir les fichiers statiques et rediriger toutes les routes vers `index.html` pour le fonctionnement du routage côté client.

## 📄 Licence

Projet éducatif IUT 2025-2026


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
