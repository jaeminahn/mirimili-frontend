import { post } from "./postAndPut";

type NewQuestionPayload = {
  title: string;
  body: string;
  imagesUrl: string[];
  targetMiliType: "AIR_FORCE";
  categoryIds: number[];
  specialtyIds: number[];
};

export const postNewQuestion = (
  payload: NewQuestionPayload,
  callback?: () => void
) => {
  return post("/questions", payload)
    .then((res: Response) => res.json())
    .then((result: any) => {
      if (result?.code === 401 || result?.code === 419) {
        window.alert(result.message);
      } else {
        callback?.();
      }
    });
};
