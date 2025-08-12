import { User } from "./user";

export type Withdraw = {
  id: string;
  requester: User;
  amount: User["balance"];
  status: string;
  createdAt: string;
  updatedAt: string;
  ImageProof?: string;
  handledAt: string;
  reason?: string;
};
