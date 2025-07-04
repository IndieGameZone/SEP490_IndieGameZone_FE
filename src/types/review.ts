import { User } from "./user";

export type Review = {
  id: string;
  user: User | null;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
  dislikes: number;
};
