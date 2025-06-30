import React, { useEffect } from "react";

type PostCardProps = {
  title: string;
  username: string;
  content: string;
};

export const PostCard = React.memo(({ title, username, content }: PostCardProps) => {
  // 리렌더링 확인용 로그
  console.log(`🔄 PostCard 렌더링 - ${title}`);

  useEffect(() => {
    console.log(`✅ PostCard 마운트 - ${title}`);
  }, []);

  return (
    <div className="w-full h-[160px] p-3 border rounded-lg hover:shadow-md transition bg-white cursor-pointer">
      <h2 className="text-xl font-semibold whitespace-normal break-words">
        {title}
      </h2>
      <span className="text-sm font-light">{username}</span>
      <p className="text-gray-600 line-clamp-2">{content}</p>
    </div>
  );
});

PostCard.displayName = 'PostCard';
