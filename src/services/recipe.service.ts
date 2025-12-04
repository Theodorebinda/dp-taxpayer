import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  DeclarableRecipe,
  DeclarableRecipesResponse,
} from "@/types/recipe.type";
import type { OperationView } from "@/types/operation-view.type";
import type { ApiInputType } from "@/types/types";

// Type pour FormStep (structure retournée par l'API)
type FormStep = {
  property: string;
  id: string;
  title: string;
  description?: string;
  fields: ApiInputType[];
};

type ApiWrapper<T> = {
  code: number;
  message: string;
  data: T;
  meta?: unknown;
  form?: unknown;
};

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object") {
    const r = res as Partial<ApiWrapper<unknown>> & { data?: unknown };
    if (typeof r.data !== "undefined") {
      const inner = r.data as { data?: unknown };
      if (inner && typeof inner === "object" && "data" in inner) {
        return (inner as { data: T }).data as T;
      }
      return r.data as T;
    }
  }
  return res as T;
}

function extractForm(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  if ("form" in record) {
    const maybeForm = record["form"];
    if (maybeForm && typeof maybeForm === "object") {
      return maybeForm as Record<string, unknown>;
    }
  }

  if ("data" in record) {
    return extractForm(record["data"]);
  }

  return null;
}

export type RecipeFormFieldsPayload = {
  fields: ApiInputType[];
  form: Record<string, unknown> | null;
  message?: string;
};

/**
 * Récupère la liste des recipes déclarables
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @returns La liste des recipes déclarables ou false en cas d'erreur
 */
export async function getDeclarableRecipes(
  accessToken?: string
): Promise<DeclarableRecipe[] | false> {
  const res = await apiClient.get<DeclarableRecipesResponse>(
    API_ENDPOINTS.DECLARABLE_RECIPES,
    undefined,
    accessToken
  );
  if (!res) return false;

  const data = unwrapData<DeclarableRecipe[]>(res);
  return Array.isArray(data) ? data : [];
}

/**
 * Récupère les champs de formulaire pour une recipe donnée
 * @param recipeId - ID de la recipe
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @returns Les champs du formulaire ou false en cas d'erreur
 */
