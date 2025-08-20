import SuspenseFallback from "@/components/suspense-fallback";
import AdminLayout from "@/layouts/admin-layout";
import AdminGameDetail from "@/pages/admin/game-details/admin-game-details";
import ManageCommercialPackage from "@/pages/admin/manage-commercial-package/manage-commercial-package";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DashBoardPage = lazy(() => import("@/pages/admin/dashboard/dashboard-page"));
const DetailUser = lazy(() => import("@/pages/admin/manage-accounts/detail-user"));
const ManageAccounts = lazy(() => import("@/pages/admin/manage-accounts/manage-accounts"));
const ManageAgeRestrictionPage = lazy(
  () => import("@/pages/admin/manage-age-restrictions/manage-age-restrictions-page")
);
const ManageGames = lazy(() => import("@/pages/admin/manage-games/manage-games"));
const ManagePlatforms = lazy(() => import("@/pages/admin/manage-platform/manage-platform"));
const ManageCategories = lazy(() => import("@/pages/admin/manage-categories/manage-categories"));
const ManageLanguages = lazy(() => import("@/pages/admin/manage-languages/manage-languages"));
const ManageTags = lazy(() => import("@/pages/admin/manage-tags/manage-tags"));
const AdminNotFoundPage = lazy(() => import("@/pages/errors/simple-not-found-page"));
const ManageReportReason = lazy(() => import("@/pages/admin/manage-report-reason/manage-report-reason"));
const ManageReport = lazy(() => import("@/pages/admin/manage-report/manage-system-report"));
const ManageAllTransaction = lazy(() => import("@/pages/admin/manage-all-transaction/manage-all-transaction"));
const ManageAdminWallet = lazy(() => import("@/pages/admin/admin-wallet/manage-admin-wallet"));
const AdminWithdrawalRequestsPage = lazy(
  () => import("@/pages/admin/manage-withdraw-request/manage-admin-withdraw-requests-page")
);
const ManageAchievement = lazy(() => import("@/pages/admin/manage-achievement/manage-achievement"));
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
          <Route path="/manage-report" element={<ManageReport />} />
          <Route path="/manage-system-transaction" element={<ManageAllTransaction />} />
          <Route path="/wallet" element={<ManageAdminWallet />} />
          <Route path="/manage-withdraw-requests" element={<AdminWithdrawalRequestsPage />} />
          <Route path="/manage-achievements" element={<ManageAchievement />} />
          <Route path="/manage-games" element={<ManageGames />} />
          <Route path="/manage-accounts" element={<ManageAccounts />} />
          <Route path="/manage-categories" element={<ManageCategories />} />
          <Route path="/manage-report-reason" element={<ManageReportReason />} />
          <Route path="/detail-user/:id" element={<DetailUser />} />
          <Route path="/game/:gameId" element={<AdminGameDetail />} />
          <Route path="/manage-age-restrictions" element={<ManageAgeRestrictionPage />} />
          <Route path="/manage-platforms" element={<ManagePlatforms />} />
          <Route path="/manage-commercial-package" element={<ManageCommercialPackage />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminContainer;
