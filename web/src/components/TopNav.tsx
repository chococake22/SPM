"use client"

import LinkButton from './LinkButton';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react'

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <nav className="flex fixed w-full justify-evenly border-b-[1px] align-middle items-center bg-white max-w-lg">
        <div className="w-20">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex flex-col space-y-1">
              <div className="w-5 h-0.5 bg-gray-600"></div>
              <div className="w-5 h-0.5 bg-gray-600"></div>
              <div className="w-5 h-0.5 bg-gray-600"></div>
            </div>
          </button>
          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <Link href="/board" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                  📝 게시글
                </Link>
                <Link href="/item" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                  📦 아이템
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                  ⚙️ 설정
                </Link>
                <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors">
                  🚪 로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center flex-1">
          <LinkButton menu="/" />
        </div>

        <div className="flex items-center space-x-10 w-20 justify-end mr-1">
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
        </div>
      </nav>
    </div>
  );
};

export default TopNav;
