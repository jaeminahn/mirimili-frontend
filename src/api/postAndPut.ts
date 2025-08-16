import { getApiUrl } from "./getApiUrl";

type JsonResult<T> = { ok: boolean; status: number; data: T | null };

function normalizeAuth(jwt?: string | null) {
  if (!jwt) return undefined;
  return jwt.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;
}

function mergeHeaders(a?: HeadersInit, b?: HeadersInit): HeadersInit {
  return { ...(a || {}), ...(b || {}) };
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
    const headers: HeadersInit = mergeHeaders(
      { "Content-Type": "application/json", Accept: "application/json" },
      init?.headers
    );
    const auth = normalizeAuth(jwt);
    if (auth) (headers as any).Authorization = auth;

    const reqInit: RequestInit = {
      method: methodName,
      headers,
      ...(data !== undefined && data !== null
        ? { body: JSON.stringify(data) }
        : {}),
      ...init,
    };

    return fetch(getApiUrl(path), reqInit);
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
