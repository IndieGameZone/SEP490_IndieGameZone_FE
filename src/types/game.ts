import { UploadFile } from "antd";
import { Category } from "./category";
import { Tag } from "./tag";
import { Language } from "./language";
import { AgeRestriction } from "./age-restriction";
import { Platform } from "./platform";
import { User } from "./user";

export type Image = {
    id: string;
    image: string;
}

export type GameInfo = {
    name: string;
    shortDescription: string;
    averageSession: number;
    categoryId: string;
    tagIds: string[];
    languageIds: string[];
    ageRestrictionId: string;
    releaseStatus: "Released" | "InDevelopment" | "OnHold" | "Canceled" | "Prototype";
    description: string;
    price: number;
    allowDonate: boolean;
    pricingOption: "Free" | "Paid";
    visibility: "Draft" | "Restricted" | "Public",
};

export type GameMediaAssets = {
    coverImage: UploadFile[];
    gameImages: UploadFile[];
    videoLink: string;
};

export type GameFiles = {
    files: {
        displayName: string;
        file: UploadFile[];
        platformId: string;
        fileSize: number;
    }[];
    installInstruction: string;
}

export type GameData = {
    gameInfo: GameInfo,
    gameMediaAssets: GameMediaAssets,
    gameFiles: GameFiles
}

export type Game = {
    id: string;
    name: string;
    coverImage: string;
    description: string;
    shortDescription: string;
    status: "Released" | "InDevelopment" | "OnHold" | "Canceled" | "Prototype";
    allowDonation: boolean;
    price: number;
    censorStatus: "Approved" | "Rejected" | "PendingAIReview" | "PendingManualReview";
    priceAfterDiscount: number;
    discount: number;
    visibility: "Draft" | "Restricted" | "Public"
    category: Category;
    gameTags: { tag: Tag }[];
    gameLanguages: { language: Language }[];
    gameImages: GameImage[],
    ageRestriction: AgeRestriction;
    averageSession: number;
    videoLink: string;
    gamePlatforms: GameFile[];
    developers: User;
    updatedAt: string;
    numberOfReviews: number;
    averageRating: number;
    censorAt?: string;
    createdAt: string;
    installInstruction: string;
    moderator?: User;
    censorReason?: string;
}

type GameImage = {
    id: string;
    image: string;
}

export type GameFile = {
    id: string;
    displayName: string;
    size: number;
    platform: Platform;
    file: string;
}