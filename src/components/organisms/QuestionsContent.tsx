import { useEffect, useState } from "react";
import PostItem from "../molecules/PostItem";
import { Icon } from "@iconify/react";
import CategoryButton from "../molecules/CategoryButton";
import { get } from "../../api/getAndDel";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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
  const [categoryId, setCategoryId] = useState<number>(0);
  const [postData, setPostData] = useState<PostItemProps[]>([]);
  const [orderBy, setOrderBy] = useState(0);

  useEffect(() => {
    get(
      `/questions${`?order=${orderBy}`}${
        categoryId !== 0 ? "&category=" + categoryId : ""
      }`
    )
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
  }, [tabIndex, categoryId, orderBy]);

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
        <Menu>
          <MenuButton className="h-10 p-2 font-normal text-gray-600 rounded-lg focus:outline-none">
            {orderLabel[orderBy]} ▾
          </MenuButton>
          <MenuItems anchor="left start" className="bg-white rounded-lg ">
            {orderLabel.map((label, idx) => (
              <MenuItem>
                <button
                  className="block h-10 p-2 font-medium text-gray-600 focus:outline-none"
                  onClick={() => setOrderBy(idx)}
                >
                  {label}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
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
