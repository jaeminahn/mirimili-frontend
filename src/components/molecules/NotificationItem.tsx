interface NotificationProps {
  title: string;
  content: string;
  createdAt: string;
  onRead: () => void;
}

export default function NotificationItem({
  title,
  content,
  createdAt,
  onRead,
}: NotificationProps) {
  return (
    <div className="flex flex-col gap-2 p-6 border border-gray-300 rounded-lg">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm text-gray-700 line-clamp-2">{content}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-500">{createdAt}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRead();
          }}
          className="w-16 h-6 text-xs font-medium rounded-full flex items-center justify-center bg-gray-100"
        >
          읽음
        </button>
      </div>
    </div>
  );
}
