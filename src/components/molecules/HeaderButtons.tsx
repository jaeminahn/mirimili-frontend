export default function HeaderButtons() {
  return (
    <div className="flex items-center gap-3">
      <a className="text-gray-900 hover:text-emerald-500" href="">
        Q&A💭
      </a>
      <a className="text-gray-900 hover:text-emerald-500" href="">
        커뮤니티💬
      </a>
      <a className="text-gray-900 hover:text-emerald-500" href="">
        밀리Tip💡
      </a>
      {/* <a className="text-gray-900 hover:text-emerald-500" href="">
        베스트🔥
      </a> */}
      <div className="w-px h-3 bg-gray-900 shrink-0" />
      <a className="text-gray-900 hover:text-emerald-500" href="">
        공지📢
      </a>
    </div>
  );
}
