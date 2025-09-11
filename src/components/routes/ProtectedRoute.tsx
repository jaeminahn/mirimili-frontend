import { ReactElement, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../../api/tokenStore";

const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}): ReactElement | null => {
  const location = useLocation();
  const token = getAccessToken();
  const isAuthed = !!token;

  if (!isAuthed) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
