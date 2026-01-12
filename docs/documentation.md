## DigiPublic Taxpayer Web App — Documentation Technique et Fonctionnelle

### Introduction générale

Cette documentation présente l’architecture, la logique métier, les dépendances et les conventions du projet DigiPublic Taxpayer Web App. Elle sert de référence pour les développeurs, intégrateurs et parties prenantes (agents, contribuables, équipes produit).

Le projet est construit avec Next.js 16 (App Router) et React 19, utilise Zustand pour la gestion d’état, TanStack Query pour le data-fetching côté client, Tailwind CSS 4 pour le style, et propose des fonctionnalités d’import/export (CSV/Excel), capture/recadrage d’images, et des formulaires dynamiques pilotés par API.

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
- TanStack Query 5 (data fetching côté client)
- Tailwind CSS 4 (via `@tailwindcss/postcss`)
- react-webcam (capture)
- react-easy-crop (recadrage)
- xlsx (export Excel)
- papaparse (CSV)
- Iconographie: `lucide-react`, `react-icons`

## Architecture du projet

### App Router (Next 16)

Le projet utilise l’App Router (dossier `src/app/`), avec des groupes de routes pour structurer l’espace public/marketing. Par défaut, les composants dans `app/` sont des Server Components; un composant devient Client Component s’il déclare `use client` au sommet du fichier. L’initialisation TanStack Query est injectée via `src/app/providers.tsx`.

Exemples de pages/entrées:
- `src/app/(marketing)/page.tsx` (landing)
- `src/app/(public)/registration/page.tsx` (inscription)
- `src/app/layout.tsx` (layout racine + providers)

### Schéma de l’arborescence (réelle)

```
/src
  /app
    / (marketing)/
      - page.tsx
    / (public)/
      / registration/
        - page.tsx
    - favicon.ico
    - globals.css
    - layout.tsx
    - page.tsx
    - providers.tsx
  /components
    / atoms/
    / commons/
    / form/
      / engine/
      / inputs/
      / utils/
    / graphs/
    / menus/
    / public/declaration/
    / store/            ← re-exports vers `src/store`
    / table/
    - auth-guard.tsx
    - ui/index.ts
    - views/** (vues métiers)
  /hooks
    - useApi.ts         ← hooks TanStack Query (query/mutation/infinite)
  /lib
    / api/
      - client.ts
      - endpoints.ts
    / cache/
      - query-client.ts
    / forms/
      - schema.ts
      - serialization.ts
    / utils/
      - env.ts
  /services
    - taxpayer.service.ts
  /store                 ← Stores Zustand (source of truth)
    - applications.ts
    - connectedUser.ts
    - currentMenu.ts
    - form.store.ts
    - form_value.store.ts
    - sidebarState.ts
  /types                 ← Types et contrats front
  /utils
    - http-client.tsx    ← Client HTTP central (wrap par lib/api/client)
```

Fichiers racine:
- `eslint.config.mjs`
- `next.config.ts`
- `package.json` / `package-lock.json` / `yarn.lock`
- `postcss.config.mjs`
- `tsconfig.json`
- `public/*` (assets)

### Rôle de chaque dossier

- `src/app/`: pages et layout racine (App Router). `globals.css` configure Tailwind 4 (tokens CSS), thème et styles globaux. `providers.tsx` installe TanStack Query via `QueryClientProvider`.
- `src/components/`
  - `auth-guard.tsx`: Guard client, redirige si non authentifié pour les routes non publiques; affiche `Sidebar`/`TopBanner` pour la zone protégée.
  - `atoms/`: UI atomique (ex: `croppedImage.tsx`, `loader.tsx`, `text.tsx`).
  - `commons/`: Composants communs (boutons, formulaires génériques, sidebar).
  - `form/`: Moteur de formulaire et inputs (ex: `inputs/webCam.tsx`, `inputs/csvImporter.tsx`), mapping type → input (`utils/inputPerType.tsx`), documentation d’inputs (`utils/docs.tsx`).
  - `public/declaration/`: Composants du parcours public (progression, erreurs, prévisualisation).
  - `store/`: Re-exports vers `src/store` pour simplifier les imports depuis les composants.
  - `table/`: Tableaux, pagination, export Excel.
  - `views/`: Vues métiers (recettes, arbres, onglets…).
