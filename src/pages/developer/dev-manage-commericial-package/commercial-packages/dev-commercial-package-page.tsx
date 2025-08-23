import Loader from "@/components/loader";
import useCommericalPackageStore from "@/store/use-commercial-package-store";
import { useEffect } from "react";
import PackageCard from "./package-card";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import previewBanner from "@/assets/banner-preview.svg";
import { Collapse, CollapseProps } from "antd";

const items: CollapseProps["items"] = [
  {
    key: "collapse-homepage-banner",
    label: <div className="font-bold">Homepage Banner Spot</div>,
    children: (
      <div>
        <div className="flex gap-2 items-center">
          <FaStar className="size-4" />
          <h2 className="text-xl font-bold my-3">Homepage Banner Spot</h2>
        </div>
        <img src={previewBanner} alt="" className="w-full mb-2" />
        <ul className="list-disc ps-4">
          <li>
            Your game will appear in the rotating top banner on the homepage.
          </li>
          <li>
            Banner includes your game's cover image, title and screenshots.
          </li>
        </ul>
      </div>
    ),
  },
  {
    key: "collapse-featured-game",
    label: <div className="font-bold">Featured Game Listing</div>,
    children: (
      <div>
        <div className="flex gap-2 items-center">
          <FaStar className="size-4" />
          <h2 className="text-xl font-bold my-3">Featured Game Listing</h2>
        </div>

        <ul className="list-disc ps-4">
          <li>
            Your game will be highlighted in the “Featured Games” section.
          </li>
          <li>Prioritized in discovery algorithms and search listings.</li>
          <li>Visible to all visitors on web and mobile platforms.</li>
        </ul>
      </div>
    ),
  },
];

const DevCommercialPackagePage = () => {
  const { loading, fetchCommercialPackages, commercialPackages } =
    useCommericalPackageStore();
  useEffect(() => {
    fetchCommercialPackages();
  }, []);
  if (loading) return <Loader />;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Commercial Promotion Package</h1>
      <p className="text-zinc-500">Homepage Banner & Featured Game</p>
      <hr className="my-3 border-zinc-500" />
      <p className="text-xl font-bold my-2 italic">Welcome, Game Developer!</p>
      <p>
        We're excited to offer you the opportunity to{" "}
        <span className="font-bold text-orange-500">
          boost your game's visibility
        </span>{" "}
        with our Commercial Promotion Package. This premium package enables your
        game to be prominently displayed on our{" "}
        <span className="font-bold">
          Homepage Banner and Featured Games section{" "}
          <FaStar className="inline" />
        </span>{" "}
        —{" "}
        <span className="font-bold">
          increasing reach, discoverability, and sales{" "}
          <FaArrowTrendUp className="inline" />.
        </span>
      </p>
      <div className="py-3">
        <Collapse items={items} />
      </div>
      <hr className="my-3 border-zinc-500" />
      <h1 className="text-2xl font-bold">
        <FiPackage className="inline" /> Package Options & Duration
      </h1>
      <p className="text-zinc-500 text-sm italic">
        Prices are subject to change based on seasonality and traffic volume.
      </p>
      <div className="grid grid-cols-3 gap-3 py-5">
        {commercialPackages.map((p) => {
          return <PackageCard key={p.id} data={p} />;
        })}
      </div>
    </div>
  );
};

export default DevCommercialPackagePage;
