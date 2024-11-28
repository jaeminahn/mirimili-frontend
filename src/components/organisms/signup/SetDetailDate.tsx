import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import ServiceType from "../../../data/serviceType.json";
import DatePicker from "../../molecules/DatePicker";
import {
  calculateCplDate,
  calculateEndDate,
  calculatePfcDate,
  calculateSgtDate,
} from "../../../utils/calculateDate";

type SetDetailDateProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  changedDate: (key: keyof SignUpFormType, date: Date) => void;
  setCanProceed: (value: boolean) => void;
  step: number;
};

export default function SetDetailDate({
  form,
  changed,
  changedDate,
  setCanProceed,
  step,
}: SetDetailDateProps) {
  const [endDate, setEndDate] = useState(form.serviceEndDate);
  const [pfcDate, setPfcDate] = useState(form.servicePfcDate);
  const [cplDate, setCplDate] = useState(form.serviceCplDate);
  const [sgtDate, setSgtDate] = useState(form.serviceSgtDate);

  useEffect(() => {
    setEndDate(calculateEndDate(form.serviceStartDate));
  }, [form.serviceStartDate]);
  useEffect(() => {
    changedDate("serviceEndDate", endDate);
  }, [endDate]);
  useEffect(() => {
    setPfcDate(calculatePfcDate(form.serviceStartDate));
  }, [form.serviceStartDate]);
  useEffect(() => {
    changedDate("servicePfcDate", pfcDate);
  }, [pfcDate]);
  useEffect(() => {
    setCplDate(calculateCplDate(form.serviceStartDate));
  }, [form.serviceStartDate]);
  useEffect(() => {
    changedDate("serviceCplDate", cplDate);
  }, [cplDate]);
  useEffect(() => {
    setSgtDate(calculateSgtDate(form.serviceStartDate));
  }, [form.serviceStartDate]);
  useEffect(() => {
    changedDate("serviceSgtDate", sgtDate);
  }, [sgtDate]);

  useEffect(() => {
    if (step !== 5) return;
    setCanProceed(
      form.serviceStartDate <= form.servicePfcDate &&
        form.servicePfcDate <= form.serviceCplDate &&
        form.serviceCplDate <= form.serviceSgtDate &&
        form.serviceSgtDate <= form.serviceEndDate
    );
  }, [
    form.servicePfcDate,
    form.serviceCplDate,
    form.serviceSgtDate,
    form.serviceEndDate,
    step,
  ]);

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
