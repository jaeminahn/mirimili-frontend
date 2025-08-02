import { useState, useEffect, ChangeEvent } from "react";
import { SignUpFormType } from "../../routes/Auth/SignUp";
import SelectModal from "../SelectModal";
import { Icon } from "@iconify/react";

type SetMemberProps = {
  form: SignUpFormType;
  changed: (
    key: keyof SignUpFormType
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  setCanProceed: (value: boolean) => void;
  step: number;
};

export default function TermsAndConditions({
  form,
  changed,
  setCanProceed,
  step,
}: SetMemberProps) {
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeUse, setAgreeUse] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [useModalOpen, setUseModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  useEffect(() => {
    if (step !== 1) return;
    setCanProceed(agreeUse && agreePrivacy);
  }, [agreeUse, agreePrivacy, step]);

  useEffect(() => {
    setAgreeAll(agreeUse && agreePrivacy && agreeMarketing);
  }, [agreeUse, agreePrivacy, agreeMarketing]);

  const toggleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeUse(newValue);
    setAgreePrivacy(newValue);
    setAgreeMarketing(newValue);
  };

  const checkboxStyle =
    "w-4 h-4 rounded-full border border-gray-400 appearance-none checked:bg-[url('./images/checked.png')] bg-cover bg-no-repeat bg-center checked:border-emerald-600";

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg w-96">
      <h2 className="mb-6 text-lg font-bold text-gray-700">약관 동의</h2>

      <div
        className="flex items-center gap-3 mb-6 cursor-pointer"
        onClick={toggleAgreeAll}
      >
        <input
          type="checkbox"
          checked={agreeAll}
          readOnly
          className={checkboxStyle}
        />
        <span className="text-base font-medium text-gray-700">
          약관 전체동의
        </span>
      </div>

      <div className="border-t border-gray-200 mb-4" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setAgreeUse(!agreeUse)}
          >
            <input
              type="checkbox"
              checked={agreeUse}
              readOnly
              className={checkboxStyle}
            />
            <span className="text-sm text-gray-700">이용약관 동의 (필수)</span>
          </div>
          <Icon
            icon="ic:round-arrow-forward-ios"
            className="text-gray-400 cursor-pointer"
            onClick={() => setUseModalOpen(true)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setAgreePrivacy(!agreePrivacy)}
          >
            <input
              type="checkbox"
              checked={agreePrivacy}
              readOnly
              className={checkboxStyle}
            />
            <span className="text-sm text-gray-700">
              개인정보 수집 및 이용동의 (필수)
            </span>
          </div>
          <Icon
            icon="ic:round-arrow-forward-ios"
            className="text-gray-400 cursor-pointer"
            onClick={() => setPrivacyModalOpen(true)}
          />
        </div>

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setAgreeMarketing(!agreeMarketing)}
        >
          <input
            type="checkbox"
            checked={agreeMarketing}
            readOnly
            className={checkboxStyle}
          />
          <span className="text-sm text-gray-700">
            광고성 정보 수신동의 (선택)
          </span>
        </div>
      </div>

      <SelectModal
        title="이용약관"
        isOpen={useModalOpen}
        onClose={() => setUseModalOpen(false)}
        DataList={[]} // 추후 내용 삽입
        onSelect={() => {}}
      />
      <SelectModal
        title="개인정보 수집 및 이용동의"
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        DataList={[]} // 추후 내용 삽입
        onSelect={() => {}}
      />
    </div>
  );
}
