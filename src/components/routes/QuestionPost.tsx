import QuestionPostContent from "../organisms/QuestionPostContent";
import QuestionsSide from "../organisms/QuestionsSide";

export default function QuestionPost() {
  return (
    <main className="flex justify-center pt-6 bg-gray-100 ">
      <div className="flex w-full px-4 md:w-3/4 max-w-5xl lg:gap-6">
        <QuestionPostContent />
        <QuestionsSide />
      </div>
    </main>
  );
}
