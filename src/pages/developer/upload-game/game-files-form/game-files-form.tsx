import { Form, Button, Alert, FormInstance } from "antd";
import { useEffect } from "react";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import usePlatformStore from "@/store/use-platform-store";
import { useFileValidation } from "./use-file-validation";
import { handleBeforeUploadFactory } from "./file-upload-helpers";
import GameFileItem from "./game-file-item";
import { FaPlus } from "react-icons/fa";
import { GameFilesFieldType } from "@/types/game";

type FieldType = GameFilesFieldType;

const GameFilesForm = ({ form }: { form: FormInstance<FieldType> }) => {
  const { fetchPlatforms, platforms, loading, getDefaultPlatforms } =
    usePlatformStore();
  const { filesValidator, filesError } = useFileValidation();

  useEffect(() => {
    fetchPlatforms();
  }, []);

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
                disabled={fields.length >= 6}
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
