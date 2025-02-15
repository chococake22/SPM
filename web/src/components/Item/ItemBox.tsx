import ItemPhoto from './ItemPhoto';
import ItemUserProfile from './ItemUserProfile';
import ItemValues from './ItemValues';
import ItemDescription from './ItemDescription';

interface Entry {
  imageInfo: string;
  userId: string;
  profileImg: string;
  heartCnt: string;
  commentCnt: string;
  itemName: string;
  description: string;
}

interface ItemBoxProps {
  entry: Entry;
}

const itemBox: React.FC<ItemBoxProps> = ({ entry }) => {
  return (
    <div className="pt-3">
      <div className="flex justify-center w-full h-full">
        <div className="w-[80%] h-[600px] border-2 border-black">
          <ItemUserProfile
            userId={entry.userId}
            profileImg={entry.profileImg}
          />
          <ItemPhoto imageInfo={entry.imageInfo} />
          <ItemValues heartCnt={entry.heartCnt} commentCnt={entry.commentCnt} />
          <ItemDescription
            itemName={entry.itemName}
            description={entry.description}
          />
        </div>
      </div>
    </div>
  );
};

export default itemBox;
