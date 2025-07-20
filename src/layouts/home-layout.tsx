import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import { ReactNode } from "react";
import background from "@/assets/video_game_background.svg";
import styles from "@/styles/home-layout.module.css";
import AppTheme from "@/components/app-theme";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppTheme>
      <div
        className={`min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 to-zinc-950 ${styles.darkTable}`}
      >
        <Navbar />
        <div
          className="flex-1"
          style={{ backgroundImage: `url(${background})` }}
        >
          {children}
        </div>
        <Footer />
      </div>
    </AppTheme>
  );
};

export default HomeLayout;
