type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private workspaceId: string;
  error: {
    code: number;
    message: string;
    [key: string]: any;
  } | null = null;

  constructor(defaultHeaders: HeadersInit = {}) {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    this.workspaceId = process.env.NEXT_PUBLIC_WORKSPACE_ID || "KINSHASA";
    this.defaultHeaders = {
      ...defaultHeaders,
    };
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    body?: Record<string, any> | FormData,
    customHeaders?: HeadersInit,
    customToken?: string
  ): Promise<
    | {
        code: number;
        message: string;
        data: T;
        meta?: any;
        form?: any;
      }
    | false
  > {
    const url = `${this.baseUrl}${
      endpoint[0] == "/" ? endpoint : `/${endpoint}`
    }`;
    const browserToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("dp-sk-moto-token")
        : null;
    const token = customToken || browserToken || undefined;

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      "x-workspace-id": this.workspaceId,
    };

    // Merge custom headers (override defaults)
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([k, v]) => {
        if (typeof v !== "undefined") {
          headers[k] = String(v);
        }
      });
    }

    // Authorization header only if token provided/available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Determine Content-Type based on body type
    if (body instanceof FormData) {
      // Remove Content-Type header for FormData; browser will set it automatically
      delete headers["Content-Type"];
    } else if (body && typeof body === "object") {
      headers["Content-Type"] = "application/json";
    }

    const options: RequestInit = {
      method,
      headers: headers,
    };

    if (body) {
      options.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        if ("statusCode" in error)
          this.error = { code: error.statusCode, message: error.message };
        else this.error = error;
        return false;
      }

      if (response.status === 204) return false;

      const data = await response.json();
      return data;
    } catch (error: any) {
      this.error = {
        code: 500,
        message: error.message || "une erreur s'est produite",
        error: {
          errorCode: error.code,
          errorMessage: error.message,
          details: error.toString(),
        },
      };
      return false;
    }
  }

  public get<T>(
    endpoint: string,
    customHeaders?: HeadersInit,
    customToken?: string
  ) {
    return this.request<T>(
      endpoint,
      "GET",
      undefined,
      customHeaders,
      customToken
    );
  }

  public post<T>(
    endpoint: string,
    body: Record<string, any> | FormData,
    customHeaders?: HeadersInit,
    customToken?: string
  ) {
    return this.request<T>(endpoint, "POST", body, customHeaders, customToken);
  }

  public put<T>(
    endpoint: string,
    body: Record<string, any> | FormData,
    customHeaders?: HeadersInit,
    customToken?: string
  ) {
    return this.request<T>(endpoint, "PUT", body, customHeaders, customToken);
  }

  public delete<T>(
    endpoint: string,
    customHeaders?: HeadersInit,
    customToken?: string
  ) {
    return this.request<T>(
      endpoint,
      "DELETE",
      undefined,
      customHeaders,
      customToken
    );
  }

  public patch<T>(
    endpoint: string,
    body: Record<string, any> | FormData,
    customHeaders?: HeadersInit,
    customToken?: string
  ) {
    return this.request<T>(endpoint, "PATCH", body, customHeaders, customToken);
  }
}

export default HttpClient;
