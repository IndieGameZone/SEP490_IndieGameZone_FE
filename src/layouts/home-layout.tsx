import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ReactNode, useEffect } from "react";
import background from "@/assets/video_game_background.svg";
import { ConfigProvider, theme } from "antd";
import styles from "@/styles/home-layout.module.css";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    document.body.classList.add("dark");
  }, []);
 
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#FF6600",
          borderRadius: 2,
          colorLink: "#FFF",
        },
      }}
    >
      <div className={`min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 to-zinc-950 ${styles.darkTable}`}>
        <Navbar />
        <div
          className="flex-1"
          style={{ backgroundImage: `url(${background})` }}
        >
          {children}
        </div>
        <Footer />
      </div>
    </ConfigProvider>
  );
};

export default HomeLayout;
