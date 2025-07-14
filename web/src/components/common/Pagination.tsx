import Link from 'next/link';
import React, { useMemo, useCallback, useEffect } from 'react';


type PaginationProps = {
  offset: number;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

export const Pagination = React.memo(({
  offset,
  currentPage,
  totalCount,
  onPageChange,
}: PaginationProps) => {


  // page에 대한 배열을 만드는 함수 ex) [1, 2, 3, 4, 5] 이렇게
  const pages = useMemo(() => {
    // 전체 길이를 totalCount로 설정
    // 언더스코어(_)의 의미: 사용하지 않는 변수를 처리한 것임(실제로 값은 사용하지 않고 인덱스만 사용을 하기 때문에)
    // 불필요한 계산을 다시 하지 않기 위해서 useMemo를 사용함
    return Array.from({ length: totalCount }, (_, i) => i + 1);
  }, [totalCount]);

  // 페이지 클릭용 핸들러 추가하기
  // useCallback을 사용해서 최적화 시키기
  // onPageChange가 왜 의존성 배열에 걸려있는가?
  // -> 컴포넌트가 렌더링이 될 때마다 함수가 새로 생성되는 것을 방지하기 위해서임.
  const handlePageClick = useCallback(
    (page: number) => {
      // props로 받은 함수 실행
      onPageChange?.(page);
    },
    [onPageChange]
  );

  const handlePrevClick = useCallback(() => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextClick = useCallback(() => {
    if (currentPage < totalCount) {
      onPageChange?.(currentPage + 1);
    }
  }, [currentPage, totalCount, onPageChange]);

  return (
    <div className="flex justify-center">
      <nav
        className="inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        {/* 이전 버튼: 현재 페이지의 인덱스가 1인 경우에 비활성화 */}
        {currentPage === 1 ? (
          <span className="px-3 py-2 border text-sm font-medium rounded-l-md bg-gray-200 text-gray-400 cursor-not-allowed">
            이전
          </span>
        ) : (
          <button
            onClick={handlePrevClick}
            className="px-3 py-2 border text-sm font-medium rounded-l-md bg-white text-gray-700 hover:bg-gray-100"
          >
            이전
          </button>
        )}

        {/* 페이지 번호들 */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-2 border text-sm font-medium ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {/* 다음 버튼: 현재 페이지의 인덱스와 총 페이지 수가 같은 경우에는 비활성화 */}
        {currentPage === totalCount ? (
          <span className="px-3 py-2 border text-sm font-medium rounded-r-md bg-gray-200 text-gray-400 cursor-not-allowed">
            다음
          </span>
        ) : (
          <button
            onClick={handleNextClick}
            className="px-3 py-2 border text-sm font-medium rounded-r-md bg-white text-gray-700 hover:bg-gray-100"
          >
            다음
          </button>
        )}
      </nav>
    </div>
  );
});

Pagination.displayName = 'Pagination';
