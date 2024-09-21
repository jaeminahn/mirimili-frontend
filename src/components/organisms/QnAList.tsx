import PostItem from "../molecules/PostItem";

export default function QnAList() {
  return (
    <div className="w-full">
      <a className="mb-2 text-gray-900 no-underline" href="/questions">
        <div className="h-10 text-xl font-semibold leading-10 text-center bg-gray-200 rounded-lg">
          Q&A
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
