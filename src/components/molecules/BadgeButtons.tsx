import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function BadgeButtons() {
  return (
    <div className="flex items-center px-2 text-gray-500 bg-gray-100 rounded-xl shrink-0 gap-x-2 ">
      <Link to="/users/mypage" state={{ activeMenu: "스크랩" }}>
        <Icon icon="fluent:bookmark-24-filled" className="text-base" />
      </Link>
      <Link to="/users/mypage" state={{ activeMenu: "알림" }}>
        <Icon icon="fluent:alert-24-filled" className="text-base" />
      </Link>
      <Link to="/users/mypage" state={{ activeMenu: "내 활동" }}>
        <Icon icon="fluent:person-24-filled" className="text-base" />
      </Link>
    </div>
  );
}
