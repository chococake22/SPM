'use client';

import Image from 'next/image';

interface UserImageProps {
  imageInfo: string;
}

const UserPhoto: React.FC<UserImageProps> = ({ imageInfo }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const profilePath = process.env.NEXT_PUBLIC_USER_PROFILE_URL || '';
    const fullSrc = `${baseUrl}${profilePath}${imageInfo}`;

    console.log(baseUrl);
    console.log(profilePath);
    console.log(imageInfo);
    console.log('Full image src:', fullSrc);
  return <Image src={fullSrc} alt="Home" width={40} height={40} />;
};

export default UserPhoto;
