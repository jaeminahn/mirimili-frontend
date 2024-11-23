import React from "react";

interface ButtonOptionProps {
    options: string[];
    selected: string[];
    onChange: (value: string[]) => void;
    allOption?: string;
}

const getButtonClasses = (isActive: boolean): string =>
    `px-2 py-1 text-sm rounded-xl border-2 ${
        isActive
            ? "bg-emerald-100 border-emerald-600"
            : "bg-gray-100 text-gray-500 border-gray-100"
    }`;

const ButtonOption: React.FC<ButtonOptionProps> = ({
    options,
    selected,
    onChange,
    allOption = "전체",
}) => {
    const handleToggle = (option: string) => {
        if (option === allOption) {
            onChange(selected.includes(option) ? [] : [allOption]);
        } else {
            const updatedSelection = selected.includes(option)
                ? selected.filter((item) => item !== option)
                : [...selected.filter((item) => item !== allOption), option];
            onChange(updatedSelection);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {options.map((option) => (
                <button
                    key={option}
                    className={getButtonClasses(selected.includes(option))}
                    onClick={() => handleToggle(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default ButtonOption;
