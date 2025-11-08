import { getApiUrl } from "./getApiUrl";
import { getAccessToken, setTokens, clearTokens } from "./tokenStore";

export type JsonResult<T> = { ok: boolean; status: number; data: T | null };

let refreshPromise: Promise<string> | null = null;

function isAuthEndpoint(path: string) {
  const base = getApiUrl("");
  const url = path.replace(base, "");
  return /^\/?auth\/(login|join|signup|reissue|logout)$/i.test(url);
}

function cleanBearer(t?: string | null) {
  return (t || "").replace(/^Bearer\s+/i, "");
}

async function reissueAccessToken(expiredAccess: string): Promise<string> {
  if (refreshPromise) return refreshPromise;

  const expired = cleanBearer(expiredAccess);

  refreshPromise = (async () => {
    const res = await fetch(getApiUrl("/auth/reissue"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${expired}`,
      },
      credentials: "include",
    });
    if (!res.ok) throw new Error("reissue failed");

    const json = await res.json();
    const newAccess = json?.data?.accessToken as string | undefined;
    if (!json?.success || !newAccess) throw new Error("reissue invalid");

    setTokens(newAccess);
    return newAccess;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function doFetch(
  path: string,
  init: RequestInit = {},
  retry = false
): Promise<Response> {
  const headers = new Headers(init.headers);
  const access = getAccessToken();

  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (!headers.has("Authorization") && access && !isAuthEndpoint(path)) {
    headers.set("Authorization", `Bearer ${cleanBearer(access)}`);
  }

  const res = await fetch(getApiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status !== 401 || retry) return res;
  if (!access) return res;

  try {
    const newAccess = await reissueAccessToken(access);
    const retryHeaders = new Headers(init.headers);
    if (!retryHeaders.has("Accept"))
      retryHeaders.set("Accept", "application/json");
    if (!retryHeaders.has("Authorization") && !isAuthEndpoint(path)) {
      retryHeaders.set("Authorization", `Bearer ${cleanBearer(newAccess)}`);
    }
    return await fetch(getApiUrl(path), {
      ...init,
      headers: retryHeaders,
      credentials: "include",
    });
  } catch {
    clearTokens();
    return res;
  }
}

async function toJsonResult<T>(res: Response): Promise<JsonResult<T>> {
  const txt = await res.text();
  let data: T | null = null;
  try {
    data = txt ? JSON.parse(txt) : null;
  } catch {}
  return { ok: res.ok, status: res.status, data };
}

const withBodyMethod =
  (methodName: "POST" | "PUT" | "PATCH") =>
  (path: string, data?: any, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (!(data instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const body =
      data === undefined || data === null
        ? undefined
        : data instanceof FormData
        ? data
        : JSON.stringify(data);

    return doFetch(path, { ...init, method: methodName, headers, body });
  };

export const post = withBodyMethod("POST");
export const put = withBodyMethod("PUT");
export const patch = withBodyMethod("PATCH");

export async function postJSON<T = any>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<JsonResult<T>> {
  const res = await post(path, body, init);
  return toJsonResult<T>(res);
}

export async function putJSON<T = any>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<JsonResult<T>> {
  const res = await put(path, body, init);
  return toJsonResult<T>(res);
}

export async function patchJSON<T = any>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<JsonResult<T>> {
  const res = await patch(path, body, init);
  return toJsonResult<T>(res);
}
