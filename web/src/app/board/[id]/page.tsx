import { notFound } from 'next/navigation';

const posts = [
  { id: '1', title: '첫 번째 게시글', content: '이것은 첫 번째 게시글입니다.' },
  { id: '2', title: '두 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
];

type Props = {
  params: { id: string };
};

export default function PostDetail({ params }: Props) {
  const post = posts.find((p) => p.id === params.id);

  if (!post) return notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
}
