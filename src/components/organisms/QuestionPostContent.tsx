import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import AnswerItem from "../molecules/AnswerItem";
import category from "../../data/category.json";
import { get } from "../../api/getAndDel";
import {
  calculateLevel,
  calculateTimeAgo,
  mosId2Label,
  readObjectP,
  typeId2Label,
  unitId2Label,
} from "../../utils";
import { postNewAnswer } from "../../api/answers";

interface postDataProps {
  id: number;
  writerId: number;
  writerNick: string;
  writerType: string;
  writerLevel: string;
  writerMos: string;
  writerUnit: string;
  categoryId: number;
  title: string;
  content: string;
  view: number;
  like: number;
  dislike: number;
  answer: number;
  createdAt: string;
  isLiked: boolean;
  isDisliked: boolean;
  isScrapped: boolean;
}

interface answerDataProps {
  id: number;
  writerId: number;
  writerNick: string;
  writerType: string;
  writerLevel: string;
  writerMos: string;
  writerUnit: string;
  content: string;
  like: number;
  dislike: number;
  createdAt: string;
  isLiked: boolean;
  isDisliked: boolean;
  isScrapped: boolean;
}

interface _answerDataProps {
  id: number;
  writer_id: number;
  content: string;
  like: number;
  dislike: number;
  createdAt: string;
}

export default function QuestionPostContent() {
  const params = useParams();
  const { loggedUser } = useAuth();
  const [answerText, setAnswerText] = useState("");
  const [hideUnit, setHideUnit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [postData, setPostData] = useState<postDataProps>({
    id: Number(params["id"]),
    writerId: -1,
    writerNick: "로딩중...",
    writerType: "로딩중...",
    writerLevel: "로딩중...",
    writerMos: "로딩중...",
    writerUnit: "로딩중...",
    categoryId: -1,
    title: "로딩중...",
    content: "로딩중...",
    view: -1,
    like: -1,
    dislike: -1,
    answer: -1,
    createdAt: "로딩중...",
    isLiked: false,
    isDisliked: false,
    isScrapped: false,
  });
  const [answerData, setAnswerData] = useState<answerDataProps[]>([]);
  const navigate = useNavigate();

  const getCategoryLabel = (id: number) => {
    const foundCategory = category.find((cat) => cat.id === id);
    return foundCategory ? foundCategory.label : null;
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const newAnswer = () => {
    if (!answerText.trim()) return;
    if (!loggedUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    postNewAnswer(Number(params["id"]), answerText)
      .then(() => navigate("/"))
      .catch((e) => {
        console.error(e);
        alert("답변 등록 중 오류가 발생했습니다.");
      });
  };

  useEffect(() => {
    get(`/questions/${params["id"]}`)
      .then((res) => res.json())
      .then((res) => {
        setPostData((prev) => ({
          ...prev,
          writerId: res.writer_id,
          categoryId: res.category_id,
          title: res.title,
          content: res.content,
          view: res.view,
          like: res.like,
          dislike: res.dislike,
          answer: res.answer,
          createdAt: calculateTimeAgo(new Date(res.createdAt)),
        }));
        return get(`/users/${res.writer_id}`).then((w) => w.json());
      })
      .then((writer) => {
        setPostData((prev) => ({
          ...prev,
          writerNick: writer.nickname,
          writerType: typeId2Label(writer.service_type_id),
          writerLevel: calculateLevel(writer.service_start, new Date()),
          writerMos: mosId2Label(writer.service_mos_id),
          writerUnit: unitId2Label(writer.service_unit_id),
        }));
      });

    // 답변 목록
    get(`/answers/${params["id"]}`)
      .then((res) => res.json())
      .then(async (res) => {
        const mapped = await Promise.all(
          res.map(async (item: _answerDataProps) => {
            const writerResponse = await get(`/users/${item.writer_id}`);
            const writer = await writerResponse.json();
            return {
              id: item.id,
              writerId: item.writer_id,
              writerNick: writer.nickname,
              writerType: typeId2Label(writer.service_type_id),
              writerLevel: calculateLevel(writer.service_start, new Date()),
              writerMos: mosId2Label(writer.service_mos_id),
              writerUnit: unitId2Label(writer.service_unit_id),
              content: item.content,
              like: item.like,
              dislike: item.dislike,
              createdAt: calculateTimeAgo(new Date(item.createdAt)),
              isLiked: false,
              isDisliked: false,
              isScrapped: false,
            };
          })
        );
        setAnswerData(mapped);
      })
      .catch((error) => {
        console.error("Error fetching answers:", error);
      });
  }, [params["id"]]);

  return (
    <div className="flex flex-col w-4/5 gap-4">
      <div className="flex flex-col gap-6 p-4 bg-white divide-y divide-gray-300 rounded-lg">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{postData.writerNick}</p>
              <p className="text-emerald-600">
                {postData.writerType}∙{postData.writerLevel}∙
                {postData.writerMos}∙{postData.writerUnit}
              </p>
              <p className="text-xs text-gray-600">{postData.createdAt}</p>
            </div>
            <div className="flex items-center gap-4 p-2 text-xs text-gray-500">
              <div className="flex">
                <Icon icon="fluent:eye-20-filled" className="mr-1 text-base" />
                <p>{postData.view}</p>
              </div>
              <div className="flex">
                <Icon
                  icon="fluent:comment-24-filled"
                  className="mr-1 text-base"
                />
                <p>{postData.answer}</p>
              </div>
            </div>
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

        {loggedUser && (
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2 p-4 mt-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2 p-1 text-sm">
                <p className="font-semibold">{loggedUser.nick}</p>
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
                <button
                  className="px-6 py-2 text-sm text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
                  onClick={newAnswer}
                  disabled={!answerText.trim()}
                >
                  답변 등록
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {answerData.map((answer) => (
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
      ))}
    </div>
  );
}
