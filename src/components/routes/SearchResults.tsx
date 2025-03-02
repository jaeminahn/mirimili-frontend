import React from "react";
import { useSearchParams } from "react-router-dom";
import SearchResultsContent from "./SearchResultsContent";
import SearchSide from "./SearchSide";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  return (
    <main className="flex flex-col items-center pt-6 bg-gray-100">
      <div className="lg:w-3/4 lg:max-w-5xl px-4">
        <p className="text-2xl font-bold mb-6">
            {query ? (
                <>
                <span className="text-emerald-600">{query}</span> 검색 결과
                </>
            ) : (
                "검색어를 입력해주세요"
            )}
        </p>
        <div className="flex lg:gap-6">
          <SearchResultsContent query={query} />
          <SearchSide />
        </div>
      </div>
    </main>
  );
}