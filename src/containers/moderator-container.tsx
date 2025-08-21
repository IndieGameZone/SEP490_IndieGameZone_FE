import SuspenseFallback from "@/components/suspense-fallback";
import AdminLayout from "@/layouts/admin-layout";
import AdminGameDetail from "@/pages/admin/game-details/admin-game-details";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DetailUser = lazy(() => import("@/pages/admin/manage-accounts/detail-user"));
const ManageAccounts = lazy(() => import("@/pages/admin/manage-accounts/manage-accounts"));
const ManageGames = lazy(() => import("@/pages/admin/manage-games/manage-games"));
const AdminNotFoundPage = lazy(() => import("@/pages/errors/simple-not-found-page"));
const ManageReportReason = lazy(() => import("@/pages/admin/manage-report-reason/manage-report-reason"));
const ManageReport = lazy(() => import("@/pages/admin/manage-report/manage-system-report"));

const ModeratorContainer = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<ManageGames />} />
          <Route path="*" element={<AdminNotFoundPage />} />
          <Route path="/manage-report" element={<ManageReport />} />
          <Route path="/manage-games" element={<ManageGames />} />
          <Route path="/manage-accounts" element={<ManageAccounts />} />
          <Route path="/manage-report-reason" element={<ManageReportReason />} />
          <Route path="/detail-user/:id" element={<DetailUser />} />
          <Route path="/game/:gameId" element={<AdminGameDetail />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default ModeratorContainer;
