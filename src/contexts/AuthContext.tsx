import type { FC, PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { post } from "../api/postAndPut";

export type LoggedUser = {
  tel: string;
  nick: string;
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
      try {
        setLoggedUser(JSON.parse(storedUser) as LoggedUser);
      } catch {}
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
          if (result?.success === true || result?.message === "join success") {
            const user: LoggedUser = { tel, nick };
            setLoggedUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            callback?.();
          } else {
            alert(result?.message ?? "회원가입에 실패했습니다.");
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
      post("/auth/login", { phoneNumber: tel, password })
        .then((res) => res.json())
        .then((result) => {
          if (result?.success === true) {
            const access = result?.data?.accessToken ?? "";
            const refresh = result?.data?.refreshToken ?? "";
            const nickname = result?.data?.nickname ?? "";

            const user: LoggedUser = { tel, nick: nickname };
            setLoggedUser(user);
            setAccessToken(access);
            setRefreshToken(refresh);

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            callback?.();
          } else {
            alert(result?.message ?? "로그인 실패");
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
