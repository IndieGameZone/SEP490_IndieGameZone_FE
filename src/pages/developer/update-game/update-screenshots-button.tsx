import { Button, Modal, Tooltip, Upload, UploadFile, message } from "antd";
import DragDropStringSorter from "./drag-drop-string-sorter";
import { useMemo, useState } from "react";
import { FaPen, FaSave } from "react-icons/fa";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { v4 as uuidv4 } from "uuid";
import { SortableImage } from "@/types/game";
import { UploadChangeParam } from "antd/es/upload";
import { updateGameImages } from "@/lib/api/game-api";
import useGameStore from "@/store/use-game-store";
import { areArraysEqual } from "@/lib/object";
import { axiosClient } from "@/lib/api/config/axios-client";

const { Dragger } = Upload;

const MAX_IMAGES = 10;

const UpdateScreenshotsButton = ({
  screenshots,
}: {
  screenshots: string[];
}) => {
  const [imageUrls, setImageUrls] = useState<SortableImage[]>(
    screenshots.map((url) => ({ id: uuidv4(), url }))
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const { game, rerender } = useGameStore();

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);
  };

  const handleRemoveFile = (file: UploadFile) => {
    const newList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newList);
  };

  const clearFileList = () => {
    setFileList([]);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!game) return;
    setIsLoading(true);
    const result = await updateGameImages(game.id, {
      images: imageUrls.map((x) => x.url),
    });
    if (result.error) {
      messageApi.error("Failed to update game screenshots! Please try again.");
      return;
    }
    rerender();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setImageUrls(screenshots.map((url) => ({ id: uuidv4(), url })));
    clearFileList();
    setIsModalOpen(false);
  };

  const props = {
    name: "file",
    multiple: false,
    accept: ".png,.jpg,.jpeg,.webp",
    maxCount: MAX_IMAGES - imageUrls.length,
    beforeUpload: (file: File) => {
      const isAllowedType =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/webp";

      if (!isAllowedType) {
        messageApi.error("Only PNG, JPG, JPEG, and WEBP files are allowed!");
        return Upload.LIST_IGNORE;
      }
    },
    customRequest: async ({
      file,
      onProgress,
      onSuccess,
      onError,
    }: UploadRequestOption) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axiosClient.post("/api/files", formData, {
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded / event.total) * 100);
              onProgress?.({ percent });
            }
          },
        });

        setImageUrls((prev) => [...prev, { id: uuidv4(), url: response.data }]);
        onSuccess?.(response.data);
      } catch (error) {
        onError?.(error as any);
        messageApi.error("Upload failed!");
      }
    },
  };

  const handleRemove = (idToRemove: string) => {
    setImageUrls((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const isChanged = useMemo(() => {
    const newImages = imageUrls.map((x) => x.url);
    return !areArraysEqual(newImages, screenshots);
  }, [imageUrls]);

  return (
    <>
      {contextHolder}
      <Tooltip title="Edit screenshots">
        <Button onClick={showModal} icon={<FaPen />} shape="circle" />
      </Tooltip>

      <Modal
        title={<h4 className="text-xl">Edit screenshots</h4>}
        open={isModalOpen}
        onOk={handleOk}
        maskClosable={false}
        onCancel={handleCancel}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "70%",
          xl: "70%",
          xxl: "70%",
        }}
        footer={() => (
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleOk}
              icon={<FaSave />}
              loading={isLoading}
              disabled={!isChanged}
            >
              Save changes
            </Button>
          </>
        )}
      >
        <Dragger
          {...props}
          fileList={fileList}
          onChange={handleChange}
          onRemove={handleRemoveFile}
          disabled={imageUrls.length >= MAX_IMAGES}
        >
          <p className="flex justify-center py-5">
            <HiMiniInboxArrowDown className="size-18" />
          </p>
          <p className="ant-upload-text">
            Click or drag image to this area
            <br /> to upload more images
          </p>
          <p className="ant-upload-hint">
            Support PNG, JPG, JPEG, and WEBP formats.
          </p>
        </Dragger>
        <p className="my-2">Allows max {MAX_IMAGES} images</p>
        <DragDropStringSorter
          items={imageUrls}
          onSorted={(newOrder) => setImageUrls(newOrder)}
          onRemove={handleRemove}
        />
        <p className="mt-2 mb-1 italic text-center text-zinc-400">
          Drag image to rearrange
        </p>
      </Modal>
    </>
  );
};

export default UpdateScreenshotsButton;
