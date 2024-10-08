import PostItem from "../molecules/PostItem";

export default function MainContents() {
  return (
    <div className="flex flex-col w-4/5 gap-6">
      <div className="flex justify-center h-48 rounded-lg bg-[#3CCBDA]">
        <img
          src="/images/advertisement.png"
          alt=""
          className="object-cover h-full"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg">
        <p className="text-xl font-bold font-get">관심 질문 👀</p>
        <div className="flex flex-wrap gap-2">
          <div className="p-1 bg-gray-200 rounded-md">키워드 전체</div>
          <div className="p-1 bg-gray-200 rounded-md">#공군</div>
          <div className="p-1 bg-gray-200 rounded-md">#일반차량운전</div>
          <div className="p-1 bg-gray-200 rounded-md">#제17전투비행단</div>
          <div className="p-1 bg-gray-200 rounded-md">#공군훈련소</div>
          <div className="p-1 bg-gray-200 rounded-md">#특기시험</div>
          <div className="p-1 bg-gray-200 rounded-md">#운항관제</div>
          <div className="p-1 bg-gray-200 rounded-md">#군수</div>
          <div className="p-1 bg-gray-200 rounded-md">#고민상담</div>
          <div className="p-1 bg-gray-200 rounded-md">#공군</div>
          <div className="p-1 bg-gray-200 rounded-md">#일반차량운전</div>
          <div className="p-1 bg-gray-200 rounded-md">#제17전투비행단</div>
          <div className="p-1 bg-gray-200 rounded-md">#공군훈련소</div>
          <div className="p-1 bg-gray-200 rounded-md">#특기시험</div>
          <div className="p-1 bg-gray-200 rounded-md">#운항관제</div>
          <div className="p-1 bg-gray-200 rounded-md">#군수</div>
          <div className="p-1 bg-gray-200 rounded-md">#고민상담</div>
          {/* <div className="p-1 bg-gray-200 rounded-md">
                  <span className="icon-[mingcute--pencil-fill]"></span>
                </div> */}
        </div>
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
      </div>
    </div>
  );
}
