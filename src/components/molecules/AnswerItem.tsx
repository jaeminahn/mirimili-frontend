import { useState } from "react";
import { Icon } from "@iconify/react";

interface AnswerItemProps {
  id: number;
  writerNick: string;
  writerStatus?: "PRE_ENLISTED" | "ENLISTED" | "DISCHARGED";
  writerSpecialty?: string;
  createdAt: string;
  content: string;
  like: number;
  dislike: number;
  isLiked: boolean;
  isDisliked: boolean;
  imagesUrl?: string[];
  onLike?: (id: number) => void;
  onDislike?: (id: number) => void;
  onReport?: (id: number) => void;
}

export default function AnswerItem({
  id,
  writerNick,
  writerStatus,
  writerSpecialty,
  createdAt,
  content,
  like,
  dislike,
  isLiked,
  isDisliked,
  imagesUrl = [],
  onLike,
  onDislike,
  onReport,
}: AnswerItemProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const statusLabel =
    writerStatus === "PRE_ENLISTED"
      ? "입대전"
      : writerStatus === "ENLISTED"
      ? "현역"
      : writerStatus === "DISCHARGED"
      ? "예비역"
      : "";
  const info =
    writerStatus === "ENLISTED" && writerSpecialty
      ? `공군 · ${statusLabel} · ${writerSpecialty}`
      : `공군 · ${statusLabel}`;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
      <div className="flex items-center gap-2 text-sm">
        <p className="font-semibold">{writerNick}</p>
        <p className="text-emerald-600">{info}</p>
        <p className="text-xs text-gray-500">{createdAt}</p>
      </div>

      <p className="whitespace-pre-wrap">{content}</p>

      {!!imagesUrl.length && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {imagesUrl.map((src, i) => (
            <button
              key={i}
              className="relative flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-300 rounded-xl"
              onClick={() => setLightbox(i)}
            >
              <img
                src={src}
                alt={`comment-${i + 1}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-600">
        <div className="flex gap-2">
          <button
            className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
              isLiked
                ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
                : "text-gray-600 bg-gray-100"
            }`}
            onClick={() => onLike?.(id)}
          >
            <Icon icon="fluent:thumb-like-24-filled" className="text-base" />
            <p>{like}</p>
          </button>
          <button
            className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
              isDisliked
                ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
                : "text-gray-600 bg-gray-100"
            }`}
            onClick={() => onDislike?.(id)}
          >
            <Icon icon="fluent:thumb-dislike-24-filled" className="text-base" />
            <p>{dislike}</p>
          </button>
        </div>

        <button
          className="text-xs text-gray-600"
          onClick={() => onReport?.(id)}
        >
          신고하기
        </button>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imagesUrl[lightbox]}
              alt={`comment-big-${lightbox + 1}`}
              className="object-contain w-[90vw] max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl"
            />
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setLightbox(null)}
            >
              <Icon icon="fluent:dismiss-24-filled" className="text-2xl" />
            </button>
            {imagesUrl.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={() =>
                    setLightbox((i) =>
                      i === null
                        ? null
                        : (i + imagesUrl.length - 1) % imagesUrl.length
                    )
                  }
                >
                  <Icon
                    icon="fluent:chevron-left-24-filled"
                    className="text-2xl"
                  />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={() =>
                    setLightbox((i) =>
                      i === null ? null : (i + 1) % imagesUrl.length
                    )
                  }
                >
                  <Icon
                    icon="fluent:chevron-right-24-filled"
                    className="text-2xl"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
