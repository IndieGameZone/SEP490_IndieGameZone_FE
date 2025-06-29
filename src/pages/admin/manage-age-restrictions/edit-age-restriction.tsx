import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { AgeRestriction } from "@/types/age-restriction";
import TextArea from "antd/es/input/TextArea";
import { updateAgeRestriction } from "@/lib/api/age-restriction-api";

interface EditAgeRestrictionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: AgeRestriction | null;
}

interface EditLanguageForm {
  code: string;
  description: string;
}

const EditAgeRestrictionModal = ({
  open,
  onClose,
  onSuccess,
  record,
}: EditAgeRestrictionModalProps) => {
  const [form] = Form.useForm<EditLanguageForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: EditLanguageForm) => {
    if (!record) return;

    setLoading(true);
    const result = await updateAgeRestriction(record.id, {
      code: values.code,
      description: values.description,
    });
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to update age restriction");
    } else {
      messageApi.success("Age Restriction updated successfully!");
      form.resetFields();
      onClose();
      onSuccess();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (record && open) {
      form.setFieldsValue({
        code: record.code,
        description: record.description,
      });
    }
  }, [record, open, form]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Age Restriction"
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

export default EditAgeRestrictionModal;
