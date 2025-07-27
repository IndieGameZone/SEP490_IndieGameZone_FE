import { Modal, Form, DatePicker, Select, Button } from "antd";
import { googleLogin, prepareGoogleLoginData } from "@/lib/api/auth-api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  token: string;
  onSuccess: () => void;
};

type GoogleFormType = {
  birthday: dayjs.Dayjs;
  role: "Player" | "Developer";
};

const GoogleProfileModal = ({ open, onClose, token, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: GoogleFormType) => {
    setIsSubmitting(true);
    const result = await googleLogin(prepareGoogleLoginData(token, values));
    setIsSubmitting(false);

    if (result.success) {
      localStorage.setItem("accessToken", result.data);
      toast.success("Login successfully");
      onClose();
      onSuccess();
    } else {
      toast.error(result.data?.detail || result.error);
    }
  };

  return (
    <Modal
      title="Complete Your Profile"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <p className="mb-4 text-gray-600">
        Please provide additional information to complete your registration.
      </p>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Birthday"
          name="birthday"
          rules={[{ required: true, message: "Please select your birthday" }]}
        >
          <DatePicker
            style={{ width: "100%", paddingBlock: 10 }}
            placeholder="Select your birthday"
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select your role" }]}
        >
          <Select
            placeholder="Select your role"
            style={{ paddingBlock: 10 }}
            options={[
              { value: "Player", label: "Player" },
              { value: "Developer", label: "Developer" },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            style={{
              paddingBlock: 20,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Complete Registration
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GoogleProfileModal;
