import Link from 'next/link';
import { PostCard } from '@/components/talk/PostCard';
import { Pagination } from '@/components/common/Pagination';

const posts = [
  { id: '1', title: '첫 번째 게시글', content: '이것은 첫 번째 게시글입니다.' },
  { id: '2', title: '두 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
  { id: '3', title: '세 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
  { id: '4', title: '네 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
  { id: '5', title: '다섯 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
  { id: '6', title: '첫 번째 게시글', content: '이것은 첫 번째 게시글입니다.' },
  { id: '7', title: '두 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
  { id: '8', title: '두 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
  { id: '9', title: '두 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
  { id: '10', title: '두 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
];

export default function BoardPage() {
  return (
    <div className="flex flex-col w-full max-w-lg h-screen justify-center items-center">
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 ">
        {posts.map((post) => (
          <Link key={post.id} href={`/talk/${post.id}`}>
            <PostCard title={post.title} content={post.content} />
          </Link>
        ))}
      </div>
      <div>
        <Pagination currentPage={2} totalPages={5} />
      </div>
    </div>
  );
}
