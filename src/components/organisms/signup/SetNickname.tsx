import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import { post } from "../../../api";

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
    const nickname = form.nick;

    if (nickname === "") {
      setNicknameMessage("닉네임을 입력해주세요.");
      setIsNicknameAvailable(false);
      return;
    }
    if (nickname.includes(" ")) {
      setNicknameMessage("띄어쓰기가 포함되면 안돼요.");
      setIsNicknameAvailable(false);
      return;
    }

    post("/auth/checkNickname", { nickname: nickname })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "COMMON409") {
          setNicknameMessage("누가 이 닉네임을 이미 사용하고 있어요.");
          setIsNicknameAvailable(false);
        } else if (result.message === "COMMON200") {
          setNicknameMessage("사용 가능한 닉네임이에요.");
          setIsNicknameAvailable(true);
        }
      });
  };

  useEffect(() => {
    if (step !== 3) return;
    setCanProceed(isNicknameAvailable);
  }, [isNicknameAvailable, step]);

  return (
    <div className="flex flex-col px-6 py-9 bg-white rounded-3xl w-[360px]">
      <h2 className="mb-6 text-lg font-bold text-gray-700">닉네임</h2>
      <div className="relative flex items-center mb-2">
        <input
          type="text"
          placeholder="닉네임 입력"
          value={form.nick}
          onChange={changed("nick")}
          className="w-full h-[60px] p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={handleCheckNickname}
          className={`absolute right-2 p-3 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 ${
            !form.nick.trim() ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!form.nick.trim()}
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
