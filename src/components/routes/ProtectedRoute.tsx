import { ReactElement, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts";

const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}): ReactElement | null => {
  const { loggedUser } = useAuth();
  if (!loggedUser) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
