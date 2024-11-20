import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import SetMember from "../../organisms/signup/SetMember";
import SetPhonePassword from "../../organisms/signup/SetPhonePassword";
import SetNickname from "../../organisms/signup/SetNickname";
import SetType from "../../organisms/signup/SetType";

export type SignUpFormType = {
  phone: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  serviceType: string;
  enlistmentYear: string;
  enlistmentMonth: string;
  enlistmentDay: string;
};

const today = new Date();
const initialFormState: SignUpFormType = {
  phone: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  serviceType: "공군",
  enlistmentYear: today.getFullYear().toString(),
  enlistmentMonth: (today.getMonth() + 1).toString(),
  enlistmentDay: today.getDate().toString(),
};

export default function SignUp() {
  const [form, setForm] = useState<SignUpFormType>(initialFormState);
  const [step, setStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const changed =
    (key: keyof SignUpFormType) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const createAccount = () => {
    signup(
      form.phone,
      form.password,
      form.nickname,
      form.serviceType,
      form.enlistmentYear,
      form.enlistmentMonth,
      form.enlistmentDay,
      () => navigate("/")
    );
  };

  const goToNextStep = () => setStep((prev) => prev + 1);
  const goToPreviousStep = () => {
    setStep((prev) => prev - 1);
    setCanProceed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <p className="text-base text-gray-500 font-get">
          똑똑한 입대, 후회없는 군생활
        </p>
        <p className="text-2xl text-emerald-600 font-get">미리밀리</p>
      </div>
      <div className={`${step === 1 ? "" : "hidden"}`}>
        <SetMember form={form} changed={changed} goToNextStep={goToNextStep} />
      </div>
      <div className={`${step === 2 ? "" : "hidden"}`}>
        <SetPhonePassword
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
        />
      </div>
      <div className={`${step === 3 ? "" : "hidden"}`}>
        <SetNickname
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
        />
      </div>
      <div className={`${step === 4 ? "" : "hidden"}`}>
        <SetType form={form} changed={changed} setCanProceed={setCanProceed} />
      </div>
      {step > 1 && (
        <div className="flex items-center justify-between mt-4 w-80">
          {step > 1 && (
            <button
              onClick={goToPreviousStep}
              className="w-24 py-2 text-lg font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-300"
            >
              이전
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={goToNextStep}
              className={`w-48 py-2 text-lg font-semibold text-white rounded-lg ${
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
              onClick={createAccount}
              className="w-48 py-2 text-lg font-semibold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
            >
              완료
            </button>
          )}
        </div>
      )}
    </div>
  );
}
