export default function PostItem() {
  return (
    <li className="py-4 last:pb-0">
      <div className="mb-2 flex">
        <div className="flex flex-1 items-center space-x-1">
          <a href="/users/157220">
            <img
              className="h-5 w-5 rounded-full object-cover"
              src="https://i.namu.wiki/i/cxjahe8osGBv0BNMGWCCC6MACktG6lZbfqTEmMIowVvqNjvS7mTbQ5TRZn-m6qZxxdKEeo5srDl9_9Qu8pjcuYwsHuLj4QMBO2NSGi3kLcvK-WS-Xl0OyziaDaXi24phx4AklgiBen_2q8pgvPXfKQ.webp"
              alt="프로필 사진"
            />
          </a>
          <a
            className="inline pl-1 text-xs font-medium text-gray-700 hover:text-emerald-500 sm:text-sm "
            href="/users/157220"
          >
            박민석
          </a>
          <div className="text-xs font-normal leading-5 text-gray-700 sm:text-sm">
            <span className="mr-0.5">·</span>
            <svg
              className="inline h-3 w-3"
              width="9"
              height="12"
              viewBox="0 1 9 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>bolt icon</title>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.21535 0.575533C5.4443 0.647704 5.6 0.86003 5.6 1.10009V3.85009L7.8 3.85009C8.00508 3.85009 8.19313 3.96419 8.28783 4.14609C8.38254 4.328 8.36818 4.54748 8.25057 4.71549L4.40057 10.2155C4.26291 10.4122 4.0136 10.4968 3.78464 10.4246C3.55569 10.3525 3.4 10.1401 3.4 9.90009L3.4 7.15009H1.2C0.994914 7.15009 0.806866 7.03599 0.712157 6.85408C0.617448 6.67218 0.631811 6.45269 0.749418 6.28468L4.59942 0.784684C4.73708 0.588021 4.98639 0.503362 5.21535 0.575533Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="space-x-1">
              <span>1.2k</span>
              <span>·</span>
              <span>약 3시간 전</span>
            </span>
          </div>
        </div>
        <div className="flex space-x-2 text-gray-700">
          <div className="flex flex-1 items-center gap-x-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="h-4 w-4 shrink-0"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              ></path>
            </svg>
            <span className="text-xs font-normal sm:text-sm">4</span>
          </div>
          <div className="flex flex-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="h-4 w-4 shrink-0"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              ></path>
            </svg>
            <span className="ml-0.5 text-xs font-normal sm:text-sm">5</span>
          </div>
        </div>
      </div>
      <div>
        <a
          className="line-clamp-1 w-fit break-all text-sm font-semibold text-gray-900 hover:text-emerald-500 sm:text-base sm:leading-5"
          href="/questions/1513626"
        >
          글 제목 글 제목 글 제목 글 제목 글 제목 글 제목 글 제목 글 제목 글
          제목 글 제목 글 제목 글 제목 글 제목
        </a>
      </div>
    </li>
  );
}
