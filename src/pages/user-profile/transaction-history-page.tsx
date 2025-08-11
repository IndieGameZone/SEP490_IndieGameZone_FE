import { useEffect } from "react";
import Cookies from "js-cookie";
import { message } from "antd";
import PurchaseTransactionHistory from "./transactions-history/transactions-history";
import DevWallet from "@/components/wallet/dev-wallet";
import useAuthStore from "@/store/use-auth-store";

const TransactionHistoryPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { profile } = useAuthStore();
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
    <>
      {contextHolder}
      {profile?.role.name == "Developer" && <DevWallet />}
      <div className="p-5">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <p className="text-sm text-zinc-400 mb-5">
          Track completed transactions, check payment statuses, and manage your
          spending history in one convenient place.
        </p>
        <PurchaseTransactionHistory />
      </div>
    </>
  );
};

export default TransactionHistoryPage;
