import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostItem from "../../molecules/PostItem";
import MyAnswerItem from "../../molecules/MyAnswerItem";
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

type MyPost = {
  id: number;
  title: string;
  body: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  createdAt: string;
};

type MyAnswer = {
  postId: number;
  postTitle: string;
  myCommentBody: string;
  createdAt?: string;
  likeCount?: number;
};

export default function Activities() {
  const [tabIndex, setTabIndex] = useState(0);
  const [qnaIndex, setQnaIndex] = useState(0);

  const [posts, setPosts] = useState<MyPost[]>([]);
  const [answers, setAnswers] = useState<MyAnswer[]>([]);

  const [postPage, setPostPage] = useState(0);
  const [postTotalPages, setPostTotalPages] = useState(0);
  const [postHasNext, setPostHasNext] = useState(false);

  const [answerPage, setAnswerPage] = useState(0);
  const [answerTotalPages, setAnswerTotalPages] = useState(0);
  const [answerHasNext, setAnswerHasNext] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrMsg("");

      const [pRes, aRes] = await Promise.all([
        getJSON<ApiEnvelope<PageResult<MyPost>>>(
          `/mypage/posts?page=${postPage}&size=10`
        ),
        getJSON<ApiEnvelope<PageResult<MyAnswer>>>(
          `/mypage/answers?page=${answerPage}&size=10`
        ),
      ]);

      if (pRes.status === 401 || aRes.status === 401) {
        navigate("/auth/login", { replace: true });
        return;
      }

      if (!mounted) return;

      if (pRes.ok && pRes.data?.success) {
        const data = pRes.data.data;
        const items = [...(data?.content ?? [])].reverse();
        setPosts(items);
        setPostTotalPages(data?.totalPages ?? 0);
        setPostHasNext(data?.hasNext ?? false);
      } else {
        setErrMsg(
          pRes.data?.message || "게시글을 불러오는 중 오류가 발생했습니다."
        );
      }

      if (aRes.ok && aRes.data?.success) {
        const data = aRes.data.data;
        const items = [...(data?.content ?? [])].reverse();
        setAnswers(items);
        setAnswerTotalPages(data?.totalPages ?? 0);
        setAnswerHasNext(data?.hasNext ?? false);
      } else {
        setErrMsg((prev) => {
          if (prev) return prev;
          return (
            aRes.data?.message || "답변을 불러오는 중 오류가 발생했습니다."
          );
        });
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [navigate, postPage, answerPage]);

  const renderPosts = () => {
    if (loading) return <p className="text-gray-500">불러오는 중…</p>;
    if (errMsg) return <p className="text-red-600">{errMsg}</p>;
    if (!posts.length)
      return <p className="text-gray-600">게시글이 존재하지 않아요.</p>;

    const canPrev = postPage > 0;
    const canNext =
      postTotalPages > 0 ? postPage < postTotalPages - 1 : postHasNext;

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
                onClick={() => setPostPage((p) => Math.max(0, p - 1))}
              >
                이전 페이지
              </button>
            )}
          </div>

          <div className="text-sm text-gray-700">
            <b>
              {Math.min(
                postPage + 1,
                Math.max(1, postTotalPages || (postHasNext ? postPage + 1 : 1))
              )}
            </b>
            &nbsp;/&nbsp;{postTotalPages || (postHasNext ? "…" : 1)}
          </div>

          <div className="w-28 flex justify-end">
            {canNext && (
              <button
                className="px-2 py-1 text-sm rounded-xl border-2 bg-gray-100 border-gray-100 font-medium"
                onClick={() => setPostPage((p) => p + 1)}
              >
                다음 페이지
              </button>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderAnswers = () => {
    if (loading) return <p className="text-gray-500">불러오는 중…</p>;
    if (errMsg) return <p className="text-red-600">{errMsg}</p>;
    if (!answers.length)
      return <p className="text-gray-600">답변이 존재하지 않아요.</p>;

    const canPrev = answerPage > 0;
    const canNext =
      answerTotalPages > 0 ? answerPage < answerTotalPages - 1 : answerHasNext;

    return (
      <>
        {answers.map((a, idx) => (
          <MyAnswerItem
            key={`${a.postId}-${idx}`}
            id={a.postId}
            questionId={a.postId}
            title={a.postTitle}
            content={a.myCommentBody}
            like={a.likeCount ?? 0}
            createdAt={
              a.createdAt ? calculateTimeAgo(new Date(a.createdAt)) : ""
            }
          />
        ))}

        <div className="mt-2 flex items-center justify-between">
          <div className="w-28">
            {canPrev && (
              <button
                className="px-2 py-1 text-sm rounded-xl border-2 bg-gray-100 border-gray-100 font-medium"
                onClick={() => setAnswerPage((p) => Math.max(0, p - 1))}
              >
                이전 페이지
              </button>
            )}
          </div>

          <div className="text-sm text-gray-700">
            <b>
              {Math.min(
                answerPage + 1,
                Math.max(
                  1,
                  answerTotalPages || (answerHasNext ? answerPage + 1 : 1)
                )
              )}
            </b>
            &nbsp;/&nbsp;{answerTotalPages || (answerHasNext ? "…" : 1)}
          </div>

          <div className="w-28 flex justify-end">
            {canNext && (
              <button
                className="px-2 py-1 text-sm rounded-xl border-2 bg-gray-100 border-gray-100 font-medium"
                onClick={() => setAnswerPage((p) => p + 1)}
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
        <div className="relative flex gap-4 border-b-2 border-gray-200">
          <button
            className={`relative py-2 px-4 text-sm font-semibold ${
              qnaIndex === 0
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setQnaIndex(0)}
          >
            내 질문
          </button>
          <button
            className={`relative py-2 px-4 text-sm font-semibold ${
              qnaIndex === 1
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setQnaIndex(1)}
          >
            내 답변
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {qnaIndex === 0 ? renderPosts() : renderAnswers()}
        </div>
      </div>
    </div>
  );
}
