# Analyse Profonde du Formulaire Dynamique (FormEngine 2.0)

## 🎯 Vue d’ensemble

Le nouveau moteur de formulaire dynamique repose sur :

- **TanStack Query** pour récupérer la définition du formulaire, les valeurs initiales et exécuter les mutations (création/mise à jour). @src/modules/recipe/queries/useRecipeQueries.ts#84-194
- **`useDynamicForm`** qui gère localement l’état, la validation custom, le filtrage des champs visibles et la génération du payload. @src/modules/formEngine/hooks/useDynamicForm.ts#1-300
- **`DynamicField` + champs spécialisés** pour rendre chaque type de champ, y compris les structures imbriquées grâce à `ChildrenField`. @src/modules/formEngine/ui/DynamicField.tsx#1-100; @src/modules/formEngine/ui/fields/ChildrenField.tsx#1-206
- **Un store Zustand minimal** ([dynamic-form.store.ts](cci:7://file:///home/theodore-samba/Sycamore/digipublic-taxpayer-web-app/src/store/dynamic-form.store.ts:0:0-0:0)) limité aux états UI (mode édition, navigation). @src/store/dynamic-form.store.ts#1-56

L’ensemble est orchestré par `CreateContent.tsx`, composant client qui assemble la définition du formulaire, injecte les valeurs initiales et connecte les mutations de création/mise à jour. @src/app/list/create/[recipeId]/components/CreateContent.tsx#1-260

---

## ✅ Points forts actuels

1. ### Architecture en couches bien définies

   - **Service API** : [recipe.service.ts](cci:7://file:///home/theodore-samba/Sycamore/digipublic-taxpayer-web-app/src/services/recipe.service.ts:0:0-0:0) normalise les multiples formats de réponses (array, steps, objets imbriqués) et expose un payload homogène `{ fields, form, message }`. @src/services/recipe.service.ts#88-214
   - **Queries TanStack** : hooks dédiés pour `useRecipeFormDefinition`, `useRecipeInitialValues`, `useSubmitRecipeForm`, `useUpdateRecipeForm`. @src/modules/recipe/queries/useRecipeQueries.ts#84-194
   - **Hook FormEngine** : `useDynamicForm` encapsule valeurs, validation, visibilité, payload et soumission. @src/modules/formEngine/hooks/useDynamicForm.ts#24-300
   - **UI** : `DynamicField` délègue à des composants spécialisés (text, select, children…). @src/modules/formEngine/ui/DynamicField.tsx#1-100

   **Impact** : séparation claire des responsabilités, remplacement progressif de l’ancienne stack React Hook Form + Zod par un moteur propriétaire mieux adapté aux besoins dynamiques.

2. ### Centralisation de la logique `displayIf`

   - `evaluateDisplayIf` est la source unique de vérité, utilisée par `useDynamicForm`, `DynamicField` et `ChildrenField`. @src/modules/formEngine/validators/evaluateDisplayIf.ts#1-110; @src/modules/formEngine/hooks/useDynamicForm.ts#61-72; @src/modules/formEngine/ui/fields/ChildrenField.tsx#118-200
     **Impact** : comportement cohérent entre validation, visibilité et rendu.

3. ### Support complet des champs imbriqués

   - `ChildrenField` gère récursivement objets simples ou tableaux d’objets, applique `displayIf` aux sous‑champs et remonte les changements. @src/modules/formEngine/ui/fields/ChildrenField.tsx#30-205
   - La validation (`validateForm`/`validateFieldRecursive`) couvre la même récursivité. @src/modules/formEngine/validators/validateForm.ts#1-159
     **Impact** : formulaires complexes pleinement fonctionnels, y compris pour des sections répétables.

4. ### Validation runtime adaptée à l’API

   - `validateField` applique des règles dérivées de la définition API (required, min/max, patterns) pour chaque type, sans dépendance à Zod. @src/modules/formEngine/validators/validateField.ts#1-330
   - `useDynamicForm` propose validation à la volée (`validateOnChange`) et validation batch via `validateForm`. @src/modules/formEngine/hooks/useDynamicForm.ts#73-174; @src/modules/formEngine/validators/validateForm.ts#86-120
     **Impact** : moins de coût de génération de schéma et meilleure correspondance avec les contraintes backend.

5. ### Mode édition natif
   - Le composant `CreateContent` et le store Zustand détectent automatiquement l’ID à éditer, chargent les valeurs initiales, puis basculent sur la mutation d’update. @src/app/list/create/[recipeId]/components/CreateContent.tsx#37-107
   - Les mutations `useUpdateRecipeForm`/`useSubmitRecipeForm` partagent la même API. @src/modules/recipe/queries/useRecipeQueries.ts#114-194
     **Impact** : flux de mise à jour complet et homogène avec la création.

---

## ❌ Limites & axes d’amélioration

1. ### Normalisation API encore très impérative

   - [getRecipeFormFields](cci:1://file:///home/theodore-samba/Sycamore/digipublic-taxpayer-web-app/src/services/recipe.service.ts:81:0-213:1) couvre de nombreux scénarios via des `if/else` imbriqués, ce qui rend la maintenance fragile. @src/services/recipe.service.ts#88-205  
     **Piste** : extraire un adapter pur (`normalizeRecipeFormResponse`) testé unitairement.

2. ### Validation limitée aux règles connues

   - `extractValidationConfig` ne tire que `required` (et quelques placeholders), donc min/max/pattern ne sont pas encore alimentés depuis l’API. @src/modules/formEngine/validators/validateField.ts#12-20  
     **Piste** : propager les contraintes métier fournies par l’API (ex: `metadata.validation`).

3. ### Expérience d’erreur perfectible

   - `CreateContent` affiche un message générique et un simple bouton “Réessayer” en cas d’erreur réseau. @src/app/list/create/[recipeId]/components/CreateContent.tsx#140-166  
     **Piste** : détailler les erreurs (code HTTP, champs), proposer un retry automatique et journaliser côté client.

4. ### Pas de SSR sur la page de création

   - `CreateContent` est un composant client (`"use client"`), la récupération des champs se fait entièrement côté client. @src/app/list/create/[recipeId]/components/CreateContent.tsx#1-70  
     **Piste** : déplacer la pré‑récupération des champs dans un segment server ou une route RSC pour éviter le flash de chargement initial.

5. ### Store Zustand sous‑exploité

   - Il ne conserve que `isEditMode`, `editId` et la navigation, sans persister les données du formulaire entre les écrans. @src/store/dynamic-form.store.ts#12-55  
     **Piste** : soit étendre son rôle (ex : persistance stepper), soit le supprimer si inutile.

6. ### Payload filtré uniquement sur la visibilité
   - `getPayload` exclut les champs cachés mais n’applique pas de règles de nettoyage supplémentaires (ex : trim, mapping). @src/modules/formEngine/hooks/useDynamicForm.ts#135-223  
     **Piste** : introduire des hooks de transformation (beforeSubmit) pour aligner les formats attendus par l’API.

---

## 🔧 Recommandations prioritaires

1. **Introduire un adapter de normalisation testable**

   - Centraliser la logique de [getRecipeFormFields](cci:1://file:///home/theodore-samba/Sycamore/digipublic-taxpayer-web-app/src/services/recipe.service.ts:81:0-213:1) dans un module pur + tests unitaires pour chaque format API.

2. **Propager les métadonnées de validation**

   - Étendre `ApiInputType` (si besoin) pour transporter `min`, `max`, `regex`, etc., et alimenter `extractValidationConfig`.

3. **Améliorer UX d’erreur et le chargement initial**

   - Précharger les champs côté serveur et enrichir les messages d’erreur avec des codes clairs + retry automatique.

4. **Clarifier l’usage du store**

   - Documenter ou supprimer Zustand si la navigation multi‑étapes n’est pas encore implémentée, afin d’éviter un état global trompeur.

5. **Tests automatisés ciblés**
   - Ajouter des tests pour `evaluateDisplayIf`, `validateForm` (avec children), `getPayload` et l’adapter de réponse API afin d’anticiper les régressions.

---

## 📊 Résumé

| Aspect                | État                                                    |
| --------------------- | ------------------------------------------------------- |
| Architecture          | Modulaire, orientée hooks/services                      |
| Validation            | Custom runtime, encore perfectible côté règles avancées |
| Champs complexes      | Support complet (children, multi‑objets)                |
| Mode édition          | Fonctionnel (chargement et mutation dédiés)             |
| SSR / UX chargement   | À améliorer (tout client)                               |
| Observabilité/erreurs | Basique, nécessite un enrichissement                    |

Le FormEngine 2.0 fournit une base robuste et cohérente pour la génération de formulaires dynamiques. La priorité est désormais de fiabiliser la normalisation des réponses API, d’améliorer la richesse des validations et d’élever l’expérience utilisateur (chargement, erreurs, persistance) pour les flux complexes.
