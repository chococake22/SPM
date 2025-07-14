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
  
  // URL에서 offset과 limit 파라미터 가져오기
  const offsetParam = searchParams.get('offset');
  const limitParam = searchParams.get('limit');
  
  // 기본값 설정
  const offset = offsetParam !== null ? parseInt(offsetParam) : 0;
  const limit = limitParam !== null ? parseInt(limitParam) : ITEMS_PER_PAGE;
  const currentPage = Math.floor(offset / limit) + 1;
  
  const [boardList, setBoardList] = useState<Board[] | undefined>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const getItems = useCallback(async (offsetNum: number, limitNum: number) => {
    setLoading(true);

    try {
      const response = await boardService.getBoards(offsetNum, limitNum);
      if (response && response.data) {
        const boards = response.data.list || [];
        const count = response.data.totalCount || 0;

        setBoardList(boards);
        setTotalCount(Math.ceil(count / limitNum));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // offset, limit에 따른 데이터 조회
    getItems(offset, limit);
    
    // 첫 진입 시 URL 업데이트 (파라미터가 없을 때만)
    if (offsetParam === null && limitParam === null) {
      const newUrl = `/board?offset=0&limit=${ITEMS_PER_PAGE}`;
      router.replace(newUrl);
    }
  }, [offset, limit, getItems, offsetParam, limitParam, router]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newOffset = (newPage - 1) * limit;
      const newUrl = `/board?offset=${newOffset}&limit=${limit}`;
      router.push(newUrl);
    },
    [router, limit]
  );

  const handleEdit = () => {
    router.push('/board/edit');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full mt-6 mb-10 px-4">
        <div className="flex flex-col w-full max-w-lg">
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full mt-6 mb-10 px-4">
      <div className="flex flex-col w-full max-w-lg">
        {boardList && boardList.length > 0 ? (
          <div className="flex-grow flex flex-col gap-y-5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 ">
              {boardList.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/board/${post.id}?returnOffset=${offset}&returnLimit=${limit}`}
                >
                  <PostCard
                    id={post.id.toString()}
                    title={post.title}
                    username={post.user.username}
                    content={post.content}
                  />
                </Link>
              ))}
            </div>
            <div className="flex w-full justify-center items-center">
              <Pagination
                offset={limit}
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
          <div className="flex flex-col items-center justify-center h-32">
            <div className="text-gray-500 mb-4">게시글이 없습니다</div>
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
