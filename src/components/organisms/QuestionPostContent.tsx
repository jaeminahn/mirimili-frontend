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
import { postNewAnswer, fetchAnswers, likeQuestion } from "../../api/answers";

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

export default function QuestionPostContent() {
  const params = useParams();
  const { loggedUser } = useAuth();
  const [answerText, setAnswerText] = useState("");
  const [hideUnit, setHideUnit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [postData, setPostData] = useState<postDataProps>({
    id: Number(params["id"]),
    writerId: -1,
    writerNick: "",
    writerType: "",
    writerLevel: "",
    writerMos: "",
    writerUnit: "",
    categoryId: -1,
    title: "",
    content: "",
    view: -1,
    like: 0,
    dislike: 0,
    answer: -1,
    createdAt: "",
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

  const handleLike = async () => {
    if (postData.isLiked) return;
    try {
      await likeQuestion(Number(params["id"]));
      setPostData((prev) => ({
        ...prev,
        isLiked: true,
        like: (prev.like ?? 0) + 1,
      }));
    } catch (e) {
      console.error(e);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const newAnswer = () => {
    if (!answerText.trim()) return;
    if (!loggedUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    postNewAnswer(Number(params["id"]), answerText)
      .then(async () => {
        setAnswerText("");
        await loadAnswers();
        setPostData((prev) => ({ ...prev, answer: prev.answer + 1 }));
      })
      .catch((e) => {
        console.error(e);
        alert("답변 등록 중 오류가 발생했습니다.");
      });
  };

  const loadPost = async () => {
    const res = await get(`/posts/${params["id"]}`);
    if (!res.ok) {
      console.error("loadPost failed", res.status);
      return;
    }
    const txt = await res.text();
    if (!txt) return;
    let j: any = null;
    try {
      j = JSON.parse(txt);
    } catch {}
    const d = j?.data ?? j;
    if (!d) return;
    setPostData((prev) => ({
      ...prev,
      id: d.id,
      writerId: -1,
      writerNick: d.writerNickname,
      writerType: d.writerStatus,
      writerLevel: d.writerSpecialty,
      writerMos: d.targetMiliType ?? "",
      writerUnit:
        Array.isArray(d.targetSpecialties) && d.targetSpecialties.length
          ? d.targetSpecialties[0]
          : "",
      categoryId: -1,
      title: d.title,
      content: d.body,
      view: d.viewCount,
      answer: d.commentCount,
      createdAt: calculateTimeAgo(new Date(d.createdAt)),
    }));
  };

  const loadAnswers = async () => {
    const list = await fetchAnswers(Number(params["id"]));
    const mapped = (list ?? []).map((c: any) => {
      return {
        id: c.id,
        writerId: -1,
        writerNick: c.writerNickname,
        writerType: c.writerStatus,
        writerLevel: c.writerMiliType,
        writerMos: "",
        writerUnit: "",
        content: c.content ?? c.body,
        like: c.likeCount ?? 0,
        dislike: c.dislikeCount ?? 0,
        createdAt: calculateTimeAgo(new Date(c.createdAt)),
        isLiked: false,
        isDisliked: false,
        isScrapped: false,
      };
    });
    setAnswerData(mapped);
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([loadPost(), loadAnswers()]);
      } catch (e) {
        console.error(e);
      }
    })();
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
              {Array.isArray((readObjectP as any)?.categories)
                ? ""
                : getCategoryLabel(postData.categoryId)}
            </p>
            <p className="text-2xl font-semibold">{postData.title}</p>
          </div>
          <div className="text-base whitespace-pre-wrap">
            {postData.content}
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex gap-2 font-semibold ">
              <button
                className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
                  postData.isLiked
                    ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
                    : "text-gray-600 bg-gray-100"
                }`}
                onClick={handleLike}
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
