import { useGlobalMessage } from "@/components/message-provider";
import { updateGame } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { Button, Form, FormProps, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { FaPen, FaSave } from "react-icons/fa";

type FieldType = {
  videoLink: string;
};

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/;

const UpdateVideoButton = ({ url }: { url: string }) => {
  const messageApi = useGlobalMessage();
  const [form] = Form.useForm<FieldType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const { game, rerender } = useGameStore();
  const { profile } = useAuthStore();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      installInstruction: game.installInstruction,
      languageIds: game.gameLanguages.map((x) => x.language.id),
      name: game.name,
      price: game.price,
      shortDescription: game.shortDescription,
      status: game.status,
      tagIds: game.gameTags.map((x) => x.tag.id),
      videoLink: values.videoLink,
      visibility: game.visibility,
    });
    if (result.error) {
      messageApi.error("Failed to update gameplay/trailer");
    } else {
      messageApi.success("Update gameplay/trailer successfully!");
      setTimeout(() => {
        rerender();
      }, 1000);
      setIsModalOpen(false);
    }
  };

  const validateYouTubeUrl = (_: any, value: any) => {
    if (!value || YOUTUBE_REGEX.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid YouTube URL"));
  };

  const handleValuesChange = (_: any, allValues: FieldType) => {
    const changed = allValues.videoLink != url;
    setIsChanged(changed);
  };

  useEffect(() => {
    form.setFieldValue("videoLink", url);
  }, []);

  return (
    <>
      <Button onClick={showModal} icon={<FaPen />}>
        Edit gameplay/trailer link
      </Button>
      <Modal
        title="Edit gameplay/trailer link"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
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
            name="videoLink"
            label={<span className="font-bold">Gameplay video or trailer</span>}
            rules={[{ validator: validateYouTubeUrl }]}
            style={{ marginBottom: 20 }}
            extra="Provide a link to YouTube"
          >
            <Input placeholder="eg. https://www.youtube.com/watch?v=Xe6v3UJok48" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateVideoButton;
