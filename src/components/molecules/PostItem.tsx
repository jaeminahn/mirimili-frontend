import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

interface PostItemProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  answer: number;
  view: number;
  like: number;
}

export default function PostItem({
  id,
  title,
  content,
  createdAt,
  answer,
  view,
  like,
}: PostItemProps) {
  return (
    <Link
      to={`/post/${id}`}
      className="flex flex-col gap-3 p-6 border border-gray-300 rounded-lg hover:cursor-pointer"
    >
      <div className="flex items-center flex-wrap">
        <span className="mr-2 text-base sm:text-lg font-bold text-emerald-600">Q.</span>
        <p className="font-semibold flex-1 text-base sm:text-lg">{title}</p>
      </div>
      <p className="text-sm text-gray-700 line-clamp-2 text-xs sm:text-sm">{content}</p>
      <div className="flex items-center mt-3 gap-3 flex-wrap">
        <div className="flex items-center p-2 text-xs sm:text-sm rounded-full bg-emerald-50 text-emerald-600">
          <Icon icon="fluent:comment-24-filled" className="mr-1 text-base" />
          <p className="font-semibold">{answer}명</p>
          <p>이 답변했어요!</p>
        </div>
        <div className="flex items-center p-2 text-xs sm:text-sm text-gray-500 bg-gray-100 rounded-full">
          <Icon icon="fluent:thumb-like-24-filled" className="mr-1 text-base" />
          <p>{like}</p>
        </div>
        <div className="flex items-center p-2 text-xs sm:text-sm text-gray-500 bg-gray-100 rounded-full">
          <Icon icon="fluent:eye-20-filled" className="mr-1 text-base" />
          <p>{view}</p>
        </div>
        <p className="ml-auto text-xs sm:text-sm text-gray-500 whitespace-nowrap">{createdAt}</p>
      </div>
    </Link>
  );
}
