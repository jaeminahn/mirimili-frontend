import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";

type SetTypeProps = {
  form: SignUpFormType;
  changed: (key: keyof SignUpFormType) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setCanProceed: (value: boolean) => void;
};

export default function SetType({ form, changed, setCanProceed }: SetTypeProps) {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [selectedYear, setSelectedYear] = useState(Number(form.enlistmentYear));
  const [selectedMonth, setSelectedMonth] = useState(Number(form.enlistmentMonth));
  const [days, setDays] = useState<number[]>([]);

  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    setCanProceed(!!form.serviceType);
  }, [form.serviceType, setCanProceed]);

  const handleServiceTypeSelect = (type: string) => {
    changed("serviceType")({ target: { value: type } } as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(Number(year));
    changed("enlistmentYear")({ target: { value: year } } as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(Number(month));
    changed("enlistmentMonth")({ target: { value: month } } as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };

  const handleDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const day = e.target.value;
    changed("enlistmentDay")({ target: { value: day } } as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-80">
      <h2 className="text-lg font-bold text-gray-700 mb-4">복무 형태 설정</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {["공군", "육군", "해군", "해병대", "상근예비역", "의무경찰", "의무소방원", "해양경찰", "카투사", "사회복무요원", "산업기능요원(현역)", "산업기능요원(보충역)", "전문연구요원"].map((type) => (
          <button
            key={type}
            onClick={() => handleServiceTypeSelect(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${form.serviceType === type ? "bg-emerald-100 border-2 border-emerald-600" : "bg-gray-100"} cursor-pointer`}
          >
            {type}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-700 mb-4">입대일</h2>
      <div className="flex gap-2 mb-4">
        <select onChange={handleYearChange} value={form.enlistmentYear} className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
          {Array.from({ length: currentYear - 1980 + 1 }, (_, i) => 1980 + i).map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
        <select onChange={handleMonthChange} value={form.enlistmentMonth} className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {month}월
            </option>
          ))}
        </select>
        <select onChange={handleDayChange} value={form.enlistmentDay} className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
          {days.map((day) => (
            <option key={day} value={day}>
              {day}일
            </option>
          ))}
        </select>
      </div>

      <div className="bg-red-100 text-red-600 text-sm p-2 rounded-lg mb-2">
        ⚠️ 특별한 사유 없이 추후 변경이 불가능하니 신중하게 설정해주세요
      </div>
      <div className="bg-emerald-100 text-emerald-700 text-sm p-2 rounded-lg">
        ℹ️ 현재 공군 대상으로만 서비스 중이에요
      </div>
    </div>
  );
}
