import { axiosClient } from "@/lib/api/config/axios-client";
import { Form, Input, Modal, message } from "antd";
import { useState } from "react";

interface AddLanguageModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddLanguageForm {
  name: string;
}

const AddLanguageModal = ({
  open,
  onClose,
  onSuccess,
}: AddLanguageModalProps) => {
  const [form] = Form.useForm<AddLanguageForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: AddLanguageForm) => {
    try {
      setLoading(true);
      await axiosClient.post("/languages", {
        name: values.name,
      });

      messageApi.success("Language added successfully!");
      form.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      messageApi.error("Failed to add language");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Add New Language"
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

export default AddLanguageModal;
