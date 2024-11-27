import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";

type SetNicknameProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  setCanProceed: (value: boolean) => void;
  step: number;
};

export default function SetNickname({
  form,
  changed,
  setCanProceed,
  step,
}: SetNicknameProps) {
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");

  const handleCheckNickname = () => {
    if (form.nickname.trim()) {
      setNicknameMessage("사용 가능한 닉네임이에요.");
      setIsNicknameAvailable(true);
    } else {
      setNicknameMessage("닉네임을 입력해주세요.");
      setIsNicknameAvailable(false);
    }
  };

  useEffect(() => {
    setCanProceed(isNicknameAvailable);
  }, [isNicknameAvailable, step]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-96">
      <h2 className="mb-6 text-lg font-bold text-gray-700">닉네임 설정</h2>
      <div className="relative flex items-center mb-2">
        <input
          type="text"
          placeholder="닉네임 입력"
          value={form.nickname}
          onChange={changed("nickname")}
          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={handleCheckNickname}
          className={`absolute right-2 p-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 ${
            !form.nickname.trim() ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!form.nickname.trim()}
        >
          중복 확인
        </button>
      </div>
      {nicknameMessage && (
        <div
          className={`text-xs ${
            isNicknameAvailable ? "text-green-500" : "text-red-500"
          } mb-2`}
        >
          {nicknameMessage}
        </div>
      )}
    </div>
  );
}
