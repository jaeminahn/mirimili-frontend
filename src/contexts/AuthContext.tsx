import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import * as U from "../utils";
import { post } from "../api";

export type LoggedUser = {
  id: number;
  tel: string;
  nickname: string;
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
  login: (tel: string, password: string, callback?: Callback) => void;
  logout: (callback?: Callback) => void;
};

export const AuthContext = createContext<ContextType>({
  signup: (
    tel: string,
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
    (
      tel: string,
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
      post("/auth/join", {
        tel,
        password,
        nickname,
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
          console.log(result);
          if (result.message === "join success") {
            const user: LoggedUser = {
              id: result.user.id,
              tel,
              nickname,
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
            U.writeObjectP("user", user).finally(() => callback && callback());
          }
        });
    },
    []
  );

  const login = useCallback(
    (tel: string, password: string, callback?: Callback) => {
      post("/auth/login", { tel, password })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.message == "Login Success") {
            const user: LoggedUser = {
              id: result.user.id,
              tel,
              nickname: result.user.nickname,
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
            U.writeObjectP("accessToken", result.accessToken);
            U.writeObjectP("refreshToken", result.refreshToken);
            U.writeObjectP("user", user).finally(() => callback && callback());
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
