import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthPhone from "../../organisms/find/AuthPhone";
import ResetPassword from "../../organisms/find/ResetPassword";
import { patchJSON } from "../../../api/postAndPut";

type FindPasswordFormType = {
  tel: string;
  password: string;
};

const initialFormState: FindPasswordFormType = {
  tel: "",
  password: "",
};

export default function FindPassword() {
  const [form, setForm] = useState<FindPasswordFormType>(initialFormState);
  const [step, setStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const setField = <K extends keyof FindPasswordFormType>(
    key: K,
    value: FindPasswordFormType[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const changed =
    (key: keyof FindPasswordFormType) => (e: ChangeEvent<HTMLInputElement>) => {
      const t = e.target as HTMLInputElement;
      setField(key, t.value as any);
    };

  const goToNextStep = () => setStep((prev) => prev + 1);

  const goToPreviousStep = () => {
    if (step === 1) navigate("/auth/login");
    else setStep((prev) => prev - 1);
  };

  const resetPassword = () => {
    const tel = form.tel.replace(/-/g, "");
    patchJSON("/member/password", {
      phoneNumber: tel,
      newPassword: form.password,
    })
      .then(({ ok, data, status }) => {
        if (!ok || data?.success === false) {
          throw new Error((data as any)?.message || `HTTP ${status}`);
        }
        setDone(true);
      })
      .catch((err) => {
        alert(err?.message || "비밀번호 재설정에 실패했습니다.");
      });
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
        <div className="w-[360px] h-[150px] bg-white rounded-3xl pt-9 pb-9 px-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-extrabold text-gray-800 mb-6">
            비밀번호 재설정 완료!
          </h2>
          <p className="text-sm text-gray-500">
            아래 버튼을 눌러 로그인 해주세요.
          </p>
        </div>
        <button
          onClick={() => navigate("/auth/login")}
          className="w-[360px] h-[48px] mt-6 rounded-xl px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
        >
          로그인
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <div className={`${step === 1 ? "" : "hidden"}`}>
        <AuthPhone
          tel={form.tel}
          changed={changed}
          setCanProceed={setCanProceed}
          step={step}
        />
      </div>
      <div className={`${step === 2 ? "" : "hidden"}`}>
        <ResetPassword
          password={form.password}
          changed={changed}
          setCanProceed={setCanProceed}
          step={step}
        />
      </div>

      {step >= 1 && (
        <div className="flex items-center justify-between mt-4 w-[360px]">
          <button
            onClick={goToPreviousStep}
            className="w-[112px] py-2 text-base font-semibold rounded-3xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
          >
            이전
          </button>

          {step < 2 ? (
            <button
              onClick={goToNextStep}
              className={`w-[224px] py-2 text-base font-semibold text-white rounded-3xl ${
                canProceed
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!canProceed}
            >
              다음
            </button>
          ) : (
            <button
              onClick={resetPassword}
              className={`w-[224px] py-2 text-base font-semibold text-white rounded-3xl ${
                canProceed
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!canProceed}
            >
              완료
            </button>
          )}
        </div>
      )}
    </div>
  );
}
