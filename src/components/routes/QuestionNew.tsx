import { ChangeEvent, useEffect, useState } from "react";
import QuestionWrite from "../organisms/QuestionWrite";
import { useAuth } from "../../contexts";
import { postNewQuestion } from "../../api/questions";
import { useNavigate } from "react-router-dom";

export type QuestionFormType = {
  title: string;
  content: string;
  categoryId: number;
  serviceTypeId: number[];
  serviceMosId: number[];
  imagesUrl: string[];
  imageKeys?: string[];
  isUploading?: boolean;
  canSubmit?: boolean;
};

const initialFormState: QuestionFormType = {
  title: "",
  content: "",
  categoryId: 0,
  serviceTypeId: [],
  serviceMosId: [],
  imagesUrl: [],
  imageKeys: [],
  isUploading: false,
  canSubmit: false,
};

const MILI_TYPE_MAP: Record<number, "AIR_FORCE"> = {
  1: "AIR_FORCE",
};

export default function QuestionNew() {
  const [form, setForm] = useState<QuestionFormType>(initialFormState);
  const { loggedUser } = useAuth();
  const navigate = useNavigate();

  const changed =
    (key: keyof QuestionFormType) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const value = e.target.value;
      if (key === "categoryId") {
        setForm((prev) => ({ ...prev, categoryId: Number(value) }));
      } else {
        setForm((prev) => ({ ...prev, [key]: value as any }));
      }
    };

  const onSubmit = async () => {
    if (!form.canSubmit) return;
    const firstTypeId = form.serviceTypeId[0];
    const targetMiliType = MILI_TYPE_MAP[firstTypeId] ?? "AIR_FORCE";
    await postNewQuestion(
      {
        title: form.title,
        body: form.content,
        imagesUrl: form.imagesUrl,
        targetMiliType,
        categoryIds: [form.categoryId],
        specialtyIds: form.serviceMosId,
        imageKeys: form.imageKeys,
      },
      () => navigate("/")
    );
  };

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <main className="flex justify-center pt-6 bg-gray-100 ">
      <div className="flex w-3/4 max-w-5xl gap-6">
        <QuestionWrite form={form} setForm={setForm} changed={changed} />
        <div className="flex flex-col w-1/5 gap-2">
          <button
            className="flex justify-center px-6 py-3 text-sm font-semibold text-white rounded-3xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
            onClick={onSubmit}
            disabled={!form.canSubmit}
          >
            질문 등록하기
          </button>
        </div>
      </div>
    </main>
  );
}
