import React, { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, CalendarOutlined } from "@ant-design/icons";
import { createModerator } from "../../../lib/api/user-api";
import dayjs from "dayjs";
import { useGlobalMessage } from "@/components/message-provider";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formattedData = {
        ...values,
        birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
      };

      if (formattedData.password !== formattedData.confirmPassword) {
        messageApi.error("Passwords do not match");
        return;
      }

      const response = await createModerator(formattedData);

      if (response.success) {
        messageApi.success("User created successfully");
        form.resetFields();
        onSuccess();
        onClose();
      } else {
        messageApi.error(response.error || "Failed to create user");
      }
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message);
      } else {
        messageApi.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <UserOutlined className="text-blue-600" />
          <span>Add New User</span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Add User"
      cancelText="Cancel"
      width={600}
      className="top-8"
      okButtonProps={{
        className: "bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700",
      }}
    >
      <div className="mt-6">
        <Form form={form} layout="vertical" className="space-y-4" requiredMark={false}>
          <Form.Item
            name="email"
            label={<span className="text-sm font-medium text-gray-700">Email Address</span>}
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter email address"
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="userName"
            label={<span className="text-sm font-medium text-gray-700">Username</span>}
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter username"
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="birthday"
            label={<span className="text-sm font-medium text-gray-700">Birthday</span>}
            rules={[{ required: true, message: "Please select birthday!" }]}
          >
            <DatePicker
              className="w-full rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              placeholder="Select birthday"
              format="YYYY-MM-DD"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="password"
              label={<span className="text-sm font-medium text-gray-700">Password</span>}
              rules={[
                { required: true, message: "🔒 Please enter a password!" },
                { min: 6, message: "📏 Password must be at least 6 characters long!" },
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }

                    const hasUppercase = /[A-Z]/.test(value);
                    const hasLowercase = /[a-z]/.test(value);
                    const hasNumber = /\d/.test(value);
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

                    const missingRequirements = [];
                    if (!hasUppercase) missingRequirements.push("uppercase letter (A-Z)");
                    if (!hasLowercase) missingRequirements.push("lowercase letter (a-z)");
                    if (!hasNumber) missingRequirements.push("number (0-9)");
                    if (!hasSpecialChar) missingRequirements.push("special character (!@#$%^&*)");

                    if (missingRequirements.length > 0) {
                      return Promise.reject(new Error(`🛡️ Password is missing: ${missingRequirements.join(", ")}`));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
              help={
                <div className="text-xs text-gray-500 mt-1">
                  <div className="font-medium mb-1">Password must include:</div>
                  <div className="space-y-0.5">
                    <div>• At least 6 characters</div>
                    <div>• One uppercase letter (A-Z)</div>
                    <div>• One lowercase letter (a-z)</div>
                    <div>• One number (0-9)</div>
                    <div>• One special character (!@#$%^&*)</div>
                  </div>
                </div>
              }
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter password"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="text-sm font-medium text-gray-700">Confirm Password</span>}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm password"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="role"
            label={<span className="text-sm font-medium text-gray-700">Role</span>}
            initialValue="Moderator"
            rules={[{ required: true, message: "Please select role!" }]}
          >
            <Select className="rounded-lg" size="large" options={[{ value: "Moderator", label: "Moderator" }]} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddUserModal;
