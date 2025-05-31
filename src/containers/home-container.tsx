import HomeLayout from "@/layouts/home-layout";
import NotFoundPage from "@/pages/errors/not-found-page";
import HomePage from "@/pages/home-page/home-page";
import { Route, Routes } from "react-router-dom";
import VerifyEmailPage from "@/pages/verify-email-page";
import SearchPage from "@/pages/search-page/search-page";
import ForumPage from "@/pages/forum-page/forum-page";

const HomeContainer = () => {
  return (
    <HomeLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/search/*" element={<SearchPage />} />
        <Route path="/forum/*" element={<ForumPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HomeLayout>
  );
};

export default HomeContainer;
