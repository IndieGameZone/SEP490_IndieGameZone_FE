import { useEffect } from "react";
import Cookies from "js-cookie";
import { message } from "antd";
import TransactionHistoryTab from "./transactions-history/transaction-history-tab";

const TransactionHistoryPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const transactionType = Cookies.get("pendingTransaction");
    if (transactionType) {
      const transactionResult = Cookies.get("transactionResult");
      if (transactionResult) {
        if (transactionResult == "CANCELLED") {
          messageApi.warning("Payment cancelled!");
        } else if (transactionResult == "PROCESSING") {
          messageApi.success("Payment successful!");
        }
        Cookies.remove("pendingTransaction");
        Cookies.remove("transactionResult");
      }
    }
  }, []);

  return (
    <div className="p-5">
      {contextHolder}
      <h2 className="text-xl font-semibold">Transaction History</h2>
      <p className="text-sm text-zinc-400">
        Track completed transactions, check payment statuses, and manage your
        spending history in one convenient place.
      </p>
      <TransactionHistoryTab />
    </div>
  );
};

export default TransactionHistoryPage;
