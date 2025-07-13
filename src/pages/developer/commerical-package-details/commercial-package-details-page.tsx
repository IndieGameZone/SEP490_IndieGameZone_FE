import { getCommercialPackageById } from "@/lib/api/commercial-package-api";
import { formatCurrencyVND } from "@/lib/currency";
import { CommercialPackage } from "@/types/commercial-package";
import { Alert, message } from "antd";
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

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const CommericalPackageDetailsPage = () => {
  const { packageId } = useParams();
  const [commercialPackage, setCommercialPackage] =
    useState<CommercialPackage>();
  useState;
  const [selectGameId, setSelectGameId] = useState<string>();
  const [selectedGame, setSelectedGame] = useState<Game>();
  const [isFetchingGame, setIsFetchingGame] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isConflict, setIsConflict] = useState(false);
  const unavailableDates = ["2025-07-15", "2025-07-18", "2025-07-21"].map((d) =>
    dayjs(d).startOf("day")
  );

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
    (async () => {
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
    })();
  }, [selectGameId]);

  if (!packageId) return <Navigate to={"/dev/commerical-pack"} />;
  if (!commercialPackage) return;
  return (
    <div>
      {contextHolder}
      <h1 className="p-3 bg-zinc-900 text-center text-lg font-bold border-b border-zinc-700">
        Register for {commercialPackage.name}
      </h1>
      <div className="grid grid-cols-12 gap-3 p-3">
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
            {isFetchingGame && <div className="py-5"><Loader type="inline" /></div>}
            {!isFetchingGame && selectedGame && (
              <div className="py-5">
                <Link to={`/dev/game/${selectedGame.id}`}>
                  <FaultTolerantImage
                    src={selectedGame.coverImage}
                    className="rounded aspect-video w-full object-contain bg-zinc-900"
                  />
                </Link>
                <p className="text-sm mt-2 font-semibold">Game</p>
                <Link to={`/dev/game/${selectedGame.id}`}>
                  <p className="">{selectedGame.name}</p>
                </Link>
                <p className="text-sm mt-2 font-semibold">Short description</p>
                <p className="text-sm text-zinc-400">
                  {selectedGame.shortDescription.length == 0
                    ? "No description"
                    : selectedGame.shortDescription}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-8 bg-zinc-800 rounded p-3">
          <CommercialPackageCalendar
            duration={7}
            unavailableDates={unavailableDates}
            selectedDate={selectedDate}
            onSelect={handleCalendarSelect}
          />
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
    </div>
  );
};

export default CommericalPackageDetailsPage;
