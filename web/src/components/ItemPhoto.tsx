interface ItemPhotoProps {
  item: string;
}

const itemPhoto: React.FC<ItemPhotoProps> = ({ item }) => {
  return (
    <div className="w-full h-[60%] border-2 border-black">{item}</div>
  );
};

export default itemPhoto;
