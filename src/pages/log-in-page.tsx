import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  DatePicker,
  FormProps,
} from "antd";
import logo from "@/assets/indiegamezone-logo.svg";
import background from "@/assets/wow-bg.jpg";
import googleIcon from "@/assets/google_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  login,
  googleLogin,
  checkFirstLogin,
  prepareGoogleLoginData,
  prepareCheckFirstData,
} from "@/lib/api/auth-api";
import toast from "react-hot-toast";
import useAuthStore from "@/store/use-auth-store";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/api/config/firebase";
import dayjs from "dayjs";
import Cookies from "js-cookie";

type RoleEnum = "Player" | "Developer";

type FieldType = {
  userNameOrEmail: string;
  password: string;
};

type GoogleFormType = {
  birthday: dayjs.Dayjs;
  role: RoleEnum;
};

const LogInPage = () => {
  const [form] = Form.useForm();
  const [googleForm] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleIdToken, setGoogleIdToken] = useState<string>("");
  const { fetchProfile, profile } = useAuthStore();
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) navigate("/");
  }, []);

  const handleLoginGoogle = async () => {
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      setGoogleIdToken(idToken);

      const checkResult = await checkFirstLogin(prepareCheckFirstData(idToken));

      if (
        checkResult.success &&
        checkResult.data &&
        typeof checkResult.data.isFirstTime === "boolean"
      ) {
        if (checkResult.data.isFirstTime) {
          setIsGoogleModalOpen(true);
        } else {
          const loginResult = await googleLogin(
            prepareGoogleLoginData(idToken, {})
          );
          if (loginResult.success) {
            localStorage.setItem(
              "accessToken",
              checkResult.data.accessToken || loginResult.data
            );
            toast.success("Login successfully");
            fetchProfile();
            setTimeout(() => navigate("/"), 1000);
          } else {
            toast.error(loginResult.data?.detail || loginResult.error);
          }
        }
      } else {
        toast.error("Failed to check first login status");
      }
    } catch (error) {
      toast.error("Google login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleFormSubmit = async (values: GoogleFormType) => {
    setIsSubmitting(true);
    const googleLoginData = prepareGoogleLoginData(googleIdToken, values);
    const result = await googleLogin(googleLoginData);
    setIsSubmitting(false);

    if (result.success) {
      localStorage.setItem("accessToken", result.data);
      toast.success("Login successfully");
      setIsGoogleModalOpen(false);
      fetchProfile();
    } else {
      toast.error(result.data?.detail || result.error);
    }
  };

  const handleModalCancel = () => {
    setIsGoogleModalOpen(false);
    setGoogleIdToken("");
    googleForm.resetFields();
  };

  useEffect(() => {
    if (profile) {
      const waitingUrl = Cookies.get("waiting-url");
      if (waitingUrl) {
        Cookies.remove("waiting-url");
        setTimeout(() => {
          navigate(waitingUrl);
        }, 1000);
        return;
      }
      if (profile.role.name == "Admin") {
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else if (profile.role.name == "Moderator") {
        setTimeout(() => {
          navigate("/moderator");
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    }
  }, [profile]);

  return (
    <div className="grid grid-cols-2 h-screen bg-zinc-800">
      <div
        className="bg-cover bg-center rounded-2xl relative overflow-hidden drop-shadow-xl"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute h-full w-full bg-zinc-950/50"></div>
        <Link to="/" className="right-7 absolute bottom-5">
          <img src={logo} alt="" className="w-40" />
        </Link>
        <div className="absolute top-52 w-2/3 left-7">
          <p className="font-extrabold text-5xl">Play Bold. Publish Free.</p>
          <p className="">
            Empowering developers to publish their vision, and players to find
            the next big thing before it goes mainstream.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center flex-col">
        <div className="w-full max-w-md p-4 rounded-xl">
          <img src={logo} alt="" className="mb-10" />
          <Form
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label={<span className="font-bold">Email or username</span>}
              name="userNameOrEmail"
              rules={[
                {
                  required: true,
                  message: "Please enter your email or username",
                },
              ]}
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
          <div className="flex justify-between gap-4 items-center mt-5">
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
            onClick={handleLoginGoogle}
            disabled={isSubmitting}
          >
            <img src={googleIcon} alt="" className="size-4 me-2" />
            Log in with Google
          </Button>
        </div>
        <div className="text-center text-xs mt-4">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-400">
            Sign up
          </Link>
        </div>
      </div>

      <Modal
        title="Complete Your Profile"
        open={isGoogleModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnHidden={true}
      >
        <p className="mb-4 text-gray-600">
          Please provide additional information to complete your registration.
        </p>
        <Form
          form={googleForm}
          layout="vertical"
          onFinish={handleGoogleFormSubmit}
        >
          <Form.Item
            label={<span className="font-bold">Birthday</span>}
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
            label={<span className="font-bold">Role</span>}
            name="role"
            rules={[{ required: true, message: "Please select your role" }]}
          >
            <Select
              placeholder="Select your role"
              style={{ height: 50 }}
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
    </div>
  );
};

export default LogInPage;
