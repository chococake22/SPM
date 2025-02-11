import ItemPhoto from './ItemPhoto';

interface Entry {
  item: string;
  userId: string;
}

interface ItemBoxProps {
  entry: Entry;
}

const itemBox: React.FC<ItemBoxProps> = ({ entry }) => {
  return (
    <div className="pt-3">
      <div className="flex justify-center w-full h-full">
        <div className="w-[80%] h-[600px] border-2 border-black">
          <ItemPhoto item={entry.item} />
        </div>
      </div>
    </div>
  );
};

export default itemBox;
