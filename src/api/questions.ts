import { post } from "./postAndPut";
import { getAccessToken } from "./tokenStore";

type NewQuestionPayload = {
  title: string;
  body: string;
  imagesUrl: string[];
  targetMiliType: "AIR_FORCE";
  categoryIds: number[];
  specialtyIds: number[];
};

type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
};

const stripBearer = (t?: string | null) =>
  (t ?? "").replace(/^\s*Bearer\s+/i, "").trim();

function getMemberIdFromStorage(): number | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const id = Number(JSON.parse(raw)?.id);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

function getMemberIdFromToken(): number | null {
  try {
    const token = stripBearer(getAccessToken());
    if (!token) return null;
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return null;
    const b64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr =
      typeof atob === "function"
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("utf8");
    const id = Number(JSON.parse(jsonStr)?.id);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

function getMemberId(): number | null {
  return getMemberIdFromStorage() ?? getMemberIdFromToken();
}

export const postNewQuestion = (
  payload: NewQuestionPayload,
  callback?: () => void
) => {
  const memberId = getMemberId();
  if (!memberId) {
    window.alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
    return Promise.reject(new Error("memberId missing"));
  }

  const url = `/posts?memberId=${encodeURIComponent(String(memberId))}`;

  return post(url, payload)
    .then(async (res: Response) => {
      const text = await res.text();
      if (!res.ok) {
        console.error("[POST]", url, res.status, text);
        throw new Error(text || `HTTP ${res.status}`);
      }
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
      console.error(err);
      if (!/HTTP \d+/.test(String(err?.message))) {
        window.alert("요청 처리 중 오류가 발생했습니다.");
      }
      throw err;
    });
};
