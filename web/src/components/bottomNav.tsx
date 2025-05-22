import Link from 'next/link';
import Image from 'next/image';

const bottomNav = () => {
  return (
    <div className="border-t-2 fixed bg-slate-200 w-full h-[5%] bottom-0 shadow-lg shadow-slate-500/50">
      <div className="flex items-center justify-center h-full">
        <nav className="flex justify-evenly items-center w-full h-full">
          <Link href="/" className="flex items-center">
            <Image
              src="/icons/home.svg"
              alt="Home"
              className="w-6 h-6 mr-1"
              width={5}
              height={5}
            />
          </Link>
          <Link href="/shop" className="flex items-center">
            <Image
              src="/icons/shop.svg"
              alt="Shop"
              className="w-6 h-6 mr-1"
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
    </div>
  );
};

export default bottomNav;
