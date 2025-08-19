import { Avatar, Button, Drawer, Dropdown, theme } from "antd";
import React, { ReactNode, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import logo from "@/assets/indiegamezone-logo.svg";
import icon from "@/assets/igz_ic.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { MdCategory, MdSpaceDashboard } from "react-icons/md";
import { BiMoneyWithdraw, BiSolidUserAccount } from "react-icons/bi";
import { LiaLanguageSolid } from "react-icons/lia";
import {
  FaDoorOpen,
  FaMoneyBill,
  FaTags,
  FaTimes,
  FaWindows,
} from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { TbCancel } from "react-icons/tb";
import useProfileStore from "@/store/use-auth-store";
import { CgGames } from "react-icons/cg";
import styles from "@/styles/admin-layout.module.css";
import { GoReport } from "react-icons/go";
import { GrAchievement } from "react-icons/gr";
import AppTheme from "@/components/app-theme";
import DownloadProcessesButton from "@/components/navbar/download-processes-button";
import { RiAdvertisementLine } from "react-icons/ri";
import useIsMobile from "@/hooks/use-is-mobile";
import ViewNotificationsButton from "@/components/navbar/view-notifications-button";

const { Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const { darkAlgorithm } = theme;

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, profile } = useProfileStore();

  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const location = useLocation();
  const handleLogout = () => {
    navigate("/admin/log-in");
    logout();
  };

  const navigate = useNavigate();
  const menuItems: MenuProps["items"] = [
    {
      key: "5",
      label: "Log Out",
      icon: <FaDoorOpen />,
      danger: true,
      onClick: () => {
        handleLogout();
      },
    },
  ];

  const fullMenuItems: MenuProps["items"] = [
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
          onClick: () =>
            navigate("/admin/wallet"),
        },
        {
          key: "/admin/manage-system-transaction",
          label: "Manage Transactions",
          onClick: () =>
            navigate("/admin/manage-system-transaction"),
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

  const mobileMenuItems: MenuProps["items"] = [
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

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const darkToken = theme.getDesignToken({ algorithm: darkAlgorithm });

  return (
    <AppTheme theme="light">
      <Layout hasSider className={styles.lightTable}>
        {!isMobile ? (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={siderStyle}
            width={256}
          >
            <div className={`p-3 flex ${collapsed ? "justify-center" : ""}`}>
              {collapsed ? (
                <img src={icon} alt="indiegamezone logo" className="max-w-6" />
              ) : (
                <img src={logo} alt="indiegamezone logo" className="w-40" />
              )}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={fullMenuItems}
            />
          </Sider>
        ) : (
          <Drawer
            title={<img src={logo} alt="indiegamezone logo" className="w-32" />}
            placement="left"
            onClose={() => setDrawerOpen(false)}
            closeIcon={<FaTimes className="text-zinc-200" />}
            open={drawerOpen}
            styles={{
              body: { padding: 0, background: darkToken.colorBgContainer },
              header: { background: darkToken.colorBgContainer },
            }}
          >
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={mobileMenuItems}
            />
          </Drawer>
        )}
        <Layout>
          <div
            style={{
              background: colorBgContainer,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-center justify-between px-5 py-3">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                  if (isMobile) {
                    setDrawerOpen(true);
                  } else {
                    setCollapsed(!collapsed);
                  }
                }}
              />
              <div className="flex gap-3">
                <DownloadProcessesButton />
                <ViewNotificationsButton />
                <div>
                  <p className="font-semibold">{profile?.userName}</p>
                  <p className="text-xs text-zinc-500">{profile?.email}</p>
                </div>
                <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                  <Avatar icon={<CiUser />} className="cursor-pointer" />
                </Dropdown>
              </div>
            </div>
          </div>
          <div style={{ margin: "24px 16px 0" }}>{children}</div>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </AppTheme>
  );
};

export default AdminLayout;
