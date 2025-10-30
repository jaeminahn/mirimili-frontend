import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../api/postAndPut";
import { useAuth } from "../../contexts/AuthContext";
import SetTypeAndStartDate from "../organisms/detail/SetTypeAndStartDate";
import SetDetailDate from "../organisms/detail/SetDetailDate";
import SetMosAndUnit from "../organisms/detail/SetMosAndUnit";

export type DetailProfileForm = {
  type: "ARMY" | "NAVY" | "AIR_FORCE" | "";
  startDate: Date;
  privateDate: Date;
  corporalDate: Date;
  sergeantDate: Date;
  dischargeDate: Date;
  specialtyId?: number | null;
  unitId?: number | null;
};

const today = new Date();

const initialForm: DetailProfileForm = {
  type: "",
  startDate: today,
  privateDate: today,
  corporalDate: today,
  sergeantDate: today,
  dischargeDate: today,
  specialtyId: null,
  unitId: null,
};

export default function DetailProfile() {
  const [form, setForm] = useState<DetailProfileForm>(initialForm);
  const [step, setStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();
  const { markProfileCompleted } = useAuth();

  const setField = <K extends keyof DetailProfileForm>(k: K, v: DetailProfileForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const fmt = (d: Date) => new Date(d).toISOString().slice(0, 10);

  const submit = async () => {
    const payload = {
      type: form.type,
      startDate: fmt(form.startDate),
      privateDate: fmt(form.privateDate),
      corporalDate: fmt(form.corporalDate),
      sergeantDate: fmt(form.sergeantDate),
      dischargeDate: fmt(form.dischargeDate),
      ...(form.specialtyId !== null && form.specialtyId !== undefined ? { specialtyId: form.specialtyId } : {}),
      ...(form.unitId !== null && form.unitId !== undefined ? { unitId: form.unitId } : {}),
    };
    try {
      const res = await post("/member/profile", payload);
      const result = await res.json().catch(() => ({}));
      if (!res.ok || result?.success === false) {
        alert(result?.message ?? `상세 프로필 저장 실패 (HTTP ${res.status})`);
        return;
      }
      markProfileCompleted();
      localStorage.removeItem("detailProfileModal:dismissed");
      navigate("/");
    } catch {
      alert("상세 프로필 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <div className={`${step === 1 ? "" : "hidden"}`}>
        <SetTypeAndStartDate form={form} setField={setField} setCanProceed={setCanProceed} />
      </div>
      <div className={`${step === 2 ? "" : "hidden"}`}>
        <SetDetailDate form={form} setField={setField} setCanProceed={setCanProceed} />
      </div>
      <div className={`${step === 3 ? "" : "hidden"}`}>
        <SetMosAndUnit form={form} setField={setField} setCanProceed={setCanProceed} />
      </div>

      <div className="flex items-center justify-between mt-4 w-[360px]">
        <button
          onClick={() => (step === 1 ? navigate("/") : setStep((p) => p - 1))}
          className="w-[112px] py-2 text-base font-semibold rounded-3xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
        >
          이전
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep((p) => p + 1)}
            className={`w-[224px] py-2 text-base font-semibold text-white rounded-3xl ${
              canProceed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!canProceed}
          >
            다음
          </button>
        ) : (
          <button
            onClick={submit}
            className={`w-[224px] py-2 text-base font-semibold text-white rounded-3xl ${
              canProceed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!canProceed}
          >
            완료
          </button>
        )}
      </div>
    </div>
  );
}