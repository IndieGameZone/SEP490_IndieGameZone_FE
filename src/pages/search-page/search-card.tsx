import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Checkbox, CheckboxProps, Slider, Select } from "antd";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

import useTagStore from "@/store/use-tag-store";
import useLanguageStore from "@/store/use-language-store";
import usePlatformStore from "@/store/use-platform-store";

interface SearchCardProps {
  onFilterChange: (filters: {
    price?: number;
    Tags?: string[];
    Languages?: string[];
    Platforms?: string[];
    showSpecialOffers?: boolean;
  }) => void;
}

const SearchCard = ({ onFilterChange }: SearchCardProps) => {
  const [price, setPrice] = useState(2000000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showSpecialOffers, setShowSpecialOffers] = useState(false);

  const { tags, fetchTags, loading: tagsLoading, error: tagsError } = useTagStore();
  const { languages, fetchLanguages, loading: languagesLoading, error: languagesError } = useLanguageStore();
  const { platforms, fetchPlatforms, loading: platformsLoading, error: platformsError } = usePlatformStore();

  useEffect(() => {
    fetchTags();
    fetchLanguages();
    fetchPlatforms();
  }, [fetchTags, fetchLanguages, fetchPlatforms]);

  useEffect(() => {
    if (tags.length === 0 || languages.length === 0 || platforms.length === 0) return;

    const Tags = tags
      .filter(tag => selectedTags.includes(tag.name))
      .map(tag => tag.id); 
    const Languages = languages
      .filter(language => selectedLanguages.includes(language.name))
      .map(language => language.id);
    const Platforms = platforms
      .filter(platform => selectedPlatforms.includes(platform.name))
      .map(platform => platform.id);

    onFilterChange({
      price: price > 0 ? price : undefined,
      Tags: Tags.length > 0 ? Tags : undefined, 
      Languages: Languages.length > 0 ? Languages : undefined,
      Platforms: Platforms.length > 0 ? Platforms : undefined,
      showSpecialOffers,
    });
  }, [price, selectedTags, selectedLanguages, selectedPlatforms, showSpecialOffers, tags, languages, platforms]);

  const handleSpecialOffersChange: CheckboxProps["onChange"] = (e) => {
    setShowSpecialOffers(e.target.checked);
  };

  const topTags = tags.slice(0, 5).map((tag) => ({
    label: tag.name,
    value: tag.name,
  }));
  const otherTags = tags.slice(5).map((tag) => ({
    label: tag.name,
    value: tag.name,
  }));

  const topLanguages = languages.slice(0, 5).map((language) => ({
    label: language.name,
    value: language.name,
  }));
  const otherLanguages = languages.slice(5).map((language) => ({
    label: language.name,
    value: language.name,
  }));

  const allPlatforms = platforms.map((platform) => ({
    label: platform.name,
    value: platform.name,
  }));

  return (
    <MaxWidthWrapper>
      <div className="bg-zinc-900 flex justify-between px-10 py-5 rounded border border-zinc-700">
        <div>
          <div className="flex gap-2 items-center mb-4">
            <FaFilter size={16} />
            <span className="text">Filter search results</span>
          </div>
          <div className="flex flex-col">
            <span className="block font-semibold mb-1">Price</span>
            <Slider
              style={{ width: 250 }}
              min={0}
              max={2000000}
              step={50000}
              value={price}
              onChange={(value) => setPrice(value as number)}
              tooltip={{ formatter: null }}
            />
            <p className="text-sm">Below {price.toLocaleString()}đ</p>
          </div>
          <div className="pt-5">
            <Checkbox
              checked={showSpecialOffers}
              onChange={handleSpecialOffersChange}
            >
              Show only special offers
            </Checkbox>
          </div>
        </div>
        <div>
          <div className="flex flex-col pt-8 gap-4">
            <span className="font-bold">Tags</span>
            {tagsLoading && <p>Loading tags...</p>}
            {tagsError && <p className="text-red-500">{tagsError}</p>}
            {!tagsLoading && !tagsError && (
              <>
                <Checkbox.Group
                  className="flex flex-col gap-2"
                  options={topTags}
                  value={selectedTags}
                  onChange={(checkedValues) => setSelectedTags(checkedValues as string[])}
                />
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: 200 }}
                  placeholder="Search for other tags"
                  options={otherTags}
                  value={selectedTags}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(selectedValues) => setSelectedTags(selectedValues as string[])}
                />
              </>
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-col pt-8 gap-4">
            <span className="font-bold">Platforms</span>
            {platformsLoading && <p>Loading platforms...</p>}
            {platformsError && <p className="text-red-500">{platformsError}</p>}
            {!platformsLoading && !platformsError && (
              <Checkbox.Group
                className="flex flex-col gap-2"
                options={allPlatforms}
                value={selectedPlatforms}
                onChange={(checkedValues) => setSelectedPlatforms(checkedValues as string[])}
              />
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-col pt-8 gap-4">
            <span className="font-bold">Languages</span>
            {languagesLoading && <p>Loading languages...</p>}
            {languagesError && <p className="text-red-500">{languagesError}</p>}
            {!languagesLoading && !languagesError && (
              <>
                <Checkbox.Group
                  className="flex flex-col gap-2"
                  options={topLanguages}
                  value={selectedLanguages}
                  onChange={(checkedValues) => setSelectedLanguages(checkedValues as string[])}
                />
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: 200 }}
                  placeholder="Search for other languages"
                  options={otherLanguages}
                  value={selectedLanguages}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(selectedValues) => setSelectedLanguages(selectedValues as string[])}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default SearchCard;