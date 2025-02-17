import Link from 'next/link';

const bottomNav = () => {
  return (
    <div className="border-t-2 fixed bg-slate-200 w-full h-[5%] bottom-0 shadow-lg shadow-slate-500/50">
      <div className="flex items-center justify-center h-full">
        <nav className="flex justify-evenly items-center w-full h-full">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/talk">Talk</Link>
          <Link href="/qna">Q&A</Link>
        </nav>
      </div>
    </div>
  );
};

export default bottomNav;
