import { getApiUrl } from "./getApiUrl";

export const get = (path: string) => fetch(getApiUrl(path));
export const del = (path: string) =>
  fetch(getApiUrl(path), { method: "DELETE" });
