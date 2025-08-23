import { post } from "./postAndPut";

export const postNewQuestion = (
  writerId: number,
  title: string,
  content: string,
  categoryId: number,
  serviceTypeId: number[],
  serviceMosId: number[],
  callback?: () => void
) => {
  return post("/questions", {
    writer_id: writerId,
    title,
    content,
    category_id: categoryId,
    service_mos_id: serviceMosId,
    service_type_id: serviceTypeId,
  })
    .then((res: Response) => res.json())
    .then((result: any) => {
      if (result?.code === 401 || result?.code === 419) {
        window.alert(result.message ?? "권한이 없습니다.");
      } else {
        callback?.();
      }
    });
};
