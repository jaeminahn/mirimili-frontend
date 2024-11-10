import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";

type PhoneAndPasswordSetupProps = {
  form: SignUpFormType;
  changed: (key: keyof SignUpFormType) => (e: ChangeEvent<HTMLInputElement>) => void;
  setCanProceed: (value: boolean) => void;
};

export default function PhoneAndPasswordSetup({ form, changed, setCanProceed }: PhoneAndPasswordSetupProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/.test(form.password);
    const isPasswordConfirmed = form.password === form.confirmPassword;
    setCanProceed(isPasswordValid && isPasswordConfirmed && isCodeValid);
  }, [form.password, form.confirmPassword, isCodeValid, setCanProceed]);

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

    setIsCodeSent(true);
    setPhoneError("");
    setSuccessMessage("인증번호가 전송되었어요.");
    setVerificationMessage("");
  };

  const handleVerifyCode = () => {
    const codeIsValid = form.verificationCode === "7777"; 
    setVerificationMessage(codeIsValid ? "인증번호가 일치해요." : "인증번호가 일치하지 않아요.");
    setIsCodeValid(codeIsValid); // 내부 상태 업데이트
  };

  const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/.test(form.password);
  const isPasswordConfirmed = form.password === form.confirmPassword;

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-80">
      <h2 className="text-lg font-bold text-gray-700 mb-6">전화번호 인증</h2>
      
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
          className="absolute right-2 p-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
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
          className="absolute right-2 p-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          disabled={!isCodeSent}
        >
          인증하기
        </button>
      </div>

      {verificationMessage && (
        <div className={`text-xs mb-2 ${isCodeValid ? "text-green-500" : "text-red-500"}`}>
          {verificationMessage}
        </div>
      )}

      <h2 className="text-lg font-bold text-gray-700 mt-4 mb-6">비밀번호</h2>

      <input
        type="password"
        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-2"
        placeholder="비밀번호 입력"
        value={form.password}
        onChange={changed("password")}
      />
      {form.password && (
        <div className={`text-xs mb-2 ${isPasswordValid ? "text-green-500" : "text-red-500"}`}>
          {isPasswordValid ? "사용할 수 있는 비밀번호예요." : "8~16자, 영문·숫자·특수문자를 포함해야 해요."}
        </div>
      )}

      <input
        type="password"
        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-2"
        placeholder="비밀번호 확인"
        value={form.confirmPassword}
        onChange={changed("confirmPassword")}
      />
      {form.confirmPassword && (
        <div className={`text-xs mb-2 ${isPasswordConfirmed ? "text-green-500" : "text-red-500"}`}>
          {isPasswordConfirmed ? "비밀번호가 일치해요." : "비밀번호가 일치하지 않아요."}
        </div>
      )}
    </div>
  );
}
