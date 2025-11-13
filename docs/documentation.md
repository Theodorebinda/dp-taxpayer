## DigiPublic Taxpayer Web App — Documentation Technique et Fonctionnelle

### Introduction générale

Cette documentation présente l’architecture, la logique métier, les dépendances et les conventions du projet DigiPublic Taxpayer Web App. Elle est destinée à servir de référence aux développeurs, intégrateurs et parties prenantes (agents, contribuables, équipes produit). Le projet est construit avec Next.js 16 (App Router) et React 19, utilise Zustand pour la gestion d’état, Tailwind CSS 4 pour le style, et propose des fonctionnalités d’import/export (CSV/Excel), capture/recadrage d’images, et des formulaires dynamiques pilotés par API.

### Description du projet

Application publique de gestion des contribuables et de leurs opérations/déclarations, avec:

- Parcours d’inscription du contribuable en plusieurs étapes.
- Formulaires dynamiques (définis côté backend via endpoints).
- Gestion documentaire (capture via webcam, recadrage d’images, upload).
- Import/export de données (CSV/Excel).
- UI moderne (Tailwind CSS 4), composants réutilisables et gestion d’état centralisée (Zustand).

### Objectifs

- Offrir un portail simple et sûr pour la déclaration et la gestion des informations contribuables.
- Accélérer la saisie grâce à des formulaires dynamiques, des imports CSV/Excel et à l’UX optimisée.
- Préparer une base front robuste pour l’intégration continue d’API et de workflows métiers.

### Public cible

- Agents (consultation, suivi, aide à la saisie).
- Contribuables (auto-inscription, gestion des données personnelles et pièces).
- Équipes techniques (développement, QA, DevOps) et produit.

## Technologies principales

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript 5
- Zustand 5 (gestion d’état)
- Tailwind CSS 4 (via `@tailwindcss/postcss`)
- react-webcam (capture)
- react-easy-crop (recadrage)
- xlsx (export Excel)
- papaparse (CSV import/export)
- Iconographie: `lucide-react`, `react-icons`

## Architecture du projet

### App Router (Next 16)

Le projet utilise l’App Router (dossier `app/`), avec des groupes de routes pour structurer l’espace public/marketing :

- `app/(marketing)/page.tsx` (landing)
- `app/(public)/registration/page.tsx` (inscription)
  Les groupes n’affectent pas les URLs (pas de préfixe). Par défaut, les composants sont « server components »; un composant devient « client component » s’il déclare `use client` au sommet du fichier.

- Exemples clients:
  - `app/page.tsx`
  - `app/registration/page.tsx`
  - `components/auth-guard.tsx`
  - La plupart des composants UI interactifs dans `components/**`

### Schéma de l’arborescence

```
/app
  ├─ favicon.ico
  ├─ globals.css
  ├─ layout.tsx
  ├─ (marketing)/
  │   └─ page.tsx
  └─ (public)/
      └─ registration/
          └─ page.tsx
/components
  ├─ ui/                      ← point d’entrée UI ré-exportant atoms/commons utiles
  ├─ form/
  │   └─ engine/              ← point d’entrée du moteur de formulaires
  ├─ atoms/
  ├─ commons/
  ├─ graphs/
  ├─ menus/
  ├─ public/declaration/
  ├─ store/                   ← re-exports vers /store
  └─ table/
/store                        ← Stores Zustand (source of truth)
/lib
  ├─ api/
  │   ├─ client.ts
  │   └─ endpoints.ts
  ├─ forms/
  │   ├─ schema.ts
  │   └─ serialization.ts
  └─ utils/
      └─ env.ts
/services
  └─ taxpayer.service.ts
/public
/types                        ← Types et contrats front
/utils
  └─ http-client.tsx          ← Client HTTP central (wrap par lib/api/client)
eslint.config.mjs
next.config.ts
package.json
postcss.config.mjs
tsconfig.json
```

