import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import SelectModal from "./SelectModal";
import ButtonOption from "../molecules/ButtonOption";
import { MosAndUnitRecord } from "../../data/data";
import serviceType from "../../data/serviceType.json";
import serviceMos from "../../data/serviceMos.json";

export default function QuestionWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isAllType, setIsAllType] = useState(true);
  const [type, setType] = useState<number[]>([]);
  const [mosList, setMosList] = useState<MosAndUnitRecord[]>([]);
  const [mos, setMos] = useState<string[]>(["전체"]);
  const [isMosModalOpen, setMosModalOpen] = useState(false);

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && keywordInput.trim() !== "") {
      setKeywords((prev) => [...prev, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && keywordInput === "" && keywords.length > 0) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleMosModal = () => setMosModalOpen(!isMosModalOpen);

  //   const handleMosSelect = (mos: MosAndUnitRecord) => {
  //     setMosList((prev) =>
  //       prev.includes(mos.label) ? prev : [...prev, mos.label]
  //     );
  //     setMosModalOpen(false);
  //   };

  const handleMosChange = (selectedMos: string[]) => {
    if (selectedMos.includes("전체")) {
      setMos(["전체"]);
    } else {
      setMos(selectedMos.filter((item) => item !== "전체"));
    }
  };

  useEffect(() => {
    setIsAllType(type.length === serviceType.length);
  }, [type]);

  return (
    <div className="flex flex-col w-4/5 gap-6 p-6 bg-gray-100 rounded-lg">
      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        <p className="mb-2 text-lg font-semibold">질문 제목</p>
        <input
          className="px-3 py-3 font-medium placeholder-gray-500 bg-transparent border border-gray-300 rounded-lg focus:outline-none"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 작성해 주세요"
        />
      </div>

      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        <p className="mb-2 text-lg font-semibold">질문 내용</p>
        <textarea
          className="px-3 py-3 mb-2 font-medium placeholder-gray-500 bg-transparent border border-gray-300 rounded-lg resize-none h-60 focus:outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`질문글 작성 시 유의해 주세요!\n\n\t•  구체적인 부대 위치, 작전 계획 등 군 보안사항은 답변드릴 수 없어요.\n\t•  질문 게시 후 답변이 등록되면 질문을 수정하거나 삭제할 수 없어요.\n\t•  선정적/모욕적/폭력적/스팸성 내용의 글 작성 시, 서비스 이용이 제한될 수 있어요.\n\t•  답변이 등록되면 회원가입 시 작성하신 전화번호로 알림을 보내드려요.`}
        />
        <div className="flex items-center justify-center bg-white border border-gray-300 rounded-lg cursor-pointer w-14 h-14">
          <label className="flex items-center justify-center w-full h-full cursor-pointer">
            <Icon
              icon="fluent:camera-add-24-filled"
              className="text-2xl text-gray-400"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  console.log("Selected file:", file);
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        <p className="mb-2 text-lg font-semibold">키워드 설정</p>
        <div className="flex flex-wrap items-center gap-2 px-3 py-3 border border-gray-300 rounded-lg">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 rounded-full"
            >
              {keyword}
              <button
                className="font-bold text-red-500"
                onClick={() => removeKeyword(index)}
              >
                ✕
              </button>
            </span>
          ))}
          <input
            className="flex-1 font-medium placeholder-gray-500 bg-transparent focus:outline-none"
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              addKeyword(e);
              handleKeywordInput(e);
            }}
            placeholder={keywords.length === 0 ? "키워드를 입력해 주세요" : ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
        <p className="mb-2 text-lg font-semibold">누가 답변할까요?</p>
        <div className="flex items-center gap-4">
          <span className="w-20 mr-2 text-base font-semibold">군구분</span>
          <ButtonOption
            options={serviceType}
            selected={type}
            setSelected={setType}
            isAllSelected={isAllType}
            setIsAllSelected={setIsAllType}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="mr-2 text-base font-semibold">특기</span>
          {/* <ButtonOption
            options={mosList}
            selected={mos}
            onChange={handleMosChange}
          /> */}
          <button
            className="flex items-center justify-center w-8 h-8 text-xl font-bold text-gray-500 bg-gray-100 border-2 border-gray-100 rounded-full hover:bg-gray-200"
            onClick={toggleMosModal}
          >
            +
          </button>
        </div>
      </div>

      <button className="self-center px-6 py-3 font-bold text-white rounded-lg bg-emerald-600">
        질문 게시하기
      </button>

      {/* <SelectModal
        title="특기"
        isOpen={isMosModalOpen}
        onClose={toggleMosModal}
        onSelect={handleMosSelect}
        DataList={serviceMos}
      /> */}
    </div>
  );
}
