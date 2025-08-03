import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import ServiceType from "../../../data/serviceType.json";
import DatePicker from "../../molecules/DatePicker";
import { Icon } from "@iconify/react";
import {
  calculateCplDate,
  calculateEndDate,
  calculatePfcDate,
  calculateSgtDate,
} from "../../../utils/calculateDate";

type SetTypeAndStartDateProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  changedDate: (key: keyof SignUpFormType, date: Date) => void;
  setCanProceed: (value: boolean) => void;
  step: number;
};

export default function SetTypeAndStartDate({
  form,
  changed,
  changedDate,
  setCanProceed,
  step,
}: SetTypeAndStartDateProps) {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    changedDate("serviceStartDate", startDate);
    changedDate("servicePfcDate", calculatePfcDate(startDate));
    changedDate("serviceCplDate", calculateCplDate(startDate));
    changedDate("serviceSgtDate", calculateSgtDate(startDate));
    changedDate("serviceEndDate", calculateEndDate(startDate));
  }, [startDate]);

  useEffect(() => {
    if (step !== 4) return;
    setCanProceed(form.serviceType !== 0);
  }, [step]);

  const handleServiceTypeSelect = (typeId: number) => {
    changed("serviceType")({
      target: { value: typeId },
    } as unknown as ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-3xl w-[360px]">
      <h2 className="mb-4 text-lg font-bold text-gray-700">복무 형태 설정</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {ServiceType.map((type) => (
          <button
            key={type.label}
            onClick={() => handleServiceTypeSelect(type.id)}
            className={`px-2 py-2 rounded-lg text-sm border-2 ${
              form.serviceType === type.id
                ? "bg-emerald-100  border-emerald-600 font-semibold"
                : "bg-gray-100 border-gray-100 font-medium"
            } cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={type.id !== 1}
          >
            {type.label}
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
