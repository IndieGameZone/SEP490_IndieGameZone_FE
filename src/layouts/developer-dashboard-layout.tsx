import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Menu, MenuProps } from "antd";
import { ReactNode } from "react";
import { FaChartLine, FaGamepad, FaTags } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";
import { TbCoin } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const DeveloperDashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const items: MenuItem[] = [
    {
      label: "Manage Games",
      key: "/dev/manage-games",
      icon: <FaGamepad />,
      onClick: () => {
        navigate("/dev/manage-games");
      },
    },
    {
      label: "Analytics",
      key: "/dev/dashboard",
      icon: <FaChartLine />,
      onClick: () => {
        navigate("/dev/dashboard");
      },
    },
    {
      label: "Earnings",
      key: "/dev/earnings",
      icon: <TbCoin />,
      onClick: () => {
        navigate("/dev/earnings");
      },
    },
    {
      label: "Promotions",
      key: "/dev/promotions",
      icon: <FaTags />,
      onClick: () => {
        navigate("/dev/promotions");
      },
    },
    {
      label: "Commercial Packages",
      key: "/dev/commercial-packages",
      icon: <LuPackage />,
      onClick: () => {
        navigate("/dev/commercial-packages");
      },
    },
  ];

  return (
    <MaxWidthWrapper className="py-5">
      <div className="bg-zinc-900/50 rounded border overflow-hidden border-zinc-800">
        <Menu
          mode="horizontal"
          items={items}
          selectedKeys={[location.pathname]}
        />
        <div>{children}</div>
      </div>
    </MaxWidthWrapper>
  );
};

export default DeveloperDashboardLayout;
