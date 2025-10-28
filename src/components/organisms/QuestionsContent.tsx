import { useEffect, useState } from "react";
import PostItem from "../molecules/PostItem";
import CategoryButton from "../molecules/CategoryButton";
import { get } from "../../api/getAndDel";
import categories from "../../data/category.json";
import { calculateTimeAgo } from "../../utils/calculateTime";

interface PostItemProps {
  id: number;
  writerId: number;
  title: string;
  content: string;
  categoryId?: number;
  answer: number;
  like: number;
  dislike: number;
  scrapped: number;
  view: number;
  createdAt: string;
  updatedAt: string;
}

export default function QuestionsMain() {
  const [tabIndex, setTabIndex] = useState(0);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [postData, setPostData] = useState<PostItemProps[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryId !== undefined) {
      params.append("categoryIds", String(categoryId));
    } else {
      categories.forEach((c: { id: number }) =>
        params.append("categoryIds", String(c.id))
      );
    }
    params.append("page", String(page));
    params.append("size", "10");
    params.append("sortBy", "createdAt");

    get(`/posts/list?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        const items = res?.data?.content ?? [];
        setPostData(
          items.map((item: any) => ({
            id: item.id,
            writerId: 0,
            title: item.title,
            content: item.body,
            categoryId: undefined,
            answer: item.commentCount,
            like: item.likeCount,
            dislike: 0,
            scrapped: 0,
            view: item.viewCount,
            createdAt: item.createdAt,
            updatedAt: item.createdAt,
          }))
        );
        setTotalPages(res?.data?.totalPages ?? 0);
        setHasNext(res?.data?.hasNext ?? false);
      });
  }, [tabIndex, categoryId, page]);

  useEffect(() => {
    setPage(0);
  }, [categoryId]);

  const canPrev = page > 0;
  const canNext = totalPages > 0 ? page < totalPages - 1 : hasNext;

  return (
    <div className="flex flex-col w-full lg:w-4/5 max-w-full gap-4">
      <div className="flex gap-2 text-sm">
        <button
          className={`h-10 p-2 font-semibold rounded-lg border-2 ${
            tabIndex === 0
              ? "bg-emerald-100 border-emerald-600"
              : "bg-white border-white"
          }`}
          onClick={() => setTabIndex(0)}
        >
          전체 질문
        </button>
        <button
          className={`h-10 p-2 font-semibold rounded-lg border-2 ${
            tabIndex === 1
              ? "bg-emerald-100 border-emerald-600"
              : "bg-white border-white"
          }`}
          onClick={() => setTabIndex(1)}
        >
          내 답변을 기다리는 질문
        </button>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-white rounded-3xl">
        <CategoryButton categoryId={categoryId} setCategoryId={setCategoryId} />
      </div>

      <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-3xl">
        {postData.length > 0 ? (
          <>
            {postData.map((item) => (
              <PostItem
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
                createdAt={calculateTimeAgo(new Date(item.createdAt))}
                view={item.view}
                like={item.like}
                answer={item.answer}
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
        ) : (
          <p className="p-4 text-gray-600">
            선택한 카테고리에 해당하는 글이 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
