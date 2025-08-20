export const getApiUrl = (path: string) =>
  "https://13.124.245.214.sslip.io/" + String(path || "").replace(/^\/+/, "");
