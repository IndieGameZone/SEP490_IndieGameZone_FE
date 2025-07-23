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

export type GameInfoFieldType = {
    name: string;
    shortDescription: string;
    averageSession: number;
    categoryId: string;
    tagIds: string[];
    languageIds: string[];
    ageRestrictionId: string;
    releaseStatus: GameStatus;
    description: string;
    price: number;
    allowDonate: boolean;
    pricingOption: "Free" | "Paid";
    visibility: GameVisibility,
};

export type GameMediaAssetsFieldType = {
    coverImage: UploadFile[];
    gameImages: UploadFile[];
    videoLink: string;
};

export type GameFilesFieldType = {
    files: {
        displayName: string;
        file: UploadFile[];
        platformId: string;
        fileSize: number;
        version: string;
    }[];
    installInstruction: string;
    versionDescription: string;
}

export type GameFieldTypes = {
    gameInfo: GameInfoFieldType,
    gameMediaAssets: GameMediaAssetsFieldType,
    gameFiles: GameFilesFieldType
}

export type Game = {
    id: string;
    name: string;
    coverImage: string;
    description: string;
    shortDescription: string;
    status: GameStatus;
    allowDonation: boolean;
    price: number;
    censorStatus: GameCensorStatus;
    priceAfterDiscount: number;
    discount: number;
    visibility: GameVisibility;
    category: Category;
    gameTags: { tag: Tag }[];
    gameLanguages: { language: Language }[];
    gameImages: GameImage[],
    ageRestriction: AgeRestriction;
    averageSession: number;
    videoLink: string;
    gamePlatforms: GameFile[];
    developer: User;
    updatedAt: string;
    numberOfReviews: number;
    averageRating: number;
    censoredAt?: string;
    createdAt: string;
    installInstruction: string;
    moderator?: User;
    censorReason?: string;
    hasCommercial: boolean;
    versionDescription: string;
}

export type GameStatus = "Released" | "InDevelopment" | "OnHold" | "Canceled" | "Prototype";
export type GameCensorStatus = "Approved" | "Rejected" | "PendingAIReview" | "PendingManualReview";
export type GameVisibility = "Draft" | "Restricted" | "Public";

export type LibraryItem = {
    game: {
        id: string;
        category: string;
        coverImage: string;
        name: string;
        price: number;
        shortDescription: string;
        tags: string[];
        numberOfReviews: number;
        averageRating: number;
    }
    purchasedAt: string;
}

export type WishlistItem = {
    game: {
        id: string;
        category: string;
        coverImage: string;
        name: string;
        price: number;
        shortDescription: string;
        tags: string[];
        numberOfReviews: number;
        averageRating: number;
    }
    addAt: string;
}

type GameImage = {
    id: string;
    image: string;
}

export type GameFile = {
    id: string;
    displayName: string;
    size: number; // MB
    platform: Platform;
    file: string;
    isActive: boolean;
    version: string;
}

export type GameCensorLog = {
    id: string;
    createdAt: string;
    censoredAt?: string;
    censorReason?: string;
    censorStatus: GameCensorStatus;
    moderator?: User;
}

export type SortableImage = { id: string; url: string };