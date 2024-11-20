import { useState } from "react";
import { Icon } from "@iconify/react";

export default function QuestionWrite() {
    const [title, setTitle] = useState('');

    return (
        <div className="flex flex-col w-4/5 gap-4">
            <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-lg">
                <p className="text-lg font-semibold">질문 제목</p>
                <input
                    className="mx-3 mt-3 px-3 py-3 font-medium placeholder-gray-500 bg-transparent rounded-lg border-2 focus:outline-none focus:ring-0"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 작성해 주세요"
                />
            </div>
            <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-lg">
                <p className="text-lg font-semibold">질문 내용</p>
            </div>
            <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-lg">
                <p className="text-lg font-semibold">키워드 설정</p>
            </div>
            <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-lg">
                <p className="text-lg font-semibold">누가 답변할까요?</p>
            </div>
        </div>
    );
}