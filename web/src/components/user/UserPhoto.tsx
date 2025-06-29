'use client';

import Image from 'next/image';

interface UserImageProps {
  imageInfo: string;
  size?: 'small' | 'medium' | 'large';
}

const UserPhoto: React.FC<UserImageProps> = ({ imageInfo, size = 'small' }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const profilePath = process.env.NEXT_PUBLIC_USER_PROFILE_URL || '';
    const fullSrc = `${baseUrl}${profilePath}${imageInfo}`;

    const sizeMap = {
      small: { width: 40, height: 40 },
      medium: { width: 60, height: 60 },
      large: { width: 80, height: 80 },
    };

    const { width, height } = sizeMap[size];

    console.log(imageInfo);

  return <Image src={fullSrc} alt="User Profile" width={width} height={height} className="rounded-full" />;
};

export default UserPhoto;
