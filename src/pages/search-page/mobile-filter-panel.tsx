import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import { formatCurrencyVND } from "@/lib/currency";
import { updateSearchParam } from "@/lib/search-params";
import useLanguageStore from "@/store/use-language-store";
import useTagStore from "@/store/use-tag-store";
import {
  Checkbox,
  Slider,
  Select,
  CheckboxOptionType,
  Button,
  Collapse,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

const MAX_PRICE = 1_000_000;
const PRICE_STEP = 25_000;
const DEFAULT_TAG_OPTIONS = [
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

const DEFAULT_PLATFORM_OPTIONS = [
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

const DEFAULT_LANGUAGE_OPTIONS = [
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

const MobileFilterPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tags: allTags, fetchTags } = useTagStore();
  const { languages: allLanguages, fetchLanguages } = useLanguageStore();

  const [priceDisplay, setPriceDisplay] = useState(
    Number(searchParams.get("maxPrice")) || MAX_PRICE
  );
  const [price, setPrice] = useState(
    Number(searchParams.get("maxPrice")) || MAX_PRICE
  );
  const [special, setSpecial] = useState(
    searchParams.get("special") === "true"
  );
  const [tags, setTags] = useState<string[]>(
    searchParams.get("tags")?.split(",") || []
  );
  const [platforms, setPlatforms] = useState<string[]>(
    searchParams.get("platforms")?.split(",") || []
  );
  const [languages, setLanguages] = useState<string[]>(
    searchParams.get("languages")?.split(",") || []
  );

  useEffect(() => {
    fetchTags();
    fetchLanguages();
  }, []);

  const tagOptions: CheckboxOptionType<string>[] = useMemo(() => {
    return allTags.map((x) => ({ label: x.name, value: x.id }));
  }, [allTags]);

  const languageOptions: CheckboxOptionType<string>[] = useMemo(() => {
    return allLanguages.map((x) => ({ label: x.name, value: x.id }));
  }, [allLanguages]);

  const topTagOptions: CheckboxOptionType<string>[] = DEFAULT_TAG_OPTIONS;

  const topPlatformOptions: CheckboxOptionType<string>[] =
    DEFAULT_PLATFORM_OPTIONS;

  const topLanguageOptions: CheckboxOptionType<string>[] =
    DEFAULT_LANGUAGE_OPTIONS;

  useEffect(() => {
    let params = new URLSearchParams(searchParams);
    params = updateSearchParam(
      params,
      "maxPrice",
      price !== MAX_PRICE ? price.toString() : null
    );
    params = updateSearchParam(params, "special", special ? "true" : null);
    params = updateSearchParam(params, "tags", tags);
    params = updateSearchParam(params, "platforms", platforms);
    params = updateSearchParam(params, "languages", languages);

    const newParamsStr = params.toString();
    const oldParamsStr = searchParams.toString();

    if (newParamsStr !== oldParamsStr) {
      setSearchParams(params);
    }
  }, [price, special, tags, platforms, languages, searchParams]);

  const handleClearFilter = () => {
    setPrice(MAX_PRICE);
    setPriceDisplay(MAX_PRICE);
    setSpecial(false);
    setTags([]);
    setPlatforms([]);
    setLanguages([]);
  };

  return (
    <MaxWidthWrapper className="md:hidden">
      <div className="bg-zinc-900 mt-5 rounded border border-zinc-700">
        <Collapse
          items={[
            {
              key: "filter-content",
              label: (
                <span className="font-semibold">Filter search results</span>
              ),
              children: (
                <>
                  <div>
                    <div className="flex flex-col">
                      <span className="block font-semibold mb-1">Price</span>
                      <Slider
                        min={0}
                        max={MAX_PRICE}
                        step={PRICE_STEP}
                        value={priceDisplay}
                        tooltip={{ formatter: null }}
                        onChange={(val) => {
                          setPriceDisplay(val);
                        }}
                        onChangeComplete={(val) => {
                          setPrice(val);
                        }}
                      />
                      {priceDisplay == MAX_PRICE ? (
                        <p className="text-sm">Any Price</p>
                      ) : priceDisplay == 0 ? (
                        <p className="text-sm">Free</p>
                      ) : (
                        <p className="text-sm">
                          Below {formatCurrencyVND(priceDisplay)}
                        </p>
                      )}
                    </div>
                    <div className="pt-5">
                      <Checkbox
                        checked={special}
                        onChange={(e) => setSpecial(e.target.checked)}
                      >
                        Show only special offers
                      </Checkbox>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col pt-8 gap-4">
                      <span className="font-bold">Tags</span>
                      <Checkbox.Group
                        className="flex flex-col gap-2"
                        value={tags}
                        onChange={(val) => setTags(val as string[])}
                        options={topTagOptions}
                      />
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Search for other tags"
                        onChange={(val) => setTags(val)}
                        value={tags}
                        options={tagOptions}
                        maxTagCount={4}
                        maxCount={10}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col pt-8 gap-4">
                      <span className="font-bold">Platforms</span>
                      <Checkbox.Group
                        className="flex flex-col gap-2"
                        onChange={(val) => setPlatforms(val as string[])}
                        value={platforms}
                        options={topPlatformOptions}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col pt-8 gap-4">
                      <span className="font-bold">Languages</span>
                      <Checkbox.Group
                        className="flex flex-col gap-2"
                        options={topLanguageOptions}
                        value={languages}
                        onChange={(val) => setLanguages(val as string[])}
                      />
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Search for other languages"
                        onChange={(val) => setLanguages(val)}
                        value={languages}
                        options={languageOptions}
                        maxTagCount={4}
                        maxCount={10}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      icon={<MdFilterAltOff />}
                      onClick={handleClearFilter}
                    >
                      Clear filter
                    </Button>
                  </div>
                </>
              ),
              extra: <MdFilterAlt className="size-5" />,
            },
          ]}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default MobileFilterPanel;
