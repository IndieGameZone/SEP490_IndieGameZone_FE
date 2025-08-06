export type Order = {
    id: string;
    amount: number;
    commercialRegistrationStartDate?: string;
    commercialRegistrationEndDate?: string;
    createdAt: string;
    game: {
        id: string;
        name: string;
    },
    commercialPackage?: {
        id: string;
        name: string;
    }
}