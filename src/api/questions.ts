import { post } from "./postAndPut";

type NewQuestionPayload = {
  title: string;
  body: string;
  imagesUrl: string[];
  targetMiliType: "AIR_FORCE";
  categoryIds: number[];
  specialtyIds: number[];
  imageKeys?: string[];
  isUploading?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
};

function extractKey(u: string): string | null {
  try {
    const url = new URL(u);
    const p = url.pathname.replace(/^\/+/, "");
    return p || null;
  } catch {
    const noQuery = u.split("?")[0];
    const m = noQuery.match(/https?:\/\/[^/]+\/(.+)/i);
    return m ? decodeURIComponent(m[1]) : null;
  }
}

export const postNewQuestion = (
  payload: NewQuestionPayload,
  callback?: () => void
) => {
  const url = "/posts";

  if ((payload as any)?.isUploading) {
    const e = new Error("이미지 업로드가 아직 완료되지 않았습니다.");
    return Promise.reject(e);
  }

  let keys: string[] = Array.isArray(payload.imageKeys)
    ? payload.imageKeys.filter(Boolean)
    : [];
  if (
    (!keys || keys.length === 0) &&
    Array.isArray(payload.imagesUrl) &&
    payload.imagesUrl.length > 0
  ) {
    keys = payload.imagesUrl.map(extractKey).filter((k): k is string => !!k);
  }

  const serverPayload: any = {
    title: payload.title,
    body: payload.body,
    targetMiliType: payload.targetMiliType,
    categoryIds: payload.categoryIds,
    specialtyIds: payload.specialtyIds,
  };
  if (keys.length > 0) serverPayload.imageKeys = keys;

  return post(url, serverPayload)
    .then(async (res: Response) => {
      const text = await res.text();
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
      const json: ApiResponse<number> = text
        ? JSON.parse(text)
        : { success: true, code: "", message: "", data: null };
      return json;
    })
    .then((result) => {
      if (!result?.success) {
        window.alert(result?.message ?? "요청이 실패했습니다.");
      } else {
        callback?.();
      }
      return result;
    })
    .catch((err) => {
      console.error("[POST] /posts", err?.message);
      if (
        String(err?.message) === "이미지 업로드가 아직 완료되지 않았습니다."
      ) {
        window.alert(err.message);
      } else if (!/HTTP \d+/.test(String(err?.message))) {
        window.alert("요청 처리 중 오류가 발생했습니다.");
      }
      throw err;
    });
};
