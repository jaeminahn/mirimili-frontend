import { Link } from "react-router-dom";

export default function HeaderButtons() {
  return (
    <div className="flex items-center gap-5">
      <Link className="text-gray-900 hover:text-emerald-500" to="/questions">
        Q&A
      </Link>
      <Link className="text-gray-900 hover:text-emerald-500" to="/talks">
        커뮤니티
      </Link>
      <Link className="text-gray-900 hover:text-emerald-500" to="/articles">
        밀리Tip
      </Link>
      {/* <Link className="text-gray-900 hover:text-emerald-500" href="">
        베스트🔥
      </Link> */}
      <div className="w-px h-3 bg-gray-900 shrink-0" />
      <Link className="text-gray-900 hover:text-emerald-500" to="notices">
        공지
      </Link>
    </div>
  );
}
