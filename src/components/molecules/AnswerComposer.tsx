import { Icon } from "@iconify/react";
import { ChangeEvent, RefObject } from "react";

interface AnswerComposerProps {
  visible: boolean;
  nickName?: string;
  infoLine?: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  answerText: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  cmtImagesUrl: string[];
  onRemoveImage: (url: string) => void;
  onUploadImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputKey: string;
  uploading: boolean;
  onSubmit: () => void;
  submitDisabled: boolean;
}

export default function AnswerComposer({
  visible,
  nickName,
  infoLine,
  textareaRef,
  answerText,
  onChange,
  cmtImagesUrl,
  onRemoveImage,
  onUploadImages,
  fileInputKey,
  uploading,
  onSubmit,
  submitDisabled,
}: AnswerComposerProps) {
  if (!visible) return null;
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col gap-2 p-4 mt-2 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2 text-sm px-1 py-2">
          <p className="font-semibold">{nickName ?? ""}</p>
          <p className="text-emerald-600">{infoLine ?? ""}</p>
        </div>
        <textarea
          ref={textareaRef}
          placeholder="답변을 남겨주세요!"
          value={answerText}
          onChange={onChange}
          className="p-4 mb-2 overflow-hidden border-2 rounded-lg resize-none min-h-20 focus:outline-none"
        />
        {!!cmtImagesUrl.length && (
          <div className="flex flex-wrap gap-2">
            {cmtImagesUrl.map((u, i) => (
              <div
                key={i}
                className="relative w-20 h-20 overflow-hidden border border-gray-300 rounded-lg"
              >
                <img
                  src={u}
                  alt={`cmt-up-${i}`}
                  className="object-cover w-full h-full"
                />
                <button
                  className="absolute flex items-center justify-center w-5 h-5 text-gray-700 bg-gray-200 rounded-full top-1 right-1 hover:bg-gray-300"
                  onClick={() => onRemoveImage(u)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between">
          <div className="flex items-center justify-center bg-white border border-gray-300 rounded-lg cursor-pointer w-12 h-12">
            <label className="flex items-center justify-center w-full h-full cursor-pointer">
              <Icon
                icon="fluent:camera-add-24-filled"
                className="text-xl text-gray-400"
              />
              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onUploadImages}
                disabled={uploading}
              />
            </label>
          </div>
          <button
            className="px-6 py-2 text-sm text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            onClick={onSubmit}
            disabled={submitDisabled}
          >
            답변 등록
          </button>
        </div>
      </div>
    </div>
  );
}
