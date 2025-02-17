import React, { useState } from "react";
import PostItem from "../../molecules/PostItem";
import MyAnswerItem from "../../molecules/MyAnswerItem";
import { Icon } from "@iconify/react";

const postData = [
  {
    id: 1,
    title: "일반차량운전 뭘 준비해야 할까요?",
    content:
      "안녕하십니까. 차량운전 예비입대자입니다. 자격요건과 1차 선발 등을 위한 준비 등은 모두 마쳤습니다. 조금 바보같은 질문일 수 있지만, 수동 연습을 하고 가는 게 도움이 될지 궁금합니다.",
    createdAt: "1시간 전",
    view: 156,
    like: 2,
    answer: 3,
  },
  {
    id: 2,
    title: "군대 훈련소 입소 준비물 관련 질문",
    content:
      "안녕하세요. 훈련소에 처음 입소하는데 어떤 준비물이 필요한지 궁금합니다. 특히 겨울이라서 보온과 관련된 준비물도 고민이 되네요.",
    createdAt: "2시간 전",
    view: 120,
    like: 4,
    answer: 5,
  },
];

const answerData = [
  {
    id: 1,
    question_id: 1,
    title: "일반차량운전 뭘 준비해야 할까요?",
    content:
      "운전 특기는 수동 운전 능력이 있으면 더욱 유리합니다. 본가의 트럭으로 기본적인 수동 기어 조작에 익숙해지면 자신감도 생기고 시험 시에도 도움이 될 겁니다.",
    like: 2,
    createdAt: "1시간 전",
  },
  {
    id: 2,
    question_id: 1,
    title: "일반차량운전 뭘 준비해야 할까요?",
    content:
      "기본적인 수동 운전이 가능하다면 좋겠지만, 훈련소에서도 차근차근 배우게 됩니다. 입대 전에 간단한 연습만 해도 충분합니다.",
    like: 5,
    createdAt: "2시간 전",
  },
];

export default function Activities() {
  const [tabIndex, setTabIndex] = useState(0);
  const [qnaIndex, setQnaIndex] = useState(0);

  const renderPosts = () => {
    if (postData.length === 0) {
      return <p className="text-gray-600">게시글이 없습니다.</p>;
    }

    return postData.map((post) => (
      <PostItem
        key={post.id}
        id={post.id}
        title={post.title}
        content={post.content}
        createdAt={post.createdAt}
        view={post.view}
        like={post.like}
        answer={post.answer}
      />
    ));
  };

  const renderAnswers = () => {
    if (answerData.length === 0) {
      return <p className="text-gray-600">답변이 없습니다.</p>;
    }

    return answerData.map((answer) => (
      <MyAnswerItem
        key={answer.id}
        id={answer.id}
        questionId={answer.question_id}
        title={answer.title}
        content={answer.content}
        createdAt={answer.createdAt}
        like={answer.like}
      />
    ));
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
          {/*<button
            className={`h-10 p-2 font-semibold rounded-lg border-2 ${
              tabIndex === 1
                ? "bg-emerald-100 border-emerald-600"
                : "bg-white border-white"
            }`}
            onClick={() => setTabIndex(1)}
          >
            커뮤니티
          </button>*/}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-3xl">
        <div className="flex flex-col items-center p-6 bg-gray-100 rounded-xl">
          <p className="text-sm font-medium text-gray-600 mb-2">내 활동 점수</p>
          <div className="flex items-center text-2xl font-bold text-emerald-600">
            <Icon icon="fluent:trophy-24-filled" className="mr-1" />
            <p>476</p>
          </div>
        </div>
        <div className="flex flex-col items-center p-6 bg-gray-100 rounded-xl">
          <p className="text-sm font-medium text-gray-600 mb-2">랭킹</p>
          <p className="text-2xl font-bold text-emerald-600">1,564위</p>
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
