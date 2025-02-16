import React, { Dispatch, SetStateAction } from "react";
import categories from "../../data/category.json";

interface Category {
  id: number;
  label: string;
}

interface CategoryButtonProps {
  categoryId: number | undefined;
  setCategoryId: Dispatch<SetStateAction<number | undefined>>;
}

const CategoryButton = ({ categoryId, setCategoryId }: CategoryButtonProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {categories.map((category: Category) => (
        <button
          key={category.id}
          onClick={() =>
            setCategoryId(categoryId === category.id ? undefined : category.id)
          }
          className={`px-2 py-1 text-sm rounded-xl border-2 ${
            categoryId === category.id
              ? "bg-emerald-100 border-emerald-100 font-semibold"
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