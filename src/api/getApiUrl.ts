export const getApiUrl = (path: string) =>
  "https://api.mirimili.co.kr/" + String(path || "").replace(/^\/+/, "");
