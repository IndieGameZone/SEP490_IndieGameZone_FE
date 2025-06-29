import { Button, Form, message } from "antd";
import UploadGuideLine from "./upload-guideline";
import GameInfoForm from "./game-info-form";
import StepLayout from "./step-layout";
import MediaAssetsForm from "./media-assets-form";
import GameFilesForm from "./game-files-form";
import useManageGameStore from "@/store/use-manage-game-store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GameFiles, GameInfo, GameMediaAssets } from "@/types/game";
import { FaArrowRight, FaUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const DevUploadGamePage = () => {
  const [infoForm] = Form.useForm<GameInfo>();
  const [mediaForm] = Form.useForm<GameMediaAssets>();
  const [fileForm] = Form.useForm<GameFiles>();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    setGameInfo,
    setGameFiles,
    setGameMediaAssets,
    gameInfo,
    gameMediaAssets,
    gameFiles,
    saveState,
    loadState,
    isLoaded,
  } = useManageGameStore();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/dev/manage-games");
  };
  const handleSubmit = async () => {
    try {
      const infoValues = await infoForm.validateFields();
      const mediaValues = await mediaForm.validateFields();
      const fileValues = await fileForm.validateFields();
      setGameInfo(infoValues);
      setGameMediaAssets(mediaValues);
      setGameFiles(fileValues);
      saveState();
      navigate("/dev/upload-game/preview");
    } catch (error) {
      messageApi.error("Make sure all fields are filled correctly!");
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      loadState();
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      infoForm.setFieldsValue({
        name: gameInfo.name,
        shortDescription: gameInfo.shortDescription,
        averageSession: gameInfo.averageSession,
        categoryId: gameInfo.categoryId,
        tagIds: gameInfo.tagIds,
        languageIds: gameInfo.languageIds,
        ageRestrictionId: gameInfo.ageRestrictionId,
        releaseStatus: gameInfo.releaseStatus,
        description: gameInfo.description,
        price: gameInfo.price,
        allowDonate: gameInfo.allowDonate,
        pricingOption: gameInfo.pricingOption,
        visibility: gameInfo.visibility,
      });
      mediaForm.setFieldsValue({
        coverImage: gameMediaAssets.coverImage,
        gameImages: gameMediaAssets.gameImages,
        videoLink: gameMediaAssets.videoLink,
      });

      fileForm.setFieldsValue({
        files: gameFiles.files,
        installInstruction: gameFiles.installInstruction,
      });
    }
  }, [isLoaded]);

  return (
    <div className="bg-zinc-900">
      {contextHolder}
      <div className="p-5 bg-orange-900 border-orange-500 border text-2xl flex gap-3">
        <FaUpload className="mt-0.5"/>
        <h1 className="font-bold text-2xl">Upload a new game</h1>
      </div>
      {/* <PaymentConfigWarning /> */}
      <div className="p-5">
        <UploadGuideLine />
        <StepLayout title="Game Information" current={0}>
          <GameInfoForm form={infoForm} />
        </StepLayout>
        <hr className="border-zinc-600 my-5" />
        <StepLayout title="Game Media Assets" current={1}>
          <MediaAssetsForm form={mediaForm} />
        </StepLayout>
        <hr className="border-zinc-600 my-5" />
        <StepLayout title="Game Files" current={2}>
          <GameFilesForm form={fileForm} />
        </StepLayout>
        <hr className="border-zinc-600 my-5" />
        <div className="flex justify-center gap-3">
          <Button onClick={handleCancel} icon={<MdCancel />}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit} icon={<FaArrowRight />}>
            Continue to Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DevUploadGamePage;
