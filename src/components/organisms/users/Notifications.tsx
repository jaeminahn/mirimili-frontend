import React, { useCallback, useEffect, useMemo, useState } from "react";
import NotificationItem from "../../molecules/NotificationItem";
import { get } from "../../../api/getAndDel";
import { patch } from "../../../api/postAndPut";
import { calculateTimeAgo } from "../../../utils/calculateTime";

interface ApiNotification {
  id: number;
  type: "NOTICE_NEW" | string;
  title: string;
  message: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface ApiListResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    content: ApiNotification[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    size: number;
    hasNext: boolean;
  };
}

export default function Notifications() {
  const [items, setItems] = useState<ApiNotification[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readingAll, setReadingAll] = useState(false);

  const canPrev = page > 0;
  const canNext = totalPages > 0 ? page < totalPages - 1 : hasNext;

  const fetchNotifications = useCallback(
    async (pageToFetch = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", String(pageToFetch));
        params.append("size", "10");

        const res = (await get(`/notifications?${params.toString()}`).then(
          (r) => r.json()
        )) as ApiListResponse;

        const data = res?.data;
        setItems(data?.content ?? []);
        setTotalPages(data?.totalPages ?? 0);
        setHasNext(data?.hasNext ?? false);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchNotifications(page);
  }, [page, fetchNotifications]);

  const maybeAdvanceIfEmpty = useCallback(
    async (nextItemsCount: number) => {
      if (nextItemsCount !== 0) return;
      const hasMore = totalPages > 0 ? page < totalPages - 1 : hasNext;
      if (!hasMore) return;
      await fetchNotifications(page + 1);
      setPage((p) => p + 1);
    },
    [page, totalPages, hasNext, fetchNotifications]
  );

  const handleReadOnly = useCallback(
    async (id: number) => {
      const prev = items;
      const next = items.filter((n) => n.id !== id);
      setItems(next);
      try {
        await patch(`/notifications/${id}/read`, {});
        await maybeAdvanceIfEmpty(next.length);
      } catch {
        setItems(prev);
        alert("알림 읽음 처리에 실패했습니다.");
      }
    },
    [items, maybeAdvanceIfEmpty]
  );

  const handleClickBox = useCallback(
    async (id: number, targetUrl?: string) => {
      const prev = items;
      const next = items.filter((n) => n.id !== id);
      setItems(next);
      try {
        await patch(`/notifications/${id}/read`, {});
        if (targetUrl) window.open(targetUrl, "_blank", "noopener,noreferrer");
        await maybeAdvanceIfEmpty(next.length);
      } catch {
        setItems(prev);
        alert("알림 읽음 처리에 실패했습니다.");
      }
    },
    [items, maybeAdvanceIfEmpty]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (items.length === 0) return;
    setReadingAll(true);
    try {
      await patch(`/notifications/read-all`, {});
      setItems([]);
      const hasMore = totalPages > 0 ? page < totalPages - 1 : hasNext;
      if (hasMore) {
        await fetchNotifications(page + 1);
        setPage((p) => p + 1);
      } else {
        await fetchNotifications(0);
        setPage(0);
      }
    } catch {
      alert("모두 읽음 처리에 실패했습니다.");
    } finally {
      setReadingAll(false);
    }
  }, [items, page, totalPages, hasNext, fetchNotifications]);

  const notificationList = useMemo(() => {
    return items.map((n) => (
      <div
        key={n.id}
        onClick={() => handleClickBox(n.id, n.targetUrl)}
        className="cursor-pointer hover:bg-gray-50 transition rounded-xl"
      >
        <NotificationItem
          title={n.title}
          content={n.message}
          createdAt={calculateTimeAgo(new Date(n.createdAt))}
          onRead={() => handleReadOnly(n.id)}
        />
      </div>
    ));
  }, [items, handleClickBox, handleReadOnly]);

  return (
    <div className="flex flex-col lg:w-4/5 gap-4">
      <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-3xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleMarkAllAsRead}
            disabled={items.length === 0 || readingAll}
            className={`w-24 h-8 text-sm font-bold rounded-xl ${
              items.length === 0 || readingAll
                ? "bg-gray-200 text-gray-500"
                : "bg-gray-100"
            }`}
          >
            {readingAll ? "처리 중…" : "모두 읽음"}
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">불러오는 중…</p>
        ) : notificationList.length > 0 ? (
          <>
            {notificationList}

            <p className="text-gray-600 text-center mt-3 mb-2">
              최근 30일 동안의 알림을 확인할 수 있어요.
            </p>

            <div className="mt-2 flex items-center justify-between">
              <div className="w-28">
                {canPrev && (
                  <button
                    className="px-2 py-1 text-sm rounded-xl border-2 bg-gray-100 border-gray-100 font-medium"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    이전 페이지
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-700">
                <b>
                  {Math.min(
                    page + 1,
                    Math.max(1, totalPages || (hasNext ? page + 1 : 1))
                  )}
                </b>
                &nbsp;/&nbsp;{totalPages || (hasNext ? "…" : 1)}
              </div>

              <div className="w-28 flex justify-end">
                {canNext && (
                  <button
                    className="px-2 py-1 text-sm rounded-xl border-2 bg-gray-100 border-gray-100 font-medium"
                    onClick={() => setPage((p) => p + 1)}
                  >
                    다음 페이지
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center">
            최근 30일 동안 새로운 알림이 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
