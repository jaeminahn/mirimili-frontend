export const getApiUrl = (path: string) =>
  "https://www.mirimili.co.kr/" + String(path || "").replace(/^\/+/, "");
