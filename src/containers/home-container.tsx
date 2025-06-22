import HomeLayout from "@/layouts/home-layout";
import HomePage from "@/pages/home-page/home-page";
import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import SuspenseFallback from "@/components/suspense-fallback";

const NotFoundPage = lazy(() => import("@/pages/errors/not-found-page"));
const VerifyEmailPage = lazy(() => import("@/pages/verify-email-page"));
const SearchPage = lazy(() => import("@/pages/search-page/search-page"));
const ForumPage = lazy(() => import("@/pages/forum-page/forum-page"));
const ViewProfilePage = lazy(
  () => import("@/pages/user-profile/view-profile-page")
);
const GameDetailsPage = lazy(
  () => import("@/pages/game-details/game-details-page")
);

const HomeContainer = () => {
  return (
    <HomeLayout>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/profile/:userId" element={<ViewProfilePage />} />
          <Route path="/search/*" element={<SearchPage />} />
          <Route path="/game/:gameId" element={<GameDetailsPage />} />
          <Route path="/forum/*" element={<ForumPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </HomeLayout>
  );
};

export default HomeContainer;
