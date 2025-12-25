import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import AnswerItem from "../molecules/AnswerItem";
import AnswerComposer from "../molecules/AnswerComposer";
import QuestionPostHeader from "../molecules/QuestionPostHeader";
import QuestionPostBody from "../molecules/QuestionPostBody";
import QuestionPostActions from "../molecules/QuestionPostActions";
import QuestionImageLightbox from "../molecules/QuestionImageLightbox";
import { get } from "../../api/getAndDel";
import { calculateTimeAgo } from "../../utils";
import {
  postNewAnswer,
  fetchAnswers,
  likeQuestion,
  dislikeQuestion,
  likeComment,
  dislikeComment,
  toggleScrapQuestion,
  deleteQuestion,
  deleteComment,
} from "../../api/answers";
import {
  presignImage,
  putToPresignedUrl,
  getViewUrls,
} from "../../api/uploads";

type WriterMiliRank =
  | "BEFORE_ENLISTMENT"
  | "PRIVATE"
  | "PRIVATE_FIRST"
  | "CORPORAL"
  | "SERGEANT"
  | "DISCHARGED";

interface PostData {
  id: number;
  writerNick: string;
  writerMiliRank?: WriterMiliRank;
  writerSpecialty?: string;
  title: string;
  content: string;
  view: number;
  like: number;
  dislike: number;
  answer: number;
  createdAt: string;
  isLiked: boolean;
  isDisliked: boolean;
  isScraped: boolean;
  images: string[];
  categories: string[];
  targetSpecialties: string[];
}

interface AnswerData {
  id: number;
  writerNick: string;
  writerMiliRank?: WriterMiliRank;
  writerSpecialty?: string;
  content: string;
  like: number;
  dislike: number;
  createdAt: string;
  createdAtRaw: string;
  isLiked: boolean;
  isDisliked: boolean;
  imagesUrl: string[];
}

interface MyAnswerInfo {
  nickName: string;
  isAnswerable: boolean;
  specialty?: string;
  miliType?: string;
  miliRank?: WriterMiliRank;
}

