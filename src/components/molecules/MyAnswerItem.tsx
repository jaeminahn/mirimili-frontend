import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

interface MyAnswerItemProps {
  id: number;
  questionId: number;
  title: string;
  content: string;
  createdAt: string;
  like: number;
}

export default function MyAnswerItem({
  id,
  questionId,
  title,
  content,
  createdAt,
  like,
}: MyAnswerItemProps) {
  return (
    <Link
      to={`/post/${questionId}`}
      className="flex flex-col gap-2 p-6 border border-gray-300 rounded-lg hover:cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-emerald-600">Q.</span>
        <p className="text-gray-600">{title}</p>
      </div>

      <div className="flex items-start gap-2">
        <span className="text-lg font-bold text-emerald-600">A.</span>
        <p className="text-base font-bold text-gray-800">{content}</p>
      </div>

      <div className="flex items-center mt-2">
        <div className="flex gap-2">
          <div className="flex items-center p-2 text-xs text-gray-500 bg-gray-100 rounded-full">
            <Icon
              icon="fluent:thumb-like-24-filled"
              className="mr-1 text-base"
            />
            <p>{like}</p>
          </div>
        </div>
        <p className="ml-4 text-xs text-gray-500">{createdAt}</p>
      </div>
    </Link>
  );
}
