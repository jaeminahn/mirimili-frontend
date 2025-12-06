import { get } from "./getAndDel";

export type MyActivity = {
  myPostCount: number;
  myCommentCount: number;
};

export async function fetchMyActivity(): Promise<MyActivity> {
  const res = await get("/posts/activity");
  if (!res.ok) {
    throw new Error(`fetchMyActivity failed (${res.status})`);
  }
  const j = await res.json();
  const d = j?.data ?? j;
  return {
    myPostCount: d?.myPostCount ?? 0,
    myCommentCount: d?.myCommentCount ?? 0,
  };
}
