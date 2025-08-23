import { post } from "./postAndPut";

export async function postNewAnswer(
  questionId: number,
  content: string
): Promise<void> {
  const res = await post(`/answers/${questionId}`, { content });

  if (!res.ok) {
    let msg = `postNewAnswer failed (${res.status})`;
    try {
      const j = (await res.json()) as any;
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
}
