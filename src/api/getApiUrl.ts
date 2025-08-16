export const getApiUrl = (path: string) =>
  "/api/" + String(path || "").replace(/^\/+/, "");
