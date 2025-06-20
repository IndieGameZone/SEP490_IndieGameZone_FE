import AdminLayout from "@/layouts/admin-layout";
import DashBoardPage from "@/pages/admin/dashboard-page";
import DetailUser from "@/pages/admin/manage-accounts/datail-user";
import ManageAccounts from "@/pages/admin/manage-accounts/manage-accounts";
import ManageAgeRestrictionPage from "@/pages/admin/manage-age-restrictions/manage-age-restrictions-page";
import ManageCategories from "@/pages/admin/manage-categories/manage-categories";
import ManageGames from "@/pages/admin/manage-games/manage-games";
import ManageLanguages from "@/pages/admin/manage-languages/manage-languages";
import ManagePlatform from "@/pages/admin/manage-games/manage-platform/manage-platform";
import ManageTags from "@/pages/admin/manage-tags/manage-tags";
import AdminNotFoundPage from "@/pages/errors/simple-not-found-page";
import { Route, Routes } from "react-router-dom";

const AdminContainer = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashBoardPage />} />
        <Route path="/dashboard" element={<DashBoardPage />} />
        <Route path="*" element={<AdminNotFoundPage />} />
        <Route path="/manage-languages" element={<ManageLanguages />} />
        <Route path="/manage-tags" element={<ManageTags />} />
        <Route path="/manage-games" element={<ManageGames />} />
        <Route path="/manage-accounts" element={<ManageAccounts />} />
        <Route path="/manage-categories" element={<ManageCategories />} />
        <Route path="/detail-user/:id" element={<DetailUser />} />

        <Route
          path="/manage-age-restrictions"
          element={<ManageAgeRestrictionPage />}
        />
        <Route path="/manage-platforms" element={<ManagePlatform />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminContainer;
