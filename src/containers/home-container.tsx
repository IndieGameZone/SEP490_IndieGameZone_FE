import HomeLayout from "@/layouts/home-layout";
import HomePage from "@/pages/home-page/home-page";
import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import PageTransition from "@/components/page-transition";
import DownloadGamePage from "@/pages/download-game/download-game-page";
import SearchPage from "@/pages/search-page/search-page";
import AboutUsPage from "@/pages/about-us/about-us-page";
const NotFoundPage = lazy(() => import("@/pages/errors/not-found-page"));
const VerifyEmailPage = lazy(() => import("@/pages/verify-email-page"));
const ForumPage = lazy(() => import("@/pages/forum-page/forum-page"));
const ViewProfilePage = lazy(
  () => import("@/pages/user-profile/view-profile-page")
);
const GameDetailsPage = lazy(
  () => import("@/pages/game-details/game-details-page")
);
const PolicyPage = lazy(() => import("@/pages/policy"));
const SendMailOtpPage = lazy(() => import("@/pages/user-profile/forgot-password/send-mail-otp-page"));
const ResetPasswordPage = lazy(() => import("@/pages/user-profile/forgot-password/reset-password-page"));
const HomeContainer = () => {
  return (
    <HomeLayout>
      <Suspense fallback={<PageTransition />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/forgot-password/send-mail-otp" element={<SendMailOtpPage />} />
          <Route path="/forgot-password/reset-password" element={<ResetPasswordPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/profile/:userId" element={<ViewProfilePage />} />
          <Route path="/search/*" element={<SearchPage />} />
          <Route path="/game/:gameId" element={<GameDetailsPage />} />
          <Route path="/download/:gameId" element={<DownloadGamePage />} />
          <Route path="/forum/*" element={<ForumPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </HomeLayout>
  );
};

export default HomeContainer;
