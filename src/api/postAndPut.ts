import { getApiUrl } from "./getApiUrl";

type JsonResult<T> = { ok: boolean; status: number; data: T | null };

function normalizeAuth(jwt?: string | null) {
  if (!jwt) return null;
  return jwt.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;
}

function getStoredAccess() {
  return localStorage.getItem("accessToken") || "";
}
function getStoredRefresh() {
  return localStorage.getItem("refreshToken") || "";
}
function setStoredAccess(token: string) {
  localStorage.setItem("accessToken", token || "");
}
function clearStoredTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

let refreshPromise: Promise<string> | null = null;

async function reissueAccessToken(expiredAccess: string): Promise<string> {
  if (!getStoredRefresh()) throw new Error("no refresh");
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const res = await fetch(getApiUrl("/auth/reissue"), {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${expiredAccess}`,
      }),
      body: JSON.stringify({ refreshToken: getStoredRefresh() }),
    });
    if (!res.ok) throw new Error("reissue failed");
    const json = await res.json();
    const newAccess = json?.data?.accessToken as string | undefined;
    if (!json?.success || !newAccess) throw new Error("reissue invalid");
    setStoredAccess(newAccess);
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
  jwt?: string | null,
  retry = false
): Promise<Response> {
  const headers = new Headers(init.headers);
  const url = typeof path === "string" ? path : "";
  const isAuthEndpoint = /^\/?auth\/(login|join)$/i.test(
    url.replace(getApiUrl(""), "")
  );

  const explicitAuth = normalizeAuth(jwt);
  const storedAuth = normalizeAuth(getStoredAccess());
  const auth = isAuthEndpoint ? null : explicitAuth || storedAuth;

  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (auth) headers.set("Authorization", auth);

  const res = await fetch(getApiUrl(path), { ...init, headers });
  if (res.status !== 401 || retry) return res;

  if (!auth) return res;

  try {
    const expired = auth.replace(/^Bearer\s+/i, "");
    const newAccess = await reissueAccessToken(expired);
    const retryHeaders = new Headers(init.headers);
    retryHeaders.set("Accept", "application/json");
    retryHeaders.set("Authorization", `Bearer ${newAccess}`);
    return await fetch(getApiUrl(path), { ...init, headers: retryHeaders });
  } catch {
    clearStoredTokens();
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

const postOrPut =
  (methodName: "POST" | "PUT") =>
  (path: string, data?: any, jwt?: string | null, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (!(data instanceof FormData) && !headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");
    const body =
      data !== undefined && data !== null
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined;
    return doFetch(path, { ...init, method: methodName, headers, body }, jwt);
  };

export const post = postOrPut("POST");
export const put = postOrPut("PUT");

export async function postJSON<T = any>(
  path: string,
  body?: any,
  jwt?: string | null,
  init?: RequestInit
): Promise<JsonResult<T>> {
  const res = await post(path, body, jwt, init);
  return toJsonResult<T>(res);
}

export async function putJSON<T = any>(
  path: string,
  body?: any,
  jwt?: string | null,
  init?: RequestInit
): Promise<JsonResult<T>> {
  const res = await put(path, body, jwt, init);
  return toJsonResult<T>(res);
}
