import { useGlobalMessage } from "@/components/message-provider";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { updateGame } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { Button, Form, FormProps, Modal } from "antd";
import { useEffect, useState } from "react";
import { FaPen, FaSave } from "react-icons/fa";

type FieldType = {
  versionDescription: string;
};

const UpdateVersionDescription = () => {
  const { game, rerender, installInstruction } = useGameStore();
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
    const changed = allValues.versionDescription != game?.versionDescription;
    setIsChanged(changed);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!game || !profile || !installInstruction) return;
    setLoading(true);
    const result = await updateGame(profile.id, game.id, {
      ageRestrictionId: game.ageRestriction.id,
      allowDonation: game.allowDonation,
      averageSession: game.averageSession,
      categoryId: game.category.id,
      coverImage: game.coverImage,
      description: game.description,
      installInstruction: installInstruction,
      languageIds: game.gameLanguages.map((x) => x.language.id),
      name: game.name,
      price: game.price,
      shortDescription: game.shortDescription,
      status: game.status,
      tagIds: game.gameTags.map((x) => x.tag.id),
      videoLink: game.videoLink,
      visibility: game.visibility,
      versionDescription: values.versionDescription,
    });
    if (result.error) {
      messageApi.error("Failed to update version notes");
    } else {
      messageApi.success("Update update version notes successfully!");
      setTimeout(() => {
        rerender();
      }, 1000);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (game) {
      form.setFieldsValue({
        versionDescription: game.versionDescription,
      });
    }
  }, [game]);

  return (
    <>
      <Button onClick={showModal} icon={<FaPen />}>
        Edit version notes
      </Button>
      <Modal
        title="Edit version notes"
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
            name="versionDescription"
            label={<span className="font-bold">Version notes</span>}
            extra="Tell players what changed in your versions!"
          >
            <TiptapEditor />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateVersionDescription;
