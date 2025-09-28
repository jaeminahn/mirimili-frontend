import { ReactElement, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../../api/tokenStore";

const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}): ReactElement | null => {
  const token = getAccessToken();
  const isAuthed = !!token;

  if (!isAuthed) {
    return <Navigate to="/auth/login" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
