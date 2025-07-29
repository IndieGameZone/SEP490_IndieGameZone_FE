import { Game } from "./game";
import { ReportReason } from "./report-reason";
import { User } from "./user";

export interface ReportItem {
  id: string;
  user: User;
  reportType: "comment" | "post" | "game";
  reportReason: ReportReason;
  message: string;
  game: Game;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}
