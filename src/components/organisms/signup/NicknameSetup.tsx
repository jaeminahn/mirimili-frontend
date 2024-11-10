import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";

type NicknameSetupProps = {
  form: SignUpFormType;
  changed: (key: keyof SignUpFormType) => (e: ChangeEvent<HTMLInputElement>) => void;
  setCanProceed: (value: boolean) => void;
};

export default function NicknameSetup({ form, changed, setCanProceed }: NicknameSetupProps) {
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  const handleCheckNickname = () => {
    setNicknameMessage("사용 가능한 닉네임이에요.");
    setIsNicknameAvailable(true);
  };

  useEffect(() => {
    setCanProceed(isNicknameAvailable);
  }, [isNicknameAvailable, setCanProceed]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-80">
      <h2 className="text-lg font-bold text-gray-700 mb-6">닉네임 설정</h2>

      <div className="relative flex items-center mb-4">
        <input
          type="text"
          placeholder="닉네임 입력"
          value={form.nickname}
          onChange={(e) => {
            changed("nickname")(e);
            setNicknameMessage("");
            setIsNicknameAvailable(false);
          }}
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={handleCheckNickname}
          className="absolute right-2 p-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
        >
          중복 확인
        </button>
      </div>

      {nicknameMessage && (
        <div className="text-xs text-green-500 mb-2">{nicknameMessage}</div>
      )}
    </div>
  );
}
