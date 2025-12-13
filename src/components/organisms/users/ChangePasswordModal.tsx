import { useState, useEffect } from "react";
import { post } from "../../../api/postAndPut";
import { patchJSON } from "../../../api/postAndPut";

type ChangePasswordModalProps = {
  closeModal: () => void;
  phoneNumber: string;
};

const isValidPassword = (v: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/.test(v ?? "");

export default function ChangePasswordModal({
  closeModal,
  phoneNumber,
}: ChangePasswordModalProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdValid, setPwdValid] = useState(false);
  const [pwdMatch, setPwdMatch] = useState(false);

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPwdValid(isValidPassword(newPassword));
    setPwdMatch(newPassword === confirmNewPassword);
  }, [newPassword, confirmNewPassword]);

  const handleSendCode = async () => {
    if (sending) return;
    setSending(true);

    try {
      const res = await post("/sms/send-pwd", { phoneNumber });
      const result = await res.json().catch(() => ({}));

      if (result?.success === true) {
        setIsCodeSent(true);
        setSuccessMessage("인증번호가 전송되었어요");
        setVerificationMessage("");
      } else {
        setIsCodeSent(false);
        setSuccessMessage("");
        setVerificationMessage("");
      }
    } catch {
      setIsCodeSent(false);
      setSuccessMessage("");
      setVerificationMessage("인증번호 전송 중 오류가 발생했습니다");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verifying) return;

    const code = (verificationCode ?? "").trim();
    if (code.length !== 6) {
      setIsCodeValid(false);
      setVerificationMessage("인증번호 6자리를 입력해주세요");
      return;
    }

    setVerifying(true);
    try {
      const res = await post("/sms/verify", {
        phoneNumber,
        certificationCode: code,
      });
      const result = await res.json().catch(() => ({}));
      const ok = result?.success === true;
      setIsCodeValid(ok);
      setVerificationMessage(
        ok ? "인증번호가 일치해요" : "인증번호가 일치하지 않아요"
      );
    } catch {
      setIsCodeValid(false);
      setVerificationMessage("인증 처리 중 오류가 발생했습니다");
    } finally {
      setVerifying(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!isCodeValid) return;
    if (!pwdValid || !pwdMatch) return;
    if (saving) return;

    setSaving(true);
    try {
      const res = await patchJSON("/member/password", {
        phoneNumber,
        newPassword,
      });

      if (!res.ok || (res.data as any)?.success === false) {
        const msg =
          (res.data as any)?.message || "비밀번호 변경에 실패했습니다.";
        throw new Error(msg);
      }

      alert("비밀번호가 변경되었습니다.");
      closeModal();
    } catch (err: any) {
      alert(err?.message || "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = isCodeValid && pwdValid && pwdMatch && !saving;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 p-6 mx-2 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-lg font-bold text-gray-700">비밀번호 변경</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-500">전화번호</label>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              className="w-full p-2 border-2 rounded-lg focus:outline-none bg-gray-100"
              value={phoneNumber}
              disabled
            />
            <button
              onClick={handleSendCode}
              className={`absolute px-3 py-2 text-xs text-gray-700 bg-gray-100 rounded-lg right-2 hover:bg-gray-200 ${
                isCodeSent ? "cursor-not-allowed" : ""
              }`}
              disabled={isCodeSent || sending}
            >
              인증번호 전송
            </button>
          </div>
          {successMessage && (
            <div className="mt-2 ml-2 text-xs text-green-500">
              {successMessage}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-500">인증번호</label>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              className={`w-full p-2 border-2 rounded-lg focus:outline-none ${
                isCodeValid ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="인증번호 6자리 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isCodeValid}
            />
            <button
              onClick={handleVerifyCode}
              className={`absolute px-3 py-2 text-xs text-gray-700 bg-gray-100 rounded-lg right-2 hover:bg-gray-200 ${
                !isCodeSent || isCodeValid ? "cursor-not-allowed" : ""
              }`}
              disabled={!isCodeSent || isCodeValid || verifying}
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

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-500">
            새 비밀번호
          </label>
          <input
            type="password"
            className="w-full p-2 border-2 rounded-lg focus:outline-none"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {newPassword && (
            <div
              className={`text-xs mt-2 ${
                pwdValid ? "text-green-500" : "text-red-500"
              }`}
            >
              {pwdValid
                ? "사용할 수 있는 비밀번호입니다."
                : "8~16자, 영문·숫자·특수문자를 포함해야 합니다."}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-500">
            새 비밀번호 확인
          </label>
          <input
            type="password"
            className="w-full p-2 border-2 rounded-lg focus:outline-none"
            placeholder="새 비밀번호 확인"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {confirmNewPassword && (
            <div
              className={`text-xs mt-2 ${
                pwdMatch ? "text-green-500" : "text-red-500"
              }`}
            >
              {pwdMatch
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={sending || verifying || saving}
          >
            취소
          </button>

          <button
            onClick={handlePasswordChange}
            className={`px-4 py-2 text-sm text-white rounded-lg ${
              canSubmit
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!canSubmit}
          >
            변경
          </button>
        </div>
      </div>
    </div>
  );
}
