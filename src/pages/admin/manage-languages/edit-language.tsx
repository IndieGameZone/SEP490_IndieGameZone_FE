import { axiosClient } from "@/lib/api/config/axios-client";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";

import { Language } from "@/types/language";

interface EditLanguageModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language | null;
}

interface EditLanguageForm {
  name: string;
}

const EditLanguageModal = ({
  open,
  onClose,
  onSuccess,
  language,
}: EditLanguageModalProps) => {
  const [form] = Form.useForm<EditLanguageForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: EditLanguageForm) => {
    if (!language) return;

    try {
      setLoading(true);
      await axiosClient.put(`/languages/${language.id}`, {
        name: values.name,
      });

      messageApi.success("Language updated successfully!");
      onClose();
      onSuccess();
    } catch (error) {
      messageApi.error("Failed to update language");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (language && open) {
      form.setFieldsValue({
        name: language.name,
      });
    }
  }, [language, open, form]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Language"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Language Name"
            name="name"
            rules={[
              { required: true, message: "Please input language name!" },
              {
                min: 2,
                message: "Language name must be at least 2 characters!",
              },
            ]}
          >
            <Input placeholder="Enter language name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditLanguageModal;