- `src/types/`: Types TS pour entités et vues (ex: `agent.type.ts`, `operation-view.type.ts`, `types.ts`).
- `src/utils/`: Utilitaires; `http-client.tsx` pour appels API.
- `src/lib/`: Modules techniques (client API, caching query client, forms helpers).
- `src/services/`: Services métier consommant le client API (ex: `taxpayer.service.ts`).
- `src/store/`: Stores Zustand (état global UI/données).

### Distinction Server vs Client Components

- Server Components (par défaut dans `app/`): pas d’accès direct à `window/localStorage`, adaptés au SSR, SEO, et data-fetching côté serveur.
- Client Components (`"use client"`): nécessaires pour hooks React, `localStorage`, interactions UI, webcam, recadrage d’image, etc.

Recommandation: conserver la logique data-fetching sensible côté serveur quand possible; pour le data-fetching client, utiliser TanStack Query avec `QueryClientProvider` (installé globalement dans `providers.tsx`).

## Dépendances et leur utilisation

| Package                     | Version   | Rôle / Usage                                  | Exemple(s)                                     |
| --------------------------- | --------: | --------------------------------------------- | ---------------------------------------------- |
| next                        | 16.0.2    | Framework React, App Router, build            | Scripts `dev/build/start`                      |
| react / react-dom           | 19.2.0    | Bibliothèque UI                               | Toute l’UI                                     |
| zustand                     | ^5.0.8    | Gestion d’état globale                        | `src/store/**`                                 |
| @tanstack/react-query       | ^5.59.0   | Data fetching client (cache, mutations)       | `src/hooks/useApi.ts`                          |
| tailwindcss                 | ^4        | Design system utilitaire                      | `src/app/globals.css`, classes Tailwind        |
| @tailwindcss/postcss        | ^4        | Plugin PostCSS Tailwind v4                    | `postcss.config.mjs`                           |
| react-webcam                | ^7.2.0    | Capture caméra                                | `components/form/inputs/webCam.tsx`            |
| react-easy-crop             | ^5.5.3    | Recadrage d’images                            | `components/atoms/croppedImage.tsx`            |
| xlsx                        | ^0.18.5   | Export Excel                                  | `components/table/components/exporter.tsx`     |
| papaparse                   | ^5.5.3    | Import CSV                                    | `components/form/inputs/csvImporter.tsx`       |
| lucide-react                | ^0.553.0  | Icônes                                        | pages et UI                                    |
| react-icons                 | ^5.5.0    | Icônes complémentaires                        | `webCam.tsx`, etc.                             |
| framer-motion               | ^12.23.24 | Animations (optionnel/à intégrer)             | Transitions potentielles                       |
| react-markdown              | ^10.1.0   | Rendu Markdown (optionnel/à intégrer)         | Pages d’aide éventuelles                       |
| eslint / eslint-config-next | ^9 / 16   | Linting                                       | `npm run lint`                                 |
| typescript                  | ^5        | Typage statique                               | TS partout                                     |

## Fonctionnalités métier

### Gestion du contribuable

- Parcours d’inscription multi-étapes: `src/app/(public)/registration/page.tsx`
  - Chargement dynamique des champs via `GET /taxpayer/registration` (backend).
  - Soumission via `POST /taxpayer/registration`.
  - Validation de progression: `isStepValid()` s’assure que les champs requis sont renseignés avant passage à l’étape suivante.
  - Gestion d’erreurs et success modal intégrés (UI réactive et accessible).

### Authentification / sécurité

- `src/components/auth-guard.tsx` agit comme un guard client:
  - Routes publiques: `["/auth/login", "/public/taxpayer/registration", "/public/registration"]` et tout `path` commençant par `/public`.
  - Pour les routes privées: lecture de `localStorage` clé `dp-sk-moto-user` pour détecter un utilisateur connecté; sinon redirection vers `/auth/login`.
  - Affichage de `Sidebar` et `TopBanner` uniquement sur les routes protégées.
