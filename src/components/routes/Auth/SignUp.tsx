import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import PhoneAndPasswordSetup from "../../organisms/signup/PhoneAndPasswordSetup";
import NicknameSetup from "../../organisms/signup/NicknameSetup";

export type SignUpFormType = {
  phone: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  isCodeValid: boolean;
};

const initialFormState: SignUpFormType = {
  phone: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  isCodeValid: false,
};

export default function SignUp() {
  const [form, setForm] = useState<SignUpFormType>(initialFormState);
  const [step, setStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const changed = (key: keyof SignUpFormType) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const createAccount = () => {
    if (form.isCodeValid) {
      signup(form.phone, form.password, () => navigate("/"));
    }
  };

  const goToNextStep = () => setStep((prev) => prev + 1);
  const goToPreviousStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      {step === 1 && (
        <PhoneAndPasswordSetup
          form={form}
          changed={changed}
          onCodeValid={(isValid) => setForm((prev) => ({ ...prev, isCodeValid: isValid }))}
          setCanProceed={setCanProceed} // 버튼 활성화 상태 업데이트
        />
      )}
      {step === 2 && <NicknameSetup form={form} changed={changed} />}

      <div className="flex justify-between items-center w-80 mt-4">
        <button onClick={goToPreviousStep} className="w-24 py-2 text-lg font-semibold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-300">
          이전
        </button>
        {step < 2 ? (
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
          <button onClick={createAccount} className="w-48 py-2 text-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
            완료
          </button>
        )}
      </div>
    </div>
  );
}
