import { Avatar, Button, Dropdown, theme } from "antd";
import React, { ReactNode, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import logo from "@/assets/indiegamezone-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { MdCategory, MdOutlineReport, MdSpaceDashboard } from "react-icons/md";
import { BiSolidUserAccount } from "react-icons/bi";
import { LiaLanguageSolid } from "react-icons/lia";
import { FaDoorOpen, FaTags, FaWindows } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { TbCancel } from "react-icons/tb";
import useProfileStore from "@/store/use-auth-store";
import { CgGames } from "react-icons/cg";
import styles from "@/styles/admin-layout.module.css";
import { GoReport } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";
import AppTheme from "@/components/app-theme";
import DownloadProcessesButton from "@/components/navbar/download-processes-button";
import { RiAdvertisementLine } from "react-icons/ri";

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

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, profile } = useProfileStore();
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

  const items: MenuProps["items"] = [
    {
      key: "/admin/dashboard",
      icon: <MdSpaceDashboard />,
      label: "Dashboard",
      onClick: () => {
        navigate("/admin/dashboard");
      },
    },
    {
      key: "/admin/manage-accounts",
      icon: <BiSolidUserAccount />,
      label: "Manage Accounts",
      onClick: () => {
        navigate("/admin/manage-accounts");
      },
    },
    {
      key: "/admin/manage-games",
      icon: <CgGames />,
      label: "Manage Games",
      onClick: () => {
        navigate("/admin/manage-games");
      },
    },
    {
      key: "/admin/manage-languages",
      icon: <LiaLanguageSolid />,
      label: "Manage Languages",
      onClick: () => {
        navigate("/admin/manage-languages");
      },
    },
    {
      key: "/admin/manage-tags",
      icon: <FaTags />,
      label: "Manage Tags",
      onClick: () => {
        navigate("/admin/manage-tags");
      },
    },

    {
      key: "/admin/manage-report",
      icon: <MdOutlineReport />,
      label: "Manage Reports",
      onClick: () => {
        navigate("/admin/manage-report");
      },
    },
    {
      key: "/admin/manage-categories",
      icon: <MdCategory />,
      label: "Manage Categories",
      onClick: () => {
        navigate("/admin/manage-categories");
      },
    },
    {
      key: "/admin/manage-report-reason",
      icon: <GoReport />,
      label: "Manage Report Reasons",
      onClick: () => {
        navigate("/admin/manage-report-reason");
      },
    },
    {
      key: "/admin/manage-transactions",
      icon: <GrTransaction />,
      label: "Manage Transactions",
      onClick: () => {
        navigate("/admin/manage-transactions");
      },
    },
    {
      key: "/admin/manage-commercial-package",
      icon: <RiAdvertisementLine />,
      label: "Manage Commercial Package",
      onClick: () => {
        navigate("/admin/manage-commercial-package");
      },
    },
    {
      key: "/admin/game/:gameId",
      icon: <CgGames />,
      label: "Game Details",
      onClick: () => {
        navigate("/admin/game/1"); // Example game ID, replace with actual logic
      },
    },
    {
      key: "/admin/manage-age-restrictions",
      icon: <TbCancel />,
      label: "Manage Age Restrictions",
      onClick: () => {
        navigate("/admin/manage-age-restrictions");
      },
    },
    {
      key: "/admin/manage-patforms",
      icon: <FaWindows />,
      label: "Manage Platforms",
      onClick: () => {
        navigate("/admin/manage-platforms");
      },
    },
    {
      key: "log-out",
      icon: <FaDoorOpen />,
      label: "Log out",
      onClick: () => {
        handleLogout();
      },
      danger: true,
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AppTheme theme="light">
      <Layout hasSider className={styles.lightTable}>
        <Sider trigger={null} collapsible collapsed={collapsed} style={siderStyle} width={256}>
          <div className="p-3 my-3">
            <img src={logo} alt="indiegamezone logo" className="w-40" />
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={items} />
        </Sider>
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
                onClick={() => setCollapsed(!collapsed)}
              />
              <div className="flex gap-3">
                <DownloadProcessesButton />
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
          <Footer style={{ textAlign: "center" }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </AppTheme>
  );
};

export default AdminLayout;
