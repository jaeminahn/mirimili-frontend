import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";
import Header from "../organisms/Header";

export default function Home() {
  const { loggedUser } = useAuth();

  return (
    <div className="flex flex-col w-screen h-screen ">
      <Header />
      <main className="flex flex-col items-center justify-center flex-grow pt-6 bg-gray-100 ">
        <div className="flex flex-col w-3/4 max-w-5xl gap-4">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-semibold text-gray-500">
              똑똑한 입대, 후회없는 군생활
            </p>
            <p className="text-5xl font-get text-emerald-600">
              미리밀리와 함께!
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg h-96">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 h-72">
                <Link to="/questions">
                  <div className="flex flex-col flex-1 h-full p-4 rounded-lg bg-emerald-100">
                    <p className="text-2xl font-get text-emerald-600">
                      질문&답변
                    </p>
                    <div>
                      <p>물어볼 곳 없는 군생활 정보,</p>
                      <div className="flex">
                        <p className="font-semibold">정확하고 구체적인 답변</p>
                        <p>이 필요하다면?</p>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col flex-1 h-full gap-4">
                  <Link
                    className="flex flex-col justify-center flex-grow p-4 rounded-lg bg-emerald-50"
                    to="/talks"
                  >
                    <p className="text-xl font-get text-emerald-600">
                      커뮤니티
                    </p>
                    <p className="text-sm text-gray-600">
                      미리밀리 가족들을 위한 익명 커뮤니티
                    </p>
                  </Link>
                  <Link
                    className="flex flex-col justify-center flex-grow p-4 rounded-lg bg-emerald-50"
                    to="/articles"
                  >
                    <p className="text-xl font-get text-emerald-600">밀리Tip</p>
                    <p className="text-sm text-gray-600">
                      똑똑한 입대, 후회없는 군생활을 위한 모든 정보
                    </p>
                  </Link>
                  <Link
                    className="flex items-center h-12 gap-4 p-4 border-2 rounded-lg bg-emerald-50 border-emerald-600"
                    to="/"
                  >
                    <p className="text-xl font-get text-emerald-600">
                      미리밀리+
                    </p>
                    <p className="text-sm font-semibold text-emerald-700">
                      프라이빗질문, 빠른답변, 부대선택
                    </p>
                  </Link>
                </div>
              </div>
              <Link to="/notices">
                <div className="flex items-center h-12 gap-4 px-4 bg-gray-100 rounded-lg">
                  <p className="font-semibold text-gray-600">공지</p>
                  <p className="text-gray-600">미리밀리 업데이트 안내</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
