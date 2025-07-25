import React from "react";

type PostCardProps = {
  id: string;
  title: string;
  username: string;
  content: string;
};

export const PostCard = React.memo(({ id, title, username, content }: PostCardProps) => {

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
