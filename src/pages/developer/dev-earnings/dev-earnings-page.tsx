import { Tabs, TabsProps } from "antd";
import BankInformationPage from "./bank-information";
import { CiBank } from "react-icons/ci";
import { PiHandWithdraw } from "react-icons/pi";
import ManageWithdrawRequestsPage from "./withdraw-request/manage-withdraw-requests-page";

const DevEarningsPage = () => {
  const items: TabsProps["items"] = [
    {
      key: "Bank Information",
      label: (
        <div className="flex gap-2 items-center">
          <CiBank />
          Bank Information
        </div>
      ),
      children: <BankInformationPage />,
    },
    {
      key: "Withdrawal Requests",
      label: (
        <div className="flex gap-2 items-center">
          <PiHandWithdraw />
          Withdrawal Requests
        </div>
      ),
      children: <ManageWithdrawRequestsPage />,
    },
  ];
  return (
    <div className=" ">
      <Tabs
        defaultActiveKey="1"
        items={items}
        centered
        tabBarStyle={{ background: "#18181b", marginBottom: 0 }}
      />
    </div>
  );
};

export default DevEarningsPage;
