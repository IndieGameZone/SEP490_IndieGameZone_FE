import EarningTransactionHistory from "./earning-transaction/transactions-history";

const EarningTransactionsPage = () => {
  return (
    <div className="bg-zinc-900 p-4">
      <h2 className="text-xl font-semibold">Earning Transactions</h2>
      <p className="text-sm text-zinc-400 mb-5">
        View detailed transaction history and see how your games are performing!
      </p>
      <EarningTransactionHistory />
    </div>
  );
};

export default EarningTransactionsPage;
