import Link from 'next/link';

const topNav = () => {
  return (
    <div>
      <nav className="flex justify-evenly border-b-2 align-middle items-center">
        <div className="w-[55%]">
          <Link href="/">
            <h3 className="text-3xl font-bold text-yellow-600">Coco</h3>
          </Link>
        </div>
        <div className="inline-block align-middle">
          <Link href="/mypage">My page</Link>
        </div>
        <div>
          <Link href="/settings">Settings</Link>
        </div>
      </nav>
    </div>
  );
};

export default topNav;
