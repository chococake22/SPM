type PostCardProps = {
  title: string;
  content: string;
};

export function PostCard({ title, content }: PostCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition bg-white cursor-pointer">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600 line-clamp-2">{content}</p>
    </div>
  );
}
