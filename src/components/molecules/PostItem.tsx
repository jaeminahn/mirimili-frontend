export default function PostItem() {
  return (
    <div className="flex flex-col gap-2 p-4 border border-gray-300 rounded-lg">
      <p className="font-semibold">일반차량운전 뭘 준비해야 할까요?</p>
      <p className="line-clamp-2">
        안녕하십니까. 차량운전 예비입대자입니다. 자격요건과 1차 선발 등을 위한
        준비 등은 모두 마쳤습니다. 조금 바보같은 질문일 수 있지만, 수동 연습을
        하고 가는 게 도움이 될지 궁금합니다. 당연히 좋은 특기를 받으려면 운전을
        잘 해야 할텐데, 오토기어로는 3년 정도 해봤어도 수동기어는 정말 하나도
        기억이 안 납니다.. 본가에 있는 트럭이라도 조금 몰아봐야 할지, 그냥
        들어가도 될지 궁금합니다.
      </p>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500">1시간 전</p>
        <div className="flex gap-2 font-semibold">
          <div className="flex gap-1">
            <p>조회수</p>
            <p>156</p>
          </div>
          <div className="flex gap-1">
            <p>답변</p>
            <p>2</p>
          </div>
          <div className="flex gap-1">
            <p>추천</p>
            <p>3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
