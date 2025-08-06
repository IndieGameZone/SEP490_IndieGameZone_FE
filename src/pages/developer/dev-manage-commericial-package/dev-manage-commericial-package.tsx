import { Tabs, TabsProps } from "antd";
import DevCommercialPackagePage from "./commercial-packages/dev-commercial-package-page";
import DevCommercialPackageRegistrations from "./manage-commercial-package-registrations/dev-commercial-package-registrations";
import { TbPackages } from "react-icons/tb";
import { MdAppRegistration } from "react-icons/md";

const DevManageCommercialPackage = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "Commercial Packages",
      label: (
        <div className="flex gap-2 items-center">
          <TbPackages />
          Commercial Packages
        </div>
      ),
      children: <DevCommercialPackagePage />,
    },
    {
      key: "Withdrawal Requests",
      label: (
        <div className="flex gap-2 items-center">
          <MdAppRegistration /> Commercial Package Registrations
        </div>
      ),
      children: <DevCommercialPackageRegistrations />,
    },
  ];
  return (
    <div className=" ">
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        centered
        tabBarStyle={{ background: "#18181b", marginBottom: 0 }}
      />
    </div>
  );
};

export default DevManageCommercialPackage;
