import { Form, Input, Button, FormProps } from "antd";
import logo from "@/assets/indiegamezone-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import background from "@/assets/wow-bg.jpg";
import googleIcon from "@/assets/google_icon.png";
import { useEffect, useState } from "react";
import { login } from "@/lib/api/auth-api";
import toast from "react-hot-toast";
import useAuthStore from "@/store/use-auth-store";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/api/config/firebase";
type FieldType = {
  userNameOrEmail: string;
  password: string;
};

const LogInPage = () => {
  const [form] = Form.useForm();
  const [isSumitting, setIsSumitting] = useState(false);
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

  // const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
  //   errorInfo
  // ) => {
  //   console.log("Failed:", errorInfo);
  // };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, []);
  

  const handleLoginGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(result);
        
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
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
            // onFinishFailed={onFinishFailed}
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
    </div>
  );
};

export default LogInPage;