### Rôle de chaque dossier

- `app/`: Entrées de pages et Layout racine (App Router). `globals.css` configure Tailwind 4 (tokens CSS), thème et styles globaux.
- `components/`
  - `auth-guard.tsx`: Guard simple côté client, redirige si non authentifié pour les routes non publiques et affiche `Sidebar`/`TopBanner` pour la zone protégée.
  - `atoms/`: UI atomique (ex: `croppedImage.tsx`, `loader.tsx`, `text.tsx`).
  - `commons/`: Composants communs (boutons, formulaires génériques, sidebar…).
  - `form/`: Moteur de formulaire et inputs (ex: `inputs/webCam.tsx`, `inputs/csvImporter.tsx`).
  - `public/declaration/`: Composants du parcours public (ex: `errorDisplay.tsx`, `preview.tsx`).
  - `store/`: Stores Zustand (état global UI/données).
  - `table/`: Tableaux, pagination, export.
  - `views/`: Vues métiers (recettes, arbres, onglets…).
- `types/`: Types TS pour entités et vues (ex: `agent.type.ts`, `operation-view.type.ts`, `types.ts`).
- `utils/`: Utilitaires, notamment `http-client.tsx` pour les appels API.
- `public/`: Assets statiques.

### Distinction Server vs Client Components

- Server Components (par défaut dans `app/`): pas d’accès direct au `window/localStorage`, parfaits pour le render côté serveur, data fetching server-side et SEO.
- Client Components (`"use client"`): nécessaires pour les hooks React, `localStorage`, interactions UI, webcam, recadrage d’image, etc.

Recommandation: conserver la logique data-fetching sensible côté serveur quand possible, et limiter les composants client aux interactions nécessaires.

## Dépendances et leur utilisation

| Package                     |     Version | Rôle / Usage                          | Exemple(s)                                 |
| --------------------------- | ----------: | ------------------------------------- | ------------------------------------------ |
| next                        |      16.0.2 | Framework React, App Router, build    | Scripts `dev/build/start`                  |
| react / react-dom           |      19.2.0 | Bibliothèque UI                       | Toute l’UI                                 |
| zustand                     |      ^5.0.8 | Gestion d’état globale                | `components/store/**`                      |
| tailwindcss                 |          ^4 | Design system utilitaire              | `app/globals.css`, classes Tailwind        |
| @tailwindcss/postcss        |          ^4 | Plugin PostCSS Tailwind v4            | `postcss.config.mjs`                       |
| react-webcam                |      ^7.2.0 | Capture caméra                        | `components/form/inputs/webCam.tsx`        |
| react-easy-crop             |      ^5.5.3 | Recadrage d’images                    | `components/atoms/croppedImage.tsx`        |
| xlsx                        |     ^0.18.5 | Export Excel                          | `components/table/components/exporter.tsx` |
| papaparse                   |      ^5.5.3 | Import CSV                            | `components/form/inputs/csvImporter.tsx`   |
| lucide-react                |    ^0.553.0 | Icônes                                | pages et UI                                |
| react-icons                 |      ^5.5.0 | Icônes (FA…)                          | `webCam.tsx`, etc.                         |
| framer-motion               |   ^12.23.24 | Animations (optionnel/à intégrer)     | Potentiel sur transitions                  |
| react-markdown              |     ^10.1.0 | Rendu Markdown (optionnel/à intégrer) | Pages d’aide éventuelles                   |
| eslint / eslint-config-next | ^9 / 16.0.2 | Linting                               | `npm run lint`                             |
| typescript                  |          ^5 | Typage statique                       | TS partout                                 |

## Fonctionnalités métier

### Gestion du contribuable

- Parcours d’inscription multi-étapes: `app/registration/page.tsx`.
  - Chargement dynamique des champs via `GET /taxpayer/registration` (backend).
  - Soumission via `POST /taxpayer/registration`.
  - Validation de progression (les champs requis doivent être renseignés).