- Jeton d’accès: `Authorization: Bearer <token>` si présent dans `localStorage` (`dp-sk-moto-token`).

Note: à ce stade, l’auth repose sur `localStorage`. Une évolution vers une auth avec cookies httpOnly + refresh token est recommandée (cf. section Sécurité).

### Traitement des déclarations / opérations

- Socle UI sous `src/components/public/declaration/**`:
  - Progression d’étapes, navigation, affichage d’erreurs (`errorDisplay.tsx`), prévisualisation.
  - Types associés dans `src/components/public/declaration/types.ts`.

### Gestion des documents (webcam, crop, upload)

- Capture: `components/form/inputs/webCam.tsx` (react-webcam), sélection de caméra, screenshot, upload.
- Recadrage: `components/atoms/croppedImage.tsx` (react-easy-crop), restitution en `Blob` + `dataUrl`.
- Serialization des uploads: détection des `File` récursivement et bascule en `FormData` si nécessaire via `src/lib/forms/serialization.ts`.

### Import/Export (CSV, Excel)

- Import CSV/Excel: `components/form/inputs/csvImporter.tsx`
  - Lecture CSV: PapaParse (header, typing, skipEmptyLines).
  - Lecture Excel: `xlsx` (Sheet → JSON).
  - Mapping colonnes fichier → champs fonctionnels, édition inline et synchro valeur de formulaire.
- Export Excel: `components/table/components/exporter.tsx` (sélection colonnes, génération workbook, téléchargement).

### Historique, workflow, validations

- UI de progression d’étapes, affichages d’erreurs, validations d’inscription avec `isStepValid()`.

## Stores Zustand

Le projet définit ses stores sous `src/store/**`. Le répertoire `src/components/store/**` re-exporte les stores pour simplifier les imports côté UI.

Extraits clés:
- `src/store/connectedUser.ts`
  - État: `{ user: ConnectedUser | null }`
  - Actions: `setter(user)`
- `src/store/form.store.ts`
  - État: `{ fields: Record<string, FormField> }`
  - Actions: `setFields`, `initializeFields` (placeholder), `updateField(path, value)`, `addChild(parentKey, children, isMultiple)`, `removeChild(path, childIndex, isKeyMultiple)`, `createFormDataFromObject(obj)`
  - Points forts: gestion de chemins imbriqués (`a.b[0].c`), génération d’`id` sur objets, sérialisation FormData (détection de `File` récursivement).
- `src/store/form_value.store.ts`
  - État: `{ value: Record<string, any> }`
  - Actions: `setValue(obj)`, `setValueKey(key, val)`, `reset()`
- `src/store/applications.ts`, `src/store/currentMenu.ts`, `src/store/sidebarState.ts`
  - État: layout, menus, sidebar, etc. + actions dédiées.

Architecture de gestion d’état:
- Stores atomiques par domaine (utilisateur, formulaires, UI, menu).
- Accès via hooks (`const { fields, updateField } = useFormStore()`).
- `components/store/form.store.ts` re-exporte tout depuis `@/store/form.store` pour aider les composants à importer via un chemin “proche”.

## API et intégrations backend

### Client HTTP — `src/utils/http-client.tsx`

Caractéristiques:
- Base URL: `process.env.NEXT_PUBLIC_API_BASE_URL` (défaut `http://localhost:4000`).
- Workspace: en-tête `x-workspace-id` via `process.env.NEXT_PUBLIC_WORKSPACE_ID` (défaut `KINSHASA`).
- `Authorization` dynamique: si `dp-sk-moto-token` est présent dans `localStorage`, l’en-tête `Authorization: Bearer <token>` est ajouté; jamais hardcodé.
- Méthodes: `get`, `post`, `put`, `delete`, `patch`.
- Corps de requête: JSON automatique pour objets; `FormData` si détection de fichiers (laisse le browser définir le `Content-Type`).
- Erreurs: si `response.ok === false`, lecture du JSON et exposition via `this.error = { code, message, ... }`; gestion d’un statut 204 (renvoie `false`).

