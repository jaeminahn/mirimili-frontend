import type { FC, PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { post } from "../api";

export type LoggedUser = {
  id: number;
  tel: string;
  nick: string;
  serviceType: number;
  serviceStartDate: Date;
  servicePfcDate: Date;
  serviceCplDate: Date;
  serviceSgtDate: Date;
  serviceEndDate: Date;
  serviceMos: number;
  serviceUnit: number;
};

type Callback = () => void;

type ContextType = {
  loggedUser?: LoggedUser;
  signup: (
    tel: string,
    password: string,
    nick: string,
    serviceType: number,
    serviceStartDate: Date,
    servicePfcDate: Date,
    serviceCplDate: Date,
    serviceSgtDate: Date,
    serviceEndDate: Date,
    serviceMos: number,
    serviceUnit: number,
    callback?: Callback
  ) => void;
  login: (tel: string, password: string, callback?: Callback) => void;
  logout: (callback?: Callback) => void;
};

export const AuthContext = createContext<ContextType>({
  signup: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<LoggedUser | undefined>(
    undefined
  );
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedUser && storedAccessToken) {
      setLoggedUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken || "");
      setRefreshToken(storedRefreshToken || "");
    }
  }, []);

  const signup = useCallback(
    (
      tel: string,
      password: string,
      nick: string,
      serviceType: number,
      serviceStartDate: Date,
      servicePfcDate: Date,
      serviceCplDate: Date,
      serviceSgtDate: Date,
      serviceEndDate: Date,
      serviceMos: number,
      serviceUnit: number,
      callback?: Callback
    ) => {
      post("/auth/join", {
        tel,
        password,
        nick,
        service_type_id: serviceType,
        service_start: serviceStartDate,
        service_pfc: servicePfcDate,
        service_cpl: serviceCplDate,
        service_sgt: serviceSgtDate,
        service_end: serviceEndDate,
        service_mos_id: serviceMos,
        service_unit_id: serviceUnit,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.message === "join success") {
            const user: LoggedUser = {
              id: result.user.id,
              tel,
              nick,
              serviceType,
              serviceStartDate,
              servicePfcDate,
              serviceCplDate,
              serviceSgtDate,
              serviceEndDate,
              serviceMos,
              serviceUnit,
            };
            setLoggedUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            callback?.();
          } else {
            alert(result.message);
          }
        })
        .catch((err) => {
          console.error("Signup error:", err);
          alert("회원가입 중 오류가 발생했습니다.");
        });
    },
    []
  );

  const login = useCallback(
    (tel: string, password: string, callback?: Callback) => {
      post("/auth/login", { tel, password })
        .then((res) => res.json())
        .then((result) => {
          if (result.message === "Login Success") {
            const user: LoggedUser = {
              id: result.user.id,
              tel,
              nick: result.user.nick,
              serviceType: result.user.service_type_id,
              serviceStartDate: result.user.service_start,
              servicePfcDate: result.user.service_pfc,
              serviceCplDate: result.user.service_cpl,
              serviceSgtDate: result.user.service_sgt,
              serviceEndDate: result.user.service_end,
              serviceMos: result.user.service_mos_id,
              serviceUnit: result.user.service_unit_id,
            };
            setLoggedUser(user);
            setAccessToken(result.accessToken);
            setRefreshToken(result.refreshToken);

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);

            callback?.();
          } else {
            alert(result.message);
          }
        })
        .catch((err) => {
          console.error("Login error:", err);
          alert("로그인 중 오류가 발생했습니다.");
        });
    },
    []
  );

  const logout = useCallback((callback?: Callback) => {
    setLoggedUser(undefined);
    setAccessToken("");
    setRefreshToken("");

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    callback?.();
  }, []);

  const value = {
    loggedUser,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
