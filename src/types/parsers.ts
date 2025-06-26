export const parseNumber = (value: string | null, fallback: number | undefined = undefined): number | undefined => {
    if (!value) return undefined;
    const num = Number(value);
    return !isNaN(num) ? num : fallback;
};

export const parseStringArray = (value: string | null): string[] | undefined =>
    value ? value.split(",").filter(Boolean) : undefined;