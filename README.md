# Crypto Price Tracker API

Une API REST construite avec Next.js pour suivre les prix des cryptomonnaies en temps réel via l'API Binance.

## Fonctionnalités Principales

- ✨ Récupération des prix en temps réel via l'API Binance
- 📊 Historique des prix (plus haut/plus bas) par date
- 💱 Conversion automatique entre devises (EUR, USDT, USDC)
- 🔄 Mise à jour automatique des taux de change
- 📝 Journalisation des erreurs

## Points d'API

### GET /api/lowerPrice

Récupère le prix le plus bas d'une crypto pour une date donnée.

```http
GET /api/lowerPrice?crypto=BTC&date=DD/MM/YYYY
```

### GET /api/higherPrice

Récupère le prix le plus haut d'une crypto pour une date donnée.

```http
?crypto=BTC&date=DD/MM/YYYY
```

## Installation

```bash
npm install
npm run dev
```

## Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="file:../bdd.db"
```

## Technologies Utilisées

- Next.js 15.0
- TypeScript
- Prisma ORM
- SQLite (développement)
- API Binance

## Structure du Projet

```
crypto-tracking/
├── lib/
│   ├── hooks/          # Hooks personnalisés et utilitaires
│   ├── middlewares/    # Middleware API et services
│   └── types/         # Types TypeScript
├── pages/
│   ├── api/           # Points d'API REST
└── prisma/
    ├── schema/        # Schéma de base de données
    │   └── schema.prisma
    └── bdd.db
```

## Docker

Construction de l'image :

```bash
docker build -t crypto-tracking .
```

Exécution du conteneur :

```bash
docker run -p 3000:3000 crypto-tracking
```

## Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

MIT

## Contact

Jocelyn Sainson - [@JocelynSainson](https://x.com/jocelynsainson)

Lien du projet: [https://github.com/jos34000/crypto-tracking](https://github.com/jos34000/crypto-tracking)
