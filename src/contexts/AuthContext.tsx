import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import * as U from "../utils";
import { post } from "../api";

export type LoggedUser = {
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
      const user: LoggedUser = {
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
            setLoggedUser(user);
            U.writeObjectP("user", user).finally(() => callback && callback());
          }
        });
    },
    []
  );

  const login = useCallback(
    (tel: string, password: string, callback?: Callback) => {
      // const user: LoggedUser = {
      //   tel,
      //   nickname,
      //   serviceType,
      //   serviceStartDate,
      //   servicePfcDate,
      //   serviceCplDate,
      //   serviceSgtDate,
      //   serviceEndDate,
      //   serviceMos,
      //   serviceUnit,
      // };
      // setLoggedUser(user);
      // callback && callback();
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
