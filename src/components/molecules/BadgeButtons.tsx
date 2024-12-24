import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Icon } from "@iconify/react";

export default function BadgeButtons() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const onAccept = useCallback(() => {
    logout(() => {
      navigate("/");
    });
  }, []);

  return (
    <Link className="flex items-center px-2 bg-gray-100 rounded-xl shrink-0 gap-x-2" to="/users">
      <div className="">
        <Link to="/users/id/scrapped">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#6b7280"
            strokeWidth="1"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="w-5 h-5 text-gray-500 hover:cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            ></path>
          </svg>
        </Link>
      </div>
      <div className="">
        <div className="relative" data-headlessui-state="">
          <button
            className="relative flex items-center justify-center w-6 h-8 my-1 text-gray-500 rounded-sm focus:outline-0 focus:ring-0"
            type="button"
            aria-expanded="false"
            data-headlessui-state=""
            id="headlessui-popover-button-:r41:"
          >
            <Icon icon="fluent:alert-24-filled" className="mr-1 text-base" />
          </button>
        </div>
      </div>
      <div className="relative">
        <div className="relative" data-headlessui-state="">
          <button
            className="flex bg-white rounded-full focus:outline-none dark:bg-gray-800"
            onClick={onAccept}
            id="headlessui-menu-button-:r43:"
            type="button"
            aria-haspopup="menu"
            aria-expanded="false"
            data-headlessui-state=""
          >
            <span className="sr-only">Open user menu</span>
            <span className="flex-shrink-0 hidden sm:flex">
              <img
                className="object-cover w-5 h-5 border border-gray-300 rounded-full"
                src="https://i.namu.wiki/i/cxjahe8osGBv0BNMGWCCC6MACktG6lZbfqTEmMIowVvqNjvS7mTbQ5TRZn-m6qZxxdKEeo5srDl9_9Qu8pjcuYwsHuLj4QMBO2NSGi3kLcvK-WS-Xl0OyziaDaXi24phx4AklgiBen_2q8pgvPXfKQ.webp"
                alt="프로필 사진"
              />
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
