import useAuthStore from "@/store/use-auth-store";
import Loader from "./loader";
import { Navigate, Outlet } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import UnauthorizedPage from "@/pages/errors/unauthorized-page";

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
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: "#FF6600",
            borderRadius: 2,
          },
        }}
      >
        <Loader />
      </ConfigProvider>
    );
  if (!token) {
    return <Navigate to={returnUrl} replace />;
  }
  if (profile) {
    if (allowedRoles.includes(profile.role.name)) {
      return <Outlet />;
    } else {
      return (
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: "#FF6600",
              borderRadius: 2,
            },
          }}
        >
          {" "}
          <UnauthorizedPage />
        </ConfigProvider>
      );
    }
  }
};

export default RequireAuth;
