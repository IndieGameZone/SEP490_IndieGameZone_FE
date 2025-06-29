import { Button, Form, FormProps, Input, Spin, message } from "antd";
import { useEffect, useState } from "react";
import successIcon from "@/assets/checked.png";
import failIcon from "@/assets/cancel.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resendVerificationemail, verifyEmail } from "@/lib/api/auth-api";
type FieldType = {
  email: string;
};
const VerifyEmailPage = () => {
  const [status, setStatus] = useState("loading");
  const [isResending, setIsResending] = useState(false);
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  useEffect(() => {
    handleVerifyEmail();
  }, [searchParams]);

  const handleVerifyEmail = async () => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    if (!token || !userId) {
      navigate("/");
      return;
    }
    const result = await verifyEmail(token, userId);
    if (result.error) {
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsResending(true);
    const result = await resendVerificationemail(values.email);
    setIsResending(false);
    if (result.error) {
      messageApi.error("Failed to resend. Please try again later.");
    } else {
      messageApi.success("Verification email resent.");
    }
  };

  return (
    <div className="min-h-[70vh] flex justify-center items-center">
      {contextHolder}
      {status == "loading" && (
        <Spin tip="Verifying email" size="large">
          <div className="p-16 rounded bg-zinc-800 border-orange-500 border-2"></div>
        </Spin>
      )}
      {status == "success" && (
        <div className="py-10 px-20 rounded bg-zinc-800 flex flex-col items-center justify-center gap-2 border-orange-500 border-2">
          <img src={successIcon} alt="" className="size-16" />
          <p>Email Verified!</p>
          <Button onClick={() => navigate("/log-in")}>Go to Login</Button>
        </div>
      )}
      {status == "error" && (
        <div className="py-10 px-20 rounded bg-zinc-800 flex flex-col items-center justify-center gap-2 border-orange-500 border-2">
          <img src={failIcon} alt="" className="size-16" />
          <p className="text-center">
            The verification link may be
            <br /> invalid or expired.
          </p>
          <Form
            name="resent-verification-email-form"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your Email" },
                { type: "email", message: "Invalid email format!" },
              ]}
              style={{ marginBottom: 10, width: 300 }}
            >
              <Input placeholder="Email" style={{ paddingBlock: 10 }} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                htmlType="submit"
                loading={isResending}
                style={{ width: "100%" }}
              >
                Resend Verification Email
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
