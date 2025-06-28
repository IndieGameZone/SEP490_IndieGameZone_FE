export type Transaction = {
    id: string;
    type: "topup" | "purchase";
    amount: number;
    description: string;
    status: "completed" | "pending" | "failed";
    date: string;
    method: "bank_transfer" | "ewallet" | "points" | "credit_card";
}
