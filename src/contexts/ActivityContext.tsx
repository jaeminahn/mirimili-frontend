import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchMyActivity, MyActivity } from "../api/activity";

type ActivityContextValue = {
  myPostCount: number;
  myCommentCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [myPostCount, setMyPostCount] = useState(0);
  const [myCommentCount, setMyCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: MyActivity = await fetchMyActivity();
      setMyPostCount(data.myPostCount);
      setMyCommentCount(data.myCommentCount);
    } catch (e: any) {
      setError(e?.message || "활동 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => {
      refresh();
    };
    window.addEventListener("activity:post", handler as EventListener);
    window.addEventListener("activity:comment", handler as EventListener);
    return () => {
      window.removeEventListener("activity:post", handler as EventListener);
      window.removeEventListener("activity:comment", handler as EventListener);
    };
  }, [refresh]);

  const value: ActivityContextValue = {
    myPostCount,
    myCommentCount,
    loading,
    error,
    refresh,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) {
    throw new Error("useActivity must be used within ActivityProvider");
  }
  return ctx;
}
