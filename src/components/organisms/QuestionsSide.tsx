import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function QuestionsSide() {
  return (
    <div className="flex flex-col w-1/5 gap-4">
      <div className="flex flex-col gap-1 p-4 bg-white rounded-lg">
        <p className="text-base font-semibold font-get">내 질문 & 답변</p>
        <div className="flex justify-center gap-2 text-xs">
          <div className="flex gap-1 p-2 bg-gray-200 rounded-lg">
            <div className="flex gap-1">
              <p>질문</p>
              <p className="font-semibold">5</p>
            </div>
            <div className="flex gap-1">
              <p>답변</p>
              <p className="font-semibold">2</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 font-semibold rounded-lg bg-emerald-200 text-emerald-700">
            <Icon icon="fluent:trophy-24-filled" />
            <p>1096</p>
          </div>
        </div>
      </div>
      <Link to="/questions/new">
        <div className="flex items-center justify-center h-10 gap-2 font-semibold text-white rounded-lg bg-emerald-600">
          <p>질문하기</p>
          <Icon icon="fluent:chat-help-24-filled" />
        </div>
      </Link>
    </div>
  );
}
