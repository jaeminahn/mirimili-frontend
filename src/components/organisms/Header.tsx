import BadgeButtons from "../molecules/BadgeButtons";
import HeaderButtons from "../molecules/HeaderButtons";
import SearchBar from "../molecules/SearchBar";

export default function Header() {
  return (
    <div className="justify-between sticky top-0 z-20 flex h-16 items-center border-b border-b-gray-500/30 bg-white px-5 text-base font-semibold leading-6">
      <a href="">
        <img src="./logo.png" alt="mirimili" width={180} />
      </a>
      <HeaderButtons />
      <SearchBar />
      <BadgeButtons />
    </div>
  );
}
