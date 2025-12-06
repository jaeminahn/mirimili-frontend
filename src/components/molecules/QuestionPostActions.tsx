import { Icon } from "@iconify/react";

interface QuestionPostActionsProps {
  like: number;
  dislike: number;
  isLiked: boolean;
  isDisliked: boolean;
  isScraped: boolean;
  isMine: boolean;
  onLike: () => void;
  onDislike: () => void;
  onToggleScrap: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

export default function QuestionPostActions({
  like,
  dislike,
  isLiked,
  isDisliked,
  isScraped,
  isMine,
  onLike,
  onDislike,
  onToggleScrap,
  onDelete,
  onReport,
}: QuestionPostActionsProps) {
  return (
    <div className="flex justify-between text-sm">
      <div className="flex gap-2 font-semibold">
        <button
          className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
            isLiked
              ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
              : "text-gray-600 bg-gray-100"
          }`}
          onClick={onLike}
        >
          <Icon icon="fluent:thumb-like-24-filled" />
          <p>{like}</p>
        </button>
        <button
          className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
            isDisliked
              ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
              : "text-gray-600 bg-gray-100"
          }`}
          onClick={onDislike}
        >
          <Icon icon="fluent:thumb-dislike-24-filled" />
          <p>{dislike}</p>
        </button>
        <button
          className={`flex gap-1 items-center px-2 rounded-lg ${
            isScraped
              ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
              : "text-gray-600 bg-gray-100"
          }`}
          onClick={onToggleScrap}
        >
          <Icon icon="fluent:bookmark-20-filled" />
        </button>
        <button className="flex items-center gap-1 px-2 text-gray-600 bg-gray-100 rounded-lg">
          <Icon icon="fluent:share-20-filled" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <button
          onClick={() => {
            if (isMine) {
              onDelete?.();
            } else {
              onReport?.();
            }
          }}
        >
          {isMine ? "삭제하기" : "신고하기"}
        </button>
      </div>
    </div>
  );
}
