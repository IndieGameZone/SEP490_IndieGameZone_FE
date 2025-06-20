import DeveloperDashboardLayout from "@/layouts/developer-dashboard-layout";
import HomeLayout from "@/layouts/home-layout";
import DevCommercialPackagePage from "@/pages/developer/commercial-packages/dev-commercial-package-page";
import DevDashBoardPage from "@/pages/developer/dev-dashboard-page";
import DevGameDetailsPage from "@/pages/developer/game-detail/dev-game-details-page";
import DevManageGamesPage from "@/pages/developer/manage-games/dev-manage-games-page";
import DevUploadGamePage from "@/pages/developer/upload-game/dev-upload-game-page";
import PreviewUploadPage from "@/pages/developer/upload-game/preview-upload-page";
import UploadProcessPage from "@/pages/developer/upload-game/upload-process-page";
import NotFoundPage from "@/pages/errors/simple-not-found-page";
import { Route, Routes } from "react-router-dom";

const DeveloperDashboardContainer = () => {
  return (
    <HomeLayout>
      <DeveloperDashboardLayout>
        <Routes>
          <Route path="/" element={<DevDashBoardPage />} />
          <Route path="/dashboard" element={<DevDashBoardPage />} />
          <Route path="/upload-game" element={<DevUploadGamePage />} />
          <Route path="/game/:gameId" element={<DevGameDetailsPage />} />
          <Route
            path="/commercial-packages"
            element={<DevCommercialPackagePage />}
          />
          <Route path="/upload-game/preview" element={<PreviewUploadPage />} />
          <Route path="/upload-game/upload" element={<UploadProcessPage />} />
          <Route path="/manage-games" element={<DevManageGamesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </DeveloperDashboardLayout>
    </HomeLayout>
  );
};

export default DeveloperDashboardContainer;
