import {
  getCommercialPackageById,
  getUnavailableDates,
} from "@/lib/api/commercial-package-api";
import { formatCurrencyVND } from "@/lib/currency";
import { CommercialPackage } from "@/types/commercial-package";
import { Alert, Button, message } from "antd";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SelectGameInput from "./select-game-input";
import { Game } from "@/types/game";
import { getGameById } from "@/lib/api/game-api";
import Loader from "@/components/loader";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import CommercialPackageCalendar from "./commercial-package-calendar";
import { formatDate } from "@/lib/date-n-time";
import { purchaseCommercialPackage } from "@/lib/api/payment-api";
import useAuthStore from "@/store/use-auth-store";
import PayWithWalletButton from "./pay-with-wallet-button";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const CommericalPackageDetailsPage = () => {
  const { packageId } = useParams();
  const [commercialPackage, setCommercialPackage] =
    useState<CommercialPackage>();
  const [selectGameId, setSelectGameId] = useState<string>();
  const [selectedGame, setSelectedGame] = useState<Game>();
  const [isFetchingGame, setIsFetchingGame] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isConflict, setIsConflict] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<Dayjs[]>([]);
  const [payingMethod, setPayingMethod] = useState<"Wallet" | "PayOS" | null>(
    null
  );
  const { profile } = useAuthStore();
  const handleCalendarSelect = (date: Dayjs, conflicts: Dayjs[]) => {
    setSelectedDate(date);
    setIsConflict(conflicts.length > 0);
  };

  useEffect(() => {
    (async () => {
      if (packageId) {
        const result = await getCommercialPackageById(packageId);
        if (result.error) {
          messageApi.error("Failed to load commercial package!");
        } else {
          setCommercialPackage(result.data);
        }
      }
    })();
  }, [packageId]);

  useEffect(() => {
    fetchGame();
    fetchUnavailableDates();
  }, [selectGameId, packageId]);

  const fetchGame = async () => {
    if (selectGameId) {
      setIsFetchingGame(true);
      const result = await getGameById(selectGameId);
      setIsFetchingGame(false);
      if (result.error) {
        messageApi.error("Failed to fetch game! Please try again.");
      } else {
        setSelectedGame(result.data);
      }
    }
  };

  const fetchUnavailableDates = async () => {
    if (!packageId || !selectGameId) return;
    const result = await getUnavailableDates({
      commercialPackageId: packageId,
      gameId: selectGameId,
    });
    if (result.error) {
      messageApi.error("Failed to check available dates! Please try again.");
    } else {
      const convertedData = result.data.map((x: string) => dayjs(x));
      setUnavailableDates(convertedData);
    }
  };

  const handlePurchase = async (method: "Wallet" | "PayOS") => {
    if (!packageId || !selectGameId || !selectedDate || !selectedGame) return;

    setPayingMethod(method);

    const result = await purchaseCommercialPackage(
      profile?.id || "",
      selectGameId,
      packageId,
      selectedDate.format("YYYY-MM-DD"),
      method
    );

    setPayingMethod(null);

    if (result.success) {
      messageApi.success("Purchase successful!");
      <Navigate to={"dev/manage-commercial-package"} />;
      if (method === "PayOS") {
        window.open(result.data);
      }
    } else {
      messageApi.error(result.error || "Purchase failed. Please try again.");
    }
  };

  if (!packageId) return <Navigate to={"/dev/commerical-pack"} />;
  if (!commercialPackage) return;

  return (
    <div>
      {contextHolder}
      <h1 className="p-3 bg-zinc-900 text-center text-lg font-bold border-b border-zinc-700">
        Register for {commercialPackage.name}
      </h1>
      <div className="grid grid-cols-12 gap-3 p-3">
        <div className="col-span-8">
          <div className="bg-zinc-800 rounded p-3">
            <h2 className="text-center font-semibold">
              Select registation date
            </h2>
            <hr className="my-3 border border-zinc-700" />
            <CommercialPackageCalendar
              duration={commercialPackage.duration}
              unavailableDates={unavailableDates}
              selectedDate={selectedDate}
              onSelect={handleCalendarSelect}
            />
            <p className="text-sm text-zinc-400 italic text-center">
              Click on a calendar cell to select a start date
            </p>
            {isConflict && (
              <Alert
                message="Please choose a different date range"
                description="Some of the dates in your selected range aren't available. Try picking a new one to continue."
                type="error"
                showIcon
              />
            )}
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-zinc-800 rounded p-5 duration-300">
            <h2 className="text-center font-semibold">Package Information</h2>
            <p className="text-sm mt-2 font-semibold">Package</p>
            <p className="text-xl font-bold">{commercialPackage.name}</p>
            <p className="text-sm text-zinc-400">
              {commercialPackage.description}
            </p>
            <p className="text-sm mt-2 font-semibold">Duration</p>
            <p className="text-xl font-semibold text-orange-500">
              {commercialPackage.duration} day(s)
            </p>
            <p className="text-sm mt-2 font-semibold">Price</p>
            <p className="text-lg">
              {formatCurrencyVND(commercialPackage.price)}
            </p>
            <hr className="my-3 border border-zinc-700" />
            <h2 className="text-center font-semibold">Select game</h2>
            <div className="mt-2">
              <SelectGameInput setSelectGameId={setSelectGameId} />
            </div>
            {isFetchingGame && (
              <div className="py-5">
                <Loader type="inline" />
              </div>
            )}
            {!isFetchingGame && selectedGame && (
              <div className="mt-5">
                <Link to={`/dev/game/${selectedGame.id}`}>
                  <FaultTolerantImage
                    src={selectedGame.coverImage}
                    className="rounded aspect-video w-full object-contain bg-zinc-900"
                  />
                </Link>
                <p className="text-sm mt-2 font-semibold">Game</p>
                <Link to={`/dev/game/${selectedGame.id}`}>
                  <p>{selectedGame.name}</p>
                </Link>
                <p className="text-sm mt-2 font-semibold">Short description</p>
                <p className="text-sm text-zinc-400">
                  {selectedGame.shortDescription.length === 0
                    ? "No description"
                    : selectedGame.shortDescription}
                </p>
              </div>
            )}
            {!selectedGame && (
              <div className="mt-2">
                <Alert message="Select a game to continue" showIcon />
              </div>
            )}
            {selectedDate && (
              <div>
                <p className="font-semibold mt-2">Selected date:</p>
                {formatDate(selectedDate.toDate())}
                {commercialPackage.duration > 1 && (
                  <>
                    {" - " +
                      formatDate(
                        selectedDate
                          .add(commercialPackage.duration, "day")
                          .toDate()
                      )}
                  </>
                )}
              </div>
            )}
            <hr className="my-3 border border-zinc-700" />
            <div>
              <h2 className="text-center font-semibold mb-2">Payment</h2>
              {selectGameId && selectedDate ? (
                <>
                  <Button
                    size="large"
                    type="primary"
                    loading={payingMethod === "PayOS"}
                    onClick={() => handlePurchase("PayOS")}
                    style={{ width: "100%" }}
                  >
                    Pay with <span className="font-bold">PayOS</span>
                  </Button>
                  <PayWithWalletButton
                    commercialPackage={commercialPackage}
                    gameId={selectGameId}
                    selectedDate={selectedDate.format("YYYY-MM-DD")}
                  />
                </>
              ) : (
                <p className="text-zinc-400 text-sm text-center">
                  Select game and registration date to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommericalPackageDetailsPage;
