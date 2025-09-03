import { editCommercialPackages } from "@/lib/api/commercial-package-api";
import { CommercialPackage } from "@/types/commercial-package";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;
const { TextArea } = Input;

interface EditCommercialProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  commercialPackage: CommercialPackage | null;
}

interface EditCommercialForm {
  name: string;
  description: string;
  duration: number;
  price: number;
  type: string;
}

const EditCommercial = ({ open, onClose, onSuccess, commercialPackage }: EditCommercialProps) => {
  const [form] = Form.useForm<EditCommercialForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (commercialPackage && open) {
      form.setFieldsValue({
        name: commercialPackage.name,
        description: commercialPackage.description,
        duration: commercialPackage.duration,
        price: commercialPackage.price,
        type: commercialPackage.type,
      });
    }
  }, [commercialPackage, open, form]);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: EditCommercialForm) => {
    if (!commercialPackage) return;

    try {
      setLoading(true);
      const result = await editCommercialPackages(commercialPackage.id, {
        name: values.name,
        description: values.description,
        duration: values.duration,
        price: values.price,
        type: values.type,
      });

      if (result.success) {
        messageApi.success("Commercial package updated successfully!");
        handleCancel();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to update commercial package");
      }
    } catch (error) {
      console.error("Error updating commercial package:", error);
      messageApi.error("Failed to update commercial package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Commercial Package"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="mb-4">
            <p><strong>ID:</strong> {commercialPackage?.id}</p>
            <p><strong>Status:</strong> {commercialPackage?.status}</p>
            <p><strong>Game:</strong> {commercialPackage?.gameName}</p>
          </div>
          
          <Form.Item
            name="name"
            label="Package Name"
            rules={[{ required: true, message: "Please input package name!" }]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea rows={4} placeholder="Enter package description" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="type"
              label="Package Type"
              rules={[{ required: true, message: "Please select package type!" }]}
            >
              <Select>
                <Option value="HomepageBanner">Homepage Banner</Option>
                <Option value="CategoryBanner">Category Banner</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration (days)"
              rules={[{ required: true, message: "Please input duration!" }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price (VND)"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <InputNumber
                min={0}
                step={10000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                className="w-full"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EditCommercial;