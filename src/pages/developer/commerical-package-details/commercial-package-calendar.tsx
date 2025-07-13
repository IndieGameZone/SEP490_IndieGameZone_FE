import { useState } from "react";
import { Button, Calendar } from "antd";
import { FaCalendar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { IoMdCloseCircleOutline } from "react-icons/io";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type Props = {
  duration: number;
  unavailableDates: Dayjs[];
  selectedDate: Dayjs | null;
  onSelect: (date: Dayjs, conflictDates: Dayjs[]) => void;
};

const CommercialPackageCalendar = ({
  duration,
  unavailableDates,
  selectedDate,
  onSelect,
}: Props) => {
  const [viewValue, setViewValue] = useState(dayjs());

  const isUnavailable = (date: Dayjs): boolean =>
    unavailableDates.some((d) => d.isSame(date, "day"));

  const handleSelect = (date: Dayjs) => {
    if (isUnavailable(date) || date.isBefore(dayjs(), "day")) return;

    const conflicts: Dayjs[] = [];
    for (let i = 0; i < duration; i++) {
      const check = date.add(i, "day");
      if (isUnavailable(check)) {
        conflicts.push(check);
      }
    }

    onSelect(date.startOf("day"), conflicts);
  };

  const isStartDate = (date: Dayjs): boolean =>
    selectedDate?.isSame(date, "day") ?? false;

  const isWithinDuration = (date: Dayjs): boolean => {
    if (!selectedDate) return false;
    const endDate = selectedDate.add(duration - 1, "day");
    return (
      date.isSameOrAfter(selectedDate, "day") &&
      date.isSameOrBefore(endDate, "day")
    );
  };

  const isConflictDate = (date: Dayjs): boolean => {
    if (!selectedDate) return false;
    const end = selectedDate.add(duration - 1, "day");
    return (
      date.isSameOrAfter(selectedDate, "day") &&
      date.isSameOrBefore(end, "day") &&
      isUnavailable(date)
    );
  };

  return (
    <Calendar
      value={viewValue}
      onPanelChange={setViewValue}
      headerRender={({ value, onChange }) => {
        const current = value.clone();

        const prevMonth = () => onChange(current.subtract(1, "month"));
        const nextMonth = () => onChange(current.add(1, "month"));

        return (
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <Button onClick={prevMonth} icon={<FaChevronLeft />} />
            <div className="text-lg font-medium">
              {current.format("MMMM YYYY")}
            </div>
            <Button onClick={nextMonth} icon={<FaChevronRight />} />
          </div>
        );
      }}
      fullCellRender={(date) => {
        const isPast = date.isBefore(dayjs(), "day");
        const isSelected = isStartDate(date);
        const inRange = isWithinDuration(date);
        const unavailable = isUnavailable(date);
        const conflict = isConflictDate(date);

        let cellStyle =
          "border-zinc-600 hover:border-zinc-400 hover:bg-orange-900 cursor-pointer";

        if (isPast) {
          cellStyle =
            "border-zinc-800 bg-zinc-900 text-zinc-500 cursor-not-allowed";
        } else if (conflict) {
          cellStyle = "bg-red-950 border-red-500 text-red-500";
        } else if (unavailable) {
          cellStyle = "border-zinc-400 bg-zinc-700 cursor-not-allowed";
        } else if (isSelected) {
          cellStyle = "border-green-500 bg-green-900";
        } else if (inRange) {
          cellStyle = "border-green-300 bg-green-950";
        }

        return (
          <div
            onClick={() => handleSelect(date)}
            className={`relative flex items-center flex-col justify-center border duration-300 min-h-20 ${cellStyle}`}
          >
            <p className="font-medium absolute p-1 top-0 right-0">{date.date()}</p>
            {isSelected && (
              <>
                <p className="text-center">
                  <FaCalendar className="size-5 inline" />
                </p>
                <p className="text-xs text-center mt-1">Start date</p>
              </>
            )}
            {conflict && (
              <p className="text-center">
                <IoMdCloseCircleOutline className="inline size-6" />
              </p>
            )}
            {unavailable && (
              <p className="text-xs text-center mt-1">Unavailable</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default CommercialPackageCalendar;
