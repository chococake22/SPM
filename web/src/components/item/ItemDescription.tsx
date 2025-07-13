"use client"

import { useState } from "react";

interface ItemDescriptionProps {
  title: string;
  description: string;
}

const ItemDescription: React.FC<ItemDescriptionProps> = ({
  title,
  description,
}) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText((prev) => !prev);
  };

  
  return (
    <div className="w-full max-h-[200px]">
      <span className="ml-2">{title}</span>
      <div className="ml-2 line-clamp-7">
        <p
          className={`whitespace-normal break-words text-sm font-light ${showFullText ? '' : 'line-clamp-1'}`}
        >
          {description}
        </p>
        <button className="text-blue-500 text-xs" onClick={toggleText}>
          {showFullText ? '간략히' : '더보기'}
        </button>
      </div>
    </div>
  );
};

export default ItemDescription;
