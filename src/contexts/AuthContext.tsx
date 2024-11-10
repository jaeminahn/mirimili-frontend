import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import * as U from "../utils";

export type LoggedUser = { phone: string; password: string; nickname?: string }; // nickname을 선택적 속성으로 변경
type Callback = () => void;

type ContextType = {
  loggedUser?: LoggedUser;
  signup: (phone: string, password: string, nickname: string, callback?: Callback) => void;
  login: (phone: string, password: string, callback?: Callback) => void;
  logout: (callback?: Callback) => void;
};

export const AuthContext = createContext<ContextType>({
  signup: (phone: string, password: string, nickname: string, callback?: Callback) => {},
  login: (phone: string, password: string, callback?: Callback) => {},
  logout: (callback?: Callback) => {},
});

type AuthProviderProps = {};

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({
  children,
}) => {
  const [loggedUser, setLoggedUser] = useState<LoggedUser | undefined>(
    undefined
  );

  const signup = useCallback(
    (phone: string, password: string, nickname: string, callback?: Callback) => {
      const user = { phone, password, nickname };
      setLoggedUser(user);
      U.writeObjectP("user", user).finally(() => callback && callback());
    },
    []
  );

  const login = useCallback(
    (phone: string, password: string, callback?: Callback) => {
      const user = { phone, password }; // nickname을 포함하지 않음
      setLoggedUser(user);
      callback && callback();
    },
    []
  );

  const logout = useCallback((callback?: Callback) => {
    setLoggedUser(undefined);
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
