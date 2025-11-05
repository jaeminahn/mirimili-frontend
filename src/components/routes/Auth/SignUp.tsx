import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ServiceTypeE } from "../../../contexts/AuthContext";
import TermsandConditions from "../../organisms/signup/TermsandConditions";
import SetMember from "../../organisms/signup/SetMember";
import SetPhonePassword from "../../organisms/signup/SetPhonePassword";
import SetNickname from "../../organisms/signup/SetNickname";
import partyImg from "../../../images/party.png";

export type SignUpFormType = {
  serviceAgreed: boolean;
  privacyPolicyAgreed: boolean;
  marketingConsentAgreed: boolean;
  memberType: number;
  tel: string;
  password: string;
  nick: string;
  serviceType?: ServiceTypeE;
};

const initialFormState: SignUpFormType = {
  serviceAgreed: false,
  privacyPolicyAgreed: false,
  marketingConsentAgreed: false,
  memberType: -1,
  tel: "",
  password: "",
  nick: "",
  serviceType: undefined,
};

export default function SignUp() {
  const [form, setForm] = useState<SignUpFormType>(initialFormState);
  const [step, setStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const setField = <K extends keyof SignUpFormType>(
    key: K,
    value: SignUpFormType[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const changed =
    (key: keyof SignUpFormType) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const t = e.target as HTMLInputElement;
      if (
        key === "serviceAgreed" ||
        key === "privacyPolicyAgreed" ||
        key === "marketingConsentAgreed"
      ) {
        return setField(key, t.checked as any);
      }
      if (key === "memberType") {
        return setField(key, Number(t.value) as any);
      }
      if (key === "serviceType") {
        return setField(key, t.value as ServiceTypeE as any);
      }
      return setField(key, t.value as any);
    };

  const memberToService = (v: number): ServiceTypeE | undefined =>
    v === 0
      ? ServiceTypeE.PRE_ENLISTED
      : v === 1
      ? ServiceTypeE.ENLISTED
      : v === 2
      ? ServiceTypeE.DISCHARGED
      : undefined;

  const createAccount = () => {
    const resolvedService =
      form.serviceType ?? memberToService(form.memberType);
    signup(
      {
        serviceAgreed: form.serviceAgreed,
        privacyPolicyAgreed: form.privacyPolicyAgreed,
        marketingConsentAgreed: form.marketingConsentAgreed,
        tel: form.tel,
        password: form.password,
        nick: form.nick,
        serviceType: resolvedService,
      },
      () => setDone(true)
    );
  };

  const resetFromStep = (start: number) => {
    setForm((prev) => {
      const next = { ...prev };
      if (start <= 1) {
        next.serviceAgreed = false;
        next.privacyPolicyAgreed = false;
        next.marketingConsentAgreed = false;
      }
      if (start <= 2) {
        next.memberType = -1;
        next.serviceType = undefined;
      }
      if (start <= 3) {
        next.tel = "";
        next.password = "";
      }
      if (start <= 4) {
        next.nick = "";
      }
      return next;
    });
  };

  const goToNextStep = () => {
    setCanProceed(false);
    setStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    if (step === 1) {
      navigate("/auth/login");
    } else {
      const targetStep = step - 1;
      resetFromStep(step);
      setCanProceed(false);
      setStep(targetStep);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
        <div className="w-[360px] h-[348px] bg-white rounded-3xl pt-9 pb-9 px-6 flex flex-col items-center justify-center text-center">
          <img
            src={partyImg}
            alt="축하 폭죽"
            className="w-[100px] h-[100px] mb-6"
          />
          <h2 className="text-xl font-extrabold text-gray-800 mb-6">
            회원가입 완료!
          </h2>
          <p className="text-sm text-gray-500">
            미리밀리와 똑똑한 입대,
            <br />
            후회없는 군생활 하세요😊
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
      {step === 1 && (
        <TermsandConditions
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
          step={step}
        />
      )}
      {step === 2 && (
        <SetMember
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
          step={step}
        />
      )}
      {step === 3 && (
        <SetPhonePassword
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
          step={step}
        />
      )}
      {step === 4 && (
        <SetNickname
          form={form}
          changed={changed}
          setCanProceed={setCanProceed}
          step={step}
        />
      )}

      {step >= 1 && (
        <div className="flex items-center justify-between mt-4 w-[360px]">
          {step >= 1 && (
            <button
              onClick={goToPreviousStep}
              className="w-[112px] py-2 text-base font-semibold rounded-3xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
            >
              이전
            </button>
          )}
          {step < 4 ? (
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
              onClick={createAccount}
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
