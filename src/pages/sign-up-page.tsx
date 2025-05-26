import { Form, Input, Button, Checkbox, CheckboxProps, Radio, DatePicker, message } from "antd";
import logo from "@/assets/indiegamezone-logo.svg";
import googleIcon from "@/assets/google_icon.png";
import background from "@/assets/videogame-bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "@/lib/api/auth-api";

const SignUpPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const onChange: CheckboxProps["onChange"] = (e) => {
    setAcceptTerms(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };

  const onFinish = async (values: any) => {
    if (!acceptTerms) {
      message.error("Please accept terms of service!");
      return;
    }

    setLoading(true);
    
    try {
      const registerData = {
        email: values.email,
        userName: values.userName,
        birthday: values.birthday?.format('YYYY-MM-DD'),
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role
      };

      const result = await register(registerData);
      
      if (result.success) {
        message.success("Registration successful!");
        form.resetFields();
        navigate("/log-in");
      } else {
        message.error(result.error || "Registration failed!");
      }
    } catch (error) {
      message.error("An error occurred, please try again!");
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Passwords do not match!'));
    },
  });

  return (
    <div className="h-screen bg-zinc-800">
      <div
        className="bg-cover bg-center relative overflow-hidden drop-shadow-xl flex justify-center items-center min-h-screen"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="absolute h-full w-full bg-zinc-950/50"></div>
        <Link to={"/"} className="right-7 absolute bottom-5">
          <img src={logo} alt="" className="w-40" />
        </Link>
        <div className="flex items-center justify-center overflow-auto bg-zinc-800 px-10 py-5 rounded-2xl z-10">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-10 px-30">
              <span className="text-4xl font-bold font-mono mt-5">Sign Up</span>
            </div>
            <Form 
              form={form}
              layout="vertical" 
              autoComplete="off"
              onFinish={onFinish}
              initialValues={{ role: 'Player' }}
            >
              <Form.Item
                label={<span className="font-bold">User Name</span>}
                name="userName"
                rules={[
                  { required: true, message: "Please enter your user name" },
                  { min: 3, message: "User name must be at least 3 characters" }
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input placeholder="Enter your user name" style={{ paddingBlock: 10 }} />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold">Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Please enter your Email" },
                  { type: 'email', message: "Invalid email format!" }
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input placeholder="Enter your Email" style={{ paddingBlock: 10 }} />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold">Birthday</span>}
                name="birthday"
                rules={[{ required: true, message: "Please select your birthday" }]}
                style={{ marginBottom: 10 }}
              >
                <DatePicker
                  placeholder="Select your birthday"
                  style={{ paddingBlock: 10, width: "100%" }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current.isAfter(new Date())}
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold">Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" }
                ]}
                style={{ marginBottom: 2 }}
              >
                <Input.Password placeholder="Enter your password" style={{ paddingBlock: 10 }} />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold">Confirm Password</span>}
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  validateConfirmPassword
                ]}
                style={{ marginTop: 4 }}
              >
                <Input.Password placeholder="Confirm your password" style={{ paddingBlock: 10 }} />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold">Account Type</span>}
                name="role"
                rules={[{ required: true, message: "Please choose role" }]}
                style={{ marginTop: 4 }}
              >
                <div className="flex justify-center">
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    style={{ display: "flex" }}
                  >
                    <Radio.Button style={{ width: 120, textAlign: "center" }} value="Player">
                      Player
                    </Radio.Button>
                    <Radio.Button style={{ width: 120, textAlign: "center" }} value="Developer">
                      Developer
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </Form.Item>

              <div className="flex py-2">
                <Checkbox onChange={onChange} checked={acceptTerms}>
                  I accept the{" "}
                  <Link to={""}>
                    <span className="text-red-400 underline">Terms of Service</span>
                  </Link>
                </Checkbox>
              </div>

              <div className="mt-5">
                <Form.Item>
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
              Sign in with Google
            </Button>

            <div className="text-center text-xs mt-3">
              Already have an account?{" "}
              <Link to={"/log-in"} className="text-blue-400">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;