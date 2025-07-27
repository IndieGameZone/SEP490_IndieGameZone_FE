import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/indiegamezone-logo.svg";
import background from "@/assets/videogame-bg.jpg";
import useAuthStore from "@/store/use-auth-store";
import SignUpForm from "./sign-up-form";
import GoogleLoginButton from "./google-login-button";
import GoogleProfileModal from "./google-profile-modal";
import Cookies from "js-cookie";

const SignUpPage = () => {
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleToken, setGoogleToken] = useState("");
  const { fetchProfile, profile } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleFirstTime = (token: string) => {
    setGoogleToken(token);
    setIsGoogleModalOpen(true);
  };

  const handleLoginSuccess = () => {
    fetchProfile();
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (profile) {
      const waitingUrl = Cookies.get("waiting-url");
      Cookies.remove("waiting-url");
      const destination = waitingUrl || "/";
      setTimeout(() => navigate(destination), 1000);
    }
  }, [profile]);

  return (
    <div
      className="h-screen relative bg-zinc-800 bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="fixed h-full w-full bg-zinc-950/50"></div>
      <Link to="/" className="right-7 fixed bottom-5 z-50">
        <img src={logo} alt="Logo" className="w-40" />
      </Link>

      <div className="flex justify-center items-center min-h-screen py-5">
        <div className="overflow-auto bg-zinc-800 px-10 py-5 rounded-2xl z-10 w-full max-w-md drop-shadow-xl">
          <h1 className="text-4xl font-bold font-mono text-center my-10">
            Sign Up
          </h1>

          <SignUpForm />

          <div className="flex justify-between gap-4 items-center">
            <div className="border border-zinc-500 flex-1"></div>
            <p className="text-xs">OR</p>
            <div className="border border-zinc-500 flex-1"></div>
          </div>

          <GoogleLoginButton
            onFirstTime={handleGoogleFirstTime}
            onSuccess={handleLoginSuccess}
          />

          <div className="text-center text-xs mt-3">
            Already have an account?{" "}
            <Link to="/log-in" className="text-blue-400">
              Login
            </Link>
          </div>
        </div>
      </div>

      <GoogleProfileModal
        open={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        token={googleToken}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default SignUpPage;
