import type { FC, PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { post } from "../api/postAndPut";
import {
  setTokens,
  clearTokens,
  subscribeAccessToken,
} from "../api/tokenStore";

export type LoggedUser = { tel: string; nick: string };
type Callback = () => void;

export enum ServiceTypeE {
  PRE_ENLISTED = "PRE_ENLISTED",
  ENLISTED = "ENLISTED",
  DISCHARGED = "DISCHARGED",
}

export type SignupPayload = {
  serviceAgreed: boolean;
  privacyPolicyAgreed: boolean;
  marketingConsentAgreed: boolean;
  tel: string;
  password: string;
  nick: string;
  serviceType?: ServiceTypeE;
};

type ContextType = {
  loggedUser?: LoggedUser;
  signup: (data: SignupPayload, callback?: Callback) => void;
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
    subscribeAccessToken((t) => setAccessToken(t));
  }, []);

  const signup = useCallback((data: SignupPayload, callback?: Callback) => {
    const {
      serviceAgreed,
      privacyPolicyAgreed,
      marketingConsentAgreed,
      tel,
      password,
      nick,
      serviceType,
    } = data;

    post("/auth/signup", {
      phoneNumber: tel,
      password,
      nickname: nick,
      serviceAgreed,
      privacyPolicyAgreed,
      marketingConsentAgreed,
      ...(serviceType ? { miliStatus: serviceType } : {}),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.success === true) {
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
  }, []);

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
            setTokens(access, refresh);
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
    clearTokens();
    callback?.();
  }, []);

  const value = { loggedUser, signup, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
