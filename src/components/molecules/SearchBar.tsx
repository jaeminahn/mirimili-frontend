import React, { useEffect, useMemo, useRef, useState } from "react";
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

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { loggedUser } = useAuth();

  const isMobile = window.innerWidth < 768;

  const [openRecent, setOpenRecent] = useState(false);
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [recentLoaded, setRecentLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canShowRecent = useMemo(() => {
    return !isMobile && !!loggedUser && openRecent;
  }, [isMobile, loggedUser, openRecent]);

  const fetchRecent = async () => {
    if (!loggedUser || recentLoaded) return;

    const res = await getJSON<ApiEnvelope<RecentKeywords>>("/search/recent");
    if (res.status === 401) return;
    if (res.ok && res.data?.success) {
      setRecentKeywords(res.data.data?.keywords ?? []);
      setRecentLoaded(true);
    }
  };

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpenRecent(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenRecent(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    setRecentLoaded(false);
    setRecentKeywords([]);
  }, [loggedUser]);

  const handleSearch = () => {
    if (isMobile) {
      navigate("/search-input");
      return;
    }

    if (query.trim()) {
      setOpenRecent(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isMobile && e.key === "Enter") {
      handleSearch();
    }
    if (!isMobile && e.key === "Escape") {
      setOpenRecent(false);
      inputRef.current?.blur();
    }
  };

  const onFocusDesktop = async () => {
    if (isMobile) return;
    if (!loggedUser) return;
    setOpenRecent(true);
    await fetchRecent();
  };

  const onClickRecent = (keyword: string) => {
    setQuery(keyword);
    setOpenRecent(false);
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="hidden md:flex">
        <div className="flex px-3 items-center transition-colors bg-gray-100 h-9 rounded-xl w-60 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600">
          <input
            ref={inputRef}
            className="w-full text-sm font-medium text-gray-900 placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0"
            type="text"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocusDesktop}
            onClick={onFocusDesktop}
          />
          <button
            onClick={handleSearch}
            className="-my-0.5 -ml-1.5 flex h-8 w-8 flex-shrink-0 items-center justify-center transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="h-5 w-5 text-emerald-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>

        {canShowRecent && (
          <div className="absolute left-0 top-[44px] w-60 bg-white rounded-2xl border border-gray-200 shadow-lg z-50">
            <div className="p-4">
              <div className="mb-2 px-2 text-sm font-semibold">최근 검색어</div>

              {recentKeywords.length > 0 ? (
                <ul className="flex flex-col gap-0.5">
                  {recentKeywords.map((k, idx) => (
                    <li key={`${k}-${idx}`}>
                      <button
                        type="button"
                        className="w-full text-left px-2 py-1 text-sm font-medium truncate"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => onClickRecent(k)}
                      >
                        {k}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-2 py-1 text-sm font-medium">
                  최근 검색어가 없습니다
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex md:hidden">
        <button
          onClick={handleSearch}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="w-5 h-5 text-emerald-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
