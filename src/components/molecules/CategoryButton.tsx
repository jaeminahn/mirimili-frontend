import React, { useState } from "react";

interface Category {
  id: number;
  label: string;
}

interface CategoryButtonProps {
  onCategorySelect: (selectedCategory: number | null) => void;
}

const categories: Category[] = [
  { id: 0, label: "입대준비" },
  { id: 1, label: "훈련소·후반기교육" },
  { id: 2, label: "특기" },
  { id: 3, label: "자대생활" },
  { id: 4, label: "부조리" },
  { id: 5, label: "징계" },
  { id: 6, label: "복지" },
  { id: 7, label: "휴가" },
  { id: 8, label: "예비군" },
  { id: 9, label: "기타" },
];

const CategoryButton: React.FC<CategoryButtonProps> = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategorySelect = (id: number) => {
    const newSelection = selectedCategory === id ? null : id;
    setSelectedCategory(newSelection);
    onCategorySelect(newSelection);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          className={`px-2 py-2 rounded-lg text-sm border-2 ${
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
