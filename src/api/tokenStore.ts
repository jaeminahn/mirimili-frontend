let _accessToken = localStorage.getItem("accessToken") || "";
let _onAccessChange: (t: string) => void = () => {};

export const getAccessToken = () => _accessToken;

export const setTokens = (access: string) => {
  _accessToken = access || "";
  localStorage.setItem("accessToken", _accessToken);
  _onAccessChange(_accessToken);
};

export const clearTokens = () => {
  _accessToken = "";
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const subscribeAccessToken = (cb: (t: string) => void) => {
  _onAccessChange = cb;
};