import { Icon } from "@iconify/react";
import { useEffect } from "react";

interface QuestionImageLightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function QuestionImageLightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: QuestionImageLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`image-${index + 1}`}
          className="object-contain w-[90vw] max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl"
        />
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={onClose}
        >
          <Icon icon="fluent:dismiss-24-filled" className="text-2xl" />
        </button>
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={onPrev}
            >
              <Icon icon="fluent:chevron-left-24-filled" className="text-2xl" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={onNext}
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
  );
}
