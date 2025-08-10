import { useGlobalMessage } from "@/components/message-provider";
import { MAX_DONATION } from "@/constants/game";
import { donateGame } from "@/lib/api/payment-api";
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
import { Link, Navigate, useNavigate } from "react-router-dom";

const addPriceButtonStyle: CSSProperties = {
  background: "oklch(71.2% 0.194 13.428)",
  fontWeight: "bold",
};

const DownloadGameButton = ({ isGameOwned }: { isGameOwned: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState(10000); 
  const { game } = useGameStore();
  const { getDefaultPlatforms } = usePlatformStore();
  const navigate = useNavigate();
  const { loading: loadingProfile, profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const messageApi = useGlobalMessage();

  const handleGoToDownloadPage = () => {
    if (game) navigate(`/download/${game.id}`);
  };

  const showModal = () => {
    if (!profile && !loadingProfile) {
      messageApi.info("Please log in to download game!");
      handleGoToLogin();
      return;
    }
    if (game && profile?.id === game.developer.id) {
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

  if (!game) return null;

  const defaultPlatforms = getDefaultPlatforms();

  const handleAddPrice = (value: number) => {
    setPrice((prev) => {
      if (prev + value > MAX_DONATION) {
        return MAX_DONATION;
      }
      return prev + value;
    });
  };

  const handleGoToLogin = () => {
    Cookies.set("waiting-url", `/game/${game.id}`, {
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });
    navigate("/log-in");
  };

  const handleWalletDonate = async () => {
    if (!profile?.id || !game?.id) {
      messageApi.error("User or game information is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await donateGame(profile.id, game.id, { Amount: price, PaymentMethod: "Wallet" });
      if (response.success) {
        messageApi.success("Donation successful!");
        <Navigate to={"/account/transaction-history"} />;
        handleCancel();
      } else {
        messageApi.error(response.error || "Failed to process donation.");
      }
    } catch (err) {
      messageApi.error("An unexpected error occurred during donation.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayOsDonate = async () => {
    if (!profile?.id || !game?.id) {
      messageApi.error("User or game information is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await donateGame(profile.id, game.id, { Amount: price, PaymentMethod: "PayOS" });
      if (response.success) {
        if (response.data) {
          window.open(response.data, "_blank");
          messageApi.success("Redirecting to payment page...");
          <Navigate to={"/account/transaction-history"} />;
        } else {
          messageApi.error("Payment URL not received");
        }
      } else {
        messageApi.error(response.error || "Failed to process donation.");
      }
    } catch (err) {
      messageApi.error("An unexpected error occurred during donation.");
    } finally {
      setLoading(false);
    }
  };

  const activeFiles = game.gamePlatforms.filter((x) => x.isActive);

  return (
    <>
      <Button size="large" type="primary" icon={<FaDownload />} onClick={showModal}>
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
          {isGameOwned ? "You already bought this game" : "This game is free"} but the developer accepts your support by
          letting you pay what you think is fair for the game.
        </p>
        <Button className="mt-2" icon={<FaAngleRight className="inline" />} onClick={handleGoToDownloadPage}>
          No thanks, just take me to the downloads
        </Button>
        {activeFiles.length > 0 && (
          <>
            <hr className="my-3 border-zinc-700" />
            <p className="text-center italic">included files</p>
            <div className="flex flex-col gap-2">
              {activeFiles.map((file, index) => {
                return (
                  <div key={`game-file-${index}`} className="flex gap-2 items-center">
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
                    <span className="text-sm text-zinc-400">({file.size.toFixed(1)} MB)</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <hr className="my-3 border-zinc-700" />
        <div className="flex items-center gap-2 text-rose-400 font-semibold">
          <FaRegHeart className="inline" /> Support the developer with an additional contribution
        </div>
        <div className="mt-3">
          <InputNumber
            size="large"
            min={1000}
            max={MAX_DONATION}
            step={1000}
            onChange={(value) => setPrice(value ?? 0)}
            value={price}
            formatter={(value) => `${value} ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            style={{ width: "100%" }}
          />
          <div className="mt-3">
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => handleAddPrice(10000)}
              style={addPriceButtonStyle}
            >
              +10.000₫
            </Button>
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => handleAddPrice(25000)}
              style={addPriceButtonStyle}
            >
              +25.000₫
            </Button>
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => handleAddPrice(50000)}
              style={addPriceButtonStyle}
            >
              +50.000₫
            </Button>
            <Button type="primary" size="small" onClick={() => handleAddPrice(100000)} style={addPriceButtonStyle}>
              +100.000₫
            </Button>
          </div>
        </div>
        {accessToken ? (
          <>
            <Button
              size="large"
              style={{ marginTop: "1.5rem", marginRight: "0.5rem" }}
              type="primary"
              onClick={handlePayOsDonate}
              loading={loading}
            >
              Pay with <span className="font-bold">PayOS</span>
            </Button>
            {profile?.role?.name === "Developer" && (
              <Button size="large" onClick={handleWalletDonate} style={{ marginTop: "1.5rem" }} icon={<FaWallet />}>
                Pay with wallet
              </Button>
            )}
          </>
        ) : (
          <>
            <div onClick={handleGoToLogin} className="inline">
              <Tooltip title="Log in to continue">
                <Button size="large" style={{ marginTop: "1.5rem", marginRight: "0.5rem" }} type="primary" disabled>
                  Pay with <span className="font-bold">PayOS</span>
                </Button>
              </Tooltip>
            </div>
            <div onClick={handleGoToLogin} className="inline">
              <Tooltip title="Log in to continue">
                <Button size="large" style={{ marginTop: "1.5rem" }} icon={<FaWallet />} disabled>
                  Pay with wallet
                </Button>
              </Tooltip>
            </div>
          </>
        )}
        <p className="mt-2">
          By completing a payment you agree to our{" "}
          <Link to={"/terms-or-service"}>
            <span className="text-orange-500 hover:underline">Terms of Service</span>
          </Link>{" "}
          and{" "}
          <Link to={"/privacy-policy"}>
            <span className="text-orange-500 hover:underline">Privacy Policy</span>
          </Link>
          .
        </p>
      </Modal>
    </>
  );
};

export default DownloadGameButton;
