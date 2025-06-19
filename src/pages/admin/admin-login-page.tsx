import { Form, Input, Button, FormProps } from "antd";
import logo from "@/assets/indiegamezone-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "@/assets/google_icon.png";
import { useEffect, useState } from "react";
import { login } from "@/lib/api/auth-api";
import toast from "react-hot-toast";
import useAuthStore from "@/store/use-auth-store";
type FieldType = {
  email: string;
  password: string;
};

const LoginAdminPage = () => {
  const [form] = Form.useForm();
  const [isSumitting, setIsSumitting] = useState(false);
  const { fetchProfile, profile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSumitting(true);
    setError("");
    const result = await login({
      userNameOrEmail: values.email,
      password: values.password,
    });
    setIsSumitting(false);
    if (result.error) {
      if (result.data) {
        toast.error(result.data.detail);
        setError(result.data.detail);
      } else {
        toast.error(result.error);
      }
    } else {
      localStorage.setItem("accessToken", result.data);
      fetchProfile();
    }
  };

  useEffect(() => {
    if (profile) {
      if (profile.role.name == "Admin") {
        toast.success("Login successfully");
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else if (profile.role.name == "Moderator") {
        toast.success("Login successfully");
        setTimeout(() => {
          navigate("/moderator");
        }, 1000);
      } else {
        setError("Your account does not have permission to access this system.")
        logout();
      }
    }
  }, [profile]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url("https://wallpaperaccess.com/full/1630679.png")`,
      }}
    >
      <div className="absolute inset-0 bg-zinc-950/60"></div>

      <div className="relative grid grid-cols-2 w-full min-h-screen z-10">
        <div className="w-full p-8 flex flex-col justify-center items-start text-white">
          <h1 className="text-4xl md:text-4xl font-semibold mb-4">
            Welcome to{" "}
          </h1>

          <div className="relative">
            <Link to={"/"} className="">
              <img src={logo} alt="" className="w-80" />
            </Link>
            <p className="font-bold absolute right-0 -bottom-5">
              Admin and Moderator
            </p>
          </div>
          <p className="text-lg font-mono text-center mt-6 bg-zinc-800/50">
            This is the login page for Admin and Moderator only.
          </p>
        </div>

        <div className="w-full flex justify-center items-center p-6 bg-zinc-800 rounded-l-2xl">
          <div className="w-full max-w-md p-4">
            <div className="text-center mb-6 text-5xl font-bold font-mono">
              Login
            </div>
            <Form
              layout="vertical"
              autoComplete="off"
              form={form}
              onFinish={onFinish}
            >
              <Form.Item
                label={<span className="font-bold">Email</span>}
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
                style={{ marginBottom: 10 }}
              >
                <Input
                  placeholder="Enter your email"
                  style={{ paddingBlock: 10 }}
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold">Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
                style={{ marginBottom: 2 }}
              >
                <Input.Password
                  placeholder="Enter your password"
                  style={{ paddingBlock: 10 }}
                />
              </Form.Item>
              <div className="flex justify-end">
                <Link
                  to={"/recover-password"}
                  className="text-sx text-zinc-700"
                >
                  Forgot your passsword?
                </Link>
              </div>

              <div className="mt-5">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{
                      paddingBlock: 20,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                    loading={isSumitting}
                  >
                    Log In
                  </Button>
                  {error && <p className="text-red-400">{error}</p>}
                </Form.Item>
              </div>
            </Form>
            <div className="flex justify-between gap-4 items-center">
              <div className="border border-zinc-500 flex-1"></div>
              <p className="text-xs">OR</p>
              <div className="border border-zinc-500 flex-1"></div>
            </div>
            <Button
              className="w-full mt-5"
              style={{
                paddingBlock: 20,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              <img src={googleIcon} alt="" className="size-4 me-2" />
              Log in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdminPage;
