type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  error: {
    code: number;
    message: string;
    [key: string]: any;
  } | null = null;

  constructor(defaultHeaders: HeadersInit = {}) {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
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
    const brutToken = localStorage.getItem("dp-sk-moto-token");
    const headers: any = {
      ...this.defaultHeaders,
      ...customHeaders,
      "x-workspace-id": "KINSHASA",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOm51bGwsInN1YiI6IjgwNDhmNTUzLTg1NzYtNDJjZi1hMzE5LTYyZTlkYTZjNWU3ZSIsIm1haWwiOiJhZG1pbkBraW5zaGFzYSIsInVzZXJJZCI6IjgwNDhmNTUzLTg1NzYtNDJjZi1hMzE5LTYyZTlkYTZjNWU3ZSIsInR5cGUiOiJhY2Nlc3MiLCJvcmdhbml6YXRpb25JZCI6ImM2NTY0YjZlLTRhOTEtNDdjOS1iNDA1LWQwNWI2YmE4ODA4OSIsImlhdCI6MTc2Mjk5OTM4OCwiZXhwIjoxNzYzMjU4NTg4fQ.mV5P8S0GDewIAeC6mhqDpfxqc5T4QJaQ3gaH5NEEIXI`,
    };

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
