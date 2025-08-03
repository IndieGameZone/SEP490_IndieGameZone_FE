import PageTransition from "@/components/page-transition";
import DeveloperDashboardLayout from "@/layouts/developer-dashboard-layout";
import HomeLayout from "@/layouts/home-layout";
import CommericalPackageDetailsPage from "@/pages/developer/commerical-package-details/commercial-package-details-page";
import DevUpdateGamePage from "@/pages/developer/update-game/dev-update-game-page";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DevCommercialPackagePage = lazy(
  () => import("@/pages/developer/commercial-packages/dev-commercial-package-page")
);
const DevDashBoardPage = lazy(() => import("@/pages/developer/dev-dashboard-page"));
const DevGameDetailsPage = lazy(() => import("@/pages/developer/game-details/dev-game-details-page"));
const DevManageGamesPage = lazy(() => import("@/pages/developer/manage-games/dev-manage-games-page"));
const DevUploadGamePage = lazy(() => import("@/pages/developer/upload-game/dev-upload-game-page"));
const PreviewUploadPage = lazy(() => import("@/pages/developer/upload-game/preview-upload-page"));
const UploadProcessPage = lazy(() => import("@/pages/developer/upload-game/upload-process-page"));
const NotFoundPage = lazy(() => import("@/pages/errors/simple-not-found-page"));
const ManageReceivedReportPage = lazy(() => import("@/pages/developer/manage-received-report/manage-received-report"));
import DevPayoutInfo from "@/pages/developer/dev-payout-info/dev-payout-info";
const DeveloperDashboardContainer = () => {
  return (
    <HomeLayout>
      <DeveloperDashboardLayout>
        <Suspense fallback={<PageTransition />}>
          <Routes>
            <Route path="/" element={<DevDashBoardPage />} />
            <Route path="/dashboard" element={<DevDashBoardPage />} />
            <Route path="/upload-game" element={<DevUploadGamePage />} />
            <Route path="/game/:gameId" element={<DevGameDetailsPage />} />
            <Route path="/commercial-packages" element={<DevCommercialPackagePage />} />
            <Route path="/payout-information" element={<DevPayoutInfo />} />
            <Route path="/manage-received-report" element={<ManageReceivedReportPage />} />
            <Route path="/commercial-package/:packageId" element={<CommericalPackageDetailsPage />} />
            <Route path="/upload-game/preview" element={<PreviewUploadPage />} />
            <Route path="/upload-game/upload" element={<UploadProcessPage />} />
            <Route path="/manage-games" element={<DevManageGamesPage />} />
            <Route path="/update-game/:gameId" element={<DevUpdateGamePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </DeveloperDashboardLayout>
    </HomeLayout>
  );
};

export default DeveloperDashboardContainer;
