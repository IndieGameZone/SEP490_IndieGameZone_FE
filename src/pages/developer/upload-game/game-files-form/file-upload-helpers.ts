export const allowedTypes = [
    ".exe",
    ".msi",
    ".sh",
    ".bat",
    ".apk",
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
];

export const handleBeforeUploadFactory = (
    form: any,
    getDefaultPlatforms: () => { windowsPlatformId?: string }
) => {
    return (file: any, index: number) => {
        const isAllowed = allowedTypes.some((type) =>
            file.name.toLowerCase().endsWith(type)
        );

        if (!isAllowed) {
            return false;
        }

        const ext = file.name.split(".").pop();
        const platform =
            ext === "exe" ? getDefaultPlatforms().windowsPlatformId ?? "" : "";

        const currentList = form.getFieldValue("files") || [];
        const currentItem = currentList[index] || {};
        const updatedList = [...currentList];
        updatedList[index] = {
            ...currentItem,
            displayName: file.name,
            fileSize: file.size ?? 0,
            file: [file],
            platformId: platform.length ? platform : undefined,
        };
        form.setFieldsValue({ files: updatedList });
        return false;
    };
};
