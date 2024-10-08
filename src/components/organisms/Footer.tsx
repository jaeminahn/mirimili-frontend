import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="z-20 flex flex-col items-center gap-4 py-8 text-base bg-gray-100">
      <div className="flex items-center justify-between w-3/4 max-w-5xl">
        <Link to="/">
          <img src="/images/logo.png" alt="mirimili" width={75} />
        </Link>
        <div className="flex gap-8">
          <Link to="/">미리밀리 소개</Link>
          <Link to="/">서비스 이용약관</Link>
          <Link to="/">개인정보 처리방침</Link>
        </div>
      </div>
      <div className="flex flex-col w-3/4 max-w-5xl gap-2 text-xs text-gray-500">
        <div className="flex gap-4">
          <p>상호명 미리밀리</p>
          <p>대표자 김동휘</p>
          <p>개인정보보호책임자 김동휘</p>
        </div>
        <div className="flex gap-4">
          <p>사업자등록번호 000-00-00000</p>
          <p>통신판매업신고번호 제2024-서울강남-00000호</p>
        </div>
        <div className="flex gap-4">
          <p>대표번호 0000-0000</p>
          <p>주소 서울특별시 강남구</p>
          <p>문의 mirimili@makeitez.com</p>
        </div>
      </div>
    </div>
  );
}