### Couche API — `src/lib/api/*`

- `client.ts`: fabrique un `apiClient` basé sur `HttpClient`.
- `endpoints.ts`: centralise les endpoints, p.ex.:
  - `TAXPAYER_REGISTRATION: "/taxpayer/registration"`

### Services métier — `src/services/taxpayer.service.ts`

- `getRegistrationFields()`: GET → retourne `{ data: ApiInputType[] } | false` (déballage flexible des payloads `data` imbriqués).
- `registerTaxpayer(payload)`: POST → retourne `{ data: Record<string, unknown> } | false`.

### Hooks TanStack Query — `src/hooks/useApi.ts`

- `useApiQuery`, `useApiInfiniteQuery`, `useApiMutation`: helpers typés pour standardiser l’usage de TanStack Query dans l’app.
- `src/lib/cache/query-client.ts`: configuration des `defaultOptions` (retries, staleTime, refetch policies).

### Exemple d’usage (client)

```ts
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { qk } from "@/utils/query-keys";
import { getRegistrationFields, registerTaxpayer } from "@/services/taxpayer.service";

const { data } = useApiQuery(qk.taxpayer.registration(), async () => {
  const res = await getRegistrationFields();
  if (!res) throw new Error("Impossible de charger les champs.");
  return res.data;
});

const createMutation = useApiMutation(async (payload: Record<string, unknown>) => {
  const res = await registerTaxpayer(payload);
  if (!res) throw new Error("Soumission échouée");
  return res.data;
});
```

## Moteur de formulaire

### Contrat des inputs — `src/types/types.ts` (`ApiInputType`)

- Supporte de nombreux types: `"text" | "number" | "select" | "multi_select" | "date" | "file" | "float" | "boolean" | "children" | "webcam" | "id_scan" | "mobile" | "email" | "password" | "text_area" | "json" | "code"`.
- Options dynamiques, `displayIf`, `childrenConfig`, `tag` spéciaux (`"csv"`, `"searchable"`, `"foreign_key"`), etc.

### Mapping type → composant — `src/components/form/utils/inputPerType.tsx`

- Route le rendu vers `TextInput`, `SelectInput`, `MultiSelectInput`, `BooleanInput`, `InputFile`, `InputWebcam`, `PhoneNumberInput`, `TextAreaInput`, `ChildrenInput`, ou `CsvExcelImportInput` suivant `props.type` et `props.tag`.

### Mapping “clé composant” — `src/lib/forms/schema.ts`

- `mapApiInputToComponentKey` permet d’obtenir un identifiant de composant UI à partir d’un input API (utile pour analytics, docs ou rendu générique).

### Sérialisation — `src/lib/forms/serialization.ts`

- `createFormDataFromObject(obj)`:
  - Recherche récursive des `File`.
  - Si présence de fichiers: construit un `FormData` avec:
    - `files[]`: fichiers renommés par leur “path” de l’objet.
    - `json`: payload JSON des données résiduelles (sans les `File`).
  - Sinon: retourne l’objet d’origine (POST JSON).

## Design & UI

### Tailwind CSS 4

- Config via PostCSS: `@tailwindcss/postcss`.
- Thème/Tokens dans `src/app/globals.css`:
  - Variables CSS: `--background`, `--foreground`, `--primary`, palettes `--app-blue/*`, `--app-green/*`, tailles de texte.
  - Variante `dark` via `@custom-variant dark`.
  - Styles globaux (scrollbar hidden, animations, etc.).

### Composants réutilisables

- Boutons, inputs (dont `webCam`, `csvImporter`), tables (pagination/export), graphes simples, navigation/menus, composants recette.
- Moteur de formulaires générique (`components/form/**`), et dispatcheur d’inputs par type (`inputPerType.tsx`).

## Build, lancement et configuration

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
- `NEXT_PUBLIC_WORKSPACE_ID` (ex: `KINSHASA`)

