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
    
    {/* Popular Keywords Section */}
      <div className="bg-white p-5 rounded-lg shadow-sm my-2">
        <div className="text-lg font-get font-bold mb-2">인기 키워드</div>
        <div className="flex flex-wrap gap-2">
          {['#공군', '#제10전투비행단', '#공군훈련소', '#특기시험', '#훈련', '#865기', '#자기개발', '#면회외출', '#운항관제', '#ORI'].map((keyword, index) => (
            <span key={index} className="bg-gray-200 text-sm px-2 py-1 rounded-md">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Answer Ranking Section */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="text-lg font-get font-bold mb-2">답변랭킹</div>
        <ul>
          {[
            { name: '국방부택시운전사', score: 1021 },
            { name: '보라매의꿈', score: 985 },
            { name: '빨간마후라', score: 849 },
            { name: '17비대장', score: 698 },
            { name: '공군지망생', score: 572 },
          ].map((user, index) => (
            <li key={index} className="flex justify-between mb-2">
              <span>{user.name}</span>
              <span className="text-emerald-600 font-bold">🏆 {user.score}</span>
            </li>
          ))}
        </ul>
    </div>
  );
}
