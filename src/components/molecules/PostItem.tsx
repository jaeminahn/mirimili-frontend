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
      to={`/questions/${id}`}
      className="flex flex-col gap-2 p-6 border border-gray-300 rounded-lg hover:cursor-pointer"
    >
      <div className="flex items-center">
        <span className="mr-1 text-lg font-bold text-emerald-600">Q.</span>
        <p className="text-lg font-semibold">{title}</p>
      </div>
      <p className="text-sm text-gray-700 line-clamp-2">{content}</p>
      <div className="flex items-center mt-2">
        <div className="flex gap-2">
          <div className="flex items-center p-2 text-xs rounded-full bg-emerald-50 text-emerald-600">
            <Icon icon="fluent:comment-24-filled" className="mr-1 text-base" />
            <p className="font-semibold">{answer}명</p>
            <p>이 답변했어요!</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center p-2 text-xs text-gray-500 bg-gray-100 rounded-full">
              <Icon
                icon="fluent:thumb-like-24-filled"
                className="mr-1 text-base"
              />
              <p>{like}</p>
            </div>
            <div className="flex items-center p-2 text-xs text-gray-500 bg-gray-100 rounded-full">
              <Icon icon="fluent:eye-20-filled" className="mr-1 text-base" />
              <p>{view}</p>
            </div>
          </div>
        </div>
        <p className="ml-4 text-xs text-gray-500">{createdAt}</p>
      </div>
    </Link>
  );
}
