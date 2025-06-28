import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import { Button, InputNumber, Modal, Tooltip } from "antd";
import Cookies from "js-cookie";
import { CSSProperties, useState } from "react";
import {
  FaAngleRight,
  FaApple,
  FaDownload,
  FaFileArchive,
  FaLinux,
  FaRegHeart,
  FaWallet,
  FaWindows,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const addPriceButtonStyle: CSSProperties = {
  background: "oklch(71.2% 0.194 13.428)",
  fontWeight: "bold",
};
const DownloadGameButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState(10_000);
  const { game } = useGameStore();
  const { getDefaultPlatforms } = usePlatformStore();
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const handleGoToDownloadPage = () => {
    if (game) navigate(`/download/${game.id}`);
  };

  const showModal = () => {
    // Developer will download their own game in dev page instead
    // Prevent developer to donate to themselve
    if (game && profile?.id == game.developer.id) {
      navigate(`/dev/game/${game.id}`);
      return;
    }

    if (game?.allowDonation) {
      setIsModalOpen(true);
    } else {
      handleGoToDownloadPage();
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (!game) return;
  const defaultPlatforms = getDefaultPlatforms();
  const handleAddPrice = (value: number) => {
    setPrice((prev) => {
      if (prev + value > 500_000) {
        return 500_000;
      } else {
        return prev + value;
      }
    });
  };
  const accessToken = localStorage.getItem("accessToken");

  const handleGoToLogin = () => {
    // Remember which page to come back after login
    Cookies.set("waiting-url", `/game/${game.id}`, {
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });
    navigate("/log-in");
  };

  return (
    <>
      <Button
        size="large"
        type="primary"
        icon={<FaDownload />}
        onClick={showModal}
      >
        Download Now
      </Button>
      <Modal
        title={<h3 className="text-xl">Download '{game.name}'</h3>}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<div></div>}
      >
        <p>
          This game is free but the developer accepts your support by letting
          you pay what you think is fair for the game.
        </p>
        <Button
          className="mt-2"
          icon={<FaAngleRight className="inline" />}
          onClick={handleGoToDownloadPage}
        >
          No thanks, just take me to the downloads
        </Button>
        <hr className="my-3 border-zinc-700" />
        <p className="text-center italic">included files</p>
        <div className="flex flex-col gap-2">
          {game.gamePlatforms?.map((file, index) => {
            return (
              <div
                key={`game-file-${index}`}
                className="flex gap-2 items-center"
              >
                {file.platform.id == defaultPlatforms.windowsPlatformId ? (
                  <FaWindows />
                ) : file.platform.id == defaultPlatforms.macOsPlatformId ? (
                  <FaApple />
                ) : file.platform.id == defaultPlatforms.linuxPlatformId ? (
                  <FaLinux />
                ) : (
                  <FaFileArchive />
                )}
                <span className="font-semibold max-w-50 text-ellipsis overflow-clip">
                  {file.displayName ? file.displayName : "unnamed file"}
                </span>
                <span className="text-sm text-zinc-400">
                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
            );
          })}
        </div>
        <hr className="my-3 border-zinc-700" />
        <div className="flex items-center gap-2 text-rose-400 font-semibold">
          <FaRegHeart className="inline" /> Support the developer with an
          additional contribution
        </div>
        <div className="mt-3">
          <InputNumber
            size="large"
            min={1000}
            max={500_000}
            step={1_000}
            onChange={(value) => setPrice(value ?? 0)}
            value={price}
            formatter={(value) =>
              `${value}  ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            style={{ width: "100%" }}
          />
          <div className="mt-3">
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => {
                handleAddPrice(10000);
              }}
              style={addPriceButtonStyle}
            >
              +10,000₫
            </Button>
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => {
                handleAddPrice(25000);
              }}
              style={addPriceButtonStyle}
            >
              +25,000₫
            </Button>
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => {
                handleAddPrice(50000);
              }}
              style={addPriceButtonStyle}
            >
              +50,000₫
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                handleAddPrice(100000);
              }}
              style={addPriceButtonStyle}
            >
              +100,000₫
            </Button>
          </div>
        </div>
        {accessToken ? (
          <>
            <Button
              size="large"
              style={{ marginTop: "1.5rem", marginRight: "0.5rem" }}
              type="primary"
            >
              Pay with <span className="font-bold">PayOS</span>
            </Button>
            <Button
              size="large"
              style={{ marginTop: "1.5rem" }}
              icon={<FaWallet />}
            >
              Pay with wallet
            </Button>
          </>
        ) : (
          <>
            <div onClick={handleGoToLogin} className="inline">
              <Tooltip title="Log in to continue">
                <Button
                  size="large"
                  style={{ marginTop: "1.5rem", marginRight: "0.5rem" }}
                  type="primary"
                  disabled
                >
                  Pay with <span className="font-bold">PayOS</span>
                </Button>
              </Tooltip>
            </div>

            <div onClick={handleGoToLogin} className="inline">
              <Tooltip title="Log in to continue">
                <Button
                  size="large"
                  style={{ marginTop: "1.5rem" }}
                  icon={<FaWallet />}
                  disabled
                >
                  Pay with wallet
                </Button>
              </Tooltip>
            </div>
          </>
        )}

        <p className="mt-2">
          By completing a payment you agree to our{" "}
          <Link to={"/terms-or-service"}>
            <span className="text-orange-500 hover:underline">
              Terms of Service
            </span>
          </Link>{" "}
          and{" "}
          <Link to={"/privacy-policy"}>
            <span className="text-orange-500 hover:underline">
              Privacy Policy
            </span>
          </Link>
          .
        </p>
      </Modal>
    </>
  );
};

export default DownloadGameButton;
