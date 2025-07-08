import FloatingContainer from "@/components/floating-container";
import IndieCat from "@/components/indie-cat";
import { Button } from "antd";
import blackhole from "@/assets/blackhole.webp";
import "@/styles/twinkling-stars.scss";
import logo from "@/assets/indiegamezone-logo.svg";
import satellite from "@/assets/satellite_dish_PNG39.png";
import tvStatic from "@/assets/tv-static.png";
import rocket from "@/assets/rocket.png";

export default function HeroBanner() {
  return (
    <section className="relative my-10">
      <img src={satellite} alt="" className="absolute w-32 -top-20 left-12" />
      <div className="py-6 px-6 grid grid-cols-2 bg-zinc-900 border border-zinc-700 gap-5 relative overflow-hidden">
        <div className="bg-zinc-800 rounded relative overflow-hidden ">
          <div className="twinkling-stars"></div>
          <div className="twinkling"></div>
          <div className="clouds"></div>
          <img
            src={logo}
            alt=""
            className="absolute left-10 top-28 z-[2] bg-zinc-900/50 rounded p-3"
          />
          <img
            src={blackhole}
            className="absolute -bottom-14 -left-7"
            width={350}
          />
          <FloatingContainer items={["🍙", <IndieCat />, "🧶"]} />
          <img
            src={tvStatic}
            alt=""
            className="pointer-events-none z-10 absolute top-0 left-0 h-full select-none"
          />
        </div>
        <div className="relative">
          <img
            src={rocket}
            alt=""
            className="absolute -bottom-14 -right-12 -z-0 select-none pointer-events-none"
            width={250}
          />
          <h1 className="text-4xl md:text-4xl font-bold mb-2">
            Share Your Indie Game with the World
          </h1>
          <p className="mb-8 font-mono pe-32">
            Join our platform, upload your game, and apply to be featured on the
            front page. Get discovered by thousands of players looking for the
            next hidden gem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="large" href="/sign-up">
              Sign Up & Upload Your Game
            </Button>
            {/* <Button href="/feature-request" size="large">
             Apply for Front Page Feature
          </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
