import Link from 'next/link';
import Image from 'next/image';

const BottomNav = () => {
  return (
    <div className="flex justify-center">
      <nav className="flex w-full h-14 justify-around gap-4 align-middle items-center max-w-lg shadow-[0_-1px_1px_rgba(0,0,0,0.08)]">
        <Link href="/" className="flex flex-col items-center">
          <Image
            src="/icons/home.svg"
            alt="Home"
            className="w-5 h-5 mr-1"
            width={4}
            height={4}
          />
          <span className="text-black">Home</span>
        </Link>
        <Link href="/item" className="flex flex-col items-center">
          <Image
            src="/icons/plus.svg"
            alt="ADD"
            className="w-5 h-5 mr-1"
            width={4}
            height={4}
          />
          <span className="text-black">Add</span>
        </Link>
        <Link href="/board" className="flex flex-col items-center">
          <Image
            src="/icons/board.svg"
            alt="Board"
            className="w-5 h-5 mr-1"
            width={4}
            height={4}
          />
          <span className="text-black">Board</span>
        </Link>
      </nav>
    </div>
  );
};

export default BottomNav;
