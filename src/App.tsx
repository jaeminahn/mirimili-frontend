import React from "react";
import QnAList from "./components/organisms/QnAList";
import Header from "./components/organisms/Header";
import CommunityList from "./components/organisms/CommunityList";
import BestList from "./components/organisms/BestList";
import ContentList from "./components/organisms/ContentList";
import PostItem from "./components/molecules/PostItem";

function App() {
  return (
    <div className="font-nsk">
      <Header />
      <main className="flex justify-center pt-6 bg-gray-100 ">
        <div className="flex w-3/4 max-w-6xl gap-2">
          {/* content */}
          <div className="flex flex-col w-4/5 gap-2">
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
                <div className="p-1 bg-gray-200 rounded-md">
                  #제17전투비행단
                </div>
                <div className="p-1 bg-gray-200 rounded-md">#공군훈련소</div>
                <div className="p-1 bg-gray-200 rounded-md">#특기시험</div>
                <div className="p-1 bg-gray-200 rounded-md">#운항관제</div>
                <div className="p-1 bg-gray-200 rounded-md">#군수</div>
                <div className="p-1 bg-gray-200 rounded-md">#고민상담</div>
                <div className="p-1 bg-gray-200 rounded-md">#공군</div>
                <div className="p-1 bg-gray-200 rounded-md">#일반차량운전</div>
                <div className="p-1 bg-gray-200 rounded-md">
                  #제17전투비행단
                </div>
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
          {/* side */}
          <div className="flex flex-col w-1/5 gap-2">
            <div className="flex items-center justify-center p-5 bg-white rounded-lg h-36">
              <img src="./images/profile.png" alt="" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
