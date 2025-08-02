import { useEffect, useState } from "react";
import PostItem from "../molecules/PostItem";
import CategoryButton from "../molecules/CategoryButton";
import { get } from "../../api/getAndDel";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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

interface _PostItemProps {
  id: number;
  writer_id: number;
  title: string;
  content: string;
  category_id?: number;
  answer: number;
  like: number;
  dislike: number;
  scrapped: number;
  view: number;
  createdAt: string;
  updatedAt: string;
}

const orderLabel = [
  "최신순",
  "오래된순",
  "조회수많은순",
  "조회수적은순",
  "추천순",
  "비추천순",
  "답변많은순",
  "답변적은순",
];

export default function QuestionsMain() {
  const [tabIndex, setTabIndex] = useState(0);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [postData, setPostData] = useState<PostItemProps[]>([]);
  const [orderBy, setOrderBy] = useState(0);

  useEffect(() => {
    const categoryQuery =
      categoryId !== undefined ? `&category=${categoryId}` : "";

    get(`/questions?order=${orderBy}${categoryQuery}`)
      .then((res) => res.json())
      .then((res) => {
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
  }, [tabIndex, categoryId, orderBy]);

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

      <div className="flex justify-end">
        <Menu as="div" className="relative">
          <MenuButton className="h-10 px-3 py-2 font-normal text-gray-600">
            {orderLabel[orderBy]} ▾
          </MenuButton>
          <MenuItems
            anchor="bottom start"
            className="absolute mt-2 w-36 bg-white rounded-lg shadow-md"
          >
            {orderLabel.map((label, idx) => (
              <MenuItem key={idx}>
                <button
                  className="block w-full h-10 px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none text-left"
                  onClick={() => setOrderBy(idx)}
                >
                  {label}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-3xl">
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
