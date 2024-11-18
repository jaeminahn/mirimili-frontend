import { Icon } from "@iconify/react";

interface AnswerItemProps {
  id: number;
  writerNick: string;
  writerType: string;
  writerLevel: string;
  createdAt: string;
  content: string;
  like: number;
  dislike: number;
  isLiked: boolean;
  isDisliked: boolean;
}

export default function AnswerItem({
  id,
  writerNick,
  writerType,
  writerLevel,
  createdAt,
  content,
  like,
  dislike,
  isLiked,
  isDisliked,
}: AnswerItemProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg ">
      <div className="flex items-center gap-2 text-sm">
        <img
          className="object-cover w-6 h-6 rounded-full"
          src="https://avatars.githubusercontent.com/u/32637779?v=4&size=64"
          alt="프로필 사진"
        />
        <p>김뚝딱</p>
        <p className="text-emerald-600">공군∙병장∙무선통신장비정비</p>
        <p className="text-xs text-gray-500">{createdAt}</p>
      </div>
      <p>{content}</p>
      <div className="flex gap-2 font-semibold ">
        <button
          className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
            isLiked
              ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
              : "text-gray-600 bg-gray-100"
          }`}
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
        >
          <Icon icon="fluent:thumb-dislike-24-filled" />
          <p>{dislike}</p>
        </button>
      </div>
    </div>
  );
}
