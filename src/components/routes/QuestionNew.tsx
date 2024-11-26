import QuestionWrite from "../organisms/QuestionWrite"
import QuestionsSide from "../organisms/QuestionsSide";

export default function QuestionNew() {
  return (
    <main className="flex justify-center pt-6 bg-gray-100 ">
      <div className="flex w-3/4 max-w-5xl gap-6">
        <QuestionWrite />
        <QuestionsSide />
      </div>
    </main>
  );
}
