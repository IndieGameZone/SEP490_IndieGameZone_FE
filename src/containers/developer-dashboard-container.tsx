import DeveloperDashboardLayout from "@/layouts/developer-dashboard-layout";
import HomeLayout from "@/layouts/home-layout";
import DevDashBoardPage from "@/pages/developer/dev-dashboard-page";
import DevManageGamesPage from "@/pages/developer/dev-manage-games-page";
import DevUploadGamePage from "@/pages/developer/upload-game/dev-upload-game-page";
import { GamePreviewUploadPage } from "@/pages/developer/upload-game/game-preview-upload-page";
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
          <Route
            path="/upload-game/preview"
            element={<GamePreviewUploadPage />}
          />
          <Route path="/manage-games" element={<DevManageGamesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </DeveloperDashboardLayout>
    </HomeLayout>
  );
};

export default DeveloperDashboardContainer;
