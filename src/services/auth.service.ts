import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

const LOGIN_APP =
  process.env.NEXT_PUBLIC_LOGIN_APP ??
  process.env.NEXT_PUBLIC_APP_ID ??
  "web.admin";
const LOGIN_OS = process.env.NEXT_PUBLIC_LOGIN_OS ?? "linux";
const LOGIN_VERSION =
  process.env.NEXT_PUBLIC_LOGIN_VERSION ??
  process.env.NEXT_PUBLIC_APP_VERSION ??
  "v0.2.16";
const LOGIN_IMEI =
  typeof process.env.NEXT_PUBLIC_LOGIN_IMEI !== "undefined"
    ? process.env.NEXT_PUBLIC_LOGIN_IMEI
    : null;

export type BackendLoginUser = {
  id: string;
  name?: string | null;
  mail?: string | null;
  mobile?: string | null;
  photo?: string | null;
  role?: unknown[];
  taxPayer?: {
    id?: string | null;
    [k: string]: unknown;
  } | null;
  [k: string]: unknown;
};

export type LoginPayload = {
  identifier: string;
  password: string;
  app?: string;
  os?: string;
  IMEI?: string | null;
  version?: string;
};

export type OtpMethod = {
  name: string;
  value: string;
};

export type LoginResponse =
  | {
      code: number;
      message: string;
      redirectToOpt: false;
      data: BackendLoginUser;
      access_token: string;
      refresh_token?: string | null;
      expiresIn?: number;
    }
  | {
      code: number;
      message: string;
      redirectToOpt: true;
      otpMethod: OtpMethod[];
      token: string;
    };

type RefreshResponse = {
  access_token?: string;
  accessToken?: string;
  expiresIn?: number;
  data?: RefreshResponse;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const body = {
    identifier: payload.identifier,
    password: payload.password,
    app: payload.app ?? LOGIN_APP,
    os: payload.os ?? LOGIN_OS,
    IMEI: payload.IMEI ?? LOGIN_IMEI,
    version: payload.version ?? LOGIN_VERSION,
  };

  const res = await apiClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH_LOGIN,
    body
  );

  console.log("login response", res);

  if (!res)
    throw new Error("Échec de connexion, veuillez vérifier vos identifiants");

  // La réponse peut être directement la structure ou wrappée
  // Vérifier si redirectToOpt existe directement dans la réponse
  const response = res as unknown as
    | LoginResponse
    | {
        data?: LoginResponse;
        redirectToOpt?: boolean;
        token?: string;
        otpMethod?: OtpMethod[];
      };

  // Si la réponse a redirectToOpt directement, c'est le bon format
  if ("redirectToOpt" in response && response.redirectToOpt === true) {
    return response as LoginResponse;
  }

  // Sinon, vérifier si elle est wrappée dans data
  if ("data" in response && response.data) {
    const unwrapped = response.data as LoginResponse;
    if ("redirectToOpt" in unwrapped) {
      return unwrapped;
    }
  }

  // Par défaut, retourner la réponse telle quelle
  return response as LoginResponse;
}

function extractAccessToken(
  payload: RefreshResponse | undefined
): string | null {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.access_token === "string") return payload.access_token;
  if (typeof payload.accessToken === "string") return payload.accessToken;
  if (payload.data && typeof payload.data === "object") {
    return extractAccessToken(payload.data as RefreshResponse);
  }
  return null;
}

function extractExpiresIn(payload: RefreshResponse | undefined): number | null {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.expiresIn === "number") return payload.expiresIn;
  if (payload.data && typeof payload.data === "object") {
    return extractExpiresIn(payload.data as RefreshResponse);
  }
  return null;
}

export type RefreshResult = {
  accessToken: string;
  expiresIn?: number | null;
};

export async function refresh(refreshToken: string): Promise<RefreshResult> {
  const res = await apiClient.post<RefreshResponse>(
    API_ENDPOINTS.AUTH_REFRESH,
    { refreshToken }
  );
  if (!res) throw new Error("Refresh token invalide");
  const payload = res as RefreshResponse;
  const accessToken = extractAccessToken(payload);
  if (!accessToken) throw new Error("Refresh token invalide");
  const expiresIn = extractExpiresIn(payload);
  return {
    accessToken,
    expiresIn,
  };
}

// -----------------------------------------------------------------------------
// OTP SERVICES
// -----------------------------------------------------------------------------

export type SendOtpPayload = {
  token: string;
  method: string; // "email" | "sms"
};

export type SendOtpResponse = {
  code: number;
  message: string;
  data?: unknown;
};

export async function sendOtp(
  payload: SendOtpPayload
): Promise<SendOtpResponse> {
  const endpoint = API_ENDPOINTS.AUTH_OTP_SEND(payload.method);
  // console.log("sendOtp - endpoint:", endpoint);
  // console.log("sendOtp - payload:", payload);
  // console.log("sendOtp - token:", payload.token);

  const res = await apiClient.get<SendOtpResponse>(
    endpoint,
    undefined,
    payload.token
  );

  if (!res) {
    // Extraire l'erreur du client API de manière plus robuste
    const clientError = (
      apiClient as unknown as {
        error?: {
          code?: number;
          message?: string;
          error?: { errorMessage?: string; details?: unknown };
        };
      }
    )?.error;

    // Construire un message d'erreur clair et informatif pour l'utilisateur
    let errorMessage =
      "Impossible d'envoyer le code de vérification. Veuillez réessayer.";

    if (clientError) {
      // Prioriser le message de l'erreur principale
      if (clientError.message) {
        errorMessage = clientError.message;
      } else if (clientError.error?.errorMessage) {
        errorMessage = clientError.error.errorMessage;
      }
    } else {
      // console.error("sendOtp - Aucune réponse de l'API");
    }

    const error = new Error(errorMessage);
    // Ajouter des métadonnées utiles pour le débogage (non affichées à l'utilisateur)
    (error as { code?: number; details?: unknown }).code = clientError?.code;
    (error as { code?: number; details?: unknown }).details = clientError;

    throw error;
  }
  return res;
}

export type VerifyOtpPayload = {
  token: string;
  code: string;
};

export type VerifyOtpResponse = {
  code: number;
  message: string;
  redirectToOpt: false;
  data: BackendLoginUser;
  access_token: string;
  refresh_token?: string | null;
  expiresIn?: number;
};

function unwrapOtpData<T>(res: unknown): T {
  if (res && typeof res === "object") {
    const r = res as Partial<{ data?: unknown }> & { data?: unknown };
    if (typeof r.data !== "undefined") {
      // data peut contenir { data: T }
      const inner = r.data as { data?: unknown };
      if (inner && typeof inner === "object" && "data" in inner) {
        return (inner as { data: T }).data as T;
      }
      return r.data as T;
    }
  }
  return res as T;
}

export async function verifyOtp(
  payload: VerifyOtpPayload
): Promise<VerifyOtpResponse> {
  // Envoyer le token dans le header Bearer, pas dans le body
  const res = await apiClient.post<VerifyOtpResponse>(
    API_ENDPOINTS.AUTH_OTP_VALIDATION,
    { code: payload.code }, // Ne pas inclure le token dans le body
    undefined, // Pas de customHeaders
    payload.token // Token dans le header Authorization Bearer
  );
  if (!res) throw new Error("Code OTP invalide");
  // Extraire les données de la réponse wrappée
  const data = unwrapOtpData<VerifyOtpResponse>(res);
  return data;
}
