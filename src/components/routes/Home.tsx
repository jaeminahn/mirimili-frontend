import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts";
import { Icon } from "@iconify/react";
import Header from "../organisms/Header";
import DetailProfilePromptModal from "../molecules/DetailProfilePromptModal";
import { getJSON } from "../../api/getAndDel";

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

type AnswerablePost = {
  id: number;
  title: string;
  body: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  createdAt: string;
};

export default function Home() {
  const { loggedUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [answerablePosts, setAnswerablePosts] = useState<AnswerablePost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser && loggedUser.hasMilitaryInfo === false) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [loggedUser]);

  useEffect(() => {
    const fetchAnswerablePosts = async () => {
      try {
        const res = await getJSON<ApiEnvelope<PageResult<AnswerablePost>>>(
          "/posts/answerable"
        );

        if (!res.ok || !res.data) {
          setAnswerablePosts([]);
          return;
        }

        const envelope = res.data;

        if (envelope.data && Array.isArray(envelope.data.content)) {
          setAnswerablePosts(envelope.data.content);
        } else {
          setAnswerablePosts([]);
        }
      } catch {
        setAnswerablePosts([]);
      }
    };

    if (loggedUser) {
      fetchAnswerablePosts();
    } else {
      setAnswerablePosts([]);
    }
  }, [loggedUser]);

  const onProceed = () => {
    setOpen(false);
    navigate("/detail/setup");
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col w-screen h-screen ">
      <Header />
      <main className="flex flex-col items-center justify-center flex-grow bg-gray-100 py-4 pb-16">
        <div className="flex flex-col w-full sm:w-4/5 max-w-5xl gap-6 px-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-semibold">인기 질문&답변</p>
                <Icon icon="fluent:arrow-right-24-filled" className="text-xl" />
              </div>
              <ul className="divide-y divide-gray-300 bg-gray-50 rounded-lg px-4">
                <li className="py-2">
                  2024/7/1 입대, 2026/3/31 전역이면 2026 칼복학 가능한가요?
                </li>
                <li className="py-2">
                  집이 수도권인데, 운항관제 특기의 경우 어디 자대로 가는 게
                  좋을까요?
                </li>
                <li className="py-2">일반차량운전 뭘 준비해야 할까요?</li>
                <li className="py-2">맞선임 부조리, 신고해야 할까요?</li>
                <li className="py-2">
                  대형면허까지 따면서 일반차량운전으로 특기 배정받을 메리트가
                  있을까요?
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-semibold">내 답변을 기다리는 질문</p>
                <button
                  type="button"
                  onClick={() => navigate("/post?tab=answerable")}
                  className="text-xl"
                >
                  <Icon icon="fluent:arrow-right-24-filled" />
                </button>
              </div>
              <ul className="divide-y divide-gray-300 bg-gray-50 rounded-lg px-4">
                {answerablePosts.length > 0 ? (
                  answerablePosts.slice(0, 5).map((post) => (
                    <li
                      key={post.id}
                      className="py-2 cursor-pointer"
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      {post.title}
                    </li>
                  ))
                ) : (
                  <li className="py-2 text-sm text-gray-500">
                    현재 답변할 수 있는 질문이 없습니다.
                  </li>
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-6 bg-white rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-semibold">밀리팁</p>
                  <Icon
                    icon="fluent:arrow-right-24-filled"
                    className="text-xl"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  입대 준비부터 전역 후까지,
                  <br />
                  군생활을 위한 모든 팁을 정리했어요.
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-semibold">공지</p>
                  <Icon
                    icon="fluent:arrow-right-24-filled"
                    className="text-xl"
                  />
                </div>
                <ul className="divide-y divide-gray-300 bg-gray-50 rounded-lg px-4">
                  <li className="py-2">미리밀리 업데이트 안내(2024년 12월)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DetailProfilePromptModal
        open={open}
        nickname={loggedUser?.nick || ""}
        onProceed={onProceed}
        onClose={onClose}
      />
    </div>
  );
}
