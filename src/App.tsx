import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import useAuthStore from "./store/use-auth-store";
import RequireAuth from "./components/require-auth";
import PageTransition from "./components/page-transition";
import HomeContainer from "./containers/home-container";
import { MdOutlineWifiOff } from "react-icons/md";
import TransformDebugPage from "./pages/debug/transform-debug-page";
import AppTheme from "./components/app-theme";
import { ping } from "./lib/api/user-api";

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
  const { fetchProfile, renderKey, isLoggedIn } = useAuthStore();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchProfile();
    }
  }, [renderKey]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "accessToken") {
        if (event.newValue) {
          fetchProfile();
        } else {
          console.log("accessToken is gone");
          window.location.reload();
        }
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoggedIn) {
        ping();
      }
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

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
              <AppTheme>
                <LoginPage />
              </AppTheme>
            }
          />
          <Route
            path="sign-up"
            element={
              <AppTheme>
                <SignUpPage />
              </AppTheme>
            }
          />
          <Route
            path="/admin/log-in"
            element={
              <AppTheme>
                <AdminLoginPage />
              </AppTheme>
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
