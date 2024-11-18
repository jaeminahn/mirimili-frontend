import { getApiUrl } from "./getApiUrl";

const postAndPut =
  (methodName: string) =>
  (path: string, data: object, jwt?: string | null | undefined) => {
    let init: RequestInit = {
      method: methodName,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    };
    if (jwt) {
      init = {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${jwt}`,
        },
      };
    }
    return fetch(getApiUrl(path), init);
  };

export const post = postAndPut("POST");
export const put = postAndPut("PUT");
