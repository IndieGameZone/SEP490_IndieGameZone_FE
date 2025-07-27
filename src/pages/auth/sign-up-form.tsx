import { Form, Input, Button, Checkbox, Radio, DatePicker } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import { register } from "@/lib/api/auth-api";
import { useGlobalMessage } from "@/components/message-provider";

const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9]*/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]*$/;

const validateUsername = (_: any, value: any) =>
  !value || USERNAME_REGEX.test(value)
    ? Promise.resolve()
    : Promise.reject(
        new Error(
          "Username must contain only letters and numbers and must start with a letter."
        )
      );

const validatePassword = (_: any, value: any) =>
  !value || PASSWORD_REGEX.test(value)
    ? Promise.resolve()
    : Promise.reject(
        new Error(
          "Password must include uppercase, lowercase, number, and special character."
        )
      );

const SignUpForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const messageApi = useGlobalMessage();

  const onFinish = async (values: any) => {
    if (!acceptTerms) {
      messageApi.error("Please accept terms of service!");
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        email: values.email,
        userName: values.userName,
        birthday: values.birthday?.format("YYYY-MM-DD"),
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
      };

      const result = await register(registerData);

      if (result.success) {
        if (result.success) {
          messageApi.success(
            "Registration successful! Please check your email to verify your account."
          );
          form.resetFields();
          setTimeout(() => navigate("/log-in"), 1000);
        }
      } else {
        messageApi.error(result.error || "Registration failed!");
      }
    } catch {
      messageApi.error("An error occurred, please try again!");
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ role: "Player" }}
    >
      <Form.Item
        label={<span className="font-bold">User name</span>}
        name="userName"
        rules={[
          { required: true, message: "Please enter your user name" },
          { min: 5, message: "User name must be at least 5 characters" },
          { validator: validateUsername },
        ]}
        style={{ marginBottom: 10 }}
      >
        <Input
          placeholder="Enter your user name"
          style={{ paddingBlock: 10 }}
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-bold">Email</span>}
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Invalid email format!" },
        ]}
        style={{ marginBottom: 10 }}
      >
        <Input placeholder="Enter your email" style={{ paddingBlock: 10 }} />
      </Form.Item>

      <Form.Item
        label={<span className="font-bold">Birthday</span>}
        name="birthday"
        rules={[{ required: true, message: "Please select your birthday" }]}
        extra="DD-MM-YYYY"
        style={{ marginBottom: 10 }}
      >
        <DatePicker
          placeholder="Select your birthday"
          style={{ paddingBlock: 10, width: "100%" }}
          format="DD-MM-YYYY"
          disabledDate={(current) => current && current.isAfter(dayjs())}
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-bold">Password</span>}
        name="password"
        rules={[
          { required: true, message: "Please enter your password" },
          { min: 6, message: "Password must be at least 6 characters" },
          { validator: validatePassword },
        ]}
        style={{ marginBottom: 10 }}
      >
        <Input.Password
          placeholder="Enter your password"
          style={{ paddingBlock: 10 }}
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-bold">Confirm Password</span>}
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password" },
          validateConfirmPassword,
        ]}
        style={{ marginBottom: 10 }}
      >
        <Input.Password
          placeholder="Confirm your password"
          style={{ paddingBlock: 10 }}
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-bold">Account Type</span>}
        name="role"
        rules={[{ required: true, message: "Please choose a role" }]}
        style={{ marginBottom: 10 }}
      >
        <div className="flex justify-center">
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio.Button
              value="Player"
              style={{ width: 120, textAlign: "center" }}
            >
              Player
            </Radio.Button>
            <Radio.Button
              value="Developer"
              style={{ width: 120, textAlign: "center" }}
            >
              Developer
            </Radio.Button>
          </Radio.Group>
        </div>
      </Form.Item>

      <Checkbox
        onChange={(e) => setAcceptTerms(e.target.checked)}
        checked={acceptTerms}
        style={{ paddingBlock: "8px" }}
      >
        I accept the{" "}
        <Link to="">
          <span className="text-red-400 underline">Terms of Service</span>
        </Link>
      </Checkbox>

      <Form.Item className="mt-5">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          disabled={!acceptTerms}
          style={{
            paddingBlock: 20,
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {loading ? "Registering..." : "Sign Up"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
