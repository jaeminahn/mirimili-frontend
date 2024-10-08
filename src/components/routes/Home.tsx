import MainContents from "../organisms/MainContents";
import SideContents from "../organisms/SideContents";

export default function Home() {
  return (
    <main className="flex justify-center pt-6 bg-gray-100 ">
      <div className="flex w-3/4 max-w-5xl gap-6">
        {/* content */}
        <MainContents />
        {/* side */}
        <SideContents />
      </div>
    </main>
  );
}
