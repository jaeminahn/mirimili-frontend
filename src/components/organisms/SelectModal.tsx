import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { MosAndUnitRecord, extractCategories } from "../../data/data";

interface SelectModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mos: MosAndUnitRecord) => void;
  DataList: MosAndUnitRecord[];
}

const SelectModal = ({
  title,
  isOpen,
  onClose,
  onSelect,
  DataList,
}: SelectModalProps) => {
  const [searchCategory, setSearchCategory] = useState<string>("전체");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSpecialties, setFilteredSpecialties] =
    useState<MosAndUnitRecord[]>(DataList);

  const koreanSearch = (input: string, target: string) => {
    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    return normalize(target).includes(normalize(input));
  };

  useEffect(() => {
    let result = DataList;
    if (searchCategory == "전체") result = DataList;
    else result = result.filter((item) => item.category === searchCategory);
    if (searchTerm.trim() !== "")
      result = result.filter((item) => koreanSearch(searchTerm, item.label));
    setFilteredSpecialties(result);
  }, [searchCategory, searchTerm]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg h-[40rem] w-96">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold">{title} 검색</p>
          <button className="text-xl font-bold text-gray-600" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="relative mb-4">
          <input
            className="w-full px-4 py-2 text-sm bg-gray-100 border rounded-lg focus:outline-none focus:border-emerald-600"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${title} 검색`}
          />
          <button className="absolute transform -translate-y-1/2 right-2 top-1/2 text-emerald-600">
            <Icon icon="mdi:magnify" className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col h-[31rem] gap-2 p-2 overflow-y-auto bg-gray-100 rounded-lg">
          <div className="flex items-center w-full h-12 gap-1 overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-hide">
            <button
              key={0}
              onClick={() => setSearchCategory("전체")}
              className={`px-1 py-2 text-xs rounded-lg ${
                searchCategory === "전체"
                  ? "bg-emerald-100 border-2 border-emerald-600"
                  : "bg-white text-gray-800 border-2 border-white"
              } flex-shrink-0 whitespace-nowrap`}
            >
              {"전체"}
            </button>
            {extractCategories(DataList).map((category) => (
              <button
                key={category}
                onClick={() => setSearchCategory(category)}
                className={`px-1 py-2 text-xs rounded-lg ${
                  searchCategory === category
                    ? "bg-emerald-100 border-2 border-emerald-600"
                    : "bg-white text-gray-800 border-2 border-white"
                } flex-shrink-0 whitespace-nowrap`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {filteredSpecialties.length > 0 ? (
                filteredSpecialties.map((item) => (
                  <button
                    key={item.id}
                    className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    onClick={() => onSelect(item)}
                  >
                    <span className="text-sm">{item.label}</span>

                    <Icon
                      icon="mdi:plus-circle"
                      className="text-xl text-emerald-600"
                    />
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  검색 결과가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectModal;
