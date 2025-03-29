import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const menuItems = [
  { icon: "fluent:chat-24-filled", label: "내 활동" },
  //{ icon: "fluent:alert-24-filled", label: "알림" },
  //{ icon: "fluent:bookmark-24-filled", label: "스크랩" },
  { icon: "fluent:settings-24-filled", label: "설정" }
];

export default function BadgeButtons() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenuAndNavigate = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex items-center py-2 text-gray-500 gap-x-3">
      {/*
      <Link
        to="/users/mypage"
        state={{ activeMenu: "스크랩" }}
        className="hidden md:flex md:items-center md:justify-center md:w-10 md:h-10 md:bg-gray-100 md:hover:bg-gray-200 md:rounded-lg"
      >
        <Icon icon="fluent:bookmark-24-filled" className="text-lg" />
      </Link>

      <Link
        to="/users/mypage"
        state={{ activeMenu: "알림" }}
        className="hidden md:flex md:items-center md:justify-center md:w-10 md:h-10 md:bg-gray-100 md:hover:bg-gray-200 md:rounded-lg"
      >
        <Icon icon="fluent:alert-24-filled" className="text-lg" />
      </Link>
      */}

      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg md:hidden"
      >
        <Icon icon="fluent:person-24-filled" className="text-lg" />
      </button>

      {isMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-lg rounded-b-lg py-2 z-10 md:hidden">
          <ul className="font-normal">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-center px-4 py-4 hover:bg-gray-200 bg-gray-100 rounded-lg mb-2 mx-4"
              >
                <Icon icon={item.icon} className="mr-3 text-lg" />
                <Link
                  to="/users/mypage"
                  state={{ activeMenu: item.label }}
                  onClick={closeMenuAndNavigate}
                  className="text-black text-lg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to="/users/mypage"
        state={{ activeMenu: "내 활동" }}
        className="hidden md:flex md:items-center md:justify-center md:w-10 md:h-10 md:bg-gray-100 md:hover:bg-gray-200 md:rounded-lg"
      >
        <Icon icon="fluent:person-24-filled" className="text-lg" />
      </Link>
    </div>
  );
}
