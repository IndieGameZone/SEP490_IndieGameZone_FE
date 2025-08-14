import { Button, Form, Input } from "antd";
import { MdEmail } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { ForgetPassword } from "@/types/auth";
import { useState } from "react";
import { useGlobalMessage } from "@/components/message-provider";
import { sendOtpResetPassword } from "@/lib/api/auth-api";

const SendMailOtpPage = () => {
  const [form] = Form.useForm<ForgetPassword>();
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const navigate = useNavigate();

  const handleSubmit = async (values: ForgetPassword) => {
    try {
      setLoading(true);
      const result = await sendOtpResetPassword({ email: values.email });

      if (result.success) {
        messageApi.success("OTP sent successfully! Please check your mail");
        form.resetFields();
        navigate(`/forgot-password/reset-password`);
      } else {
        messageApi.error(result.error || "Failed to send OTP");
      }
    } catch (error) {
      messageApi.error("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800 rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <Link to="/log-in" className="text-zinc-400 hover:text-white flex items-center gap-2 mb-4">
            <IoMdArrowBack size={20} />
            <span>Back to Login</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-zinc-400">Enter your email address and we'll send you an OTP to reset your password.</p>
        </div>

        <Form form={form} layout="vertical" requiredMark={false} className="space-y-4" onFinish={handleSubmit}>
          <Form.Item
            label={<span className="text-white">Email Address</span>}
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MdEmail className="text-zinc-400" />}
              size="large"
              placeholder="Enter your email"
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SendMailOtpPage;
