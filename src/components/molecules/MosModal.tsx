import React, { useState, useEffect } from "react";
import specialties from "../../Mos.json";
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
    const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>(specialties);

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
            result = result.filter((item) =>
                koreanSearch(searchTerm, item.name)
            );
        }

        setFilteredSpecialties(result);
    }, [filter, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-3/5 p-6 bg-white rounded-lg shadow-lg max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
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
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-600">
                        <Icon icon="mdi:magnify" className="text-xl" />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {["일반", "공병", "군악", "기계", "의무", "의장"].map((category) => (
                        <button
                            key={category}
                            className={`px-4 py-2 text-sm rounded-lg ${
                                filter === category
                                    ? "bg-emerald-100 text-emerald-600 border border-emerald-600"
                                    : "bg-gray-100 text-gray-600 border border-gray-300"
                            }`}
                            onClick={() => setFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="overflow-y-auto max-h-[400px]">
                    {filteredSpecialties.length > 0 ? (
                        filteredSpecialties.map((specialty) => (
                            <div
                                key={specialty.code}
                                className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg mb-2 hover:bg-gray-200"
                            >
                                <span className="text-sm">{specialty.name}</span>
                                <button
                                    className="text-emerald-600 font-bold text-lg"
                                    onClick={() => onSelect(specialty)}
                                >
                                    <Icon icon="mdi:plus-circle-outline" className="text-2xl" />
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
