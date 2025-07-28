import { FaApple, FaLinux, FaWindows } from "react-icons/fa";

export const MAX_PRICE = 1_000_000;
export const PRICE_STEP = 25_000;
export const DEFAULT_TAG_OPTIONS = [
  {
    value: "1c175c84-379e-43dc-a95a-aafd910d6a00",
    label: "Action",
  },
  {
    value: "cd543d0f-1761-4874-945b-53863f00942b",
    label: "Adventure",
  },
  {
    value: "a137e663-30d5-4ed9-8aa3-b9b500f18de7",
    label: "Card Game",
  },
  {
    value: "0a0af88e-6860-445b-b7ce-b10f46e8dea3",
    label: "First-Person",
  },
];

export const DEFAULT_PLATFORM_OPTIONS = [
  {
    value: "a47b287d-6ed7-4bb0-be73-c2581dcb9b3e",
    label: (
      <div className="flex gap-2 items-center">
        <FaWindows />
        Windows
      </div>
    ),
  },
  {
    value: "574cb883-e637-4f18-9518-269e4d22312c",
    label: (
      <div className="flex gap-2 items-center">
        <FaApple />
        MacOS
      </div>
    ),
  },
  {
    value: "db498cbb-c76f-4166-9836-8ecb462419e6",
    label: (
      <div className="flex gap-2 items-center">
        <FaLinux />
        Linux
      </div>
    ),
  },
];

export const DEFAULT_LANGUAGE_OPTIONS = [
  {
    value: "8f29f2a5-146d-44df-95ba-a972e36b7527",
    label: "English",
  },
  {
    value: "80e3581d-3836-4921-a838-b7d917b5e11f",
    label: "Vietnamese",
  },
  {
    value: "04adfb56-cb77-4209-8fc3-a7b96b768784",
    label: "Japanese",
  },
  {
    value: "149615f6-6214-4e42-a016-1dba7d248c0f",
    label: "Korean",
  },
];
