import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../redux/store";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // ✅ FIXED TOKEN LOGIC
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;