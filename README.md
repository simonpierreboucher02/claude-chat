# Claude Chat

Interface de chat privee pour converser avec les modeles Claude d'Anthropic en streaming.

## Fonctionnalites

- **Authentification** : Acces protege par mot de passe avec gestion multi-utilisateurs
- **Deux modeles** : Claude Sonnet 4.5 et Claude Opus 4.6, selectionnables en un clic
- **Streaming** : Reponses en temps reel, token par token
- **Historique** : Conversations sauvegardees par utilisateur dans le navigateur
- **Rendu Markdown** : Titres, listes, tableaux, blocs de code avec coloration syntaxique et bouton copier
- **Partage public** : Generation de liens publics pour partager une conversation sans authentification
- **Administration** : Interface admin pour creer, supprimer et gerer les utilisateurs
- **Responsive** : Interface adaptee smartphone avec sidebar coulissante

## Stack technique

| Composant | Technologie |
|-----------|------------|
| Frontend | React 19, TypeScript, Vite |
| Backend | Express 5 (Node.js) |
| Streaming | Server-Sent Events (SSE) |
| Markdown | react-markdown, remark-gfm, react-syntax-highlighter |
| Stockage | localStorage (conversations), JSON files (utilisateurs, partages) |

## Installation

```bash
git clone https://github.com/simonpierreboucher02/claude-chat.git
cd claude-chat
npm install
```

## Configuration

Creer un fichier `.env` a la racine :

```
ANTHROPIC_API_KEY=votre_cle_api
PORT=3002
```

## Lancement

```bash
# Build du frontend + demarrage du serveur
npm run serve
```

L'application sera accessible sur `http://localhost:3002`.

## Identifiants par defaut

| Utilisateur | Mot de passe | Role |
|------------|-------------|------|
| admin | admin123 | Administrateur |

L'administrateur peut creer des comptes supplementaires depuis l'interface d'administration.

## Structure du projet

```
├── server.js          # Serveur Express (API + proxy streaming Anthropic)
├── src/
│   ├── App.tsx        # Composant principal (login, chat, admin, partage)
│   ├── Markdown.tsx   # Rendu Markdown avec coloration syntaxique
│   ├── styles.ts      # Styles CSS (theme clair)
│   ├── types.ts       # Types TypeScript et configuration des modeles
│   └── main.tsx       # Point d'entree React
├── users.json         # Base de donnees utilisateurs
├── shares.json        # Conversations partagees (genere automatiquement)
├── .env               # Variables d'environnement (non commite)
├── index.html         # Template HTML
├── vite.config.ts     # Configuration Vite
└── tsconfig.json      # Configuration TypeScript
```

## Max tokens par modele

| Modele | Max output tokens |
|--------|------------------|
| Claude Sonnet 4.5 | 64 000 |
| Claude Opus 4.6 | 128 000 |

## Licence

ISC
