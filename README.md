# Claude Chat

[![Node.js](https://img.shields.io/badge/Node.js-25.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Anthropic API](https://img.shields.io/badge/Anthropic_API-Claude_4-D4A574?logo=anthropic&logoColor=white)](https://docs.anthropic.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/simonpierreboucher02/claude-chat/pulls)

Interface de chat privee et auto-hebergee pour converser avec les modeles **Claude Sonnet 4.5** et **Claude Opus 4.6** d'Anthropic, avec streaming en temps reel, gestion multi-utilisateurs et partage public de conversations.

---

## Table des matieres

- [Apercu](#apercu)
- [Fonctionnalites](#fonctionnalites)
- [Stack technique](#stack-technique)
- [Prerequis](#prerequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Modeles supportes](#modeles-supportes)
- [Securite](#securite)
- [Auteurs](#auteurs)
- [Licence](#licence)
- [Contact](#contact)

---

## Apercu

Claude Chat est une application web full-stack qui permet d'interagir avec les modeles d'intelligence artificielle Claude d'Anthropic via une interface epuree et responsive. L'application est concue pour etre deployee sur un serveur prive, offrant un controle total sur les donnees et les acces utilisateurs.

L'interface supporte le rendu complet du Markdown avec coloration syntaxique des blocs de code, permettant des echanges riches et lisibles avec les modeles Claude.

---

## Fonctionnalites

### Chat et streaming
- **Streaming en temps reel** : Les reponses de Claude arrivent token par token via Server-Sent Events (SSE), offrant une experience fluide et reactive
- **Deux modeles** : Basculez entre Claude Sonnet 4.5 (rapide) et Claude Opus 4.6 (puissant) en un clic
- **Historique complet** : Toutes les conversations sont sauvegardees et accessibles dans la sidebar
- **Contexte conversationnel** : Chaque conversation maintient son historique complet pour des echanges coherents

### Rendu Markdown
- **Titres, listes, gras, italique, liens** : Rendu fidele du Markdown standard
- **Blocs de code** : Coloration syntaxique automatique avec detection du langage, fond sombre pour une lisibilite optimale
- **Bouton copier** : Chaque bloc de code dispose d'un bouton pour copier le contenu en un clic
- **Tableaux** : Rendu complet des tableaux Markdown avec scroll horizontal
- **Citations, separateurs, code inline** : Support complet de GitHub Flavored Markdown (GFM)

### Gestion des utilisateurs
- **Authentification** : Acces protege par identifiant et mot de passe
- **Multi-utilisateurs** : Chaque utilisateur dispose de son propre espace avec ses conversations privees
- **Roles** : Systeme de roles administrateur / utilisateur
- **Panel d'administration** : Interface dediee pour creer, consulter et supprimer des comptes utilisateurs

### Partage de conversations
- **Liens publics** : Generez un lien unique pour partager une conversation
- **Acces sans authentification** : Les liens de partage sont consultables par n'importe qui
- **Copie figee** : Le partage cree un snapshot de la conversation au moment du partage
- **Rendu Markdown complet** : La vue partagee affiche le meme rendu riche que l'interface principale

### Interface
- **Theme clair** : Interface epuree avec un design blanc et gris, lisible et professionnel
- **Responsive** : Adaptee aux smartphones avec sidebar coulissante et overlay
- **Selecteur de modele** : Toggle elegant dans le header pour basculer entre les modeles
- **Animations** : Transitions fluides pour les messages et les interactions

---

## Stack technique

| Composant | Technologie | Version |
|-----------|------------|---------|
| Frontend | React + TypeScript | 19.x / 5.9 |
| Bundler | Vite | 7.x |
| Backend | Express (Node.js) | 5.x |
| Streaming | Server-Sent Events (SSE) | - |
| API IA | Anthropic Messages API | 2023-06-01 |
| Markdown | react-markdown + remark-gfm | 10.x |
| Syntax Highlighting | react-syntax-highlighter (Prism) | 16.x |
| Stockage client | localStorage | - |
| Stockage serveur | Fichiers JSON | - |

---

## Prerequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- Une **cle API Anthropic** valide ([obtenir une cle](https://console.anthropic.com/))

---

## Installation

```bash
# Cloner le depot
git clone https://github.com/simonpierreboucher02/claude-chat.git

# Acceder au repertoire
cd claude-chat

# Installer les dependances
npm install
```

---

## Configuration

Creer un fichier `.env` a la racine du projet :

```env
ANTHROPIC_API_KEY=sk-ant-api03-votre-cle-ici
PORT=3002
```

| Variable | Description | Requis |
|----------|------------|--------|
| `ANTHROPIC_API_KEY` | Cle API Anthropic pour acceder aux modeles Claude | Oui |
| `PORT` | Port du serveur HTTP | Non (defaut: 3002) |

---

## Lancement

### Production

```bash
# Build du frontend + demarrage du serveur
npm run serve
```

L'application sera accessible sur `http://localhost:3002`.

### Developpement

```bash
# Terminal 1 : Serveur backend
npm start

# Terminal 2 : Frontend avec hot-reload
npm run dev
```

Le frontend de dev tourne sur `http://localhost:5173` avec proxy automatique vers le backend.

### Scripts disponibles

| Commande | Description |
|----------|------------|
| `npm run dev` | Demarrer le frontend Vite en mode developpement |
| `npm run build` | Build de production du frontend |
| `npm start` | Demarrer le serveur Express |
| `npm run serve` | Build + demarrage du serveur |

---

## Utilisation

### Connexion

Accedez a l'application et connectez-vous avec les identifiants par defaut :

| Utilisateur | Mot de passe | Role |
|------------|-------------|------|
| `admin` | `admin123` | Administrateur |

> **Important** : Changez le mot de passe administrateur en production.

### Chatter avec Claude

1. Selectionnez le modele souhaite (Sonnet 4.5 ou Opus 4.6) dans le header
2. Tapez votre message et appuyez sur Entree (ou cliquez le bouton d'envoi)
3. La reponse arrive en streaming, token par token
4. Utilisez Shift+Entree pour les retours a la ligne

### Gerer les utilisateurs (admin)

1. Cliquez sur **Administration** dans la sidebar
2. Remplissez le formulaire pour creer un nouvel utilisateur
3. Chaque utilisateur aura son propre espace de conversations

### Partager une conversation

1. Ouvrez la conversation a partager
2. Cliquez sur **Partager** dans le header
3. Le lien est copie dans votre presse-papier (ou affiche dans une boite de dialogue)
4. Partagez le lien — aucune connexion requise pour le consulter

---

## Architecture

```
Client (React SPA)
    │
    ├── Login ──► POST /api/auth
    │
    ├── Chat ──► POST /api/chat (SSE streaming)
    │                │
    │                ▼
    │          Express Server
    │                │
    │                ▼
    │          Anthropic API (streaming)
    │
    ├── Admin ──► GET/POST/DELETE /api/users
    │
    └── Share ──► POST /api/share (create)
                  GET /api/share/:id (public read)
```

### Flux de streaming

1. Le client envoie les messages via `POST /api/chat`
2. Le serveur Express forward la requete a l'API Anthropic avec `stream: true`
3. Le serveur lit le flux SSE d'Anthropic chunk par chunk
4. Chaque `content_block_delta` est re-emis au client en temps reel
5. Le client met a jour l'affichage a chaque token recu
6. `res.flush()` est appele apres chaque ecriture pour eviter le buffering

---

## Structure du projet

```
claude-chat/
├── server.js              # Serveur Express : auth, proxy streaming, users, shares
├── src/
│   ├── App.tsx            # Composant principal (routing, login, chat, admin, share)
│   ├── Markdown.tsx       # Composant de rendu Markdown avec syntax highlighting
│   ├── styles.ts          # Feuille de styles CSS complete (theme clair)
│   ├── types.ts           # Interfaces TypeScript et configuration des modeles
│   └── main.tsx           # Point d'entree React (mount sur #root)
├── users.json             # Base de donnees des utilisateurs (JSON)
├── shares.json            # Conversations partagees (genere automatiquement)
├── .env                   # Variables d'environnement (non versionne)
├── .gitignore             # Fichiers exclus du versioning
├── index.html             # Template HTML avec meta viewport mobile
├── package.json           # Dependances et scripts npm
├── vite.config.ts         # Configuration Vite (proxy dev, build output)
└── tsconfig.json          # Configuration TypeScript
```

---

## API Endpoints

### Authentification

| Methode | Endpoint | Description | Auth requise |
|---------|----------|------------|-------------|
| `POST` | `/api/auth` | Verifier les identifiants | Non |

### Chat

| Methode | Endpoint | Description | Auth requise |
|---------|----------|------------|-------------|
| `POST` | `/api/chat` | Envoyer un message (reponse SSE) | Oui |

### Gestion utilisateurs

| Methode | Endpoint | Description | Auth requise |
|---------|----------|------------|-------------|
| `GET` | `/api/users` | Lister les utilisateurs | Admin |
| `POST` | `/api/users` | Creer un utilisateur | Admin |
| `PUT` | `/api/users/:username` | Modifier un utilisateur | Admin |
| `DELETE` | `/api/users/:username` | Supprimer un utilisateur | Admin |

### Partage

| Methode | Endpoint | Description | Auth requise |
|---------|----------|------------|-------------|
| `POST` | `/api/share` | Creer un lien de partage | Oui |
| `GET` | `/api/share/:id` | Consulter une conversation partagee | Non |
| `DELETE` | `/api/share/:id` | Supprimer un partage | Auteur ou Admin |

---

## Modeles supportes

| Modele | ID API | Max output tokens | Latence | Tarif (input/output) |
|--------|--------|-------------------|---------|---------------------|
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | 64 000 | Rapide | $3 / $15 par MTok |
| Claude Opus 4.6 | `claude-opus-4-6` | 128 000 | Moderee | $5 / $25 par MTok |

---

## Securite

- **Cle API cote serveur** : La cle Anthropic n'est jamais exposee au client, toutes les requetes transitent par le serveur Express
- **Authentification par headers** : Chaque requete API est authentifiee via les headers `username` et `password`
- **Fichier .env non versionne** : La cle API est exclue du depot Git via `.gitignore`
- **Protection admin** : Le compte admin ne peut pas etre supprime
- **Isolation des donnees** : Chaque utilisateur ne voit que ses propres conversations
- **Partage controle** : Seul l'auteur ou un admin peut supprimer un lien de partage

> **Recommandations pour la production** :
> - Utiliser HTTPS (reverse proxy Nginx/Caddy)
> - Changer le mot de passe admin par defaut
> - Implementer un rate limiting
> - Migrer vers une base de donnees pour le stockage utilisateurs

---

## Auteurs

- **Simon-Pierre Boucher** — Conception et developpement
  - Site web : [www.spboucher.ai](https://www.spboucher.ai)
  - Email : [spbou4@protonmail.com](mailto:spbou4@protonmail.com)
  - GitHub : [@simonpierreboucher02](https://github.com/simonpierreboucher02)

- **Claude Opus 4.6** (Anthropic) — Co-auteur, generation de code et architecture
  - Site web : [anthropic.com](https://www.anthropic.com)

---

## Licence

Ce projet est distribue sous licence [ISC](https://opensource.org/licenses/ISC).

---

## Contact

Pour toute question, suggestion ou collaboration :

- Email : [spbou4@protonmail.com](mailto:spbou4@protonmail.com)
- Site web : [www.spboucher.ai](https://www.spboucher.ai)
- GitHub Issues : [claude-chat/issues](https://github.com/simonpierreboucher02/claude-chat/issues)
