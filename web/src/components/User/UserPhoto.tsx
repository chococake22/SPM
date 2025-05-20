import Image from "next/image";

interface UserImageProps {
  imageInfo: string;
}

const UserPhoto: React.FC<UserImageProps> = ({ imageInfo }) => {
  return (
    <Image
      src={imageInfo}
      alt="Home"
      width={40}
      height={40}
    />
  );
};

export default UserPhoto;
