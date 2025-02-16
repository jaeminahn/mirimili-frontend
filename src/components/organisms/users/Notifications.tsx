import React, { useState } from "react";
import NotificationItem from "../../molecules/NotificationItem";

const initialNotificationData = [
  {
    id: 1,
    title: "홍길동123님이 내 질문에 답변했어요!",
    content:
      "내가 작성한 [군대 훈련소 입소 준비물 관련 질문] 질문에 대한 답변 내용을 확인해보세요.",
    createdAt: "1시간 전"
  },
  {
    id: 2,
    title: "동그라미님이 내 질문에 답변했어요!",
    content:
      "내가 작성한 [군대 훈련소 입소 준비물 관련 질문] 질문에 대한 답변 내용을 확인해보세요.",
    createdAt: "6시간 전"
  },
  {
    id: 3,
    title: "상병 진급을 진심으로 축하드려요!🎉🎉",
    content:
      "그동안 고생 많았어요. 앞으로도 조금만 더 힘내주세요:)",
    createdAt: "12시간 전"
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotificationData);

  const handleRead = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

  const notificationList = notifications.map((notification) => (
    <NotificationItem
      key={notification.id}
      title={notification.title}
      content={notification.content}
      createdAt={notification.createdAt}
      onRead={() => handleRead(notification.id)}
    />
  ));

  return (
    <div className="flex flex-col lg:w-4/5 gap-4">
      <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-3xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleMarkAllAsRead}
            disabled={notifications.length === 0}
            className={`w-24 h-8 text-sm font-bold rounded-xl ${
              notifications.length === 0 ? "bg-gray-200 text-gray-500" : "bg-gray-100"
            }`}
          >
            모두 읽음
          </button>
        </div>
        {notificationList.length > 0 ? (
          <>
            {notificationList}
            <p className="text-gray-600 text-center mt-4">최근 30일 동안의 알림을 확인할 수 있어요.</p>
          </>
        ) : (
          <p className="text-gray-600 text-center">최근 30일 동안 새로운 알림이 없어요.</p>
        )}
      </div>
    </div>
  );
}