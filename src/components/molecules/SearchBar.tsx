export default function SearchBar() {
  return (
    <div className="w-60">
      <div className="flex items-center transition-colors bg-gray-100 h-9 rounded-xl focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600">
        <input
          className="w-full pl-3 text-sm font-medium text-gray-900 placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0"
          type="text"
          placeholder="검색어를 입력하세요"
        />
        <button className="-my-0.5 -ml-1.5 flex h-8 w-8 flex-shrink-0 items-center justify-center transition duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="h-3.5 w-3.5 text-gray-500 hover:text-emerald-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
