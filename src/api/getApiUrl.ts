export const getApiUrl = (path: string) => {
  const host = "http://localhost:8002";
  return [host, path].join("");
};
