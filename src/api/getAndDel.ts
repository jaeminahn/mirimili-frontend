import { getApiUrl } from "./getApiUrl";

export const get = (path: string, init?: RequestInit) =>
  fetch(getApiUrl(path), { method: "GET", ...(init || {}) });

export const del = (path: string, init?: RequestInit) =>
  fetch(getApiUrl(path), { method: "DELETE", ...(init || {}) });

export async function getJSON<T = any>(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const res = await get(path, {
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    ...init,
  });
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
