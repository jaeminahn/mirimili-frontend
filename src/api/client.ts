import { getApiUrl } from "./getApiUrl";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./tokenStore";

let refreshPromise: Promise<string> | null = null;

async function reissueAccessToken(expiredAccess: string): Promise<string> {
  if (!getRefreshToken()) throw new Error("no refresh");
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const res = await fetch(getApiUrl("/auth/reissue"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${expiredAccess}`,
      },
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    });
    if (!res.ok) throw new Error("reissue failed");
    const json = await res.json();
    const newAccess = json?.data?.accessToken;
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
  input: string,
  init: RequestInit = {},
  retry = false
): Promise<Response> {
  const access = getAccessToken();
  const headers = new Headers(init.headers);
  const url = typeof input === "string" ? input : "";
  const isAuthEndpoint = /^\/?auth\/(login|join)$/i.test(
    url.replace(getApiUrl(""), "")
  );

  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (access && !isAuthEndpoint)
    headers.set("Authorization", `Bearer ${access}`);

  const res = await fetch(getApiUrl(input), { ...init, headers });
  if (res.status !== 401 || retry) return res;

  if (!access) return res;

  try {
    const newAccess = await reissueAccessToken(access);
    const retryHeaders = new Headers(init.headers);
    if (!retryHeaders.has("Accept"))
      retryHeaders.set("Accept", "application/json");
    if (!isAuthEndpoint)
      retryHeaders.set("Authorization", `Bearer ${newAccess}`);
    return await fetch(getApiUrl(input), { ...init, headers: retryHeaders });
  } catch {
    clearTokens();
    return res;
  }
}

export const api = {
  get: (url: string, init?: RequestInit) =>
    doFetch(url, { ...(init || {}), method: "GET" }),
  post: (url: string, body?: unknown, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (!(body instanceof FormData) && !headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");
    return doFetch(url, {
      ...(init || {}),
      method: "POST",
      headers,
      body:
        body !== undefined
          ? body instanceof FormData
            ? body
            : JSON.stringify(body)
          : undefined,
    });
  },
  put: (url: string, body?: unknown, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (!(body instanceof FormData) && !headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");
    return doFetch(url, {
      ...(init || {}),
      method: "PUT",
      headers,
      body:
        body !== undefined
          ? body instanceof FormData
            ? body
            : JSON.stringify(body)
          : undefined,
    });
  },
  del: (url: string, init?: RequestInit) =>
    doFetch(url, { ...(init || {}), method: "DELETE" }),
};
