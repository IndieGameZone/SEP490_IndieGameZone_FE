import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import { Menu, MenuProps } from "antd";
import { ReactNode } from "react";
import { FaChartLine, FaGamepad } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { HiMiniBanknotes } from "react-icons/hi2";
import { TbMessageReport } from "react-icons/tb";

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
      icon: <HiMiniBanknotes />,
      onClick: () => {
        navigate("/dev/earnings");
      },
    },

    {
      label: "Manage Received Report",
      key: "/dev/manage-received-report",
      icon: <TbMessageReport />,
      onClick: () => {
        navigate("/dev/manage-received-report");
      },
    },
    {
      label: "Commercial Packages",
      key: "/dev/manage-commercial-package",
      icon: <LuPackage />,
      onClick: () => {
        navigate("/dev/manage-commercial-package");
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
