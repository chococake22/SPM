import LinkButton from './LinkButton';
import Link from 'next/link';
import Image from 'next/image';

const topNav = () => {
  return (
    <div>
      <nav className="flex fixed w-full justify-evenly border-b-2 align-middle items-center bg-slate-100">
        <LinkButton menu="/" />
        <Link href="/mypage" className="flex items-center">
          <Image
            src="/icons/mypage.svg"
            alt="Mypage"
            className="w-6 h-6 mr-1"
            width={5}
            height={5}
          />
        </Link>
        <Link href="/settings" className="flex items-center">
          <Image
            src="/icons/settings.svg"
            alt="Settings"
            className="w-6 h-6 mr-1"
            width={5}
            height={5}
          />
        </Link>
      </nav>
    </div>
  );
};

export default topNav;
