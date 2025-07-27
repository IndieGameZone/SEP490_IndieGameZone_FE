import { Button } from "antd";
import googleIcon from "@/assets/google_icon.png";
import { auth, googleProvider } from "@/lib/api/config/firebase";
import { signInWithPopup } from "firebase/auth";
import {
  googleLogin,
  checkFirstLogin,
  prepareGoogleLoginData,
  prepareCheckFirstData,
} from "@/lib/api/auth-api";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  onFirstTime: (idToken: string) => void;
  onSuccess: () => void;
};

const GoogleLoginButton = ({ onFirstTime, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginGoogle = async () => {
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const checkResult = await checkFirstLogin(prepareCheckFirstData(idToken));

      if (checkResult.success && typeof checkResult.data?.isFirstTime === "boolean") {
        if (checkResult.data.isFirstTime) {
          onFirstTime(idToken);
        } else {
          const loginResult = await googleLogin(prepareGoogleLoginData(idToken, {}));
          if (loginResult.success) {
            localStorage.setItem("accessToken", loginResult.data);
            toast.success("Login successfully");
            onSuccess();
          } else {
            toast.error(loginResult.data?.detail || loginResult.error);
          }
        }
      } else {
        toast.error("Failed to check first login status");
      }
    } catch {
      toast.error("Google login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      className="w-full mt-5"
      onClick={handleLoginGoogle}
      loading={isSubmitting}
      style={{
        paddingBlock: 20,
        fontWeight: "bold",
        textTransform: "uppercase",
      }}
    >
      <img src={googleIcon} alt="" className="size-4 me-2" />
      Log in with Google
    </Button>
  );
};

export default GoogleLoginButton;
