import { Tabs, TabsProps } from "antd";
import { FaShoppingCart } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import EarningTransactionHistory from "./earning-transaction/transactions-history";
import PurchaseTransactionHistory from "./purchase-transaction.tsx/transactions-history";
import useAuthStore from "@/store/use-auth-store";

const TransactionHistoryTab = () => {
  const { profile } = useAuthStore();

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2">
          <FaShoppingCart size={20} />
          <span>Purchase Transactions</span>
        </div>
      ),
      children: <PurchaseTransactionHistory />,
    },
    ...(profile?.role?.name === "Developer"
      ? [
          {
            key: "2",
            label: (
              <div className="flex items-center gap-2">
                <MdAttachMoney size={20} />
                <span>Earning Transactions</span>
              </div>
            ),
            children: <EarningTransactionHistory />,
          },
        ]
      : []),
  ];

  return (
    <div className="px-5 bg-zinc-900 rounded mt-2 pb-5">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default TransactionHistoryTab;
