import React from "react";
import { Icon } from "@iconify/react";

interface UsersSideProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const UsersSide: React.FC<UsersSideProps> = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { icon: "fluent:person-circle-24-filled", label: "프로필" },
    { icon: "fluent:alert-24-filled", label: "알림" },
    { icon: "fluent:bookmark-24-filled", label: "스크랩한 글" },
    { icon: "fluent:chat-bubbles-question-24-filled", label: "질문&답변" },
    { icon: "fluent:people-24-filled", label: "커뮤니티" },
    { icon: "fluent:settings-24-filled", label: "설정" },
    { icon: "fluent:person-circle-24-filled", label: "고객센터" },
  ];

  return (
    <div className="flex flex-col w-1/5 gap-4">
      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        {menuItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActiveMenu(item.label)}
            className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg cursor-pointer ${
              activeMenu === item.label ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-gray-100"
            }`}
          >
            <Icon icon={item.icon} className="mr-1" />
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersSide;
