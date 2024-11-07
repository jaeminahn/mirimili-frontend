import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";

type SignUpFormType = {
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
  const navigate = useNavigate();
  const { signup } = useAuth();

  const changed = useCallback((key: keyof SignUpFormType) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }, []);

  const createAccount = useCallback(() => {
    if (form.isCodeValid) {
      signup(form.phone, form.password, () => navigate("/"));
    }
  }, [form.phone, form.password, form.isCodeValid, navigate, signup]);

  const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/.test(form.password);
  const isPasswordConfirmed = form.password === form.confirmPassword;
  const canProceed = isPasswordValid && isPasswordConfirmed && form.isCodeValid;

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <PhoneAndPasswordSetup
        form={form}
        changed={changed}
        isPasswordValid={isPasswordValid}
        isPasswordConfirmed={isPasswordConfirmed}
        onCodeValid={(isValid) => setForm((prev) => ({ ...prev, isCodeValid: isValid }))}
      />
      <div className="flex justify-between items-center w-80 mt-4">
        <button className="w-24 py-2 text-lg font-semibold text-emerald-700 bg-emerald-200 rounded-lg hover:bg-emerald-300">
          이전
        </button>
        <button
          onClick={createAccount}
          className={`w-48 py-2 text-lg font-semibold text-white rounded-lg ${
            canProceed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!canProceed}
        >
          다음
        </button>
      </div>
    </div>
  );
}

type PhoneAndPasswordSetupProps = {
  form: SignUpFormType;
  changed: (key: keyof SignUpFormType) => (e: ChangeEvent<HTMLInputElement>) => void;
  isPasswordValid: boolean;
  isPasswordConfirmed: boolean;
  onCodeValid: (isValid: boolean) => void;
};

function PhoneAndPasswordSetup({
  form,
  changed,
  isPasswordValid,
  isPasswordConfirmed,
  onCodeValid,
}: PhoneAndPasswordSetupProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue =
      value.length > 7
        ? `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
        : value.length > 3
        ? `${value.slice(0, 3)}-${value.slice(3)}`
        : value;

    changed("phone")({ target: { value: formattedValue } } as ChangeEvent<HTMLInputElement>);
  };

  const handleSendCode = async () => {
    const isValidPhone = form.phone.replace(/-/g, "").length === 11;
    if (!isValidPhone) {
      setPhoneError("유효한 전화번호를 입력해주세요.");
      setIsCodeSent(false);
      setVerificationMessage("");
      setSuccessMessage("");
      return;
    }

    const response = await fetch('/api/send-verification-code', { 
      method: 'POST', 
      body: JSON.stringify({ phone: form.phone }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (true) {
      setIsCodeSent(true);
      setPhoneError("");
      setSuccessMessage("인증번호가 전송되었어요.");
      setVerificationMessage("");
    } else {
      setPhoneError("인증번호 전송에 실패했어요.");
      setSuccessMessage("");
    }
  };

  const handleVerifyCode = () => {
    const isCodeValid = form.verificationCode === "7777"; 
    setVerificationMessage(isCodeValid ? "인증번호가 일치해요." : "인증번호가 일치하지 않아요.");
    onCodeValid(isCodeValid);
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-80">
      <h2 className="text-2xl text-700 mb-6">전화번호 인증</h2>
      
      <div className="relative flex items-center mb-2 w-full">
        <input
          type="text"
          className="flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="전화번호 입력"
          value={form.phone}
          onChange={handlePhoneChange}
          disabled={isCodeSent}
        />
        <button
          onClick={handleSendCode}
          className="absolute right-2 p-1 text-xs bg-gray-100 text-gray rounded-full hover:bg-gray-200"
          disabled={isCodeSent}
        >
          인증번호 전송
        </button>
      </div>
      {phoneError && <div className="text-xs text-red-500 mb-2">{phoneError}</div>}
      {successMessage && <div className="text-xs text-green-500 mb-2">{successMessage}</div>}
      
      <div className="relative flex items-center mb-2 w-full">
        <input
          type="text"
          className="flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="인증번호 입력"
          value={form.verificationCode}
          onChange={changed("verificationCode")}
          disabled={!isCodeSent}
        />
        <button
          onClick={handleVerifyCode}
          className="absolute right-2 p-1 text-xs bg-gray-100 text-gray rounded-full hover:bg-gray-200"
          disabled={!isCodeSent}
        >
          인증하기
        </button>
      </div>

      {verificationMessage && (
        <div className={`text-xs mb-2 ${form.isCodeValid ? "text-green-500" : "text-red-500"}`}>
          {verificationMessage}
        </div>
      )}

      <h2 className="text-2xl text-700 mt-6 mb-6">비밀번호</h2>

      <input
        type="password"
        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-2"
        placeholder="비밀번호 입력"
        value={form.password}
        onChange={changed("password")}
      />
      <PasswordValidationMessage password={form.password} isValid={isPasswordValid} />
      
      <input
        type="password"
        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-2"
        placeholder="비밀번호 확인"
        value={form.confirmPassword}
        onChange={changed("confirmPassword")}
      />
      <PasswordConfirmationMessage confirmPassword={form.confirmPassword} password={form.password} />
    </div>
  );
}

function PasswordValidationMessage({ password, isValid }: { password: string; isValid: boolean }) {
  return password ? (
    isValid ? (
      <div className="text-xs mb-2 text-green-500">사용할 수 있는 비밀번호예요.</div>
    ) : (
      <div className="text-xs mb-2 text-red-500">8~16자, 영문·숫자·특수문자를 포함해야 해요.</div>
    )
  ) : null;
}

function PasswordConfirmationMessage({ confirmPassword, password }: { confirmPassword: string; password: string }) {
  return confirmPassword ? (
    confirmPassword === password ? (
      <div className="text-xs mb-4 text-green-500">비밀번호가 일치해요.</div>
    ) : (
      <div className="text-xs mb-4 text-red-500">비밀번호가 일치하지 않아요.</div>
    )
  ) : null;
}
