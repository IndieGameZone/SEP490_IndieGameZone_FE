import { createWithdrawRequest } from "@/lib/api/withdraw-api";
import useAuthStore from "@/store/use-auth-store";
import { Form, InputNumber, message, Modal } from "antd";
import { useState } from "react";

interface AddCreateWithdrawRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateWithdrawRequestForm {
  Amount: number;
}

const CreateWithdrawRequest = ({
  open,
  onClose,
  onSuccess,
}: AddCreateWithdrawRequestModalProps) => {
  const [form] = Form.useForm<CreateWithdrawRequestForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { profile } = useAuthStore();
  const handleSubmit = async (values: CreateWithdrawRequestForm) => {
    if (!profile?.id) {
      messageApi.error("You must be logged in to create a withdraw request");
      return;
    }
    try {
      setLoading(true);
      const result = await createWithdrawRequest(profile?.id, {
        Amount: values.Amount,
      });

      if (result.success) {
        messageApi.success("Withdraw request created successfully!");
        form.resetFields();
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to create withdraw request");
      }
    } catch (error) {
      messageApi.error("Failed to create withdraw request");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  const maxWithdrawAmount = profile?.balance ?? 0;

  return (
    <div>
      {contextHolder}
      <Modal
        title=" Withdraw Request"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Amount"
            name="Amount"
            rules={[
              { required: true, message: "Please input the amount!" },
              {
                type: "number",
                min: 1000,
                message: "Amount must be at least 1000!",
              },
            ]}
          >
            <InputNumber<number>
              className="w-full"
              style={{ width: "100%" }}
              placeholder="Enter points amount (e.g. 50.000)"
              max={maxWithdrawAmount}
              size="large"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) =>
                value ? parseInt(value.replace(/\./g, ""), 10) : 0
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateWithdrawRequest;
