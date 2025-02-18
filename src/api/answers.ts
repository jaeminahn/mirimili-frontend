import { post } from "./postAndPut";

export const postNewAnswer = (
  writerId: number,
  questionId: number,
  content: string,
  accessToken: string,
  callback?: () => void
) => {
  post(
    `/answers/${questionId}`,
    {
      writer_id: writerId,
      content,
    },
    accessToken
  )
    .then((res) => res.json())
    .then((result) => {
      if (result.code === 401 || result.code === 419)
        window.alert(result.message);
      else {
        callback && callback();
      }
    });
};
