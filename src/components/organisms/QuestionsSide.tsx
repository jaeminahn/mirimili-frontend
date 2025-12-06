import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useActivity } from "../../contexts/ActivityContext";

export default function QuestionsSide() {
  const { myPostCount, myCommentCount, loading } = useActivity();

  const qCount = loading ? "-" : myPostCount;
  const aCount = loading ? "-" : myCommentCount;

  return (
    <>
      <div className="hidden lg:flex flex-col lg:w-1/5 gap-4">
        <div className="flex flex-col gap-3 p-6 bg-white rounded-3xl">
          <p className="text-sm font-bold">내 활동</p>
          <div className="justify-center gap-2 text-xs">
            <div className="flex justify-center gap-3 p-2 bg-gray-100 rounded-lg">
              <div className="flex gap-1">
                <p>질문</p>
                <p className="font-semibold">{qCount}</p>
              </div>
              <div className="flex gap-1">
                <p>답변</p>
                <p className="font-semibold">{aCount}</p>
              </div>
            </div>
          </div>
        </div>

        <Link to="/post/new" className="hidden lg:block">
          <div className="flex items-center justify-center h-12 gap-2 font-semibold text-white rounded-3xl bg-emerald-600 hover:bg-emerald-700">
            <p>질문하기</p>
            <Icon icon="fluent:chat-help-24-filled" />
          </div>
        </Link>
      </div>

      <Link to="/post/new" className="lg:hidden">
        <div className="fixed bottom-16 right-6 z-50 flex items-center justify-center h-12 gap-2 font-semibold text-white rounded-3xl bg-emerald-600 hover:bg-emerald-700 shadow-lg px-4">
          <p>질문하기</p>
          <Icon icon="fluent:chat-help-24-filled" />
        </div>
      </Link>
    </>
  );
}
