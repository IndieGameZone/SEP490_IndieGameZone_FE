import { MAX_DONATION } from "@/constants/game";
import { formatCurrencyVND } from "@/lib/currency";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import { Button, InputNumber, message, Modal, Tooltip } from "antd";
import Cookies from "js-cookie";
import { CSSProperties, useEffect, useState } from "react";
import { FaApple, FaFileArchive, FaLinux, FaRegHeart, FaShoppingCart, FaWallet, FaWindows } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PayWithWalletButton from "./pay-with-wallet-button";
import { formatMegabytes } from "@/lib/file";
import { purchaseGame } from "@/lib/api/payment-api";

const addPriceButtonStyle: CSSProperties = {
  background: "oklch(71.2% 0.194 13.428)",
  fontWeight: "bold",
};

const BuyGameButton = () => {
  const { game } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState(game?.price ?? 10_000);
  const { getDefaultPlatforms } = usePlatformStore();
  const navigate = useNavigate();
  const { profile, fetchProfile } = useAuthStore();
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, []);

  const showModal = () => {
    if (game && profile?.id === game.developer.id) {
      navigate(`/dev/game/${game.id}`);
      return;
    }
    setIsModalOpen(true);
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
    setPrice((prev) => (prev + value > game.price + MAX_DONATION ? game.price + MAX_DONATION : prev + value));
  };
  const handleGoToDownloadPage = () => {
    if (game) navigate(`/download/${game.id}`);
  };
  const handleGoToLogin = () => {
    Cookies.set("waiting-url", `/game/${game.id}`, {
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });
    navigate("/log-in");
  };

  const userId = profile?.id || "";
  const gameId = game.id || "";

  const activeFiles = game.gamePlatforms.filter((x) => x.isActive);
  const handleBuyGameWithPayos = async () => {
    if (!profile?.id || !game?.id) {
      message.error("User or game information is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await purchaseGame(profile.id, game.id, price, undefined, "PayOS");
      if (response.success) {
        message.success("Purchase Game successful! Redirecting to download page...");
        window.open(response.data);
        handleGoToDownloadPage();
      } else {
        message.error(response.error || "Failed to process donation.");
      }
    } catch (err) {
      message.error("An unexpected error occurred during donation.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button size="large" type="primary" icon={<FaShoppingCart />} onClick={showModal}>
        Buy Now
      </Button>

      <Modal
        title={<h3 className="text-xl">Buy '{game.name}'</h3>}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<div></div>}
      >
        <p>
          Download this game by purchasing it for <span className="font-semibold">{formatCurrencyVND(game.price)}</span>{" "}
          or more.
        </p>
        <InputNumber
          size="large"
          min={game.price}
          max={MAX_DONATION + game.price}
          step={1_000}
          onChange={(value) => setPrice(value ?? 0)}
          value={price}
          formatter={(value) => `${value}  ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
        {price > game.price && (
          <p className="text-sm mt-1">
            You will donate <span className="font-semibold text-rose-400">{formatCurrencyVND(price - game.price)}</span>{" "}
            to <span className="font-semibold">{game.developer.userName}</span>
          </p>
        )}
        {activeFiles.length > 0 && (
          <>
            <hr className="my-3 border-zinc-700" />
            <p className="text-center italic">included files</p>
            <div className="flex flex-col gap-2">
              {activeFiles.map((file, index) => (
                <div key={`game-file-${index}`} className="flex p-1 gap-2 items-center">
                  {file.platform.id === defaultPlatforms.windowsPlatformId ? (
                    <FaWindows />
                  ) : file.platform.id === defaultPlatforms.macOsPlatformId ? (
                    <FaApple />
                  ) : file.platform.id === defaultPlatforms.linuxPlatformId ? (
                    <FaLinux />
                  ) : (
                    <FaFileArchive />
                  )}
                  <span className="font-semibold">
                    {file.displayName || "unnamed file"}&nbsp;
                    <span className="text-sm text-zinc-400">({formatMegabytes(file.size)})</span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        <hr className="my-3 border-zinc-700" />
        <div className="flex items-center gap-2 text-rose-400 font-semibold">
          <FaRegHeart className="inline" /> Support the developer with an additional contribution
        </div>
        <div className="mt-3">
          <div className="mt-3">
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => handleAddPrice(10_000)}
              style={addPriceButtonStyle}
            >
              +10.000₫
            </Button>
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => handleAddPrice(25_000)}
              style={addPriceButtonStyle}
            >
              +25.000₫
            </Button>
            <Button
              type="primary"
              size="small"
              className="me-2"
              onClick={() => handleAddPrice(50_000)}
              style={addPriceButtonStyle}
            >
              +50.000₫
            </Button>
            <Button type="primary" size="small" onClick={() => handleAddPrice(100_000)} style={addPriceButtonStyle}>
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
              onClick={handleBuyGameWithPayos}
              loading={loading}
            >
              Pay with <span className="font-bold">PayOS</span>
            </Button>
            <PayWithWalletButton amount={price} userId={userId} gameId={gameId} />
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
          <Link to="/terms-or-service">
            <span className="text-orange-500 hover:underline">Terms of Service</span>
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy">
            <span className="text-orange-500 hover:underline">Privacy Policy</span>
          </Link>
          .
        </p>
      </Modal>
    </>
  );
};

export default BuyGameButton;
