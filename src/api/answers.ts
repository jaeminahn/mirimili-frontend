import { post } from "./postAndPut";
import { get, del } from "./getAndDel";

export async function postNewAnswer(
  questionId: number,
  content: string,
  imagesUrl: string[] = []
): Promise<void> {
  const res = await post(`/posts/${questionId}/comments`, {
    body: content,
    imagesUrl,
  });
  if (!res.ok) {
    let msg = `postNewAnswer failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
  window.dispatchEvent(new Event("activity:comment"));
}

export async function fetchAnswers(questionId: number): Promise<any[]> {
  const res = await get(`/posts/${questionId}/comments`);
  if (!res.ok) {
    let msg = `fetchAnswers failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
  const txt = await res.text();
  if (!txt) return [];
  try {
    const j = JSON.parse(txt);
    if (Array.isArray(j)) return j;
    if (Array.isArray(j?.data)) return j.data;
    if (j?.data) return [j.data];
    return [];
  } catch {
    return [];
  }
}

export async function likeQuestion(questionId: number): Promise<void> {
  const res = await post(`/posts/${questionId}/likes`, { type: "LIKE" });
  if (!res.ok) {
    let msg = `likeQuestion failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
}

export async function dislikeQuestion(questionId: number): Promise<void> {
  const res = await post(`/posts/${questionId}/likes`, { type: "DISLIKE" });
  if (!res.ok) {
    let msg = `dislikeQuestion failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
}

export async function likeComment(commentId: number): Promise<void> {
  const res = await post(`/comments/${commentId}/likes`, { type: "LIKE" });
  if (!res.ok) {
    let msg = `likeComment failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
}

export async function dislikeComment(commentId: number): Promise<void> {
  const res = await post(`/comments/${commentId}/likes`, { type: "DISLIKE" });
  if (!res.ok) {
    let msg = `dislikeComment failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
}

export async function toggleScrapQuestion(questionId: number): Promise<void> {
  const res = await post(`/posts/${questionId}/scrap`, {});
  if (!res.ok) {
    let msg = `toggleScrapQuestion failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
}

export async function deleteQuestion(postId: number): Promise<void> {
  const res = await del(`/posts/${postId}`);
  if (!res.ok) {
    let msg = `deleteQuestion failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
  window.dispatchEvent(new Event("activity:post"));
}

export async function deleteComment(
  postId: number,
  commentId: number
): Promise<void> {
  const res = await del(`/posts/${postId}/comments/${commentId}`);
  if (!res.ok) {
    let msg = `deleteComment failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
  window.dispatchEvent(new Event("activity:comment"));
}
