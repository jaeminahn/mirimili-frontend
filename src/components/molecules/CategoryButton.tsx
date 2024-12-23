import React, { useState } from "react";
import categories from "../../data/category.json";

interface Category {
  id: number;
  label: string;
}

interface CategoryButtonProps {
  onCategorySelect: (selectedCategory: number | null) => void;
}

const CategoryButton = ({ onCategorySelect }: CategoryButtonProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategorySelect = (id: number) => {
    const newSelection = selectedCategory === id ? null : id;
    setSelectedCategory(newSelection);
    onCategorySelect(newSelection);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {categories.map((category: Category) => (
        <button
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          className={`px-2 py-1 text-sm rounded-xl border-2 ${
            selectedCategory === category.id
              ? "bg-emerald-100 border-emerald-600 font-semibold"
              : "bg-gray-100 border-gray-100 font-medium"
          } cursor-pointer`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryButton;
