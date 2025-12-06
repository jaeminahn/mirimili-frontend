import { useParams } from "react-router-dom";
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
} from "../../api/answers";
import {
  presignImage,
  putToPresignedUrl,
  getViewUrls,
} from "../../api/uploads";

interface PostData {
  id: number;
  writerNick: string;
  writerStatus?: "PRE_ENLISTED" | "ENLISTED" | "DISCHARGED";
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
  writerStatus?: "PRE_ENLISTED" | "ENLISTED" | "DISCHARGED";
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
  miliStatus?: "PRE_ENLISTED" | "ENLISTED" | "DISCHARGED";
}

export default function QuestionPostContent() {
  const params = useParams();
  const { loggedUser } = useAuth();
  const [answerText, setAnswerText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [postData, setPostData] = useState<PostData>({
    id: Number(params["id"]),
    writerNick: "",
    writerStatus: undefined,
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

  const statusLabel = (s?: string) =>
    s === "PRE_ENLISTED"
      ? "입대전"
      : s === "ENLISTED"
      ? "현역"
      : s === "DISCHARGED"
      ? "예비역"
      : "";

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
      if (prev.isLiked) {
        return {
          ...prev,
          isLiked: false,
          like: Math.max(0, prev.like - 1),
        };
      }
      if (prev.isDisliked) {
        return {
          ...prev,
          isLiked: true,
          isDisliked: false,
          like: prev.like + 1,
          dislike: Math.max(0, prev.dislike - 1),
        };
      }
      return {
        ...prev,
        isLiked: true,
        like: prev.like + 1,
      };
    });
  };

  const handleDislikePost = async () => {
    await dislikeQuestion(Number(params["id"]));
    setPostData((prev) => {
      if (prev.isDisliked) {
        return {
          ...prev,
          isDisliked: false,
          dislike: Math.max(0, prev.dislike - 1),
        };
      }
      if (prev.isLiked) {
        return {
          ...prev,
          isLiked: false,
          isDisliked: true,
          dislike: prev.dislike + 1,
          like: Math.max(0, prev.like - 1),
        };
      }
      return {
        ...prev,
        isDisliked: true,
        dislike: prev.dislike + 1,
      };
    });
  };

  const handleToggleScrap = async () => {
    await toggleScrapQuestion(Number(params["id"]));
    setPostData((prev) => ({
      ...prev,
      isScraped: !prev.isScraped,
    }));
  };

  const newAnswer = async () => {
    if (!answerText.trim()) return;
    if (!loggedUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    await postNewAnswer(Number(params["id"]), answerText, cmtImagesUrl);
    setAnswerText("");
    setCmtImagesUrl([]);
    setCmtImageKeys([]);
    await loadAnswers();
    setPostData((prev) => ({ ...prev, answer: prev.answer + 1 }));
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
      writerStatus: d.writerStatus,
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
    const list = await fetchAnswers(Number(params["id"]));
    const mapped = (list ?? [])
      .map((c: any) => ({
        id: c.id,
        writerNick: c.writerNickname,
        writerStatus: c.writerStatus,
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
      miliStatus: d.miliStatus,
    });
  };

  useEffect(() => {
    (async () => {
      await Promise.all([loadPost(), loadAnswers(), loadMyAnswerInfo()]);
    })();
  }, [params["id"], loggedUser]);

  const postWriterInfo =
    postData.writerStatus === "ENLISTED" && postData.writerSpecialty
      ? `공군 · ${statusLabel(postData.writerStatus)} · ${
          postData.writerSpecialty
        }`
      : `공군 · ${statusLabel(postData.writerStatus)}`;

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
    myInfo?.miliStatus === "ENLISTED" && myInfo?.specialty
      ? `공군 · ${statusLabel(myInfo?.miliStatus)} · ${myInfo?.specialty}`
      : `공군 · ${statusLabel(myInfo?.miliStatus)}`;

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

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

  return (
    <div className="flex flex-col w-4/5 gap-4">
      <div className="flex flex-col gap-6 p-4 bg-white divide-y divide-gray-300 rounded-lg">
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
            onLike={handleLikePost}
            onDislike={handleDislikePost}
            onToggleScrap={handleToggleScrap}
          />
        </div>

        <div className="flex flex-col gap-2 pt-4">
          {!!targetMsg && (
            <p className="px-2 py-1 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-md">
              {targetMsg}
            </p>
          )}
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
        </div>
      </div>

      {answerData.map((a) => (
        <AnswerItem
          key={a.id}
          id={a.id}
          writerNick={a.writerNick}
          writerStatus={a.writerStatus}
          writerSpecialty={a.writerSpecialty}
          createdAt={a.createdAt}
          content={a.content}
          like={a.like}
          dislike={a.dislike}
          isLiked={a.isLiked}
          isDisliked={a.isDisliked}
          imagesUrl={a.imagesUrl}
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
                return {
                  ...x,
                  isLiked: true,
                  like: x.like + 1,
                };
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
                return {
                  ...x,
                  isDisliked: true,
                  dislike: x.dislike + 1,
                };
              })
            );
          }}
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