### Authentification / sécurité

- `components/auth-guard.tsx` agit comme un guard client:
  - Liste de routes publiques (`/public/**`, `/auth/login`, etc.).
  - Pour les routes privées: lecture de `localStorage` clé `dp-sk-moto-user` pour déterminer la présence d’un utilisateur connecté; sinon redirection vers `/auth/login`.
  - Affiche `Sidebar` et `TopBanner` sur les routes protégées.

Note importante: le client HTTP actuel injecte un token « hardcodé » pour `Authorization` (à remplacer par une gestion réelle de session/refresh token). Voir section « Tokens / sessions » plus bas.

### Traitement des déclarations ou opérations

- Le socle UI inclut des composants de workflow/déclaration sous `components/public/declaration/` (progression, navigation d’étapes, affichage erreurs, prévisualisation…).
- Les vues et « recipes » (nomenclatures) sont gérées sous `components/views/recipe/**` et `types/recipe-view.ts`.

### Gestion des documents (webcam, crop, upload)

- Capture: `components/form/inputs/webCam.tsx` (react-webcam) avec sélection de caméra, screenshot, et upload.
- Recadrage: `components/atoms/croppedImage.tsx` (react-easy-crop) pour découpe/cadrage, restitution en `Blob` + `dataUrl`.

Exemple (simplifié) d’intégration recadrage:

```tsx
// imageSrc → ouverture du cropper, onCropComplete → File/Blob final
<CropperModal
  imageSrc={tempImage}
  onClose={() => setShowCropper(false)}
  onCropComplete={(blob, dataUrl) => setValue(new File([blob], "photo.jpg"))}
  aspectRatio={1}
/>
```

### Import/Export (CSV, Excel)

- Import CSV/Excel: `components/form/inputs/csvImporter.tsx`
  - Lecture CSV: PapaParse (header, typing, skipEmptyLines).
  - Lecture Excel: `xlsx` (Sheet → JSON).
  - Mapping colonnes fichier → champs fonctionnels avec pré-mapping heuristique.
  - Édition inline des cellules et synchronisation avec la valeur de formulaire.
- Export Excel: `components/table/components/exporter.tsx`
  - Sélection des colonnes à exporter, génération d’un workbook Excel et téléchargement.

### Historique, workflow, validations

- UI de progression d’étapes (`components/public/declaration/utils.tsx`) et composants d’affichage d’erreurs (`components/public/declaration/errorDisplay.tsx`).
- Les validations côté formulaire d’inscription s’assurent que les champs requis sont renseignés avant de passer à l’étape suivante (`isStepValid()`).

## Stores Zustand

### Liste des stores (extraits clés)

- `components/store/connectedUser.ts`

  - État: `{ user: ConnectedUser | null }`
  - Actions: `setter(user)`

- `components/store/form.store.ts`

  - État: `{ fields: Record<string, FormField> }`
  - Actions: `setFields`, `initializeFields`, `updateField(path, value)`, `addChild(parentKey, children, isMultiple)`, `removeChild(path, childIndex, isKeyMultiple)`, `createFormDataFromObject(obj)`
  - Points forts: gestion de chemins imbriqués `a.b[0].c`, génération d’`id` sur objets, sérialisation FormData (détection de `File` récursivement).

- `components/store/form_value.store.ts`

  - État: `{ value: Record<string, any> }`
  - Actions: `setValue(obj)`, `setValueKey(key, val)`, `reset()`

- `components/store/applications.ts`

  - État: layout, liste applications, sélection, statut de chargement, erreurs
  - Actions: `setDisplayLayout`, `setApplications`, `setCurrentApplication`, `setIsLoading`, `setError`

- `components/store/currentMenu.ts`

  - État: `{ menus: SideMenuType[] }`
  - Actions: `setMenus`

- `components/store/sidebarState.ts`

  - État: `{ isOpen: boolean }`
  - Actions: `setIsOpen`

