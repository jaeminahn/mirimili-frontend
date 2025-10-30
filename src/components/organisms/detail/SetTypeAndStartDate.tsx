import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import DatePicker from "../../molecules/DatePicker";
import {
  calculateCplDate,
  calculateEndDate,
  calculatePfcDate,
  calculateSgtDate,
} from "../../../utils/calculateDate";
import { DetailProfileForm } from "../../routes/DetailProfile";

type Props = {
  form: DetailProfileForm;
  setField: <K extends keyof DetailProfileForm>(
    k: K,
    v: DetailProfileForm[K]
  ) => void;
  setCanProceed: (v: boolean) => void;
};

const types = [
  { key: "ARMY", label: "육군", enabled: false },
  { key: "NAVY", label: "해군", enabled: false },
  { key: "AIR_FORCE", label: "공군", enabled: true },
] as const;

export default function SetTypeAndStartDate({
  form,
  setField,
  setCanProceed,
}: Props) {
  const [startDate, setStartDate] = useState<Date>(form.startDate);
  const [type, setType] = useState<DetailProfileForm["type"]>(form.type);

  useEffect(() => {
    setField("startDate", startDate);
    setField("privateDate", calculatePfcDate(startDate));
    setField("corporalDate", calculateCplDate(startDate));
    setField("sergeantDate", calculateSgtDate(startDate));
    setField("dischargeDate", calculateEndDate(startDate));
  }, [startDate]);

  useEffect(() => {
    setField("type", type);
    setCanProceed(type !== "" && startDate instanceof Date);
  }, [type, startDate]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-3xl w-[360px]">
      <h2 className="mb-4 text-lg font-bold text-gray-700">복무 형태 설정</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map((t) => (
          <button
            key={t.key}
            onClick={() => t.enabled && setType(t.key as any)}
            className={`px-2 py-2 rounded-lg text-sm border-2 ${
              type === t.key
                ? "bg-emerald-100 border-emerald-600 font-semibold"
                : "bg-gray-100 border-gray-100 font-medium"
            } cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={!t.enabled}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-bold text-gray-700">입대일</h2>
      <DatePicker date={startDate} setDate={setStartDate} />

      <div className="flex items-center gap-4 p-2 px-4 mt-4 mb-2 text-sm text-red-600 bg-red-100 rounded-lg">
        <Icon icon="fluent:warning-28-filled" className="text-3xl" />
        특별한 사유 없이 추후 변경이 불가능하니 신중하게 설정해주세요
      </div>
      <div className="flex items-center gap-4 p-2 px-4 text-sm rounded-lg bg-emerald-100 text-emerald-600">
        <Icon icon="fluent:info-28-filled" className="text-2xl" />
        현재 공군 대상으로만 서비스 중이에요
      </div>
    </div>
  );
}
