import { User } from "./user";

export type Transaction = {
  id: string;
  orderCode: number;
  paymentMethod: string;
  donation?: number;
  gamePrice?: number;
  amount: number;
  initialBalance: number;
  finalBalance: number;
  description: string;
  status: "Success" | "Pending" | "Failed";
  type:
    | "Deposit"
    | "Withdraw"
    | "PurchaseGame"
    | "PurchaseCommercialPackage"
    | "Donation"
    | "RefundCommercialPackage"
    | "ReceiveCommercialRefundPackage"
    | "PurchaseGameRevenue"
    | "PurchaseCommercialPackageRevenue"
    | "DonationRevenue";
  createdAt: string;
  user: User;
  purchaseUser?: User;
};

export function getReadableTransactionType(type: Transaction["type"]): string {
  const typeMap: Record<Transaction["type"], string> = {
    Deposit: "Deposit",
    Withdraw: "Withdraw",
    RefundCommercialPackage: "Refund Commercial Package",
    ReceiveCommercialRefundPackage: "Receive Refund Commercial Package",
    PurchaseGame: "Purchase Game",
    PurchaseCommercialPackage: "Purchase Commercial Package",
    Donation: "Donation",
    PurchaseGameRevenue: "Game Sale Revenue",
    PurchaseCommercialPackageRevenue: "Commercial Package Revenue",
    DonationRevenue: "Donation Revenue",
  };

  return typeMap[type] || "Unknown";
}
