Projet Next.js 16 (App Router) – React 19 – TypeScript 5 – TanStack Query 5 – Architecture pilotée par backend, authentifiée avec NextAuth, UI modulaire.

## Démarrage

Serveur de développement (port 3600) :

```bash
npm run dev
# ou yarn dev / pnpm dev / bun dev
```

Ouvrez [http://localhost:3600](http://localhost:3600) dans votre navigateur.

Vous pouvez commencer à éditer la page en modifiant `app/page.tsx`. Le hot-reload est activé.

## Variables d’environnement

Créer un fichier `.env` à la racine avec, a minima :

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_WORKSPACE_ID=KINSHASA
NEXTAUTH_URL=http://localhost:3600
NEXTAUTH_SECRET=change-me
```

## Architecture

src/

- app/
  - (marketing)/
  - (public)/
  - (auth)/login
  - (protected)/
  - api/auth/[...nextauth]
  - layout.tsx
  - providers.tsx
- components/
  - ui/: ToastProvider, ErrorBoundary, LoaderGlobal, MotionWrapper, ThemeSwitcher
  - form/engine/: FormRenderer, ChildrenRenderer
- hooks/: useApi, useAuth, useFormEngine, useToast
- lib/
  - api/: client.ts, endpoints.ts
  - auth/: auth-options.ts, token.ts
  - cache/: query-client.ts
  - forms/: schema.ts, serialization.ts
- middleware.ts (protection des routes)
- services/: auth, taxpayer, navigation, view, operations
- utils/: http-client.ts

Règles:

- Aucun fetch dans les composants UI, uniquement via services et `apiClient`.
- Toute logique métier dans `services/`, logique technique dans `lib/`.
- Rendu dynamique (menus, vues, formulaires) piloté par backend.

## Scripts

- `dev`: démarre le serveur Next.js (Turbopack) en développement
- `build`: build de production
- `start`: démarre Next.js en production
- `lint`: lance ESLint

## Documentation

Consulter la documentation détaillée dans `docs/documentation.md`. Les principaux modules nouvellement introduits sont documentés dans leur dossier respectif.

## Déploiement

Se référer à la documentation Next.js pour le déploiement (Vercel, Docker, etc.).
