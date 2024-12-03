import { useState } from "react";
import PostItem from "../molecules/PostItem";
import { Icon } from "@iconify/react";
import CategoryButton from "../molecules/CategoryButton";

const postData = [
  {
    id: 1,
    categoryId: 0,
    title: "일반차량운전 뭘 준비해야 할까요?",
    content:
      "안녕하십니까. 차량운전 예비입대자입니다. 자격요건과 1차 선발 등을 위한 준비 등은 모두 마쳤습니다. 조금 바보같은 질문일 수 있지만, 수동 연습을 하고 가는 게 도움이 될지 궁금합니다. 당연히 좋은 특기를 받으려면 운전을 잘 해야 할텐데, 오토기어로는 3년 정도 해봤어도 수동기어는 정말 하나도 기억이 안 납니다.. 본가에 있는 트럭이라도 조금 몰아봐야 할지, 그냥 들어가도 될지 궁금합니다.",
    createdAt: "1시간 전",
    view: 156,
    like: 2,
    answer: 3,
  },
  {
    id: 2,
    categoryId: 1,
    title: "군대 훈련소 입소 준비물 관련 질문",
    content:
      "안녕하세요. 훈련소에 처음 입소하는데 어떤 준비물이 필요한지 궁금합니다. 특히 겨울이라서 보온과 관련된 준비물도 고민이 되네요. 조언 부탁드립니다!",
    createdAt: "2시간 전",
    view: 120,
    like: 4,
    answer: 5,
  },
  {
    id: 3,
    categoryId: 7,
    title: "휴가 기간 중 여행 계획, 추천 지역 있을까요?",
    content:
      "곧 휴가가 나오는데 여행을 가고 싶습니다. 추천할 만한 국내 여행지가 있을까요? 가격도 합리적이고 휴식을 취할 수 있는 곳을 찾고 있습니다.",
    createdAt: "3시간 전",
    view: 200,
    like: 10,
    answer: 7,
  },
  {
    id: 4,
    categoryId: 0,
    title: "체력 단련을 위한 군대 필수 운동 추천",
    content:
      "입대 전에 체력을 키우려고 하는데 어떤 운동이 가장 효과적인지 알려주세요. 특히 훈련소에서 도움이 될 만한 운동을 추천받고 싶습니다.",
    createdAt: "1일 전",
    view: 95,
    like: 1,
    answer: 2,
  },
  {
    id: 5,
    categoryId: 0,
    title: "군대 통신병 지원시 준비사항",
    content:
      "통신병으로 지원하려고 하는데 필요한 기술이나 지식이 있나요? 미리 공부하거나 익혀야 할 부분이 있다면 알려주세요.",
    createdAt: "2일 전",
    view: 180,
    like: 6,
    answer: 8,
  },
];

export default function QuestionsMain() {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredPosts = selectedCategory === null
    ? postData
    : postData.filter((post) => post.categoryId === selectedCategory);

  const postItemList = filteredPosts.map((post) => (
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

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

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
          <CategoryButton onCategorySelect={handleCategorySelect} />
        )}
        {postItemList.length > 0 ? (
          postItemList
        ) : (
          <p className="text-gray-600">선택한 카테고리에 해당하는 글이 없어요.</p>
        )}
      </div>
    </div>
  );
}
