import PostItem from "../molecules/PostItem";

export default function ContentList() {
  return (
    <div className="w-full">
      <a className="mb-2 text-gray-900 no-underline" href="/questions">
        <div className="bg-gray-200 h-10 rounded-lg text-center font-semibold leading-10 text-xl">
          컨텐츠
        </div>
      </a>
      <div>
        <ul className="divide-y divide-gray-500/30">
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
        </ul>
      </div>
    </div>
  );
}
