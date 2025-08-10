import { Tabs, TabsProps } from "antd";

import ManageAllTransaction from "./manage-all-transaction/manage-all-transaction";
import { GrTransaction } from "react-icons/gr";
import ManageAdminWallet from "./admin-wallet/manage-admin-wallet";
import { FaWallet } from "react-icons/fa";

const SystemTransactionAndWallet = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "Manage System Transactions",
      label: (
        <div className="flex gap-2 items-center">
          <GrTransaction />
          Manage System Transactions
        </div>
      ),
      children: <ManageAllTransaction />,
    },
    {
      key: "Admin Wallet",
      label: (
        <div className="flex gap-2 items-center">
          <FaWallet /> Admin Wallet
        </div>
      ),
      children: <ManageAdminWallet />,
    },
  ];
  return (
    <div className=" ">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} centered tabBarStyle={{ marginBottom: 0 }} />
    </div>
  );
};

export default SystemTransactionAndWallet;
