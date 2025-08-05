import { Menu, MenuProps, theme } from "antd";
import BankInformationPage from "./bank-information";
import { CiBank } from "react-icons/ci";
import { PiHandWithdraw } from "react-icons/pi";
import ManageWithdrawRequestsPage from "./withdraw-request/manage-withdraw-requests-page";
import { useHashState } from "@/hooks/use-hash-state";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "withdrawal-requests",
    label: "Withdrawal Requests",
    icon: <PiHandWithdraw />,
  },
  {
    key: "bank-information",
    label: "Bank Information",
    icon: <CiBank />,
  },
];
const { useToken } = theme;

const DevEarningsPage = () => {
  const [selectedKey, setSelectedKey] = useHashState("withdrawal-requests");
  const { token } = useToken();

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
          {selectedKey === "withdrawal-requests" && (
            <ManageWithdrawRequestsPage />
          )}
          {selectedKey === "bank-information" && <BankInformationPage />}
        </div>
      </div>
    </div>
  );
};

export default DevEarningsPage;
