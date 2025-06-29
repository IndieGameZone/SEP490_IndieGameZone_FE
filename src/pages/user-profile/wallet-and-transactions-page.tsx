import { useEffect } from "react";
import TransactionHistory from "./transactions-history/transactions-history";
import UserWallet from "./wallet/user-wallet";
import Cookies from "js-cookie";
import { message } from "antd";

const WalletAndTransactionsPage = () => {
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
    <div>
      {contextHolder}
      <UserWallet />
      <TransactionHistory />
    </div>
  );
};

export default WalletAndTransactionsPage;
