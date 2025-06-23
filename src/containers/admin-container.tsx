import SuspenseFallback from "@/components/suspense-fallback";
import AdminLayout from "@/layouts/admin-layout";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DashBoardPage = lazy(() => import("@/pages/admin/dashboard-page"));
const DetailUser = lazy(
  () => import("@/pages/admin/manage-accounts/datail-user")
);
const ManageAccounts = lazy(
  () => import("@/pages/admin/manage-accounts/manage-accounts")
);
const ManageAgeRestrictionPage = lazy(
  () =>
    import("@/pages/admin/manage-age-restrictions/manage-age-restrictions-page")
);
const ManageGames = lazy(
  () => import("@/pages/admin/manage-games/manage-games")
);
const ManagePlatforms = lazy(
  () => import("@/pages/admin/manage-platform/manage-platform")
);
const ManageCategories = lazy(
  () => import("@/pages/admin/manage-categories/manage-categories")
);
const ManageLanguages = lazy(
  () => import("@/pages/admin/manage-languages/manage-languages")
);
const ManageTags = lazy(() => import("@/pages/admin/manage-tags/manage-tags"));
const AdminNotFoundPage = lazy(
  () => import("@/pages/errors/simple-not-found-page")
);

const AdminContainer = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<DashBoardPage />} />
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route path="*" element={<AdminNotFoundPage />} />
          <Route path="/manage-languages" element={<ManageLanguages />} />
          <Route path="/manage-tags" element={<ManageTags />} />
          <Route path="/manage-games" element={<ManageGames />} />
          <Route path="/manage-accounts" element={<ManageAccounts />} />
          <Route path="/manage-categories" element={<ManageCategories />} />
          <Route path="/detail-user/:id" element={<DetailUser />} />

          <Route
            path="/manage-age-restrictions"
            element={<ManageAgeRestrictionPage />}
          />
          <Route path="/manage-platforms" element={<ManagePlatforms />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminContainer;
