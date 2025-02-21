import UserImage from "../User/UserPhoto";

interface ItemUserProfileProps {
  profileImg: string;
  userId: string;
}

const itemUserProfile: React.FC<ItemUserProfileProps> = ({ profileImg, userId }) => {
  return (
    <div className="flex items-center w-full h-[10%] border-2 border-red-200">
      <div className="flex ml-2 rounded-2xl">
        <UserImage imageInfo={profileImg} />
      </div>
      <div>
        <span className="ml-2">{userId}</span>
      </div>
    </div>
  );
};

export default itemUserProfile;
