export const getApiUrl = (path: string) => {
  const host = "http://13.124.245.214:8080";
  return [host, path].join("");
};
