import { ChangeEvent, useEffect, useState } from "react";

interface DatePickerProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DatePicker = ({ date, setDate }: DatePickerProps) => {
  const [days, setDays] = useState<number[]>([]);

  const today = new Date();
  const currentYear = today.getFullYear();

  useEffect(() => {
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }, [date]);

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    setDate(new Date(year, date.getMonth(), date.getDate()));
  };

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const month = Number(e.target.value);
    setDate(new Date(date.getFullYear(), month, date.getDate()));
  };

  const handleDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const day = Number(e.target.value);
    setDate(new Date(date.getFullYear(), date.getMonth(), day));
  };

  return (
    <div className="flex w-full gap-2">
      <select
        onChange={handleYearChange}
        value={date.getFullYear()}
        className="flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {Array.from({ length: currentYear - 1980 + 1 }, (_, i) => 1980 + i).map(
          (year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          )
        )}
      </select>
      <select
        onChange={handleMonthChange}
        value={date.getMonth()}
        className="flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month}>
            {month}월
          </option>
        ))}
      </select>
      <select
        onChange={handleDayChange}
        value={date.getDate()}
        className="flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {days.map((day) => (
          <option key={day} value={day}>
            {day}일
          </option>
        ))}
      </select>
    </div>
  );
};

export default DatePicker;
