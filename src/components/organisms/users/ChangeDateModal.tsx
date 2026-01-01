import { useEffect, useMemo, useState } from "react";
import DatePicker from "../../molecules/DatePicker";

type Props = {
  closeModal: () => void;
  disabled?: boolean;
  initialData: {
    privateDate: string;
    corporalDate: string;
    sergeantDate: string;
    dischargeDate: string;
  };
  onSubmit: (dates: {
    privateDate: string;
    corporalDate: string;
    sergeantDate: string;
    dischargeDate: string;
  }) => void;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const toYmd = (d: Date) => {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
};

const parseYmdOrToday = (s: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((s ?? "").trim());
  if (!m) return new Date();
  const y = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);
  return new Date(y, mm - 1, dd);
};

export default function ChangeDateModal({
  closeModal,
  disabled,
  initialData,
  onSubmit,
}: Props) {
  const [privateDt, setPrivateDt] = useState<Date>(new Date());
  const [corporalDt, setCorporalDt] = useState<Date>(new Date());
  const [sergeantDt, setSergeantDt] = useState<Date>(new Date());
  const [dischargeDt, setDischargeDt] = useState<Date>(new Date());

  useEffect(() => {
    setPrivateDt(parseYmdOrToday(initialData.privateDate));
    setCorporalDt(parseYmdOrToday(initialData.corporalDate));
    setSergeantDt(parseYmdOrToday(initialData.sergeantDate));
    setDischargeDt(parseYmdOrToday(initialData.dischargeDate));
  }, [
    initialData.privateDate,
    initialData.corporalDate,
    initialData.sergeantDate,
    initialData.dischargeDate,
  ]);

  const payload = useMemo(
    () => ({
      privateDate: toYmd(privateDt),
      corporalDate: toYmd(corporalDt),
      sergeantDate: toYmd(sergeantDt),
      dischargeDate: toYmd(dischargeDt),
    }),
    [privateDt, corporalDt, sergeantDt, dischargeDt]
  );

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={disabled ? undefined : closeModal}
      />
      <div className="relative w-[360px] bg-white rounded-3xl p-6">
        <button
          className="absolute right-4 top-4 text-2xl leading-none"
          aria-label="close"
          onClick={closeModal}
          disabled={disabled}
        >
          ×
        </button>

        <h2 className="text-lg font-extrabold text-gray-800 mb-6 mt-10">
          진급일 및 전역(예정)일 변경
        </h2>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">일병 진급일</p>
            <DatePicker date={privateDt} setDate={setPrivateDt} />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">상병 진급일</p>
            <DatePicker date={corporalDt} setDate={setCorporalDt} />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">병장 진급일</p>
            <DatePicker date={sergeantDt} setDate={setSergeantDt} />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">전역(예정)일</p>
            <DatePicker date={dischargeDt} setDate={setDischargeDt} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="w-full h-[48px] rounded-3xl px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-60"
          >
            변경
          </button>
        </div>
      </div>
    </div>
  );
}
