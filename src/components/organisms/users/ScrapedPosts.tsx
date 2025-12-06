import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostItem from "../../molecules/PostItem";
import { getJSON } from "../../../api/getAndDel";
import { calculateTimeAgo } from "../../../utils/calculateTime";

type ApiEnvelope<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

type PageResult<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
};

type ScrapedPost = {
  id: number;
  title: string;
  body: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  createdAt: string;
};

export default function ScrapedPosts() {
  const [tabIndex, setTabIndex] = useState(0);

  const [posts, setPosts] = useState<ScrapedPost[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrMsg("");

      const res = await getJSON<ApiEnvelope<PageResult<ScrapedPost>>>(
        `/posts/scrap/my?page=${page}&size=10`
      );

      if (res.status === 401) {
        navigate("/auth/login", { replace: true });
        return;
      }

      if (!mounted) return;

      if (res.ok && res.data?.success) {
        const data = res.data.data;
        const items = data?.content ?? [];
        setPosts(items);
        setTotalPages(data?.totalPages ?? 0);
        setHasNext(data?.hasNext ?? false);
      } else {
        setErrMsg(
          res.data?.message ||
            "스크랩한 게시글을 불러오는 중 오류가 발생했습니다."
        );
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [navigate, page]);

  const renderPosts = () => {
    if (loading) return <p className="text-gray-500">불러오는 중…</p>;
    if (errMsg) return <p className="text-red-600">{errMsg}</p>;
    if (!posts.length)
      return <p className="text-gray-600">스크랩한 게시글이 없습니다.</p>;

    const canPrev = page > 0;
    const canNext = totalPages > 0 ? page < totalPages - 1 : hasNext;

    return (
      <>
        {posts.map((p) => (
          <PostItem
            key={p.id}
            id={p.id}
            title={p.title}
            content={p.body}
            createdAt={calculateTimeAgo(new Date(p.createdAt))}
            view={p.viewCount}
            like={p.likeCount}
            answer={p.commentCount}
          />
        ))}

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
    );
  };

  return (
    <div className="flex flex-col lg:w-4/5 gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 text-sm">
          <button
            className={`h-10 p-2 font-semibold rounded-lg border-2 ${
              tabIndex === 0
                ? "bg-emerald-100 border-emerald-600"
                : "bg-white border-white"
            }`}
            onClick={() => setTabIndex(0)}
          >
            질문&답변
          </button>
        </div>
      </div>
      <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-3xl">
        {renderPosts()}
      </div>
    </div>
  );
}
