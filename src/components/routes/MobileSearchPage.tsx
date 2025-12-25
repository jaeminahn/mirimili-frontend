import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { getJSON } from "../../api/getAndDel";

type ApiEnvelope<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

type RecentKeywords = {
  keywords: string[];
};

export default function MobileSearchPage() {
  const [query, setQuery] = useState("");
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  const navigate = useNavigate();
  const { loggedUser } = useAuth();

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!loggedUser) {
        if (!mounted) return;
        setShowRecent(false);
        setRecentKeywords([]);
        return;
      }

      const res = await getJSON<ApiEnvelope<RecentKeywords>>("/search/recent");

      if (!mounted) return;

      if (res.status === 401) {
        setShowRecent(false);
        setRecentKeywords([]);
        return;
      }

      if (res.ok && res.data?.success) {
        setRecentKeywords(res.data.data?.keywords ?? []);
        setShowRecent(true);
      } else {
        setShowRecent(false);
        setRecentKeywords([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loggedUser]);

  const handleSearch = (keyword?: string) => {
    const searchQuery = keyword ?? query;
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <main className="flex flex-col w-full h-screen bg-white">
      <div className="flex items-center px-4 py-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요"
          className="flex-1 text-base text-gray-900 placeholder-gray-400 bg-transparent px-4 py-2 focus:outline-none"
          style={{ WebkitTapHighlightColor: "transparent" }}
        />
        <button
          onClick={() => handleSearch()}
          className="mr-2 bg-gray-100 rounded-lg p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-5 h-5 text-emerald-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
        <button onClick={handleClose} className="bg-gray-100 rounded-lg p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 bg-gray-100 overflow-auto p-6">
        {showRecent && (
          <>
            <div className="flex justify-between items-center px-4 py-2 text-sm font-semibold text-gray-700">
              <span>최근 검색어</span>
            </div>

            <ul className="flex flex-col px-4 py-2 space-y-3 text-sm text-gray-800">
              {recentKeywords.length > 0 ? (
                recentKeywords.map((keyword, index) => (
                  <li
                    key={`${keyword}-${index}`}
                    className="truncate cursor-pointer"
                    onClick={() => handleSearch(keyword)}
                  >
                    {keyword}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">최근 검색어가 없습니다</li>
              )}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
