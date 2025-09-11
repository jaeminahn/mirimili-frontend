import { useState, useEffect, ChangeEvent } from "react";
import { post } from "../../../api/postAndPut";

type Props = {
  tel: string;
  changed: (key: "tel") => (e: ChangeEvent<HTMLInputElement>) => void;
  setCanProceed: (value: boolean) => void;
  step: number;
};

const formatTel = (value: string) => {
  const v = value.replace(/[^0-9]/g, "");
  if (v.length > 7)
    return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
  if (v.length > 3) return `${v.slice(0, 3)}-${v.slice(3)}`;
  return v;
};

export default function AuthPhone({
  tel,
  changed,
  setCanProceed,
  step,
}: Props) {
  const [formattedValue, setFormattedValue] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    if (step !== 1) return;
    setCanProceed(isCodeValid);
  }, [isCodeValid, step, setCanProceed]);

  useEffect(() => {
    setFormattedValue(formatTel(tel));
  }, [tel]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormattedValue(formatTel(value));
    changed("tel")({ target: { value } } as ChangeEvent<HTMLInputElement>);
  };

  const handleSendCode = () => {
    const raw = tel.replace(/-/g, "");
    const isValidPhone = raw.length === 11;
    if (!isValidPhone) {
      setPhoneError("유효한 전화번호를 입력해주세요");
      setIsCodeSent(false);
      setVerificationMessage("");
      setSuccessMessage("");
      return;
    }
    post("/sms/send", { phoneNumber: raw })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === false) {
          setIsCodeSent(false);
          setPhoneError("동일한 전화번호의 사용자가 존재해요");
          setVerificationMessage("");
          setSuccessMessage("");
        } else if (result.success === true) {
          setIsCodeSent(true);
          setPhoneError("");
          setSuccessMessage("인증번호가 전송되었어요");
          setVerificationMessage("");
        } else {
          alert(result.success);
        }
      })
      .catch(() => {
        setIsCodeSent(false);
        setSuccessMessage("");
        setPhoneError("인증번호 전송 중 오류가 발생했습니다");
      });
  };

  const handleVerifyCode = () => {
    const raw = tel.replace(/-/g, "");
    const code = verificationCode;
    if (code.length !== 6) {
      setIsCodeValid(false);
      setVerificationMessage("인증번호 6자리를 입력해주세요");
      return;
    }
    post("/sms/verify", { phoneNumber: raw, certificationCode: code })
      .then((res) => res.json())
      .then((result) => {
        const ok = result.success === true;
        setIsCodeValid(ok);
        setVerificationMessage(
          ok ? "인증번호가 일치해요" : "인증번호가 일치하지 않아요"
        );
      })
      .catch(() => {
        setIsCodeValid(false);
        setVerificationMessage("인증 처리 중 오류가 발생했습니다");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col px-6 py-9 bg-white rounded-3xl w-[360px]">
        <h2 className="mb-3 text-lg font-bold text-gray-700">전화번호 인증</h2>

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
            <div className="mt-2 ml-2 text-xs text-orange-500">
              {phoneError}
            </div>
          )}
          {successMessage && (
            <div className="mt-2 ml-2 text-xs text-green-500">
              {successMessage}
            </div>
          )}
        </div>

        <div className="mb-2">
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
      </div>
    </div>
  );
}
