import { ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";

type SetMemberProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  goToNextStep: () => void;
};

export default function TermsandConditions({
  form,
  changed,
  goToNextStep,
}: SetMemberProps) {
  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-96">
      <h2 className="mb-6 text-lg font-bold text-gray-700">회원종류 선택</h2>

      <button
        className="flex items-center justify-between p-4 mb-4 text-xl font-normal rounded-lg cursor-not-allowed text-emerald-700 bg-emerald-50"
        disabled
      >
        <div className="flex flex-col w-3/4 text-left">
          <div className="font-get">입대 준비중이에요</div>
          <div className="text-xs text-gray-500">예비 군인</div>
        </div>
        <span className="text-emerald-700">→</span>
      </button>

      <button
        onClick={goToNextStep}
        className="flex items-center justify-between p-4 mb-4 text-xl font-normal rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-200"
      >
        <div className="flex flex-col w-3/4 text-left">
          <div className="font-get">입대했어요</div>
          <div className="text-xs font-normal text-gray-500">현역 군인</div>
        </div>
        <span>→</span>
      </button>

      <button
        className="flex items-center justify-between p-4 mb-4 text-xl font-normal text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
        disabled
      >
        <div className="flex flex-col w-3/4 text-left">
          <div className="font-get">전역했어요</div>
          <div className="text-xs font-normal text-gray-500">예비군·민방위</div>
        </div>
        <span className="text-gray-400">→</span>
      </button>

      <button
        className="flex items-center justify-between p-4 mb-4 text-xl font-normal text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
        disabled
      >
        <div className="flex flex-col w-3/4 text-left">
          <div className="font-get">군인의 지인이에요</div>
          <div className="text-xs font-normal text-gray-500">
            부모님·여자친구 등
          </div>
        </div>
        <span className="text-gray-400">→</span>
      </button>
    </div>
  );
}
