import Image from "next/image";

interface itemValuesProps {
  heartCnt: string;
  commentCnt: string;
}


const itemValues: React.FC<itemValuesProps> = ({ heartCnt, commentCnt }) => {
  return (
    <div className="flex items-center w-full h-full">
      <div className="flex ml-1">
        <span className="ml-1">
          <Image src="/icons/heart.svg" alt="heart" width={30} height={30} />
        </span>
        <span className="ml-1 text-xl">{heartCnt}</span>
        <span className="ml-4">
          <Image src="/icons/talk.svg" alt="heart" width={28} height={28} />
        </span>
        <span className="ml-l text-xl">{commentCnt}</span>
        <span className="ml-4 mt-1">
          <Image src="/icons/share.svg" alt="heart" width={20} height={20} />
        </span>
      </div>
    </div>
  );
};

export default itemValues;
