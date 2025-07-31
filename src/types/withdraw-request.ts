import { User } from "./user";

export type Withdraw={
    id: string;
    developer: User;
    amount: User["balance"];
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
    reason?: string; 
}