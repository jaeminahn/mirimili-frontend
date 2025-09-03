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

export type LoggedUser = { id: number; tel: string; nick: string };
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

  const normalizePhone = (v: string) =>
    (v ?? "").toString().replace(/[^0-9]/g, "");
  const normalizePwd = (v: string) => (v ?? "").toString().trim();

  const signup = useCallback((data: SignupPayload, callback?: Callback) => {
    const phoneNumber = normalizePhone(data.tel);
    const password = normalizePwd(data.password);

    post("/auth/signup", {
      phoneNumber,
      password,
      nickname: data.nick,
      serviceAgreed: data.serviceAgreed,
      privacyPolicyAgreed: data.privacyPolicyAgreed,
      marketingConsentAgreed: data.marketingConsentAgreed,
      ...(data.serviceType ? { miliStatus: data.serviceType } : {}),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.success === true) {
          const memberId =
            Number(result?.data?.memberId ?? result?.data?.id ?? 0) || 0;
          const user: LoggedUser = {
            id: memberId,
            tel: phoneNumber,
            nick: data.nick,
          };
          setLoggedUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          callback?.();
        } else {
          alert(result?.message ?? "회원가입에 실패했습니다.");
        }
      })
      .catch(() => {
        alert("회원가입 중 오류가 발생했습니다.");
      });
  }, []);

  const login = useCallback(
    (tel: string, password: string, callback?: Callback) => {
      const phoneNumber = normalizePhone(tel);
      const pwd = normalizePwd(password);

      post("/auth/login", { phoneNumber, password: pwd })
        .then(async (res) => {
          const result = await res.json().catch(() => ({}));
          if (!res.ok) {
            alert(result?.message ?? `로그인 실패 (HTTP ${res.status})`);
            return;
          }
          if (result?.success === true) {
            const access = result?.data?.accessToken ?? "";
            const refresh = result?.data?.refreshToken ?? "";
            const nickname = result?.data?.nickname ?? "";
            const memberId =
              Number(result?.data?.memberId ?? result?.data?.id ?? 0) || 0;
            const user: LoggedUser = {
              id: memberId,
              tel: phoneNumber,
              nick: nickname,
            };
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
        .catch(() => {
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
