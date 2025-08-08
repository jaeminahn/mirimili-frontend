import { Link } from "react-router-dom";

export default function LoginButton() {
  return (
    <div className="flex gap-2">
      <Link
        to="/auth/login"
        className="flex items-center px-4 py-2 text-sm font-semibold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700"
      >
        로그인
      </Link>
    </div>
  );
}
