import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/auth-layout";
import { Suspense, lazy, useEffect, useState } from "react";
import useAuthStore from "./store/use-auth-store";
import RequireAuth from "./components/require-auth";
import PageTransition from "./components/page-transition";
import HomeContainer from "./containers/home-container";
import { MdOutlineWifiOff } from "react-icons/md";
import TransformDebugPage from "./pages/debug/transform-debug-page";

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
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchProfile();
    }
  }, [renderKey]);

  useEffect(() => {
    const handleOffline = (_: Event) => {
      setIsOnline(false);
    };

    const handleOnline = (_: Event) => {
      setIsOnline(true);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  console.log("rendered");
  return (
    <div className="relative">
      <Suspense fallback={<PageTransition />}>
        {!isOnline && (
          <div className="w-full sticky z-50 top-0 p-2 text-center font-semibold bg-red-500 text-white">
            <MdOutlineWifiOff className="me-2 inline" />
            You are currently offline
          </div>
        )}
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
          <Route
            element={<RequireAuth allowedRoles={["Developer", "Player"]} />}
          >
            <Route path="/account/*" element={<UserProfileContainer />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Developer"]} />}>
            <Route path="/dev/*" element={<DeveloperDashboardContainer />} />
          </Route>
          <Route path="/debug" element={<TransformDebugPage />} />
          <Route path="/*" element={<HomeContainer />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
