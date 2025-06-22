import SuspenseFallback from "@/components/suspense-fallback";
import HomeLayout from "@/layouts/home-layout";
import UserProfileLayout from "@/layouts/user-profile-layout";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const UserProfilePage = lazy(
  () => import("@/pages/user-profile/user-profile-page")
);

const UserProfileContainer = () => {
  return (
    <HomeLayout>
      <UserProfileLayout>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </Suspense>
      </UserProfileLayout>
    </HomeLayout>
  );
};

export default UserProfileContainer;
