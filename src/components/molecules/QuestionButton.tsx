import { Link } from "react-router-dom";

export default function QuestionButton() {
  return (
    <Link to="/ask" className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 transition duration-200">
      질문하기
    </Link>
  );
}
