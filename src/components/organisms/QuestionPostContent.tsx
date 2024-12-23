import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts";
import { ChangeEvent, useRef, useState } from "react";
import AnswerItem from "../molecules/AnswerItem";
import category from "../../data/category.json";

const postData = {
  id: 1,
  writerNick: "김뚝딱",
  writerType: "공군",
  writerLevel: "훈련병",
  categoryId: 0,
  title: "일반차량운전 뭘 준비해야 할까요?",
  content:
    "안녕하십니까. 차량운전 예비입대자입니다. 자격요건과 1차 선발 등을 위한 준비 등은 모두 마쳤습니다. 조금 바보같은 질문일 수 있지만, 수동 연습을 하고 가는 게 도움이 될지 궁금합니다. 당연히 좋은 특기를 받으려면 운전을 잘 해야 할텐데, 오토기어로는 3년 정도 해봤어도 수동기어는 정말 하나도 기억이 안 납니다.. 본가에 있는 트럭이라도 조금 몰아봐야 할지, 그냥 들어가도 될지 궁금합니다.",
  createdAt: "1시간 전",
  view: 156,
  like: 2,
  dislike: 1,
  answer: 3,
  isLiked: true,
  isDisliked: false,
  isScrapped: false,
};

const answerData = [
  {
    id: 1,
    writerNick: "김뚝딱",
    writerType: "공군",
    writerLevel: "훈련병",
    createdAt: "1시간 전",
    content:
      "운전 특기는 수동 운전 능력이 있으면 더욱 유리합니다. 본가의 트럭으로 기본적인 수동 기어 조작에 익숙해지면 자신감도 생기고 시험 시에도 도움이 될 겁니다.",
    like: 2,
    dislike: 1,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 2,
    writerNick: "운전선임",
    writerType: "육군",
    writerLevel: "상병",
    createdAt: "2시간 전",
    content:
      "기본적인 수동 운전이 가능하다면 좋겠지만, 훈련소에서도 차근차근 배우게 됩니다. 입대 전에 간단한 연습만 해도 충분합니다.",
    like: 5,
    dislike: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 3,
    writerNick: "교관K",
    writerType: "공군",
    writerLevel: "교관",
    createdAt: "3시간 전",
    content:
      "훈련소에서 배울 기회가 충분하니 부담 갖지 않으셔도 됩니다. 하지만 시간이 된다면 기초적인 수동 기어 조작은 미리 연습해 두는 것이 좋습니다.",
    like: 3,
    dislike: 2,
    isLiked: false,
    isDisliked: true,
  },
  {
    id: 4,
    writerNick: "박베스트",
    writerType: "해병대",
    writerLevel: "일병",
    createdAt: "5시간 전",
    content:
      "자동차 정비나 기초 운전 경험이 있다면 도움이 됩니다. 하지만 트럭은 조작감이 다를 수 있으니 너무 부담 갖지 마세요.",
    like: 8,
    dislike: 0,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 5,
    writerNick: "운전베테랑",
    writerType: "공군",
    writerLevel: "병장",
    createdAt: "6시간 전",
    content:
      "수동 운전을 잘 못해도 걱정할 필요 없습니다. 대부분은 훈련소에서 충분히 익히게 됩니다. 하지만 기본적인 차량 조작 감각을 익혀두면 적응이 더 빠를 것입니다.",
    like: 6,
    dislike: 1,
    isLiked: false,
    isDisliked: true,
  },
];

export default function QuestionPostContent() {
  const params = useParams();
  const { loggedUser } = useAuth();
  const [answerText, setAnswerText] = useState("");
  const [hideUnit, setHideUnit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getCategoryLabel = (id: number) => {
    const foundCategory = category.find((cat) => cat.id === id);
    return foundCategory ? foundCategory.label : "카테고리 없음? <- 이게 맞나?";
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const answerChildren = answerData.map((answer) => (
    <AnswerItem
      key={answer.id}
      id={answer.id}
      writerNick={answer.writerNick}
      writerType={answer.writerType}
      writerLevel={answer.writerLevel}
      createdAt={answer.createdAt}
      content={answer.content}
      like={answer.like}
      dislike={answer.dislike}
      isLiked={answer.isLiked}
      isDisliked={answer.isDisliked}
    />
  ));

  return (
    <div className="flex flex-col w-4/5 gap-4">
      <p>post id : {params["id"]}</p>
      <div className="flex flex-col gap-6 p-4 bg-white divide-y divide-gray-300 rounded-lg">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm">
            <p className="font-semibold">{postData.writerNick}</p>
            <p className="text-emerald-600">
              {postData.writerType}∙{postData.writerLevel}
            </p>
            <p className="text-xs text-gray-600">{postData.createdAt}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-emerald-600">
              {getCategoryLabel(postData.categoryId)}
            </p>
            <p className="text-2xl font-semibold">{postData.title}</p>
          </div>
          <p className="text-base">{postData.content}</p>
          <div className="flex justify-between text-sm">
            <div className="flex gap-2 font-semibold ">
              <button
                className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
                  postData.isLiked
                    ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                <Icon icon="fluent:thumb-like-24-filled" />
                <p>{postData.like}</p>
              </button>
              <button
                className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
                  postData.isDisliked
                    ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                <Icon icon="fluent:thumb-dislike-24-filled" />
                <p>{postData.dislike}</p>
              </button>
              <button
                className={`flex gap-1 items-center px-2 rounded-lg ${
                  postData.isScrapped
                    ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                <Icon icon="fluent:bookmark-20-filled" />
              </button>
              <button className="flex items-center gap-1 px-2 text-gray-600 bg-gray-100 rounded-lg">
                <Icon icon="fluent:share-20-filled" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <button>신고하기</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2 p-4 mt-4 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2 p-1 text-sm">
              <p className="font-semibold">김뚝딱</p>
              <p className="text-emerald-600">
                공군∙병장{hideUnit ? null : "∙무선통신장비정비"}
              </p>
            </div>
            <textarea
              ref={textareaRef}
              placeholder="답변을 남겨주세요!"
              value={answerText}
              onChange={handleChange}
              className="p-4 mb-2 overflow-hidden border-2 rounded-lg resize-none min-h-20 focus:outline-none"
            />
            <div className="flex justify-between">
              <button
                className="px-4 py-2 text-sm bg-white rounded-lg"
                onClick={() => setHideUnit(!hideUnit)}
              >
                {hideUnit ? "복무 부대 표시하기" : "복무 부대 숨기기"}
              </button>
              <button className="px-6 py-2 text-sm text-white rounded-lg bg-emerald-600">
                답변 등록
              </button>
            </div>
          </div>
        </div>
      </div>
      {answerChildren}
    </div>
  );
}
