import { Link } from "react-router-dom";
import BadgeButtons from "../molecules/BadgeButtons";
import HeaderButtons from "../molecules/HeaderButtons";
import LoginButton from "../molecules/LoginButton";
import SearchBar from "../molecules/SearchBar";
import { useAuth } from "../../contexts";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function Header() {
  const { loggedUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => console.log(loggedUser), [loggedUser]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="sticky top-0 z-20 flex items-center justify-center h-20 text-base font-semibold leading-6 bg-white border-b border-b-gray-500/30">
      <div className="flex justify-between w-full max-w-5xl px-4 md:w-3/4">
        <div className="flex items-center gap-4 md:gap-7">
          <Link to="/">
            <img src="/images/logo.png" alt="mirimili" className="w-20 md:w-24" />
          </Link>
          <div className="hidden md:flex">
            <HeaderButtons />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex">
            <SearchBar />
          </div>
          {!loggedUser ? <BadgeButtons /> : <LoginButton />}
          <button
            className="block p-2 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <Icon
              icon={menuOpen ? "material-symbols:close" : "material-symbols:menu"}
              className="w-6 h-6 text-gray-600"
            />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col items-center gap-4 p-4">
            <SearchBar />
            <HeaderButtons onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
}
