import React, { Dispatch, SetStateAction } from "react";
import { TypeRecord, MosAndUnitRecord } from "../../data/data";

interface ButtonOptionProps {
  data: TypeRecord[] | MosAndUnitRecord[];
  options: number[];
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
  isAllSelected?: boolean;
  setIsAllSelected?: Dispatch<SetStateAction<boolean>>;
}

const getButtonClasses = (isActive: boolean): string =>
  `px-2 py-1 text-sm rounded-xl border-2 ${
    isActive
      ? "bg-emerald-100 border-emerald-600"
      : "bg-gray-100 text-gray-500 border-gray-100"
  }`;

const ButtonOption = ({
  data,
  options,
  selected,
  setSelected,
  isAllSelected,
  setIsAllSelected,
}: ButtonOptionProps) => {
  const handleToggle = (optionId: number) => {
    selected.includes(optionId)
      ? setSelected(selected.filter((item) => item !== optionId))
      : setSelected([...selected, optionId]);
  };

  const handleIsAllSelected = () => {
    if (!isAllSelected) {
      setSelected(data.map((item) => item.id));
      setIsAllSelected!(true);
    } else {
      setSelected([]);
      setIsAllSelected!(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isAllSelected != null && (
        <button
          key={0}
          className={getButtonClasses(isAllSelected!)}
          onClick={handleIsAllSelected}
        >
          전체
        </button>
      )}
      {options.map((id) => (
        <button
          key={id}
          className={getButtonClasses(selected.includes(id))}
          onClick={() => handleToggle(id)}
        >
          {data.find((item) => item.id === id)!.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonOption;
