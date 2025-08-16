import { post } from "./postAndPut";

export async function postNewAnswer(
  questionId: number,
  content: string,
  accessToken: string
): Promise<void> {
  const res = await post(`/answers/${questionId}`, { content }, accessToken);

  if (!res.ok) {
    let msg = `postNewAnswer failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
      if (j?.code === 401 || j?.code === 419) {
      }
    } catch {}
    throw new Error(msg);
  }
}
