import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/indiegamezone-logo.svg";
import background from "@/assets/wow-bg.jpg";
import Cookies from "js-cookie";
import useAuthStore from "@/store/use-auth-store";
import LoginForm from "./log-in-form";
import GoogleLoginButton from "./google-login-button";
import GoogleProfileModal from "./google-profile-modal";

const LogInPage = () => {
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
    if (profile) {
      const waitingUrl = Cookies.get("waiting-url");
      Cookies.remove("waiting-url");
      const destination =
        profile.role.name === "Admin"
          ? "/admin"
          : profile.role.name === "Moderator"
          ? "/moderator"
          : waitingUrl || "/";
      setTimeout(() => navigate(destination), 1000);
    }
  }, [profile]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen bg-zinc-800">
      <div
        className="bg-cover bg-center rounded-2xl relative overflow-hidden drop-shadow-xl hidden lg:block"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute h-full w-full bg-zinc-950/50"></div>
        <Link to="/" className="right-7 absolute bottom-5">
          <img src={logo} alt="" className="w-40" />
        </Link>
        <div className="absolute top-52 w-2/3 left-7">
          <p className="font-extrabold text-5xl">Play Bold. Publish Free.</p>
          <p>
            Empowering developers to publish their vision, and players to find
            the next big thing before it goes mainstream.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center flex-col">
        <div className="w-full max-w-md p-4 rounded-xl">
          <img src={logo} alt="" className="mb-10" />
          <div className="flex items-center gap-3 -mt-8 mb-5 lg:hidden">
            <div className="border-b border-zinc-400 flex-1"></div>
            <p className="text-center text-sm italic text-zinc-400">
              Play Bold. Publish Free.
            </p>
            <div className="border-b border-zinc-400 flex-1"></div>
          </div>

          <LoginForm />
          <div className="flex justify-between gap-4 items-center mt-5">
            <div className="border border-zinc-500 flex-1"></div>
            <p className="text-xs">OR</p>
            <div className="border border-zinc-500 flex-1"></div>
          </div>
          <GoogleLoginButton
            onFirstTime={handleGoogleFirstTime}
            onSuccess={handleLoginSuccess}
          />
        </div>
        <div className="text-center text-xs mt-4">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-400">
            Sign up
          </Link>
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

export default LogInPage;
