import { User } from "@/types/user";
import { getAdminFullMenuItems, getAdminMobileMenuItems } from "./admin-menu";
import { MenuProps } from "antd";
import { NavigateFunction } from "react-router-dom";

const useMenuItems = (
  profile: User | undefined,
  isMobile: boolean,
  navigate: NavigateFunction,
  handleLogout: () => void,
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
): MenuProps["items"] => {
  if (!profile) return [];

  switch (profile.role.name) {
    case "Admin":
      return isMobile
        ? getAdminMobileMenuItems(navigate, handleLogout, setDrawerOpen)
        : getAdminFullMenuItems(navigate, handleLogout);

    default:
      return [];
  }
};

export default useMenuItems;
