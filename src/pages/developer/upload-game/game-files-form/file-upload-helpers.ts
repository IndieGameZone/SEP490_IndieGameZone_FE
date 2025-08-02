import { UploadFile } from "antd";

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
    return (file: UploadFile, index: number) => {
        const isAllowed = allowedTypes.some((type) =>
            file.name.toLowerCase().endsWith(type)
        );

        if (!isAllowed) {
            return false;
        }

        const ext = file.name.split(".").pop()?.toLowerCase();
        const platform =
            ext === "exe" ? getDefaultPlatforms().windowsPlatformId ?? "" : "";

        const currentList = form.getFieldValue("files") || [];
        const currentItem = currentList[index] || {};
        const updatedList = [...currentList];

        // Attach the original extension for validation later
        const wrappedFile = {
            ...file,
            originFileObj: {
                ...file.originFileObj,
                originalExtension: ext,
            },
        };

        updatedList[index] = {
            ...currentItem,
            displayName: file.name,
            fileSize: file.size ?? 0,
            file: [wrappedFile],
            platformId: platform.length ? platform : undefined,
        };

        form.setFieldsValue({ files: updatedList });
        return false;
    };
};
