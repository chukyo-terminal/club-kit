// src/components/Sidebar.tsx
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-900 p-6 text-white">
      <h2 className="mb-8 font-bold text-xl tracking-wider">Menu</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/" className="rounded p-2 transition-colors hover:bg-gray-800">
          ダッシュボード
        </Link>
        <Link href="/members" className="rounded p-2 transition-colors hover:bg-gray-800">
          メンバー管理
        </Link>
        <Link href="/settings" className="rounded p-2 transition-colors hover:bg-gray-800">
          設定
        </Link>
      </nav>
    </aside>
  );
}
