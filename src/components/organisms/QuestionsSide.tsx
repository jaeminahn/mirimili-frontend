import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function QuestionsSide() {
  return (
    <>
      <div className="hidden lg:flex flex-col lg:w-1/5 gap-4">
        {/* <div className="flex flex-col gap-1 p-4 bg-white rounded-3xl">
          <p className="text-base font-semibold font-get">내 활동</p>
          <div className="flex justify-center gap-2 text-xs">
            <div className="flex gap-1 p-2 bg-gray-100 rounded-lg">
              <div className="flex gap-1">
                <p>질문</p>
                <p className="font-semibold">5</p>
              </div>
              <div className="flex gap-1">
                <p>답변</p>
                <p className="font-semibold">2</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 font-semibold rounded-lg bg-amber-50 text-amber-600">
              <Icon icon="fluent:trophy-24-filled" />
              <p>1096</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl shadow-sm">
          <div className="mb-2 text-base font-bold font-get">답변랭킹</div>
          <ul>
            {[
              { name: "국방부택시운전사", score: 1021 },
              { name: "보라매의꿈", score: 985 },
              { name: "빨간마후라", score: 849 },
              { name: "17비대장", score: 698 },
              { name: "공군지망생", score: 572 },
            ].map((user, index) => (
              <li key={index} className="flex text-xs mb-2">
                <div className="flex items-center gap-1 px-2 mr-2 rounded-lg bg-amber-50 text-amber-600">
                  <Icon icon="fluent:trophy-24-filled" />
                  <p>{user.score}</p>
                </div>
                <p className="font-bold">{user.name}</p>
              </li>
            ))}
          </ul>
        </div>

          */}

        <Link to="/questions/new" className="hidden lg:block">
          <div className="flex items-center justify-center h-12 gap-2 font-semibold text-white rounded-3xl bg-emerald-600 hover:bg-emerald-700">
            <p>질문하기</p>
            <Icon icon="fluent:chat-help-24-filled" />
          </div>
        </Link>
      </div>

      <Link to="/questions/new" className="lg:hidden">
        <div className="fixed bottom-16 right-6 z-50 flex items-center justify-center h-12 gap-2 font-semibold text-white rounded-3xl bg-emerald-600 hover:bg-emerald-700 shadow-lg px-4">
          <p>질문하기</p>
          <Icon icon="fluent:chat-help-24-filled" />
        </div>
      </Link>
    </>
  );
}
