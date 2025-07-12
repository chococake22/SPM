import ItemPhoto from './ItemPhoto';
import ItemUserProfile from './ItemUserProfile';
import ItemValues from './ItemValues';
import ItemDescription from './ItemDescription';

interface Entry {
  id: string;
  imageInfo: string;
  username: string;
  profileImg: string;
  heartCnt: string;
  commentCnt: string;
  itemName: string;
  description: string;
  itemImg: string;
  user: {
    username: string;
    profileImg: string;
    userId:string;
  };
}

interface ItemBoxProps {
  entry: Entry;
  onClick?: (() => void);
}


const itemBox: React.FC<ItemBoxProps> = ({ entry }) => {
  console.log("entry", entry.user.username);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-full h-full border-[1px]">
          <div className="h-[15%]">
            <ItemUserProfile
              username={entry.user.username}
              id={entry.id}
              profileImg={entry.user.profileImg}
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
