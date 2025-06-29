import { addAgeRestriction } from "@/lib/api/age-restriction-api";
import { Form, Input, Modal, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

interface AddAgeRestrictionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddAgeRestrictionForm {
  code: string;
  description: string;
}

const AddAgeRestrictionModal = ({
  open,
  onClose,
  onSuccess,
}: AddAgeRestrictionModalProps) => {
  const [form] = Form.useForm<AddAgeRestrictionForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: AddAgeRestrictionForm) => {
    setLoading(true);
    const result = await addAgeRestriction(values);
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to add age restriction");
    } else {
      messageApi.success("Age Restriction added successfully!");
      form.resetFields();
      onClose();
      onSuccess();
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
        title="Add New Age Restriction"
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
            label="Code"
            name="code"
            rules={[
              { required: true, message: "Please input code!" },
              { min: 2, message: "Code must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="Enter code" />
          </Form.Item>
        </Form>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter description!" },
              { min: 2, message: "Description must be at least 2 characters!" },
            ]}
          >
            <TextArea placeholder="Enter Description" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAgeRestrictionModal;
