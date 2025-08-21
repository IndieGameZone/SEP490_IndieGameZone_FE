import { CommercialPackage } from "./commercial-package";
import { Game } from "./game";
import { Transaction } from "./transaction";

export type Order = {
  id: string;
  activationKey: ActivationKey;
  amount: number;
  commercialRegistrationStartDate?: string;
  commercialRegistrationEndDate?: string;
  createdAt: string;
  game: Game;
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
