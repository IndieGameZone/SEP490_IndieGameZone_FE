import TransactionHistory from "./transactions-history/transactions-history";
import UserWallet from "./wallet/user-wallet";

const WalletAndTransactionsPage = () => {
  return (
    <div>
      <UserWallet />
      <TransactionHistory />
    </div>
  );
};

export default WalletAndTransactionsPage;
