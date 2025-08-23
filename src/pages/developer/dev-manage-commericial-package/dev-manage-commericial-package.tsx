import { Menu, MenuProps, theme } from "antd";
import DevCommercialPackagePage from "./commercial-packages/dev-commercial-package-page";
import DevCommercialPackageRegistrations from "./manage-commercial-package-registrations/dev-commercial-package-registrations";
import { MdAppRegistration } from "react-icons/md";
import { useHashState } from "@/hooks/use-hash-state";
import { LuPackage } from "react-icons/lu";

type MenuItem = Required<MenuProps>["items"][number];
const { useToken } = theme;

const DevManageCommercialPackage = () => {
  const [selectedKey, setSelectedKey] = useHashState("commercial-packages");
  const { token } = useToken();

  const items: MenuItem[] = [
    {
      key: "commercial-packages",
      label: "Commercial Packages",
      icon: <LuPackage />,
    },
    {
      key: "registrations",
      label: "Registrations",

      icon: <MdAppRegistration />,
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-12">
        <div
          className="col-span-3 pb-50 border-r border-r-zinc-700"
          style={{ background: token.colorBgContainer }}
        >
          <Menu
            defaultSelectedKeys={[selectedKey]}
            mode="inline"
            items={items}
            onClick={(e) => setSelectedKey(e.key)}
          />
        </div>
        <div className="col-span-9">
          {selectedKey === "commercial-packages" && (
            <DevCommercialPackagePage />
          )}
          {selectedKey === "registrations" && (
            <DevCommercialPackageRegistrations />
          )}
        </div>
      </div>
    </div>
  );
};

export default DevManageCommercialPackage;
