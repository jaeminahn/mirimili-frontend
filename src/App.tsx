import React from "react";
import QnAList from "./components/organisms/QnAList";
import Header from "./components/organisms/Header";
import CommunityList from "./components/organisms/CommunityList";
import BestList from "./components/organisms/BestList";
import ContentList from "./components/organisms/ContentList";

function App() {
  return (
    <div>
      <Header />
      <main className="mt-2 w-full px-4">
        <div className="flex mx-auto w-fit gap-x-4">
          <div className="flex-none border border-slate-400 w-[180px]">
            This is Ads
          </div>
          <div className="w-[720px]">
            <div className="h-[200px] flex flex-col justify-center">
              <img src="/logo.png" alt="mirimili" />
            </div>
            <div className="my-10 grid grid-cols-2 gap-x-6 gap-y-20">
              <QnAList />
              <CommunityList />
              <BestList />
              <ContentList />
            </div>
          </div>
          <div className="flex-none border border-slate-400 w-[180px]">
            This is Ads
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
