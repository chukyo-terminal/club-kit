// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
// 先ほど作成したコンポーネントを読み込む
import Sidebar from "../app/Sidebar";

export const metadata: Metadata = {
  title: "Club Kit",
  description: "Club Kit Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* h-screenで画面の高さを固定し、flexで横並びにする */}
      <body className="flex h-screen bg-gray-50 text-gray-900">
        {/* 左側のサイドバー */}
        <Sidebar />

        {/* 右側のメインコンテンツ（flex-1で残りの幅を埋める） */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </body>
    </html>
  );
}
