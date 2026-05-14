'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">MathOdyssey</span>
            <span className="text-sm text-stone-500 hidden sm:inline">数学的发现之旅</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-stone-600 hover:text-blue-600 transition-colors">
              时间轴
            </Link>
            <Link href="/about" className="text-stone-600 hover:text-blue-600 transition-colors">
              关于
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
