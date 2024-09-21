import BadgeButtons from "../molecules/BadgeButtons";
import HeaderButtons from "../molecules/HeaderButtons";
import LoginRegisterButtons from "../molecules/LoginRegisterButtons";
import SearchBar from "../molecules/SearchBar";

export default function Header() {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-center h-20 text-base font-semibold leading-6 bg-white border-b border-b-gray-500/30">
      <div className="flex justify-between w-3/4 max-w-6xl">
        <div className="flex gap-7">
          <a href="">
            <img src="./images/logo.png" alt="mirimili" width={100} />
          </a>
          <HeaderButtons />
        </div>
        <div className="flex gap-7">
          <SearchBar />
          {/* <BadgeButtons /> */}
          <LoginRegisterButtons />
        </div>
      </div>
    </div>
  );
}
