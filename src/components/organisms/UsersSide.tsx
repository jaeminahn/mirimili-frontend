import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function UsersSide() {
  return (
    <div className="flex flex-col w-1/5 gap-4">
      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        <div className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 rounded-lg">
            <Icon icon="fluent:person-circle-24-filled" className="mr-1" />
            <p>프로필</p>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 rounded-lg">
            <Icon icon="fluent:alert-24-filled" className="mr-1" />
            <p>알림</p>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 rounded-lg">
            <Icon icon="fluent:bookmark-24-filled" className="mr-1" />
            <p>스크랩</p>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 rounded-lg">
            <Icon icon="fluent:chat-bubbles-question-24-filled" className="mr-1" />
            <p>질문&답변 활동</p>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 rounded-lg">
            <Icon icon="fluent:people-24-filled" className="mr-1" />
            <p>커뮤니티 활동</p>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 rounded-lg">
            <Icon icon="fluent:settings-24-filled" className="mr-1" />
            <p>설정</p>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 rounded-lg">
            <Icon icon="fluent:person-circle-24-filled" className="mr-1" />
            <p>고객센터</p>
        </div>
      </div>
    </div>
  );
}
