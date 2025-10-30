import { useEffect, useState } from "react";
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

export default function SetDetailDate({
  form,
  setField,
  setCanProceed,
}: Props) {
  const [endDate, setEndDate] = useState<Date>(form.dischargeDate);
  const [pfcDate, setPfcDate] = useState<Date>(form.privateDate);
  const [cplDate, setCplDate] = useState<Date>(form.corporalDate);
  const [sgtDate, setSgtDate] = useState<Date>(form.sergeantDate);

  useEffect(() => {
    setEndDate(calculateEndDate(form.startDate));
    setPfcDate(calculatePfcDate(form.startDate));
    setCplDate(calculateCplDate(form.startDate));
    setSgtDate(calculateSgtDate(form.startDate));
  }, [form.startDate]);

  useEffect(() => setField("dischargeDate", endDate), [endDate]);
  useEffect(() => setField("privateDate", pfcDate), [pfcDate]);
  useEffect(() => setField("corporalDate", cplDate), [cplDate]);
  useEffect(() => setField("sergeantDate", sgtDate), [sgtDate]);

  useEffect(() => {
    const ok =
      form.startDate <= pfcDate &&
      pfcDate <= cplDate &&
      cplDate <= sgtDate &&
      sgtDate <= endDate;
    setCanProceed(ok);
  }, [form.startDate, pfcDate, cplDate, sgtDate, endDate]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-3xl w-[360px]">
      <h2 className="mb-4 text-lg font-bold text-gray-700">전역예정일</h2>
      <DatePicker date={endDate} setDate={setEndDate} />

      <h2 className="mt-4 mb-4 text-lg font-bold text-gray-700">진급일</h2>
      <div className="flex items-center gap-4 mb-4">
        <p className="flex-shrink-0 text-sm min-w-2">일병</p>
        <DatePicker date={pfcDate} setDate={setPfcDate} />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <p className="flex-shrink-0 text-sm min-w-2">상병</p>
        <DatePicker date={cplDate} setDate={setCplDate} />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <p className="flex-shrink-0 text-sm min-w-2">병장</p>
        <DatePicker date={sgtDate} setDate={setSgtDate} />
      </div>
    </div>
  );
}
