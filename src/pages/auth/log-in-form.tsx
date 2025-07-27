import { Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FormProps } from "antd";
import { login } from "@/lib/api/auth-api";
import useAuthStore from "@/store/use-auth-store";
import toast from "react-hot-toast";

type FieldType = {
  userNameOrEmail: string;
  password: string;
};

const LoginForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchProfile } = useAuthStore();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmitting(true);
    const result = await login(values);
    setIsSubmitting(false);
    if (result.error) {
      toast.error(result.data?.detail || result.error);
    } else {
      localStorage.setItem("accessToken", result.data);
      toast.success("Login successfully");
      fetchProfile();
    }
  };

  return (
    <Form layout="vertical" autoComplete="off" onFinish={onFinish} form={form}>
      <Form.Item
        label={<span className="font-bold">Email or username</span>}
        name="userNameOrEmail"
        rules={[
          { required: true, message: "Please enter your email or username" },
        ]}
      >
        <Input placeholder="Enter your email" style={{ paddingBlock: 10 }} />
      </Form.Item>

      <Form.Item
        label={<span className="font-bold">Password</span>}
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password
          placeholder="Enter your password"
          style={{ paddingBlock: 10 }}
        />
      </Form.Item>

      <div className="flex justify-end">
        <Link to="/recover-password" className="text-xs text-zinc-700">
          Forgot your password?
        </Link>
      </div>

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
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
