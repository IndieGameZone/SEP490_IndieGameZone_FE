import { Button, Form, message } from "antd";
import PaymentConfigWarning from "./payment-config-warning";
import UploadGuideLine from "./upload-guideline";
import GameInfoForm from "./game-info-form";
import StepLayout from "./step-layout";
import MediaAssetsForm from "./media-assets-form";
import GameFilesForm from "./game-files-form";
import useManageGameStore from "@/store/use-manage-game-store";
import { useNavigate } from "react-router-dom";

const DevUploadGamePage = () => {
  const [infoForm] = Form.useForm();
  const [mediaForm] = Form.useForm();
  const [fileForm] = Form.useForm();
  const navigate = useNavigate();
  const { setGameInfo, setGameFiles, setGameMediaAssets, saveState } =
    useManageGameStore();

  const handleSaveDraft = () => {
    console.log(infoForm.getFieldsValue());
    console.log(mediaForm.getFieldsValue());
    console.log(fileForm.getFieldsValue());
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
      console.log(error);
      message.error("Make sure all fields are filled correctly!");
    }
  };

  return (
    <div className="bg-zinc-900">
      <h1 className="font-bold text-2xl p-5">Upload a new game</h1>
      <PaymentConfigWarning />
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
          <Button onClick={handleSaveDraft}>Save as Draft</Button>
          <Button type="primary" onClick={handleSubmit}>
            Continue to Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DevUploadGamePage;
