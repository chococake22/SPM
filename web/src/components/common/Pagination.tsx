import Link from 'next/link';

type PaginationProps = {
  offset: number;
  currentPage: number;
  totalCount: number;
};

export function Pagination({ offset, currentPage, totalCount }: PaginationProps) {
  const pages = Array.from({ length: totalCount }, (_, i) => i + 1);
  
  console.log(currentPage)
  console.log(totalCount)

  return (
    <div className="flex justify-center">
      <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        {/* 이전 버튼 */}
        <Link
          href={`?page=${currentPage - 1}`}
          className={`px-3 py-2 border text-sm font-medium rounded-l-md ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          이전
        </Link>

        {/* 페이지 번호들 */}
        {pages.map((page) => (
          <Link
            key={page}
            href={`?page=${page-1}&offset=${offset}`}
            className={`px-3 py-2 border text-sm font-medium ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        ))}

        {/* 다음 버튼 */}
        <Link
          href={`?page=${currentPage + 1}`}
          className={`px-3 py-2 border text-sm font-medium rounded-r-md ${
            currentPage === totalCount
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          다음
        </Link>
      </nav>
    </div>
  );
}
