import { useState } from "react";

export const useFileValidation = () => {
    const [filesError, setFilesError] = useState("");

    const filesValidator = async (_: any, files: any) => {
        if (!files || files.length < 1) {
            setFilesError("At least one file is required");
            return Promise.reject(new Error("At least one file is required"));
        }

        const entries = files
            .map((f: any) => ({
                displayName: f?.displayName?.trim(),
                platformId: f?.platformId,
                version: f?.version?.trim(),
            }))
            .filter((f: any) => f.displayName);

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
            const message = `Each file with the same name must have a unique combination of platform or version. Duplicates found for: ${[
                ...duplicates,
            ].join(", ")}`;
            setFilesError(message);
            return Promise.reject(new Error(message));
        }

        setFilesError("");
        return Promise.resolve();
    };

    return { filesValidator, filesError };
};
