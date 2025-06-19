import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/log-in-page";
import SignUpPage from "./pages/sign-up-page";
import HomeContainer from "./containers/home-container";
import AdminContainer from "./containers/admin-container";
import AuthLayout from "./layouts/auth-layout";
import AdminLoginPage from "./pages/admin/admin-login-page";
import { useEffect } from "react";
import useAuthStore from "./store/use-auth-store";
import RequireAuth from "./components/require-auth";
import UserProfileContainer from "./containers/user-profile-container";
import DeveloperDashboardContainer from "./containers/developer-dashboard-container";

function App() {
  const { fetchProfile, renderKey } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchProfile();
    }
  }, [renderKey]);
  console.log("rendered");
  return (
    <Routes>
      <Route
        path="log-in"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="sign-up"
        element={
          <AuthLayout>
            <SignUpPage />
          </AuthLayout>
        }
      />
      <Route
        path="/admin/log-in"
        element={
          <AuthLayout>
            <AdminLoginPage />
          </AuthLayout>
        }
      />
      <Route
        element={
          <RequireAuth
            allowedRoles={["Admin", "Moderator"]}
            returnUrl="/admin/log-in"
          />
        }
      >
        <Route path="/admin/*" element={<AdminContainer />} />
      </Route>
      <Route element={<RequireAuth allowedRoles={["Developer", "Player"]} />}>
        <Route path="/account/*" element={<UserProfileContainer />} />
      </Route>
      <Route element={<RequireAuth allowedRoles={["Developer"]} />}>
        <Route path="/dev/*" element={<DeveloperDashboardContainer />} />
      </Route>
      <Route path="/*" element={<HomeContainer />} />
    </Routes>
  );
}

export default App;
