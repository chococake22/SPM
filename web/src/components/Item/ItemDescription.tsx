"use client"

import { useState } from "react";

interface ItemDescriptionProps {
  itemName: string;
  description: string;
}

const ItemDescription: React.FC<ItemDescriptionProps> = ({
  itemName,
  description,
}) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText((prev) => !prev);
  };

  return (
    <div className="w-full max-h-[200px] border-2 border-green-700">
      <span className="ml-2">{itemName}</span>
      <div className="ml-2 line-clamp-4">
        <p
          className={`whitespace-normal break-words ${showFullText ? '' : 'line-clamp-1'}`}
        >
          {description}
        </p>
        <button className="text-blue-500" onClick={toggleText}>
          {showFullText ? '간략히' : '더보기'}
        </button>
      </div>
    </div>
  );
};

export default ItemDescription;
