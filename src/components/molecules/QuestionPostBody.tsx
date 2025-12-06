interface QuestionPostBodyProps {
  category: string;
  title: string;
  content: string;
  images: string[];
  onClickImage: (index: number) => void;
}

export default function QuestionPostBody({
  category,
  title,
  content,
  images,
  onClickImage,
}: QuestionPostBodyProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-600">{category}</p>
        <p className="text-2xl font-semibold">{title}</p>
      </div>

      <div className="text-base whitespace-pre-wrap">{content}</div>

      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              className="relative flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-300 rounded-xl"
              onClick={() => onClickImage(idx)}
            >
              <img
                src={src}
                alt={`image-${idx + 1}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
