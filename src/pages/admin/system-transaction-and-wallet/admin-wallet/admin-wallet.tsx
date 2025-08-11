import { FaRegQuestionCircle, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import CoinIcon from "@/components/coin-icon";
import { useEffect } from "react";
import useAuthStore from "@/store/use-auth-store";
import useDocumentTheme from "@/hooks/use-document-theme";

const AdminWallet = () => {
  const { profile, fetchProfile, loading, error } = useAuthStore();
  const theme = useDocumentTheme();
  const isDarkTheme = theme == "dark";

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [fetchProfile, profile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No user data available</div>;
  }

  return (
    <div
      className={`py-4 px-5 border ${
        isDarkTheme
          ? "bg-orange-900 border-orange-500"
          : "bg-orange-100 border-orange-400"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className={`bg-opacity-20 p-5 rounded-full border  ${
              isDarkTheme
                ? "bg-zinc-800 border-zinc-500"
                : "bg-white text-orange-500 border-orange-500"
            }`}
          >
            <FaWallet className="text-3xl" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm">Current Balance</h2>
              <Link to="/policy/igz-points">
                <FaRegQuestionCircle />
              </Link>
            </div>
            <p className="text-3xl flex items-center gap-2">
              {profile.balance.toLocaleString("vi-VN")}
              <CoinIcon size="size-7" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWallet;
