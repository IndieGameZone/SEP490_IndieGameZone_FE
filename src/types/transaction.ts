export type Transaction = {
    id: string;
    orderCode: number;
    paymentMethod: string;
    donation?: number;
    gamePrice?: number;
    amount: number;
    description: string;
    status: "Success" | "Pending" | "Failed";
    type:string;
    createdAt: string;
}
