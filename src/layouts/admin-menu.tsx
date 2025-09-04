import { MenuProps } from "antd";
import { Dispatch } from "react";
import { BiMoneyWithdraw, BiSolidUserAccount } from "react-icons/bi";
import { BsPostcardHeartFill } from "react-icons/bs";
import { CgGames } from "react-icons/cg";
import { FaDoorOpen, FaMoneyBill, FaTags, FaWindows } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { GrAchievement } from "react-icons/gr";
import { LiaLanguageSolid } from "react-icons/lia";
import { MdCategory, MdSpaceDashboard } from "react-icons/md";
import { RiAdvertisementLine } from "react-icons/ri";
import { TbCancel, TbPackages } from "react-icons/tb";
import { NavigateFunction } from "react-router-dom";

export const getAdminFullMenuItems = (navigate: NavigateFunction, handleLogout: () => void): MenuProps["items"] => {
  return [
    {
      key: "dashboard",
      icon: <MdSpaceDashboard />,
      label: "Dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "/admin/manage-accounts",
      icon: <BiSolidUserAccount />,
      label: "Manage Accounts",
      onClick: () => navigate("/admin/manage-accounts"),
    },
      {
      key: "/admin/manage-posts",
      icon: <BsPostcardHeartFill />,
      label: "Manage Posts",
      onClick: () => navigate("/admin/manage-posts"),
    },
    {
      key: "/admin/manage-all-commercial-packages",
      icon: <TbPackages />,
      label: "Manage All Commercial Packages",
      onClick: () => navigate("/admin/manage-all-commercial-packages"),
    },
    {
      key: "report-management",
      label: "Report management",
      icon: <GoReport />,
      children: [
        {
          key: "/admin/manage-report",
          label: "Manage Reports",
          onClick: () => navigate("/admin/manage-report"),
        },
        {
          key: "/admin/manage-report-reason",
          label: "Manage Report Reasons",
          onClick: () => navigate("/admin/manage-report-reason"),
        },
      ],
    },
    {
      key: "game-management",
      label: "Game Management",
      icon: <CgGames />,
      children: [
        {
          key: "/admin/manage-games",
          icon: <CgGames />,
          label: "Manage Games",
          onClick: () => navigate("/admin/manage-games"),
        },
        {
          key: "/admin/manage-tags",
          icon: <FaTags />,
          label: "Manage Tags",
          onClick: () => navigate("/admin/manage-tags"),
        },
        {
          key: "/admin/manage-categories",
          icon: <MdCategory />,
          label: "Manage Categories",
          onClick: () => navigate("/admin/manage-categories"),
        },
        {
          key: "/admin/manage-achievements",
          icon: <GrAchievement />,
          label: "Manage Achievements",
          onClick: () => navigate("/admin/manage-achievements"),
        },
        {
          key: "/admin/manage-age-restrictions",
          icon: <TbCancel />,
          label: "Manage Age Restrictions",
          onClick: () => navigate("/admin/manage-age-restrictions"),
        },
        {
          key: "/admin/manage-platforms",
          icon: <FaWindows />,
          label: "Manage Platforms",
          onClick: () => navigate("/admin/manage-platforms"),
        },
        {
          key: "/admin/manage-languages",
          icon: <LiaLanguageSolid />,
          label: "Manage Languages",
          onClick: () => navigate("/admin/manage-languages"),
        },
      ],
    },
    {
      key: "finance-management",
      label: "Finance Management",
      icon: <FaMoneyBill />,
      children: [
        {
          key: "/admin/wallet",
          label: "Admin Wallet",
          onClick: () => navigate("/admin/wallet"),
        },
        {
          key: "/admin/manage-orders",
          label: "Manage Orders",
          onClick: () => navigate("/admin/manage-orders"),
        },
        {
          key: "/admin/manage-system-transaction",
          label: "Manage Transactions",
          onClick: () => navigate("/admin/manage-system-transaction"),
        },
        {
          key: "/admin/manage-withdraw-requests",
          label: "Manage Withdraw Requests",
          onClick: () => navigate("/admin/manage-withdraw-requests"),
        },
      ],
    },
    {
      key: "/admin/manage-commercial-package",
      icon: <RiAdvertisementLine />,
      label: "Commercial Packages",
      onClick: () => navigate("/admin/manage-commercial-package"),
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

export const getAdminMobileMenuItems = (
  navigate: NavigateFunction,
  handleLogout: () => void,
  setDrawerOpen: Dispatch<React.SetStateAction<boolean>>
): MenuProps["items"] => {
  return [
    {
      key: "/admin/manage-withdraw-requests",
      icon: <BiMoneyWithdraw />,
      label: "Manage Withdraw Requests",
      onClick: () => {
        navigate("/admin/manage-withdraw-requests");
        setDrawerOpen(false);
      },
    },
    {
      key: "log-out",
      icon: <FaDoorOpen />,
      label: "Log out",
      onClick: () => {
        handleLogout();
        setDrawerOpen(false);
      },
      danger: true,
    },
  ];
};
