'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: '学习单词', path: '/' },
    { name: '上传单词', path: '/upload' },
    { name: '管理单词', path: '/manage' },
  ];
  
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          德语词汇学习
        </Link>
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-2 rounded-md ${
                pathname === item.path
                  ? 'bg-blue-800'
                  : 'hover:bg-blue-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 