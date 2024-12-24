import QuestionsContent from "../organisms/QuestionsContent";
import QuestionsSide from "../organisms/QuestionsSide";

export default function Users() {
  return (
    <main className="flex justify-center pt-6 bg-gray-100 ">
      <div className="flex w-3/4 max-w-5xl gap-6">
        <QuestionsContent />
        <QuestionsSide />
      </div>
    </main>
  );
}
