import Image from "next/image";

interface UserImageProps {
  imageInfo: string;
}

const UserImage: React.FC<UserImageProps> = ({ imageInfo }) => {
  return (
    <Image
      src={imageInfo}
      alt="Home"
      className="w-6 h-6 mr-1"
      width={5}
      height={5}
    />
  );
};

export default UserImage;
