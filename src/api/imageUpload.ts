import { post } from "./postAndPut";

type UploadResp = { urls: string[] };

export async function uploadImages(files: File[]): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  const res = await post("/uploads/images", fd, { isFormData: true });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${text || ""}`);
  const json = JSON.parse(text) as UploadResp;
  return json.urls || [];
}
