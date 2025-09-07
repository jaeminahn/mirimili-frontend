import { ReactElement, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts";

const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}): ReactElement | null => {
  const { loggedUser } = useAuth();
  const location = useLocation();

  if (!loggedUser) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
