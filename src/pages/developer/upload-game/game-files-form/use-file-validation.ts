import { useState } from "react";

export const useFileValidation = () => {
    const [filesError, setFilesError] = useState("");

    const filesValidator = async (_: any, files: any) => {
        if (!files || files.length < 1) {
            setFilesError("At least one file is required");
            return Promise.reject(new Error("At least one file is required"));
        }

        const invalidExtensions: string[] = [];

        const entries = files.map((f: any) => {
            const displayName = f?.displayName?.trim();
            const platformId = f?.platformId;
            const version = f?.version?.trim();
            const originalFile = f?.file?.[0]?.originFileObj;
            const realExt = originalFile?.name?.split('.').pop()?.toLowerCase();
            const nameExt = displayName?.split('.').pop()?.toLowerCase();

            if (displayName && realExt && nameExt && nameExt !== realExt) {
                invalidExtensions.push(displayName);
            }

            return { displayName, platformId, version };
        });

        if (invalidExtensions.length > 0) {
            const message = `Display name extension doesn't match uploaded file for: ${invalidExtensions.join(", ")}`;
            setFilesError(message);
            return Promise.reject(new Error(message));
        }

        const duplicates = new Set<string>();
        const seen = new Map<string, Set<string>>();
        for (const { displayName, platformId, version } of entries) {
            const comboKey = `${platformId || "none"}-${version || "none"}`;
            if (!seen.has(displayName)) {
                seen.set(displayName, new Set([comboKey]));
            } else {
                const existing = seen.get(displayName)!;
                if (existing.has(comboKey)) {
                    duplicates.add(displayName);
                } else {
                    existing.add(comboKey);
                }
            }
        }

        if (duplicates.size > 0) {
            const message = `Each file with the same name must have a unique combination of platform or version. Duplicates found for: ${[...duplicates].join(", ")}`;
            setFilesError(message);
            return Promise.reject(new Error(message));
        }

        setFilesError("");
        return Promise.resolve();
    };


    return { filesValidator, filesError };
};
