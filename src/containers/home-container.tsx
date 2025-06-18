import HomeLayout from "@/layouts/home-layout";
import NotFoundPage from "@/pages/errors/not-found-page";
import HomePage from "@/pages/home-page/home-page";
import { Route, Routes } from "react-router-dom";
import VerifyEmailPage from "@/pages/verify-email-page";
import SearchPage from "@/pages/search-page/search-page";
import ForumPage from "@/pages/forum-page/forum-page";
import ViewProfilePage from "@/pages/user-profile/view-profile-page";
import GameDetailsPage from "@/pages/game-details/game-details-page";

const HomeContainer = () => {
  return (
    <HomeLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/profile/:userId" element={<ViewProfilePage />} />
        <Route path="/search/*" element={<SearchPage />} />
        <Route path="/game/:gameId" element={<GameDetailsPage />} />
        <Route path="/forum/*" element={<ForumPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HomeLayout>
  );
};

export default HomeContainer;
