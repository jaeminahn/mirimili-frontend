import { useState, useEffect } from "react";

type ChangePasswordModalProps = {
  closeModal: () => void;
};

export default function ChangePasswordModal({
  closeModal,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const Password = "password123"; // 암호화된 비밀번호와 비교?

  useEffect(() => {
    setIsNewPasswordValid(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/.test(newPassword)
    );
    setIsPasswordMatch(newPassword === confirmNewPassword);
  }, [newPassword, confirmNewPassword]);

  useEffect(() => {
    setIsCurrentPasswordValid(currentPassword === Password);
  }, [currentPassword]);

  const handlePasswordChange = () => {
    if (!isCurrentPasswordValid || !isNewPasswordValid || !isPasswordMatch) {
      return;
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-lg font-bold text-gray-700">비밀번호 변경</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-500">기존 비밀번호</label>
          <input
            type="password"
            className="w-full p-2 border-2 rounded-lg focus:outline-none"
            placeholder="기존 비밀번호 입력"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <div
            className={`text-xs mt-2 ${
              isCurrentPasswordValid ? "text-green-500" : "text-red-500"
            }`}
          >
            {currentPassword
              ? isCurrentPasswordValid
                ? "기존 비밀번호가 일치합니다."
                : "기존 비밀번호가 일치하지 않습니다."
              : ""}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-500">새 비밀번호</label>
          <input
            type="password"
            className="w-full p-2 border-2 rounded-lg focus:outline-none"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div
            className={`text-xs mt-2 ${
              isNewPasswordValid ? "text-green-500" : "text-red-500"
            }`}
          >
            {newPassword
              ? isNewPasswordValid
                ? "사용할 수 있는 비밀번호입니다."
                : "8~16자, 영문·숫자·특수문자를 포함해야 합니다."
              : ""}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-500">새 비밀번호 확인</label>
          <input
            type="password"
            className="w-full p-2 border-2 rounded-lg focus:outline-none"
            placeholder="새 비밀번호 확인"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <div
            className={`text-xs mt-2 ${
              isPasswordMatch ? "text-green-500" : "text-red-500"
            }`}
          >
            {confirmNewPassword
              ? isPasswordMatch
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."
              : ""}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={handlePasswordChange}
            className={`px-4 py-2 text-sm text-white rounded-lg ${
              isCurrentPasswordValid && isNewPasswordValid && isPasswordMatch
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!(isCurrentPasswordValid && isNewPasswordValid && isPasswordMatch)}
          >
            변경
          </button>
        </div>
      </div>
    </div>
  );
}
