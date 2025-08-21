import { MenuProps } from "antd";
import { BiSolidUserAccount } from "react-icons/bi";
import { CgGames } from "react-icons/cg";
import { FaDoorOpen } from "react-icons/fa";
import { GoReport } from "react-icons/go";

import { NavigateFunction } from "react-router-dom";

export const getModeratorMenuItems = (
  navigate: NavigateFunction,
  handleLogout: () => void
): MenuProps["items"] => {
  return [
    {
      key: "/moderator/manage-games",
      icon: <CgGames />,
      label: "Manage Games",
      onClick: () => navigate("/moderator/manage-games"),
    },
    {
      key: "/moderator/manage-accounts",
      icon: <BiSolidUserAccount />,
      label: "Manage Accounts",
      onClick: () => navigate("/moderator/manage-accounts"),
    },
    {
      key: "report-management",
      label: "Report management",
      icon: <GoReport />,
      children: [
        {
          key: "/moderator/manage-report",
          label: "Manage Reports",
          onClick: () => navigate("/moderator/manage-report"),
        },
        {
          key: "/moderator/manage-report-reason",
          label: "Manage Report Reasons",
          onClick: () => navigate("/moderator/manage-report-reason"),
        },
      ],
    },
    {
      key: "log-out",
      icon: <FaDoorOpen />,
      label: "Log out",
      onClick: () => handleLogout(),
      danger: true,
    },
  ];
};
