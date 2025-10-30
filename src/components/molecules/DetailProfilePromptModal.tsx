import { FC } from "react";
import hugging from "../../images/hugging-face.png";

type Props = {
  open: boolean;
  nickname: string;
  onProceed: () => void;
  onClose: () => void;
};

const DetailProfilePromptModal: FC<Props> = ({
  open,
  nickname,
  onProceed,
  onClose,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[360px] bg-white rounded-3xl p-6">
        <button
          className="absolute right-4 top-4 text-2xl leading-none"
          aria-label="close"
          onClick={onClose}
        >
          ×
        </button>
        <div className="w-full flex flex-col items-center">
          <img
            src={hugging}
            alt="환영 이모지"
            className="w-[100px] h-[100px] my-12"
          />
          <div className="w-full text-left">
            <h2 className="text-lg font-extrabold text-gray-800 mb-4 leading-snug">
              {nickname}님, <br />
              미리밀리 회원이 되신 것을 환영해요!
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              상세 프로필까지 설정하면, 회원님을 위한
              <br />더 많은 서비스를 이용할 수 있어요!
            </p>
          </div>
          <button
            onClick={onProceed}
            className="w-full h-[48px] rounded-3xl px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
          >
            설정하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailProfilePromptModal;
