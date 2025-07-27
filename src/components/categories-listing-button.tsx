import { useEffect, useState } from "react";
import { Button, Modal, Tag } from "antd";
import { useSearchParams } from "react-router-dom";
import useCategoryStore from "@/store/use-category-store";

const CategoriesListingButton = () => {
  const { categories } = useCategoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    currentCategory
  );

  const updateSearchParams = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }

    setSearchParams(params);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    updateSearchParams(categoryId);
    setIsModalOpen(false);
  };

  // Keep selectedCategory in sync if URL changes externally
  useEffect(() => {
    const categoryInParams = searchParams.get("category");
    if (categoryInParams !== selectedCategory) {
      setSelectedCategory(categoryInParams);
    }
  }, [searchParams]);

  return (
    <>
      <Button type="text" onClick={() => setIsModalOpen(true)}>
        View more
      </Button>

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
