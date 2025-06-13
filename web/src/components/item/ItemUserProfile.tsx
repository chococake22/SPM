import UserPhoto from '../user/UserPhoto';

interface ItemUserProfileProps {
  profileImg: string;
  userId: string;
}


const itemUserProfile: React.FC<ItemUserProfileProps> = ({ profileImg, userId }) => {
  return (
    <div className="flex items-center w-full h-[5vh]">
      <div className="w-[12%] h-full">
        <div className="w-full h-full flex items-center justify-center">
          <UserPhoto imageInfo={profileImg} />
        </div>
      </div>
      <div>
        <span className="ml-2 text-xl">{userId}</span>
      </div>
    </div>
  );
};

export default itemUserProfile;
