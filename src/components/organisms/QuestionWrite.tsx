import { ChangeEvent, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import SelectModal from "./SelectModal";
import ButtonOption from "../molecules/ButtonOption";
import { MosAndUnitRecord } from "../../data/data";
import category from "../../data/category.json";
import serviceType from "../../data/serviceType.json";
import serviceMos from "../../data/serviceMos.json";
import { QuestionFormType } from "../routes/QuestionNew";

interface QuestionWriteProps {
  form: QuestionFormType;
  setForm: React.Dispatch<React.SetStateAction<QuestionFormType>>;
  changed: (
    key: keyof QuestionFormType
  ) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

export default function QuestionWrite({
  form,
  setForm,
  changed,
}: QuestionWriteProps) {
  const [isAllType, setIsAllType] = useState(true);
  const [type, setType] = useState<number[]>(
    // serviceType.map((item) => item.id)
    [1]
  );
  const [isAllMos, setIsAllMos] = useState(true);
  const [mosList, setMosList] = useState<number[]>([]);
  const [mos, setMos] = useState<number[]>([]);
  const [isMosModalOpen, setIsMosModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<string>(
    Date.now().toString()
  );

  const toggleMosModal = () => setIsMosModalOpen(!isMosModalOpen);

  const handleMosListSelect = (mos: MosAndUnitRecord) => {
    setMosList((prev) => (prev.includes(mos.id) ? prev : [...prev, mos.id]));
    setMos((prev) => (prev.includes(mos.id) ? prev : [...prev, mos.id]));
    setIsMosModalOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImages = files.map((file) => URL.createObjectURL(file));
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);

      setFileInputKey(Date.now().toString());
    }
  };

  const handleRemoveImage = (image: string) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((img) => img !== image)
    );
  };

  useEffect(() => {
    setIsAllType(type.length === serviceType.length);
    setForm((prev) => ({ ...prev, serviceTypeId: type }));
  }, [type]);

  useEffect(() => {
    if (isAllMos)
      setForm((prev) => ({
        ...prev,
        serviceMosId: serviceMos.map((item) => item.id),
      }));
    else {
      setForm((prev) => ({
        ...prev,
        serviceMosId: mos,
      }));
    }
  }, [isAllMos, mos]);

  useEffect(() => {
    if (mos.length > 0) setIsAllMos(false);
  }, [mos]);

  const handleAllMos = () => {
    if (!isAllMos) {
      setMos([]);
      setIsAllMos(true);
    } else {
      setMos(mosList);
      setIsAllMos(false);
    }
  };

  return (
    <div className="flex flex-col w-4/5 gap-6 bg-gray-100 rounded-lg">
      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        <p className="mb-2 text-lg font-semibold">질문 제목</p>
        <input
          className="px-3 py-3 font-medium placeholder-gray-500 bg-transparent border border-gray-300 rounded-lg focus:outline-none"
          type="text"
          value={form.title}
          onChange={changed("title")}
          placeholder="제목을 작성해 주세요"
        />
      </div>

      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        <p className="mb-2 text-lg font-semibold">질문 내용</p>
        <textarea
          className="px-3 py-3 mb-2 font-medium placeholder-gray-500 bg-transparent border border-gray-300 rounded-lg resize-none h-60 focus:outline-none"
          value={form.content}
          onChange={changed("content")}
          placeholder={`질문글 작성 시 유의해 주세요!\n\n\t•  구체적인 부대 위치, 작전 계획 등 군 보안사항은 답변드릴 수 없어요.\n\t•  질문 게시 후 답변이 등록되면 질문을 수정하거나 삭제할 수 없어요.\n\t•  선정적/모욕적/폭력적/스팸성 내용의 글 작성 시, 서비스 이용이 제한될 수 있어요.\n\t•  답변이 등록되면 회원가입 시 작성하신 전화번호로 알림을 보내드려요.`}
        />

        <div className="flex flex-wrap gap-2">
          {uploadedImages.map((image, index) => (
            <div
              key={index}
              className="relative w-24 h-24 overflow-hidden border border-gray-300 rounded-lg"
            >
              <img
                src={image}
                alt={`Uploaded ${index}`}
                className="object-cover w-full h-full"
              />
              <button
                className="absolute flex items-center justify-center w-6 h-6 text-gray-700 bg-gray-200 rounded-full top-1 right-1 hover:bg-gray-300"
                onClick={() => handleRemoveImage(image)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center bg-white border border-gray-300 rounded-lg cursor-pointer w-14 h-14">
          <label className="flex items-center justify-center w-full h-full cursor-pointer">
            <Icon
              icon="fluent:camera-add-24-filled"
              className="text-2xl text-gray-400"
            />
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        <p className="mb-2 text-lg font-semibold">카테고리 설정</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {category.map(
            (item) =>
              item.id !== 0 && (
                <button
                  key={item.id}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, categoryId: item.id }))
                  }
                  className={`px-2 py-1 text-sm rounded-xl border-2 ${
                    form.categoryId === item.id
                      ? "bg-emerald-100 border-emerald-600 font-semibold"
                      : "bg-gray-100 border-gray-100 font-medium"
                  } cursor-pointer`}
                >
                  {item.label}
                </button>
              )
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
        <p className="mb-2 text-lg font-semibold">누가 답변할까요?</p>
        <div className="flex items-center gap-4">
          <span className="mr-2 text-base font-semibold min-w-12">군구분</span>
          <ButtonOption
            data={serviceType}
            options={serviceType.map((item) => item.id)}
            selected={type}
            setSelected={setType}
            isAllSelected={isAllType}
            setIsAllSelected={setIsAllType}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="mr-2 text-base font-semibold min-w-12">특기</span>
          <button
            key={0}
            className={`px-2 py-1 text-sm rounded-xl border-2 ${
              isAllMos
                ? "bg-emerald-100 border-emerald-600"
                : "bg-gray-100 text-gray-500 border-gray-100"
            }`}
            onClick={handleAllMos}
          >
            전체
          </button>
          <p className="text-lg text-gray-500">|</p>
          <ButtonOption
            data={serviceMos}
            options={mosList}
            selected={mos}
            setSelected={setMos}
          />
          {/* {mos.map((mosId) => (
            <button
              key={mosId}
              className="px-2 py-1 text-sm border-2 rounded-xl bg-emerald-100 border-emerald-600"
              onClick={() =>
                setMos((prev) => prev.filter((id) => id !== mosId))
              }
            >
              {serviceMos.find((item) => item.id === mosId)!.label}
            </button>
          ))} */}
          <button
            className="flex items-center justify-center w-8 h-8 text-xl font-bold text-gray-500 bg-gray-100 border-2 border-gray-100 rounded-full hover:bg-gray-200"
            onClick={toggleMosModal}
          >
            +
          </button>
        </div>
      </div>

      <SelectModal
        title="특기"
        isOpen={isMosModalOpen}
        onClose={toggleMosModal}
        onSelect={handleMosListSelect}
        DataList={serviceMos}
      />
    </div>
  );
}
