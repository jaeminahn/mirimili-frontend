import React from "react";
import { Icon } from "@iconify/react";

interface UsersSideProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const UsersSide: React.FC<UsersSideProps> = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { icon: "fluent:chat-24-filled", label: "내 활동" },
    { icon: "fluent:alert-24-filled", label: "알림" },
    { icon: "fluent:bookmark-24-filled", label: "스크랩" },
    { icon: "fluent:settings-24-filled", label: "설정" }
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
