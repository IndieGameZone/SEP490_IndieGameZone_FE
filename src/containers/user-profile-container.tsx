import SuspenseFallback from "@/components/suspense-fallback";
import HomeLayout from "@/layouts/home-layout";
import UserProfileLayout from "@/layouts/user-profile-layout";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const UserProfilePage = lazy(() => import("@/pages/user-profile/user-profile-page"));
const WalletAndTransactionsPage = lazy(() => import("@/pages/user-profile/wallet-and-transactions-page"));
const UserWishlistPage = lazy(() => import("@/pages/user-profile/wish-list/view-user-wishlist"));
const UserLibraryPage = lazy(() => import("@/pages/user-profile/library-games/view-user-library-game"));
const GameRecommendationsPage = lazy(() => import("@/pages/user-profile/game-recommendations-page"));
const UserOrdersPage = lazy(() => import("@/pages/user-profile/orders/user-orders-page"));
const UserManageReportPage = lazy(() => import("@/pages/user-profile/manage-report/manage-report-page"));
const BankInformationPage = lazy(() => import("@/pages/user-profile/bank-information"));
const UserProfileContainer = () => {
  return (
    <HomeLayout>
      <UserProfileLayout>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/wallet-and-transactions" element={<WalletAndTransactionsPage />} />
            <Route path="/wishlist" element={<UserWishlistPage />} />
            <Route path="/bank-information" element={<BankInformationPage />} />
            <Route path="/library" element={<UserLibraryPage />} />
            <Route path="/recommendations" element={<GameRecommendationsPage />} />
            <Route path="/manage-reports" element={<UserManageReportPage />} />
            <Route path="/orders" element={<UserOrdersPage />} />
          </Routes>
        </Suspense>
      </UserProfileLayout>
    </HomeLayout>
  );
};

export default UserProfileContainer;
