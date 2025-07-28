import useAuthStore from "@/store/use-auth-store";
import { Navigate, Outlet } from "react-router-dom";
import UnauthorizedPage from "@/pages/errors/unauthorized-page";
import AppTheme from "./app-theme";

const RequireAuth = ({
  allowedRoles = [],
  returnUrl = "/log-in",
}: {
  allowedRoles: string[];
  returnUrl?: string;
}) => {
  const { loading, profile } = useAuthStore();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to={returnUrl} replace />;
  }

  if (profile && allowedRoles.includes(profile.role.name) || loading) {
    return <Outlet />;
  } else {
    return (
      <AppTheme theme="light">
        <UnauthorizedPage />
      </AppTheme>
    );
  }
};

export default RequireAuth;
