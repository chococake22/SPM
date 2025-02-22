interface ItemPhotoProps {
  imageInfo: string;
}

const itemPhoto: React.FC<ItemPhotoProps> = ({ imageInfo }) => {
  return (
    <div className="w-full h-[60%] border-2 border-black">
      <div className="w-full h-full">
        <img src={`/testImages/${imageInfo}`} alt={`${imageInfo}`} />
      </div>
    </div>
  );
};

export default itemPhoto;
