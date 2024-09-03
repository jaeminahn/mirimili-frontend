export default function SearchBar() {
  return (
    <div className="w-60">
      <div className="flex h-[35px] items-center rounded-lg border border-gray-300 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
        <button className="-my-0.5 -mr-1.5 flex h-8 w-8 flex-shrink-0 items-center justify-center transition duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="h-3.5 w-3.5 text-gray-400 hover:text-emerald-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            ></path>
          </svg>
        </button>
        <input
          className="w-full border-none bg-transparent p-0 pr-2 text-sm font-medium placeholder-gray-500/80 focus:border-gray-500 focus:outline-none focus:ring-0"
          type="text"
          placeholder="검색"
        />
      </div>
    </div>
  );
}
