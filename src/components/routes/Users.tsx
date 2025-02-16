import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UsersContent from "../organisms/UsersContent";
import UsersSide from "../organisms/UsersSide";

const Users: React.FC = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string>("프로필");

  useEffect(() => {
    if (location.state && location.state.activeMenu) {
      setActiveMenu(location.state.activeMenu);
    }
  }, [location.state]);

  return (
    <main className="flex flex-col items-center pt-6 bg-gray-100">
      <div className="lg:w-3/4 lg:max-w-5xl px-4">
        <p className="text-2xl font-bold mb-6">{activeMenu}</p>
        <div className="flex lg:gap-6">
          <UsersContent activeMenu={activeMenu} />
          <UsersSide activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>
      </div>
    </main>
  );
};

export default Users;