export async function getRecipeFormFields(
  recipeId: string,
  accessToken?: string
): Promise<RecipeFormFieldsPayload | false> {
  const res = await apiClient.get<
    ApiInputType[] | FormStep[] | { data: ApiInputType[] | FormStep[] }
  >(API_ENDPOINTS.RECIPE_FORM(recipeId), undefined, accessToken);
  if (!res) return false;

  let payload: ApiInputType[] = [];

  if (Array.isArray(res)) {
    // Vérifier si c'est un tableau de FormStep ou ApiInputType
    if (
      res.length > 0 &&
      "fields" in res[0] &&
      Array.isArray((res[0] as FormStep).fields)
    ) {
      // C'est un tableau de FormStep, aplatir les fields
      payload = (res as FormStep[]).flatMap((step) => step.fields);
    } else {
      // C'est directement un tableau de ApiInputType
      payload = res as ApiInputType[];
    }
  } else if (res && typeof res === "object" && "data" in res) {
    const data = (res as { data: unknown }).data;
    if (Array.isArray(data)) {
      // Vérifier si c'est un tableau de FormStep ou ApiInputType
      if (
        data.length > 0 &&
        "fields" in data[0] &&
        Array.isArray((data[0] as FormStep).fields)
      ) {
        // C'est un tableau de FormStep, aplatir les fields
        payload = (data as FormStep[]).flatMap((step) => step.fields);
      } else {
        // C'est directement un tableau de ApiInputType
        payload = data as ApiInputType[];
      }
    } else if (data && typeof data === "object") {
      // La structure est : { data: { possessionForm: { fields: [...] }, taxpayerIdentity: { fields: [...] }, ... } }
      // Extraire tous les fields de toutes les propriétés
      const dataObj = data as Record<string, unknown>;
      for (const key in dataObj) {
        const value = dataObj[key];
        if (value && typeof value === "object" && "fields" in value) {
          const fieldsObj = value as { fields: unknown };
          if (Array.isArray(fieldsObj.fields)) {
            payload.push(...(fieldsObj.fields as ApiInputType[]));
          }
        }
      }
    } else {
      // Essayer unwrapData comme fallback
      const unwrapped = unwrapData<
        ApiInputType[] | FormStep[] | Record<string, { fields: ApiInputType[] }>
      >(res);
      if (Array.isArray(unwrapped)) {
        if (
          unwrapped.length > 0 &&
          "fields" in unwrapped[0] &&
          Array.isArray((unwrapped[0] as FormStep).fields)
        ) {
          payload = (unwrapped as FormStep[]).flatMap((step) => step.fields);
        } else {
          payload = unwrapped as ApiInputType[];
        }
      } else if (unwrapped && typeof unwrapped === "object") {
        // Même logique pour unwrapped si c'est un objet
        const unwrappedObj = unwrapped as Record<string, unknown>;
        for (const key in unwrappedObj) {
          const value = unwrappedObj[key];
          if (value && typeof value === "object" && "fields" in value) {
            const fieldsObj = value as { fields: unknown };
            if (Array.isArray(fieldsObj.fields)) {
              payload.push(...(fieldsObj.fields as ApiInputType[]));
            }
          }
        }
      }
    }
  } else {
    // Essayer unwrapData comme fallback
    const unwrapped = unwrapData<
      ApiInputType[] | FormStep[] | Record<string, { fields: ApiInputType[] }>
    >(res);
    if (Array.isArray(unwrapped)) {
      if (
        unwrapped.length > 0 &&
        "fields" in unwrapped[0] &&
        Array.isArray((unwrapped[0] as FormStep).fields)
      ) {
        payload = (unwrapped as FormStep[]).flatMap((step) => step.fields);
      } else {
        payload = unwrapped as ApiInputType[];
      }
    } else if (unwrapped && typeof unwrapped === "object") {
      // Même logique pour unwrapped si c'est un objet
      const unwrappedObj = unwrapped as Record<string, unknown>;
      for (const key in unwrappedObj) {
        const value = unwrappedObj[key];
        if (value && typeof value === "object" && "fields" in value) {
          const fieldsObj = value as { fields: unknown };
          if (Array.isArray(fieldsObj.fields)) {
            payload.push(...(fieldsObj.fields as ApiInputType[]));
          }
        }
      }
    }
  }

  const meta = res as { message?: string };
  const form = extractForm(res) ?? null;

  return {
    fields: payload,
    form,
    message:
      typeof meta.message === "string" && meta.message.trim().length > 0
        ? meta.message
        : undefined,
  };
}

/**
 * Soumet une nouvelle déclaration pour une recipe
 * @param recipeId - ID de la recipe
 * @param payload - Données du formulaire
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @returns Les données créées ou false en cas d'erreur
 */
export async function createRecipeDeclaration(
  recipeId: string,
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<{ data: Record<string, unknown>; message?: string } | false> {
  const res = await apiClient.post<Record<string, unknown>>(
    API_ENDPOINTS.CREATE_RECIPE_DECLARATION(recipeId),
    payload,
    undefined,
    accessToken
  );
  if (!res) return false;
  const data = unwrapData<Record<string, unknown>>(res);
  const message =
    typeof res.message === "string" && res.message.trim().length > 0
      ? res.message
      : undefined;
  return { data, message };
}

export async function fetchDeclaration(
  id: string,
  accessToken?: string
): Promise<OperationView | null> {
  const res = await apiClient.get<Record<string, unknown>>(
    API_ENDPOINTS.FETCH_POSSESSION(id),
    undefined,
    accessToken
  );

  console.log({ res });

  if (!res) return null;
  return unwrapData<OperationView>(res);
}
