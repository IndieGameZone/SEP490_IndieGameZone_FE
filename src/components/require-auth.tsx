import useAuthStore from "@/store/use-auth-store";
import Loader from "./loader";
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
  if (loading)
    return (
      <AppTheme theme="light">
        <Loader />
      </AppTheme>
    );

  if (!token) {
    return <Navigate to={returnUrl} replace />;
  }

  if (profile) {
    if (allowedRoles.includes(profile.role.name)) {
      return <Outlet />;
    } else {
      return (
        <AppTheme theme="light">
          <UnauthorizedPage />
        </AppTheme>
      );
    }
  }
};

export default RequireAuth;
