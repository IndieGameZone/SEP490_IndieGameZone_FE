import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import {
  DEFAULT_LANGUAGE_OPTIONS,
  DEFAULT_PLATFORM_OPTIONS,
  DEFAULT_TAG_OPTIONS,
  MAX_PRICE,
  PRICE_STEP,
} from "@/constants/filter-constants";
import { formatCurrencyVND } from "@/lib/currency";
import { updateSearchParam } from "@/lib/search-params";
import useCategoryStore from "@/store/use-category-store";
import useLanguageStore from "@/store/use-language-store";
import useTagStore from "@/store/use-tag-store";
import { Checkbox, Slider, Select, CheckboxOptionType, Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

const FilterPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tags: allTags, fetchTags } = useTagStore();
  const { languages: allLanguages, fetchLanguages } = useLanguageStore();
  const { fetchCategories } = useCategoryStore();

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
    fetchCategories();
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
    <MaxWidthWrapper className="hidden md:block">
      <div className="bg-zinc-900 grid grid-cols-4 gap-x-5 px-10 py-5 rounded border border-zinc-700">
        <div className="flex justify-between col-span-4">
          <div className="flex gap-2 items-center mb-4">
            <MdFilterAlt size={18} />
            <span className="font-semibold">Filter search results</span>
          </div>
          <Button icon={<MdFilterAltOff />} onClick={handleClearFilter}>
            Clear filter
          </Button>
        </div>
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
              <p className="text-sm">Below {formatCurrencyVND(priceDisplay)}</p>
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
              optionFilterProp="label"
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
              optionFilterProp="label"
              placeholder="Search for other languages"
              onChange={(val) => setLanguages(val)}
              value={languages}
              options={languageOptions}
              maxTagCount={4}
              maxCount={10}
            />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default FilterPanel;
