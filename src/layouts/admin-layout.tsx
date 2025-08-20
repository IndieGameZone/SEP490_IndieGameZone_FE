import { Avatar, Button, Drawer, Dropdown, theme } from "antd";
import React, { ReactNode, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import logo from "@/assets/indiegamezone-logo.svg";
import icon from "@/assets/igz_ic.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { FaDoorOpen, FaTimes } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import useProfileStore from "@/store/use-auth-store";
import styles from "@/styles/admin-layout.module.css";
import AppTheme from "@/components/app-theme";
import DownloadProcessesButton from "@/components/navbar/download-processes-button";
import useIsMobile from "@/hooks/use-is-mobile";
import ViewNotificationsButton from "@/components/navbar/view-notifications-button";
import useMenuItems from "./use-menu-items";

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
  const dropDownMenuItems: MenuProps["items"] = [
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

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = useMenuItems(
    profile,
    isMobile,
    navigate,
    handleLogout,
    setDrawerOpen
  );

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
              items={menuItems}
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
              items={menuItems}
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
                <Dropdown
                  menu={{ items: dropDownMenuItems }}
                  trigger={["click"]}
                >
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
