import { useState } from "react";
import MosModal from "../molecules/MosModal";
import ButtonOption from "../molecules/ButtonOption";

export default function QuestionWrite() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [type, setType] = useState<string[]>(["공군"]);
    const [mos, setMos] = useState<string[]>(["전체"]);
    const [isMosModalOpen, setMosModalOpen] = useState(false);

    const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ' ') && keywordInput.trim() !== '') {
            setKeywords((prev) => [...prev, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && keywordInput === '' && keywords.length > 0) {
            setKeywords((prev) => prev.slice(0, -1));
        }
    };

    const removeKeyword = (index: number) => {
        setKeywords((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleMosModal = () => setMosModalOpen(!isMosModalOpen);

    const handleSpecialtySelect = (specialty: { name: string }) => {
        setMos((prev) => (prev.includes(specialty.name) ? prev : [...prev.filter((item) => item !== "전체"), specialty.name]));
        setMosModalOpen(false);
    };

    const handleMosChange = (selectedMos: string[]) => {
        if (selectedMos.includes("전체")) {
            setMos(["전체"]);
        } else {
            setMos(selectedMos.filter((item) => item !== "전체"));
        }
    };

    return (
        <div className="flex flex-col w-4/5 gap-6 p-6 bg-gray-100 rounded-lg">
            <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
                <p className="mb-2 text-lg font-semibold">질문 제목</p>
                <input
                    className="px-3 py-3 font-medium placeholder-gray-500 bg-transparent rounded-lg border-2 border-gray-300 focus:outline-none"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 작성해 주세요"
                />
            </div>

            <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
                <p className="mb-2 text-lg font-semibold">질문 내용</p>
                <textarea
                    className="h-60 px-3 py-3 font-medium placeholder-gray-500 bg-transparent rounded-lg border-2 border-gray-300 focus:outline-none resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`질문글 작성 시 유의해 주세요!\n\n\t•  구체적인 부대 위치, 작전 계획 등 군 보안사항은 답변드릴 수 없어요.\n\t•  질문 게시 후 답변이 등록되면 질문을 수정하거나 삭제할 수 없어요.\n\t•  선정적/모욕적/폭력적/스팸성 내용의 글 작성 시, 서비스 이용이 제한될 수 있어요.\n\t•  답변이 등록되면 회원가입 시 작성하신 전화번호로 알림을 보내드려요.`}
                />
            </div>

            <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
                <p className="mb-2 text-lg font-semibold">키워드 설정</p>
                <div className="flex items-center flex-wrap gap-2 border-2 border-gray-300 rounded-lg px-3 py-3">
                    {keywords.map((keyword, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-sm bg-gray-100 rounded-full flex items-center gap-1"
                        >
                            {keyword}
                            <button
                                className="text-red-500 font-bold"
                                onClick={() => removeKeyword(index)}
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                    <input
                        className="flex-1 bg-transparent font-medium placeholder-gray-500 focus:outline-none"
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                            addKeyword(e);
                            handleKeywordInput(e);
                        }}
                        placeholder={keywords.length === 0 ? '키워드를 입력해 주세요' : ''}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
                <p className="mb-2 text-lg font-semibold">누가 답변할까요?</p>
                <div className="flex items-center gap-4">
                    <span className="mr-2 text-base font-semibold">군구분</span>
                    <ButtonOption
                        options={["공군", "육군", "해군", "해병대"]}
                        selected={type}
                        onChange={setType}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="mr-2 text-base font-semibold">특기</span>
                    <ButtonOption
                        options={mos}
                        selected={mos}
                        onChange={handleMosChange}
                    />
                    <button
                        className="w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-500 bg-gray-100 rounded-full border-2 border-gray-100 hover:bg-gray-200"
                        onClick={toggleMosModal}
                    >
                        +
                    </button>
                </div>
            </div>

            <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg self-center">
                질문 게시하기
            </button>

            <MosModal
                isOpen={isMosModalOpen}
                onClose={toggleMosModal}
                onSelect={handleSpecialtySelect}
            />
        </div>
    );
}
