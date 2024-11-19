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

  const changed = (key: keyof SignUpFormType) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  const goToPreviousStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      {step === 1 && (
        <SetMember
          form={form}
          changed={changed}
          goToNextStep={goToNextStep}
        />
      )}
      {step === 2 && (
        <SetPhonePassword
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
        />
      )}
      {step === 3 && (
        <SetNickname
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
        />
      )}
      {step === 4 && (
        <SetType 
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
        />
      )}

      {step > 1 && (
        <div className="flex justify-between items-center w-80 mt-4">
          {step > 1 && (
            <button
              onClick={goToPreviousStep}
              className="w-24 py-2 text-lg font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-300"
            >
              이전
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={goToNextStep}
              className={`w-48 py-2 text-lg font-semibold text-white rounded-lg ${
                canProceed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!canProceed}
            >
              다음
            </button>
          ) : (
            <button
              onClick={createAccount}
              className="w-48 py-2 text-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
            >
              완료
            </button>
          )}
        </div>
      )}
    </div>
  );
}
