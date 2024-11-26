import React, { useState, useEffect } from "react";
import specialties from "../../data/serviceMos.json";
import { Icon } from "@iconify/react";

interface Specialty {
  branch: string;
  category: string;
  code: string;
  name: string;
}

interface TypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (specialty: Specialty) => void;
}

const MosModal: React.FC<TypeModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [filter, setFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSpecialties, setFilteredSpecialties] =
    useState<Specialty[]>(specialties);

  const koreanSearch = (input: string, target: string) => {
    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    return normalize(target).includes(normalize(input));
  };

  useEffect(() => {
    let result = specialties;

    if (filter) {
      result = result.filter((item) => item.category === filter);
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((item) => koreanSearch(searchTerm, item.name));
    }

    setFilteredSpecialties(result);
  }, [filter, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg h-[80vh] w-[500px]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold">특기 검색</p>
          <button className="text-xl font-bold text-gray-600" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="relative mb-4">
          <input
            className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="특기를 검색해 보세요"
          />
          <button className="absolute transform -translate-y-1/2 right-2 top-1/2 text-emerald-600">
            <Icon icon="mdi:magnify" className="text-xl" />
          </button>
        </div>
        <div className="flex items-center w-full h-12 gap-2 mb-2 overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-hide">
          {[
            "일반",
            "공병",
            "군악",
            "기계",
            "의무",
            "의장",
            "전자계산",
            "차량운전",
            "차량정비",
            "통신전자전기",
            "화생방",
          ].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 text-sm rounded-lg ${
                filter === category
                  ? "bg-emerald-100 border-2 border-emerald-600"
                  : "bg-gray-100 text-gray-600 border-2 border-gray-100"
              } flex-shrink-0 whitespace-nowrap`}
              style={{ minWidth: "fit-content" }}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto scrollbar-hide max-h-[60vh]">
          {filteredSpecialties.length > 0 ? (
            filteredSpecialties.map((specialty) => (
              <div
                key={specialty.code}
                className="flex items-center justify-between px-4 py-2 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <span className="text-sm">{specialty.name}</span>
                <button
                  className="text-lg font-bold text-emerald-600"
                  onClick={() => onSelect(specialty)}
                >
                  <Icon icon="mdi:plus-circle" className="text-2xl" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MosModal;
