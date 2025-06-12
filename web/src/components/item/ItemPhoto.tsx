'use client';

import { useState } from 'react';

interface ItemPhotoProps {
  imageInfo: string;
}

const ItemPhoto: React.FC<ItemPhotoProps> = ({ imageInfo }) => {
  const [isOpenedModal, setIsOpenedModal] = useState<string | null>(null);

  const openModal = (img: string) => {
    console.log("open: " + img)
    setIsOpenedModal(img);
  };
  
  const closeModal = () => {
    setIsOpenedModal(null);
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-full" onClick={() => openModal(imageInfo)}>
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_ITEM_IMAGE_URL}${imageInfo}`}
          alt={`${imageInfo}`}
          className="w-full h-full"
        />
      </div>
      {isOpenedModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div className="bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">
              &times;
            </button>
            <img
              src={`/testImages/${imageInfo}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPhoto;
