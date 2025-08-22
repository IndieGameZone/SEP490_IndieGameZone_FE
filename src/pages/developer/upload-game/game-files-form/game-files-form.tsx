import { Form, Button, Alert, FormInstance } from "antd";
import { useEffect } from "react";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import usePlatformStore from "@/store/use-platform-store";
import { useFileValidation } from "./use-file-validation";
import { handleBeforeUploadFactory } from "./file-upload-helpers";
import GameFileItem from "./game-file-item";
import { FaPlus } from "react-icons/fa";
import { GameFilesFieldType, GameVisibility } from "@/types/game";
import { Link } from "react-router-dom";

type FieldType = GameFilesFieldType;

interface GameFilesForm {
  form: FormInstance<FieldType>;
  visibility: GameVisibility;
  requireActivationKey: boolean;
}

const GameFilesForm = ({
  form,
  visibility,
  requireActivationKey,
}: GameFilesForm) => {
  const { fetchPlatforms, platforms, loading, getDefaultPlatforms } =
    usePlatformStore();
  const { filesValidator, filesError } = useFileValidation(visibility);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  useEffect(() => {
    if (requireActivationKey) {
      form.setFieldValue("files", []);
    }
  }, [requireActivationKey]);

  const handleBeforeUpload = handleBeforeUploadFactory(
    form,
    getDefaultPlatforms
  );

  const handleFormChange = (changedValues: any) => {
    if (changedValues.files !== undefined) {
      form.validateFields(["files"]);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={handleFormChange}
    >
      {requireActivationKey && (
        <Alert
          message="Obtain game ID before you upload game files"
          style={{ marginBottom: 15 }}
          description={
            <p>
              In order to integrate activation key into your game, you have to
              get your game ID by upload your game as a draft first then you can
              upload your files later.{" "}
              <Link to={`/dev/api`}>
                <span className="mb-2 text-blue-400 underline">Learn more</span>
              </Link>
            </p>
          }
          type="info"
          showIcon
        />
      )}
      <Form.List name="files" rules={[{ validator: filesValidator }]}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <GameFileItem
                key={key}
                name={name}
                index={index}
                remove={remove}
                restField={restField}
                form={form}
                platforms={platforms}
                loading={loading}
                handleBeforeUpload={handleBeforeUpload}
              />
            ))}
            {errors.length > 0 && (
              <Alert
                message={filesError}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Form.Item extra="You can upload up to 6 files.">
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<FaPlus />}
                disabled={fields.length >= 6 || requireActivationKey}
              >
                Add File
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item
        name="installInstruction"
        label={<span className="font-bold">Install instructions</span>}
        extra="Help players install your game on their specific platform"
      >
        <TiptapEditor />
      </Form.Item>
      <Form.Item
        name="versionDescription"
        label={<span className="font-bold">Version notes</span>}
        extra="Tell players what changed in your versions!"
      >
        <TiptapEditor />
      </Form.Item>
    </Form>
  );
};

export default GameFilesForm;
