"use client"

import { notFound } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import boardService from '@/services/board.service';
import { Board } from '@/types/board/type';
import { useRouter } from 'next/navigation';

type Props = {
  params: { id: string };
};

interface BoardDetailState {
  board: Board | null;
  isLoading: boolean;
  error: string | null;
}

export default function BoardDetail({ params }: Props) {
  const router = useRouter();
  const [state, setState] = useState<BoardDetailState>({
    board: null,
    isLoading: true,
    error: null,
  });

  const getBoardDetail = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await boardService.getBoardDetail(params.id);
      if (response && response.data) {
        setState({
          board: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          board: null,
          isLoading: false,
          error: '게시글을 찾을 수 없습니다.',
        });
      }
    } catch (error) {
      console.error(error);
      setState({
        board: null,
        isLoading: false,
        error: '게시글을 불러오는데 실패했습니다.',
      });
    }
  }, [params.id]);

  useEffect(() => {
    getBoardDetail();
  }, [getBoardDetail]);

  // 로딩 상태
  if (state.isLoading) {
    return <div>로딩 중...</div>;
  }

  // 에러 상태
  if (state.error) {
    return <div>에러: {state.error}</div>;
  }

  // 게시글 없음
  if (!state.board) {
    return notFound();
  }

  const handleBack = () => {
    router.back();
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          뒤로
        </button>
      </div>

      {/* 게시글 카드 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* 헤더 */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {state.board.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="font-medium">{state.board.username}</span>
              <span>•</span>
              <span>{state.board.regiDttm}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                123
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                45
              </span>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="px-8 py-8">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
              {state.board.content}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                좋아요
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                공유하기
              </button>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                수정
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">댓글 (3)</h3>
        </div>

        {/* 댓글 작성 */}
        <div className="px-8 py-6 border-b border-gray-200">
          <textarea
            placeholder="댓글을 작성해주세요..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="mt-3 flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              댓글 작성
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="px-8 py-6">
          <div className="space-y-4">
            {[1, 2, 3].map((comment) => (
              <div key={comment} className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      사용자{comment}
                    </span>
                    <span className="text-sm text-gray-500">2시간 전</span>
                  </div>
                  <p className="text-gray-700">
                    정말 좋은 글이네요! 감사합니다.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
