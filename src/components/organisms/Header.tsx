import { Link } from "react-router-dom";
import BadgeButtons from "../molecules/BadgeButtons";
import HeaderButtons from "../molecules/HeaderButtons";
import LoginButton from "../molecules/LoginButton";
import SearchBar from "../molecules/SearchBar";
import { useAuth } from "../../contexts";
import { useEffect } from "react";

export default function Header() {
  const { loggedUser } = useAuth();
  useEffect(() => console.log(loggedUser), [loggedUser]);

  return (
    <div className="sticky top-0 z-20 flex items-center justify-center h-20 text-base font-semibold leading-6 bg-white border-b border-b-gray-500/30">
      <div className="flex justify-between w-3/4 max-w-5xl">
        <div className="flex gap-7">
          <Link to="/">
            <img src="/images/logo.png" alt="mirimili" width={100} />
          </Link>
          <HeaderButtons />
        </div>
        <div className="flex gap-3">
          <SearchBar />
          {!loggedUser ? <BadgeButtons /> : <LoginButton />}
        </div>
      </div>
    </div>
  );
}
