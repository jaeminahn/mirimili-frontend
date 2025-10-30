import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function QuestionsSide() {
  return (
    <>
      <div className="hidden lg:flex flex-col lg:w-1/5 gap-4">

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
