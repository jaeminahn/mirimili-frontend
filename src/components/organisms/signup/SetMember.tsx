import { ChangeEvent, useEffect } from "react";
import { Icon } from "@iconify/react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import { ServiceTypeE } from "../../../contexts/AuthContext";

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

  const mapMemberToService = (v: number): ServiceTypeE | undefined =>
    v === 0
      ? ServiceTypeE.PRE_ENLISTED
      : v === 1
      ? ServiceTypeE.ENLISTED
      : v === 2
      ? ServiceTypeE.DISCHARGED
      : undefined;

  const handleSelect = (value: number) => {
    const nextValue = form.memberType === value ? -1 : value;
    changed("memberType")({
      target: { value: nextValue },
    } as unknown as ChangeEvent<HTMLInputElement>);
    const s = mapMemberToService(nextValue);
    if (s) {
      changed("serviceType")({
        target: { value: s },
      } as unknown as ChangeEvent<HTMLInputElement>);
    } else {
      changed("serviceType")({
        target: { value: "" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    }
  };

  const isSelected = (value: number) => form.memberType === value;

  const baseStyle =
    "flex items-center justify-between p-6 mb-6 text-xl font-normal rounded-lg bg-white border transition-all";
  const grayText = "text-gray-400";
  const emeraldText = "text-emerald-600";

  return (
    <div className="flex flex-col p-6 bg-white rounded-3xl w-[360px]">
      <h2 className="mb-6 text-lg font-bold text-gray-700">회원타입</h2>

      {[0, 1, 2].map((value) => {
        const titles = ["입대 전이에요", "입대했어요", "전역했어요"];
        const subtitles = ["입대 전 회원", "현역 군인 회원", "예비역 · 민방위"];
        return (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`${baseStyle} ${
              isSelected(value)
                ? "bg-emerald-50 border-emerald-600"
                : "border-gray-300"
            }`}
          >
            <div
              className={`flex flex-col w-3/4 text-left ${
                isSelected(value) ? emeraldText : grayText
              }`}
            >
              <div className="font-get">{titles[value]}</div>
              <div className="text-xs text-gray-400">{subtitles[value]}</div>
            </div>
            {isSelected(value) && (
              <Icon
                icon="ic:round-check-circle"
                className="text-emerald-600 text-2xl"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
