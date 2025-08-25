import useGameStore from "@/store/use-game-store";
import { GameStatus, GameVisibility } from "@/types/game";
import { Form, Upload, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { updateGame } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import UpdateScreenshotsButton from "./update-screenshots-button";
import ReactPlayer from "react-player";
import UpdateVideoButton from "./update-video-button";
import { axiosClient } from "@/lib/api/config/axios-client";

type FieldType = {
  name: string;
  coverImage: string;
  videoLink: string;
  description: string;
  shortDescription: string;
  installInstruction: string;
  screenshots: string[];
  allowDonation: boolean;
  releaseStatus: GameStatus;
  visibility: GameVisibility;
  price: number;
  averageSession: number;
  ageRestrictionId: string;
  categoryId: string;
  languageIds: string[];
  tagIds: string[];
};
const { Dragger } = Upload;

const UpdateGameMediaAssets = () => {
  const { game, rerender, installInstruction } = useGameStore();
  const [form] = Form.useForm<FieldType>();
  const [index, setIndex] = useState(-1);
  const [messageApi, contextHolder] = message.useMessage();
  const { profile } = useAuthStore();

  useEffect(() => {
    if (game) {
      form.setFieldsValue({
        ageRestrictionId: game.ageRestriction.id,
        allowDonation: game.allowDonation,
        averageSession: game.averageSession,
        categoryId: game.category.id,
        coverImage: game.coverImage,
        description: game.description,
        installInstruction: installInstruction ?? "None",
        languageIds: game.gameLanguages.map((x) => x.language.id),
        name: game.name,
        price: game.price,
        releaseStatus: game.status,
        shortDescription: game.shortDescription,
        tagIds: game.gameTags.map((x) => x.tag.id),
        videoLink: game.videoLink,
        visibility: game.visibility,
      });
    }
  }, []);

  const handleUpdateCoverImage = async (coverImageUrl: string) => {
    if (!profile || !game) return;
    const result = await updateGame(profile.id, game.id, {
      ageRestrictionId: form.getFieldValue("ageRestrictionId"),
      allowDonation: form.getFieldValue("allowDonation"),
      averageSession: form.getFieldValue("averageSession"),
      categoryId: form.getFieldValue("categoryId"),
      coverImage: coverImageUrl,
      description: form.getFieldValue("description"),
      installInstruction: form.getFieldValue("installInstruction"),
      languageIds: form.getFieldValue("languageIds"),
      name: form.getFieldValue("name"),
      price: form.getFieldValue("price"),
      shortDescription: form.getFieldValue("shortDescription"),
      status: form.getFieldValue("releaseStatus"),
      tagIds: form.getFieldValue("tagIds"),
      videoLink: form.getFieldValue("videoLink"),
      visibility: form.getFieldValue("visibility"),
      versionDescription: game.versionDescription,
      requireActivationKey: game.requireActivationKey,
    });
    if (result.error) {
      messageApi.error("Failed to update cover image");
    } else {
      messageApi.success("Update cover image successfully!");
      setTimeout(() => {
        rerender();
      }, 1000);
    }
  };

  const slides = useMemo(() => {
    return game
      ? [
          { src: game.coverImage },
          ...game.gameImages.map((image) => ({ src: image.image })),
        ]
      : [];
  }, [game]);

  const props = {
    name: "file",
    multiple: false,
    accept: ".png,.jpg,.jpeg,.webp",
    maxCount: 1,
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
        onSuccess?.(response.data);
        handleUpdateCoverImage(response.data);
      } catch (error) {
        onError?.(error as any);
        messageApi.error("Upload failed!");
      }
    },
  };

  if (!game) return;

  return (
    <div className="p-5 bg-zinc-900">
      {contextHolder}
      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
      <h2 className="text-2xl mb-3">Game Media Assets</h2>
      <h3 className="font-bold mb-2">Cover Image</h3>
      <div className="grid grid-cols-2 gap-3 pb-5">
        <img
          src={game?.coverImage}
          alt="game's cover image"
          className="aspect-video object-contain bg-zinc-800 rounded highlight-hover cursor-pointer w-full"
          onClick={() => {
            setIndex(0);
          }}
        />
        <Form form={form}>
          <Dragger {...props}>
            <p className="flex justify-center py-5">
              <HiMiniInboxArrowDown className="size-18" />
            </p>
            <p className="ant-upload-text">
              Click or drag image to this area
              <br /> to upload cover image
            </p>
            <p className="ant-upload-hint">
              Support PNG, JPG, JPEG, and WEBP formats.
            </p>
          </Dragger>
        </Form>
      </div>
      <div className="bg-zinc-800 p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold mb-2">Game Screenshorts</h2>
          <UpdateScreenshotsButton
            screenshots={game.gameImages.map((x) => x.image)}
          />
        </div>

        <div className="grid grid-cols-4 gap-3 mb-2">
          {game.gameImages.map((image, index: number) => (
            <img
              key={`game-image-${index}`}
              src={image.image}
              className="aspect-video object-contain rounded highlight-hover cursor-pointer bg-zinc-900"
              onClick={() => setIndex(index + 1)}
            />
          ))}
        </div>
      </div>
      <div className="bg-zinc-800 p-3 mt-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">Gameplay/trailer</h2>
          <UpdateVideoButton url={game.videoLink} />
        </div>
        {game?.videoLink ? (
          <ReactPlayer
            className="react-player"
            url={game?.videoLink}
            controls
          />
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>
    </div>
  );
};

export default UpdateGameMediaAssets;
