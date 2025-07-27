import { useEffect, useState } from "react";
import { Button, Modal, Tag } from "antd";
import { useSearchParams } from "react-router-dom";
import useCategoryStore from "@/store/use-category-store";
import { updateSearchParam } from "@/lib/search-params";
import { MdFilterAltOff } from "react-icons/md";

const CategoriesListingButton = () => {
  const { categories, setDisplayCategory } = useCategoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    currentCategory
  );

  const handleCategoryClick = (categoryId: string | null) => {
    const newParams = updateSearchParam(searchParams, "category", categoryId);
    setSearchParams(newParams);
    setSelectedCategory(categoryId);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const categoryInParams = searchParams.get("category");
    if (categoryInParams !== selectedCategory) {
      setSelectedCategory(categoryInParams);
    }
    setDisplayCategory(
      categories.find((c) => c.id == categoryInParams) ?? null
    );
  }, [searchParams]);

  return (
    <>
      <div className="flex gap-1 items-center">
        {currentCategory && (
          <Button
            type="text"
            onClick={() => handleCategoryClick(null)}
            icon={<MdFilterAltOff />}
            shape="circle"
          />
        )}
        <Button type="text" onClick={() => setIsModalOpen(true)}>
          View more
        </Button>
      </div>

      <Modal
        title="All Game Categories"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={<Button onClick={() => setIsModalOpen(false)}>Close</Button>}
      >
        <div className="flex flex-wrap gap-y-3 pt-2">
          <Tag
            onClick={() => handleCategoryClick(null)}
            className="cursor-pointer"
            color={selectedCategory === null ? "orange" : "default"}
          >
            All
          </Tag>

          {categories.map((category) => (
            <Tag
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="cursor-pointer"
              color={selectedCategory === category.id ? "orange" : "default"}
            >
              {category.name}
            </Tag>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default CategoriesListingButton;
