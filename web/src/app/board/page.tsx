"use client"

import Link from 'next/link';
import { PostCard } from '@/components/board/PostCard';
import { Pagination } from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';

const posts = [
  {
    id: '1',
    title: '첫 번째 게시글',
    username: '애플1',
    content: '이것은 첫 번째 게시글입니다.',
  },
  {
    id: '2',
    title: '두 번째 게시글',
    username: '애플1',
    content: '이것은 두 번째 게시글입니다.',
  },
  {
    id: '3',
    title: '세 번째 게시글',
    username: '애플1',
    content: '이것은 두 번째 게시글입니다.',
  },
  {
    id: '4',
    title: '네 번째 게시글',
    username: '애플1',
    content: '이것은 두 번째 게시글입니다.',
  },
  {
    id: '5',
    title: '다섯 번째 게시글',
    username: '애플1',
    content: '이것은 두 번째 게시글입니다.',
  },
  {
    id: '6',
    title: '첫 번째 게시글asdfasdfasdfasdfasdfasdfsdfas',
    username: '애플1',
    content: '이것은 첫 번째 게시글입니다.',
  },
  // {
  //   id: '7',
  //   title: '두 번째 게시글',
  //   username: '애플1',
  //   content: '이것은 두 번째 게시글입니다.',
  // },
  // {
  //   id: '8',
  //   title: '두 번째 게시글',
  //   username: '애플1',
  //   content: '이것은 두 번째 게시글입니다.',
  // },
  // {
  //   id: '9',
  //   title: '두 번째 게시글',
  //   username: '애플1',
  //   content: '이것은 두 번째 게시글입니다.',
  // },
  // {
  //   id: '10',
  //   title: '두 번째 게시글',
  //   username: '애플1',
  //   content: '이것은 두 번째 게시글입니다.',
  // },
];



export default function BoardPage() {
  const router = useRouter();

  const handleEdit = () => {
  router.push('/board/edit')
}

  return (
    <div className="h-screen">
      <div className="flex flex-col w-full max-w-lg h-full justify-center items-center">
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 ">
          {posts.map((post) => (
            <Link key={post.id} href={`/board/${post.id}`}>
              <PostCard
                title={post.title}
                username={post.username}
                content={post.content}
              />
            </Link>
          ))}
        </div>
        <div className="flex w-full h-[10%] justify-center items-center">
          <Pagination currentPage={2} totalPages={5} />
        </div>
        <div className="flex w-full justify-end">
          <div className="flex items-end">
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
    </div>
  );
}
