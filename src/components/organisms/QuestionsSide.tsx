import QuestionButton from "../molecules/QuestionButton";

export default function QuestionsSide() {
  return (
    <div className="flex flex-col w-1/4 gap-4">
    {/* Q&A Section */}
    <div className="bg-white p-5 rounded-lg shadow-sm mb-2">
      <div className="text-lg font-get font-bold">내 질문&답변</div>
      <div className="flex items-center justify-between mt-2">
        <div className="bg-gray-200 p-2 rounded-md flex justify-between items-center">
          <span className="text-sm">질문 <span className="font-bold">5</span></span>
          <span className="text-sm ml-4">답변 <span className="font-bold">2</span></span>
        </div>
        <div className="bg-emerald-100 p-2 rounded-md flex justify-between items-center ml-4">
          <span className="text-emerald-600 text-sm font-bold">🏆 1021</span>
        </div>
      </div>
    </div>

      {/* Question Button */}
      <QuestionButton />

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
    </div>
  );
}
