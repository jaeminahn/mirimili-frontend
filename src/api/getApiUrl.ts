export const getApiUrl = (path: string) => {
  const host = "https://wjrc33-8002.csb.app";
  return [host, path].join("");
};
