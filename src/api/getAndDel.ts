import { getApiUrl } from "./getApiUrl";
import { getAccessToken, setTokens, clearTokens } from "./tokenStore";

let refreshPromise: Promise<string> | null = null;

function isAuthEndpoint(path: string) {
  const base = getApiUrl("");
  const url = path.replace(base, "");
  return /^\/?auth\/(login|join|signup|reissue|logout)$/i.test(url);
}

async function reissueAccessToken(expiredAccess: string): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(getApiUrl("/auth/reissue"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: expiredAccess,
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
  const access = getAccessToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (!headers.has("Authorization") && access && !isAuthEndpoint(path)) {
    headers.set("Authorization", access);
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
      retryHeaders.set("Authorization", newAccess);
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

export const get = (path: string, init?: RequestInit) =>
  doFetch(path, { method: "GET", ...(init || {}) });

export const del = (path: string, init?: RequestInit) =>
  doFetch(path, { method: "DELETE", ...(init || {}) });

export async function getJSON<T = any>(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  const res = await doFetch(path, { ...init, headers });
  const txt = await res.text();
  let data: T | null = null;
  try {
    data = txt ? JSON.parse(txt) : null;
  } catch {}
  return { ok: res.ok, status: res.status, data };
}

export function withQuery(path: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params);
  return `${path.replace(/\?+.*/, "")}?${qs.toString()}`;
}
