import { Icon } from "@iconify/react";

interface QuestionPostHeaderProps {
  writerNick: string;
  writerInfo: string;
  createdAt: string;
  view: number;
  answer: number;
}

export default function QuestionPostHeader({
  writerNick,
  writerInfo,
  createdAt,
  view,
  answer,
}: QuestionPostHeaderProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <p className="font-semibold">{writerNick}</p>
        <p className="text-emerald-600">{writerInfo}</p>
        <p className="text-xs text-gray-600">{createdAt}</p>
      </div>
      <div className="flex items-center gap-4 p-2 text-xs text-gray-500">
        <div className="flex">
          <Icon icon="fluent:eye-20-filled" className="mr-1 text-base" />
          <p>{view}</p>
        </div>
        <div className="flex">
          <Icon icon="fluent:comment-24-filled" className="mr-1 text-base" />
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