- `components/store/dictionary.ts`
  - Dictionnaire de traduction FR pour libellés métiers (ex: taxpayer → contribuable).

### Architecture de gestion d’état

- Stores atomiques par domaine (utilisateur, formulaires, UI, menu).
- Les composants y accèdent via hooks (ex: `const { user, setter } = connectedUserStore()`).
- Le store `form.store.ts` fournit des utilitaires robustes pour gérer des formulaires dynamiques complexes, y compris des listes d’enfants, et la sérialisation en `FormData` pour upload.

## API et intégrations backend

### Client HTTP

`utils/http-client.tsx` centralise les appels API:

- Base URL: `process.env.NEXT_PUBLIC_API_BASE_URL` (défaut `http://localhost:4000`).
- En-têtes par défaut incluent `x-workspace-id` et `Authorization` (actuellement un token hardcodé à remplacer).
- Méthodes: `get`, `post`, `put`, `delete`, `patch`.
- Gestion d’erreurs: remonte `this.error = { code, message, ... }` si `response.ok` est faux.

Exemple d’usage:

```ts
const client = new HttpClient();
const result = await client.post("/taxpayer/registration", payload);
if (!result) {
  console.error(client.error);
}
```

### Endpoints utilisés (observés)

- `GET /taxpayer/registration` → récupère la définition des champs du formulaire d’inscription (type, propriété, options, etc.).
- `POST /taxpayer/registration` → soumet les données d’inscription d’un contribuable.

### Middleware et protections

- Auth côté client via `auth-guard.tsx` (redirection si non connecté sur routes privées).
- À compléter côté Next middleware (si besoin) pour contrôler des routes serveur (`middleware.ts`) — non présent actuellement.

### Gestion des erreurs

- Côté HTTP: mappage `response.json()` en `this.error` si non `ok`.
- Côté UI: composant `ErrorDisplay` pour surfacer les messages d’erreur, affichages inline pour l’inscription.

### Tokens / sessions

- LocalStorage keys observées:
  - `dp-sk-moto-user`: informations d’utilisateur connecté (guard).
  - `dp-sk-moto-token`: lu par le client HTTP (mais la version courante injecte un token hardcodé côté code, à corriger).
- Recommandation: remplacer par une gestion d’auth sécurisée (login → access + refresh token, rotation, stockage httpOnly cookies ou `Authorization` dynamique, renouvellement silencieux).

## Design & UI

### Utilisation de Tailwind CSS 4

- Config via PostCSS: `@tailwindcss/postcss` (pas de `tailwind.config.js` classique en v4).
- `app/globals.css` définit:
  - Import Tailwind `@import "tailwindcss";`
  - Thème: variables CSS (`--background`, `--foreground`, `--primary`, palettes app-blue/app-green, tailles de texte).
  - Variante `dark` via `@custom-variant dark`.
  - Styles globaux (scrollbar hidden, tokens, animations).

### Composants réutilisables

- Boutons, inputs (dont `webCam`, `csvImporter`), tables (pagination/export), graphes simples, éléments de navigation/menus.
- Form moteur générique (`components/form/**`), et dispatcheur d’inputs par type.

### Conventions de nommage

- Fichiers TypeScript `.ts/.tsx`, PascalCase pour composants, camelCase pour fonctions/variables.
- Types centralisés sous `types/` (suffixe `.type.ts` le cas échéant).
- Stores: un fichier par store, nom explicite (`connectedUser`, `form.store`, `applications`, etc.).

## Build, lancement et déploiement

### Scripts npm

| Script | Commande               | Description                                            |
| ------ | ---------------------- | ------------------------------------------------------ |
| dev    | `next dev --port=3600` | Démarre le serveur de dev (Turbopack) sur le port 3600 |
| build  | `next build`           | Build de production                                    |
| start  | `next start`           | Démarre le serveur Next en production                  |
| lint   | `eslint`               | Lint du projet                                         |

