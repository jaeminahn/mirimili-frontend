import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import * as U from "../utils";
import { post } from "../api";

export type LoggedUser = {
  phone: string;
  password: string;
  nickname: string;
  serviceType: number;
};

type Callback = () => void;

type ContextType = {
  loggedUser?: LoggedUser;
  signup: (
    phone: string,
    password: string,
    nickname: string,
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
  login: (phone: string, password: string, callback?: Callback) => void;
  logout: (callback?: Callback) => void;
};

export const AuthContext = createContext<ContextType>({
  signup: (
    phone: string,
    password: string,
    nickname: string,
    serviceType: number,
    serviceStartDate: Date,
    servicePfcDate: Date,
    serviceCplDate: Date,
    serviceSgtDate: Date,
    serviceEndDate: Date,
    serviceMos: number,
    serviceUnit: number,
    callback?: Callback
  ) => {},
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
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const signup = useCallback(
    (
      phone: string,
      password: string,
      nickname: string,
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
      const user: LoggedUser = {
        phone,
        password,
        nickname,
        serviceType,
      };
      setLoggedUser(user);
      U.writeObjectP("user", user).finally(() => callback && callback());
    },
    []
  );

  const login = useCallback(
    (phone: string, password: string, callback?: Callback) => {
      const user: LoggedUser = {
        phone,
        password,
        nickname: "",
        serviceType: 0,
      };
      setLoggedUser(user);
      callback && callback();
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
