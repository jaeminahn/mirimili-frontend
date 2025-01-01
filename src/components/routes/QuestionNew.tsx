import { ChangeEvent, useEffect, useState } from "react";
import QuestionWrite from "../organisms/QuestionWrite";
import { useAuth } from "../../contexts";
import { postNewQuestion } from "../../api/questions";
import { useNavigate } from "react-router-dom";
import * as U from "../../utils";

export type QuestionFormType = {
  title: string;
  content: string;
  categoryId: number;
  serviceTypeId: number[];
  serviceMosId: number[];
};

const initialFormState: QuestionFormType = {
  title: "",
  content: "",
  categoryId: 1,
  serviceTypeId: [],
  serviceMosId: [],
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
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onSubmit = () => {
    if (form.title === "") window.alert("제목을 입력해주세요.");
    else if (form.content === "") window.alert("내용을 입력해주세요.");
    else if (form.categoryId === 0) window.alert("카테고리를 지정해주세요.");
    else if (form.serviceTypeId.length === 0)
      window.alert("답변자의 군복무 종류를 지정해주세요.");
    else if (form.serviceMosId.length === 0)
      window.alert("답변자의 군특기를 지정해주세요.");
    else {
      U.readObjectP("accessToken").then((at) => {
        postNewQuestion(
          loggedUser!.id,
          form.title,
          form.content,
          form.categoryId,
          form.serviceTypeId,
          form.serviceMosId,
          JSON.stringify(at).slice(1, -1),
          () => navigate("/")
        );
      });
    }
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
            className="flex justify-center px-6 py-3 text-sm font-semibold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
            onClick={onSubmit}
          >
            질문 등록하기
          </button>
          <button className="flex justify-center px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300">
            임시 저장하기
          </button>
        </div>
      </div>
    </main>
  );
}
