import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import SetMember from "../../organisms/signup/SetMember";
import SetPhonePassword from "../../organisms/signup/SetPhonePassword";
import SetNickname from "../../organisms/signup/SetNickname";
import SetTypeAndStartDate from "../../organisms/signup/SetTypeAndStartDate";
import SetDetailDate from "../../organisms/signup/SetDetailDate";
import SetMosAndUnit from "../../organisms/signup/SetMosAndUnit";
import {
  calculateCplDate,
  calculateEndDate,
  calculatePfcDate,
  calculateSgtDate,
} from "../../../utils/calculateDate";

export type SignUpFormType = {
  tel: string;
  password: string;
  nick: string;
  serviceType: number;
  serviceStartDate: Date;
  serviceEndDate: Date;
  servicePfcDate: Date;
  serviceCplDate: Date;
  serviceSgtDate: Date;
  serviceMos: number;
  serviceUnit: number;
};

const today = new Date();
const initialFormState: SignUpFormType = {
  tel: "",
  password: "",
  nick: "",
  serviceType: 1,
  serviceStartDate: today,
  serviceEndDate: calculateEndDate(today),
  servicePfcDate: calculatePfcDate(today),
  serviceCplDate: calculateCplDate(today),
  serviceSgtDate: calculateSgtDate(today),
  serviceMos: -1,
  serviceUnit: -1,
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

  const changedDate = (key: keyof SignUpFormType, date: Date) =>
    setForm((prev) => ({ ...prev, [key]: date }));

  const createAccount = () => {
    signup(
      form.tel,
      form.password,
      form.nick,
      form.serviceType,
      form.serviceStartDate,
      form.servicePfcDate,
      form.serviceCplDate,
      form.serviceSgtDate,
      form.serviceEndDate,
      form.serviceMos,
      form.serviceUnit,
      () => navigate("/")
    );
  };

  const goToNextStep = () => setStep((prev) => prev + 1);
  const goToPreviousStep = () => setStep((prev) => prev - 1);

  // useEffect(() => {
  //   console.log(form);
  // }, [form]);

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen bg-gray-100">
      <div className="flex items-center gap-2 mt-20 mb-4">
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
          step={step}
        />
      </div>
      <div className={`${step === 3 ? "" : "hidden"}`}>
        <SetNickname
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
          step={step}
        />
      </div>
      <div className={`${step === 4 ? "" : "hidden"}`}>
        <SetTypeAndStartDate
          form={form}
          changed={changed}
          changedDate={changedDate}
          setCanProceed={setCanProceed}
          step={step}
        />
      </div>
      <div className={`${step === 5 ? "" : "hidden"}`}>
        <SetDetailDate
          form={form}
          changed={changed}
          changedDate={changedDate}
          setCanProceed={setCanProceed}
          step={step}
        />
      </div>
      <div className={`${step === 6 ? "" : "hidden"}`}>
        <SetMosAndUnit
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
          step={step}
        />
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
          {step < 6 ? (
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
              className={`w-48 py-2 text-lg font-semibold text-white rounded-lg ${
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
