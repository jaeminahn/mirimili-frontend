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
    <div className="flex items-center px-2 bg-gray-100 rounded-xl shrink-0 gap-x-1">
      <div className="">
        <div className="relative" data-headlessui-state="">
          <button
            className="relative flex items-center justify-center w-6 h-8 my-1 text-gray-500 rounded-sm focus:outline-0 focus:ring-0"
            type="button"
            aria-expanded="false"
            data-headlessui-state=""
            id="headlessui-popover-button-:r41:"
          >
            <Icon icon="fluent:bookmark-24-filled" className="mr-1 text-base" />
          </button>
        </div>
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
      <Link to="/users">
        <div className="relative" data-headlessui-state="">
          <button
            className="relative flex items-center justify-center w-6 h-8 my-1 text-gray-500 rounded-sm focus:outline-0 focus:ring-0"
            type="button"
            aria-expanded="false"
            data-headlessui-state=""
            id="headlessui-popover-button-:r41:"
          >
            <Icon icon="fluent:person-24-filled" className="mr-1 text-base" />
          </button>
        </div>
      </Link>
    </div>
  );
}
