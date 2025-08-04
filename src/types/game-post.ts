import { Tag } from "./tag";
import { User } from "./user";

export type GamePost = {
  id: string;
  title: string;
  content: string;
  postImages: {
    id: string;
    image: string;
  }[];
  postTags: { tag: Tag }[];
  numberOfComments: number;
  numberOfLikes: number;
  createdAt: string;
  user: User;
  liked?: boolean
};

export type PostComment = {
  id: string;
  createdAt: string;
  content: string;
  updatedAt?: string;
  user: User;
}