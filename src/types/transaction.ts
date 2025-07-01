export type Transaction = {
    id: string;
    orderCode: number;
    paymentMethod: string;
    amount: number;
    description: string;
    status: "Success" | "Pending" | "Failed";
    type:string;
    createdAt: string;
}
