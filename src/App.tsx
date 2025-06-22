import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/auth-layout";
import { Suspense, lazy, useEffect } from "react";
import useAuthStore from "./store/use-auth-store";
import RequireAuth from "./components/require-auth";
import SuspenseFallback from "./components/suspense-fallback";

const HomeContainer = lazy(() => import("./containers/home-container"));
const LoginPage = lazy(() => import("./pages/log-in-page"));
const SignUpPage = lazy(() => import("./pages/sign-up-page"));
const AdminContainer = lazy(() => import("./containers/admin-container"));
const AdminLoginPage = lazy(() => import("./pages/admin/admin-login-page"));
const UserProfileContainer = lazy(
  () => import("./containers/user-profile-container")
);
const DeveloperDashboardContainer = lazy(
  () => import("./containers/developer-dashboard-container")
);

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
    <Suspense fallback={<SuspenseFallback />}>
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
    </Suspense>
  );
}

export default App;
