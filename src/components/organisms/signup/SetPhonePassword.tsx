import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import { post } from "../../../api";

type SetPhonePasswordProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  setCanProceed: (value: boolean) => void;
  step: number;
};

export default function SetPhonePassword({
  form,
  changed,
  setCanProceed,
  step,
}: SetPhonePasswordProps) {
  const [formattedValue, setFormmattedValue] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  useEffect(() => {
    setIsPasswordValid(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/.test(form.password)
    );
    setIsPasswordConfirmed(form.password === confirmPassword);
  }, [form.password, confirmPassword]);

  useEffect(() => {
    if (step !== 2) return;
    setCanProceed(isCodeValid && isPasswordValid && isPasswordConfirmed);
  }, [isCodeValid, isPasswordValid, isPasswordConfirmed, step]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormmattedValue(
      value.length > 7
        ? `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
        : value.length > 3
        ? `${value.slice(0, 3)}-${value.slice(3)}`
        : value
    );
    changed("tel")({
      target: { value: value },
    } as ChangeEvent<HTMLInputElement>);
  };

  const handleSendCode = () => {
    const tel = form.tel.replace(/-/g, "");
    const isValidPhone = tel.length === 11;
    if (!isValidPhone) {
      setPhoneError("유효한 전화번호를 입력해주세요");
      setIsCodeSent(false);
      setVerificationMessage("");
      setSuccessMessage("");
      return;
    }
    post("/auth/join/send-code", { tel })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "user exist") {
          setIsCodeSent(false);
          setPhoneError("동일한 전화번호의 사용자가 존재해요");
          setVerificationMessage("");
        } else if (result.message === "Send Success") {
          setIsCodeSent(true);
          setPhoneError("");
          setSuccessMessage("인증번호가 전송되었어요");
          setVerificationMessage("");
        } else alert(result.message);
      });
  };

  const handleVerifyCode = () => {
    const tel = form.tel.replace(/-/g, "");
    const code = verificationCode;
    if (code.length !== 6) {
      setIsCodeValid(false);
      setVerificationMessage("인증번호 6자리를 입력해주세요");
      return;
    }
    post("/auth/join/validate-code", { tel, code })
      .then((res) => res.json())
      .then((result) => {
        const _isCodeValid = result.message === "Validation Success";
        setIsCodeValid(_isCodeValid);
        setVerificationMessage(
          _isCodeValid ? "인증번호가 일치해요" : "인증번호가 일치하지 않아요"
        );
      });
  };

  return (
    <div className="flex flex-col px-6 py-9 bg-white rounded-3xl w-[360px]">
      <h2 className="mb-3 text-lg font-bold text-gray-700">전화번호</h2>
      <div className="mb-4">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            className={`flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              isCodeSent ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            placeholder="전화번호 입력"
            value={formattedValue}
            onChange={handlePhoneChange}
            disabled={isCodeSent}
          />
          <button
            onClick={handleSendCode}
            className={`absolute px-3 py-2 text-xs text-gray-700 bg-gray-100 rounded-lg right-2 hover:bg-gray-200 ${
              isCodeSent ? "cursor-not-allowed" : ""
            }`}
            disabled={isCodeSent}
          >
            인증번호 전송
          </button>
        </div>
        {phoneError && (
          <div className="mt-2 ml-2 text-xs text-orange-500">{phoneError}</div>
        )}
        {successMessage && (
          <div className="mt-2 ml-2 text-xs text-green-500">
            {successMessage}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            className={`flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              isCodeValid ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            placeholder="인증번호 입력"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={!isCodeSent || isCodeValid}
          />
          <button
            onClick={handleVerifyCode}
            className={`absolute px-3 py-2 text-xs text-gray-700 bg-gray-100 rounded-lg right-2 hover:bg-gray-200 ${
              !isCodeSent || isCodeValid ? "cursor-not-allowed" : ""
            }`}
            disabled={!isCodeSent || isCodeValid}
          >
            인증하기
          </button>
        </div>
        {verificationMessage && (
          <div
            className={`mt-2 ml-2 text-xs ${
              isCodeValid ? "text-green-500" : "text-orange-500"
            }`}
          >
            {verificationMessage}
          </div>
        )}
      </div>

      <h2 className="mt-4 mb-3 text-lg font-bold text-gray-700">비밀번호</h2>
      <div className="mb-4">
        <div className="relative flex flex-row items-center justify-between">
          <input
            type={isPasswordVisible ? "text" : "password"}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="비밀번호 입력"
            value={form.password}
            onChange={changed("password")}
          />
        </div>
        {form.password && (
          <div
            className={`mt-2 ml-2 text-xs ${
              isPasswordValid ? "text-green-500" : "text-orange-500"
            }`}
          >
            {isPasswordValid
              ? "사용할 수 있는 비밀번호예요"
              : "8~16자, 영문·숫자·특수문자를 포함해야 해요"}
          </div>
        )}
      </div>

      <div className="mb-2">
        <input
          type="password"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPassword && (
          <div
            className={`mt-2 ml-2 text-xs ${
              isPasswordConfirmed ? "text-green-500" : "text-orange-500"
            }`}
          >
            {isPasswordConfirmed
              ? "비밀번호가 일치해요"
              : "비밀번호가 일치하지 않아요"}
          </div>
        )}
      </div>
    </div>
  );
}
