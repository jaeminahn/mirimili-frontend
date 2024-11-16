import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import * as U from "../utils";
import { post } from "../api";

export type LoggedUser = { tel: string; password: string };
type Callback = () => void;

type ContextType = {
  loggedUser?: LoggedUser;
  signup: (tel: string, password: string, callback?: Callback) => void;
  login: (tel: string, password: string, callback?: Callback) => void;
  logout: (callback?: Callback) => void;
};

export const AuthContext = createContext<ContextType>({
  signup: (tel: string, password: string, callback?: Callback) => {},
  login: (tel: string, password: string, callback?: Callback) => {},
  logout: (callback?: Callback) => {},
});

type AuthProviderProps = {};

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({
  children,
}) => {
  const [loggedUser, setLoggedUser] = useState<LoggedUser | undefined>(
    undefined
  );
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const signup = useCallback(
    (tel: string, password: string, callback?: Callback) => {
      const user = { tel, password };
      setLoggedUser((notUsed) => user);
      U.writeObjectP("user", user).finally(() => callback && callback());
    },
    []
  );

  const login = useCallback(
    (tel: string, password: string, callback?: Callback) => {
      const user = { tel, password };
      U.readStringP("accessToken")
        .then((at) => {
          setAccessToken(at ?? "");
          return post("/auth/login", user, at);
        })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.message == "Login Success") {
            setLoggedUser((notUsed) => user);
            U.writeObjectP("user", user).finally(() => callback && callback());
            callback && callback();
          } else alert(result.message);
        });
    },
    []
  );

  const logout = useCallback((callback?: Callback) => {
    setLoggedUser(undefined);
    setAccessToken("");
    setRefreshToken("");
    callback && callback();
  }, []);

  const value = {
    loggedUser,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value} children={children} />;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
