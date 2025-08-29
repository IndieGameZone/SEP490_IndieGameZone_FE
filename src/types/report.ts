import { Game } from "./game";
import { GamePost, PostComment } from "./game-post";
import { ReportReason } from "./report-reason";
import { User } from "./user";

export interface ReportItem {
  id: string;
  user: User;
  reportType: string;
  reportReason: ReportReason;
  message: string;
  status:string; 
  reviewMessage: string;
  game: Game;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  reportingUser: User;
  postComment:PostComment;
  post:GamePost
  postTitle: string;
}

