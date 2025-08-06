import { Menu, MenuProps, theme } from "antd";
import BankInformationPage from "./bank-information";
import { CiBank } from "react-icons/ci";
import DevWalletPage from "./dev-wallet-page";
import { useHashState } from "@/hooks/use-hash-state";
import { FaWallet } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import EarningTransactionsPage from "./earning-transactions-page";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "wallet",
    label: "Wallet",
    icon: <FaWallet />,
  },
  {
    key: "earning-transactions",
    label: "Earning Transactions",
    icon: <FaMoneyBillTrendUp />,
  },
  {
    key: "bank-information",
    label: "Bank Information",
    icon: <CiBank />,
  },
];
const { useToken } = theme;

const DevEarningsPage = () => {
  const [selectedKey, setSelectedKey] = useHashState("wallet");
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
          {selectedKey === "wallet" && <DevWalletPage />}
          {selectedKey === "earning-transactions" && (
            <EarningTransactionsPage />
          )}
          {selectedKey === "bank-information" && <BankInformationPage />}
        </div>
      </div>
    </div>
  );
};

export default DevEarningsPage;
