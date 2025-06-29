"use client"

import Link from 'next/link';
import { PostCard } from '@/components/board/PostCard';
import { Pagination } from '@/components/common/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';
import boardService from '@/services/board.service';
import { Board } from '@/types/board/type';


const ITEMS_PER_PAGE = 6;

export default function BoardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam) + 1 : 1;
  const [boardList, setBoardList] = useState<Board[] | undefined>([]);
  const [offset, setOffSet] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [testCount, setTestCount] = useState<number>(0); // 테스트용 상태

  const handleEdit = () => {
    router.push('/board/edit');
  };

  const getItems = useCallback(async (pageNumber: number) => {
    const offsetNum = ((pageNumber - 1) * ITEMS_PER_PAGE) | 0;
    setOffSet(offsetNum);

    try {
      const response = await boardService.getBoards(offsetNum, ITEMS_PER_PAGE);

      const boards = response?.data?.list || [];
      const count = response?.data.totalCount || 0;
      setBoardList(boards);
      setTotalCount(Math.ceil(count / ITEMS_PER_PAGE));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getItems(page);
  }, [page, getItems]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      getItems(page);
    },
    [getItems]
  );
  // 테스트용 버튼 핸들러
  const handleTestClick = useCallback(() => {
    console.log(`🧪 테스트 버튼 클릭 - testCount 증가`);
    setTestCount((prev) => prev + 1);
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-screen mt-6 mb-10">
      <div className="flex flex-col w-full max-w-lg gap-y-4">
        <div className="flex justify-center mb-4">
          <button
            onClick={handleTestClick}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            테스트 버튼 (testCount: {testCount})
          </button>
        </div>
        {boardList && boardList.length > 0 ? (
          <div className="flex-grow flex flex-col gap-y-5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 ">
              {boardList.map((post) => (
                <Link key={post.id} href={`/board/${post.id}`}>
                  <PostCard
                    title={post.title}
                    username={post.username}
                    content={post.content}
                  />
                </Link>
              ))}
            </div>
            <div className="flex w-full justify-center items-center">
              <Pagination
                offset={ITEMS_PER_PAGE}
                currentPage={currentPage}
                totalCount={totalCount}
                onPageChange={handlePageChange}
              />
            </div>
            <div className="flex justify-end items-end">
              <div>
                <button
                  type="submit"
                  onClick={handleEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  글쓰기
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              type="submit"
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              글쓰기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
