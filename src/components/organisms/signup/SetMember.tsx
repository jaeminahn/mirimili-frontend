import { ChangeEvent, useEffect } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";

type SetMemberProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  setCanProceed: (value: boolean) => void;
  step: number;
};

export default function SetMember({
  form,
  changed,
  setCanProceed,
  step,
}: SetMemberProps) {
  useEffect(() => {
    if (step !== 2) return;
    setCanProceed(form.memberType !== -1);
  }, [form.memberType, step, setCanProceed]);

  const handleSelect = (value: number) => {
    const nextValue = form.memberType === value ? -1 : value;
    const syntheticEvent = {
      target: { value: nextValue },
    } as unknown as ChangeEvent<HTMLInputElement>;
    changed("memberType")(syntheticEvent);
  };

  const isSelected = (value: number) => form.memberType === value;

  const baseStyle =
    "flex items-center justify-between p-4 mb-4 text-xl font-normal rounded-lg bg-white border border-gray-300";
  const grayText = "text-gray-400";
  const emeraldText = "text-emerald-700";

  return (
    <div className="flex flex-col p-6 bg-white rounded-3xl w-[360px]">
      <h2 className="mb-6 text-lg font-bold text-gray-700">회원종류 선택</h2>

      <button
        onClick={() => handleSelect(0)}
        className={`${baseStyle} ${
          isSelected(0) ? "bg-emerald-50 border-emerald-500" : ""
        }`}
      >
        <div className={`flex flex-col w-3/4 text-left ${grayText}`}>
          <div className={`font-get ${isSelected(0) ? emeraldText : ""}`}>
            입대 전이에요
          </div>
          <div className="text-xs">입대 전 회원</div>
        </div>
      </button>

      <button
        onClick={() => handleSelect(1)}
        className={`${baseStyle} ${
          isSelected(1) ? "bg-emerald-50 border-emerald-500" : ""
        }`}
      >
        <div className={`flex flex-col w-3/4 text-left ${grayText}`}>
          <div className={`font-get ${isSelected(1) ? emeraldText : ""}`}>
            입대했어요
          </div>
          <div className="text-xs">현역 군인 회원</div>
        </div>
      </button>

      <button
        onClick={() => handleSelect(2)}
        className={`${baseStyle} ${
          isSelected(2) ? "bg-emerald-50 border-emerald-500" : ""
        }`}
      >
        <div className={`flex flex-col w-3/4 text-left ${grayText}`}>
          <div className={`font-get ${isSelected(2) ? emeraldText : ""}`}>
            전역했어요
          </div>
          <div className="text-xs">예비군·민방위</div>
        </div>
      </button>
    </div>
  );
}
