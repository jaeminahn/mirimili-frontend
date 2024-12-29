import { useEffect, useState } from "react";
import PostItem from "../molecules/PostItem";
import { Icon } from "@iconify/react";
import CategoryButton from "../molecules/CategoryButton";
import { get } from "../../api/getAndDel";

interface PostItemProps {
  id: number;
  writerId: number;
  title: string;
  content: string;
  categoryId: number;
  answer: number;
  like: number;
  dislike: number;
  scrapped: number;
  view: number;
  createdAt: string;
  updatedAt: string;
}

interface _PostItemProps {
  id: number;
  writer_id: number;
  title: string;
  content: string;
  category_id: number;
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
  const [categoryId, setCategoryId] = useState<number>(0);
  const [postData, setPostData] = useState<PostItemProps[]>([]);

  useEffect(() => {
    // console.log(
    //   `/questions${
    //     tabIndex !== 0
    //       ? "?forme=true"
    //       : categoryId !== 0
    //       ? "?category=" + categoryId
    //       : ""
    //   }`
    // );
    get(`/questions${categoryId !== 0 ? "?category=" + categoryId : ""}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setPostData(
          res.map((item: _PostItemProps) => ({
            id: item.id,
            writerId: item.writer_id,
            title: item.title,
            content: item.content,
            categoryId: item.category_id,
            answer: 0,
            like: item.like,
            dislike: item.dislike,
            scrapped: item.scrapped,
            view: item.view,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }))
        );
      });
  }, [tabIndex, categoryId]);

  return (
    <div className="flex flex-col w-4/5 gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 text-sm">
          <button
            className={`h-10 p-2 font-semibold rounded-lg border-2 ${
              tabIndex === 0
                ? "bg-emerald-100 border-emerald-600"
                : "bg-white border-white"
            } `}
            onClick={() => setTabIndex(0)}
          >
            🙋‍♂️ 질문&답변
          </button>
          <button
            className={`h-10 p-2 font-semibold rounded-lg border-2 ${
              tabIndex === 1
                ? "bg-emerald-100 border-emerald-600"
                : "bg-white border-white"
            } `}
            onClick={() => setTabIndex(1)}
          >
            🙏 내 답변을 기다리는 질문
          </button>
        </div>
        <button className="flex items-center gap-1 text-sm text-gray-600">
          추천순
          <Icon icon="fluent:chevron-down-24-regular" />
        </button>
      </div>
      <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-lg">
        {tabIndex === 0 && (
          <CategoryButton
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
        )}
        {postData.length > 0 ? (
          postData.map((item) => (
            <PostItem
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              createdAt={item.createdAt}
              view={item.view}
              like={item.like}
              answer={item.answer}
            />
          ))
        ) : (
          <p className="p-4 text-gray-600">
            선택한 카테고리에 해당하는 글이 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
