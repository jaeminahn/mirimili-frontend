import { ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";

type NicknameSetupProps = {
  form: SignUpFormType;
  changed: (key: keyof SignUpFormType) => (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function NicknameSetup({ form, changed }: NicknameSetupProps) {
  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-80">
      <h2 className="text-2xl text-gray-700 mb-6">닉네임 설정</h2>
      
      <input
        type="text"
        placeholder="닉네임 입력"
        value={form.nickname}
        onChange={changed("nickname")}
        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4"
      />
    </div>
  );
}
