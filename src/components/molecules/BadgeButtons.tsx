export default function BadgeButtons() {
  return (
    <div className="right-0 shrink-0 items-center gap-x-2 flex">
      <div className="">
        <a href="/users/id/scraped">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="h-6 w-6 text-gray-400 hover:cursor-pointer hover:text-emerald-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            ></path>
          </svg>
        </a>
      </div>
      <div className="">
        <div className="relative" data-headlessui-state="">
          <button
            className="relative -my-1 flex h-8 w-6 items-center justify-center rounded-sm text-gray-400 hover:text-emerald-500 focus:outline-0 focus:ring-0"
            type="button"
            aria-expanded="false"
            data-headlessui-state=""
            id="headlessui-popover-button-:r41:"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="relative">
        <div className="relative" data-headlessui-state="">
          <button
            className="flex rounded-full bg-white focus:outline-none dark:bg-gray-800"
            id="headlessui-menu-button-:r43:"
            type="button"
            aria-haspopup="menu"
            aria-expanded="false"
            data-headlessui-state=""
          >
            <span className="sr-only">Open user menu</span>
            <span className="hidden flex-shrink-0 sm:flex">
              <img
                className="h-8 w-8 rounded-full border border-gray-300 object-cover"
                src="https://i.namu.wiki/i/cxjahe8osGBv0BNMGWCCC6MACktG6lZbfqTEmMIowVvqNjvS7mTbQ5TRZn-m6qZxxdKEeo5srDl9_9Qu8pjcuYwsHuLj4QMBO2NSGi3kLcvK-WS-Xl0OyziaDaXi24phx4AklgiBen_2q8pgvPXfKQ.webp"
                alt="프로필 사진"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
