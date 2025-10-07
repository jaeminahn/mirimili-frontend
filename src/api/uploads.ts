import { post } from "./postAndPut";

export async function presignImage(contentType: string, contentLength: number) {
  const res = await post("/uploads/images/presign", { contentType, contentLength });
  const txt = await res.text();
  if (!res.ok) throw new Error(txt || `presign failed ${res.status}`);
  const j = txt ? JSON.parse(txt) : null;
  const key = j?.data?.key ?? j?.key;
  const url = j?.data?.url ?? j?.url;
  if (!key || !url) throw new Error("invalid presign response");
  return { key: String(key), url: String(url) };
}

export async function putToPresignedUrl(url: string, file: File) {
  const res = await fetch(url, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `put failed ${res.status}`);
  }
}

export async function getViewUrls(keys: string[]) {
  if (!keys.length) return {};
  const res = await post("/uploads/images/view-urls", { keys });
  const txt = await res.text();
  if (!res.ok) throw new Error(txt || `view-urls failed ${res.status}`);
  const j = txt ? JSON.parse(txt) : null;
  const data = j?.data ?? j;
  return (data && typeof data === "object") ? data as Record<string, string> : {};
}