Lancement en dev:

```bash
npm run dev
# ou
yarn dev
```

### Configuration d’environnement

Variables (minimum):

- `NEXT_PUBLIC_API_BASE_URL` (ex: `http://localhost:4000`)

Proposition de `.env.example`:

```env
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Notes Docker / CI/CD

- Docker/CI: non fournis dans le repo actuel. Recommandations:
  - Ajouter un `Dockerfile` multi-stage (build → runtime).
  - Pipeline CI (lint, typecheck, build) puis déploiement (Vercel, container registry + orchestrateur).

## Bonnes pratiques du projet

### Structure des composants

- Favoriser de petits composants testables et réutilisables (atoms/commons).
- Déporter la logique de transformation/form-data dans les stores/utilitaires (ex: `form.store.ts`).

### Règles et conventions

- Utiliser TypeScript strict (`strict: true` dans `tsconfig.json`).
- Préférer Server Components pour SSR/data-fetching côté serveur quand possible.
- Limiter l’usage de `use client` aux composants interactifs/accès navigateur.
- Centraliser les appels API via `HttpClient` (un seul endroit pour headers/erreurs).

### Recommandations de maintenance

- Remplacer le token hardcodé dans `HttpClient` par un jeton stocké de manière sécurisée et actualisé.
- Ajouter des tests (unitaires/integ) sur:
  - Parsing CSV/Excel et mapping.
  - Sérialisation `createFormDataFromObject`.
  - Stores (actions et invariants).

## Roadmap / améliorations possibles

### Idées d’améliorations

- Auth: implémenter un vrai flux (login/logout), refresh tokens, cookies httpOnly, protection middleware Next.
- Accessibilité: améliorer ARIA, focus states, contrastes.
- i18n: intégrer une lib i18n (ex: `next-intl`) pour internationalisation complète.
- Erreurs: standardiser surfaces d’erreurs (toasts, mapping uniforme d’erreurs API).

### Réorganisation architecturale potentielle

- Introduire un dossier `lib/` pour: clients, hooks, utils métiers.
- Regrouper `components/form` avec un schema/registry d’inputs clairement typé.
- Ajouter un `middleware.ts` (ex: protection server-side de certains segments `app/(protected)/...`).

### Optimisations de performance

- Table: virtualisation des listes volumineuses (ex: `react-virtualized`).
- Mémoïsation: `useMemo`/`useCallback` sur composants coûteux.
- Split code côté client, lazy-loading pour pages lourdes.
- Cache HTTP (stale-while-revalidate) pour endpoints de configuration statiques.

---

## Annexes (exemples ciblés)

### Exemple — HttpClient usage

```ts
const client = new HttpClient();
const response = await client.get<{ data: any[] }>("/taxpayer/registration");
if (!response) {
  // UI: afficher ErrorDisplay
  console.error(client.error);
} else {
  // response.data → champs de formulaire dynamiques
}
```

### Exemple — Import CSV (PapaParse)

```ts
Papa.parse(file, {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true,
  complete: (results) => {
    /* mapping des colonnes */
  },
});
```

### Exemple — Export Excel

```ts
const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
XLSX.writeFile(workbook, "export.xlsx");
```

### Exemple — Store Zustand (extrait)

```ts
export const connectedUserStore = create<ConnectedUserStoreType>()((set) => ({
  user: null,
  setter: (user) => set({ user }),
}));
```

## Résumé des points clés

- App Router (Next 16), React 19, Tailwind 4, Zustand 5.
- Formulaires dynamiques, import/export CSV/Excel, capture/recadrage d’images.
- API centralisée via `HttpClient`, endpoints `GET/POST /taxpayer/registration` observés.
- Stores Zustand pour utilisateur, formulaires, UI et navigation.
- À corriger: suppression du token hardcodé et mise en place d’une authentification robuste.
