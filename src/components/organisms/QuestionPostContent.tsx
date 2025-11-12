import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import AnswerItem from "../molecules/AnswerItem";
import AnswerComposer from "../molecules/AnswerComposer";
import { get } from "../../api/getAndDel";
import { calculateTimeAgo } from "../../utils";
import {
  postNewAnswer,
  fetchAnswers,
  likeQuestion,
  likeComment,
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
  isScrapped: boolean;
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
    isScrapped: false,
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
    if (postData.isLiked) return;
    await likeQuestion(Number(params["id"]));
    setPostData((prev) => ({ ...prev, isLiked: true, like: prev.like + 1 }));
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
    }));
  };

  const loadAnswers = async () => {
    const list = await fetchAnswers(Number(params["id"]));
    const mapped = (list ?? []).map((c: any) => ({
      id: c.id,
      writerNick: c.writerNickname,
      writerStatus: c.writerStatus,
      writerSpecialty: c.writerSpecialty,
      content: c.content ?? c.body,
      like: c.likeCount ?? 0,
      dislike: c.dislikeCount ?? 0,
      createdAt: calculateTimeAgo(new Date(c.createdAt)),
      isLiked: false,
      isDisliked: false,
      imagesUrl: Array.isArray(c.imagesUrl) ? c.imagesUrl : [],
    }));
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

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null
            ? null
            : (i + postData.images.length - 1) % postData.images.length
        );
      if (e.key === "ArrowRight")
        setLightboxIndex((i) =>
          i === null ? null : (i + 1) % postData.images.length
        );
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, postData.images.length]);

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

  return (
    <div className="flex flex-col w-4/5 gap-4">
      <div className="flex flex-col gap-6 p-4 bg-white divide-y divide-gray-300 rounded-lg">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{postData.writerNick}</p>
              <p className="text-emerald-600">{postWriterInfo}</p>
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
              {categoryChip}
            </p>
            <p className="text-2xl font-semibold">{postData.title}</p>
          </div>

          <div className="text-base whitespace-pre-wrap">
            {postData.content}
          </div>

          {postData.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-1">
              {postData.images.map((src, idx) => (
                <button
                  key={idx}
                  className="relative flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-300 rounded-xl"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={src}
                    alt={`image-${idx + 1}`}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between text-sm">
            <div className="flex gap-2 font-semibold">
              <button
                className={`flex gap-1 items-center p-1 px-2 rounded-lg ${
                  postData.isLiked
                    ? "text-emerald-600 bg-emerald-100 border-2 border-emerald-600"
                    : "text-gray-600 bg-gray-100"
                }`}
                onClick={handleLikePost}
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

        <AnswerComposer
          visible={canWriteAnswer}
          targetMsg={targetMsg}
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
              prev.map((x) =>
                x.id === id ? { ...x, like: x.like + 1, isLiked: true } : x
              )
            );
          }}
        />
      ))}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={postData.images[lightboxIndex]}
              alt={`image-${lightboxIndex + 1}`}
              className="object-contain w-[90vw] max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl"
            />
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setLightboxIndex(null)}
            >
              <Icon icon="fluent:dismiss-24-filled" className="text-2xl" />
            </button>
            {postData.images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={() =>
                    setLightboxIndex((i) =>
                      i === null
                        ? null
                        : (i + postData.images.length - 1) %
                          postData.images.length
                    )
                  }
                >
                  <Icon
                    icon="fluent:chevron-left-24-filled"
                    className="text-2xl"
                  />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={() =>
                    setLightboxIndex((i) =>
                      i === null ? null : (i + 1) % postData.images.length
                    )
                  }
                >
                  <Icon
                    icon="fluent:chevron-right-24-filled"
                    className="text-2xl"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