export default function QuestionPostContent() {
  const params = useParams();
  const navigate = useNavigate();
  const { loggedUser } = useAuth();

  const [answerText, setAnswerText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [postData, setPostData] = useState<PostData>({
    id: Number(params["id"]),
    writerNick: "",
    writerMiliRank: undefined,
    writerSpecialty: "",
    title: "",
    content: "",
    view: 0,
    like: 0,
    dislike: 0,
    answer: 0,
    createdAt: "",
    isLiked: false,
    isDisliked: false,
    isScraped: false,
    images: [],
    categories: [],
    targetSpecialties: [],
  });

  const [answerData, setAnswerData] = useState<AnswerData[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [cmtImagesUrl, setCmtImagesUrl] = useState<string[]>([]);
  const [cmtImageKeys, setCmtImageKeys] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState<string>(
    Date.now().toString()
  );

  const [myInfo, setMyInfo] = useState<MyAnswerInfo | null>(null);

  const rankLabel = (r?: WriterMiliRank) =>
    r === "BEFORE_ENLISTMENT"
      ? "입대 전"
      : r === "PRIVATE"
      ? "이병"
      : r === "PRIVATE_FIRST"
      ? "일병"
      : r === "CORPORAL"
      ? "상병"
      : r === "SERGEANT"
      ? "병장"
      : r === "DISCHARGED"
      ? "전역"
      : "";

  const canShowSpecialtyByRank = (r?: WriterMiliRank) =>
    r === "PRIVATE" ||
    r === "PRIVATE_FIRST" ||
    r === "CORPORAL" ||
    r === "SERGEANT";

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleLikePost = async () => {
    await likeQuestion(Number(params["id"]));
    setPostData((prev) => {
      if (prev.isLiked)
        return { ...prev, isLiked: false, like: Math.max(0, prev.like - 1) };
      if (prev.isDisliked) {
        return {
          ...prev,
          isLiked: true,
          isDisliked: false,
          like: prev.like + 1,
          dislike: Math.max(0, prev.dislike - 1),
        };
      }
      return { ...prev, isLiked: true, like: prev.like + 1 };
    });
  };

  const handleDislikePost = async () => {
    await dislikeQuestion(Number(params["id"]));
    setPostData((prev) => {
      if (prev.isDisliked)
        return {
          ...prev,
          isDisliked: false,
          dislike: Math.max(0, prev.dislike - 1),
        };
      if (prev.isLiked) {
        return {
          ...prev,
          isLiked: false,
          isDisliked: true,
          dislike: prev.dislike + 1,
          like: Math.max(0, prev.like - 1),
        };
      }
      return { ...prev, isDisliked: true, dislike: prev.dislike + 1 };
    });
  };

  const handleToggleScrap = async () => {
    await toggleScrapQuestion(Number(params["id"]));
    setPostData((prev) => ({ ...prev, isScraped: !prev.isScraped }));
  };

  const handleDeletePost = async () => {
    if (
      !window.confirm(
        "게시글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
      )
    )
      return;
    await deleteQuestion(postData.id);
    window.alert("게시글이 삭제되었습니다.");
    navigate(-1);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (
      !window.confirm(
        "댓글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
      )
    )
      return;
    await deleteComment(postData.id, commentId);
    window.alert("댓글이 삭제되었습니다.");
    await loadAnswers();
  };

  const newAnswer = async () => {
    if (!answerText.trim()) return;
    if (!loggedUser) return;
    await postNewAnswer(Number(params["id"]), answerText, cmtImagesUrl);
    setAnswerText("");
    setCmtImagesUrl([]);
    setCmtImageKeys([]);
    await loadAnswers();
  };

  const handleCmtImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const accept = new Set(["image/jpeg", "image/png", "image/webp"]);
    const maxSize = 10 * 1024 * 1024;
    const maxCount = 5;
    const remain = Math.max(0, maxCount - cmtImagesUrl.length);

    const selected = Array.from(e.target.files)
      .filter((f) => accept.has(f.type) && f.size <= maxSize)
      .slice(0, remain);

    setFileInputKey(Date.now().toString());
    if (!selected.length) return;

    setUploading(true);
    try {
      const keys: string[] = [];
      for (const f of selected) {
        const p = await presignImage(f.type, f.size);
        await putToPresignedUrl(p.url, f);
        keys.push(p.key);
      }
      const map = await getViewUrls(keys);
      const urls = keys.map((k) => map[k]).filter(Boolean);
      setCmtImagesUrl((prev) => [...prev, ...urls]);
      setCmtImageKeys((prev) => [...prev, ...keys]);
    } catch {
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const removeCmtImage = (url: string) => {
    setCmtImagesUrl((prev) => prev.filter((u) => u !== url));
    setCmtImageKeys((prev) => {
      const idx = cmtImagesUrl.indexOf(url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const loadPost = async () => {
    const res = await get(`/posts/${params["id"]}`);
    if (!res.ok) return;
    const j = await res.json();
    const d = j?.data ?? j;
    if (!d) return;

    setPostData((prev) => ({
      ...prev,
      id: d.id,
      writerNick: d.writerNickname,
      writerMiliRank: d.writerMiliRank,
      writerSpecialty: d.writerSpecialty,
      title: d.title,
      content: d.body,
      view: d.viewCount,
      answer: d.commentCount,
      createdAt: calculateTimeAgo(new Date(d.createdAt)),
      images: Array.isArray(d.images) ? d.images : [],
      categories: Array.isArray(d.categories) ? d.categories : [],
      targetSpecialties: Array.isArray(d.targetSpecialties)
        ? d.targetSpecialties
        : [],
      like: d.likeCount ?? 0,
      dislike: d.dislikeCount ?? 0,
      isLiked: !!d.isLiked,
      isDisliked: !!d.isDisliked,
      isScraped: !!d.isScraped,
    }));
  };

  const loadAnswers = async () => {
    if (!loggedUser) {
      setAnswerData([]);
      return;
    }

    try {
      const list = await fetchAnswers(Number(params["id"]));
      const mapped = (list ?? [])
        .map((c: any) => ({
          id: c.id,
          writerNick: c.writerNickname,
          writerMiliRank: c.writerMiliRank,
          writerSpecialty: c.writerSpecialty,
          content: c.content ?? c.body,
          like: c.likeCount ?? 0,
          dislike: c.dislikeCount ?? 0,
          createdAt: calculateTimeAgo(new Date(c.createdAt)),
          createdAtRaw: c.createdAt,
          isLiked: !!c.isLiked,
          isDisliked: !!c.isDisliked,
          imagesUrl: Array.isArray(c.imagesUrl) ? c.imagesUrl : [],
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAtRaw).getTime() -
            new Date(a.createdAtRaw).getTime()
        );
      setAnswerData(mapped);
    } catch {
      setAnswerData([]);
    }
  };

  const loadMyAnswerInfo = async () => {
    if (!loggedUser) {
      setMyInfo(null);
      return;
    }
    const res = await get(`/posts/${params["id"]}/my`);
    if (!res.ok) {
      setMyInfo(null);
      return;
    }
    const j = await res.json();
    const d = j?.data ?? j;
    if (!d) {
      setMyInfo(null);
      return;
    }
    setMyInfo({
      nickName: d.nickName ?? d.nickname ?? "",
      isAnswerable: !!d.isAnswerable,
      specialty: d.specialty ?? "",
      miliType: d.miliType,
      miliRank: d.writerMiliRank ?? d.miliRank,
    });
  };

  useEffect(() => {
    (async () => {
      await loadPost();
      if (loggedUser) {
        await Promise.all([loadAnswers(), loadMyAnswerInfo()]);
      } else {
        setAnswerData([]);
        setMyInfo(null);
      }
    })();
  }, [params["id"], loggedUser]);

  const postWriterInfo =
    canShowSpecialtyByRank(postData.writerMiliRank) && postData.writerSpecialty
      ? `공군 · ${rankLabel(postData.writerMiliRank)} · ${
          postData.writerSpecialty
        }`
      : `공군 · ${rankLabel(postData.writerMiliRank)}`;

  const categoryChip = postData.categories?.[0] ?? "";

  const targetMsg =
    postData.targetSpecialties?.length > 1
      ? `${postData.targetSpecialties[0]} 외 ${
          postData.targetSpecialties.length - 1
        }개 특기만 답변할 수 있어요`
      : postData.targetSpecialties?.length === 1
      ? `${postData.targetSpecialties[0]}만 답변할 수 있어요`
      : "";

  const canWriteAnswer = !!loggedUser && !!myInfo?.isAnswerable;

  const myInfoLine =
    canShowSpecialtyByRank(myInfo?.miliRank) && myInfo?.specialty
      ? `공군 · ${rankLabel(myInfo?.miliRank)} · ${myInfo?.specialty}`
      : `공군 · ${rankLabel(myInfo?.miliRank)}`;

  const handleOpenLightbox = (index: number) => setLightboxIndex(index);
  const handleCloseLightbox = () => setLightboxIndex(null);

  const handlePrevImage = () => {
    setLightboxIndex((i) =>
      i === null
        ? null
        : (i + postData.images.length - 1) % postData.images.length
    );
  };

  const handleNextImage = () => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % postData.images.length
    );
  };

  const isMyPost =
    !!myInfo?.nickName && myInfo.nickName === postData.writerNick;
  const myNick = myInfo?.nickName || "";

  const LoginPrompt = (
    <div className="w-full bg-emerald-50 rounded-3xl px-5 py-4 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-emerald-800">
          답변을 열람하려면 로그인이 필요해요
        </p>
        <p className="text-xs text-emerald-700">
          로그인하고 미리미리의 모든 기능을 이용해 보세요!
        </p>
      </div>
      <Link
        to="/auth/login"
        className="shrink-0 h-9 px-4 inline-flex items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-semibold"
      >
        로그인/회원가입 바로가기
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col w-4/5 gap-4">
      <div className="flex flex-col gap-6 p-4 bg-white divide-y divide-gray-300 rounded-3xl">
        <div className="flex flex-col gap-6">
          <QuestionPostHeader
            writerNick={postData.writerNick}
            writerInfo={postWriterInfo}
            createdAt={postData.createdAt}
            view={postData.view}
            answer={postData.answer}
          />

          <QuestionPostBody
            category={categoryChip}
            title={postData.title}
            content={postData.content}
            images={postData.images}
            onClickImage={handleOpenLightbox}
          />

          <QuestionPostActions
            like={postData.like}
            dislike={postData.dislike}
            isLiked={postData.isLiked}
            isDisliked={postData.isDisliked}
            isScraped={postData.isScraped}
            isMine={isMyPost}
            onLike={handleLikePost}
            onDislike={handleDislikePost}
            onToggleScrap={handleToggleScrap}
            onDelete={handleDeletePost}
          />
        </div>

        <div className="flex flex-col gap-2 pt-4">
          {!!targetMsg && (
            <p className="px-2 py-1 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg">
              {targetMsg}
            </p>
          )}

          {loggedUser ? (
            <AnswerComposer
              visible={canWriteAnswer}
              nickName={myInfo?.nickName}
              infoLine={myInfoLine}
              textareaRef={textareaRef}
              answerText={answerText}
              onChange={handleChange}
              cmtImagesUrl={cmtImagesUrl}
              onRemoveImage={removeCmtImage}
              onUploadImages={handleCmtImageUpload}
              fileInputKey={fileInputKey}
              uploading={uploading}
              onSubmit={newAnswer}
              submitDisabled={!answerText.trim() || uploading}
            />
          ) : null}
        </div>
      </div>

      {!loggedUser && LoginPrompt}

      {loggedUser &&
        answerData.map((a) => (
          <AnswerItem
            key={a.id}
            id={a.id}
            writerNick={a.writerNick}
            writerMiliRank={a.writerMiliRank}
            writerSpecialty={a.writerSpecialty}
            createdAt={a.createdAt}
            content={a.content}
            like={a.like}
            dislike={a.dislike}
            isLiked={a.isLiked}
            isDisliked={a.isDisliked}
            imagesUrl={a.imagesUrl}
            isMine={!!myNick && myNick === a.writerNick}
            onLike={async (id) => {
              await likeComment(id);
              setAnswerData((prev) =>
                prev.map((x) => {
                  if (x.id !== id) return x;
                  if (x.isLiked) {
                    return {
                      ...x,
                      isLiked: false,
                      like: Math.max(0, x.like - 1),
                    };
                  }
                  if (x.isDisliked) {
                    return {
                      ...x,
                      isLiked: true,
                      isDisliked: false,
                      like: x.like + 1,
                      dislike: Math.max(0, x.dislike - 1),
                    };
                  }
                  return { ...x, isLiked: true, like: x.like + 1 };
                })
              );
            }}
            onDislike={async (id) => {
              await dislikeComment(id);
              setAnswerData((prev) =>
                prev.map((x) => {
                  if (x.id !== id) return x;
                  if (x.isDisliked) {
                    return {
                      ...x,
                      isDisliked: false,
                      dislike: Math.max(0, x.dislike - 1),
                    };
                  }
                  if (x.isLiked) {
                    return {
                      ...x,
                      isLiked: false,
                      isDisliked: true,
                      dislike: x.dislike + 1,
                      like: Math.max(0, x.like - 1),
                    };
                  }
                  return { ...x, isDisliked: true, dislike: x.dislike + 1 };
                })
              );
            }}
            onDelete={handleDeleteComment}
          />
        ))}

      {lightboxIndex !== null && (
        <QuestionImageLightbox
          images={postData.images}
          index={lightboxIndex}
          onClose={handleCloseLightbox}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}
    </div>
  );
}
