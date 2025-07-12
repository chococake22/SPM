import ItemPhoto from './ItemPhoto';
import ItemUserProfile from './ItemUserProfile';
import ItemValues from './ItemValues';
import ItemDescription from './ItemDescription';

interface Entry {
  imageInfo: string;
  username: string;
  profileImg: string;
  heartCnt: string;
  commentCnt: string;
  itemName: string;
  description: string;
  itemImg: string;
}

interface ItemBoxProps {
  entry: Entry;
  onClick?: (() => void);
}


const itemBox: React.FC<ItemBoxProps> = ({ entry }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-full h-full border-[1px]">
          <div className="h-[15%]">
            <ItemUserProfile
              userId={entry.username}
              profileImg={entry.profileImg}
            />
          </div>
          <div className="h-[55%]">
            <ItemPhoto imageInfo={entry.itemImg} />
          </div>

          <div className="h-[5vh]">
            <ItemValues
              heartCnt={entry.heartCnt}
              commentCnt={entry.commentCnt}
            />
          </div>
          <div className="h-[10%]">
            <ItemDescription
              itemName={entry.itemName}
              description={entry.description}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default itemBox;
