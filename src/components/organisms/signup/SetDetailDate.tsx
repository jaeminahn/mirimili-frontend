import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import ServiceType from "../../../data/serviceType.json";
import DatePicker from "../../molecules/DatePicker";

type SetDetailDateProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  changedDate: (key: keyof SignUpFormType, date: Date) => void;
  setCanProceed: (value: boolean) => void;
};

export default function SetDetailDate({
  form,
  changed,
  changedDate,
  setCanProceed,
}: SetDetailDateProps) {
  const [endDate, setEndDate] = useState(new Date());
  const [pfcDate, setPfcDate] = useState(new Date());
  const [cplDate, setCplDate] = useState(new Date());
  const [sgtDate, setSgtDate] = useState(new Date());

  useEffect(() => {
    changedDate("serviceEndDate", endDate);
  }, [endDate]);
  useEffect(() => {
    changedDate("servicePfcDate", pfcDate);
  }, [pfcDate]);
  useEffect(() => {
    changedDate("serviceCplDate", cplDate);
  }, [cplDate]);
  useEffect(() => {
    changedDate("serviceSgtDate", sgtDate);
  }, [sgtDate]);

  useEffect(() => {
    setCanProceed(form.serviceEndDate !== null);
  }, [form.serviceType, setCanProceed]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-96">
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
