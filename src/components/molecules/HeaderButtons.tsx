export default function HeaderButtons() {
  return (
    <div className="flex items-center gap-x-5">
      <a className="text-gray-900 hover:text-emerald-500" href="">
        Q&A
      </a>
      <a className="text-gray-900 hover:text-emerald-500" href="">
        커뮤니티
      </a>
      <a className="text-gray-900 hover:text-emerald-500" href="">
        베스트
      </a>
      <a className="text-gray-900 hover:text-emerald-500" href="">
        컨텐츠
      </a>
      <div className="h-3 w-px shrink-0 bg-gray-400" />
      <a className="text-gray-900 hover:text-emerald-500" href="">
        공지
      </a>
    </div>
  );
}
