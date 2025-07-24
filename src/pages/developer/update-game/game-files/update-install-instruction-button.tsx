import { useGlobalMessage } from "@/components/message-provider";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { updateGame } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { Button, Form, FormProps, Modal } from "antd";
import { useEffect, useState } from "react";
import { FaPen, FaSave } from "react-icons/fa";

type FieldType = {
  installInstruction: string;
};

const UpdateInstallInstructionButton = () => {
  const { game, installInstruction, rerender } = useGameStore();
  const { profile } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FieldType>();
  const messageApi = useGlobalMessage();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleValuesChange = (_: any, allValues: FieldType) => {
    const changed = allValues.installInstruction != installInstruction;
    setIsChanged(changed);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!game || !profile) return;
    setLoading(true);
    const result = await updateGame(profile.id, game.id, {
      ageRestrictionId: game.ageRestriction.id,
      allowDonation: game.allowDonation,
      averageSession: game.averageSession,
      categoryId: game.category.id,
      coverImage: game.coverImage,
      description: game.description,
      installInstruction: values.installInstruction,
      languageIds: game.gameLanguages.map((x) => x.language.id),
      name: game.name,
      price: game.price,
      shortDescription: game.shortDescription,
      status: game.status,
      tagIds: game.gameTags.map((x) => x.tag.id),
      videoLink: game.videoLink,
      visibility: game.visibility,
      versionDescription: game.versionDescription,
    });
    if (result.error) {
      messageApi.error("Failed to update install instructions");
    } else {
      messageApi.success("Update install instructions successfully!");
      setTimeout(() => {
        rerender();
      }, 1000);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (installInstruction) {
      form.setFieldsValue({
        installInstruction: installInstruction,
      });
    }
  }, [installInstruction]);

  return (
    <>
      <Button onClick={showModal} icon={<FaPen />}>
        Edit install instructions
      </Button>
      <Modal
        title="Edit install instructions"
        open={isModalOpen}
        onOk={handleOk}
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
              loading={loading}
              disabled={!isChanged}
            >
              Save changes
            </Button>
          </>
        )}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={handleValuesChange}
        >
          <Form.Item<FieldType>
            name="installInstruction"
            label={<span className="font-bold">Install instructions</span>}
            extra="Help players install your game on their specific platform"
          >
            <TiptapEditor />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateInstallInstructionButton;
