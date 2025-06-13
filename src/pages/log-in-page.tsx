import { Form, Input, Button, FormProps, Modal, Select, DatePicker } from "antd";
import logo from "@/assets/indiegamezone-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import background from "@/assets/wow-bg.jpg";
import googleIcon from "@/assets/google_icon.png";
import { useEffect, useState } from "react";
import { login, googleLogin } from "@/lib/api/auth-api";
import toast from "react-hot-toast";
import useAuthStore from "@/store/use-auth-store";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/api/config/firebase";
import dayjs from "dayjs";

type FieldType = {
  userNameOrEmail: string;
  password: string;
};

type GoogleFormType = {
  birthday: any;
  role: string;
};

const LogInPage = () => {
  const [form] = Form.useForm();
  const [googleForm] = Form.useForm();
  const [isSumitting, setIsSumitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleIdToken, setGoogleIdToken] = useState<string>("");
  const { fetchProfile } = useAuthStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSumitting(true);
    setError("");
    const result = await login(values);
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
      toast.success("Login successfully");
      fetchProfile();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleLoginGoogle = () => {
    setIsSumitting(true);
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const idToken = await result.user.getIdToken();
        
        console.log("Google login result:", result);
        console.log("ID Token:", idToken);
        
        // Vì backend yêu cầu birthday và role, ta sẽ luôn hiện modal
        // để user nhập thông tin. Nếu user đã tồn tại, backend sẽ handle việc update
        setGoogleIdToken(idToken);
        setIsGoogleModalOpen(true);
        setIsSumitting(false);
      })
      .catch((error) => {
        console.log("Google login error:", error);
        setIsSumitting(false);
        toast.error("Google login failed");
      });
  };

  const handleGoogleFormSubmit = async (values: GoogleFormType) => {
    setIsSumitting(true);
    
    const googleLoginData = {
      IdToken: googleIdToken,
      Birthday: values.birthday.format('YYYY-MM-DD'),
      Role: values.role
    };

    console.log("Sending Google login data:", googleLoginData); // Debug log

    const result = await googleLogin(googleLoginData);
    setIsSumitting(false);

    if (result.success) {
      localStorage.setItem("accessToken", result.data);
      toast.success("Login successfully");
      setIsGoogleModalOpen(false);
      fetchProfile();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      console.log("Google login error:", result); // Debug log
      if (result.data) {
        toast.error(result.data.detail || result.error);
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleModalCancel = () => {
    setIsGoogleModalOpen(false);
    setGoogleIdToken("");
    googleForm.resetFields();
  };

  return (
    <div className="grid grid-cols-2 h-screen bg-zinc-800">
      <div
        className="bg-cover bg-center rounded-2xl relative overflow-hidden drop-shadow-xl"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="absolute h-full w-full bg-zinc-950/50"></div>
        <Link to={"/"} className="right-7 absolute bottom-5">
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
        <div className="w-full max-w-md p-4 shadow-lg rounded-xl">
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
              <Link to={"/recover-password"} className="text-sx text-zinc-700">
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
            onClick={handleLoginGoogle}
            disabled={isSumitting}
          >
            <img src={googleIcon} alt="" className="size-4 me-2" />
            Log in with Google
          </Button>
        </div>
        <div className="text-center text-xs">
          Don't have an account?{" "}
          <Link to={"/sign-up"} className="text-blue-400">
            Sign up
          </Link>
        </div>
      </div>

      {/* Google Additional Info Modal */}
      <Modal
        title="Complete Your Profile"
        open={isGoogleModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnClose={true}
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
            rules={[
              { required: true, message: "Please select your birthday" }
            ]}
          >
            <DatePicker
              style={{ width: '100%', paddingBlock: 10 }}
              placeholder="Select your birthday"
              disabledDate={(current) => {
                return current && current > dayjs().endOf('day');
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold">Role</span>}
            name="role"
            rules={[
              { required: true, message: "Please select your role" }
            ]}
          >
            <Select
              placeholder="Select your role"
              style={{ height: 50 }}
              options={[
                { value: 'Player', label: 'Player' },
                { value: 'Developer', label: 'Developer' },
                { value: 'Publisher', label: 'Publisher' }
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isSumitting}
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