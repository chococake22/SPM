import Link from 'next/link';
import Image from 'next/image';

const BottomNav = () => {
  return (
    <div>
      <nav className="flex w-full h-12 justify-evenly align-middle items-center bg-slate-100">
        <Link href="/" className="flex items-center">
          <Image
            src="/icons/home.svg"
            alt="Home"
            className="w-6 h-6 mr-1"
            width={5}
            height={5}
          />
        </Link>
        <Link href="/item" className="flex items-center">
          <Image
            src="/icons/plus.svg"
            alt="Shop"
            className="w-6 h-6 mr-1 stroke-black"
            width={5}
            height={5}
          />
        </Link>
        <Link href="/talk" className="flex items-center">
          <Image
            src="/icons/talk.svg"
            alt="Talk"
            className="w-6 h-6 mr-1"
            width={5}
            height={5}
          />
        </Link>
      </nav>
    </div>
  );
};

export default BottomNav;
