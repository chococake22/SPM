interface ItemPhotoProps {
  imageInfo: string;
}

const itemPhoto: React.FC<ItemPhotoProps> = ({ imageInfo }) => {
  return (
    <div className="w-full h-[60%] border-2 border-black">{imageInfo}</div>
  );
};

export default itemPhoto;
