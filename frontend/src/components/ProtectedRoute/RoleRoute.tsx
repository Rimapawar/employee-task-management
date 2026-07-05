import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../redux/store";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleRoute = ({ children, allowedRoles }: Props) => {
  const { role } = useSelector((state: RootState) => state.auth);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  // ❌ not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ⚠️ FIX: if role not ready, don't block forever
  if (!role) {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsed = JSON.parse(savedUser);

      if (allowedRoles.includes(parsed.role.toLowerCase())) {
        return children;
      }
    }

    return <div>Loading dashboard...</div>;
  }

  // normalize case fix
  if (!allowedRoles.includes(role.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;