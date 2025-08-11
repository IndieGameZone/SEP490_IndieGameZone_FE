export function seededDarkColor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }

    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    const darkR = Math.floor(r * 0.5);
    const darkG = Math.floor(g * 0.5);
    const darkB = Math.floor(b * 0.5);

    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}`;
}

export function seededLightColor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }

    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    const lightR = Math.floor(128 + (r * 0.5));
    const lightG = Math.floor(128 + (g * 0.5));
    const lightB = Math.floor(128 + (b * 0.5));

    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(lightR)}${toHex(lightG)}${toHex(lightB)}`;
}

export function seededColor(seed: string, brightness: number): string {
    const bFactor = Math.max(0, Math.min(1, brightness));

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }

    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    const adjR = Math.floor((r * (1 - bFactor)) + (255 * bFactor));
    const adjG = Math.floor((g * (1 - bFactor)) + (255 * bFactor));
    const adjB = Math.floor((b * (1 - bFactor)) + (255 * bFactor));

    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(adjR)}${toHex(adjG)}${toHex(adjB)}`;
}
