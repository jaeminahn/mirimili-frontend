import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function NavigationBar() {
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-t-gray-500/30 shadow-md sm:block lg:hidden">
      <div className="flex justify-around py-2">
        <Link to="/" className="flex flex-col items-center">
          <Icon
            icon="fluent:home-24-filled"
            className={`w-6 h-6 ${isActive("/") ? "text-emerald-500" : "text-gray-600"}`}
          />
          <span className={`${isActive("/") ? "text-emerald-500" : "text-gray-600"} text-xs`}>홈</span>
        </Link>
        <Link to="/questions" className="flex flex-col items-center">
          <Icon
            icon="fluent:chat-bubbles-question-24-filled"
            className={`w-6 h-6 ${isActive("/questions") ? "text-emerald-500" : "text-gray-600"}`}
          />
          <span className={`${isActive("/questions") ? "text-emerald-500" : "text-gray-600"} text-xs`}>질문&답변</span>
        </Link>
        <Link to="/millitip" className="flex flex-col items-center">
          <Icon
            icon="fluent:lightbulb-20-filled"
            className={`w-6 h-6 ${isActive("/millitip") ? "text-emerald-500" : "text-gray-600"}`}
          />
          <span className={`${isActive("/millitip") ? "text-emerald-500" : "text-gray-600"} text-xs`}>밀리팁</span>
        </Link>
      </div>
    </div>
  );
}
