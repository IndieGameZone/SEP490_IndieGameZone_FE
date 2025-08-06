import useProfileStore from "@/store/use-auth-store";
import { Avatar, Divider, Dropdown, MenuProps, theme } from "antd";
import React from "react";
import { CiUser } from "react-icons/ci";
import {
  FaDoorOpen,
  FaHistory,
  FaLightbulb,
  FaShoppingBasket,
  FaStar,
  FaUserAlt,
} from "react-icons/fa";
import { PiListHeartDuotone } from "react-icons/pi";
import { RiBookShelfLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const { useToken } = theme;
const ProfileMenu = () => {
  const { logout, profile } = useProfileStore();
  const { token } = useToken();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/log-in");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Profile",
      icon: <FaUserAlt />,
      onClick: () => navigate(`/profile/${profile?.id}`),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "My Library",
      icon: <RiBookShelfLine />,
      onClick: () => navigate("/account/library"),
    },
    {
      key: "3",
      label: "My wishlist",
      icon: <PiListHeartDuotone />,
      onClick: () => navigate("/account/wishlist"),
    },
    {
      key: "4",
      label: "Ratings & Reviews",
      icon: <FaStar />,
      onClick: () => navigate("/account/ratings-and-reviews"),
    },
    {
      key: "orders",
      label: "Your Orders",
      icon: <FaShoppingBasket />,
      onClick: () => navigate("/account/orders"),
    },
    {
      key: "transaction-history",
      label: "Transaction History",
      icon: <FaHistory />,
      onClick: () => navigate("/account/transaction-history"),
    },
    {
      key: "5",
      label: "Recommendations ",
      icon: <FaLightbulb />,
      onClick: () => navigate("/account/recommendations"),
    },
    {
      type: "divider",
    },
    {
      key: "6",
      label: "Log Out",
      icon: <FaDoorOpen />,
      danger: true,
      onClick: () => {
        handleLogout();
      },
    },
  ];

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      popupRender={(menu: any) => (
        <div style={contentStyle}>
          <div className="font-semibold p-3">
            <p className="text-lg">{profile?.userName}</p>
            <p className="text-sm text-zinc-500">{profile?.email}</p>
          </div>

          <Divider style={{ margin: 0 }} />
          {React.cloneElement(
            menu as React.ReactElement<{
              style: React.CSSProperties;
            }>
          )}
        </div>
      )}
    >
      {profile?.avatar ? (
        <Avatar src={profile.avatar} className="cursor-pointer" />
      ) : (
        <Avatar icon={<CiUser />} className="cursor-pointer" />
      )}
    </Dropdown>
  );
};

export default ProfileMenu;
