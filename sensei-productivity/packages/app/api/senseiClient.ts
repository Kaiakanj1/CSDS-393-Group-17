type SignupPayload = {
  firstName: string;
  lastName: string;
  school: string;
  username: string;
  email: string;
  password: string;
};

type SignupResponse = { accessToken: string };

type SenseiClientOptions = {
  baseUrl?: string;
  getAccessToken?: () => string | null;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API Error (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function createSenseiClient(opts: SenseiClientOptions = {}) {
  const baseUrl =
    opts.baseUrl ?? "https://csds393-group17-rest-api.aurora-interactive.online";

  async function request<T>(path: string, method: "POST" | "GET", body?: unknown) {
    const token = opts.getAccessToken?.();

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? safeJson(text) : null;

    if (!res.ok) throw new ApiError(res.status, data ?? text);
    return data as T;
  }

  return {
    users: {
      signup: (payload: SignupPayload) =>
        request<SignupResponse>("/api/v1/signup", "POST", payload),
    },
  };
}

function safeJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}