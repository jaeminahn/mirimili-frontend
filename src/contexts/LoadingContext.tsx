import {
  createContext,
  useContext,
  useState,
  useCallback,
  type FC,
  type PropsWithChildren,
} from "react";

type LoadingContextType = {
  loading: boolean;
  start: () => void;
  stop: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  start: () => {},
  stop: () => {},
});

export const LoadingProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const start = useCallback(() => setLoading(true), []);
  const stop = useCallback(() => setLoading(false), []);

  return (
    <LoadingContext.Provider value={{ loading, start, stop }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
