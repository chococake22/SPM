import Link from 'next/link';

const bottomNav = () => {
  return (
    <div className="border-t-2">
      <div className="flex items-center justify-center">
        <nav className="flex justify-evenly items-center w-full">
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
