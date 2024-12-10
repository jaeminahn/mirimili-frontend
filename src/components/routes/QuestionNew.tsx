import QuestionWrite from "../organisms/QuestionWrite"

export default function QuestionNew() {
  return (
    <main className="flex justify-center pt-6 bg-gray-100 ">
      <div className="flex w-3/4 max-w-5xl gap-6">
        <QuestionWrite />
        <div className="flex flex-col w-1/5 gap-2">
          <button className="flex justify-center px-6 py-3 text-white text-sm font-semibold rounded-lg bg-emerald-600">
            질문 등록하기
          </button>
          <button className="flex justify-center px-6 py-3 text-gray-600 text-sm font-semibold rounded-lg bg-gray-200">
            임시 저장하기
          </button>
        </div>
      </div>
    </main>
  );
}
