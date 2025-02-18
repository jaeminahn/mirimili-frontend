import { Link, useLocation } from "react-router-dom";
import BadgeButtons from "../molecules/BadgeButtons";
import HeaderButtons from "../molecules/HeaderButtons";
import LoginButton from "../molecules/LoginButton";
import SearchBar from "../molecules/SearchBar";
import { useAuth } from "../../contexts";
import { useEffect } from "react";
import NavigationBar from "../molecules/NavigationBar";

export default function Header() {
  const { loggedUser } = useAuth();

  useEffect(() => console.log(loggedUser), [loggedUser]);

  return (
    <div className="sticky top-0 z-20 flex flex-col bg-white">
      <div className="flex items-center justify-center h-16 text-base font-semibold leading-6 border-b border-b-gray-500/30">
        <div className="flex justify-between w-full max-w-5xl px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src="/images/logo.png" alt="mirimili" className="w-20" />
            </Link>
            <div className="hidden lg:flex">
              <HeaderButtons />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              <SearchBar />
            </div>
            {loggedUser ? <BadgeButtons /> : <LoginButton />}
          </div>
        </div>
      </div>

      <NavigationBar />
    </div>
  );
}
