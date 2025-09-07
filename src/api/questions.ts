import { post } from "./postAndPut";

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

export const postNewQuestion = (
  payload: NewQuestionPayload,
  callback?: () => void
) => {
  const url = "/posts";

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