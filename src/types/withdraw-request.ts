import { User } from "./user";

export type Withdraw = {
  id: string;
  requester: User;
  amount: User["balance"];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  handledAt: string;
  reason?: string;
};
