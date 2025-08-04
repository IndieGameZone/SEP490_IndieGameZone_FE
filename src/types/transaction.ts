import { User } from "./user";

export type Transaction = {
    id: string;
    orderCode: number;
    paymentMethod: string;
    donation?: number;
    gamePrice?: number;
    amount: number;
    description: string;
    status: "Success" | "Pending" | "Failed";
    type: "Deposit"
    | "Withdraw"
    | "PurchaseGame"
    | "PurchaseCommercialPackage"
    | "Donation"
    | "PurchaseGameRevenue"
    | "PurchaseCommercialPackageRevenue"
    | "DonationRevenue";
    createdAt: string;
    user:User
}

export function getReadableTransactionType(type: Transaction["type"]): string {
    const typeMap: Record<Transaction["type"], string> = {
        Deposit: "Deposit",
        Withdraw: "Withdraw",
        PurchaseGame: "Purchase Game",
        PurchaseCommercialPackage: "Purchase Commercial Package",
        Donation: "Donation",
        PurchaseGameRevenue: "Game Sale Revenue",
        PurchaseCommercialPackageRevenue: "Commercial Package Revenue",
        DonationRevenue: "Donation Revenue",
    };

    return typeMap[type] || "Unknown";
}