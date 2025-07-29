import { User } from "./user";

export type CommercialPackage = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
  gameName: string;
  commercialPackageName: string;
  developer: User;
};
