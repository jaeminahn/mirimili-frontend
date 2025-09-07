import { ReactElement, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts";
import { getAccessToken } from "../../api/tokenStore";

const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}): ReactElement | null => {
  const { loggedUser } = useAuth();
  const location = useLocation();
  const token = getAccessToken();
  const isAuthed = !!loggedUser || !!token;

  if (!isAuthed) {
    return <Navigate to="/auth/login" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
