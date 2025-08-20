let _accessToken = localStorage.getItem("accessToken") || "";
let _refreshToken = localStorage.getItem("refreshToken") || "";
let _onAccessChange: (t: string) => void = () => {};

export const getAccessToken = () => _accessToken;
export const getRefreshToken = () => _refreshToken;

export const setTokens = (access: string, refresh?: string) => {
  _accessToken = access || "";
  localStorage.setItem("accessToken", _accessToken);
  _onAccessChange(_accessToken);
  if (refresh !== undefined) {
    _refreshToken = refresh || "";
    localStorage.setItem("refreshToken", _refreshToken);
  }
};

export const clearTokens = () => {
  _accessToken = "";
  _refreshToken = "";
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const subscribeAccessToken = (cb: (t: string) => void) => {
  _onAccessChange = cb;
};
