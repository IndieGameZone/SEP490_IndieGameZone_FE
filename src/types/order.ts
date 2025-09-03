import { CommercialPackage } from "./commercial-package";
import { Game } from "./game";
import { Transaction } from "./transaction";
import { User } from "./user";

export type Order = {
  id: string;
  activationKey: ActivationKey;
  amount: number;
  commercialRegistrationStartDate?: string;
  commercialRegistrationEndDate?: string;
  createdAt: string;
  game: Game;
  user: User;
  commercialPackage?: CommercialPackage;
  transaction: Transaction;
};
interface ActivationKey {
  id: string;
  key: string;
  isUsed: boolean;
  isActive: boolean;
  createdAt: string;
}
