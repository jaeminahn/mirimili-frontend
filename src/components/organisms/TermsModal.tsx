import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

type TermsModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
};

export default function TermsModal({
  title,
  isOpen,
  onClose,
  filePath,
}: TermsModalProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch(filePath)
        .then((res) => res.text())
        .then((text) => setContent(text))
        .catch(() => setContent("약관을 불러오지 못했습니다."));
    }
  }, [isOpen, filePath]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white w-[360px] max-h-[600px] rounded-2xl p-6 shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <Icon icon="ic:round-close" className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>

        <div className="overflow-y-scroll overflow-x-hidden h-[420px] pr-1 text-sm text-gray-800 whitespace-pre-wrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent rounded-md">
          {content}
        </div>
      </div>
    </div>
  );
}
