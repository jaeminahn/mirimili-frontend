import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import { post } from "../../../api";
import { Icon } from "@iconify/react";

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
    console.log(isCodeValid, isPasswordValid, isPasswordConfirmed);
  }, [isCodeValid, isPasswordValid, isPasswordConfirmed, step]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue =
      value.length > 7
        ? `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
        : value.length > 3
        ? `${value.slice(0, 3)}-${value.slice(3)}`
        : value;
    changed("phone")({
      target: { value: formattedValue },
    } as ChangeEvent<HTMLInputElement>);
  };

  const handleSendCode = () => {
    const tel = form.phone.replace(/-/g, "");
    const isValidPhone = tel.length === 11;
    if (!isValidPhone) {
      setPhoneError("유효한 전화번호를 입력해주세요.");
      setIsCodeSent(false);
      setVerificationMessage("");
      setSuccessMessage("");
      return;
    }
    post("/auth/join/send-code", { tel })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.message === "Send Success") {
          setIsCodeSent(true);
          setPhoneError("");
          setSuccessMessage("인증번호가 전송되었어요.");
          setVerificationMessage("");
        } else alert(result.message);
      });
  };

  const handleVerifyCode = () => {
    const tel = form.phone.replace(/-/g, "");
    const code = verificationCode;
    if (code.length !== 6) {
      setIsCodeValid(false);
      setVerificationMessage("인증번호 6자리를 입력해주세요.");
      return;
    }
    post("/auth/join/validate-code", { tel, code })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const _isCodeValid = result.message === "Validation Success";
        setIsCodeValid(_isCodeValid);
        setVerificationMessage(
          _isCodeValid ? "인증번호가 일치해요." : "인증번호가 일치하지 않아요."
        );
      });
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-96">
      <h2 className="mb-6 text-lg font-bold text-gray-700">전화번호 인증</h2>
      <div className="relative flex items-center w-full mb-2">
        <input
          type="text"
          className={`flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            isCodeSent ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          placeholder="전화번호 입력"
          value={form.phone}
          onChange={handlePhoneChange}
          disabled={isCodeSent}
        />
        <button
          onClick={handleSendCode}
          className={`absolute px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full right-2 hover:bg-gray-200 ${
            isCodeSent ? "cursor-not-allowed" : ""
          }`}
          disabled={isCodeSent}
        >
          인증번호 전송
        </button>
      </div>
      {phoneError && (
        <div className="mb-2 text-xs text-red-500">{phoneError}</div>
      )}
      {successMessage && (
        <div className="mb-2 text-xs text-green-500">{successMessage}</div>
      )}

      <div className="relative flex items-center w-full mb-2">
        <input
          type="text"
          className={`flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            isCodeValid ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          placeholder="인증번호 입력"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          disabled={!isCodeSent || isCodeValid}
        />
        <button
          onClick={handleVerifyCode}
          className={`absolute px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full right-2 hover:bg-gray-200 ${
            !isCodeSent || isCodeValid ? "cursor-not-allowed" : ""
          }`}
          disabled={!isCodeSent || isCodeValid}
        >
          인증하기
        </button>
      </div>

      {verificationMessage && (
        <div
          className={`text-xs mb-2 ${
            isCodeValid ? "text-green-500" : "text-red-500"
          }`}
        >
          {verificationMessage}
        </div>
      )}

      <h2 className="mt-4 mb-6 text-lg font-bold text-gray-700">비밀번호</h2>
      <div className="relative flex flex-row items-center justify-between ">
        <input
          type={isPasswordVisible ? "text" : "password"}
          className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="비밀번호 입력"
          value={form.password}
          onChange={changed("password")}
        />
        <button
          className="absolute w-6 h-6 mb-2 text-2xl text-gray-500 bg-gray-100 rounded-lg right-2 hover:text-gray-600 hover:bg-gray-200"
          onMouseDown={() => setIsPasswordVisible(true)}
          onMouseUp={() => setIsPasswordVisible(false)}
          onMouseLeave={() => setIsPasswordVisible(false)}
        >
          <Icon icon="bitcoin-icons:visible-filled" />
        </button>
      </div>
      {form.password && (
        <div
          className={`text-xs mb-2 ${
            isPasswordValid ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPasswordValid
            ? "사용할 수 있는 비밀번호예요."
            : "8~16자, 영문·숫자·특수문자를 포함해야 해요."}
        </div>
      )}
      <input
        type="password"
        className="w-full p-2 mb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {confirmPassword && (
        <div
          className={`text-xs mb-2 ${
            isPasswordConfirmed ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPasswordConfirmed
            ? "비밀번호가 일치해요."
            : "비밀번호가 일치하지 않아요."}
        </div>
      )}
    </div>
  );
}
