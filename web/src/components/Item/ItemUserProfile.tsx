interface ItemUserProfileProps {
  profileImg: string;
  userId: string;
}

const itemUserProfile: React.FC<ItemUserProfileProps> = ({ profileImg, userId }) => {
  return (
    <div className="w-full h-[10%] border-2 border-red-200">
      <div className="ml-2">
        {profileImg}
        <span className="ml-2">{userId}</span>
      </div>
    </div>
  );
};

export default itemUserProfile;