`.env.example` suggéré:

```env
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Workspace
NEXT_PUBLIC_WORKSPACE_ID=KINSHASA
```

### TypeScript / ESLint

- `tsconfig.json`: `strict: true`, alias `@/*` → `./src/*`, `moduleResolution: bundler`.
- `eslint.config.mjs`: `eslint-config-next` (core web vitals + TS) avec ignores explicites par défaut.

## Sécurité

- Jeton d’accès lu depuis `localStorage` (`dp-sk-moto-token`) par le client HTTP.
- Guard client (`auth-guard.tsx`) vérifie la présence d’un utilisateur (`dp-sk-moto-user`) pour les routes non publiques.

Recommandations d’amélioration:
- Migrer vers une auth robuste access+refresh tokens, avec:
  - Access token en mémoire, refresh token en cookie httpOnly.
  - Endpoints de refresh.
  - Rotation et invalidation côté serveur.
  - Middleware `src/middleware.ts` pour contrôler les segments d’app protégés (SSR).

## Tests (recommandations)

- Unitaires:
  - Parsing CSV/Excel et mapping.
  - `createFormDataFromObject` (cas imbriqués, multiples `File`).
  - Stores Zustand (actions: `updateField`, `addChild`, `removeChild`, invariants).
- Intégration:
  - Parcours d’inscription multi-étapes.
  - Gestion d’erreurs HTTP (mapping et affichage).
  - Sécurité du guard (redirigé vs autorisé).

## Accessibilité (A11y)

- Améliorer ARIA, focus states, contrastes.
- Vérifier les boutons “disabled” vs capacités clavier/screen readers.

## Internationalisation (i18n)

- Intégrer une lib i18n (ex: `next-intl`) pour l’internationalisation complète des libellés.
- Centraliser un dictionnaire et déporter la logique depuis `components/store/dictionary.ts` si besoin.

## Performance

- TanStack Query: tuning du cache (staleTime, retries) ajustable dans `query-client.ts`.
- Table: virtualisation des listes volumineuses (`react-virtualized`).
- Mémoïsation: `useMemo`/`useCallback` sur composants coûteux.
- Split code côté client, lazy-loading pour pages lourdes.
- Cache HTTP (stale-while-revalidate) pour endpoints de configuration statiques.

## Roadmap / améliorations possibles

- Auth: implémenter un flux complet (login/logout), refresh tokens, cookies httpOnly, middleware Next.
- Erreurs: standardiser la surface d’erreurs (toasts, mapping uniforme d’erreurs API).
- DX: ajouter un `middleware.ts` pour protéger `app/(protected)/**` et hydrater les sessions côté serveur.
- CI/CD: pipeline (lint, typecheck, build) + déploiement (Vercel/containers).
- Observabilité: instrumentation Web Vitals, logs client, Sentry (optionnel).

## Annexes (exemples ciblés)

### Exemple — HttpClient usage

```ts
import HttpClient from "@/utils/http-client";
const client = new HttpClient();
const response = await client.get<{ data: any[] }>("/taxpayer/registration");
if (!response) {
  console.error(client.error); // UI: afficher ErrorDisplay
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
export const useFormStore = create<FormStore>()(
  devtools((set) => ({
    fields: {},
    setFields: (fields) => set({ fields }),
    updateField: (path, value) => { /* ... */ },
    addChild: (parentKey, children, isMultiple = true) => { /* ... */ },
    removeChild: (path, childIndex, isKeyMulitiple = true) => { /* ... */ },
    createFormDataFromObject: (obj) => buildFormData(obj),
  }))
);
```

## Résumé des points clés

- App Router (Next 16), React 19, Tailwind 4, Zustand 5, TanStack Query 5.
- Formulaires dynamiques, import/export CSV/Excel, capture/recadrage d’images.
- API centralisée via `HttpClient`, endpoints `GET/POST /taxpayer/registration`, services dédiés.
- Stores Zustand pour utilisateur, formulaires, UI et navigation.
- Auth actuelle via `localStorage` (guard client); à renforcer avec une auth moderne.


