import ScrollToTop from "@/components/scroll-to-top";
import { Menu, MenuProps, theme } from "antd";
import { ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];
const { useToken } = theme;

interface ApiDocumentLayout {
  children?: ReactNode;
}

const ApiDocumentLayout = ({ children }: ApiDocumentLayout) => {
  const { token } = useToken();
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      key: "game-licenses",
      label: "Game Licenses",
      type: "group",
      children: [
        {
          key: "activation-keys-overview",
          label: "Overview",
          onClick: () => navigate("/docs/api/overview"),
        },
        {
          key: "activate-license",
          label: (
            <div className="flex gap-2 items-center">
              <span className="bg-amber-500 px-2 py-0.5 text-xs text-white rounded">
                PUT
              </span>
              <span>Activate Game License</span>
            </div>
          ),
          onClick: () => navigate("/docs/api/activate-license"),
        },
        {
          key: "license-status",
          label: (
            <div className="flex gap-2 items-center">
              <span className="bg-green-500 px-2 py-0.5 text-xs text-white rounded">
                GET
              </span>
              <span>Check License Status</span>
            </div>
          ),
          onClick: () => navigate("/docs/api/license-status"),
        },
        {
          key: "integration-guide",
          label: "Integration Guide",
          onClick: () => navigate("/docs/api/integration-guide"),
        },
      ],
    },
  ];

  const selectedKey = useMemo(() => {
    if (location.pathname.includes("/overview"))
      return "activation-keys-overview";
    if (location.pathname.includes("/integration-guide"))
      return "integration-guide";
    if (location.pathname.includes("/activate-license"))
      return "activate-license";
    return "";
  }, [location.pathname]);

  return (
    <div className="grid grid-cols-12">
      <ScrollToTop />
      <div
        className="col-span-3 border-e border-zinc-700"
        style={{ background: token.colorBgContainer }}
      >
        <Menu
          mode="inline"
          items={items}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={["game-licenses"]}
          style={{
            position: "sticky",
            top: 70,
          }}
        />
      </div>
      <div className="col-span-9 min-h-screen bg-zinc-900 p-5">{children}</div>
    </div>
  );
};

export default ApiDocumentLayout;
