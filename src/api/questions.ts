import { post } from "./postAndPut";

export const postNewQuestion = (
  writerId: number,
  title: string,
  content: string,
  categoryId: number,
  serviceTypeId: number[],
  serviceMosId: number[],
  accessToken: string,
  callback?: () => void
) => {
  post(
    "/questions/",
    {
      writer_id: writerId,
      title,
      content,
      category_id: categoryId,
      service_type_id: serviceTypeId,
      service_mos_id: serviceMosId,
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
