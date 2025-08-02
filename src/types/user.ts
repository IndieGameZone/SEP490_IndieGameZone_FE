import { BankInfo } from "./bank-info";

export type User = {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  isActive: boolean;
  joinedDate: string;

  lastLogin: string;
  fullname?: string;
  avatar?: string;
  bio?: string;
  birthday: string;
  facebookLink?: string;
  youtubeChannelLink?: string;
  balance: number;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bank: BankInfo;
  role: {
    name: string;
  };
};

export type UserBanHistory = {
  id: string;
  reason?: string;
  banDate: string;
  unbanDate?: string;
  bannedByUser: User;
};
