import { Button, Form, Input } from "antd";
import { MdEmail, MdLock } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { AiOutlineNumber } from "react-icons/ai";
import { OTPProps } from "antd/es/input/OTP";

type ResetPasswordType = {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
};

const ResetPasswordPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values: ResetPasswordType) => {
    console.log("Received values:", values);
  };
  const onChange: OTPProps["onChange"] = (text) => {
    console.log("onChange:", text);
  };

  const onInput: OTPProps["onInput"] = (value) => {
    console.log("onInput:", value);
  };
  const sharedProps: OTPProps = {
    onChange,
    onInput,
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800 rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <Link
            to="/forgot-password/send-mail-otp"
            className="text-zinc-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
          >
            <IoMdArrowBack size={20} />
            <span>Back</span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-zinc-400">Please enter the OTP sent to your email and create a new password.</p>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="space-y-4">
          <Form.Item<ResetPasswordType>
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

          <Form.Item<ResetPasswordType>
            label={<span className="text-white">OTP Code</span>}
            name="otp"
            rules={[
              { required: true, message: "Please input the OTP!" },
              { len: 6, message: "OTP must be exactly 6 digits!" },
            ]}
          >
            <Input.OTP formatter={(str) => str.toUpperCase()} {...sharedProps} />
          </Form.Item>

          <Form.Item<ResetPasswordType>
            label={<span className="text-white">New Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password
              prefix={<MdLock className="text-zinc-400" />}
              size="large"
              placeholder="Enter new password"
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
            />
          </Form.Item>

          <Form.Item<ResetPasswordType>
            label={<span className="text-white">Confirm Password</span>}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
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
              prefix={<RiLockPasswordLine className="text-zinc-400" />}
              size="large"
              placeholder="Confirm new password"
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
        <div className="flex items-center justify-center gap-1 text-zinc-400 font-light">
          <span>Haven't received OTP yet ?</span>
          <Link to={`/forgot-password/send-mail-otp`} className="text-blue-400">
            Resend OTP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
